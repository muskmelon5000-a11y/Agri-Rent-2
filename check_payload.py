import requests
url_login = "https://agrirent-backend-v5xi.onrender.com/auth/login"
res = requests.post(url_login, json={"phone": "9999988888", "password": "password"}).json()
print("login", res)
token = res.get("access_token")
if token:
    url_req = "https://agrirent-backend-v5xi.onrender.com/bookings/provider"
    res_req = requests.get(url_req, headers={"Authorization": f"Bearer {token}"})
    print("bookings", res_req.json())
