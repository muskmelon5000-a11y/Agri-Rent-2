import requests

res = requests.post("http://127.0.0.1:8000/auth/send-otp", json={
    "email": "test@example.com"
})
print(res.status_code)
print(res.text)
