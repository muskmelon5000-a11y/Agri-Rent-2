package com.example.androidapp;

import android.os.Bundle;
import android.view.MenuItem;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;

import com.example.androidapp.databinding.ActivityProviderMainBinding;
import com.example.androidapp.utils.SessionManager;
import com.google.android.material.navigation.NavigationBarView;

public class ProviderMainActivity extends AppCompatActivity {

    private ActivityProviderMainBinding binding;
    private SessionManager sessionManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityProviderMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        sessionManager = new SessionManager(this);

        // Load default fragment
        loadFragment(new ProviderDashboardFragment());

        binding.bottomNavigation.setOnItemSelectedListener(new NavigationBarView.OnItemSelectedListener() {
            @Override
            public boolean onNavigationItemSelected(@NonNull MenuItem item) {
                Fragment fragment = null;
                int itemId = item.getItemId();
                if (itemId == R.id.nav_provider_dashboard) {
                    fragment = new ProviderDashboardFragment();
                } else if (itemId == R.id.nav_provider_listings) {
                    fragment = new ProviderListingsFragment();
                } else if (itemId == R.id.nav_provider_bookings) {
                    fragment = new ProviderBookingsFragment();
                } else if (itemId == R.id.nav_provider_profile) {
                    fragment = new ProfileFragment();
                }
                return loadFragment(fragment);
            }
        });
    }

    private boolean loadFragment(Fragment fragment) {
        if (fragment != null) {
            getSupportFragmentManager()
                    .beginTransaction()
                    .replace(R.id.fragment_container, fragment)
                    .commit();
            return true;
        }
        return false;
    }
}
