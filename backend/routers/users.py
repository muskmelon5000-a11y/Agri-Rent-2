from fastapi import APIRouter, Depends, HTTPException
from database import get_db
from dependencies import get_current_user
import schemas
from google.cloud.firestore import Client

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=schemas.UserOut)
def get_my_profile(
    current_user: dict = Depends(get_current_user),
    db: Client = Depends(get_db),
):
    return current_user


@router.put("/me", response_model=schemas.UserOut)
def update_my_profile(
    payload: schemas.UserUpdate,
    current_user: dict = Depends(get_current_user),
    db: Client = Depends(get_db),
):
    user_ref = db.collection("users").document(current_user["id"])
    updates = payload.model_dump(exclude_unset=True)
    if updates:
        user_ref.update(updates)
        current_user.update(updates)
    if "skill_points" not in current_user or current_user["skill_points"] is None:
        current_user["skill_points"] = 0
    return current_user


@router.get("/{user_id}")
def get_user_public(user_id: str, db: Client = Depends(get_db)):
    """Public profile — shown on OwnerProfile screen."""
    user_ref = db.collection("users").document(user_id)
    user_doc = user_ref.get()
    if not user_doc.exists:
        raise HTTPException(status_code=404, detail="User not found")
        
    user_data = user_doc.to_dict()

    # Count equipment
    eq_query = db.collection("equipment").where("owner_id", "==", user_id).stream()
    eq_count = 0
    equipment_ids = []
    for eq in eq_query:
        eq_count += 1
        equipment_ids.append(eq.id)

    # Count completed bookings for this owner's equipment
    completed = 0
    if equipment_ids:
        # Firestore 'in' queries are limited to 10 items.
        # For a robust solution, you'd need to paginate or store a counter on the user document.
        # But for this rewrite, we'll do simple chunking.
        chunks = [equipment_ids[x:x+10] for x in range(0, len(equipment_ids), 10)]
        for chunk in chunks:
            bookings = db.collection("bookings").where("equipment_id", "in", chunk).where("status", "==", "completed").stream()
            for b in bookings:
                completed += 1

    created_at = user_data.get("created_at")
    joined_year = created_at.year if created_at else None

    return {
        "id": user_doc.id,
        "name": user_data.get("name"),
        "role": user_data.get("role"),
        "village": user_data.get("village"),
        "district": user_data.get("district"),
        "skill_points": user_data.get("skill_points", 0),
        "profile_image": user_data.get("profile_image"),
        "equipment_count": eq_count,
        "completed_jobs": completed,
        "joined_year": joined_year,
    }


@router.get("/leaderboard/village")
def get_village_leaderboard(
    current_user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """Get the top contributors in the user's village"""
    village = current_user.get("village")
    if not village:
        village = "Anandpur" # Fallback if user has no village

    top_users_query = db.collection("users").where("village", "==", village).order_by("skill_points", direction="DESCENDING").limit(10).stream()

    result = []
    rank = 1
    for u_doc in top_users_query:
        u_data = u_doc.to_dict()
        u_id = u_doc.id
        
        # Approximate completed jobs for leader
        rentals = 0
        eq_query = db.collection("equipment").where("owner_id", "==", u_id).stream()
        eq_ids = [eq.id for eq in eq_query]
        if eq_ids:
            chunks = [eq_ids[x:x+10] for x in range(0, len(eq_ids), 10)]
            for chunk in chunks:
                b_query = db.collection("bookings").where("equipment_id", "in", chunk).where("status", "==", "completed").stream()
                for b in b_query:
                    rentals += 1

        result.append({
            "rank": rank,
            "id": u_id,
            "name": u_data.get("name", "User"),
            "points": u_data.get("skill_points", 0),
            "rentals": rentals,
            "isMe": u_id == current_user["id"]
        })
        rank += 1

    return {"village": village, "leaders": result}
