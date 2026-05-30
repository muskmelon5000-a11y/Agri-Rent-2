import json
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from dependencies import get_current_user, require_provider, require_seeker
import models
import schemas
from websocket_routes import broadcast_booking_update

router = APIRouter(prefix="/bookings", tags=["Bookings"])


def enrich_booking(b: models.Booking) -> dict:
    eq = b.equipment
    images = json.loads(eq.images) if eq and eq.images else []
    return {
        "id": b.id,
        "seeker_id": b.seeker_id,
        "equipment_id": b.equipment_id,
        "start_date": b.start_date,
        "end_date": b.end_date,
        "total_days": b.total_days,
        "total_amount": b.total_amount,
        "status": b.status,
        "delivery_type": b.delivery_type,
        "delivery_address": b.delivery_address,
        "estimated_area": b.estimated_area,
        "notes": b.notes,
        "created_at": b.created_at,
        "equipment_name": eq.name if eq else None,
        "equipment_image": images[0] if images else None,
        "seeker_name": b.seeker.name if b.seeker else None,
        "seeker_phone": b.seeker.phone if b.seeker else None,
        "owner_name": eq.owner.name if eq and eq.owner else None,
        "owner_phone": eq.owner.phone if eq and eq.owner else None,
        "equipment_price_per_day": eq.price_per_day if eq else None,
        "equipment_village": eq.village if eq else None,
    }


# ─── Create Booking (Seeker) ──────────────────────────────────────────────────

@router.post("/", status_code=201)
def create_booking(
    payload: schemas.BookingCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    eq = db.query(models.Equipment).filter(models.Equipment.id == payload.equipment_id).first()
    if not eq:
        raise HTTPException(status_code=404, detail="Equipment not found")
    if not eq.is_available:
        raise HTTPException(status_code=400, detail="Equipment is not available")

    total_amount = eq.price_per_day * payload.total_days

    booking = models.Booking(
        seeker_id=current_user.id,
        equipment_id=payload.equipment_id,
        start_date=payload.start_date,
        end_date=payload.end_date,
        total_days=payload.total_days,
        total_amount=total_amount,
        status="pending",
        delivery_type=payload.delivery_type,
        delivery_address=payload.delivery_address,
        estimated_area=payload.estimated_area,
        estimated_hours=payload.estimated_hours,
        notes=payload.notes,
        attachments_requested=payload.attachments_requested,
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return enrich_booking(booking)


# ─── Seeker's Bookings ────────────────────────────────────────────────────────

@router.get("/my")
def seeker_bookings(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    bookings = db.query(models.Booking).filter(
        models.Booking.seeker_id == current_user.id
    ).order_by(models.Booking.created_at.desc()).all()
    return [enrich_booking(b) for b in bookings]


# ─── Provider's Incoming Requests ─────────────────────────────────────────────

@router.get("/provider")
def provider_bookings(
    current_user: models.User = Depends(require_provider),
    db: Session = Depends(get_db),
):
    # Get all bookings for equipment owned by this provider
    bookings = (
        db.query(models.Booking)
        .join(models.Equipment, models.Booking.equipment_id == models.Equipment.id)
        .filter(models.Equipment.owner_id == current_user.id)
        .order_by(models.Booking.created_at.desc())
        .all()
    )
    return [enrich_booking(b) for b in bookings]


# ─── Single Booking Detail ────────────────────────────────────────────────────

@router.get("/{booking_id}")
def get_booking(
    booking_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    b = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not b:
        raise HTTPException(status_code=404, detail="Booking not found")
    # Only seeker or equipment owner can view
    is_owner = b.equipment and b.equipment.owner_id == current_user.id
    if b.seeker_id != current_user.id and not is_owner:
        raise HTTPException(status_code=403, detail="Access denied")
    return enrich_booking(b)


# ─── Update Booking Status ────────────────────────────────────────────────────

@router.patch("/{booking_id}/status")
async def update_booking_status(
    booking_id: int,
    payload: schemas.BookingStatusUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    b = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not b:
        raise HTTPException(status_code=404, detail="Booking not found")

    # Providers can accept/reject/complete; seekers can cancel
    is_owner = b.equipment and b.equipment.owner_id == current_user.id
    is_seeker = b.seeker_id == current_user.id

    allowed_provider = {"accepted", "rejected", "active", "completed"}
    allowed_seeker = {"cancelled"}

    if is_owner and payload.status in allowed_provider:
        b.status = payload.status
    elif is_seeker and payload.status in allowed_seeker:
        b.status = payload.status
    else:
        raise HTTPException(status_code=403, detail="Not allowed to perform this status change")

    db.commit()
    db.refresh(b)
    
    # Broadcast the update
    await broadcast_booking_update(booking_id, {
        "type": "status_update",
        "booking_id": booking_id,
        "status": b.status,
        "message": f"Booking status changed to {b.status}"
    })
    
    return enrich_booking(b)


# ─── Cancel Booking (Seeker) ──────────────────────────────────────────────────

@router.delete("/{booking_id}/cancel")
def cancel_booking(
    booking_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    b = db.query(models.Booking).filter(
        models.Booking.id == booking_id,
        models.Booking.seeker_id == current_user.id
    ).first()
    if not b:
        raise HTTPException(status_code=404, detail="Booking not found")
    if b.status not in {"pending", "accepted"}:
        raise HTTPException(status_code=400, detail="Cannot cancel a booking that is active or completed")
    b.status = "cancelled"
    db.commit()
    return {"message": "Booking cancelled successfully"}
