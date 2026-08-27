package com.example.androidapp.utils;

import android.content.Context;
import android.content.SharedPreferences;

public class SessionManager {

    private static final String PREF_NAME = "AgrirentSession";
    private static final String KEY_TOKEN = "jwt_token";
    private static final String KEY_USER_ID = "user_id";
    private static final String KEY_ROLE = "user_role";
    private static final String KEY_NAME = "user_name";
    private static final String KEY_PHONE = "user_phone";
    private static final String KEY_VILLAGE = "user_village";
    private static final String KEY_DISTRICT = "user_district";
    private static final String KEY_PROFILE_IMAGE = "user_profile_image";

    private final SharedPreferences pref;
    private final SharedPreferences.Editor editor;

    public SessionManager(Context context) {
        pref = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        editor = pref.edit();
    }

    public void saveSession(String token, String userId, String role, String name) {
        editor.putString(KEY_TOKEN, token);
        editor.putString(KEY_USER_ID, userId);
        editor.putString(KEY_ROLE, role);
        editor.putString(KEY_NAME, name);
        editor.apply();
    }

    public void saveUserDetails(String name, String phone, String village, String district, String profileImage) {
        if (name != null) editor.putString(KEY_NAME, name);
        if (phone != null) editor.putString(KEY_PHONE, phone);
        if (village != null) editor.putString(KEY_VILLAGE, village);
        if (district != null) editor.putString(KEY_DISTRICT, district);
        if (profileImage != null) editor.putString(KEY_PROFILE_IMAGE, profileImage);
        editor.apply();
    }

    public String getToken() {
        return pref.getString(KEY_TOKEN, null);
    }

    public String getUserId() {
        return pref.getString(KEY_USER_ID, null);
    }

    public String getRole() {
        return pref.getString(KEY_ROLE, null); // "seeker" or "provider"
    }

    public String getName() {
        return pref.getString(KEY_NAME, null);
    }

    public String getPhone() {
        return pref.getString(KEY_PHONE, null);
    }

    public String getVillage() {
        return pref.getString(KEY_VILLAGE, null);
    }

    public String getDistrict() {
        return pref.getString(KEY_DISTRICT, null);
    }

    public String getProfileImage() {
        return pref.getString(KEY_PROFILE_IMAGE, null);
    }

    public boolean isLoggedIn() {
        return getToken() != null;
    }

    public void logout() {
        editor.clear();
        editor.apply();
    }
}
