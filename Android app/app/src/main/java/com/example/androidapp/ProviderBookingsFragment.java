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

import com.example.androidapp.adapters.ProviderBookingAdapter;
import com.example.androidapp.databinding.FragmentProviderBookingsBinding;
import com.example.androidapp.models.Booking;
import com.example.androidapp.models.BookingStatusUpdate;
import com.example.androidapp.network.RetrofitClient;
import com.example.androidapp.utils.SessionManager;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ProviderBookingsFragment extends Fragment {

    private FragmentProviderBookingsBinding binding;
    private ProviderBookingAdapter adapter;
    private SessionManager sessionManager;

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
        loadBookings();
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
            public void onContactClick(Booking booking) {
                Intent intent = new Intent(requireContext(), ContactActivity.class);
                intent.putExtra("name", booking.getSeekerName() != null ? booking.getSeekerName() : "Renter");
                intent.putExtra("phone", booking.getSeekerPhone());
                intent.putExtra("role_context", "Renter of " + booking.getEquipmentName());
                startActivity(intent);
            }
        });
        binding.rvBookings.setAdapter(adapter);
    }

    private void loadBookings() {
        binding.progressBar.setVisibility(View.VISIBLE);
        binding.tvEmpty.setVisibility(View.GONE);

        String authToken = "Bearer " + sessionManager.getToken();
        Call<List<Booking>> call = RetrofitClient.getApiService().getProviderBookings(authToken);
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
                        Toast.makeText(requireContext(), "Booking request " + newStatus + " successfully!", Toast.LENGTH_SHORT).show();
                        loadBookings(); // Reload list to reflect changes
                    } else {
                        Toast.makeText(requireContext(), "Failed to update booking status: " + response.message(), Toast.LENGTH_SHORT).show();
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
