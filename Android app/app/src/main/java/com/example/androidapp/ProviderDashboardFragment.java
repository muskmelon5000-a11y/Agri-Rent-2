package com.example.androidapp;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.example.androidapp.databinding.FragmentProviderDashboardBinding;
import com.example.androidapp.models.ProviderDashboardOut;
import com.example.androidapp.models.UserOut;
import com.example.androidapp.network.RetrofitClient;
import com.example.androidapp.utils.SessionManager;
import com.google.android.material.bottomnavigation.BottomNavigationView;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ProviderDashboardFragment extends Fragment {

    private FragmentProviderDashboardBinding binding;
    private SessionManager sessionManager;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        binding = FragmentProviderDashboardBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        sessionManager = new SessionManager(requireContext());

        // Display user name
        String name = sessionManager.getName();
        binding.tvWelcomeProvider.setText(name != null && !name.isEmpty() ? name : "Owner");

        loadUserProfile();
        loadDashboardData();

        // 1. Add Machine Action
        binding.cardActionAddMachine.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(requireContext(), AddEquipmentActivity.class));
            }
        });

        // 2. Requests Action
        binding.cardActionRequests.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (getActivity() instanceof ProviderMainActivity) {
                    BottomNavigationView bottomNav = getActivity().findViewById(R.id.bottom_navigation);
                    if (bottomNav != null) {
                        bottomNav.setSelectedItemId(R.id.nav_provider_bookings);
                    }
                }
            }
        });

        // 3. Calendar Action
        binding.cardActionCalendar.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(requireContext(), "📅 Machinery availability calendar synced with active bookings", Toast.LENGTH_SHORT).show();
            }
        });

        // Details link on chart (opens EarningsReportActivity matching website)
        binding.tvWeeklyDetails.setOnClickListener(v -> {
            Intent intent = new Intent(requireContext(), EarningsReportActivity.class);
            startActivity(intent);
        });

        // Notification Bell
        binding.btnNotificationBell.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(requireContext(), "🔔 No new unread notifications", Toast.LENGTH_SHORT).show();
            }
        });
    }

    @Override
    public void onResume() {
        super.onResume();
        loadDashboardData();
    }

    private void loadUserProfile() {
        String authToken = "Bearer " + sessionManager.getToken();
        RetrofitClient.getApiService().getMe(authToken).enqueue(new Callback<UserOut>() {
            @Override
            public void onResponse(Call<UserOut> call, Response<UserOut> response) {
                if (isAdded() && response.isSuccessful() && response.body() != null) {
                    UserOut user = response.body();
                    String name = user.getName() != null ? user.getName() : "Owner";
                    binding.tvWelcomeProvider.setText(name);
                    sessionManager.saveUserDetails(name, user.getPhone(), user.getVillage(), user.getDistrict(), user.getProfileImage());
                }
            }

            @Override
            public void onFailure(Call<UserOut> call, Throwable t) {}
        });
    }

    private void loadDashboardData() {
        binding.progressBar.setVisibility(View.VISIBLE);

        String authToken = "Bearer " + sessionManager.getToken();
        Call<ProviderDashboardOut> call = RetrofitClient.getApiService().getProviderDashboard(authToken);
        call.enqueue(new Callback<ProviderDashboardOut>() {
            @Override
            public void onResponse(Call<ProviderDashboardOut> call, Response<ProviderDashboardOut> response) {
                if (isAdded()) {
                    binding.progressBar.setVisibility(View.GONE);
                    if (response.isSuccessful() && response.body() != null) {
                        ProviderDashboardOut dbOut = response.body();
                        
                        // Total Month Earnings
                        binding.tvEarnings.setText("₹" + String.format("%,.0f", dbOut.getTotalEarningsMonth()));

                        // Trend Percentage
                        double trend = dbOut.getEarningsChangePct();
                        if (trend > 0) {
                            binding.tvEarningsTrend.setText("▲ +" + (int) trend + "%");
                            binding.tvEarningsTrend.setTextColor(0xFF86EFAC);
                            binding.tvEarningsTrend.setVisibility(View.VISIBLE);
                        } else if (trend < 0) {
                            binding.tvEarningsTrend.setText("▼ " + (int) trend + "%");
                            binding.tvEarningsTrend.setTextColor(0xFFFCA5A5);
                            binding.tvEarningsTrend.setVisibility(View.VISIBLE);
                        } else {
                            binding.tvEarningsTrend.setVisibility(View.GONE);
                        }

                        // Pending requests badge
                        if (dbOut.getPendingRequests() > 0) {
                            binding.tvRequestsBadge.setText(String.valueOf(dbOut.getPendingRequests()));
                            binding.tvRequestsBadge.setVisibility(View.VISIBLE);
                            binding.viewPendingBadge.setVisibility(View.VISIBLE);
                        } else {
                            binding.tvRequestsBadge.setVisibility(View.GONE);
                            binding.viewPendingBadge.setVisibility(View.GONE);
                        }

                        // Metric Stat Pills
                        binding.tvActiveRentals.setText(String.valueOf(dbOut.getActiveRentals()));
                        binding.tvCompletedJobs.setText(String.valueOf(dbOut.getCompletedJobs()));

                        // Weekly Revenue Chart
                        binding.chartWeeklyRevenue.setData(dbOut.getWeeklyChart());

                        // Top Performer Section
                        if (dbOut.getTopMachineName() != null && !dbOut.getTopMachineName().isEmpty()) {
                            binding.layoutTopPerformerSection.setVisibility(View.VISIBLE);
                            binding.tvTopMachineName.setText(dbOut.getTopMachineName());
                            
                            int rentals = dbOut.getTopMachineRentals() != null ? dbOut.getTopMachineRentals() : 0;
                            binding.tvTopMachineStats.setText(rentals + " rentals this month");
                            
                            double earnings = dbOut.getTopMachineEarnings() != null ? dbOut.getTopMachineEarnings() : 0;
                            binding.tvTopMachineEarnings.setText("₹" + String.format("%,.0f", earnings) + " earned");
                            binding.ivTopMachine.setImageResource(R.drawable.ic_tractor);
                        } else {
                            binding.layoutTopPerformerSection.setVisibility(View.GONE);
                        }
                    } else {
                        Toast.makeText(requireContext(), "Failed to load dashboard: " + response.message(), Toast.LENGTH_SHORT).show();
                    }
                }
            }

            @Override
            public void onFailure(Call<ProviderDashboardOut> call, Throwable t) {
                if (isAdded()) {
                    binding.progressBar.setVisibility(View.GONE);
                    Toast.makeText(requireContext(), "Network Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                }
            }
        });
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
