package com.example.androidapp;

import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.androidapp.databinding.ActivityEquipmentDetailBinding;
import com.example.androidapp.models.Booking;
import com.example.androidapp.models.BookingCreate;
import com.example.androidapp.models.Equipment;
import com.example.androidapp.network.RetrofitClient;
import com.example.androidapp.utils.SessionManager;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class EquipmentDetailActivity extends AppCompatActivity {

    private ActivityEquipmentDetailBinding binding;
    private SessionManager sessionManager;
    private String equipmentId;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityEquipmentDetailBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        sessionManager = new SessionManager(this);
        equipmentId = getIntent().getStringExtra("equipment_id");

        if (TextUtils.isEmpty(equipmentId)) {
            Toast.makeText(this, "Error: Equipment ID missing", Toast.LENGTH_SHORT).show();
            finish();
            return;
        }

        loadEquipmentDetails();

        binding.btnSubmitBooking.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                submitBooking();
            }
        });
    }

    private void loadEquipmentDetails() {
        String authToken = "Bearer " + sessionManager.getToken();
        Call<Equipment> call = RetrofitClient.getApiService().getEquipmentDetails(equipmentId, authToken);
        call.enqueue(new Callback<Equipment>() {
            @Override
            public void onResponse(Call<Equipment> call, Response<Equipment> response) {
                if (response.isSuccessful() && response.body() != null) {
                    Equipment eq = response.body();
                    binding.tvEqName.setText(eq.getName());
                    binding.tvEqTypeBrand.setText(eq.getType() + " • " + eq.getBrand());
                    binding.tvEqPrice.setText("₹" + String.format("%,.0f", eq.getPricePerDay()) + "/day");
                    binding.tvEqDesc.setText(eq.getDescription() != null ? eq.getDescription() : "No description provided");
                    binding.tvEqLocation.setText("Village: " + eq.getVillage() + ", " + eq.getDistrict());
                    
                    String owner = "Owner: " + (eq.getOwnerName() != null ? eq.getOwnerName() : "Rajesh Patel");
                    if (eq.getOwnerPhone() != null) {
                        owner += " (Phone: " + eq.getOwnerPhone() + ")";
                    }
                    binding.tvEqOwner.setText(owner);
                } else {
                    Toast.makeText(EquipmentDetailActivity.this, "Failed to load details: " + response.message(), Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<Equipment> call, Throwable t) {
                Toast.makeText(EquipmentDetailActivity.this, "Network Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void submitBooking() {
        String startDate = binding.etStartDate.getText().toString().trim();
        String endDate = binding.etEndDate.getText().toString().trim();
        String daysStr = binding.etTotalDays.getText().toString().trim();
        String address = binding.etDeliveryAddress.getText().toString().trim();
        String type = binding.rbDelivery.isChecked() ? "delivery" : "pickup";

        if (TextUtils.isEmpty(startDate)) {
            binding.tilStartDate.setError("Start Date is required");
            return;
        } else {
            binding.tilStartDate.setError(null);
        }

        if (TextUtils.isEmpty(endDate)) {
            binding.tilEndDate.setError("End Date is required");
            return;
        } else {
            binding.tilEndDate.setError(null);
        }

        if (TextUtils.isEmpty(daysStr)) {
            binding.tilTotalDays.setError("Total Days is required");
            return;
        } else {
            binding.tilTotalDays.setError(null);
        }

        int totalDays;
        try {
            totalDays = Integer.parseInt(daysStr);
        } catch (NumberFormatException e) {
            binding.tilTotalDays.setError("Invalid number");
            return;
        }

        binding.btnSubmitBooking.setEnabled(false);
        binding.btnSubmitBooking.setText("Booking...");

        String authToken = "Bearer " + sessionManager.getToken();
        BookingCreate bookingCreate = new BookingCreate(
                equipmentId,
                startDate,
                endDate,
                totalDays,
                type,
                TextUtils.isEmpty(address) ? null : address,
                null,
                null,
                "Booked via Android App",
                null
        );

        Call<Booking> call = RetrofitClient.getApiService().createBooking(bookingCreate, authToken);
        call.enqueue(new Callback<Booking>() {
            @Override
            public void onResponse(Call<Booking> call, Response<Booking> response) {
                binding.btnSubmitBooking.setEnabled(true);
                binding.btnSubmitBooking.setText("Submit Booking Request");

                if (response.isSuccessful() && response.body() != null) {
                    Toast.makeText(EquipmentDetailActivity.this, "Booking request submitted!", Toast.LENGTH_LONG).show();
                    finish(); // return back to home/bookings screen
                } else {
                    Toast.makeText(EquipmentDetailActivity.this, "Booking failed: " + response.message(), Toast.LENGTH_LONG).show();
                }
            }

            @Override
            public void onFailure(Call<Booking> call, Throwable t) {
                binding.btnSubmitBooking.setEnabled(true);
                binding.btnSubmitBooking.setText("Submit Booking Request");
                Toast.makeText(EquipmentDetailActivity.this, "Network Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }
}
