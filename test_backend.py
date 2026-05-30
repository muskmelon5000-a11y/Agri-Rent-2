import requests

# Send OTP
url_send = "https://agrirent-backend-v5xi.onrender.com/auth/send-otp"
res_send = requests.post(url_send, json={"phone": "9999988888"})
otp = res_send.json().get("dev_otp", "123456")

print("OTP:", otp)

# Signup
url_signup = "https://agrirent-backend-v5xi.onrender.com/auth/signup"
res_signup = requests.post(url_signup, json={
    "phone": "9999988888",
    "otp": otp,
    "password": "password123",
    "name": "Test User",
    "role": "seeker",
    "village": "TestVillage",
    "district": "TestDistrict"
})

print("Signup:", res_signup.status_code, res_signup.text)

token = res_signup.json().get("access_token")

# Get Me
url_me = "https://agrirent-backend-v5xi.onrender.com/auth/me"
res_me = requests.get(url_me, headers={"Authorization": f"Bearer {token}"})

print("Me:", res_me.status_code, res_me.text)
