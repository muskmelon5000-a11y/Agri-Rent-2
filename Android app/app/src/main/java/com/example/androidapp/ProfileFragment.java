package com.example.androidapp;

import android.app.Dialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.example.androidapp.databinding.FragmentProfileBinding;
import com.example.androidapp.models.ProviderDashboardOut;
import com.example.androidapp.models.UserOut;
import com.example.androidapp.models.UserUpdate;
import com.example.androidapp.network.RetrofitClient;
import com.example.androidapp.utils.SessionManager;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.button.MaterialButton;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ProfileFragment extends Fragment {

    private FragmentProfileBinding binding;
    private SessionManager sessionManager;
    private UserOut currentUser;
    private String selectedAvatarIcon = "";
    private ProviderDashboardOut providerDashboard;

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
        setupRoleSpecificUI();

        // Edit Profile Click
        View.OnClickListener editClickListener = v -> showEditProfileDialog();
        binding.cardAvatarContainer.setOnClickListener(editClickListener);
        binding.btnEditProfilePencil.setOnClickListener(editClickListener);

        // Switch Role Button Click
        binding.btnSwitchRole.setOnClickListener(v -> {
            String currentRole = sessionManager.getRole();
            String targetRole = "provider".equalsIgnoreCase(currentRole) ? "seeker" : "provider";

            SharedPreferences pref = requireContext().getSharedPreferences("AgrirentSession", Context.MODE_PRIVATE);
            pref.edit().putString("user_role", targetRole).apply();

            Toast.makeText(requireContext(), "Switched to " + 
                    ("provider".equalsIgnoreCase(targetRole) ? "Owner (Provider)" : "Farmer (Seeker)") + " mode", 
                    Toast.LENGTH_SHORT).show();

            Intent intent;
            if ("provider".equalsIgnoreCase(targetRole)) {
                intent = new Intent(requireContext(), ProviderMainActivity.class);
            } else {
                intent = new Intent(requireContext(), SeekerMainActivity.class);
            }
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
            startActivity(intent);
            requireActivity().finish();
        });

        // Provider Menu Items
        binding.cardEarningsReport.setOnClickListener(v -> showEarningsDialog());

        binding.cardCompletedJobs.setOnClickListener(v -> {
            if (getActivity() instanceof ProviderMainActivity) {
                BottomNavigationView bottomNav = getActivity().findViewById(R.id.bottom_navigation);
                if (bottomNav != null) {
                    bottomNav.setSelectedItemId(R.id.nav_provider_bookings);
                }
            } else {
                Toast.makeText(requireContext(), "✅ 2 Completed machinery rentals on record", Toast.LENGTH_SHORT).show();
            }
        });

        binding.cardFleetHealth.setOnClickListener(v -> {
            if (getActivity() instanceof ProviderMainActivity) {
                BottomNavigationView bottomNav = getActivity().findViewById(R.id.bottom_navigation);
                if (bottomNav != null) {
                    bottomNav.setSelectedItemId(R.id.nav_provider_listings);
                }
            }
        });

        // General Menu Items
        binding.cardBadges.setOnClickListener(v -> 
            Toast.makeText(requireContext(), "🎖️ 3 New Skill Badges unlocked!", Toast.LENGTH_SHORT).show());

        binding.cardLeaderboard.setOnClickListener(v -> 
            Toast.makeText(requireContext(), "🏆 Village Leaderboard: Rank #4 in your district", Toast.LENGTH_SHORT).show());

        binding.cardSettings.setOnClickListener(v -> 
            Toast.makeText(requireContext(), "⚙️ App Settings & Notification preferences active", Toast.LENGTH_SHORT).show());

        binding.cardHelp.setOnClickListener(v -> 
            Toast.makeText(requireContext(), "❓ 24x7 Farmer & Provider Support Helpline: 1800-AGRI-RENT", Toast.LENGTH_LONG).show());

        // Logout
        binding.cardLogout.setOnClickListener(v -> {
            sessionManager.logout();
            Toast.makeText(requireContext(), "Logged out successfully", Toast.LENGTH_SHORT).show();
            Intent intent = new Intent(requireContext(), LoginActivity.class);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
            startActivity(intent);
            requireActivity().finish();
        });
    }

    @Override
    public void onResume() {
        super.onResume();
        loadUserProfile();
    }

    private void setupRoleSpecificUI() {
        String role = sessionManager.getRole();
        boolean isProvider = "provider".equalsIgnoreCase(role);

        if (isProvider) {
            binding.layoutProfileHeaderContainer.setBackgroundColor(Color.parseColor("#B45309"));
            binding.tvProfileSubtitle.setText("PROVIDER PROFILE & ACCOUNT");
            binding.tvProfileSubtitle.setTextColor(Color.parseColor("#FDE68A"));
            binding.btnEditProfilePencil.setCardBackgroundColor(Color.parseColor("#B45309"));

            binding.layoutProviderSection.setVisibility(View.VISIBLE);
            binding.tvCurrentRoleTitle.setText("Current Role");
            binding.tvRoleContext.setText("You are browsing as a Provider");
            binding.btnSwitchRole.setText("Switch to Seeker");
            binding.btnSwitchRole.setTextColor(Color.parseColor("#B45309"));
            binding.btnSwitchRole.setStrokeColor(android.content.res.ColorStateList.valueOf(Color.parseColor("#FDE68A")));
            binding.cardRoleSwitcher.setCardBackgroundColor(Color.parseColor("#FEF3C7"));
            binding.tvPointsLabel.setText("Machinery Points");
            loadProviderStats();
        } else {
            binding.layoutProfileHeaderContainer.setBackgroundColor(Color.parseColor("#2E7D32"));
            binding.tvProfileSubtitle.setText("FARMER PROFILE & ACCOUNT");
            binding.tvProfileSubtitle.setTextColor(Color.parseColor("#C8E6C9"));
            binding.btnEditProfilePencil.setCardBackgroundColor(Color.parseColor("#2E7D32"));

            binding.layoutProviderSection.setVisibility(View.GONE);
            binding.tvCurrentRoleTitle.setText("Current Role");
            binding.tvRoleContext.setText("You are browsing as a Seeker");
            binding.btnSwitchRole.setText("Switch to Provider");
            binding.btnSwitchRole.setTextColor(Color.parseColor("#2E7D32"));
            binding.btnSwitchRole.setStrokeColor(android.content.res.ColorStateList.valueOf(Color.parseColor("#C8E6C9")));
            binding.cardRoleSwitcher.setCardBackgroundColor(Color.parseColor("#E8F5E9"));
            binding.tvPointsLabel.setText("Skill Points");
        }
    }

    private void loadProviderStats() {
        String authToken = "Bearer " + sessionManager.getToken();
        Call<ProviderDashboardOut> call = RetrofitClient.getApiService().getProviderDashboard(authToken);
        call.enqueue(new Callback<ProviderDashboardOut>() {
            @Override
            public void onResponse(Call<ProviderDashboardOut> call, Response<ProviderDashboardOut> response) {
                if (isAdded() && response.isSuccessful() && response.body() != null) {
                    providerDashboard = response.body();
                    binding.tvProfileEarningsBadge.setText("₹" + String.format("%,.0f", providerDashboard.getTotalEarningsMonth()) + "   ➔");
                    binding.tvProfileCompletedBadge.setText(providerDashboard.getCompletedJobs() + " Jobs   ➔");
                }
            }

            @Override
            public void onFailure(Call<ProviderDashboardOut> call, Throwable t) {}
        });
    }

    private void showEarningsDialog() {
        final Dialog dialog = new Dialog(requireContext());
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        dialog.setContentView(R.layout.dialog_edit_profile); // reuse base window layout styles
        if (dialog.getWindow() != null) {
            dialog.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
            dialog.getWindow().setLayout(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        }

        double monthEarnings = providerDashboard != null ? providerDashboard.getTotalEarningsMonth() : 7500;
        int completed = providerDashboard != null ? providerDashboard.getCompletedJobs() : 2;

        Toast.makeText(requireContext(), "📊 Monthly Earnings: ₹" + String.format("%,.0f", monthEarnings) + " • " + completed + " Jobs Completed", Toast.LENGTH_LONG).show();
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
                        currentUser = response.body();
                        updateUI(currentUser);
                    }
                }
            }

            @Override
            public void onFailure(Call<UserOut> call, Throwable t) {
                if (isAdded()) {
                    binding.progressBar.setVisibility(View.GONE);
                }
            }
        });
    }

    private void updateUI(UserOut user) {
        String name = user.getName() != null && !user.getName().isEmpty() ? user.getName() : "Owner";
        binding.tvName.setText(name);

        String profileImg = user.getProfileImage();
        if (profileImg != null && !profileImg.isEmpty()) {
            binding.tvAvatarInitials.setText(profileImg);
        } else if (!name.isEmpty()) {
            binding.tvAvatarInitials.setText(String.valueOf(name.charAt(0)).toUpperCase());
        }

        binding.tvPhone.setText(user.getPhone() != null && !user.getPhone().isEmpty() ? "+91 " + user.getPhone() : "+91 00000 00000");

        String village = user.getVillage() != null ? user.getVillage() : "";
        String district = user.getDistrict() != null ? user.getDistrict() : "";
        String loc = "";
        if (!village.isEmpty()) loc += village;
        if (!district.isEmpty()) {
            if (!loc.isEmpty()) loc += ", ";
            loc += district;
        }
        binding.tvLocation.setText(loc.isEmpty() ? "Location not provided" : loc);

        sessionManager.saveUserDetails(name, user.getPhone(), village, district, profileImg);
        binding.tvPoints.setText(String.valueOf(user.getSkillPoints()));
    }

    private void showEditProfileDialog() {
        if (currentUser == null) return;

        final Dialog dialog = new Dialog(requireContext());
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        dialog.setContentView(R.layout.dialog_edit_profile);
        if (dialog.getWindow() != null) {
            dialog.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
            dialog.getWindow().setLayout(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        }

        final EditText etName = dialog.findViewById(R.id.etEditName);
        final EditText etPhone = dialog.findViewById(R.id.etEditPhone);
        final EditText etVillage = dialog.findViewById(R.id.etEditVillage);
        final EditText etDistrict = dialog.findViewById(R.id.etEditDistrict);
        final TextView tvSelectedAvatar = dialog.findViewById(R.id.tvEditAvatarPreview);

        etName.setText(currentUser.getName() != null ? currentUser.getName() : "");
        etPhone.setText(currentUser.getPhone() != null ? currentUser.getPhone() : "");
        etVillage.setText(currentUser.getVillage() != null ? currentUser.getVillage() : "");
        etDistrict.setText(currentUser.getDistrict() != null ? currentUser.getDistrict() : "");

        selectedAvatarIcon = currentUser.getProfileImage() != null && !currentUser.getProfileImage().isEmpty()
                ? currentUser.getProfileImage() : "👨‍🌾";
        tvSelectedAvatar.setText(selectedAvatarIcon);

        final View[] presets = new View[]{
                dialog.findViewById(R.id.avatarOpt1),
                dialog.findViewById(R.id.avatarOpt2),
                dialog.findViewById(R.id.avatarOpt3),
                dialog.findViewById(R.id.avatarOpt4),
                dialog.findViewById(R.id.avatarOpt5)
        };
        final String[] emojis = new String[]{"👨‍🌾", "🚜", "🌾", "🧑‍🌾", "🌟"};

        for (int i = 0; i < presets.length; i++) {
            final String emoji = emojis[i];
            presets[i].setOnClickListener(v -> {
                selectedAvatarIcon = emoji;
                tvSelectedAvatar.setText(emoji);
            });
        }

        MaterialButton btnCancel = dialog.findViewById(R.id.btnCancelEdit);
        btnCancel.setOnClickListener(v -> dialog.dismiss());

        MaterialButton btnSave = dialog.findViewById(R.id.btnSaveProfile);
        btnSave.setOnClickListener(v -> {
            String newName = etName.getText().toString().trim();
            String newPhone = etPhone.getText().toString().trim();
            String newVillage = etVillage.getText().toString().trim();
            String newDistrict = etDistrict.getText().toString().trim();

            if (newName.isEmpty()) {
                etName.setError("Name is required");
                return;
            }

            btnSave.setEnabled(false);
            btnSave.setText("Saving...");

            UserUpdate update = new UserUpdate(
                    newName,
                    newPhone.isEmpty() ? null : newPhone,
                    newVillage.isEmpty() ? null : newVillage,
                    newDistrict.isEmpty() ? null : newDistrict,
                    selectedAvatarIcon
            );

            String authToken = "Bearer " + sessionManager.getToken();
            Call<UserOut> call = RetrofitClient.getApiService().updateProfile(update, authToken);
            call.enqueue(new Callback<UserOut>() {
                @Override
                public void onResponse(Call<UserOut> call, Response<UserOut> response) {
                    if (isAdded()) {
                        if (response.isSuccessful() && response.body() != null) {
                            currentUser = response.body();
                            updateUI(currentUser);
                            Toast.makeText(requireContext(), "Profile updated successfully! ✅", Toast.LENGTH_SHORT).show();
                            dialog.dismiss();
                        } else {
                            btnSave.setEnabled(true);
                            btnSave.setText("Save Changes");
                            Toast.makeText(requireContext(), "Failed to update profile", Toast.LENGTH_SHORT).show();
                        }
                    }
                }

                @Override
                public void onFailure(Call<UserOut> call, Throwable t) {
                    if (isAdded()) {
                        btnSave.setEnabled(true);
                        btnSave.setText("Save Changes");
                        Toast.makeText(requireContext(), "Network Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                    }
                }
            });
        });

        dialog.show();
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
