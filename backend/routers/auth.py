import os
import random
import string
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException
from database import get_db
from auth_utils import create_access_token, get_password_hash, verify_password
from dependencies import get_current_user
import schemas
from google.cloud.firestore import Client
import rest_db

router = APIRouter(prefix="/auth", tags=["Authentication"])

DEV_MODE = os.getenv("DEV_MODE", "true").lower() == "true"

def generate_otp() -> str:
    return "".join(random.choices(string.digits, k=6))

@router.post("/send-otp", response_model=schemas.OTPResponse)
def send_otp(payload: schemas.SendOTPRequest, db: Client = Depends(get_db)):
    """Send OTP to an email. In DEV_MODE the OTP is returned in the response."""
    try:
        otp = generate_otp()
        expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)

        if os.getenv("VERCEL") == "1":
            user_doc = rest_db.get_user_by_email(payload.email)
            if not user_doc:
                rest_db.create_user(payload.email, otp, expires_at)
            else:
                rest_db.update_user(user_doc["id"], {"otp_code": otp, "otp_expires_at": expires_at.isoformat().replace("+00:00", "Z")})
        else:
            users_ref = db.collection("users")
            query = users_ref.where("email", "==", payload.email).limit(1).get()
            
            user_doc = None
            for doc in query:
                user_doc = doc
                break
            
            if not user_doc:
                # Create new user
                new_user_data = {
                    "email": payload.email,
                    "created_at": datetime.now(timezone.utc),
                    "otp_code": otp,
                    "otp_expires_at": expires_at,
                    "role": "seeker"
                }
                users_ref.add(new_user_data)
            else:
                # Update existing user
                user_doc.reference.update({
                    "otp_code": otp,
                    "otp_expires_at": expires_at
                })

        # In production: integrate SendGrid / Postmark / Mailgun here
        response = schemas.OTPResponse(message=f"OTP sent to {payload.email}")
        if DEV_MODE:
            response.dev_otp = otp  # visible in response during development
        return response
    except Exception as e:
        import traceback
        raise HTTPException(status_code=500, detail=f"Vercel Error: {str(e)} - {traceback.format_exc()}")

@router.post("/signup", response_model=schemas.TokenResponse)
def signup(payload: schemas.SignupRequest, db: Client = Depends(get_db)):
    """Verify OTP, set password, and return JWT token."""
    if os.getenv("VERCEL") == "1":
        user_data = rest_db.get_user_by_email(payload.email)
        if not user_data:
            raise HTTPException(status_code=404, detail="Email not found. Send OTP first.")
        user_id = user_data["id"]
        
        # Verify OTP
        if "otp_code" not in user_data or not user_data["otp_code"]:
            raise HTTPException(status_code=400, detail="No OTP was sent to this email.")
            
        if user_data["otp_code"] != payload.otp:
            raise HTTPException(status_code=400, detail="Invalid OTP. Please try again.")
            
        rest_db.update_user(user_id, {
            "name": payload.name,
            "role": payload.role,
            "hashed_password": get_password_hash(payload.password),
            "village": payload.village,
            "district": payload.district,
            "phone": payload.phone,
            "otp_code": None,
            "otp_expires_at": None
        })
    else:
        users_ref = db.collection("users")
        query = users_ref.where("email", "==", payload.email).limit(1).get()
        
        user_doc = None
        for doc in query:
            user_doc = doc
            break

        if not user_doc:
            raise HTTPException(status_code=404, detail="Email not found. Send OTP first.")

        user_data = user_doc.to_dict()
        user_id = user_doc.id

        if "otp_code" not in user_data or not user_data["otp_code"]:
            raise HTTPException(status_code=400, detail="No OTP was sent to this email.")

        # Check expiry
        exp = user_data.get("otp_expires_at")
        if exp:
            if datetime.now(timezone.utc) > exp:
                raise HTTPException(status_code=400, detail="OTP expired. Please request a new one.")

        # Check OTP
        if user_data["otp_code"] != payload.otp:
            raise HTTPException(status_code=400, detail="Invalid OTP. Please try again.")

        # Update user details
        user_doc.reference.update({
            "name": payload.name,
            "role": payload.role,
            "hashed_password": get_password_hash(payload.password),
            "village": payload.village,
            "district": payload.district,
            "phone": payload.phone,
            "otp_code": None,
            "otp_expires_at": None
        })

    token = create_access_token({"sub": user_id, "role": payload.role})

    return schemas.TokenResponse(
        access_token=token,
        user_id=user_id,
        role=payload.role,
        name=payload.name,
        is_new_user=True,
    )

@router.post("/login", response_model=schemas.TokenResponse)
def login(payload: schemas.LoginRequest, db: Client = Depends(get_db)):
    """Login with email and password."""
    if os.getenv("VERCEL") == "1":
        user_data = rest_db.get_user_by_email(payload.email)
        if not user_data:
            raise HTTPException(status_code=401, detail="Invalid email or password.")
        user_id = user_data["id"]
    else:
        users_ref = db.collection("users")
        query = users_ref.where("email", "==", payload.email).limit(1).get()
        
        user_doc = None
        for doc in query:
            user_doc = doc
            break
        
        if not user_doc:
            raise HTTPException(status_code=401, detail="Invalid email or password.")
            
        user_data = user_doc.to_dict()
        user_id = user_doc.id

    hashed_password = user_data.get("hashed_password")
    
    if not hashed_password or not verify_password(payload.password, hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    role = user_data.get("role", "seeker")
    token = create_access_token({"sub": user_id, "role": role})
    
    return schemas.TokenResponse(
        access_token=token,
        user_id=user_id,
        role=role,
        name=user_data.get("name"),
        is_new_user=False,
    )

@router.get("/me")
def get_me(current_user: dict = Depends(get_current_user)):
    """Returns the currently authenticated user info."""
    return {
        "id": current_user.get("id"),
        "email": current_user.get("email"),
        "phone": current_user.get("phone"),
        "name": current_user.get("name"),
        "role": current_user.get("role"),
        "language": current_user.get("language"),
        "village": current_user.get("village"),
        "district": current_user.get("district"),
        "skill_points": current_user.get("skill_points", 0),
    }
