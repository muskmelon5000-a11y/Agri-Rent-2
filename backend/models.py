from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum


class UserRole(str, enum.Enum):
    seeker = "seeker"
    provider = "provider"


class BookingStatus(str, enum.Enum):
    pending = "pending"
    accepted = "accepted"
    active = "active"
    completed = "completed"
    cancelled = "cancelled"
    rejected = "rejected"


class EquipmentType(str, enum.Enum):
    tractor = "tractor"
    harvester = "harvester"
    drone = "drone"
    implement = "implement"
    tool = "tool"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    phone = Column(String(15), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=True)
    role = Column(String(20), default="seeker")
    language = Column(String(10), default="en")
    village = Column(String(100), nullable=True)
    district = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    profile_image = Column(String(255), nullable=True)
    hashed_password = Column(String(255), nullable=True)
    skill_points = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # OTP storage (in production, use Redis)
    otp_code = Column(String(6), nullable=True)
    otp_expires_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    equipment = relationship("Equipment", back_populates="owner")
    bookings_as_seeker = relationship("Booking", back_populates="seeker", foreign_keys="Booking.seeker_id")
    reviews_given = relationship("Review", back_populates="reviewer", foreign_keys="Review.reviewer_id")


class Equipment(Base):
    __tablename__ = "equipment"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(150), nullable=False)
    type = Column(String(30), nullable=False)
    brand = Column(String(100), nullable=True)
    model = Column(String(100), nullable=True)
    hp = Column(Integer, nullable=True)
    year = Column(Integer, nullable=True)
    description = Column(Text, nullable=True)
    price_per_day = Column(Float, nullable=False)
    price_per_hour = Column(Float, nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    village = Column(String(100), nullable=True)
    district = Column(String(100), nullable=True)
    is_available = Column(Boolean, default=True)
    images = Column(Text, nullable=True)          # JSON array of URLs
    attachments = Column(Text, nullable=True)     # JSON array
    rating = Column(Float, default=0.0)
    total_ratings = Column(Integer, default=0)
    total_rentals = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    owner = relationship("User", back_populates="equipment")
    bookings = relationship("Booking", back_populates="equipment")
    reviews = relationship("Review", back_populates="equipment")


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    seeker_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    equipment_id = Column(Integer, ForeignKey("equipment.id"), nullable=False)
    start_date = Column(String(20), nullable=False)
    end_date = Column(String(20), nullable=False)
    total_days = Column(Integer, nullable=False, default=1)
    total_amount = Column(Float, nullable=False)
    status = Column(String(20), default="pending")
    delivery_type = Column(String(20), default="pickup")  # pickup | delivery
    delivery_address = Column(Text, nullable=True)
    estimated_area = Column(Float, nullable=True)
    estimated_hours = Column(Float, nullable=True)
    notes = Column(Text, nullable=True)
    attachments_requested = Column(Text, nullable=True)  # JSON
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    seeker = relationship("User", back_populates="bookings_as_seeker", foreign_keys=[seeker_id])
    equipment = relationship("Equipment", back_populates="bookings")
    review = relationship("Review", back_populates="booking", uselist=False)


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=False)
    equipment_id = Column(Integer, ForeignKey("equipment.id"), nullable=False)
    reviewer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    rating = Column(Float, nullable=False)
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    booking = relationship("Booking", back_populates="review")
    equipment = relationship("Equipment", back_populates="reviews")
    reviewer = relationship("User", back_populates="reviews_given", foreign_keys=[reviewer_id])
