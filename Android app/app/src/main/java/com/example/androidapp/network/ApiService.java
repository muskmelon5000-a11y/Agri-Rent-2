package com.example.androidapp.network;

import com.example.androidapp.models.LoginRequest;
import com.example.androidapp.models.OTPResponse;
import com.example.androidapp.models.SendOTPRequest;
import com.example.androidapp.models.SignupRequest;
import com.example.androidapp.models.TokenResponse;
import com.example.androidapp.models.Equipment;
import com.example.androidapp.models.Booking;
import com.example.androidapp.models.BookingCreate;
import com.example.androidapp.models.ProviderDashboardOut;
import com.example.androidapp.models.BookingStatusUpdate;
import com.example.androidapp.models.EquipmentCreate;
import com.example.androidapp.models.EquipmentUpdate;
import com.example.androidapp.models.UserOut;
import java.util.List;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.POST;
import retrofit2.http.PATCH;
import retrofit2.http.PUT;
import retrofit2.http.DELETE;
import retrofit2.http.Path;
import retrofit2.http.Query;

public interface ApiService {

    @POST("auth/send-otp")
    Call<OTPResponse> sendOtp(@Body SendOTPRequest request);

    @POST("auth/signup")
    Call<TokenResponse> signup(@Body SignupRequest request);

    @POST("auth/login")
    Call<TokenResponse> login(@Body LoginRequest request);

    @GET("equipment/nearby")
    Call<List<Equipment>> getNearbyEquipment(
        @Query("lat") double lat,
        @Query("lng") double lng,
        @Query("radius_km") double radiusKm,
        @Query("min_price") Double minPrice,
        @Query("max_price") Double maxPrice,
        @Query("equipment_type") String equipmentType,
        @Query("search_query") String searchQuery,
        @Header("Authorization") String token
    );

    @GET("equipment/{equipment_id}")
    Call<Equipment> getEquipmentDetails(
        @Path("equipment_id") String equipmentId,
        @Header("Authorization") String token
    );

    @POST("bookings/")
    Call<Booking> createBooking(
        @Body BookingCreate request,
        @Header("Authorization") String token
    );

    @GET("bookings/my")
    Call<List<Booking>> getMyBookings(
        @Header("Authorization") String token
    );

    @GET("provider/dashboard")
    Call<ProviderDashboardOut> getProviderDashboard(
        @Header("Authorization") String token
    );

    @GET("bookings/provider")
    Call<List<Booking>> getProviderBookings(
        @Header("Authorization") String token
    );

    @PATCH("bookings/{booking_id}/status")
    Call<Booking> updateBookingStatus(
        @Path("booking_id") String bookingId,
        @Body BookingStatusUpdate request,
        @Header("Authorization") String token
    );

    @GET("auth/me")
    Call<UserOut> getMe(
        @Header("Authorization") String token
    );

    @GET("equipment/mine/list")
    Call<List<Equipment>> getMyEquipment(
        @Header("Authorization") String token
    );

    @POST("equipment/")
    Call<Equipment> createEquipment(
        @Body EquipmentCreate request,
        @Header("Authorization") String token
    );

    @DELETE("equipment/{equipment_id}")
    Call<Void> deleteEquipment(
        @Path("equipment_id") String equipmentId,
        @Header("Authorization") String token
    );

    @DELETE("bookings/{booking_id}/cancel")
    Call<Void> cancelBooking(
        @Path("booking_id") String bookingId,
        @Header("Authorization") String token
    );

    @PATCH("equipment/{equipment_id}/availability")
    Call<Equipment> toggleAvailability(
        @Path("equipment_id") String equipmentId,
        @Header("Authorization") String token
    );

    @PUT("equipment/{equipment_id}")
    Call<Equipment> updateEquipment(
        @Path("equipment_id") String equipmentId,
        @Body EquipmentUpdate request,
        @Header("Authorization") String token
    );
}
