import requests

res = requests.post("http://127.0.0.1:8000/auth/signup", json={
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
})
print(res.status_code)
print(res.text)
