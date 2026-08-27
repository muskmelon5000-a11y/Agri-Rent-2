package com.example.androidapp.models;

import com.google.gson.annotations.SerializedName;

public class EarningsDay {
    @SerializedName("name")
    private String name;

    @SerializedName("value")
    private double value;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getValue() {
        return value;
    }

    public void setValue(double value) {
        this.value = value;
    }
}
