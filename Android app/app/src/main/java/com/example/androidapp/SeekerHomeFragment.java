package com.example.androidapp;

import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.EditorInfo;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.example.androidapp.adapters.EquipmentAdapter;
import com.example.androidapp.databinding.FragmentSeekerHomeBinding;
import com.example.androidapp.models.Equipment;
import com.example.androidapp.models.UserOut;
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
    private String selectedCategory = null;

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
        
        updateUserHeader();
        loadUserProfile();

        setupRecyclerView();
        loadNearbyEquipment(null, null, null, 20.0, null);

        binding.tvMapViewLink.setOnClickListener(v -> {
            Intent intent = new Intent(requireContext(), MapSearchActivity.class);
            startActivity(intent);
        });

        // Category Cards Clicks
        binding.cardCatTractors.setOnClickListener(v -> filterByCategory("tractor"));
        binding.cardCatHarvesters.setOnClickListener(v -> filterByCategory("harvester"));
        binding.cardCatImplements.setOnClickListener(v -> filterByCategory("implement"));
        binding.cardCatDrones.setOnClickListener(v -> filterByCategory("drone"));

        if (binding.cardCommunityHubs != null) {
            binding.cardCommunityHubs.setOnClickListener(v -> 
                Toast.makeText(requireContext(), "🏛️ 3 Community Equipment Hubs found within 10 km!", Toast.LENGTH_SHORT).show());
        }

        binding.btnToggleFilters.setOnClickListener(v -> {
            int vis = binding.layoutFilters.getVisibility() == View.VISIBLE ? View.GONE : View.VISIBLE;
            binding.layoutFilters.setVisibility(vis);
        });

        binding.btnApplyFilters.setOnClickListener(v -> applyCurrentFilters());
        binding.btnResetFilters.setOnClickListener(v -> resetFilters());

        binding.etSearchQuery.setOnEditorActionListener((v, actionId, event) -> {
            if (actionId == EditorInfo.IME_ACTION_SEARCH || 
                (event != null && event.getKeyCode() == KeyEvent.KEYCODE_ENTER)) {
                applyCurrentFilters();
                return true;
            }
            return false;
        });
    }

    @Override
    public void onResume() {
        super.onResume();
        updateUserHeader();
        loadUserProfile();
        applyCurrentFilters();
    }

    private void updateUserHeader() {
        if (binding == null) return;
        String name = sessionManager.getName();
        binding.tvWelcomeUser.setText(name != null && !name.isEmpty() ? name.split(" ")[0] : "Farmer");

        String village = sessionManager.getVillage();
        String district = sessionManager.getDistrict();
        String loc = "";
        if (village != null && !village.isEmpty()) {
            loc += village;
        }
        if (district != null && !district.isEmpty()) {
            if (!loc.isEmpty()) loc += ", ";
            loc += district + " District";
        }
        if (loc.isEmpty()) {
            loc = "Location not set";
        }
        binding.tvUserLocation.setText(loc);
    }

    private void loadUserProfile() {
        String authToken = "Bearer " + sessionManager.getToken();
        RetrofitClient.getApiService().getMe(authToken).enqueue(new Callback<UserOut>() {
            @Override
            public void onResponse(Call<UserOut> call, Response<UserOut> response) {
                if (isAdded() && response.isSuccessful() && response.body() != null) {
                    UserOut user = response.body();
                    String village = user.getVillage() != null ? user.getVillage() : "";
                    String district = user.getDistrict() != null ? user.getDistrict() : "";
                    sessionManager.saveUserDetails(user.getName(), user.getPhone(), village, district, user.getProfileImage());
                    updateUserHeader();
                }
            }

            @Override
            public void onFailure(Call<UserOut> call, Throwable t) {}
        });
    }

    private void filterByCategory(String catKey) {
        if (catKey != null && catKey.equalsIgnoreCase(selectedCategory)) {
            selectedCategory = null;
            Toast.makeText(requireContext(), "Showing all machinery categories", Toast.LENGTH_SHORT).show();
        } else {
            selectedCategory = catKey;
            String displayTitle = catKey.substring(0, 1).toUpperCase() + catKey.substring(1) + "s";
            Toast.makeText(requireContext(), "Filtered: " + displayTitle, Toast.LENGTH_SHORT).show();
        }
        updateCategoryCardSelectionUI();
        applyCurrentFilters();
    }

    private void updateCategoryCardSelectionUI() {
        if (binding == null) return;
        int activeBorderColor = Color.parseColor("#2E7D32");
        int activeBgColor = Color.parseColor("#F0FDF4");
        int inactiveBgColor = Color.parseColor("#FFFFFF");

        int strokePx = (int) (2 * getResources().getDisplayMetrics().density);

        // Tractors Card
        boolean isTractor = "tractor".equalsIgnoreCase(selectedCategory);
        binding.cardCatTractors.setStrokeColor(activeBorderColor);
        binding.cardCatTractors.setStrokeWidth(isTractor ? strokePx : 0);
        binding.cardCatTractors.setCardBackgroundColor(isTractor ? activeBgColor : inactiveBgColor);

        // Harvesters Card
        boolean isHarvester = "harvester".equalsIgnoreCase(selectedCategory);
        binding.cardCatHarvesters.setStrokeColor(activeBorderColor);
        binding.cardCatHarvesters.setStrokeWidth(isHarvester ? strokePx : 0);
        binding.cardCatHarvesters.setCardBackgroundColor(isHarvester ? activeBgColor : inactiveBgColor);

        // Implements Card
        boolean isImplement = "implement".equalsIgnoreCase(selectedCategory);
        binding.cardCatImplements.setStrokeColor(activeBorderColor);
        binding.cardCatImplements.setStrokeWidth(isImplement ? strokePx : 0);
        binding.cardCatImplements.setCardBackgroundColor(isImplement ? activeBgColor : inactiveBgColor);

        // Drones Card
        boolean isDrone = "drone".equalsIgnoreCase(selectedCategory);
        binding.cardCatDrones.setStrokeColor(activeBorderColor);
        binding.cardCatDrones.setStrokeWidth(isDrone ? strokePx : 0);
        binding.cardCatDrones.setCardBackgroundColor(isDrone ? activeBgColor : inactiveBgColor);
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

    private void applyCurrentFilters() {
        String query = binding.etSearchQuery.getText().toString().trim();

        Double minPrice = null;
        String minPriceStr = binding.etMinPrice.getText().toString().trim();
        if (!TextUtils.isEmpty(minPriceStr)) {
            try { minPrice = Double.parseDouble(minPriceStr); } catch (NumberFormatException ignored) {}
        }

        Double maxPrice = null;
        String maxPriceStr = binding.etMaxPrice.getText().toString().trim();
        if (!TextUtils.isEmpty(maxPriceStr)) {
            try { maxPrice = Double.parseDouble(maxPriceStr); } catch (NumberFormatException ignored) {}
        }

        Double radius = 20.0;
        String radiusStr = binding.etRadius.getText().toString().trim();
        if (!TextUtils.isEmpty(radiusStr)) {
            try { radius = Double.parseDouble(radiusStr); } catch (NumberFormatException ignored) {}
        }

        loadNearbyEquipment(query.isEmpty() ? null : query, selectedCategory, minPrice, radius, maxPrice);
    }

    private void resetFilters() {
        binding.etSearchQuery.setText("");
        binding.etMinPrice.setText("");
        binding.etMaxPrice.setText("");
        binding.etRadius.setText("20");
        selectedCategory = null;
        updateCategoryCardSelectionUI();
        loadNearbyEquipment(null, null, null, 20.0, null);
    }

    private void loadNearbyEquipment(String query, String category, Double minPrice, Double radiusKm, Double maxPrice) {
        binding.progressBar.setVisibility(View.VISIBLE);
        binding.tvEmpty.setVisibility(View.GONE);

        String authToken = "Bearer " + sessionManager.getToken();
        
        double defaultLat = 23.0225;
        double defaultLng = 72.5714;

        Call<List<Equipment>> call = RetrofitClient.getApiService().getNearbyEquipment(
                defaultLat, defaultLng, radiusKm, minPrice, maxPrice, category, query, authToken
        );

        call.enqueue(new Callback<List<Equipment>>() {
            @Override
            public void onResponse(Call<List<Equipment>> call, Response<List<Equipment>> response) {
                if (isAdded()) {
                    binding.progressBar.setVisibility(View.GONE);
                    if (response.isSuccessful() && response.body() != null) {
                        List<Equipment> items = response.body();
                        adapter.setItems(items);
                        if (items.isEmpty()) {
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
