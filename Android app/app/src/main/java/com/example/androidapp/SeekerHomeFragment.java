package com.example.androidapp;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.EditorInfo;
import android.widget.ArrayAdapter;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.example.androidapp.adapters.EquipmentAdapter;
import com.example.androidapp.databinding.FragmentSeekerHomeBinding;
import com.example.androidapp.models.Equipment;
import com.example.androidapp.network.RetrofitClient;
import com.example.androidapp.utils.SessionManager;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class SeekerHomeFragment extends Fragment {

    private FragmentSeekerHomeBinding binding;
    private EquipmentAdapter adapter;
    private SessionManager sessionManager;

    private static final String[] CATEGORIES = {"All", "Tractor", "Harvester", "Drone", "Implement"};

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        binding = FragmentSeekerHomeBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        sessionManager = new SessionManager(requireContext());
        
        // Welcome and location fallbacks matching website
        binding.tvWelcomeUser.setText(sessionManager.getName() != null ? sessionManager.getName().split(" ")[0] : "Farmer");
        binding.tvUserLocation.setText("Anandpur, Kheda District");

        setupRecyclerView();
        setupCategorySpinner();
        loadNearbyEquipment(null, null, null, 20.0, null); // 20km radius default matching web

        binding.tvMapViewLink.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(requireContext(), MapSearchActivity.class);
                startActivity(intent);
            }
        });

        // Category Cards Clicks
        binding.cardCatTractors.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                filterByCategory("Tractor");
            }
        });

        binding.cardCatHarvesters.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                filterByCategory("Harvester");
            }
        });

        binding.cardCatImplements.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                filterByCategory("Implement");
            }
        });

        binding.cardCatDrones.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                filterByCategory("Drone");
            }
        });

        binding.btnToggleFilters.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                int vis = binding.layoutFilters.getVisibility() == View.VISIBLE ? View.GONE : View.VISIBLE;
                binding.layoutFilters.setVisibility(vis);
            }
        });

        binding.btnApplyFilters.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                applyCurrentFilters();
            }
        });

        binding.btnResetFilters.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                resetAllFilters();
            }
        });

        binding.etSearchQuery.setOnEditorActionListener(new TextView.OnEditorActionListener() {
            @Override
            public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {
                if (actionId == EditorInfo.IME_ACTION_SEARCH || 
                    (event != null && event.getKeyCode() == KeyEvent.KEYCODE_ENTER)) {
                    applyCurrentFilters();
                    return true;
                }
                return false;
            }
        });
    }

    private void setupRecyclerView() {
        binding.rvEquipment.setLayoutManager(new LinearLayoutManager(requireContext()));
        adapter = new EquipmentAdapter(new EquipmentAdapter.OnItemClickListener() {
            @Override
            public void onItemClick(Equipment equipment) {
                Intent intent = new Intent(requireContext(), EquipmentDetailActivity.class);
                intent.putExtra("equipment_id", equipment.getId());
                startActivity(intent);
            }
        });
        binding.rvEquipment.setAdapter(adapter);
    }

    private void setupCategorySpinner() {
        ArrayAdapter<String> spinnerAdapter = new ArrayAdapter<>(requireContext(),
                android.R.layout.simple_spinner_item, CATEGORIES);
        spinnerAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        binding.spinnerCategory.setAdapter(spinnerAdapter);
    }

    private void filterByCategory(String catName) {
        for (int i = 0; i < CATEGORIES.length; i++) {
            if (CATEGORIES[i].equalsIgnoreCase(catName)) {
                binding.spinnerCategory.setSelection(i);
                break;
            }
        }
        applyCurrentFilters();
    }

    private void applyCurrentFilters() {
        String searchQuery = binding.etSearchQuery.getText().toString().trim();
        if (searchQuery.isEmpty()) searchQuery = null;

        String selectedCat = binding.spinnerCategory.getSelectedItem().toString().toLowerCase();
        if ("all".equals(selectedCat)) {
            selectedCat = null;
        }

        Double minPrice = null;
        String minStr = binding.etMinPrice.getText().toString().trim();
        if (!minStr.isEmpty()) {
            try {
                minPrice = Double.parseDouble(minStr);
            } catch (NumberFormatException ignored) {}
        }

        Double maxPrice = null;
        String maxStr = binding.etMaxPrice.getText().toString().trim();
        if (!maxStr.isEmpty()) {
            try {
                maxPrice = Double.parseDouble(maxStr);
            } catch (NumberFormatException ignored) {}
        }

        double radius = 20.0;
        String radiusStr = binding.etRadius.getText().toString().trim();
        if (!radiusStr.isEmpty()) {
            try {
                radius = Double.parseDouble(radiusStr);
            } catch (NumberFormatException ignored) {}
        }

        binding.layoutFilters.setVisibility(View.GONE);
        loadNearbyEquipment(searchQuery, selectedCat, minPrice, radius, maxPrice);
    }

    private void resetAllFilters() {
        binding.etSearchQuery.setText("");
        binding.spinnerCategory.setSelection(0);
        binding.etMinPrice.setText("");
        binding.etMaxPrice.setText("");
        binding.etRadius.setText("20");
        binding.layoutFilters.setVisibility(View.GONE);
        loadNearbyEquipment(null, null, null, 20.0, null);
    }

    private void loadNearbyEquipment(String query, String category, Double minPrice, double radius, Double maxPrice) {
        binding.progressBar.setVisibility(View.VISIBLE);
        binding.tvEmpty.setVisibility(View.GONE);

        String authToken = "Bearer " + sessionManager.getToken();
        
        // Anandpur coordinates
        Call<List<Equipment>> call = RetrofitClient.getApiService().getNearbyEquipment(
                23.0225, 72.5714, radius, minPrice, maxPrice, category, query, authToken
        );

        call.enqueue(new Callback<List<Equipment>>() {
            @Override
            public void onResponse(Call<List<Equipment>> call, Response<List<Equipment>> response) {
                if (isAdded()) {
                    binding.progressBar.setVisibility(View.GONE);
                    if (response.isSuccessful() && response.body() != null) {
                        List<Equipment> equipmentList = response.body();
                        adapter.setItems(equipmentList);
                        if (equipmentList.isEmpty()) {
                            binding.tvEmpty.setVisibility(View.VISIBLE);
                        }
                    } else {
                        Toast.makeText(requireContext(), "Failed to load machinery: " + response.message(), Toast.LENGTH_SHORT).show();
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

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
