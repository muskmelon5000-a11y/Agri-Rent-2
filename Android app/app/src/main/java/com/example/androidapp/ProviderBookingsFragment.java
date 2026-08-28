package com.example.androidapp;

import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.example.androidapp.adapters.ProviderBookingAdapter;
import com.example.androidapp.databinding.FragmentProviderBookingsBinding;
import com.example.androidapp.models.Booking;
import com.example.androidapp.models.BookingStatusUpdate;
import com.example.androidapp.network.RetrofitClient;
import com.example.androidapp.utils.SessionManager;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ProviderBookingsFragment extends Fragment {

    private FragmentProviderBookingsBinding binding;
    private ProviderBookingAdapter adapter;
    private SessionManager sessionManager;

    private List<Booking> allBookings = new ArrayList<>();
    private String currentTab = "pending"; // pending | accepted | other

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        binding = FragmentProviderBookingsBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        sessionManager = new SessionManager(requireContext());
        setupRecyclerView();
        setupTabs();
        loadBookings();
    }

    @Override
    public void onResume() {
        super.onResume();
        loadBookings();
    }

    private void setupTabs() {
        binding.tabNew.setOnClickListener(v -> selectTab("pending"));
        binding.tabAccepted.setOnClickListener(v -> selectTab("accepted"));
        binding.tabOther.setOnClickListener(v -> selectTab("other"));
    }

    private void selectTab(String tab) {
        currentTab = tab;

        // Reset pill styles
        binding.tabNew.setBackgroundResource(R.drawable.bg_tab_pill_inactive);
        binding.tabNew.setTextColor(Color.parseColor("#4B5563"));

        binding.tabAccepted.setBackgroundResource(R.drawable.bg_tab_pill_inactive);
        binding.tabAccepted.setTextColor(Color.parseColor("#4B5563"));

        binding.tabOther.setBackgroundResource(R.drawable.bg_tab_pill_inactive);
        binding.tabOther.setTextColor(Color.parseColor("#4B5563"));

        if ("pending".equals(tab)) {
            binding.tabNew.setBackgroundResource(R.drawable.bg_tab_pill_active);
            binding.tabNew.setTextColor(Color.WHITE);
        } else if ("accepted".equals(tab)) {
            binding.tabAccepted.setBackgroundResource(R.drawable.bg_tab_pill_active);
            binding.tabAccepted.setTextColor(Color.WHITE);
        } else if ("other".equals(tab)) {
            binding.tabOther.setBackgroundResource(R.drawable.bg_tab_pill_active);
            binding.tabOther.setTextColor(Color.WHITE);
        }

        filterAndDisplay();
    }

    private void setupRecyclerView() {
        binding.rvBookings.setLayoutManager(new LinearLayoutManager(requireContext()));
        adapter = new ProviderBookingAdapter(new ProviderBookingAdapter.OnBookingActionListener() {
            @Override
            public void onAccept(Booking booking) {
                changeBookingStatus(booking.getId(), "accepted");
            }

            @Override
            public void onReject(Booking booking) {
                changeBookingStatus(booking.getId(), "rejected");
            }

            @Override
            public void onCardClick(Booking booking) {
                Intent intent = new Intent(requireContext(), RequestDetailActivity.class);
                intent.putExtra("booking_id", booking.getId());
                startActivity(intent);
            }
        });
        binding.rvBookings.setAdapter(adapter);
    }

    private void loadBookings() {
        binding.progressBar.setVisibility(View.VISIBLE);
        binding.layoutEmpty.setVisibility(View.GONE);

        String authToken = "Bearer " + sessionManager.getToken();
        Call<List<Booking>> call = RetrofitClient.getApiService().getProviderBookings(authToken);
        call.enqueue(new Callback<List<Booking>>() {
            @Override
            public void onResponse(Call<List<Booking>> call, Response<List<Booking>> response) {
                if (isAdded()) {
                    binding.progressBar.setVisibility(View.GONE);
                    if (response.isSuccessful() && response.body() != null) {
                        allBookings = response.body();
                        updateTabCounts();
                        filterAndDisplay();
                    } else {
                        Toast.makeText(requireContext(), "Failed to load requests: " + response.message(), Toast.LENGTH_SHORT).show();
                    }
                }
            }

            @Override
            public void onFailure(Call<List<Booking>> call, Throwable t) {
                if (isAdded()) {
                    binding.progressBar.setVisibility(View.GONE);
                    Toast.makeText(requireContext(), "Network Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                }
            }
        });
    }

    private void updateTabCounts() {
        int pendingCount = 0;
        for (Booking b : allBookings) {
            if ("pending".equalsIgnoreCase(b.getStatus())) {
                pendingCount++;
            }
        }
        binding.tabNew.setText("New (" + pendingCount + ")");
    }

    private void filterAndDisplay() {
        List<Booking> filtered = new ArrayList<>();
        for (Booking b : allBookings) {
            String status = b.getStatus() != null ? b.getStatus().toLowerCase() : "pending";
            if ("pending".equals(currentTab) && "pending".equals(status)) {
                filtered.add(b);
            } else if ("accepted".equals(currentTab) && ("accepted".equals(status) || "active".equals(status) || "completed".equals(status))) {
                filtered.add(b);
            } else if ("other".equals(currentTab) && ("rejected".equals(status) || "cancelled".equals(status))) {
                filtered.add(b);
            }
        }

        adapter.setItems(filtered);

        if (filtered.isEmpty()) {
            binding.layoutEmpty.setVisibility(View.VISIBLE);
            if ("pending".equals(currentTab)) {
                binding.tvEmptyTitle.setText("No new requests");
            } else if ("accepted".equals(currentTab)) {
                binding.tvEmptyTitle.setText("No accepted bookings");
            } else {
                binding.tvEmptyTitle.setText("No other requests");
            }
        } else {
            binding.layoutEmpty.setVisibility(View.GONE);
        }
    }

    private void changeBookingStatus(String bookingId, final String newStatus) {
        binding.progressBar.setVisibility(View.VISIBLE);

        String authToken = "Bearer " + sessionManager.getToken();
        BookingStatusUpdate update = new BookingStatusUpdate(newStatus);
        
        Call<Booking> call = RetrofitClient.getApiService().updateBookingStatus(bookingId, update, authToken);
        call.enqueue(new Callback<Booking>() {
            @Override
            public void onResponse(Call<Booking> call, Response<Booking> response) {
                if (isAdded()) {
                    binding.progressBar.setVisibility(View.GONE);
                    if (response.isSuccessful()) {
                        String msg = "accepted".equalsIgnoreCase(newStatus) ? "Request accepted! ✅" : "Request declined";
                        Toast.makeText(requireContext(), msg, Toast.LENGTH_SHORT).show();
                        loadBookings();
                    } else {
                        Toast.makeText(requireContext(), "Failed to update status: " + response.message(), Toast.LENGTH_SHORT).show();
                    }
                }
            }

            @Override
            public void onFailure(Call<Booking> call, Throwable t) {
                if (isAdded()) {
                    binding.progressBar.setVisibility(View.GONE);
                    Toast.makeText(requireContext(), "Network Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                }
            }
        });
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
