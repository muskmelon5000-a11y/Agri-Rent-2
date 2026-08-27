package com.example.androidapp;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.androidapp.databinding.ActivityLoginBinding;
import com.example.androidapp.models.LoginRequest;
import com.example.androidapp.models.TokenResponse;
import com.example.androidapp.network.RetrofitClient;
import com.example.androidapp.utils.SessionManager;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class LoginActivity extends AppCompatActivity {

    private ActivityLoginBinding binding;
    private SessionManager sessionManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityLoginBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        sessionManager = new SessionManager(this);

        // Check if user is already logged in
        if (sessionManager.isLoggedIn()) {
            navigateToMain(sessionManager.getRole());
            return;
        }

        binding.btnSignIn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                performLogin();
            }
        });

        binding.tvSignUpLink.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(LoginActivity.this, SignupActivity.class));
            }
        });
    }

    private void performLogin() {
        String email = binding.etEmail.getText().toString().trim();
        String password = binding.etPassword.getText().toString().trim();

        if (TextUtils.isEmpty(email)) {
            binding.etEmail.setError("Email is required");
            return;
        }

        if (TextUtils.isEmpty(password)) {
            binding.etPassword.setError("Password is required");
            return;
        }

        binding.btnSignIn.setEnabled(false);
        binding.btnSignIn.setText("Signing In...");

        LoginRequest loginRequest = new LoginRequest(email, password);
        Call<TokenResponse> call = RetrofitClient.getApiService().login(loginRequest);
        call.enqueue(new Callback<TokenResponse>() {
            @Override
            public void onResponse(Call<TokenResponse> call, Response<TokenResponse> response) {
                binding.btnSignIn.setEnabled(true);
                binding.btnSignIn.setText("Sign In");

                if (response.isSuccessful() && response.body() != null) {
                    TokenResponse tokenResponse = response.body();
                    
                    // Save session details
                    sessionManager.saveSession(
                            tokenResponse.getAccessToken(),
                            tokenResponse.getUserId(),
                            tokenResponse.getRole(),
                            tokenResponse.getName() != null ? tokenResponse.getName() : "User"
                    );

                    Toast.makeText(LoginActivity.this, "Welcome " + sessionManager.getName(), Toast.LENGTH_SHORT).show();
                    navigateToMain(tokenResponse.getRole());
                } else {
                    String errorMsg = "Login failed: " + response.message();
                    if (response.code() == 401) {
                        errorMsg = "Invalid email or password";
                    }
                    Toast.makeText(LoginActivity.this, errorMsg, Toast.LENGTH_LONG).show();
                }
            }

            @Override
            public void onFailure(Call<TokenResponse> call, Throwable t) {
                binding.btnSignIn.setEnabled(true);
                binding.btnSignIn.setText("Sign In");
                Toast.makeText(LoginActivity.this, "Network Error: " + t.getMessage(), Toast.LENGTH_LONG).show();
            }
        });
    }

    private void navigateToMain(String role) {
        Intent intent;
        if ("provider".equalsIgnoreCase(role)) {
            intent = new Intent(LoginActivity.this, ProviderMainActivity.class);
        } else {
            intent = new Intent(LoginActivity.this, SeekerMainActivity.class);
        }
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(intent);
        finish();
    }
}
