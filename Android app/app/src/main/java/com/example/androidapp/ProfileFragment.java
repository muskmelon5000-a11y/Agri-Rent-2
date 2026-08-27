package com.example.androidapp;

import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.example.androidapp.databinding.FragmentProfileBinding;
import com.example.androidapp.models.UserOut;
import com.example.androidapp.network.RetrofitClient;
import com.example.androidapp.utils.SessionManager;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ProfileFragment extends Fragment {

    private FragmentProfileBinding binding;
    private SessionManager sessionManager;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        binding = FragmentProfileBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        sessionManager = new SessionManager(requireContext());

        loadUserProfile();

        binding.btnLogout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                sessionManager.logout();
                Toast.makeText(requireContext(), "Logged out successfully", Toast.LENGTH_SHORT).show();
                Intent intent = new Intent(requireContext(), LoginActivity.class);
                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                startActivity(intent);
                requireActivity().finish();
            }
        });
    }

    private void loadUserProfile() {
        binding.progressBar.setVisibility(View.VISIBLE);

        String authToken = "Bearer " + sessionManager.getToken();
        Call<UserOut> call = RetrofitClient.getApiService().getMe(authToken);
        call.enqueue(new Callback<UserOut>() {
            @Override
            public void onResponse(Call<UserOut> call, Response<UserOut> response) {
                if (isAdded()) {
                    binding.progressBar.setVisibility(View.GONE);
                    if (response.isSuccessful() && response.body() != null) {
                        UserOut user = response.body();
                        
                        binding.tvName.setText(user.getName() != null ? user.getName() : "User");
                        binding.tvEmail.setText(user.getEmail());
                        binding.tvPhone.setText(user.getPhone() != null ? user.getPhone() : "Not Provided");
                        
                        String loc = (user.getVillage() != null ? user.getVillage() : "") + 
                                      (user.getDistrict() != null ? ", " + user.getDistrict() : "");
                        binding.tvLocation.setText(loc.isEmpty() ? "Not Provided" : loc);
                        
                        binding.tvPoints.setText(user.getSkillPoints() + " pts");

                        String role = user.getRole();
                        if ("provider".equalsIgnoreCase(role)) {
                            binding.tvRole.setText("Equipment Owner (Provider)");
                            binding.tvRole.setTextColor(Color.parseColor("#0D47A1"));
                            binding.tvRole.getBackground().setTint(Color.parseColor("#E3F2FD"));
                        } else {
                            binding.tvRole.setText("Farmer (Seeker)");
                            binding.tvRole.setTextColor(Color.parseColor("#1B5E20"));
                            binding.tvRole.getBackground().setTint(Color.parseColor("#E8F5E9"));
                        }
                    } else {
                        Toast.makeText(requireContext(), "Failed to load profile details", Toast.LENGTH_SHORT).show();
                    }
                }
            }

            @Override
            public void onFailure(Call<UserOut> call, Throwable t) {
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
