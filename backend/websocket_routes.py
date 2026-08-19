import json
import asyncio
from typing import Dict, Set
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, Query
from database import get_db
from auth_utils import decode_token
from google.cloud.firestore import Client

router = APIRouter(tags=["WebSocket"])

# booking_id -> set of connected WebSocket clients
active_connections: Dict[str, Set[WebSocket]] = {}


async def broadcast_booking_update(booking_id: str, data: dict):
    """Send a JSON message to all clients watching this booking."""
    if booking_id in active_connections:
        dead = set()
        for ws in active_connections[booking_id]:
            try:
                await ws.send_json(data)
            except Exception:
                dead.add(ws)
        active_connections[booking_id] -= dead


@router.websocket("/ws/bookings/{booking_id}")
async def booking_ws(
    websocket: WebSocket,
    booking_id: str,
    token: str = Query(...),
    db: Client = Depends(get_db),
):
    """
    WebSocket endpoint for real-time booking status updates.
    Connect with: ws://localhost:8000/ws/bookings/{id}?token=<jwt>
    """
    # Authenticate
    payload = decode_token(token)
    if not payload:
        await websocket.close(code=4001)
        return

    b_doc = db.collection("bookings").document(booking_id).get()
    if not b_doc.exists:
        await websocket.close(code=4004)
        return

    b_data = b_doc.to_dict()

    await websocket.accept()

    # Register connection
    if booking_id not in active_connections:
        active_connections[booking_id] = set()
    active_connections[booking_id].add(websocket)

    # Send current status immediately on connect
    await websocket.send_json({
        "type": "status_update",
        "booking_id": booking_id,
        "status": b_data.get("status"),
        "message": f"Booking is currently {b_data.get('status')}",
    })

    try:
        while True:
            # Keep connection alive; server pushes updates via broadcast_booking_update
            data = await asyncio.wait_for(websocket.receive_text(), timeout=30)
            # Echo ping/pong
            if data == "ping":
                await websocket.send_text("pong")
    except (WebSocketDisconnect, asyncio.TimeoutError):
        pass
    finally:
        if booking_id in active_connections:
            active_connections[booking_id].discard(websocket)
