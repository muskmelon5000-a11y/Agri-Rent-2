package com.example.androidapp.adapters;

import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.androidapp.databinding.ItemBookingBinding;
import com.example.androidapp.models.Booking;
import java.util.ArrayList;
import java.util.List;

public class BookingAdapter extends RecyclerView.Adapter<BookingAdapter.ViewHolder> {

    private List<Booking> items = new ArrayList<>();
    private final OnBookingActionListener listener;

    public interface OnBookingActionListener {
        void onCancelClick(Booking booking);
        void onContactClick(Booking booking);
    }

    public BookingAdapter(OnBookingActionListener listener) {
        this.listener = listener;
    }

    public void setItems(List<Booking> items) {
        this.items = items;
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemBookingBinding binding = ItemBookingBinding.inflate(
                LayoutInflater.from(parent.getContext()), parent, false);
        return new ViewHolder(binding);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        holder.bind(items.get(position), listener);
    }

    @Override
    public int getItemCount() {
        return items.size();
    }

    static class ViewHolder extends RecyclerView.ViewHolder {
        private final ItemBookingBinding binding;

        public ViewHolder(ItemBookingBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }

        public void bind(final Booking item, final OnBookingActionListener listener) {
            binding.tvEquipmentName.setText(item.getEquipmentName() != null ? item.getEquipmentName() : "Equipment");
            binding.tvDates.setText(item.getStartDate() + " - " + item.getEndDate());
            binding.tvTotalDays.setText("Total: " + item.getTotalDays() + " days");
            binding.tvTotalAmount.setText("₹" + String.format("%,.0f", item.getTotalAmount()));

            final String status = item.getStatus() != null ? item.getStatus().toUpperCase() : "PENDING";
            binding.tvStatus.setText(status);

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

            // Update the stepper matching ActiveRentalTracker.tsx steps
            if ("PENDING".equals(status)) {
                binding.tvStepperLabel.setText("Step 1 of 4: Request Sent");
                binding.pbStepper.setProgress(1);
                binding.pbStepper.setVisibility(View.VISIBLE);
                binding.tvStepperLabel.setVisibility(View.VISIBLE);
            } else if ("ACCEPTED".equals(status)) {
                binding.tvStepperLabel.setText("Step 2 of 4: Accepted by Owner");
                binding.pbStepper.setProgress(2);
                binding.pbStepper.setVisibility(View.VISIBLE);
                binding.tvStepperLabel.setVisibility(View.VISIBLE);
            } else if ("ACTIVE".equals(status)) {
                binding.tvStepperLabel.setText("Step 3 of 4: In Use (Active)");
                binding.pbStepper.setProgress(3);
                binding.pbStepper.setVisibility(View.VISIBLE);
                binding.tvStepperLabel.setVisibility(View.VISIBLE);
            } else if ("COMPLETED".equals(status)) {
                binding.tvStepperLabel.setText("Step 4 of 4: Completed");
                binding.pbStepper.setProgress(4);
                binding.pbStepper.setVisibility(View.VISIBLE);
                binding.tvStepperLabel.setVisibility(View.VISIBLE);
            } else {
                // Cancelled or Rejected - hide the progress stepper
                binding.pbStepper.setVisibility(View.GONE);
                binding.tvStepperLabel.setVisibility(View.GONE);
            }

            if ("PENDING".equals(status) || "ACCEPTED".equals(status)) {
                binding.btnCancel.setVisibility(View.VISIBLE);
                binding.btnCancel.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        listener.onCancelClick(item);
                    }
                });
            } else {
                binding.btnCancel.setVisibility(View.GONE);
            }

            binding.btnContact.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    listener.onContactClick(item);
                }
            });
        }
    }
}
