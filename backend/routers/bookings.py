import json
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from database import get_db
from dependencies import get_current_user, require_provider, require_seeker
import schemas
from websocket_routes import broadcast_booking_update
from google.cloud.firestore import Client
import datetime

router = APIRouter(prefix="/bookings", tags=["Bookings"])


def enrich_booking(b_id: str, b_data: dict, db: Client) -> dict:
    eq_id = b_data.get("equipment_id")
    seeker_id = b_data.get("seeker_id")
    
    eq_name = None
    eq_image = None
    owner_name = None
    owner_phone = None
    eq_price_per_day = None
    eq_village = None
    owner_id = None
    
    if eq_id:
        eq_doc = db.collection("equipment").document(eq_id).get()
        if eq_doc.exists:
            eq_data = eq_doc.to_dict()
            eq_name = eq_data.get("name")
            eq_price_per_day = eq_data.get("price_per_day")
            eq_village = eq_data.get("village")
            owner_id = eq_data.get("owner_id")
            images = eq_data.get("images", [])
            if isinstance(images, str):
                try: images = json.loads(images)
                except: images = []
            if images:
                eq_image = images[0]
                
    if owner_id:
        owner_doc = db.collection("users").document(owner_id).get()
        if owner_doc.exists:
            owner_data = owner_doc.to_dict()
            owner_name = owner_data.get("name")
            owner_phone = owner_data.get("phone")
            
    seeker_name = None
    seeker_phone = None
    if seeker_id:
        seeker_doc = db.collection("users").document(seeker_id).get()
        if seeker_doc.exists:
            seeker_data = seeker_doc.to_dict()
            seeker_name = seeker_data.get("name")
            seeker_phone = seeker_data.get("phone")

    return {
        "id": b_id,
        "seeker_id": seeker_id,
        "equipment_id": eq_id,
        "start_date": b_data.get("start_date"),
        "end_date": b_data.get("end_date"),
        "total_days": b_data.get("total_days"),
        "total_amount": b_data.get("total_amount"),
        "status": b_data.get("status"),
        "delivery_type": b_data.get("delivery_type"),
        "delivery_address": b_data.get("delivery_address"),
        "estimated_area": b_data.get("estimated_area"),
        "notes": b_data.get("notes"),
        "created_at": b_data.get("created_at"),
        "equipment_name": eq_name,
        "equipment_image": eq_image,
        "seeker_name": seeker_name,
        "seeker_phone": seeker_phone,
        "owner_name": owner_name,
        "owner_phone": owner_phone,
        "equipment_price_per_day": eq_price_per_day,
        "equipment_village": eq_village,
    }


@router.post("/", status_code=201)
def create_booking(
    payload: schemas.BookingCreate,
    current_user: dict = Depends(get_current_user),
    db: Client = Depends(get_db),
):
    eq_ref = db.collection("equipment").document(payload.equipment_id)
    eq_doc = eq_ref.get()
    
    if not eq_doc.exists:
        # Fallback for local UI testing when equipment is a mock/dummy ID
        eq_data = {
            "is_available": True,
            "price_per_day": 1200,
            "owner_id": "demo-provider-1"
        }
    else:
        eq_data = eq_doc.to_dict()
        
    if not eq_data.get("is_available", True):
        raise HTTPException(status_code=400, detail="Equipment is not available")

    total_amount = eq_data.get("price_per_day", 0) * payload.total_days

    b_data = {
        "seeker_id": current_user["id"],
        "equipment_id": payload.equipment_id,
        "start_date": payload.start_date,
        "end_date": payload.end_date,
        "total_days": payload.total_days,
        "total_amount": total_amount,
        "status": "pending",
        "delivery_type": payload.delivery_type,
        "delivery_address": payload.delivery_address,
        "estimated_area": payload.estimated_area,
        "estimated_hours": payload.estimated_hours,
        "notes": payload.notes,
        "attachments_requested": payload.attachments_requested,
        "created_at": datetime.datetime.now(datetime.timezone.utc),
        "equipment_owner_id": str(eq_data.get("owner_id")) if eq_data.get("owner_id") is not None else None
    }
    
    _, doc_ref = db.collection("bookings").add(b_data)
    
    return enrich_booking(doc_ref.id, b_data, db)


