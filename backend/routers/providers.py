import json
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends
from database import get_db
from dependencies import require_provider
import schemas
from google.cloud.firestore import Client

router = APIRouter(prefix="/provider", tags=["Provider"])

DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]


@router.get("/dashboard", response_model=schemas.ProviderDashboardOut)
def provider_dashboard(
    current_user: dict = Depends(require_provider),
    db: Client = Depends(get_db),
):
    now = datetime.now(timezone.utc)
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    # Use the denormalized equipment_owner_id from our bookings rewrite
    b_query = db.collection("bookings").where("equipment_owner_id", "==", current_user["id"]).stream()
    all_bookings = []
    for b in b_query:
        all_bookings.append(b.to_dict())

    # This month earnings
    month_earnings = 0.0
    for b in all_bookings:
        created_at = b.get("created_at")
        # Handle cases where created_at might be missing or older string
        if b.get("status") == "completed" and created_at and getattr(created_at, "replace", None):
            if created_at.replace(tzinfo=timezone.utc) >= month_start:
                month_earnings += b.get("total_amount", 0)

    # Last month earnings for % change
    # simple way to get last month start
    last_month_start = (month_start - timedelta(days=1)).replace(day=1)
    last_month_earnings = 0.0
    for b in all_bookings:
        created_at = b.get("created_at")
        if b.get("status") == "completed" and created_at and getattr(created_at, "replace", None):
            dt = created_at.replace(tzinfo=timezone.utc)
            if last_month_start <= dt < month_start:
                last_month_earnings += b.get("total_amount", 0)

    change_pct = 0.0
    if last_month_earnings > 0:
        change_pct = round(((month_earnings - last_month_earnings) / last_month_earnings) * 100, 1)

    active_rentals = sum(1 for b in all_bookings if b.get("status") == "active")
    completed_jobs = sum(1 for b in all_bookings if b.get("status") == "completed")
    pending_requests = sum(1 for b in all_bookings if b.get("status") == "pending")

    # Weekly chart (last 7 days)
    weekly_chart = []
    for i in range(6, -1, -1):
        day = now - timedelta(days=i)
        day_name = DAYS[day.weekday()]
        day_earnings = 0.0
        for b in all_bookings:
            created_at = b.get("created_at")
            if b.get("status") == "completed" and created_at and getattr(created_at, "date", None):
                if created_at.date() == day.date():
                    day_earnings += b.get("total_amount", 0)
        weekly_chart.append(schemas.EarningsDay(name=day_name, value=day_earnings))

    # Top performing machine
    eq_earnings = {}
    eq_rentals = {}
    for b in all_bookings:
        if b.get("status") == "completed":
            e_id = b.get("equipment_id")
            eq_earnings[e_id] = eq_earnings.get(e_id, 0) + b.get("total_amount", 0)
            eq_rentals[e_id] = eq_rentals.get(e_id, 0) + 1

    top_machine_id = None
    top_earnings = 0.0
    top_rentals = 0

    for e_id, earnings in eq_earnings.items():
        if earnings > top_earnings:
            top_earnings = earnings
            top_machine_id = e_id
            top_rentals = eq_rentals.get(e_id, 0)

    top_name = None
    top_image = None
    if top_machine_id:
        eq_doc = db.collection("equipment").document(top_machine_id).get()
        if eq_doc.exists:
            eq_data = eq_doc.to_dict()
            top_name = eq_data.get("name")
            images = eq_data.get("images", [])
            if isinstance(images, str):
                try: images = json.loads(images)
                except: images = []
            top_image = images[0] if images else None

    return schemas.ProviderDashboardOut(
        total_earnings_month=month_earnings,
        earnings_change_pct=change_pct,
        active_rentals=active_rentals,
        completed_jobs=completed_jobs,
        pending_requests=pending_requests,
        weekly_chart=weekly_chart,
        top_machine_name=top_name,
        top_machine_image=top_image,
        top_machine_earnings=top_earnings if top_machine_id else None,
        top_machine_rentals=top_rentals if top_machine_id else None,
    )


@router.get("/earnings/monthly")
def monthly_earnings(
    current_user: dict = Depends(require_provider),
    db: Client = Depends(get_db),
):
    """Return last 6 months earnings for EarningsReport chart."""
    now = datetime.now(timezone.utc)
    b_query = db.collection("bookings").where("equipment_owner_id", "==", current_user["id"]).where("status", "==", "completed").stream()
    
    bookings = [b.to_dict() for b in b_query]

    MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    result = []
    for i in range(5, -1, -1):
        target = now - timedelta(days=30 * i)
        month_earn = 0.0
        for b in bookings:
            created_at = b.get("created_at")
            if created_at and getattr(created_at, "month", None):
                if created_at.month == target.month and created_at.year == target.year:
                    month_earn += b.get("total_amount", 0)
        result.append({"name": MONTH_NAMES[target.month - 1], "value": month_earn})
    return result
