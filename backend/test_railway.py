import requests

url = "https://agri-rent-2-2yte-one.vercel.app/auth/send-otp"
data = {"email": "test@example.com"}

try:
    response = requests.post(url, json=data)
    print(response.status_code)
    print(response.text)
except Exception as e:
    print(e)
