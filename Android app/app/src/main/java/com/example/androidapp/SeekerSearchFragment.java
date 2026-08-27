package com.example.androidapp;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.EditorInfo;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.example.androidapp.adapters.EquipmentAdapter;
import com.example.androidapp.databinding.FragmentSeekerSearchBinding;
import com.example.androidapp.models.Equipment;
import com.example.androidapp.network.RetrofitClient;
import com.example.androidapp.utils.SessionManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class SeekerSearchFragment extends Fragment {

    private FragmentSeekerSearchBinding binding;
    private EquipmentAdapter adapter;
    private SessionManager sessionManager;
    private List<Equipment> currentList = new ArrayList<>();

    private static final String[] SORT_OPTIONS = {
            "Sort: Distance",
            "Sort: Price Low-High",
            "Sort: Price High-Low",
            "Sort: Rating"
    };

    private static final String[] CATEGORIES = {
            "All Categories",
            "Tractor",
            "Harvester",
            "Drone",
            "Implement"
    };

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        binding = FragmentSeekerSearchBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        sessionManager = new SessionManager(requireContext());

        setupSpinners();
        setupRecyclerView();

        // Header Map Button
        binding.btnHeaderMap.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(requireContext(), MapSearchActivity.class);
                startActivity(intent);
            }
        });

        // Filter Toggle Button
        binding.btnFiltersToggle.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                int vis = binding.layoutFiltersBox.getVisibility() == View.VISIBLE ? View.GONE : View.VISIBLE;
                binding.layoutFiltersBox.setVisibility(vis);
            }
        });

        // Search Submit Button
        binding.btnSearchSubmit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                performSearch();
            }
        });

        binding.btnApplySearchFilters.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                performSearch();
            }
        });

        binding.etSearchQuery.setOnEditorActionListener(new TextView.OnEditorActionListener() {
            @Override
            public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {
                if (actionId == EditorInfo.IME_ACTION_SEARCH ||
                        (event != null && event.getKeyCode() == KeyEvent.KEYCODE_ENTER)) {
                    performSearch();
                    return true;
                }
                return false;
            }
        });

        // Initial Load
        performSearch();
    }

    private void setupSpinners() {
        // Sort Spinner
        ArrayAdapter<String> sortAdapter = new ArrayAdapter<>(
                requireContext(),
                android.R.layout.simple_spinner_item,
                SORT_OPTIONS
        );
        sortAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        binding.spinnerSort.setAdapter(sortAdapter);

        binding.spinnerSort.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                applySorting(position);
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {}
        });

        // Category Spinner
        ArrayAdapter<String> catAdapter = new ArrayAdapter<>(
                requireContext(),
                android.R.layout.simple_spinner_item,
                CATEGORIES
        );
        catAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        binding.spinnerSearchCategory.setAdapter(catAdapter);
    }

    private void setupRecyclerView() {
        binding.rvSearchResults.setLayoutManager(new LinearLayoutManager(requireContext()));
        adapter = new EquipmentAdapter(new EquipmentAdapter.OnItemClickListener() {
            @Override
            public void onItemClick(Equipment equipment) {
                Intent intent = new Intent(requireContext(), EquipmentDetailActivity.class);
                intent.putExtra("equipment_id", equipment.getId());
                startActivity(intent);
            }
        });
        binding.rvSearchResults.setAdapter(adapter);
    }

    private void performSearch() {
        binding.progressBar.setVisibility(View.VISIBLE);
        binding.tvEmptyResults.setVisibility(View.GONE);

        final String query = binding.etSearchQuery.getText().toString().trim();
        String selectedCategory = binding.spinnerSearchCategory.getSelectedItem() != null ?
                binding.spinnerSearchCategory.getSelectedItem().toString() : "All Categories";
        String category = "All Categories".equalsIgnoreCase(selectedCategory) ? null : selectedCategory;

        Double minPrice = null;
        String minPriceStr = binding.etFilterMinPrice.getText().toString().trim();
        if (!TextUtils.isEmpty(minPriceStr)) {
            try { minPrice = Double.parseDouble(minPriceStr); } catch (NumberFormatException ignored) {}
        }

        Double maxPrice = null;
        String maxPriceStr = binding.etFilterMaxPrice.getText().toString().trim();
        if (!TextUtils.isEmpty(maxPriceStr)) {
            try { maxPrice = Double.parseDouble(maxPriceStr); } catch (NumberFormatException ignored) {}
        }

        String authToken = "Bearer " + sessionManager.getToken();
        double defaultLat = 23.0225;
        double defaultLng = 72.5714;

        Call<List<Equipment>> call = RetrofitClient.getApiService().getNearbyEquipment(
                defaultLat, defaultLng, 25.0, minPrice, maxPrice, category, query.isEmpty() ? null : query, authToken
        );

        call.enqueue(new Callback<List<Equipment>>() {
            @Override
            public void onResponse(Call<List<Equipment>> call, Response<List<Equipment>> response) {
                if (isAdded()) {
                    binding.progressBar.setVisibility(View.GONE);
                    if (response.isSuccessful() && response.body() != null) {
                        currentList = new ArrayList<>(response.body());
                        applySorting(binding.spinnerSort.getSelectedItemPosition());

                        if (query.isEmpty()) {
                            binding.tvResultsCount.setText(currentList.size() + " machinery available");
                        } else {
                            binding.tvResultsCount.setText(currentList.size() + " results for \"" + query + "\"");
                        }

                        if (currentList.isEmpty()) {
                            binding.tvEmptyResults.setVisibility(View.VISIBLE);
                        }
                    } else {
                        Toast.makeText(requireContext(), "Search failed: " + response.message(), Toast.LENGTH_SHORT).show();
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

    private void applySorting(int sortIndex) {
        if (currentList == null || currentList.isEmpty()) return;

        switch (sortIndex) {
            case 0: // Distance
                Collections.sort(currentList, new Comparator<Equipment>() {
                    @Override
                    public int compare(Equipment o1, Equipment o2) {
                        Double d1 = o1.getDistanceKm() != null ? o1.getDistanceKm() : 999.0;
                        Double d2 = o2.getDistanceKm() != null ? o2.getDistanceKm() : 999.0;
                        return Double.compare(d1, d2);
                    }
                });
                break;
            case 1: // Price Low-High
                Collections.sort(currentList, new Comparator<Equipment>() {
                    @Override
                    public int compare(Equipment o1, Equipment o2) {
                        return Double.compare(o1.getPricePerDay(), o2.getPricePerDay());
                    }
                });
                break;
            case 2: // Price High-Low
                Collections.sort(currentList, new Comparator<Equipment>() {
                    @Override
                    public int compare(Equipment o1, Equipment o2) {
                        return Double.compare(o2.getPricePerDay(), o1.getPricePerDay());
                    }
                });
                break;
            case 3: // Rating
                Collections.sort(currentList, new Comparator<Equipment>() {
                    @Override
                    public int compare(Equipment o1, Equipment o2) {
                        return Double.compare(o2.getRating(), o1.getRating());
                    }
                });
                break;
        }

        adapter.setItems(new ArrayList<>(currentList));
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
