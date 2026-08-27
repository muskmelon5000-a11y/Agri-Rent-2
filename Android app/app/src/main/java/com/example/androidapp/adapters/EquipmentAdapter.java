package com.example.androidapp.adapters;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.androidapp.databinding.ItemEquipmentBinding;
import com.example.androidapp.models.Equipment;
import java.util.ArrayList;
import java.util.List;

public class EquipmentAdapter extends RecyclerView.Adapter<EquipmentAdapter.ViewHolder> {

    private List<Equipment> items = new ArrayList<>();
    private final OnItemClickListener listener;

    public interface OnItemClickListener {
        void onItemClick(Equipment equipment);
    }

    public EquipmentAdapter(OnItemClickListener listener) {
        this.listener = listener;
    }

    public void setItems(List<Equipment> items) {
        this.items = items;
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemEquipmentBinding binding = ItemEquipmentBinding.inflate(
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
        private final ItemEquipmentBinding binding;

        public ViewHolder(ItemEquipmentBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }

        public void bind(final Equipment item) {
            binding.tvName.setText(item.getName());
            binding.tvBrandType.setText(item.getBrand() + " • " + item.getType());
            
            String loc = item.getVillage();
            if (item.getDistanceKm() != null) {
                loc += " • " + item.getDistanceKm() + " km away";
            }
            binding.tvLocation.setText(loc);
            
            binding.tvPrice.setText("₹" + String.format("%,.0f", item.getPricePerDay()));

            itemView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    listener.onItemClick(item);
                }
            });
        }
    }
}
