package com.example.androidapp;

import android.content.Intent;
import android.content.res.ColorStateList;
import android.graphics.Color;
import android.os.Bundle;
import android.view.View;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.example.androidapp.adapters.EquipmentAdapter;
import com.example.androidapp.databinding.ActivityCategoryListingBinding;
import com.example.androidapp.models.Equipment;
import com.example.androidapp.network.RetrofitClient;
import com.example.androidapp.utils.SessionManager;
import com.google.android.material.button.MaterialButton;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class CategoryListingActivity extends AppCompatActivity {

    private ActivityCategoryListingBinding binding;
    private SessionManager sessionManager;
    private EquipmentAdapter adapter;
    private String currentCategory = "tractor";
    private List<Equipment> allCategoryItems = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityCategoryListingBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        sessionManager = new SessionManager(this);

        if (getIntent().hasExtra("category")) {
            currentCategory = getIntent().getStringExtra("category");
            if (currentCategory == null || currentCategory.isEmpty()) {
                currentCategory = "tractor";
            }
        }

        binding.btnBack.setOnClickListener(v -> finish());

        setupRecyclerView();
        setupTabButtons();
        setupFilterChips();

        selectCategory(currentCategory);
    }

    private void setupRecyclerView() {
        binding.rvCategoryEquipment.setLayoutManager(new LinearLayoutManager(this));
        adapter = new EquipmentAdapter(new EquipmentAdapter.OnItemClickListener() {
            @Override
            public void onItemClick(Equipment equipment) {
                Intent intent = new Intent(CategoryListingActivity.this, EquipmentDetailActivity.class);
                intent.putExtra("equipment_id", equipment.getId());
                startActivity(intent);
            }
        });
        binding.rvCategoryEquipment.setAdapter(adapter);
    }

    private void setupTabButtons() {
        binding.btnTabTractor.setOnClickListener(v -> selectCategory("tractor"));
        binding.btnTabHarvester.setOnClickListener(v -> selectCategory("harvester"));
        binding.btnTabImplement.setOnClickListener(v -> selectCategory("implement"));
        binding.btnTabDrone.setOnClickListener(v -> selectCategory("drone"));
    }

    private void selectCategory(String catKey) {
        this.currentCategory = catKey.toLowerCase();
        updateTabStyles();

        String headerTitle;
        switch (currentCategory) {
            case "harvester":
                headerTitle = "Harvesters";
                break;
            case "implement":
                headerTitle = "Implements";
                break;
            case "drone":
                headerTitle = "Drones";
                break;
            case "tractor":
            default:
                headerTitle = "Tractors";
                break;
        }

        binding.tvHeaderTitle.setText(headerTitle);
        binding.tvEmpty.setText("No " + headerTitle + " found nearby");

        loadCategoryData(currentCategory);
    }

    private void updateTabStyles() {
        int activeBg = Color.parseColor("#2E7D32");
        int activeText = Color.WHITE;

        int inactiveText = Color.parseColor("#4B5563");

        styleButton(binding.btnTabTractor, "tractor".equalsIgnoreCase(currentCategory), activeBg, activeText, inactiveText);
        styleButton(binding.btnTabHarvester, "harvester".equalsIgnoreCase(currentCategory), activeBg, activeText, inactiveText);
        styleButton(binding.btnTabImplement, "implement".equalsIgnoreCase(currentCategory), activeBg, activeText, inactiveText);
        styleButton(binding.btnTabDrone, "drone".equalsIgnoreCase(currentCategory), activeBg, activeText, inactiveText);
    }

    private void styleButton(MaterialButton button, boolean isActive, int activeBg, int activeText, int inactiveText) {
        if (isActive) {
            button.setBackgroundTintList(ColorStateList.valueOf(activeBg));
            button.setTextColor(activeText);
            button.setStrokeWidth(0);
        } else {
            button.setBackgroundTintList(ColorStateList.valueOf(Color.WHITE));
            button.setTextColor(inactiveText);
            button.setStrokeColor(ColorStateList.valueOf(Color.parseColor("#E5E7EB")));
            button.setStrokeWidth((int) (1 * getResources().getDisplayMetrics().density));
        }
    }

    private void setupFilterChips() {
        binding.chipAvailableNow.setOnCheckedChangeListener((buttonView, isChecked) -> applyLocalChipsFilter());
        binding.chipUnder1500.setOnCheckedChangeListener((buttonView, isChecked) -> applyLocalChipsFilter());
        binding.chipHighHp.setOnCheckedChangeListener((buttonView, isChecked) -> applyLocalChipsFilter());
    }

    private void applyLocalChipsFilter() {
        if (allCategoryItems == null || allCategoryItems.isEmpty()) return;

        List<Equipment> filtered = new ArrayList<>();
        boolean availableOnly = binding.chipAvailableNow.isChecked();
        boolean under1500 = binding.chipUnder1500.isChecked();
        boolean highHp = binding.chipHighHp.isChecked();

        for (Equipment eq : allCategoryItems) {
            boolean pass = true;

            if (availableOnly && !eq.isAvailable()) {
                pass = false;
            }
            if (under1500 && eq.getPricePerDay() > 1500) {
                pass = false;
            }
            if (highHp) {
                int hp = eq.getHp() != null ? eq.getHp() : 0;
                if (hp < 45 || hp > 65) {
                    pass = false;
                }
            }

            if (pass) {
                filtered.add(eq);
            }
        }

        adapter.setItems(filtered);
        binding.layoutEmpty.setVisibility(filtered.isEmpty() ? View.VISIBLE : View.GONE);
    }

    private void loadCategoryData(String category) {
        binding.progressBar.setVisibility(View.VISIBLE);
        binding.layoutEmpty.setVisibility(View.GONE);

        String authToken = "Bearer " + sessionManager.getToken();
        double defaultLat = 23.0225;
        double defaultLng = 72.5714;

        Call<List<Equipment>> call = RetrofitClient.getApiService().getNearbyEquipment(
                defaultLat, defaultLng, 30.0, null, null, category, null, authToken
        );

        call.enqueue(new Callback<List<Equipment>>() {
            @Override
            public void onResponse(Call<List<Equipment>> call, Response<List<Equipment>> response) {
                binding.progressBar.setVisibility(View.GONE);
                if (response.isSuccessful() && response.body() != null) {
                    allCategoryItems = response.body();
                    applyLocalChipsFilter();
                } else {
                    Toast.makeText(CategoryListingActivity.this, "Failed to load category listings", Toast.LENGTH_SHORT).show();
                    binding.layoutEmpty.setVisibility(View.VISIBLE);
                }
            }

            @Override
            public void onFailure(Call<List<Equipment>> call, Throwable t) {
                binding.progressBar.setVisibility(View.GONE);
                Toast.makeText(CategoryListingActivity.this, "Network error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                binding.layoutEmpty.setVisibility(View.VISIBLE);
            }
        });
    }
}
