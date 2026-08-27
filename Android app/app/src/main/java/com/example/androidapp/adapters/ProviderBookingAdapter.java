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
        void onContactClick(Booking booking);
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
            binding.tvEquipmentName.setText(item.getEquipmentName() != null ? item.getEquipmentName() : "Equipment");
            
            String renter = "Renter: " + (item.getSeekerName() != null ? item.getSeekerName() : "Farmer");
            if (item.getSeekerPhone() != null) {
                renter += " (" + item.getSeekerPhone() + ")";
            }
            binding.tvRenterInfo.setText(renter);
            
            binding.tvDates.setText(item.getStartDate() + " - " + item.getEndDate());
            binding.tvTotalDays.setText("Total: " + item.getTotalDays() + " days");
            binding.tvTotalAmount.setText("₹" + String.format("%,.0f", item.getTotalAmount()));

            String status = item.getStatus() != null ? item.getStatus().toUpperCase() : "PENDING";
            binding.tvStatus.setText(status);

            // Hide actions if not pending
            if ("PENDING".equals(status)) {
                binding.layoutActions.setVisibility(View.VISIBLE);
            } else {
                binding.layoutActions.setVisibility(View.GONE);
            }

            // Set color badge dynamically
            switch (status) {
                case "ACCEPTED":
                case "ACTIVE":
                    binding.tvStatus.setTextColor(Color.parseColor("#1B5E20"));
                    binding.tvStatus.getBackground().setTint(Color.parseColor("#E8F5E9"));
                    break;
                case "COMPLETED":
                    binding.tvStatus.setTextColor(Color.parseColor("#0D47A1"));
                    binding.tvStatus.getBackground().setTint(Color.parseColor("#E3F2FD"));
                    break;
                case "REJECTED":
                case "CANCELLED":
                    binding.tvStatus.setTextColor(Color.parseColor("#B71C1C"));
                    binding.tvStatus.getBackground().setTint(Color.parseColor("#FFEBEE"));
                    break;
                case "PENDING":
                default:
                    binding.tvStatus.setTextColor(Color.parseColor("#E65100"));
                    binding.tvStatus.getBackground().setTint(Color.parseColor("#FFF3E0"));
                    break;
            }

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

            binding.btnContactRenter.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    listener.onContactClick(item);
                }
            });
        }
    }
}
