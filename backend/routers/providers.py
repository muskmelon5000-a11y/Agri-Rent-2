import json
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session
from database import get_db
from dependencies import require_provider
import models
import schemas

router = APIRouter(prefix="/provider", tags=["Provider"])

DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]


@router.get("/dashboard", response_model=schemas.ProviderDashboardOut)
def provider_dashboard(
    current_user: models.User = Depends(require_provider),
    db: Session = Depends(get_db),
):
    now = datetime.now(timezone.utc)
    month_start = now.replace(day=1, hour=0, minute=0, second=0)

    # All bookings for provider's equipment
    provider_eq_ids = [
        eq.id for eq in db.query(models.Equipment.id)
        .filter(models.Equipment.owner_id == current_user.id).all()
    ]

    all_bookings = db.query(models.Booking).filter(
        models.Booking.equipment_id.in_(provider_eq_ids)
    ).all()

    # This month earnings
    month_earnings = sum(
        b.total_amount for b in all_bookings
        if b.status == "completed" and b.created_at and b.created_at >= month_start
    )

    # Last month earnings for % change
    last_month_start = (month_start - timedelta(days=1)).replace(day=1)
    last_month_earnings = sum(
        b.total_amount for b in all_bookings
        if b.status == "completed"
        and b.created_at
        and last_month_start <= b.created_at < month_start
    )
    change_pct = 0.0
    if last_month_earnings > 0:
        change_pct = round(((month_earnings - last_month_earnings) / last_month_earnings) * 100, 1)

    active_rentals = sum(1 for b in all_bookings if b.status == "active")
    completed_jobs = sum(1 for b in all_bookings if b.status == "completed")
    pending_requests = sum(1 for b in all_bookings if b.status == "pending")

    # Weekly chart (last 7 days)
    weekly_chart = []
    for i in range(6, -1, -1):
        day = now - timedelta(days=i)
        day_name = DAYS[day.weekday()]
        day_earnings = sum(
            b.total_amount for b in all_bookings
            if b.status == "completed"
            and b.created_at
            and b.created_at.date() == day.date()
        )
        weekly_chart.append(schemas.EarningsDay(name=day_name, value=day_earnings))

    # Top performing machine
    top_machine = None
    top_earnings = 0.0
    top_rentals = 0

    for eq_id in provider_eq_ids:
        eq_bookings = [b for b in all_bookings if b.equipment_id == eq_id and b.status == "completed"]
        earnings = sum(b.total_amount for b in eq_bookings)
        if earnings > top_earnings:
            top_earnings = earnings
            top_rentals = len(eq_bookings)
            top_machine = db.query(models.Equipment).filter(models.Equipment.id == eq_id).first()

    top_name = top_machine.name if top_machine else None
    top_image = None
    if top_machine and top_machine.images:
        imgs = json.loads(top_machine.images)
        top_image = imgs[0] if imgs else None

    return schemas.ProviderDashboardOut(
        total_earnings_month=month_earnings,
        earnings_change_pct=change_pct,
        active_rentals=active_rentals,
        completed_jobs=completed_jobs,
        pending_requests=pending_requests,
        weekly_chart=weekly_chart,
        top_machine_name=top_name,
        top_machine_image=top_image,
        top_machine_earnings=top_earnings if top_machine else None,
        top_machine_rentals=top_rentals if top_machine else None,
    )


@router.get("/earnings/monthly")
def monthly_earnings(
    current_user: models.User = Depends(require_provider),
    db: Session = Depends(get_db),
):
    """Return last 6 months earnings for EarningsReport chart."""
    now = datetime.now(timezone.utc)
    provider_eq_ids = [
        eq.id for eq in db.query(models.Equipment.id)
        .filter(models.Equipment.owner_id == current_user.id).all()
    ]
    bookings = db.query(models.Booking).filter(
        models.Booking.equipment_id.in_(provider_eq_ids),
        models.Booking.status == "completed",
    ).all()

    MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    result = []
    for i in range(5, -1, -1):
        target = now - timedelta(days=30 * i)
        month_earn = sum(
            b.total_amount for b in bookings
            if b.created_at and b.created_at.month == target.month
            and b.created_at.year == target.year
        )
        result.append({"name": MONTH_NAMES[target.month - 1], "value": month_earn})
    return result
