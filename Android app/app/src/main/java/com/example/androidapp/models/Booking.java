package com.example.androidapp.models;

import com.google.gson.annotations.SerializedName;

public class Booking {
    @SerializedName("id")
    private String id;

    @SerializedName("seeker_id")
    private String seekerId;

    @SerializedName("equipment_id")
    private String equipmentId;

    @SerializedName("start_date")
    private String startDate;

    @SerializedName("end_date")
    private String endDate;

    @SerializedName("total_days")
    private int totalDays;

    @SerializedName("total_amount")
    private double totalAmount;

    @SerializedName("status")
    private String status;

    @SerializedName("delivery_type")
    private String deliveryType;

    @SerializedName("delivery_address")
    private String deliveryAddress;

    @SerializedName("estimated_area")
    private Double estimatedArea;

    @SerializedName("notes")
    private String notes;

    @SerializedName("created_at")
    private String createdAt;

    @SerializedName("equipment_name")
    private String equipmentName;

    @SerializedName("equipment_image")
    private String equipmentImage;

    @SerializedName("seeker_name")
    private String seekerName;

    @SerializedName("seeker_phone")
    private String seekerPhone;

    @SerializedName("owner_name")
    private String ownerName;

    @SerializedName("owner_phone")
    private String ownerPhone;

    @SerializedName("equipment_price_per_day")
    private Double equipmentPricePerDay;

    @SerializedName("equipment_village")
    private String equipmentVillage;

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getSeekerId() { return seekerId; }
    public void setSeekerId(String seekerId) { this.seekerId = seekerId; }

    public String getEquipmentId() { return equipmentId; }
    public void setEquipmentId(String equipmentId) { this.equipmentId = equipmentId; }

    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }

    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }

    public int getTotalDays() { return totalDays; }
    public void setTotalDays(int totalDays) { this.totalDays = totalDays; }

    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDeliveryType() { return deliveryType; }
    public void setDeliveryType(String deliveryType) { this.deliveryType = deliveryType; }

    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }

    public Double getEstimatedArea() { return estimatedArea; }
    public void setEstimatedArea(Double estimatedArea) { this.estimatedArea = estimatedArea; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getEquipmentName() { return equipmentName; }
    public void setEquipmentName(String equipmentName) { this.equipmentName = equipmentName; }

    public String getEquipmentImage() { return equipmentImage; }
    public void setEquipmentImage(String equipmentImage) { this.equipmentImage = equipmentImage; }

    public String getSeekerName() { return seekerName; }
    public void setSeekerName(String seekerName) { this.seekerName = seekerName; }

    public String getSeekerPhone() { return seekerPhone; }
    public void setSeekerPhone(String seekerPhone) { this.seekerPhone = seekerPhone; }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public String getOwnerPhone() { return ownerPhone; }
    public void setOwnerPhone(String ownerPhone) { this.ownerPhone = ownerPhone; }

    public Double getEquipmentPricePerDay() { return equipmentPricePerDay; }
    public void setEquipmentPricePerDay(Double equipmentPricePerDay) { this.equipmentPricePerDay = equipmentPricePerDay; }

    public String getEquipmentVillage() { return equipmentVillage; }
    public void setEquipmentVillage(String equipmentVillage) { this.equipmentVillage = equipmentVillage; }
}
