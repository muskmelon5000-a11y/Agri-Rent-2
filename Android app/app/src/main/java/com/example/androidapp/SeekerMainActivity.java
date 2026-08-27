package com.example.androidapp;

import android.os.Bundle;
import android.view.MenuItem;
import android.content.Intent;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;

import com.example.androidapp.databinding.ActivitySeekerMainBinding;
import com.google.android.material.navigation.NavigationBarView;
import com.example.androidapp.utils.SessionManager;

public class SeekerMainActivity extends AppCompatActivity {

    private ActivitySeekerMainBinding binding;
    private SessionManager sessionManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivitySeekerMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        sessionManager = new SessionManager(this);

        // Load default fragment
        loadFragment(new SeekerHomeFragment());

        binding.bottomNavigation.setOnItemSelectedListener(new NavigationBarView.OnItemSelectedListener() {
            @Override
            public boolean onNavigationItemSelected(@NonNull MenuItem item) {
                Fragment fragment = null;
                int itemId = item.getItemId();
                if (itemId == R.id.nav_home) {
                    fragment = new SeekerHomeFragment();
                } else if (itemId == R.id.nav_search) {
                    // Open Home Fragment (which holds search & filters)
                    fragment = new SeekerHomeFragment();
                } else if (itemId == R.id.nav_map) {
                    // Start full screen Map Search Activity directly
                    Intent intent = new Intent(SeekerMainActivity.this, MapSearchActivity.class);
                    startActivity(intent);
                    return false;
                } else if (itemId == R.id.nav_bookings) {
                    fragment = new SeekerBookingsFragment();
                } else if (itemId == R.id.nav_profile) {
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
