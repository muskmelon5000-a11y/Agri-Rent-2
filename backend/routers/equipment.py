import json
import math
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from database import get_db
from dependencies import get_current_user, require_provider
import schemas
from google.cloud.firestore import Client
import datetime

router = APIRouter(prefix="/equipment", tags=["Equipment"])

def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance between two lat/lng points in kilometres."""
    R = 6371
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def enrich(eq_doc_id: str, eq_data: dict, db: Client, distance_km: Optional[float] = None) -> dict:
    owner_id = eq_data.get("owner_id")
    owner_name = None
    owner_phone = None
    if owner_id:
        owner_doc = db.collection("users").document(owner_id).get()
        if owner_doc.exists:
            owner_data = owner_doc.to_dict()
            owner_name = owner_data.get("name")
            owner_phone = owner_data.get("phone")

    images = eq_data.get("images", [])
    if isinstance(images, str):
        try: images = json.loads(images)
        except: images = []
        
    attachments = eq_data.get("attachments", [])
    if isinstance(attachments, str):
        try: attachments = json.loads(attachments)
        except: attachments = []

    return {
        "id": eq_doc_id,
        "owner_id": owner_id,
        "name": eq_data.get("name"),
        "type": eq_data.get("type"),
        "brand": eq_data.get("brand"),
        "model": eq_data.get("model"),
        "hp": eq_data.get("hp"),
        "year": eq_data.get("year"),
        "description": eq_data.get("description"),
        "price_per_day": eq_data.get("price_per_day"),
        "price_per_hour": eq_data.get("price_per_hour"),
        "latitude": eq_data.get("latitude"),
        "longitude": eq_data.get("longitude"),
        "village": eq_data.get("village"),
        "district": eq_data.get("district"),
        "is_available": eq_data.get("is_available", True),
        "images": images,
        "attachments": attachments,
        "rating": round(eq_data.get("rating", 0.0), 1),
        "total_ratings": eq_data.get("total_ratings", 0),
        "total_rentals": eq_data.get("total_rentals", 0),
        "distance_km": round(distance_km, 2) if distance_km is not None else None,
        "owner_name": owner_name,
        "owner_phone": owner_phone,
    }


@router.get("/nearby")
def get_nearby_equipment(
    lat: float = Query(..., description="User latitude"),
    lng: float = Query(..., description="User longitude"),
    radius_km: float = Query(20.0, description="Search radius in km"),
    equipment_type: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    available_only: bool = Query(True),
    db: Client = Depends(get_db),
):
    """Return all equipment within radius_km of (lat, lng), sorted by distance."""
    query = db.collection("equipment")
    if available_only:
        query = query.where("is_available", "==", True)
    if equipment_type:
        query = query.where("type", "==", equipment_type)
    if min_price is not None:
        query = query.where("price_per_day", ">=", min_price)
    
    # Firestore doesn't allow multiple inequalities on different fields, but here it's the same field.
    if max_price is not None:
        query = query.where("price_per_day", "<=", max_price)

    all_eq = query.stream()

    nearby = []
    for eq_doc in all_eq:
        eq_data = eq_doc.to_dict()
        eq_lat = eq_data.get("latitude")
        eq_lng = eq_data.get("longitude")
        if eq_lat is not None and eq_lng is not None:
            dist = haversine_km(lat, lng, eq_lat, eq_lng)
            if dist <= radius_km:
                nearby.append((eq_doc, eq_data, dist))

    nearby.sort(key=lambda x: x[2])
    return [enrich(doc.id, data, db, dist) for doc, data, dist in nearby]


@router.get("/category/{category}")
def get_by_category(
    category: str,
    lat: Optional[float] = Query(None),
    lng: Optional[float] = Query(None),
    db: Client = Depends(get_db),
):
    query = db.collection("equipment").where("type", "==", category).where("is_available", "==", True)
    items = query.stream()
    
    result = []
    for eq_doc in items:
        eq_data = eq_doc.to_dict()
        dist = None
        eq_lat = eq_data.get("latitude")
        eq_lng = eq_data.get("longitude")
        if lat and lng and eq_lat is not None and eq_lng is not None:
            dist = haversine_km(lat, lng, eq_lat, eq_lng)
        result.append(enrich(eq_doc.id, eq_data, db, dist))
    return result


@router.get("/search")
def search_equipment(
    q: str = Query(..., min_length=1),
    lat: Optional[float] = Query(None),
    lng: Optional[float] = Query(None),
    db: Client = Depends(get_db),
):
    # Firestore does not support full-text search easily.
    # We will fetch all available and filter in memory since dataset is small.
    items = db.collection("equipment").where("is_available", "==", True).stream()
    q = q.lower()
    
    result = []
    for eq_doc in items:
        eq_data = eq_doc.to_dict()
        match = False
        for field in ["name", "type", "brand", "village"]:
            val = eq_data.get(field)
            if val and q in str(val).lower():
                match = True
                break
                
        if match:
            dist = None
            eq_lat = eq_data.get("latitude")
            eq_lng = eq_data.get("longitude")
            if lat and lng and eq_lat is not None and eq_lng is not None:
                dist = haversine_km(lat, lng, eq_lat, eq_lng)
            result.append(enrich(eq_doc.id, eq_data, db, dist))
    return result


@router.get("/{equipment_id}")
def get_equipment(equipment_id: str, db: Client = Depends(get_db)):
    eq_doc = db.collection("equipment").document(equipment_id).get()
    if not eq_doc.exists:
        raise HTTPException(status_code=404, detail="Equipment not found")
    return enrich(eq_doc.id, eq_doc.to_dict(), db)


@router.post("/", status_code=201)
def create_equipment(
    payload: schemas.EquipmentCreate,
    current_user: dict = Depends(require_provider),
    db: Client = Depends(get_db),
):
    eq_data = payload.model_dump()
    eq_data["owner_id"] = current_user["id"]
    eq_data["rating"] = 0.0
    eq_data["total_ratings"] = 0
    eq_data["total_rentals"] = 0
    eq_data["created_at"] = datetime.datetime.now(datetime.timezone.utc)
    
    _, doc_ref = db.collection("equipment").add(eq_data)
    
    return enrich(doc_ref.id, eq_data, db)


@router.put("/{equipment_id}")
def update_equipment(
    equipment_id: str,
    payload: schemas.EquipmentUpdate,
    current_user: dict = Depends(require_provider),
    db: Client = Depends(get_db),
):
    eq_ref = db.collection("equipment").document(equipment_id)
    eq_doc = eq_ref.get()
    
    if not eq_doc.exists or eq_doc.to_dict().get("owner_id") != current_user["id"]:
        raise HTTPException(status_code=404, detail="Equipment not found or access denied")
        
    updates = payload.model_dump(exclude_unset=True)
    if updates:
        eq_ref.update(updates)
        
    updated_doc = eq_ref.get()
    return enrich(updated_doc.id, updated_doc.to_dict(), db)


@router.delete("/{equipment_id}", status_code=204)
def delete_equipment(
    equipment_id: str,
    current_user: dict = Depends(require_provider),
    db: Client = Depends(get_db),
):
    eq_ref = db.collection("equipment").document(equipment_id)
    eq_doc = eq_ref.get()
    
    if not eq_doc.exists or eq_doc.to_dict().get("owner_id") != current_user["id"]:
        raise HTTPException(status_code=404, detail="Equipment not found or access denied")
        
    eq_ref.delete()


@router.get("/mine/list")
def my_equipment(
    current_user: dict = Depends(require_provider),
    db: Client = Depends(get_db),
):
    items = db.collection("equipment").where("owner_id", "==", current_user["id"]).stream()
    return [enrich(doc.id, doc.to_dict(), db) for doc in items]


@router.get("/owner/{owner_id}")
def get_equipment_by_owner(owner_id: str, db: Client = Depends(get_db)):
    items = db.collection("equipment").where("owner_id", "==", owner_id).where("is_available", "==", True).stream()
    return [enrich(doc.id, doc.to_dict(), db) for doc in items]


@router.patch("/{equipment_id}/availability")
def toggle_availability(
    equipment_id: str,
    current_user: dict = Depends(require_provider),
    db: Client = Depends(get_db),
):
    eq_ref = db.collection("equipment").document(equipment_id)
    eq_doc = eq_ref.get()
    
    if not eq_doc.exists or eq_doc.to_dict().get("owner_id") != current_user["id"]:
        raise HTTPException(status_code=404, detail="Equipment not found")
        
    current_avail = eq_doc.to_dict().get("is_available", True)
    eq_ref.update({"is_available": not current_avail})
    
    return {"id": eq_doc.id, "is_available": not current_avail}
