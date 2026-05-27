# Agri-Rent Backend

FastAPI backend for the Agri-Rent agricultural equipment rental platform.

## Setup & Run

### 1. Create Python virtual environment
```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Seed the database with demo data
```bash
python seed.py
```

### 4. Start the API server
```bash
uvicorn main:app --reload --port 8000
```

API will be available at: http://localhost:8000  
Interactive docs: http://localhost:8000/docs

---

## Demo Login (DEV_MODE)

Since `DEV_MODE=true` in `.env`, the OTP is returned directly in the API response — no SMS needed.

| Role     | Phone      | Name          |
|----------|------------|---------------|
| Seeker   | 9876543210 | Ramesh Kumar  |
| Provider | 9988776655 | Suresh Patel  |

**Flow:**
1. `POST /auth/send-otp` → get `dev_otp` from response
2. `POST /auth/verify-otp` → get `access_token`
3. Use token as `Authorization: Bearer <token>`

---

## Key Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/send-otp` | Send OTP to phone |
| POST | `/auth/verify-otp` | Verify OTP → JWT |
| GET | `/equipment/nearby?lat=&lng=&radius_km=20` | 20km radius search |
| GET | `/equipment/category/{type}` | Filter by type |
| POST | `/equipment/` | Add equipment (provider) |
| POST | `/bookings/` | Create booking |
| GET | `/bookings/my` | Seeker's bookings |
| GET | `/bookings/provider` | Provider's requests |
| PATCH | `/bookings/{id}/status` | Accept/reject/complete |
| GET | `/provider/dashboard` | Provider stats |
| GET | `/users/me` | Current user profile |
| WS | `/ws/bookings/{id}?token=` | Real-time booking updates |
