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

        sessionManager = new SessionManager(this);

        // Auto-navigate if already logged in
        if (sessionManager.isLoggedIn()) {
            String role = sessionManager.getRole();
            Intent intent;
            if ("provider".equalsIgnoreCase(role)) {
                intent = new Intent(this, ProviderMainActivity.class);
            } else {
                intent = new Intent(this, SeekerMainActivity.class);
            }
            startActivity(intent);
            finish();
            return;
        }

        binding = ActivityCropMateBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        // Get Started / Login Click
        binding.btnGetStarted.setOnClickListener(v -> {
            Intent intent = new Intent(CropMateActivity.this, LoginActivity.class);
            startActivity(intent);
        });

        // Register Free Click
        binding.btnCreateAccount.setOnClickListener(v -> {
            Intent intent = new Intent(CropMateActivity.this, SignupActivity.class);
            startActivity(intent);
        });
    }
}
