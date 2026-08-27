package com.example.androidapp;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
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

        // Switch Role Button Click
        binding.btnSwitchRole.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String currentRole = sessionManager.getRole();
                String targetRole = "provider".equalsIgnoreCase(currentRole) ? "seeker" : "provider";

                // Update active role in shared preferences
                SharedPreferences pref = requireContext().getSharedPreferences("AgrirentSession", Context.MODE_PRIVATE);
                pref.edit().putString("user_role", targetRole).apply();

                Toast.makeText(requireContext(), "Switched to " + 
                        ("provider".equalsIgnoreCase(targetRole) ? "Owner (Provider)" : "Farmer (Seeker)") + " mode", 
                        Toast.LENGTH_SHORT).show();

                // Restart app on main screen based on new role
                Intent intent;
                if ("provider".equalsIgnoreCase(targetRole)) {
                    intent = new Intent(requireContext(), ProviderMainActivity.class);
                } else {
                    intent = new Intent(requireContext(), SeekerMainActivity.class);
                }
                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                startActivity(intent);
                requireActivity().finish();
            }
        });

        // Click Actions for Menu List
        binding.cardBadges.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(requireContext(), "🎖️ Skill Badges coming soon!", Toast.LENGTH_SHORT).show();
            }
        });

        binding.cardLeaderboard.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(requireContext(), "📊 Village Leaderboard coming soon!", Toast.LENGTH_SHORT).show();
            }
        });

        binding.cardSettings.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(requireContext(), "⚙️ App Settings coming soon!", Toast.LENGTH_SHORT).show();
            }
        });

        binding.cardHelp.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(requireContext(), "❓ Help & Support coming soon!", Toast.LENGTH_SHORT).show();
            }
        });

        // Logout click
        binding.cardLogout.setOnClickListener(new View.OnClickListener() {
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

                        String name = user.getName() != null ? user.getName() : "Farmer";
                        binding.tvName.setText(name);

                        // Set initials avatar
                        if (!name.isEmpty()) {
                            binding.tvAvatarInitials.setText(String.valueOf(name.charAt(0)).toUpperCase());
                        }

                        binding.tvPhone.setText(user.getPhone() != null ? "+91 " + user.getPhone() : "+91 00000 00000");

                        String loc = (user.getVillage() != null ? user.getVillage() : "") +
                                (user.getDistrict() != null ? ", " + user.getDistrict() : "");
                        binding.tvLocation.setText(loc.isEmpty() ? "Location details missing" : loc);

                        binding.tvPoints.setText(String.valueOf(user.getSkillPoints()));

                        String role = sessionManager.getRole();
                        if ("provider".equalsIgnoreCase(role)) {
                            binding.tvRoleContext.setText("You are browsing as Owner (Provider)");
                            binding.btnSwitchRole.setText("Switch to Seeker");
                        } else {
                            binding.tvRoleContext.setText("You are browsing as Farmer (Seeker)");
                            binding.btnSwitchRole.setText("Switch to Provider");
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
