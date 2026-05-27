from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from dependencies import get_current_user
import models
import schemas

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=schemas.UserOut)
def get_my_profile(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return current_user


@router.put("/me", response_model=schemas.UserOut)
def update_my_profile(
    payload: schemas.UserUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(current_user, field, value)
    db.commit()
    db.refresh(current_user)
    return current_user


@router.get("/{user_id}")
def get_user_public(user_id: int, db: Session = Depends(get_db)):
    """Public profile — shown on OwnerProfile screen."""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Count equipment, completed bookings
    eq_count = db.query(models.Equipment).filter(models.Equipment.owner_id == user_id).count()
    completed = (
        db.query(models.Booking)
        .join(models.Equipment, models.Booking.equipment_id == models.Equipment.id)
        .filter(models.Equipment.owner_id == user_id, models.Booking.status == "completed")
        .count()
    )
    return {
        "id": user.id,
        "name": user.name,
        "role": user.role,
        "village": user.village,
        "district": user.district,
        "skill_points": user.skill_points,
        "profile_image": user.profile_image,
        "equipment_count": eq_count,
        "completed_jobs": completed,
        "joined_year": user.created_at.year if user.created_at else None,
    }


@router.get("/leaderboard/village")
def get_village_leaderboard(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get the top contributors in the user's village"""
    village = current_user.village
    if not village:
        village = "Anandpur" # Fallback if user has no village

    top_users = db.query(models.User).filter(
        models.User.village == village
    ).order_by(models.User.skill_points.desc()).limit(10).all()

    result = []
    for rank, u in enumerate(top_users, start=1):
        rentals = (
            db.query(models.Booking)
            .join(models.Equipment, models.Booking.equipment_id == models.Equipment.id)
            .filter(models.Equipment.owner_id == u.id, models.Booking.status == "completed")
            .count()
        )
        result.append({
            "rank": rank,
            "id": u.id,
            "name": u.name or "User",
            "points": u.skill_points,
            "rentals": rentals,
            "isMe": u.id == current_user.id
        })
    return {"village": village, "leaders": result}
