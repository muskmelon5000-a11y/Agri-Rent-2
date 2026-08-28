package com.example.androidapp;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;

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

        // Customize primary button text if logged in
        if (sessionManager.isLoggedIn()) {
            String userName = sessionManager.getName();
            if (userName != null && !userName.isEmpty()) {
                binding.btnGetStarted.setText("CONTINUE AS " + userName.split(" ")[0].toUpperCase() + "  ➔");
            } else {
                binding.btnGetStarted.setText("CONTINUE TO DASHBOARD  ➔");
            }
            binding.btnCreateAccount.setVisibility(View.GONE);
        } else {
            binding.btnGetStarted.setText("GET STARTED / LOGIN  ➔");
            binding.btnCreateAccount.setVisibility(View.VISIBLE);
        }

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

        // Primary Action: Get Started / Login Click
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

        // Secondary Action: Register Free Click
        binding.btnCreateAccount.setOnClickListener(v -> {
            Intent intent = new Intent(CropMateActivity.this, SignupActivity.class);
            startActivity(intent);
        });
    }
}
