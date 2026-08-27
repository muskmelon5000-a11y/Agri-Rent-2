package com.example.androidapp.models;

import com.google.gson.annotations.SerializedName;

public class UserUpdate {
    @SerializedName("name")
    private String name;

    @SerializedName("phone")
    private String phone;

    @SerializedName("village")
    private String village;

    @SerializedName("district")
    private String district;

    @SerializedName("profile_image")
    private String profileImage;

    public UserUpdate(String name, String phone, String village, String district, String profileImage) {
        this.name = name;
        this.phone = phone;
        this.village = village;
        this.district = district;
        this.profileImage = profileImage;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getVillage() { return village; }
    public void setVillage(String village) { this.village = village; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getProfileImage() { return profileImage; }
    public void setProfileImage(String profileImage) { this.profileImage = profileImage; }
}
