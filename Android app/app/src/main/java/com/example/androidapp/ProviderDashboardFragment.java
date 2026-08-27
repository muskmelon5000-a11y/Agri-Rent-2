package com.example.androidapp;

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
import com.example.androidapp.network.RetrofitClient;
import com.example.androidapp.utils.SessionManager;

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
        binding.tvWelcomeProvider.setText("Welcome, " + (sessionManager.getName() != null ? sessionManager.getName() : "Owner"));

        loadDashboardData();
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
                        
                        binding.tvEarnings.setText("₹" + String.format("%,.0f", dbOut.getTotalEarningsMonth()));
                        binding.tvActiveRentals.setText(String.valueOf(dbOut.getActiveRentals()));
                        binding.tvCompletedJobs.setText(String.valueOf(dbOut.getCompletedJobs()));

                        if (dbOut.getTopMachineName() != null) {
                            binding.tvTopMachineName.setText(dbOut.getTopMachineName());
                            binding.tvTopMachineStats.setText(dbOut.getTopMachineRentals() + " rentals this month");
                            binding.tvTopMachineEarnings.setText("₹" + String.format("%,.0f", dbOut.getTopMachineEarnings()));
                        } else {
                            binding.tvTopMachineName.setText("None");
                            binding.tvTopMachineStats.setText("0 rentals this month");
                            binding.tvTopMachineEarnings.setText("₹0");
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
