package com.example.androidapp;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.example.androidapp.adapters.BookingAdapter;
import com.example.androidapp.databinding.FragmentSeekerBookingsBinding;
import com.example.androidapp.models.Booking;
import com.example.androidapp.network.RetrofitClient;
import com.example.androidapp.utils.SessionManager;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class SeekerBookingsFragment extends Fragment {

    private FragmentSeekerBookingsBinding binding;
    private BookingAdapter adapter;
    private SessionManager sessionManager;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        binding = FragmentSeekerBookingsBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        sessionManager = new SessionManager(requireContext());
        setupRecyclerView();
        loadBookings();
    }

    private void setupRecyclerView() {
        binding.rvBookings.setLayoutManager(new LinearLayoutManager(requireContext()));
        adapter = new BookingAdapter(new BookingAdapter.OnBookingActionListener() {
            @Override
            public void onCancelClick(Booking booking) {
                cancelBookingRequest(booking.getId());
            }

            @Override
            public void onContactClick(Booking booking) {
                Intent intent = new Intent(requireContext(), ContactActivity.class);
                intent.putExtra("name", booking.getOwnerName() != null ? booking.getOwnerName() : "Owner");
                intent.putExtra("phone", booking.getOwnerPhone());
                intent.putExtra("role_context", "Owner of " + booking.getEquipmentName());
                startActivity(intent);
            }
        });
        binding.rvBookings.setAdapter(adapter);
    }

    private void loadBookings() {
        binding.progressBar.setVisibility(View.VISIBLE);
        binding.tvEmpty.setVisibility(View.GONE);

        String authToken = "Bearer " + sessionManager.getToken();
        Call<List<Booking>> call = RetrofitClient.getApiService().getMyBookings(authToken);
        call.enqueue(new Callback<List<Booking>>() {
            @Override
            public void onResponse(Call<List<Booking>> call, Response<List<Booking>> response) {
                if (isAdded()) {
                    binding.progressBar.setVisibility(View.GONE);
                    if (response.isSuccessful() && response.body() != null) {
                        List<Booking> bookings = response.body();
                        adapter.setItems(bookings);
                        if (bookings.isEmpty()) {
                            binding.tvEmpty.setVisibility(View.VISIBLE);
                        }
                    } else {
                        Toast.makeText(requireContext(), "Failed to load bookings: " + response.message(), Toast.LENGTH_SHORT).show();
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

    private void cancelBookingRequest(String bookingId) {
        binding.progressBar.setVisibility(View.VISIBLE);

        String authToken = "Bearer " + sessionManager.getToken();
        Call<Void> call = RetrofitClient.getApiService().cancelBooking(bookingId, authToken);
        call.enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (isAdded()) {
                    binding.progressBar.setVisibility(View.GONE);
                    if (response.isSuccessful() || response.code() == 200 || response.code() == 204) {
                        Toast.makeText(requireContext(), "Booking cancelled successfully!", Toast.LENGTH_SHORT).show();
                        loadBookings(); // Refresh the list
                    } else {
                        Toast.makeText(requireContext(), "Failed to cancel booking", Toast.LENGTH_SHORT).show();
                    }
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
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
