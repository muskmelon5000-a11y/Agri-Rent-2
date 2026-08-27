package com.example.androidapp.models;

import com.google.gson.annotations.SerializedName;

public class EquipmentCreate {
    @SerializedName("name")
    private String name;

    @SerializedName("type")
    private String type; // tractor | harvester | implement | drone

    @SerializedName("brand")
    private String brand;

    @SerializedName("model")
    private String model;

    @SerializedName("hp")
    private Integer hp;

    @SerializedName("year")
    private Integer year;

    @SerializedName("description")
    private String description;

    @SerializedName("price_per_day")
    private double pricePerDay;

    @SerializedName("latitude")
    private double latitude = 23.0225;

    @SerializedName("longitude")
    private double longitude = 72.5714;

    @SerializedName("village")
    private String village;

    @SerializedName("district")
    private String district;

    public EquipmentCreate(String name, String type, String brand, String model, Integer hp, Integer year, String description, double pricePerDay, String village, String district) {
        this.name = name;
        this.type = type;
        this.brand = brand;
        this.model = model;
        this.hp = hp;
        this.year = year;
        this.description = description;
        this.pricePerDay = pricePerDay;
        this.village = village;
        this.district = district;
    }

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public Integer getHp() { return hp; }
    public void setHp(Integer hp) { this.hp = hp; }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public double getPricePerDay() { return pricePerDay; }
    public void setPricePerDay(double pricePerDay) { this.pricePerDay = pricePerDay; }

    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }

    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }

    public String getVillage() { return village; }
    public void setVillage(String village) { this.village = village; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }
}
