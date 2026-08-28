package com.example.androidapp;

import android.content.Intent;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

import com.example.androidapp.databinding.ActivityCropMateBinding;
import com.example.androidapp.utils.SessionManager;

public class CropMateActivity extends AppCompatActivity {

    private ActivityCropMateBinding binding;
    private SessionManager sessionManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityCropMateBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        sessionManager = new SessionManager(this);

        // Keep 100% fixed text matching screenshot
        binding.btnGetStarted.setText("GET STARTED / LOGIN  ➔");
        binding.btnCreateAccount.setText("NEW TO CROPMATE? REGISTER FREE");

        // Card 1 Workflow: Rent Machinery (Seeker Discovery Flow)
        binding.cardRentMachinery.setOnClickListener(v -> {
            if (sessionManager.isLoggedIn()) {
                sessionManager.saveSession(sessionManager.getToken(), sessionManager.getUserId(), sessionManager.getName(), "seeker");
                Intent intent = new Intent(CropMateActivity.this, SeekerMainActivity.class);
                startActivity(intent);
            } else {
                Intent intent = new Intent(CropMateActivity.this, LoginActivity.class);
                intent.putExtra("target_role", "seeker");
                startActivity(intent);
            }
        });

        // Card 2 Workflow: List Your Machinery (Provider Operations Flow)
        binding.cardListMachinery.setOnClickListener(v -> {
            if (sessionManager.isLoggedIn()) {
                sessionManager.saveSession(sessionManager.getToken(), sessionManager.getUserId(), sessionManager.getName(), "provider");
                Intent intent = new Intent(CropMateActivity.this, ProviderMainActivity.class);
                startActivity(intent);
            } else {
                Intent intent = new Intent(CropMateActivity.this, LoginActivity.class);
                intent.putExtra("target_role", "provider");
                startActivity(intent);
            }
        });

        // Card 3 Workflow: Join Our Community
        binding.cardJoinCommunity.setOnClickListener(v -> {
            if (sessionManager.isLoggedIn()) {
                Intent intent = new Intent(CropMateActivity.this, SeekerMainActivity.class);
                startActivity(intent);
            } else {
                Intent intent = new Intent(CropMateActivity.this, SignupActivity.class);
                startActivity(intent);
            }
        });

        // Primary Action: GET STARTED / LOGIN Click
        binding.btnGetStarted.setOnClickListener(v -> {
            if (sessionManager.isLoggedIn()) {
                String role = sessionManager.getRole();
                Intent intent;
                if ("provider".equalsIgnoreCase(role)) {
                    intent = new Intent(CropMateActivity.this, ProviderMainActivity.class);
                } else {
                    intent = new Intent(CropMateActivity.this, SeekerMainActivity.class);
                }
                startActivity(intent);
            } else {
                Intent intent = new Intent(CropMateActivity.this, LoginActivity.class);
                startActivity(intent);
            }
        });

        // Secondary Action: NEW TO CROPMATE? REGISTER FREE Click
        binding.btnCreateAccount.setOnClickListener(v -> {
            Intent intent = new Intent(CropMateActivity.this, SignupActivity.class);
            startActivity(intent);
        });
    }
}
