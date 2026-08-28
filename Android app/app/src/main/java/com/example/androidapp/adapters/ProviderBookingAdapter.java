package com.example.androidapp.adapters;

import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.androidapp.databinding.ItemProviderBookingBinding;
import com.example.androidapp.models.Booking;

import java.util.ArrayList;
import java.util.List;

public class ProviderBookingAdapter extends RecyclerView.Adapter<ProviderBookingAdapter.ViewHolder> {

    private List<Booking> items = new ArrayList<>();
    private final OnBookingActionListener listener;

    public interface OnBookingActionListener {
        void onAccept(Booking booking);
        void onReject(Booking booking);
        void onCardClick(Booking booking);
    }

    public ProviderBookingAdapter(OnBookingActionListener listener) {
        this.listener = listener;
    }

    public void setItems(List<Booking> items) {
        this.items = items;
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemProviderBookingBinding binding = ItemProviderBookingBinding.inflate(
                LayoutInflater.from(parent.getContext()), parent, false);
        return new ViewHolder(binding);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        holder.bind(items.get(position));
    }

    @Override
    public int getItemCount() {
        return items.size();
    }

    class ViewHolder extends RecyclerView.ViewHolder {
        private final ItemProviderBookingBinding binding;

        public ViewHolder(ItemProviderBookingBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }

        public void bind(final Booking item) {
            // Seeker Name & Initials
            String seekerName = item.getSeekerName() != null && !item.getSeekerName().isEmpty() 
                    ? item.getSeekerName() 
                    : "Farmer";
            binding.tvSeekerName.setText(seekerName);
            binding.tvAvatarInitials.setText("👨‍🌾");

            // Location
            String loc = item.getEquipmentVillage() != null && !item.getEquipmentVillage().isEmpty()
                    ? item.getEquipmentVillage()
                    : (item.getDeliveryAddress() != null ? item.getDeliveryAddress() : "Nearby");
            binding.tvLocationPin.setText("📍 " + loc);

            // Machine Name
            binding.tvEquipmentName.setText(item.getEquipmentName() != null ? item.getEquipmentName() : "Machinery");

            // Dates & Total Days
            String start = item.getStartDate() != null ? item.getStartDate() : "";
            String end = item.getEndDate() != null ? item.getEndDate() : "";
            binding.tvDatesRange.setText("📅 " + start + " - " + end + " (" + item.getTotalDays() + " Days)");

            // Estimated Earnings
            binding.tvTotalAmount.setText("₹" + String.format("%,.0f", item.getTotalAmount()));

            // Status Badge & Actions
            String status = item.getStatus() != null ? item.getStatus().toLowerCase() : "pending";
            if ("pending".equals(status)) {
                binding.tvStatusBadge.setText("New Request");
                binding.tvStatusBadge.setTextColor(Color.parseColor("#16A34A"));
                binding.tvStatusBadge.setBackgroundColor(Color.parseColor("#DCFCE7"));
                binding.layoutActions.setVisibility(View.VISIBLE);
            } else if ("accepted".equals(status) || "active".equals(status)) {
                binding.tvStatusBadge.setText(status.toUpperCase());
                binding.tvStatusBadge.setTextColor(Color.parseColor("#2563EB"));
                binding.tvStatusBadge.setBackgroundColor(Color.parseColor("#DBEAFE"));
                binding.layoutActions.setVisibility(View.GONE);
            } else {
                binding.tvStatusBadge.setText(status.toUpperCase());
                binding.tvStatusBadge.setTextColor(Color.parseColor("#6B7280"));
                binding.tvStatusBadge.setBackgroundColor(Color.parseColor("#F3F4F6"));
                binding.layoutActions.setVisibility(View.GONE);
            }

            // Click Actions
            binding.btnAccept.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    listener.onAccept(item);
                }
            });

            binding.btnReject.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    listener.onReject(item);
                }
            });

            itemView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    listener.onCardClick(item);
                }
            });
        }
    }
}
