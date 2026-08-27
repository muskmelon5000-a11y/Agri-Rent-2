package com.example.androidapp.models;

import com.google.gson.annotations.SerializedName;

public class BookingStatusUpdate {
    @SerializedName("status")
    private String status;

    public BookingStatusUpdate(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
