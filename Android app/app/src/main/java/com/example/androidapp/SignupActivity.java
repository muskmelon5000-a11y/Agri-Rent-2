package com.example.androidapp;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.androidapp.databinding.ActivitySignupBinding;
import com.example.androidapp.models.OTPResponse;
import com.example.androidapp.models.SendOTPRequest;
import com.example.androidapp.models.SignupRequest;
import com.example.androidapp.models.TokenResponse;
import com.example.androidapp.network.RetrofitClient;
import com.example.androidapp.utils.SessionManager;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class SignupActivity extends AppCompatActivity {

    private ActivitySignupBinding binding;
    private SessionManager sessionManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivitySignupBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        sessionManager = new SessionManager(this);

        binding.btnSendOtp.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                requestOTP();
            }
        });

        binding.btnSignUp.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                performSignup();
            }
        });

        binding.tvSignInLink.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });
    }

    private void requestOTP() {
        String email = binding.etEmail.getText().toString().trim();

        if (TextUtils.isEmpty(email)) {
            binding.etEmail.setError("Email is required for OTP");
            return;
        }

        binding.btnSendOtp.setEnabled(false);
        binding.btnSendOtp.setText("Sending...");

        SendOTPRequest request = new SendOTPRequest(email);
        Call<OTPResponse> call = RetrofitClient.getApiService().sendOtp(request);
        call.enqueue(new Callback<OTPResponse>() {
            @Override
            public void onResponse(Call<OTPResponse> call, Response<OTPResponse> response) {
                binding.btnSendOtp.setEnabled(true);
                binding.btnSendOtp.setText("Send OTP");

                if (response.isSuccessful() && response.body() != null) {
                    OTPResponse otpResponse = response.body();
                    String msg = otpResponse.getMessage();
                    
                    // If in development mode and dev_otp is populated
                    if (otpResponse.getDevOtp() != null) {
                        msg += "\n[DEV MODE] OTP: " + otpResponse.getDevOtp();
                        binding.etOtp.setText(otpResponse.getDevOtp());
                    }
                    
                    Toast.makeText(SignupActivity.this, msg, Toast.LENGTH_LONG).show();
                } else {
                    Toast.makeText(SignupActivity.this, "Failed to send OTP", Toast.LENGTH_LONG).show();
                }
            }

            @Override
            public void onFailure(Call<OTPResponse> call, Throwable t) {
                binding.btnSendOtp.setEnabled(true);
                binding.btnSendOtp.setText("Send OTP");
                Toast.makeText(SignupActivity.this, "Network Error: " + t.getMessage(), Toast.LENGTH_LONG).show();
            }
        });
    }

    private void performSignup() {
        String name = binding.etName.getText().toString().trim();
        String email = binding.etEmail.getText().toString().trim();
        String otp = binding.etOtp.getText().toString().trim();
        String password = binding.etPassword.getText().toString().trim();
        String phone = binding.etPhone.getText().toString().trim();
        String village = binding.etVillage.getText().toString().trim();
        String district = binding.etDistrict.getText().toString().trim();

        String role = binding.rbProvider.isChecked() ? "provider" : "seeker";

        if (TextUtils.isEmpty(name)) {
            binding.etName.setError("Name is required");
            return;
        }

        if (TextUtils.isEmpty(email)) {
            binding.etEmail.setError("Email is required");
            return;
        }

        if (TextUtils.isEmpty(otp)) {
            binding.etOtp.setError("OTP code is required");
            return;
        }

        if (TextUtils.isEmpty(password) || password.length() < 6) {
            binding.etPassword.setError("Password must be at least 6 characters");
            return;
        }

        binding.btnSignUp.setEnabled(false);
        binding.btnSignUp.setText("Registering...");

        SignupRequest signupRequest = new SignupRequest(
                email,
                name,
                password,
                role,
                otp,
                TextUtils.isEmpty(village) ? null : village,
                TextUtils.isEmpty(district) ? null : district,
                TextUtils.isEmpty(phone) ? null : phone
        );

        Call<TokenResponse> call = RetrofitClient.getApiService().signup(signupRequest);
        call.enqueue(new Callback<TokenResponse>() {
            @Override
            public void onResponse(Call<TokenResponse> call, Response<TokenResponse> response) {
                binding.btnSignUp.setEnabled(true);
                binding.btnSignUp.setText("Sign Up");

                if (response.isSuccessful() && response.body() != null) {
                    TokenResponse tokenResponse = response.body();

                    // Save session details
                    sessionManager.saveSession(
                            tokenResponse.getAccessToken(),
                            tokenResponse.getUserId(),
                            tokenResponse.getRole(),
                            tokenResponse.getName() != null ? tokenResponse.getName() : name
                    );

                    Toast.makeText(SignupActivity.this, "Registration Successful!", Toast.LENGTH_SHORT).show();
                    navigateToMain(tokenResponse.getRole());
                } else {
                    Toast.makeText(SignupActivity.this, "Registration failed: " + response.message(), Toast.LENGTH_LONG).show();
                }
            }

            @Override
            public void onFailure(Call<TokenResponse> call, Throwable t) {
                binding.btnSignUp.setEnabled(true);
                binding.btnSignUp.setText("Sign Up");
                Toast.makeText(SignupActivity.this, "Network Error: " + t.getMessage(), Toast.LENGTH_LONG).show();
            }
        });
    }

    private void navigateToMain(String role) {
        Intent intent;
        if ("provider".equalsIgnoreCase(role)) {
            intent = new Intent(SignupActivity.this, ProviderMainActivity.class);
        } else {
            intent = new Intent(SignupActivity.this, SeekerMainActivity.class);
        }
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(intent);
        finish();
    }
}
