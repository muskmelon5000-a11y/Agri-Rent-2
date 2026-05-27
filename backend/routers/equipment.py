import json
import math
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from dependencies import get_current_user, require_provider
import models
import schemas

router = APIRouter(prefix="/equipment", tags=["Equipment"])


def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance between two lat/lng points in kilometres."""
    R = 6371
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def enrich(eq: models.Equipment, distance_km: Optional[float] = None) -> dict:
    data = {
        "id": eq.id,
        "owner_id": eq.owner_id,
        "name": eq.name,
        "type": eq.type,
        "brand": eq.brand,
        "model": eq.model,
        "hp": eq.hp,
        "year": eq.year,
        "description": eq.description,
        "price_per_day": eq.price_per_day,
        "price_per_hour": eq.price_per_hour,
        "latitude": eq.latitude,
        "longitude": eq.longitude,
        "village": eq.village,
        "district": eq.district,
        "is_available": eq.is_available,
        "images": json.loads(eq.images) if eq.images else [],
        "attachments": json.loads(eq.attachments) if eq.attachments else [],
        "rating": round(eq.rating, 1),
        "total_ratings": eq.total_ratings,
        "total_rentals": eq.total_rentals,
        "distance_km": round(distance_km, 2) if distance_km is not None else None,
        "owner_name": eq.owner.name if eq.owner else None,
    }
    return data


# ─── Nearby Equipment (20km radius) ──────────────────────────────────────────

@router.get("/nearby")
def get_nearby_equipment(
    lat: float = Query(..., description="User latitude"),
    lng: float = Query(..., description="User longitude"),
    radius_km: float = Query(20.0, description="Search radius in km"),
    equipment_type: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    available_only: bool = Query(True),
    db: Session = Depends(get_db),
):
    """Return all equipment within radius_km of (lat, lng), sorted by distance."""
    query = db.query(models.Equipment)
    if available_only:
        query = query.filter(models.Equipment.is_available == True)
    if equipment_type:
        query = query.filter(models.Equipment.type == equipment_type)
    if min_price is not None:
        query = query.filter(models.Equipment.price_per_day >= min_price)
    if max_price is not None:
        query = query.filter(models.Equipment.price_per_day <= max_price)

    all_eq = query.all()

    nearby = []
    for eq in all_eq:
        dist = haversine_km(lat, lng, eq.latitude, eq.longitude)
        if dist <= radius_km:
            nearby.append((eq, dist))

    nearby.sort(key=lambda x: x[1])
    return [enrich(eq, dist) for eq, dist in nearby]


# ─── Category Listing ─────────────────────────────────────────────────────────

@router.get("/category/{category}")
def get_by_category(
    category: str,
    lat: Optional[float] = Query(None),
    lng: Optional[float] = Query(None),
    db: Session = Depends(get_db),
):
    items = db.query(models.Equipment).filter(
        models.Equipment.type == category,
        models.Equipment.is_available == True
    ).all()
    result = []
    for eq in items:
        dist = haversine_km(lat, lng, eq.latitude, eq.longitude) if lat and lng else None
        result.append(enrich(eq, dist))
    return result


# ─── Search ───────────────────────────────────────────────────────────────────

@router.get("/search")
def search_equipment(
    q: str = Query(..., min_length=1),
    lat: Optional[float] = Query(None),
    lng: Optional[float] = Query(None),
    db: Session = Depends(get_db),
):
    items = db.query(models.Equipment).filter(
        models.Equipment.name.ilike(f"%{q}%") |
        models.Equipment.type.ilike(f"%{q}%") |
        models.Equipment.brand.ilike(f"%{q}%") |
        models.Equipment.village.ilike(f"%{q}%"),
        models.Equipment.is_available == True,
    ).all()
    result = []
    for eq in items:
        dist = haversine_km(lat, lng, eq.latitude, eq.longitude) if lat and lng else None
        result.append(enrich(eq, dist))
    return result


# ─── Single Equipment ─────────────────────────────────────────────────────────

@router.get("/{equipment_id}")
def get_equipment(equipment_id: int, db: Session = Depends(get_db)):
    eq = db.query(models.Equipment).filter(models.Equipment.id == equipment_id).first()
    if not eq:
        raise HTTPException(status_code=404, detail="Equipment not found")
    return enrich(eq)


# ─── Create Equipment (Provider only) ─────────────────────────────────────────

@router.post("/", status_code=201)
def create_equipment(
    payload: schemas.EquipmentCreate,
    current_user: models.User = Depends(require_provider),
    db: Session = Depends(get_db),
):
    eq = models.Equipment(**payload.model_dump(), owner_id=current_user.id)
    db.add(eq)
    db.commit()
    db.refresh(eq)
    return enrich(eq)


# ─── Update Equipment ─────────────────────────────────────────────────────────

@router.put("/{equipment_id}")
def update_equipment(
    equipment_id: int,
    payload: schemas.EquipmentUpdate,
    current_user: models.User = Depends(require_provider),
    db: Session = Depends(get_db),
):
    eq = db.query(models.Equipment).filter(
        models.Equipment.id == equipment_id,
        models.Equipment.owner_id == current_user.id
    ).first()
    if not eq:
        raise HTTPException(status_code=404, detail="Equipment not found or access denied")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(eq, field, value)
    db.commit()
    db.refresh(eq)
    return enrich(eq)


# ─── Delete Equipment ─────────────────────────────────────────────────────────

@router.delete("/{equipment_id}", status_code=204)
def delete_equipment(
    equipment_id: int,
    current_user: models.User = Depends(require_provider),
    db: Session = Depends(get_db),
):
    eq = db.query(models.Equipment).filter(
        models.Equipment.id == equipment_id,
        models.Equipment.owner_id == current_user.id
    ).first()
    if not eq:
        raise HTTPException(status_code=404, detail="Equipment not found or access denied")
    db.delete(eq)
    db.commit()


# ─── Provider's own equipment list ────────────────────────────────────────────

@router.get("/mine/list")
def my_equipment(
    current_user: models.User = Depends(require_provider),
    db: Session = Depends(get_db),
):
    items = db.query(models.Equipment).filter(
        models.Equipment.owner_id == current_user.id
    ).all()
    return [enrich(eq) for eq in items]

# ─── Get Equipment by Owner ───────────────────────────────────────────────────

@router.get("/owner/{owner_id}")
def get_equipment_by_owner(owner_id: int, db: Session = Depends(get_db)):
    items = db.query(models.Equipment).filter(
        models.Equipment.owner_id == owner_id,
        models.Equipment.is_available == True
    ).all()
    return [enrich(eq) for eq in items]


# ─── Toggle Availability ──────────────────────────────────────────────────────

@router.patch("/{equipment_id}/availability")
def toggle_availability(
    equipment_id: int,
    current_user: models.User = Depends(require_provider),
    db: Session = Depends(get_db),
):
    eq = db.query(models.Equipment).filter(
        models.Equipment.id == equipment_id,
        models.Equipment.owner_id == current_user.id
    ).first()
    if not eq:
        raise HTTPException(status_code=404, detail="Equipment not found")
    eq.is_available = not eq.is_available
    db.commit()
    return {"id": eq.id, "is_available": eq.is_available}
