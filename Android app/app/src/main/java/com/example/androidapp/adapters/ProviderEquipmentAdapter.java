package com.example.androidapp.adapters;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.CompoundButton;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

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
            binding.tvBrandType.setText((item.getBrand() != null ? item.getBrand() : "") + " • " + (item.getType() != null ? item.getType() : ""));
            binding.tvPrice.setText("₹" + String.format("%,.0f", item.getPricePerDay()) + "/day");

            binding.switchAvailability.setOnCheckedChangeListener(null);
            binding.switchAvailability.setChecked(item.isAvailable());
            binding.switchAvailability.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
                @Override
                public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                    listener.onToggleAvailabilityClick(item);
                }
            });

            binding.btnEdit.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    listener.onEditClick(item);
                }
            });

            binding.btnDelete.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    listener.onDeleteClick(item);
                }
            });
        }
    }
}
