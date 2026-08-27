package com.example.androidapp.adapters;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.androidapp.databinding.ItemMapEquipmentBinding;
import com.example.androidapp.models.Equipment;
import java.util.ArrayList;
import java.util.List;

public class MapEquipmentAdapter extends RecyclerView.Adapter<MapEquipmentAdapter.ViewHolder> {

    private List<Equipment> items = new ArrayList<>();
    private final OnItemClickListener listener;

    public interface OnItemClickListener {
        void onItemClick(Equipment equipment);
    }

    public MapEquipmentAdapter(OnItemClickListener listener) {
        this.listener = listener;
    }

    public void setItems(List<Equipment> items) {
        this.items = items;
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemMapEquipmentBinding binding = ItemMapEquipmentBinding.inflate(
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
        private final ItemMapEquipmentBinding binding;

        public ViewHolder(ItemMapEquipmentBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }

        public void bind(final Equipment item, final OnItemClickListener listener) {
            binding.tvEquipmentName.setText(item.getName() != null ? item.getName() : "Equipment");
            binding.tvPrice.setText("₹" + String.format("%,.0f", item.getPricePerDay()) + "/day");
            
            double rating = item.getRating() != 0.0 ? item.getRating() : 5.0;
            binding.tvRating.setText("⭐ " + String.format("%.1f", rating));

            if (item.getDistanceKm() != null) {
                binding.tvDistance.setText(String.format("%.1f km", item.getDistanceKm()));
                binding.tvDistance.setVisibility(View.VISIBLE);
            } else {
                binding.tvDistance.setVisibility(View.GONE);
            }

            itemView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    listener.onItemClick(item);
                }
            });
        }
    }
}
