package com.example.androidapp;

import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.androidapp.databinding.ActivityEditEquipmentBinding;
import com.example.androidapp.models.Equipment;
import com.example.androidapp.models.EquipmentUpdate;
import com.example.androidapp.network.RetrofitClient;
import com.example.androidapp.utils.SessionManager;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class EditEquipmentActivity extends AppCompatActivity {

    private ActivityEditEquipmentBinding binding;
    private SessionManager sessionManager;
    private String equipmentId;
    private boolean isAvailableDefault = true;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityEditEquipmentBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        sessionManager = new SessionManager(this);
        equipmentId = getIntent().getStringExtra("equipment_id");

        if (TextUtils.isEmpty(equipmentId)) {
            Toast.makeText(this, "Error: Listing ID is missing", Toast.LENGTH_SHORT).show();
            finish();
            return;
        }

        loadEquipmentDetails();

        binding.btnSubmitChanges.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                updateEquipmentListing();
            }
        });
    }

    private void loadEquipmentDetails() {
        binding.progressBar.setVisibility(View.VISIBLE);

        String authToken = "Bearer " + sessionManager.getToken();
        Call<Equipment> call = RetrofitClient.getApiService().getEquipmentDetails(equipmentId, authToken);
        call.enqueue(new Callback<Equipment>() {
            @Override
            public void onResponse(Call<Equipment> call, Response<Equipment> response) {
                binding.progressBar.setVisibility(View.GONE);
                if (response.isSuccessful() && response.body() != null) {
                    Equipment equipment = response.body();
                    prefillForm(equipment);
                } else {
                    Toast.makeText(EditEquipmentActivity.this, "Failed to load details", Toast.LENGTH_SHORT).show();
                    finish();
                }
            }

            @Override
            public void onFailure(Call<Equipment> call, Throwable t) {
                binding.progressBar.setVisibility(View.GONE);
                Toast.makeText(EditEquipmentActivity.this, "Network Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                finish();
            }
        });
    }

    private void prefillForm(Equipment equipment) {
        binding.etName.setText(equipment.getName());
        binding.etBrand.setText(equipment.getBrand());
        binding.etModel.setText(equipment.getModel());
        binding.etHp.setText(equipment.getHp() != null ? String.valueOf(equipment.getHp()) : "");
        binding.etPrice.setText(String.valueOf(equipment.getPricePerDay()));
        binding.etVillage.setText(equipment.getVillage());
        binding.etDistrict.setText(equipment.getDistrict());
        binding.etDesc.setText(equipment.getDescription());

        isAvailableDefault = equipment.isAvailable();

        String type = equipment.getType() != null ? equipment.getType().toLowerCase() : "tractor";
        switch (type) {
            case "harvester":
                binding.rbHarvester.setChecked(true);
                break;
            case "drone":
                binding.rbDrone.setChecked(true);
                break;
            case "implement":
                binding.rbImplement.setChecked(true);
                break;
            case "tractor":
            default:
                binding.rbTractor.setChecked(true);
                break;
        }
    }

    private void updateEquipmentListing() {
        String name = binding.etName.getText().toString().trim();
        String brand = binding.etBrand.getText().toString().trim();
        String model = binding.etModel.getText().toString().trim();
        String hpStr = binding.etHp.getText().toString().trim();
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
            binding.tilPrice.setError("Invalid price format");
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

        binding.btnSubmitChanges.setEnabled(false);
        binding.btnSubmitChanges.setText("Saving Changes...");
        binding.progressBar.setVisibility(View.VISIBLE);

        String authToken = "Bearer " + sessionManager.getToken();
        EquipmentUpdate updatePayload = new EquipmentUpdate(
                name,
                type,
                TextUtils.isEmpty(brand) ? null : brand,
                TextUtils.isEmpty(model) ? null : model,
                hp,
                TextUtils.isEmpty(desc) ? null : desc,
                price,
                village,
                district,
                isAvailableDefault
        );

        Call<Equipment> call = RetrofitClient.getApiService().updateEquipment(equipmentId, updatePayload, authToken);
        call.enqueue(new Callback<Equipment>() {
            @Override
            public void onResponse(Call<Equipment> call, Response<Equipment> response) {
                binding.btnSubmitChanges.setEnabled(true);
                binding.btnSubmitChanges.setText("Save Changes");
                binding.progressBar.setVisibility(View.GONE);

                if (response.isSuccessful() && response.body() != null) {
                    Toast.makeText(EditEquipmentActivity.this, "Machinery updated successfully!", Toast.LENGTH_SHORT).show();
                    finish(); // return to Provider Listings Fragment
                } else {
                    Toast.makeText(EditEquipmentActivity.this, "Failed to update machinery", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<Equipment> call, Throwable t) {
                binding.btnSubmitChanges.setEnabled(true);
                binding.btnSubmitChanges.setText("Save Changes");
                binding.progressBar.setVisibility(View.GONE);
                Toast.makeText(EditEquipmentActivity.this, "Network Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }
}
