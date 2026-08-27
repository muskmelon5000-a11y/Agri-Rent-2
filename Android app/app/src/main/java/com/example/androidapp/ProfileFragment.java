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
import com.example.androidapp.models.UserOut;
import com.example.androidapp.models.UserUpdate;
import com.example.androidapp.network.RetrofitClient;
import com.example.androidapp.utils.SessionManager;
import com.google.android.material.button.MaterialButton;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ProfileFragment extends Fragment {

    private FragmentProfileBinding binding;
    private SessionManager sessionManager;
    private UserOut currentUser;
    private String selectedAvatarIcon = "";

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

        // Edit Profile Click on Avatar or Pencil Icon
        View.OnClickListener editClickListener = new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showEditProfileDialog();
            }
        };

        binding.cardAvatarContainer.setOnClickListener(editClickListener);
        binding.btnEditProfilePencil.setOnClickListener(editClickListener);

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
                        currentUser = response.body();
                        updateUI(currentUser);
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

    private void updateUI(UserOut user) {
        String name = user.getName() != null ? user.getName() : "Farmer";
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

        String role = sessionManager.getRole();
        if ("provider".equalsIgnoreCase(role)) {
            binding.tvRoleContext.setText("You are browsing as Owner (Provider)");
            binding.btnSwitchRole.setText("Switch to Seeker");
        } else {
            binding.tvRoleContext.setText("You are browsing as Farmer (Seeker)");
            binding.btnSwitchRole.setText("Switch to Provider");
        }
    }

    private void showEditProfileDialog() {
        if (!isAdded()) return;

        final Dialog dialog = new Dialog(requireContext());
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        dialog.setContentView(R.layout.dialog_edit_profile);
        if (dialog.getWindow() != null) {
            dialog.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
            dialog.getWindow().setLayout(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        }

        final TextView tvEditAvatarPreview = dialog.findViewById(R.id.tvEditAvatarPreview);
        final EditText etEditName = dialog.findViewById(R.id.etEditName);
        final EditText etEditPhone = dialog.findViewById(R.id.etEditPhone);
        final EditText etEditVillage = dialog.findViewById(R.id.etEditVillage);
        final EditText etEditDistrict = dialog.findViewById(R.id.etEditDistrict);
        final MaterialButton btnCancelEdit = dialog.findViewById(R.id.btnCancelEdit);
        final MaterialButton btnSaveProfile = dialog.findViewById(R.id.btnSaveProfile);

        // Pre-fill existing user info
        String currentName = currentUser != null && currentUser.getName() != null ? currentUser.getName() : sessionManager.getName();
        String currentPhone = currentUser != null && currentUser.getPhone() != null ? currentUser.getPhone() : sessionManager.getPhone();
        String currentVillage = currentUser != null && currentUser.getVillage() != null ? currentUser.getVillage() : sessionManager.getVillage();
        String currentDistrict = currentUser != null && currentUser.getDistrict() != null ? currentUser.getDistrict() : sessionManager.getDistrict();
        String currentImage = currentUser != null && currentUser.getProfileImage() != null ? currentUser.getProfileImage() : sessionManager.getProfileImage();

        if (currentName != null) etEditName.setText(currentName);
        if (currentPhone != null) etEditPhone.setText(currentPhone);
        if (currentVillage != null) etEditVillage.setText(currentVillage);
        if (currentDistrict != null) etEditDistrict.setText(currentDistrict);

        selectedAvatarIcon = currentImage != null ? currentImage : "";
        if (!selectedAvatarIcon.isEmpty()) {
            tvEditAvatarPreview.setText(selectedAvatarIcon);
        } else if (currentName != null && !currentName.isEmpty()) {
            tvEditAvatarPreview.setText(String.valueOf(currentName.charAt(0)).toUpperCase());
        }

        // Avatar preset choices
        TextView opt1 = dialog.findViewById(R.id.avatarOpt1);
        TextView opt2 = dialog.findViewById(R.id.avatarOpt2);
        TextView opt3 = dialog.findViewById(R.id.avatarOpt3);
        TextView opt4 = dialog.findViewById(R.id.avatarOpt4);
        TextView opt5 = dialog.findViewById(R.id.avatarOpt5);

        View.OnClickListener avatarPicker = new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (v instanceof TextView) {
                    selectedAvatarIcon = ((TextView) v).getText().toString();
                    tvEditAvatarPreview.setText(selectedAvatarIcon);
                }
            }
        };

        if (opt1 != null) opt1.setOnClickListener(avatarPicker);
        if (opt2 != null) opt2.setOnClickListener(avatarPicker);
        if (opt3 != null) opt3.setOnClickListener(avatarPicker);
        if (opt4 != null) opt4.setOnClickListener(avatarPicker);
        if (opt5 != null) opt5.setOnClickListener(avatarPicker);

        btnCancelEdit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialog.dismiss();
            }
        });

        btnSaveProfile.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                final String newName = etEditName.getText().toString().trim();
                final String newPhone = etEditPhone.getText().toString().trim();
                final String newVillage = etEditVillage.getText().toString().trim();
                final String newDistrict = etEditDistrict.getText().toString().trim();

                if (newName.isEmpty()) {
                    etEditName.setError("Name cannot be empty");
                    return;
                }

                btnSaveProfile.setEnabled(false);
                btnSaveProfile.setText("Saving...");

                UserUpdate updatePayload = new UserUpdate(
                        newName,
                        newPhone,
                        newVillage,
                        newDistrict,
                        selectedAvatarIcon
                );

                String authToken = "Bearer " + sessionManager.getToken();
                RetrofitClient.getApiService().updateProfile(updatePayload, authToken).enqueue(new Callback<UserOut>() {
                    @Override
                    public void onResponse(Call<UserOut> call, Response<UserOut> response) {
                        if (isAdded()) {
                            btnSaveProfile.setEnabled(true);
                            btnSaveProfile.setText("Save Changes");

                            if (response.isSuccessful() && response.body() != null) {
                                currentUser = response.body();
                                updateUI(currentUser);
                                dialog.dismiss();
                                Toast.makeText(requireContext(), "Profile updated successfully! ✅", Toast.LENGTH_SHORT).show();
                            } else {
                                Toast.makeText(requireContext(), "Failed to update profile", Toast.LENGTH_SHORT).show();
                            }
                        }
                    }

                    @Override
                    public void onFailure(Call<UserOut> call, Throwable t) {
                        if (isAdded()) {
                            btnSaveProfile.setEnabled(true);
                            btnSaveProfile.setText("Save Changes");
                            Toast.makeText(requireContext(), "Network error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                        }
                    }
                });
            }
        });

        dialog.show();
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
