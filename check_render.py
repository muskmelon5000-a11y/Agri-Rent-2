import requests
import random

def get_token(phone, role):
    requests.post("https://agrirent-backend-v5xi.onrender.com/auth/send-otp", json={"phone": phone})
    otp = requests.post("https://agrirent-backend-v5xi.onrender.com/auth/send-otp", json={"phone": phone}).json().get("dev_otp")
    res = requests.post("https://agrirent-backend-v5xi.onrender.com/auth/signup", json={
        "phone": phone, "name": f"Test {role}", "role": role, "password": "password", "otp": otp, "village": "v", "district": "d"
    }).json()
    return res.get("access_token")

prov_phone = f"88{random.randint(10000000, 99999999)}"
seek_phone = f"99{random.randint(10000000, 99999999)}"

prov_token = get_token(prov_phone, "provider")
seek_token = get_token(seek_phone, "seeker")

# Provider creates eq
eq_payload = {
    "name": "Test Tractor",
    "type": "tractor",
    "price_per_day": 1000,
    "latitude": 20.0,
    "longitude": 70.0
}
eq = requests.post("https://agrirent-backend-v5xi.onrender.com/equipment", json=eq_payload, headers={"Authorization": f"Bearer {prov_token}"}).json()
eq_id = eq["id"]

# Seeker books eq
book_payload = {
    "equipment_id": eq_id,
    "start_date": "2026-05-30",
    "end_date": "2026-05-31",
    "total_days": 2
}
book = requests.post("https://agrirent-backend-v5xi.onrender.com/bookings", json=book_payload, headers={"Authorization": f"Bearer {seek_token}"}).json()
print("Seeker booked:", "seeker_phone" in book, book.get("seeker_phone"))

# Provider views bookings
reqs = requests.get("https://agrirent-backend-v5xi.onrender.com/bookings/provider", headers={"Authorization": f"Bearer {prov_token}"}).json()
print("Provider sees:", "seeker_phone" in reqs[0] if reqs else False, reqs[0].get("seeker_phone") if reqs else None)
