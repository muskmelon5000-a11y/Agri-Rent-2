from pydantic import BaseModel, field_validator
from typing import Optional, List
from datetime import datetime


# ─── Auth ────────────────────────────────────────────────────────────────────

class SendOTPRequest(BaseModel):
    email: str

    @field_validator("email")
    @classmethod
    def validate_email(cls, v):
        v = v.strip().lower()
        if "@" not in v:
            raise ValueError("Must be a valid email address")
        return v


class SignupRequest(BaseModel):
    email: str
    name: str
    password: str
    role: str = "seeker"
    otp: str
    village: Optional[str] = None
    district: Optional[str] = None
    phone: Optional[str] = None

    @field_validator("email")
    @classmethod
    def validate_email(cls, v):
        v = v.strip().lower()
        if "@" not in v:
            raise ValueError("Must be a valid email address")
        return v

    @field_validator("password")
    @classmethod
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters")
        return v


class LoginRequest(BaseModel):
    email: str
    password: str

    @field_validator("email")
    @classmethod
    def validate_email(cls, v):
        v = v.strip().lower()
        if "@" not in v:
            raise ValueError("Must be a valid email address")
        return v


class VerifyOTPRequest(BaseModel):
    email: str
    otp: str
    role: Optional[str] = "seeker"   # seeker | provider
    name: Optional[str] = None

    @field_validator("email")
    @classmethod
    def validate_email(cls, v):
        v = v.strip().lower()
        if "@" not in v:
            raise ValueError("Must be a valid email address")
        return v

    @field_validator("otp")
    @classmethod
    def validate_otp(cls, v):
        return v.strip()


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    role: str
    name: Optional[str]
    is_new_user: bool


class OTPResponse(BaseModel):
    message: str
    dev_otp: Optional[str] = None   # Only in DEV_MODE


# ─── User ─────────────────────────────────────────────────────────────────────

class UserBase(BaseModel):
    name: Optional[str] = None
    language: Optional[str] = "en"
    village: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    profile_image: Optional[str] = None


class UserUpdate(UserBase):
    pass


class UserOut(UserBase):
    id: str
    email: str
    phone: Optional[str] = None
    role: str
    skill_points: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ─── Equipment ────────────────────────────────────────────────────────────────

class EquipmentBase(BaseModel):
    name: str
    type: str = "tractor"
    brand: Optional[str] = None
    model: Optional[str] = None
    hp: Optional[int] = None
    year: Optional[int] = None
    description: Optional[str] = None
    price_per_day: float = 1200.0
    price_per_hour: Optional[float] = None
    latitude: float = 23.0225
    longitude: float = 72.5714
    village: Optional[str] = None
    district: Optional[str] = None
    is_available: bool = True
    images: Optional[str] = None
    attachments: Optional[str] = None


class EquipmentCreate(EquipmentBase):
    pass


class EquipmentUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    brand: Optional[str] = None
    model: Optional[str] = None
    hp: Optional[int] = None
    description: Optional[str] = None
    price_per_day: Optional[float] = None
    price_per_hour: Optional[float] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    village: Optional[str] = None
    district: Optional[str] = None
    is_available: Optional[bool] = None
    images: Optional[str] = None


class EquipmentOut(EquipmentBase):
    id: str
    owner_id: str
    rating: float
    total_ratings: int
    total_rentals: int
    created_at: Optional[datetime] = None
    distance_km: Optional[float] = None       # populated in nearby queries
    owner_name: Optional[str] = None
    owner_phone: Optional[str] = None

    class Config:
        from_attributes = True


# ─── Booking ──────────────────────────────────────────────────────────────────

class BookingCreate(BaseModel):
    equipment_id: str
    start_date: str
    end_date: str
    total_days: int
    delivery_type: str = "pickup"
    delivery_address: Optional[str] = None
    estimated_area: Optional[float] = None
    estimated_hours: Optional[float] = None
    notes: Optional[str] = None
    attachments_requested: Optional[str] = None


class BookingStatusUpdate(BaseModel):
    status: str   # accepted | rejected | active | completed | cancelled


class BookingOut(BaseModel):
    id: str
    seeker_id: str
    equipment_id: str
    start_date: str
    end_date: str
    total_days: int
    total_amount: float
    status: str
    delivery_type: str
    delivery_address: Optional[str] = None
    estimated_area: Optional[float] = None
    notes: Optional[str] = None
    created_at: Optional[datetime] = None
    # Joined fields
    equipment_name: Optional[str] = None
    equipment_image: Optional[str] = None
    seeker_name: Optional[str] = None
    seeker_phone: Optional[str] = None
    owner_name: Optional[str] = None
    owner_phone: Optional[str] = None

    class Config:
        from_attributes = True


# ─── Review ───────────────────────────────────────────────────────────────────

class ReviewCreate(BaseModel):
    booking_id: str
    equipment_id: str
    rating: float
    comment: Optional[str] = None


class ReviewOut(ReviewCreate):
    id: str
    reviewer_id: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ─── Provider Dashboard ───────────────────────────────────────────────────────

class EarningsDay(BaseModel):
    name: str
    value: float


class ProviderDashboardOut(BaseModel):
    total_earnings_month: float
    earnings_change_pct: float
    active_rentals: int
    completed_jobs: int
    pending_requests: int
    weekly_chart: List[EarningsDay]
    top_machine_name: Optional[str] = None
    top_machine_image: Optional[str] = None
    top_machine_earnings: Optional[float] = None
    top_machine_rentals: Optional[int] = None
