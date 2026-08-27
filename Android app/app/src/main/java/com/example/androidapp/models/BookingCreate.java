package com.example.androidapp.models;

import com.google.gson.annotations.SerializedName;

public class BookingCreate {
    @SerializedName("equipment_id")
    private String equipmentId;

    @SerializedName("start_date")
    private String startDate;

    @SerializedName("end_date")
    private String endDate;

    @SerializedName("total_days")
    private int totalDays;

    @SerializedName("delivery_type")
    private String deliveryType; // "pickup" | "delivery"

    @SerializedName("delivery_address")
    private String deliveryAddress;

    @SerializedName("estimated_area")
    private Double estimatedArea;

    @SerializedName("estimated_hours")
    private Double estimatedHours;

    @SerializedName("notes")
    private String notes;

    @SerializedName("attachments_requested")
    private String attachmentsRequested;

    public BookingCreate(String equipmentId, String startDate, String endDate, int totalDays, String deliveryType, String deliveryAddress, Double estimatedArea, Double estimatedHours, String notes, String attachmentsRequested) {
        this.equipmentId = equipmentId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.totalDays = totalDays;
        this.deliveryType = deliveryType;
        this.deliveryAddress = deliveryAddress;
        this.estimatedArea = estimatedArea;
        this.estimatedHours = estimatedHours;
        this.notes = notes;
        this.attachmentsRequested = attachmentsRequested;
    }

    // Getters and Setters
    public String getEquipmentId() { return equipmentId; }
    public void setEquipmentId(String equipmentId) { this.equipmentId = equipmentId; }

    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }

    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }

    public int getTotalDays() { return totalDays; }
    public void setTotalDays(int totalDays) { this.totalDays = totalDays; }

    public String getDeliveryType() { return deliveryType; }
    public void setDeliveryType(String deliveryType) { this.deliveryType = deliveryType; }

    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }

    public Double getEstimatedArea() { return estimatedArea; }
    public void setEstimatedArea(Double estimatedArea) { this.estimatedArea = estimatedArea; }

    public Double getEstimatedHours() { return estimatedHours; }
    public void setEstimatedHours(Double estimatedHours) { this.estimatedHours = estimatedHours; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getAttachmentsRequested() { return attachmentsRequested; }
    public void setAttachmentsRequested(String attachmentsRequested) { this.attachmentsRequested = attachmentsRequested; }
}
