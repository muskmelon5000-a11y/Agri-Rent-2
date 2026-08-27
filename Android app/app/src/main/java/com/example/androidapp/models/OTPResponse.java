package com.example.androidapp.models;

import com.google.gson.annotations.SerializedName;

public class OTPResponse {
    @SerializedName("message")
    private String message;

    @SerializedName("dev_otp")
    private String devOtp;

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getDevOtp() {
        return devOtp;
    }

    public void setDevOtp(String devOtp) {
        this.devOtp = devOtp;
    }
}
