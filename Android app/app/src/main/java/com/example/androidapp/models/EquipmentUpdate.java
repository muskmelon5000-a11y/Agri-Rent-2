package com.example.androidapp.models;

import com.google.gson.annotations.SerializedName;

public class EquipmentUpdate {
    @SerializedName("name")
    private String name;

    @SerializedName("type")
    private String type;

    @SerializedName("brand")
    private String brand;

    @SerializedName("model")
    private String model;

    @SerializedName("hp")
    private Integer hp;

    @SerializedName("description")
    private String description;

    @SerializedName("price_per_day")
    private Double pricePerDay;

    @SerializedName("village")
    private String village;

    @SerializedName("district")
    private String district;

    @SerializedName("is_available")
    private Boolean isAvailable;

    public EquipmentUpdate(String name, String type, String brand, String model, Integer hp, String description, Double pricePerDay, String village, String district, Boolean isAvailable) {
        this.name = name;
        this.type = type;
        this.brand = brand;
        this.model = model;
        this.hp = hp;
        this.description = description;
        this.pricePerDay = pricePerDay;
        this.village = village;
        this.district = district;
        this.isAvailable = isAvailable;
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

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getPricePerDay() { return pricePerDay; }
    public void setPricePerDay(Double pricePerDay) { this.pricePerDay = pricePerDay; }

    public String getVillage() { return village; }
    public void setVillage(String village) { this.village = village; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public Boolean getAvailable() { return isAvailable; }
    public void setAvailable(Boolean available) { isAvailable = available; }
}
