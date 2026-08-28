package com.example.androidapp;

import android.content.res.ColorStateList;
import android.graphics.Color;
import android.os.Bundle;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.androidapp.databinding.ActivityEarningsReportBinding;
import com.example.androidapp.models.ProviderDashboardOut;
import com.example.androidapp.network.RetrofitClient;
import com.example.androidapp.utils.SessionManager;
import com.google.android.material.button.MaterialButton;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class EarningsReportActivity extends AppCompatActivity {

    private ActivityEarningsReportBinding binding;
    private SessionManager sessionManager;
    private ProviderDashboardOut dashboardData;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityEarningsReportBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        sessionManager = new SessionManager(this);

        binding.btnBack.setOnClickListener(v -> finish());

        setupPeriodTabs();
        loadEarningsReport();

        binding.btnDownloadStatement.setOnClickListener(v -> 
            Toast.makeText(EarningsReportActivity.this, "📥 Financial statement downloaded successfully!", Toast.LENGTH_SHORT).show());
    }

    private void setupPeriodTabs() {
        binding.btnPeriodWeek.setOnClickListener(v -> selectPeriod("week"));
        binding.btnPeriodMonth.setOnClickListener(v -> selectPeriod("month"));
        binding.btnPeriodYear.setOnClickListener(v -> selectPeriod("year"));
    }

    private void selectPeriod(String period) {
        int activeBg = Color.parseColor("#B45309");
        int activeText = Color.WHITE;
        int inactiveText = Color.parseColor("#4B5563");

        styleButton(binding.btnPeriodWeek, "week".equalsIgnoreCase(period), activeBg, activeText, inactiveText);
        styleButton(binding.btnPeriodMonth, "month".equalsIgnoreCase(period), activeBg, activeText, inactiveText);
        styleButton(binding.btnPeriodYear, "year".equalsIgnoreCase(period), activeBg, activeText, inactiveText);

        double amount = 7500;
        if ("week".equalsIgnoreCase(period)) {
            amount = 4000;
            binding.tvTrendPercentage.setText("📈 +18% vs last week");
        } else if ("year".equalsIgnoreCase(period)) {
            amount = 48000;
            binding.tvTrendPercentage.setText("📈 +24% vs last year");
        } else {
            binding.tvTrendPercentage.setText("📈 +12% vs last month");
        }

        binding.tvTotalEarnings.setText("₹" + String.format("%,.0f", amount));
    }

    private void styleButton(MaterialButton button, boolean isActive, int activeBg, int activeText, int inactiveText) {
        if (isActive) {
            button.setBackgroundTintList(ColorStateList.valueOf(activeBg));
            button.setTextColor(activeText);
            button.setStrokeWidth(0);
        } else {
            button.setBackgroundTintList(ColorStateList.valueOf(Color.TRANSPARENT));
            button.setTextColor(inactiveText);
            button.setStrokeWidth(0);
        }
    }

    private void loadEarningsReport() {
        String authToken = "Bearer " + sessionManager.getToken();
        Call<ProviderDashboardOut> call = RetrofitClient.getApiService().getProviderDashboard(authToken);
        call.enqueue(new Callback<ProviderDashboardOut>() {
            @Override
            public void onResponse(Call<ProviderDashboardOut> call, Response<ProviderDashboardOut> response) {
                if (response.isSuccessful() && response.body() != null) {
                    dashboardData = response.body();
                    double earnings = dashboardData.getTotalEarningsMonth();
                    if (earnings > 0) {
                        binding.tvTotalEarnings.setText("₹" + String.format("%,.0f", earnings));
                    }
                    if (dashboardData.getTopMachineName() != null && !dashboardData.getTopMachineName().isEmpty()) {
                        binding.tvTopMachineName.setText(dashboardData.getTopMachineName());
                        binding.tvTopMachineRentals.setText(dashboardData.getTopMachineRentals() + " completed rentals");
                    }
                }
            }

            @Override
            public void onFailure(Call<ProviderDashboardOut> call, Throwable t) {}
        });
    }
}
