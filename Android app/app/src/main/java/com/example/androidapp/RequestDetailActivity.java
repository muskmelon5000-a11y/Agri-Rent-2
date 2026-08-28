package com.example.androidapp;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.androidapp.databinding.ActivityRequestDetailBinding;
import com.example.androidapp.models.Booking;
import com.example.androidapp.models.BookingStatusUpdate;
import com.example.androidapp.network.RetrofitClient;
import com.example.androidapp.utils.SessionManager;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class RequestDetailActivity extends AppCompatActivity {

    private ActivityRequestDetailBinding binding;
    private SessionManager sessionManager;
    private String bookingId;
    private Booking currentBooking;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityRequestDetailBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        sessionManager = new SessionManager(this);
        bookingId = getIntent().getStringExtra("booking_id");

        binding.btnBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        loadBookingDetails();
        setupActions();
    }

    private void loadBookingDetails() {
        if (bookingId == null || bookingId.isEmpty()) {
            Toast.makeText(this, "Invalid request ID", Toast.LENGTH_SHORT).show();
            finish();
            return;
        }

        String authToken = "Bearer " + sessionManager.getToken();
        Call<Booking> call = RetrofitClient.getApiService().getBookingDetails(bookingId, authToken);
        call.enqueue(new Callback<Booking>() {
            @Override
            public void onResponse(Call<Booking> call, Response<Booking> response) {
                if (response.isSuccessful() && response.body() != null) {
                    currentBooking = response.body();
                    bindBookingUI(currentBooking);
                } else {
                    Toast.makeText(RequestDetailActivity.this, "Failed to load request details", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<Booking> call, Throwable t) {
                Toast.makeText(RequestDetailActivity.this, "Network Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void bindBookingUI(final Booking b) {
        // Seeker
        String name = b.getSeekerName() != null && !b.getSeekerName().isEmpty() ? b.getSeekerName() : "Farmer";
        binding.tvDetailSeekerName.setText(name);

        // Equipment
        String eqName = b.getEquipmentName() != null ? b.getEquipmentName() : "Machinery";
        binding.tvDetailEquipmentName.setText(eqName);

        // Dates
        String start = b.getStartDate() != null ? b.getStartDate() : "Start";
        String end = b.getEndDate() != null ? b.getEndDate() : "End";
        binding.tvDetailDates.setText(start + " - " + end);
        binding.tvDetailTotalDays.setText(b.getTotalDays() + " Days");
        binding.tvRentalDaysLabel.setText("Rental (" + b.getTotalDays() + " days)");

        // Delivery
        if ("delivery".equalsIgnoreCase(b.getDeliveryType())) {
            binding.tvDetailDeliveryType.setText("Delivery Requested");
            String address = b.getDeliveryAddress() != null && !b.getDeliveryAddress().isEmpty() 
                    ? b.getDeliveryAddress() 
                    : (b.getEquipmentVillage() != null ? b.getEquipmentVillage() : "Local Area");
            binding.tvDetailDeliveryAddress.setText(address);
        } else {
            binding.tvDetailDeliveryType.setText("Self Pickup");
            binding.tvDetailDeliveryAddress.setText(b.getEquipmentVillage() != null ? b.getEquipmentVillage() : "Provider Location");
        }

        // Amount
        binding.tvDetailRentalAmount.setText("₹" + String.format("%,.0f", b.getTotalAmount()));
        binding.tvDetailTotalAmount.setText("₹" + String.format("%,.0f", b.getTotalAmount()));

        // Notes
        if (b.getNotes() != null && !b.getNotes().isEmpty()) {
            binding.cardNotes.setVisibility(View.VISIBLE);
            binding.tvDetailNotes.setText("\"" + b.getNotes() + "\"");
        } else {
            binding.cardNotes.setVisibility(View.GONE);
        }

        // Status-dependent actions
        if (!"pending".equalsIgnoreCase(b.getStatus())) {
            binding.layoutBottomActions.setVisibility(View.GONE);
        } else {
            binding.layoutBottomActions.setVisibility(View.VISIBLE);
        }
    }

    private void setupActions() {
        // 📞 Call
        binding.btnCallSeeker.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (currentBooking != null && currentBooking.getSeekerPhone() != null && !currentBooking.getSeekerPhone().isEmpty()) {
                    Intent intent = new Intent(Intent.ACTION_DIAL);
                    intent.setData(Uri.parse("tel:" + currentBooking.getSeekerPhone()));
                    startActivity(intent);
                } else {
                    Toast.makeText(RequestDetailActivity.this, "Seeker phone number not available", Toast.LENGTH_SHORT).show();
                }
            }
        });

        // 💬 Chat / WhatsApp
        binding.btnChatSeeker.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (currentBooking != null && currentBooking.getSeekerPhone() != null && !currentBooking.getSeekerPhone().isEmpty()) {
                    String phone = currentBooking.getSeekerPhone().replaceAll("[^0-9]", "");
                    if (!phone.startsWith("91") && phone.length() == 10) {
                        phone = "91" + phone;
                    }
                    String text = "Hi " + (currentBooking.getSeekerName() != null ? currentBooking.getSeekerName() : "") + ", regarding your booking request for " + currentBooking.getEquipmentName() + "...";
                    String url = "https://api.whatsapp.com/send?phone=" + phone + "&text=" + Uri.encode(text);
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    try {
                        startActivity(intent);
                    } catch (Exception e) {
                        // Fallback to SMS
                        Intent smsIntent = new Intent(Intent.ACTION_VIEW, Uri.parse("sms:" + currentBooking.getSeekerPhone()));
                        smsIntent.putExtra("sms_body", text);
                        startActivity(smsIntent);
                    }
                } else {
                    Toast.makeText(RequestDetailActivity.this, "Seeker phone number not available", Toast.LENGTH_SHORT).show();
                }
            }
        });

        // Accept
        binding.btnAcceptDetail.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                updateStatus("accepted");
            }
        });

        // Decline
        binding.btnDeclineDetail.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                updateStatus("rejected");
            }
        });

        // Counter Offer
        binding.btnCounterOffer.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(RequestDetailActivity.this, "Propose new rate / dates via call or chat with the farmer", Toast.LENGTH_LONG).show();
            }
        });
    }

    private void updateStatus(final String newStatus) {
        if (bookingId == null) return;

        binding.btnAcceptDetail.setEnabled(false);
        binding.btnDeclineDetail.setEnabled(false);

        String authToken = "Bearer " + sessionManager.getToken();
        BookingStatusUpdate update = new BookingStatusUpdate(newStatus);

        Call<Booking> call = RetrofitClient.getApiService().updateBookingStatus(bookingId, update, authToken);
        call.enqueue(new Callback<Booking>() {
            @Override
            public void onResponse(Call<Booking> call, Response<Booking> response) {
                if (response.isSuccessful()) {
                    String msg = "accepted".equalsIgnoreCase(newStatus) ? "Request accepted! ✅" : "Request declined";
                    Toast.makeText(RequestDetailActivity.this, msg, Toast.LENGTH_SHORT).show();
                    finish();
                } else {
                    binding.btnAcceptDetail.setEnabled(true);
                    binding.btnDeclineDetail.setEnabled(true);
                    Toast.makeText(RequestDetailActivity.this, "Failed to update status: " + response.message(), Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<Booking> call, Throwable t) {
                binding.btnAcceptDetail.setEnabled(true);
                binding.btnDeclineDetail.setEnabled(true);
                Toast.makeText(RequestDetailActivity.this, "Network Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }
}
