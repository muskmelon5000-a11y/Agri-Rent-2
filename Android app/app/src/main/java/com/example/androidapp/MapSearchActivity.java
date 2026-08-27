package com.example.androidapp;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.text.TextUtils;
import android.view.KeyEvent;
import android.view.View;
import android.view.inputmethod.EditorInfo;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.PagerSnapHelper;

import com.example.androidapp.adapters.MapEquipmentAdapter;
import com.example.androidapp.databinding.ActivityMapSearchBinding;
import com.example.androidapp.models.Equipment;
import com.example.androidapp.network.RetrofitClient;
import com.example.androidapp.utils.SessionManager;
import com.google.gson.Gson;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MapSearchActivity extends AppCompatActivity {

    private ActivityMapSearchBinding binding;
    private MapEquipmentAdapter adapter;
    private SessionManager sessionManager;
    private List<Equipment> equipmentList = new ArrayList<>();
    
    private double searchLat = 23.0225; // Default Anandpur/Ahmedabad center
    private double searchLng = 72.5714;
    private double currentMapCenterLat = 23.0225;
    private double currentMapCenterLng = 72.5714;
    
    private final ExecutorService executorService = Executors.newSingleThreadExecutor();
    private boolean isMapLoaded = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityMapSearchBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        sessionManager = new SessionManager(this);

        setupWebView();
        setupRecyclerView();

        binding.btnBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        binding.btnSearch.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                performGeocodingSearch();
            }
        });

        binding.etSearchQuery.setOnEditorActionListener(new TextView.OnEditorActionListener() {
            @Override
            public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {
                if (actionId == EditorInfo.IME_ACTION_SEARCH ||
                    (event != null && event.getKeyCode() == KeyEvent.KEYCODE_ENTER)) {
                    performGeocodingSearch();
                    return true;
                }
                return false;
            }
        });

        binding.btnSearchArea.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                searchLat = currentMapCenterLat;
                searchLng = currentMapCenterLng;
                binding.btnSearchArea.setVisibility(View.GONE);
                updateSearchLocationOnMap();
                loadNearbyEquipment();
            }
        });

        binding.btnLocate.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Return to default GPS/User Center
                searchLat = 23.0225;
                searchLng = 72.5714;
                binding.btnSearchArea.setVisibility(View.GONE);
                updateSearchLocationOnMap();
                loadNearbyEquipment();
            }
        });
    }

    private void setupWebView() {
        WebSettings settings = binding.wvMap.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        
        binding.wvMap.addJavascriptInterface(new AndroidBridge(), "AndroidBridge");
        
        binding.wvMap.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                isMapLoaded = true;
                updateSearchLocationOnMap();
                loadNearbyEquipment();
            }
        });

        binding.wvMap.loadUrl("file:///android_asset/map.html");
    }

    private void setupRecyclerView() {
        binding.rvEquipment.setLayoutManager(new LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false));
        adapter = new MapEquipmentAdapter(new MapEquipmentAdapter.OnItemClickListener() {
            @Override
            public void onItemClick(Equipment equipment) {
                Intent intent = new Intent(MapSearchActivity.this, EquipmentDetailActivity.class);
                intent.putExtra("equipment_id", equipment.getId());
                startActivity(intent);
            }
        });
        binding.rvEquipment.setAdapter(adapter);

        // Snap helper to scroll item by item
        PagerSnapHelper snapHelper = new PagerSnapHelper();
        snapHelper.attachToRecyclerView(binding.rvEquipment);

        // Scroll listener to focus map marker when item changes
        binding.rvEquipment.addOnScrollListener(new androidx.recyclerview.widget.RecyclerView.OnScrollListener() {
            @Override
            public void onScrollStateChanged(androidx.recyclerview.widget.RecyclerView recyclerView, int newState) {
                super.onScrollStateChanged(recyclerView, newState);
                if (newState == androidx.recyclerview.widget.RecyclerView.SCROLL_STATE_IDLE) {
                    LinearLayoutManager lm = (LinearLayoutManager) recyclerView.getLayoutManager();
                    if (lm != null) {
                        int pos = lm.findFirstCompletelyVisibleItemPosition();
                        if (pos != -1 && pos < equipmentList.size()) {
                            Equipment selected = equipmentList.get(pos);
                            focusMapMarker(selected.getId());
                        }
                    }
                }
            }
        });
    }

    private void updateSearchLocationOnMap() {
        if (isMapLoaded) {
            binding.wvMap.post(() -> {
                binding.wvMap.loadUrl("javascript:centerMap(" + searchLat + "," + searchLng + ")");
            });
        }
    }

    private void focusMapMarker(String eqId) {
        if (isMapLoaded) {
            binding.wvMap.post(() -> {
                binding.wvMap.loadUrl("javascript:focusMarker('" + eqId + "')");
            });
        }
    }

    private void loadNearbyEquipment() {
        binding.progressBar.setVisibility(View.VISIBLE);
        String authToken = "Bearer " + sessionManager.getToken();

        Call<List<Equipment>> call = RetrofitClient.getApiService().getNearbyEquipment(
                searchLat, searchLng, 20.0, null, null, null, null, authToken
        );

        call.enqueue(new Callback<List<Equipment>>() {
            @Override
            public void onResponse(Call<List<Equipment>> call, Response<List<Equipment>> response) {
                binding.progressBar.setVisibility(View.GONE);
                if (response.isSuccessful() && response.body() != null) {
                    equipmentList = response.body();
                    adapter.setItems(equipmentList);
                    
                    if (isMapLoaded) {
                        String json = new Gson().toJson(equipmentList);
                        binding.wvMap.post(() -> {
                            binding.wvMap.loadUrl("javascript:setMarkers('" + json.replace("'", "\\'") + "')");
                        });
                    }
                } else {
                    Toast.makeText(MapSearchActivity.this, "Failed to load machinery nearby", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<List<Equipment>> call, Throwable t) {
                binding.progressBar.setVisibility(View.GONE);
                Toast.makeText(MapSearchActivity.this, "Network Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void performGeocodingSearch() {
        final String query = binding.etSearchQuery.getText().toString().trim();
        if (TextUtils.isEmpty(query)) return;

        binding.progressBar.setVisibility(View.VISIBLE);

        executorService.execute(() -> {
            HttpURLConnection connection = null;
            BufferedReader reader = null;
            try {
                String searchUrl = "https://nominatim.openstreetmap.org/search?format=json&q=" 
                        + java.net.URLEncoder.encode(query, "UTF-8") + "&limit=1&countrycodes=in";
                
                URL url = new URL(searchUrl);
                connection = (HttpURLConnection) url.openConnection();
                connection.setRequestMethod("GET");
                connection.setRequestProperty("User-Agent", "AgriRentAndroidClient");
                connection.setConnectTimeout(8000);
                connection.setReadTimeout(8000);

                int responseCode = connection.getResponseCode();
                if (responseCode == HttpURLConnection.HTTP_OK) {
                    StringBuilder response = new StringBuilder();
                    reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                    String line;
                    while ((line = reader.readLine()) != null) {
                        response.append(line);
                    }

                    JSONArray jsonArray = new JSONArray(response.toString());
                    if (jsonArray.length() > 0) {
                        JSONObject first = jsonArray.getJSONObject(0);
                        final double lat = first.getDouble("lat");
                        final double lon = first.getDouble("lon");

                        new Handler(Looper.getMainLooper()).post(() -> {
                            binding.progressBar.setVisibility(View.GONE);
                            searchLat = lat;
                            searchLng = lon;
                            binding.btnSearchArea.setVisibility(View.GONE);
                            updateSearchLocationOnMap();
                            loadNearbyEquipment();
                        });
                    } else {
                        showErrorToast("Location not found. Try searching for a district or state name.");
                    }
                } else {
                    showErrorToast("Search failed. Please try again.");
                }
            } catch (Exception e) {
                showErrorToast("Network Error: Unable to complete search.");
            } finally {
                if (reader != null) {
                    try { reader.close(); } catch (Exception ignored) {}
                }
                if (connection != null) {
                    connection.disconnect();
                }
            }
        });
    }

    private void showErrorToast(final String msg) {
        new Handler(Looper.getMainLooper()).post(() -> {
            binding.progressBar.setVisibility(View.GONE);
            Toast.makeText(MapSearchActivity.this, msg, Toast.LENGTH_SHORT).show();
        });
    }

    private class AndroidBridge {
        @JavascriptInterface
        public void onMarkerSelected(final String eqId) {
            new Handler(Looper.getMainLooper()).post(() -> {
                for (int i = 0; i < equipmentList.size(); i++) {
                    if (equipmentList.get(i).getId().equals(eqId)) {
                        binding.rvEquipment.smoothScrollToPosition(i);
                        break;
                    }
                }
            });
        }

        @JavascriptInterface
        public void onMapMoved(final double lat, final double lng) {
            new Handler(Looper.getMainLooper()).post(() -> {
                currentMapCenterLat = lat;
                currentMapCenterLng = lng;
                
                // Show "Search this area" button if user panned away from the search center
                float[] results = new float[1];
                android.location.Location.distanceBetween(searchLat, searchLng, lat, lng, results);
                if (results[0] > 3000) { // 3km pan threshold
                    binding.btnSearchArea.setVisibility(View.VISIBLE);
                } else {
                    binding.btnSearchArea.setVisibility(View.GONE);
                }
            });
        }
    }
}
