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

        // Customize button text if already logged in
        if (sessionManager.isLoggedIn()) {
            String userName = sessionManager.getName();
            if (userName != null && !userName.isEmpty()) {
                binding.btnGetStarted.setText("Continue as " + userName.split(" ")[0] + " ➔");
            } else {
                binding.btnGetStarted.setText("Continue to Dashboard ➔");
            }
            binding.btnCreateAccount.setVisibility(View.GONE);
        } else {
            binding.btnGetStarted.setText("Get Started / Login ➔");
            binding.btnCreateAccount.setVisibility(View.VISIBLE);
        }

        // Get Started / Login Click
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
                finish();
            } else {
                Intent intent = new Intent(CropMateActivity.this, LoginActivity.class);
                startActivity(intent);
            }
        });

        // Register Free Click
        binding.btnCreateAccount.setOnClickListener(v -> {
            Intent intent = new Intent(CropMateActivity.this, SignupActivity.class);
            startActivity(intent);
        });
    }
}
