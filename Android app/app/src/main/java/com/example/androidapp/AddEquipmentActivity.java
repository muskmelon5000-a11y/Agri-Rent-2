package com.example.androidapp;

import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.androidapp.databinding.ActivityAddEquipmentBinding;
import com.example.androidapp.models.Equipment;
import com.example.androidapp.models.EquipmentCreate;
import com.example.androidapp.network.RetrofitClient;
import com.example.androidapp.utils.SessionManager;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class AddEquipmentActivity extends AppCompatActivity {

    private ActivityAddEquipmentBinding binding;
    private SessionManager sessionManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityAddEquipmentBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        sessionManager = new SessionManager(this);

        binding.btnSubmitListing.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                submitEquipmentListing();
            }
        });
    }

    private void submitEquipmentListing() {
        String name = binding.etName.getText().toString().trim();
        String brand = binding.etBrand.getText().toString().trim();
        String model = binding.etModel.getText().toString().trim();
        String hpStr = binding.etHp.getText().toString().trim();
        String yearStr = binding.etYear.getText().toString().trim();
        String priceStr = binding.etPrice.getText().toString().trim();
        String village = binding.etVillage.getText().toString().trim();
        String district = binding.etDistrict.getText().toString().trim();
        String desc = binding.etDesc.getText().toString().trim();

        String type = "tractor";
        if (binding.rbHarvester.isChecked()) {
            type = "harvester";
        } else if (binding.rbDrone.isChecked()) {
            type = "drone";
        } else if (binding.rbImplement.isChecked()) {
            type = "implement";
        }

        // Validations
        if (TextUtils.isEmpty(name)) {
            binding.tilName.setError("Machine Name is required");
            return;
        } else {
            binding.tilName.setError(null);
        }

        if (TextUtils.isEmpty(priceStr)) {
            binding.tilPrice.setError("Price is required");
            return;
        } else {
            binding.tilPrice.setError(null);
        }

        if (TextUtils.isEmpty(village)) {
            binding.tilVillage.setError("Village is required");
            return;
        } else {
            binding.tilVillage.setError(null);
        }

        if (TextUtils.isEmpty(district)) {
            binding.tilDistrict.setError("District is required");
            return;
        } else {
            binding.tilDistrict.setError(null);
        }

        double price;
        try {
            price = Double.parseDouble(priceStr);
        } catch (NumberFormatException e) {
            binding.tilPrice.setError("Invalid number format");
            return;
        }

        Integer hp = null;
        if (!TextUtils.isEmpty(hpStr)) {
            try {
                hp = Integer.parseInt(hpStr);
            } catch (NumberFormatException e) {
                binding.tilHp.setError("Invalid HP");
                return;
            }
        }

        Integer year = null;
        if (!TextUtils.isEmpty(yearStr)) {
            try {
                year = Integer.parseInt(yearStr);
            } catch (NumberFormatException e) {
                binding.tilYear.setError("Invalid year");
                return;
            }
        }

        binding.btnSubmitListing.setEnabled(false);
        binding.btnSubmitListing.setText("Posting Listing...");

        String authToken = "Bearer " + sessionManager.getToken();
        EquipmentCreate equipmentCreate = new EquipmentCreate(
                name,
                type,
                TextUtils.isEmpty(brand) ? null : brand,
                TextUtils.isEmpty(model) ? null : model,
                hp,
                year,
                TextUtils.isEmpty(desc) ? null : desc,
                price,
                village,
                district
        );

        Call<Equipment> call = RetrofitClient.getApiService().createEquipment(equipmentCreate, authToken);
        call.enqueue(new Callback<Equipment>() {
            @Override
            public void onResponse(Call<Equipment> call, Response<Equipment> response) {
                binding.btnSubmitListing.setEnabled(true);
                binding.btnSubmitListing.setText("Post Machinery Listing");

                if (response.isSuccessful() && response.body() != null) {
                    Toast.makeText(AddEquipmentActivity.this, "Machinery listed successfully!", Toast.LENGTH_LONG).show();
                    finish(); // return to Listings fragment
                } else {
                    Toast.makeText(AddEquipmentActivity.this, "Failed to list machinery: " + response.message(), Toast.LENGTH_LONG).show();
                }
            }

            @Override
            public void onFailure(Call<Equipment> call, Throwable t) {
                binding.btnSubmitListing.setEnabled(true);
                binding.btnSubmitListing.setText("Post Machinery Listing");
                Toast.makeText(AddEquipmentActivity.this, "Network Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }
}
