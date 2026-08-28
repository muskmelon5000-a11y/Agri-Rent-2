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

import com.example.androidapp.adapters.ProviderEquipmentAdapter;
import com.example.androidapp.databinding.FragmentProviderListingsBinding;
import com.example.androidapp.models.Equipment;
import com.example.androidapp.network.RetrofitClient;
import com.example.androidapp.utils.SessionManager;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ProviderListingsFragment extends Fragment {

    private FragmentProviderListingsBinding binding;
    private ProviderEquipmentAdapter adapter;
    private SessionManager sessionManager;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        binding = FragmentProviderListingsBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        sessionManager = new SessionManager(requireContext());
        setupRecyclerView();

        binding.fabAddMachine.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(requireContext(), AddEquipmentActivity.class));
            }
        });
    }

    @Override
    public void onResume() {
        super.onResume();
        loadListings(); // Reload listings when returning from AddEquipmentActivity or EditEquipmentActivity
    }

    private void setupRecyclerView() {
        binding.rvListings.setLayoutManager(new LinearLayoutManager(requireContext()));
        adapter = new ProviderEquipmentAdapter(new ProviderEquipmentAdapter.OnEquipmentActionListener() {
            @Override
            public void onDeleteClick(Equipment equipment) {
                deleteListing(equipment.getId());
            }

            @Override
            public void onEditClick(Equipment equipment) {
                Intent intent = new Intent(requireContext(), EditEquipmentActivity.class);
                intent.putExtra("equipment_id", equipment.getId());
                startActivity(intent);
            }

            @Override
            public void onToggleAvailabilityClick(Equipment equipment) {
                toggleListingAvailability(equipment.getId());
            }

            @Override
            public void onViewJobsClick(Equipment equipment) {
                if (getActivity() instanceof ProviderMainActivity) {
                    com.google.android.material.bottomnavigation.BottomNavigationView bottomNav =
                            getActivity().findViewById(R.id.bottom_navigation);
                    if (bottomNav != null) {
                        bottomNav.setSelectedItemId(R.id.nav_provider_bookings);
                    }
                }
            }
        });
        binding.rvListings.setAdapter(adapter);
    }

    private void loadListings() {
        binding.progressBar.setVisibility(View.VISIBLE);
        binding.tvEmpty.setVisibility(View.GONE);

        String authToken = "Bearer " + sessionManager.getToken();
        Call<List<Equipment>> call = RetrofitClient.getApiService().getMyEquipment(authToken);
        call.enqueue(new Callback<List<Equipment>>() {
            @Override
            public void onResponse(Call<List<Equipment>> call, Response<List<Equipment>> response) {
                if (isAdded()) {
                    binding.progressBar.setVisibility(View.GONE);
                    if (response.isSuccessful() && response.body() != null) {
                        List<Equipment> listings = response.body();
                        adapter.setItems(listings);
                        if (listings.isEmpty()) {
                            binding.tvEmpty.setVisibility(View.VISIBLE);
                        }
                    } else {
                        Toast.makeText(requireContext(), "Failed to load listings: " + response.message(), Toast.LENGTH_SHORT).show();
                    }
                }
            }

            @Override
            public void onFailure(Call<List<Equipment>> call, Throwable t) {
                if (isAdded()) {
                    binding.progressBar.setVisibility(View.GONE);
                    Toast.makeText(requireContext(), "Network Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                }
            }
        });
    }

    private void toggleListingAvailability(String equipmentId) {
        binding.progressBar.setVisibility(View.VISIBLE);

        String authToken = "Bearer " + sessionManager.getToken();
        Call<Equipment> call = RetrofitClient.getApiService().toggleAvailability(equipmentId, authToken);
        call.enqueue(new Callback<Equipment>() {
            @Override
            public void onResponse(Call<Equipment> call, Response<Equipment> response) {
                if (isAdded()) {
                    binding.progressBar.setVisibility(View.GONE);
                    if (response.isSuccessful() && response.body() != null) {
                        Toast.makeText(requireContext(), "Availability toggled!", Toast.LENGTH_SHORT).show();
                        loadListings(); // Reload to refresh UI correctly
                    } else {
                        Toast.makeText(requireContext(), "Failed to toggle availability", Toast.LENGTH_SHORT).show();
                    }
                }
            }

            @Override
            public void onFailure(Call<Equipment> call, Throwable t) {
                if (isAdded()) {
                    binding.progressBar.setVisibility(View.GONE);
                    Toast.makeText(requireContext(), "Network Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                }
            }
        });
    }

    private void deleteListing(String equipmentId) {
        binding.progressBar.setVisibility(View.VISIBLE);

        String authToken = "Bearer " + sessionManager.getToken();
        Call<Void> call = RetrofitClient.getApiService().deleteEquipment(equipmentId, authToken);
        call.enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (isAdded()) {
                    binding.progressBar.setVisibility(View.GONE);
                    if (response.isSuccessful() || response.code() == 204) {
                        Toast.makeText(requireContext(), "Listing deleted successfully!", Toast.LENGTH_SHORT).show();
                        loadListings(); // Reload listings list
                    } else {
                        Toast.makeText(requireContext(), "Failed to delete listing", Toast.LENGTH_SHORT).show();
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
