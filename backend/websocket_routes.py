import json
import asyncio
from typing import Dict, Set
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, Query
from sqlalchemy.orm import Session
from database import get_db
from auth_utils import decode_token
import models

router = APIRouter(tags=["WebSocket"])

# booking_id -> set of connected WebSocket clients
active_connections: Dict[int, Set[WebSocket]] = {}


async def broadcast_booking_update(booking_id: int, data: dict):
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
    booking_id: int,
    token: str = Query(...),
    db: Session = Depends(get_db),
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

    user_id = int(payload.get("sub", 0))
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking:
        await websocket.close(code=4004)
        return

    await websocket.accept()

    # Register connection
    if booking_id not in active_connections:
        active_connections[booking_id] = set()
    active_connections[booking_id].add(websocket)

    # Send current status immediately on connect
    await websocket.send_json({
        "type": "status_update",
        "booking_id": booking_id,
        "status": booking.status,
        "message": f"Booking is currently {booking.status}",
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
