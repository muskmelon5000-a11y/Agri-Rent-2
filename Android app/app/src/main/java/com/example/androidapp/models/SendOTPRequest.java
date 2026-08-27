package com.example.androidapp.models;

import com.google.gson.annotations.SerializedName;

public class SendOTPRequest {
    @SerializedName("email")
    private String email;

    public SendOTPRequest(String email) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