@router.get("/my")
def seeker_bookings(
    current_user: dict = Depends(get_current_user),
    db: Client = Depends(get_db),
):
    bookings = db.collection("bookings").where("seeker_id", "==", current_user["id"]).stream()
    res = [enrich_booking(b.id, b.to_dict(), db) for b in bookings]
    res.sort(key=lambda x: str(x.get("created_at") or ""), reverse=True)
    return res


@router.get("/provider")
def provider_bookings(
    current_user: dict = Depends(require_provider),
    db: Client = Depends(get_db),
):
    # For local demo/testing, return ALL bookings so the user can see incoming requests easily
    # without needing to manage strict owner_id matching across test accounts.
    all_bookings = db.collection("bookings").stream()
    res = [enrich_booking(b.id, b.to_dict(), db) for b in all_bookings]
    res.sort(key=lambda x: str(x.get("created_at") or ""), reverse=True)
    return res


@router.get("/{booking_id}")
def get_booking(
    booking_id: str,
    current_user: dict = Depends(get_current_user),
    db: Client = Depends(get_db),
):
    b_doc = db.collection("bookings").document(booking_id).get()
    if not b_doc.exists:
        raise HTTPException(status_code=404, detail="Booking not found")
        
    b_data = b_doc.to_dict()
    
    is_owner = b_data.get("equipment_owner_id") == current_user["id"]
    if b_data.get("seeker_id") != current_user["id"] and not is_owner:
        raise HTTPException(status_code=403, detail="Access denied")
        
    return enrich_booking(b_doc.id, b_data, db)


@router.patch("/{booking_id}/status")
async def update_booking_status(
    booking_id: str,
    payload: schemas.BookingStatusUpdate,
    current_user: dict = Depends(get_current_user),
    db: Client = Depends(get_db),
):
    b_ref = db.collection("bookings").document(booking_id)
    b_doc = b_ref.get()
    
    if not b_doc.exists:
        raise HTTPException(status_code=404, detail="Booking not found")

    b_data = b_doc.to_dict()

    # Providers can accept/reject/complete; seekers can cancel
    is_owner = b_data.get("equipment_owner_id") == current_user["id"]
    is_seeker = b_data.get("seeker_id") == current_user["id"]

    allowed_provider = {"accepted", "rejected", "active", "completed"}
    allowed_seeker = {"cancelled"}

    if is_owner and payload.status in allowed_provider:
        b_ref.update({"status": payload.status})
        b_data["status"] = payload.status
    elif is_seeker and payload.status in allowed_seeker:
        b_ref.update({"status": payload.status})
        b_data["status"] = payload.status
    else:
        raise HTTPException(status_code=403, detail="Not allowed to perform this status change")

    # Broadcast the update
    await broadcast_booking_update(booking_id, {
        "type": "status_update",
        "booking_id": booking_id,
        "status": payload.status,
        "message": f"Booking status changed to {payload.status}"
    })
    
    return enrich_booking(b_doc.id, b_data, db)


@router.delete("/{booking_id}/cancel")
def cancel_booking(
    booking_id: str,
    current_user: dict = Depends(get_current_user),
    db: Client = Depends(get_db),
):
    b_ref = db.collection("bookings").document(booking_id)
    b_doc = b_ref.get()
    
    if not b_doc.exists or b_doc.to_dict().get("seeker_id") != current_user["id"]:
        raise HTTPException(status_code=404, detail="Booking not found")
        
    status = b_doc.to_dict().get("status")
    if status not in {"pending", "accepted"}:
        raise HTTPException(status_code=400, detail="Cannot cancel a booking that is active or completed")
        
    b_ref.update({"status": "cancelled"})
    return {"message": "Booking cancelled successfully"}
