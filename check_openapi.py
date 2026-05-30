import requests
import random

res = requests.get(f"https://agrirent-backend-v5xi.onrender.com/openapi.json?rand={random.randint(1, 10000)}")
data = res.json()
props = data.get("components", {}).get("schemas", {}).get("BookingOut", {}).get("properties", {})
print("seeker_phone in BookingOut:", "seeker_phone" in props)
print("owner_phone in BookingOut:", "owner_phone" in props)
