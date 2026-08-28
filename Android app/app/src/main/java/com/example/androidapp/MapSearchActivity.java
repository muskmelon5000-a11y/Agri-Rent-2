package com.example.androidapp;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
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

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
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

    private static final int LOCATION_PERMISSION_REQUEST_CODE = 1001;

    private ActivityMapSearchBinding binding;
    private MapEquipmentAdapter adapter;
    private SessionManager sessionManager;
    private List<Equipment> equipmentList = new ArrayList<>();
    
    private double searchLat = 23.0225; // Default center fallback
    private double searchLng = 72.5714;
    private double currentMapCenterLat = 23.0225;
    private double currentMapCenterLng = 72.5714;
    
    private final ExecutorService executorService = Executors.newSingleThreadExecutor();
    private boolean isMapLoaded = false;
    private LocationManager locationManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityMapSearchBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        sessionManager = new SessionManager(this);
        locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);

        setupWebView();
        setupRecyclerView();

        binding.btnBack.setOnClickListener(v -> finish());

        binding.btnSearch.setOnClickListener(v -> performGeocodingSearch());

        binding.etSearchQuery.setOnEditorActionListener((v, actionId, event) -> {
            if (actionId == EditorInfo.IME_ACTION_SEARCH ||
                (event != null && event.getKeyCode() == KeyEvent.KEYCODE_ENTER)) {
                performGeocodingSearch();
                return true;
            }
            return false;
        });

        binding.btnSearchArea.setOnClickListener(v -> {
            searchLat = currentMapCenterLat;
            searchLng = currentMapCenterLng;
            binding.btnSearchArea.setVisibility(View.GONE);
            updateSearchLocationOnMap();
            loadNearbyEquipment();
        });

        binding.btnLocate.setOnClickListener(v -> requestDeviceGPSLocation());
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
                requestDeviceGPSLocation();
            }
        });

        binding.wvMap.loadUrl("file:///android_asset/map.html");
    }

    private void setupRecyclerView() {
        binding.rvEquipment.setLayoutManager(new LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false));
        adapter = new MapEquipmentAdapter(equipment -> {
            Intent intent = new Intent(MapSearchActivity.this, EquipmentDetailActivity.class);
            intent.putExtra("equipment_id", equipment.getId());
            startActivity(intent);
        });
        binding.rvEquipment.setAdapter(adapter);

        PagerSnapHelper snapHelper = new PagerSnapHelper();
        snapHelper.attachToRecyclerView(binding.rvEquipment);

        binding.rvEquipment.addOnScrollListener(new androidx.recyclerview.widget.RecyclerView.OnScrollListener() {
            @Override
            public void onScrollStateChanged(@NonNull androidx.recyclerview.widget.RecyclerView recyclerView, int newState) {
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

    private void requestDeviceGPSLocation() {
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED &&
            ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            
            ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION},
                    LOCATION_PERMISSION_REQUEST_CODE);
            return;
        }

        try {
            Location gpsLoc = null;
            Location netLoc = null;

            if (locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)) {
                gpsLoc = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER);
            }
            if (locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER)) {
                netLoc = locationManager.getLastKnownLocation(LocationManager.NETWORK_PROVIDER);
            }

            Location bestLoc = gpsLoc != null ? gpsLoc : netLoc;

            if (bestLoc != null) {
                applyGPSLocation(bestLoc.getLatitude(), bestLoc.getLongitude());
            } else {
                // Register one-shot location listener if last known is null
                LocationListener listener = new LocationListener() {
                    @Override
                    public void onLocationChanged(@NonNull Location location) {
                        applyGPSLocation(location.getLatitude(), location.getLongitude());
                        locationManager.removeUpdates(this);
                    }
                    @Override public void onStatusChanged(String provider, int status, Bundle extras) {}
                    @Override public void onProviderEnabled(@NonNull String provider) {}
                    @Override public void onProviderDisabled(@NonNull String provider) {}
                };

                if (locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)) {
                    locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 1000, 10, listener);
                } else if (locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER)) {
                    locationManager.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 1000, 10, listener);
                } else {
                    updateSearchLocationOnMap();
                    loadNearbyEquipment();
                }
            }
        } catch (Exception e) {
            updateSearchLocationOnMap();
            loadNearbyEquipment();
        }
    }

    private void applyGPSLocation(double lat, double lng) {
        searchLat = lat;
        searchLng = lng;
        binding.btnSearchArea.setVisibility(View.GONE);

        if (isMapLoaded) {
            binding.wvMap.post(() -> binding.wvMap.loadUrl("javascript:setUserLocation(" + lat + "," + lng + ")"));
        }
        loadNearbyEquipment();
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == LOCATION_PERMISSION_REQUEST_CODE) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                requestDeviceGPSLocation();
            } else {
                updateSearchLocationOnMap();
                loadNearbyEquipment();
            }
        }
    }

    private void updateSearchLocationOnMap() {
        if (isMapLoaded) {
            binding.wvMap.post(() -> binding.wvMap.loadUrl("javascript:centerMap(" + searchLat + "," + searchLng + ",13)"));
        }
    }

    private void focusMapMarker(String eqId) {
        if (isMapLoaded) {
            binding.wvMap.post(() -> binding.wvMap.loadUrl("javascript:focusMarker('" + eqId + "')"));
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
                        binding.wvMap.post(() -> binding.wvMap.loadUrl("javascript:setMarkers('" + json.replace("'", "\\'") + "')"));
                    }
                } else {
                    Toast.makeText(MapSearchActivity.this, "Loaded 0 machinery nearby", Toast.LENGTH_SHORT).show();
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
                connection.setRequestProperty("User-Agent", "CropMateAndroidClient");
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
                
                float[] results = new float[1];
                android.location.Location.distanceBetween(searchLat, searchLng, lat, lng, results);
                if (results[0] > 3000) {
                    binding.btnSearchArea.setVisibility(View.VISIBLE);
                } else {
                    binding.btnSearchArea.setVisibility(View.GONE);
                }
            });
        }
    }
}
