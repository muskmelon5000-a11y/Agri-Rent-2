package com.example.androidapp.adapters;

import android.content.Context;
import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.CompoundButton;
import androidx.annotation.NonNull;
import androidx.appcompat.widget.PopupMenu;
import androidx.recyclerview.widget.RecyclerView;

import com.example.androidapp.R;
import com.example.androidapp.databinding.ItemProviderEquipmentBinding;
import com.example.androidapp.models.Equipment;
import java.util.ArrayList;
import java.util.List;

public class ProviderEquipmentAdapter extends RecyclerView.Adapter<ProviderEquipmentAdapter.ViewHolder> {

    private List<Equipment> items = new ArrayList<>();
    private final OnEquipmentActionListener listener;

    public interface OnEquipmentActionListener {
        void onDeleteClick(Equipment equipment);
        void onEditClick(Equipment equipment);
        void onToggleAvailabilityClick(Equipment equipment);
        void onViewJobsClick(Equipment equipment);
    }

    public ProviderEquipmentAdapter(OnEquipmentActionListener listener) {
        this.listener = listener;
    }

    public void setItems(List<Equipment> items) {
        this.items = items;
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemProviderEquipmentBinding binding = ItemProviderEquipmentBinding.inflate(
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
        private final ItemProviderEquipmentBinding binding;

        public ViewHolder(ItemProviderEquipmentBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }

        public void bind(final Equipment item) {
            binding.tvName.setText(item.getName());
            
            String brand = item.getBrand() != null && !item.getBrand().isEmpty() ? item.getBrand() : "";
            String type = item.getType() != null ? item.getType() : "machinery";
            if (!brand.isEmpty()) {
                binding.tvBrandType.setText(brand + " • " + type);
            } else {
                binding.tvBrandType.setText(type);
            }

            double monthEarnings = item.getPricePerDay() * (item.getTotalRentals() > 0 ? item.getTotalRentals() : 0);
            binding.tvEarnings.setText("₹" + String.format("%,.0f", monthEarnings));

            // Availability Status Text & Colors
            if (item.isAvailable()) {
                binding.tvAvailabilityStatus.setText("Available");
                binding.tvAvailabilityStatus.setTextColor(Color.parseColor("#16A34A"));
                binding.layoutRentedOutBanner.setVisibility(View.GONE);
            } else {
                binding.tvAvailabilityStatus.setText("Unavailable");
                binding.tvAvailabilityStatus.setTextColor(Color.parseColor("#9CA3AF"));
                binding.layoutRentedOutBanner.setVisibility(View.VISIBLE);
            }

            // Switch binding
            binding.switchAvailability.setOnCheckedChangeListener(null);
            binding.switchAvailability.setChecked(item.isAvailable());
            binding.switchAvailability.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
                @Override
                public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                    listener.onToggleAvailabilityClick(item);
                }
            });

            // More Options Menu (⋮)
            binding.btnMoreOptions.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    showPopupMenu(v, item);
                }
            });

            // View Jobs link on unavailable banner
            binding.tvViewJobs.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    listener.onViewJobsClick(item);
                }
            });

            // Card Click opens Edit
            itemView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    listener.onEditClick(item);
                }
            });
        }

        private void showPopupMenu(View anchor, final Equipment item) {
            Context context = anchor.getContext();
            PopupMenu popup = new PopupMenu(context, anchor);
            popup.getMenu().add(0, 1, 0, "✏️ Edit Equipment");
            popup.getMenu().add(0, 2, 1, "🗑️ Delete Equipment");

            popup.setOnMenuItemClickListener(new PopupMenu.OnMenuItemClickListener() {
                @Override
                public boolean onMenuItemClick(MenuItem menuItem) {
                    if (menuItem.getItemId() == 1) {
                        listener.onEditClick(item);
                        return true;
                    } else if (menuItem.getItemId() == 2) {
                        listener.onDeleteClick(item);
                        return true;
                    }
                    return false;
                }
            });
            popup.show();
        }
    }
}
