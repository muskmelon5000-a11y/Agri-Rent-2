import os
import random
import string
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from auth_utils import create_access_token, get_password_hash, verify_password
from dependencies import get_current_user
import models
import schemas

router = APIRouter(prefix="/auth", tags=["Authentication"])

DEV_MODE = os.getenv("DEV_MODE", "true").lower() == "true"


def generate_otp() -> str:
    return "".join(random.choices(string.digits, k=6))


@router.post("/send-otp", response_model=schemas.OTPResponse)
def send_otp(payload: schemas.SendOTPRequest, db: Session = Depends(get_db)):
    """Send OTP to a phone number. In DEV_MODE the OTP is returned in the response."""
    otp = generate_otp()
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)

    # Get or create user
    user = db.query(models.User).filter(models.User.phone == payload.phone).first()
    if not user:
        user = models.User(phone=payload.phone)
        db.add(user)

    user.otp_code = otp
    user.otp_expires_at = expires_at
    db.commit()

    # In production: integrate Twilio / MSG91 here
    # For now simulate SMS
    response = schemas.OTPResponse(message=f"OTP sent to +91 {payload.phone}")
    if DEV_MODE:
        response.dev_otp = otp  # visible in response during development
    return response


@router.post("/signup", response_model=schemas.TokenResponse)
def signup(payload: schemas.SignupRequest, db: Session = Depends(get_db)):
    """Verify OTP, set password, and return JWT token."""
    user = db.query(models.User).filter(models.User.phone == payload.phone).first()

    if not user:
        raise HTTPException(status_code=404, detail="Phone number not found. Send OTP first.")

    if not user.otp_code:
        raise HTTPException(status_code=400, detail="No OTP was sent to this number.")

    # Check expiry
    exp = user.otp_expires_at
    if exp and exp.tzinfo is None:
        exp = exp.replace(tzinfo=timezone.utc)
    if exp and datetime.now(timezone.utc) > exp:
        raise HTTPException(status_code=400, detail="OTP expired. Please request a new one.")

    # Check OTP
    if user.otp_code != payload.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP. Please try again.")

    # Update user details
    user.name = payload.name
    user.role = payload.role
    user.hashed_password = get_password_hash(payload.password)
    user.village = payload.village
    user.district = payload.district

    # Clear OTP
    user.otp_code = None
    user.otp_expires_at = None
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id), "role": user.role})

    return schemas.TokenResponse(
        access_token=token,
        user_id=user.id,
        role=user.role,
        name=user.name,
        is_new_user=True,
    )


@router.post("/login", response_model=schemas.TokenResponse)
def login(payload: schemas.LoginRequest, db: Session = Depends(get_db)):
    """Login with phone and password."""
    user = db.query(models.User).filter(models.User.phone == payload.phone).first()
    
    if not user or not user.hashed_password:
        raise HTTPException(status_code=401, detail="Invalid phone number or password.")
        
    if not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid phone number or password.")

    token = create_access_token({"sub": str(user.id), "role": user.role})
    
    return schemas.TokenResponse(
        access_token=token,
        user_id=user.id,
        role=user.role,
        name=user.name,
        is_new_user=False,
    )


@router.get("/me")
def get_me(current_user: models.User = Depends(get_current_user)):
    """Returns the currently authenticated user info."""
    return {
        "id": current_user.id,
        "phone": current_user.phone,
        "name": current_user.name,
        "role": current_user.role,
        "language": current_user.language,
        "village": current_user.village,
        "district": current_user.district,
        "skill_points": current_user.skill_points,
    }
