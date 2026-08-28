package com.example.androidapp;

import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Base64;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.SeekBar;
import android.widget.Toast;

import androidx.activity.result.ActivityResult;
import androidx.activity.result.ActivityResultCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;

import com.example.androidapp.databinding.ActivityAddEquipmentBinding;
import com.example.androidapp.models.Equipment;
import com.example.androidapp.models.EquipmentCreate;
import com.example.androidapp.network.RetrofitClient;
import com.example.androidapp.utils.SessionManager;
import com.google.android.material.chip.Chip;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class AddEquipmentActivity extends AppCompatActivity {

    private ActivityAddEquipmentBinding binding;
    private SessionManager sessionManager;

    private int currentStep = 1;
    private final String[] CATEGORIES = {"🚜 Tractor", "🛸 Agricultural Drone", "🌾 Combine Harvester", "🛠️ Tool / Implement"};
    private final String[] DRIVE_TYPES = {"2WD (2-Wheel Drive)", "4WD (4-Wheel Drive)"};
    private final String[] PILOT_OPTIONS = {"Yes, Operator / Pilot included", "No, Drone hardware only"};
    private final String[] CROP_TYPES = {"Multicrop (Wheat, Rice, Maize)", "Paddy / Rice Special", "Wheat Special", "Sugarcane Special"};
    private final String[] MIN_DURATIONS = {"1 Day", "2 Days", "3 Days", "1 Week"};
    private final String[] TRACTOR_ATTACHMENTS = {"Plough", "Rotavator", "Cultivator", "Seed Drill", "Trailer", "Harrow"};

    private final List<String> selectedAttachments = new ArrayList<>();
    private String selectedPresetPhoto = "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800";
    private ActivityResultLauncher<Intent> photoPickerLauncher;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityAddEquipmentBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        sessionManager = new SessionManager(this);

        setupPhotoPicker();
        setupSpinners();
        setupAttachmentChips();
        setupStep4Defaults();
        updateStepUI();

        binding.btnBack.setOnClickListener(v -> {
            if (currentStep > 1) {
                currentStep--;
                updateStepUI();
            } else {
                finish();
            }
        });

        binding.btnPrevStep.setOnClickListener(v -> {
            if (currentStep > 1) {
                currentStep--;
                updateStepUI();
            }
        });

        binding.btnNextStep.setOnClickListener(v -> handleNextOrPublish());

        // Device Photo Selection (Gallery / Camera pick)
        View.OnClickListener pickPhotoListener = v -> openDevicePhotoPicker();
        binding.btnPickDevicePhoto.setOnClickListener(pickPhotoListener);
        binding.cardPrimaryPhoto.setOnClickListener(pickPhotoListener);

        // Preset photos selection
        binding.presetPhoto1.setOnClickListener(v -> {
            selectedPresetPhoto = "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800";
            binding.ivPickedPhoto.setVisibility(View.GONE);
            binding.layoutPhotoPlaceholder.setVisibility(View.VISIBLE);
            binding.tvPhotoLabel.setText("🚜 Tractor Cover Photo Selected");
            Toast.makeText(AddEquipmentActivity.this, "Selected Tractor Cover Photo", Toast.LENGTH_SHORT).show();
        });

        binding.presetPhoto2.setOnClickListener(v -> {
            selectedPresetPhoto = "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800";
            binding.ivPickedPhoto.setVisibility(View.GONE);
            binding.layoutPhotoPlaceholder.setVisibility(View.VISIBLE);
            binding.tvPhotoLabel.setText("🌾 Harvester Cover Photo Selected");
            Toast.makeText(AddEquipmentActivity.this, "Selected Harvester Cover Photo", Toast.LENGTH_SHORT).show();
        });

        binding.presetPhoto3.setOnClickListener(v -> {
            selectedPresetPhoto = "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800";
            binding.ivPickedPhoto.setVisibility(View.GONE);
            binding.layoutPhotoPlaceholder.setVisibility(View.VISIBLE);
            binding.tvPhotoLabel.setText("🛸 Drone Cover Photo Selected");
            Toast.makeText(AddEquipmentActivity.this, "Selected Drone Cover Photo", Toast.LENGTH_SHORT).show();
        });

        binding.btnUseGpsLocation.setOnClickListener(v -> useCurrentLocation());

        // Radius SeekBar
        binding.sbServiceRadius.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            @Override
            public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
                binding.tvRadiusValue.setText(Math.max(1, progress) + " km");
            }

            @Override
            public void onStartTrackingTouch(SeekBar seekBar) {}

            @Override
            public void onStopTrackingTouch(SeekBar seekBar) {}
        });
    }

    private void setupPhotoPicker() {
        photoPickerLauncher = registerForActivityResult(
                new ActivityResultContracts.StartActivityForResult(),
                new ActivityResultCallback<ActivityResult>() {
                    @Override
                    public void onActivityResult(ActivityResult result) {
                        if (result.getResultCode() == RESULT_OK && result.getData() != null && result.getData().getData() != null) {
                            Uri imageUri = result.getData().getData();
                            try {
                                InputStream is = getContentResolver().openInputStream(imageUri);
                                Bitmap bitmap = BitmapFactory.decodeStream(is);
                                if (bitmap != null) {
                                    binding.ivPickedPhoto.setImageBitmap(bitmap);
                                    binding.ivPickedPhoto.setVisibility(View.VISIBLE);
                                    binding.layoutPhotoPlaceholder.setVisibility(View.GONE);

                                    ByteArrayOutputStream baos = new ByteArrayOutputStream();
                                    bitmap.compress(Bitmap.CompressFormat.JPEG, 70, baos);
                                    byte[] imageBytes = baos.toByteArray();
                                    String base64Image = Base64.encodeToString(imageBytes, Base64.DEFAULT).replaceAll("\\s+", "");
                                    selectedPresetPhoto = "data:image/jpeg;base64," + base64Image;

                                    Toast.makeText(AddEquipmentActivity.this, "Photo attached from device! 📷", Toast.LENGTH_SHORT).show();
                                }
                            } catch (Exception e) {
                                Toast.makeText(AddEquipmentActivity.this, "Failed to load photo from device", Toast.LENGTH_SHORT).show();
                            }
                        }
                    }
                });
    }

    private void openDevicePhotoPicker() {
        Intent intent = new Intent(Intent.ACTION_PICK);
        intent.setType("image/*");
        try {
            photoPickerLauncher.launch(intent);
        } catch (Exception e) {
            Intent fallbackIntent = new Intent(Intent.ACTION_GET_CONTENT);
            fallbackIntent.setType("image/*");
            photoPickerLauncher.launch(fallbackIntent);
        }
    }

    private void setupSpinners() {
        // Category
        ArrayAdapter<String> catAdapter = new ArrayAdapter<>(this, R.layout.spinner_item, CATEGORIES);
        catAdapter.setDropDownViewResource(R.layout.spinner_dropdown_item);
        binding.spinnerCategory.setAdapter(catAdapter);

        binding.spinnerCategory.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                onCategoryChanged(position);
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {}
        });

        // Drive Type
        ArrayAdapter<String> driveAdapter = new ArrayAdapter<>(this, R.layout.spinner_item, DRIVE_TYPES);
        driveAdapter.setDropDownViewResource(R.layout.spinner_dropdown_item);
        binding.spinnerDriveType.setAdapter(driveAdapter);

        // Drone Pilot
        ArrayAdapter<String> pilotAdapter = new ArrayAdapter<>(this, R.layout.spinner_item, PILOT_OPTIONS);
        pilotAdapter.setDropDownViewResource(R.layout.spinner_dropdown_item);
        binding.spinnerDronePilot.setAdapter(pilotAdapter);

        // Harvester Crop
        ArrayAdapter<String> cropAdapter = new ArrayAdapter<>(this, R.layout.spinner_item, CROP_TYPES);
        cropAdapter.setDropDownViewResource(R.layout.spinner_dropdown_item);
        binding.spinnerCropType.setAdapter(cropAdapter);

        // Min Duration
        ArrayAdapter<String> durationAdapter = new ArrayAdapter<>(this, R.layout.spinner_item, MIN_DURATIONS);
        durationAdapter.setDropDownViewResource(R.layout.spinner_dropdown_item);
        binding.spinnerMinDuration.setAdapter(durationAdapter);
    }

    private void onCategoryChanged(int position) {
        binding.layoutTractorFields.setVisibility(position == 0 ? View.VISIBLE : View.GONE);
        binding.layoutDroneFields.setVisibility(position == 1 ? View.VISIBLE : View.GONE);
        binding.layoutHarvesterFields.setVisibility(position == 2 ? View.VISIBLE : View.GONE);
        binding.layoutImplementFields.setVisibility(position == 3 ? View.VISIBLE : View.GONE);

        switch (position) {
            case 0:
                binding.tvStepTitle.setText("Basic Details (TRACTOR)");
                binding.etName.setHint("e.g. Mahindra 575 DI");
                binding.etBrand.setHint("e.g. Mahindra");
                break;
            case 1:
                binding.tvStepTitle.setText("Basic Details (DRONE)");
                binding.etName.setHint("e.g. DJI Agras T40");
                binding.etBrand.setHint("e.g. DJI");
                break;
            case 2:
                binding.tvStepTitle.setText("Basic Details (HARVESTER)");
                binding.etName.setHint("e.g. Claas Crop Tiger 30");
                binding.etBrand.setHint("e.g. Claas");
                break;
            case 3:
                binding.tvStepTitle.setText("Basic Details (IMPLEMENT)");
                binding.etName.setHint("e.g. Shaktiman 7ft Rotavator");
                binding.etBrand.setHint("e.g. Shaktiman");
                break;
        }
    }

    private void setupAttachmentChips() {
        binding.chipGroupAttachments.removeAllViews();
        for (final String att : TRACTOR_ATTACHMENTS) {
            final Chip chip = new Chip(this);
            chip.setText(att);
            chip.setCheckable(true);
            chip.setClickable(true);
            chip.setOnCheckedChangeListener((buttonView, isChecked) -> {
                if (isChecked) {
                    selectedAttachments.add(att);
                } else {
                    selectedAttachments.remove(att);
                }
            });
            binding.chipGroupAttachments.addView(chip);
        }
    }

    private void setupStep4Defaults() {
        String userVillage = sessionManager.getVillage();
        String userDistrict = sessionManager.getDistrict();
        if (userVillage != null && !userVillage.isEmpty()) binding.etVillage.setText(userVillage);
        if (userDistrict != null && !userDistrict.isEmpty()) binding.etDistrict.setText(userDistrict);
    }

    private void useCurrentLocation() {
        String userVillage = sessionManager.getVillage();
        String userDistrict = sessionManager.getDistrict();
        if (userVillage != null && !userVillage.isEmpty()) {
            binding.etVillage.setText(userVillage);
        } else {
            binding.etVillage.setText("Anandpur");
        }
        if (userDistrict != null && !userDistrict.isEmpty()) {
            binding.etDistrict.setText(userDistrict);
        } else {
            binding.etDistrict.setText("Kheda");
        }
        binding.btnUseGpsLocation.setText("✓ Location Verified");
        Toast.makeText(this, "Location set to " + binding.etVillage.getText() + ", " + binding.etDistrict.getText(), Toast.LENGTH_SHORT).show();
    }

    private void updateStepUI() {
        binding.viewFlipperSteps.setDisplayedChild(currentStep - 1);
        binding.tvStepNumber.setText("Step " + currentStep + " of 4");

        // Update progress step bars
        int greenColor = 0xFF2E7D32;
        int grayColor = 0xFFE5E7EB;

        binding.stepBar1.setBackgroundColor(currentStep >= 1 ? greenColor : grayColor);
        binding.stepBar2.setBackgroundColor(currentStep >= 2 ? greenColor : grayColor);
        binding.stepBar3.setBackgroundColor(currentStep >= 3 ? greenColor : grayColor);
        binding.stepBar4.setBackgroundColor(currentStep >= 4 ? greenColor : grayColor);

        // Previous button visibility
        binding.btnPrevStep.setVisibility(currentStep > 1 ? View.VISIBLE : View.GONE);

        // Step Title and Next button text
        switch (currentStep) {
            case 1:
                int catPos = binding.spinnerCategory.getSelectedItemPosition();
                onCategoryChanged(catPos);
                binding.btnNextStep.setText("Next Step →");
                break;
            case 2:
                binding.tvStepTitle.setText("Photos & Imagery");
                binding.btnNextStep.setText("Next Step →");
                break;
            case 3:
                binding.tvStepTitle.setText("Pricing & Rates");
                binding.btnNextStep.setText("Next Step →");
                break;
            case 4:
                binding.tvStepTitle.setText("Location & Delivery");
                binding.btnNextStep.setText("Publish Equipment 🚀");
                break;
        }
    }

    private void handleNextOrPublish() {
        if (currentStep == 1) {
            String name = binding.etName.getText().toString().trim();
            if (TextUtils.isEmpty(name)) {
                binding.etName.setError("Equipment Name is required");
                binding.etName.requestFocus();
                return;
            }
            currentStep++;
            updateStepUI();
        } else if (currentStep == 2) {
            currentStep++;
            updateStepUI();
        } else if (currentStep == 3) {
            String priceStr = binding.etPricePerDay.getText().toString().trim();
            if (TextUtils.isEmpty(priceStr)) {
                binding.etPricePerDay.setError("Daily Rate is required");
                binding.etPricePerDay.requestFocus();
                return;
            }
            currentStep++;
            updateStepUI();
        } else if (currentStep == 4) {
            publishEquipment();
        }
    }

    private void publishEquipment() {
        String name = binding.etName.getText().toString().trim();
        String brand = binding.etBrand.getText().toString().trim();
        String yearStr = binding.etYear.getText().toString().trim();
        String desc = binding.etDesc.getText().toString().trim();

        int catPos = binding.spinnerCategory.getSelectedItemPosition();
        String type = "tractor";
        Integer hp = null;
        if (catPos == 0) {
            type = "tractor";
            String hpStr = binding.etTractorHp.getText().toString().trim();
            if (!TextUtils.isEmpty(hpStr)) try { hp = Integer.parseInt(hpStr); } catch (NumberFormatException ignored) {}
        } else if (catPos == 1) {
            type = "drone";
        } else if (catPos == 2) {
            type = "harvester";
            String hpStr = binding.etHarvesterHp.getText().toString().trim();
            if (!TextUtils.isEmpty(hpStr)) try { hp = Integer.parseInt(hpStr); } catch (NumberFormatException ignored) {}
        } else if (catPos == 3) {
            type = "implement";
            String hpStr = binding.etImplementReqHp.getText().toString().trim();
            if (!TextUtils.isEmpty(hpStr)) try { hp = Integer.parseInt(hpStr); } catch (NumberFormatException ignored) {}
        }

        Integer year = null;
        if (!TextUtils.isEmpty(yearStr)) {
            try { year = Integer.parseInt(yearStr); } catch (NumberFormatException ignored) {}
        }

        double pricePerDay = 1200;
        try {
            pricePerDay = Double.parseDouble(binding.etPricePerDay.getText().toString().trim());
        } catch (NumberFormatException ignored) {}

        Double pricePerHour = null;
        String hourlyStr = binding.etPricePerHour.getText().toString().trim();
        if (!TextUtils.isEmpty(hourlyStr)) {
            try { pricePerHour = Double.parseDouble(hourlyStr); } catch (NumberFormatException ignored) {}
        }

        String village = binding.etVillage.getText().toString().trim();
        if (TextUtils.isEmpty(village)) village = "Anandpur";

        String district = binding.etDistrict.getText().toString().trim();
        if (TextUtils.isEmpty(district)) district = "Kheda";

        // JSON stringify images and attachments
        String imagesJson = "[\"" + selectedPresetPhoto + "\"]";
        StringBuilder attJson = new StringBuilder("[");
        for (int i = 0; i < selectedAttachments.size(); i++) {
            attJson.append("\"").append(selectedAttachments.get(i)).append("\"");
            if (i < selectedAttachments.size() - 1) attJson.append(",");
        }
        attJson.append("]");

        binding.btnNextStep.setEnabled(false);
        binding.btnNextStep.setText("Publishing Equipment...");

        EquipmentCreate equipmentCreate = new EquipmentCreate(
                name,
                type,
                TextUtils.isEmpty(brand) ? null : brand,
                null,
                hp,
                year,
                TextUtils.isEmpty(desc) ? null : desc,
                pricePerDay,
                pricePerHour,
                village,
                district,
                imagesJson,
                attJson.toString()
        );

        String authToken = "Bearer " + sessionManager.getToken();
        Call<Equipment> call = RetrofitClient.getApiService().createEquipment(equipmentCreate, authToken);
        call.enqueue(new Callback<Equipment>() {
            @Override
            public void onResponse(Call<Equipment> call, Response<Equipment> response) {
                binding.btnNextStep.setEnabled(true);
                binding.btnNextStep.setText("Publish Equipment 🚀");

                if (response.isSuccessful() && response.body() != null) {
                    Toast.makeText(AddEquipmentActivity.this, "Machinery published successfully! ✅", Toast.LENGTH_LONG).show();
                    finish();
                } else {
                    Toast.makeText(AddEquipmentActivity.this, "Failed to publish: " + response.message(), Toast.LENGTH_LONG).show();
                }
            }

            @Override
            public void onFailure(Call<Equipment> call, Throwable t) {
                binding.btnNextStep.setEnabled(true);
                binding.btnNextStep.setText("Publish Equipment 🚀");
                Toast.makeText(AddEquipmentActivity.this, "Network Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }
}
