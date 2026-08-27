package com.example.androidapp.models;

import com.google.gson.annotations.SerializedName;

public class SignupRequest {
    @SerializedName("email")
    private String email;

    @SerializedName("name")
    private String name;

    @SerializedName("password")
    private String password;

    @SerializedName("role")
    private String role; // seeker | provider

    @SerializedName("otp")
    private String otp;

    @SerializedName("village")
    private String village;

    @SerializedName("district")
    private String district;

    @SerializedName("phone")
    private String phone;

    public SignupRequest(String email, String name, String password, String role, String otp, String village, String district, String phone) {
        this.email = email;
        this.name = name;
        this.password = password;
        this.role = role;
        this.otp = otp;
        this.village = village;
        this.district = district;
        this.phone = phone;
    }

    // Getters and Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getOtp() { return otp; }
    public void setOtp(String otp) { this.otp = otp; }

    public String getVillage() { return village; }
    public void setVillage(String village) { this.village = village; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
}
