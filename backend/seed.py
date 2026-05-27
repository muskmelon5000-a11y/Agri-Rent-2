"""
Seed script — populates the DB with demo users, equipment around
Ahmedabad, Gujarat (lat 23.0225, lng 72.5714) for testing the 20km map.

Run: python seed.py
"""
import json
import sys
from database import engine, SessionLocal, Base
import models

Base.metadata.create_all(bind=engine)

db = SessionLocal()


def seed():
    # ── Clear tables ──────────────────────────────────────────────────────────
    db.query(models.Review).delete()
    db.query(models.Booking).delete()
    db.query(models.Equipment).delete()
    db.query(models.User).delete()
    db.commit()

    # ── Users ─────────────────────────────────────────────────────────────────
    seeker1 = models.User(
        phone="9876543210", name="Ramesh Kumar", role="seeker",
        language="hi", village="Anandpur", district="Kheda",
        state="Gujarat", latitude=23.0225, longitude=72.5714, skill_points=120
    )
    provider1 = models.User(
        phone="9988776655", name="Suresh Patel", role="provider",
        language="hi", village="Bavla", district="Ahmedabad",
        state="Gujarat", latitude=22.9650, longitude=72.4200, skill_points=380
    )
    provider2 = models.User(
        phone="9112233445", name="Priya Sharma", role="provider",
        language="gu", village="Dholka", district="Ahmedabad",
        state="Gujarat", latitude=22.7200, longitude=72.4600, skill_points=210
    )
    provider3 = models.User(
        phone="8855664422", name="Mahesh Verma", role="provider",
        language="hi", village="Sanand", district="Ahmedabad",
        state="Gujarat", latitude=22.9900, longitude=72.3800, skill_points=95
    )
    db.add_all([seeker1, provider1, provider2, provider3])
    db.commit()

    # ── Equipment ─────────────────────────────────────────────────────────────
    TRACTOR_IMG = json.dumps([
        "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800",
        "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800"
    ])
    DRONE_IMG = json.dumps([
        "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800"
    ])
    HARVESTER_IMG = json.dumps([
        "https://images.unsplash.com/photo-1589395937772-6d5c0e7e2a7f?w=800"
    ])
    TOOL_IMG = json.dumps([
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800"
    ])

    equipment_list = [
        models.Equipment(
            owner_id=provider1.id, name="Mahindra 575 DI", type="tractor",
            brand="Mahindra", model="575 DI", hp=47, year=2021,
            description="Well-maintained 47HP tractor ideal for ploughing and rotavation.",
            price_per_day=1200, price_per_hour=150,
            latitude=22.9600, longitude=72.4100,
            village="Bavla", district="Ahmedabad",
            images=TRACTOR_IMG,
            attachments=json.dumps(["Plough", "Rotavator"]),
            rating=4.8, total_ratings=32, total_rentals=45, is_available=True
        ),
        models.Equipment(
            owner_id=provider1.id, name="John Deere 5050D", type="tractor",
            brand="John Deere", model="5050D", hp=50, year=2022,
            description="50HP tractor with power steering. Perfect for large fields.",
            price_per_day=1500, price_per_hour=200,
            latitude=22.9700, longitude=72.4300,
            village="Bavla", district="Ahmedabad",
            images=TRACTOR_IMG,
            attachments=json.dumps(["Plough"]),
            rating=4.9, total_ratings=18, total_rentals=22, is_available=True
        ),
        models.Equipment(
            owner_id=provider2.id, name="DJI Agras T40 Drone", type="drone",
            brand="DJI", model="Agras T40", hp=None, year=2023,
            description="Agricultural drone for precision spraying. 40kg payload.",
            price_per_day=3500, price_per_hour=500,
            latitude=22.7300, longitude=72.4700,
            village="Dholka", district="Ahmedabad",
            images=DRONE_IMG,
            attachments=json.dumps(["Spray Tank"]),
            rating=4.7, total_ratings=12, total_rentals=15, is_available=True
        ),
        models.Equipment(
            owner_id=provider2.id, name="Claas Crop Tiger 30 Terra", type="harvester",
            brand="Claas", model="Crop Tiger 30", hp=30, year=2020,
            description="Mini harvester ideal for small to medium wheat fields.",
            price_per_day=2800, price_per_hour=350,
            latitude=22.7100, longitude=72.4400,
            village="Dholka", district="Ahmedabad",
            images=HARVESTER_IMG,
            attachments=json.dumps([]),
            rating=4.6, total_ratings=9, total_rentals=11, is_available=True
        ),
        models.Equipment(
            owner_id=provider3.id, name="Sonalika Rotavator 5ft", type="implement",
            brand="Sonalika", model="RT-5", hp=None, year=2022,
            description="5-foot rotavator attachment. Rents with or without tractor.",
            price_per_day=600, price_per_hour=80,
            latitude=22.9950, longitude=72.3900,
            village="Sanand", district="Ahmedabad",
            images=TOOL_IMG,
            attachments=json.dumps([]),
            rating=4.5, total_ratings=6, total_rentals=8, is_available=True
        ),
        models.Equipment(
            owner_id=provider3.id, name="Power Weeder (Honda)", type="tool",
            brand="Honda", model="FJ500", hp=5, year=2021,
            description="Lightweight power weeder for inter-row cultivation.",
            price_per_day=400, price_per_hour=60,
            latitude=22.9850, longitude=72.3700,
            village="Sanand", district="Ahmedabad",
            images=TOOL_IMG,
            attachments=json.dumps([]),
            rating=4.3, total_ratings=4, total_rentals=6, is_available=True
        ),
        models.Equipment(
            owner_id=provider1.id, name="Eicher 380 Tractor", type="tractor",
            brand="Eicher", model="380", hp=38, year=2019,
            description="Compact 38HP tractor. Great for small plots.",
            price_per_day=900, price_per_hour=120,
            latitude=22.9500, longitude=72.3950,
            village="Changodar", district="Ahmedabad",
            images=TRACTOR_IMG,
            attachments=json.dumps(["Cultivator"]),
            rating=4.4, total_ratings=14, total_rentals=20, is_available=False
        ),
    ]
    db.add_all(equipment_list)
    db.commit()

    print("Database seeded successfully!")
    print(f"   Users   : {db.query(models.User).count()}")
    print(f"   Equipment: {db.query(models.Equipment).count()}")
    print()
    print("📱 Demo login credentials (DEV_MODE=true — OTP returned in response):")
    print("   Seeker  : 9876543210  (Ramesh Kumar)")
    print("   Provider: 9988776655  (Suresh Patel)")


if __name__ == "__main__":
    seed()
    db.close()
