import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../../../components/shared/AppHeader';
import { Button } from '../../../components/shared/Button';
export function AdvancedFilters() {
  const navigate = useNavigate();
  const [priceRange, setPriceRange] = useState(1500);
  const [hpRange, setHpRange] = useState(50);
  const [distance, setDistance] = useState(15);
  return (
    <div className="h-full bg-background flex flex-col">
      <AppHeader
        title="Filters"
        showBack
        action={
        <button className="text-sm font-bold text-gray-500">Reset</button>
        } />
      

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
        {/* Price Range */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              Price Range (₹/day)
            </h2>
            <span className="font-bold text-primary">Up to ₹{priceRange}</span>
          </div>
          <input
            type="range"
            min="500"
            max="5000"
            step="100"
            value={priceRange}
            onChange={(e) => setPriceRange(Number(e.target.value))}
            className="w-full accent-primary" />
          
          <div className="flex justify-between text-xs text-gray-500 mt-2 font-medium">
            <span>₹500</span>
            <span>₹5000+</span>
          </div>
        </div>

        {/* HP Range */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">Horsepower (HP)</h2>
            <span className="font-bold text-primary">Up to {hpRange} HP</span>
          </div>
          <input
            type="range"
            min="20"
            max="100"
            step="5"
            value={hpRange}
            onChange={(e) => setHpRange(Number(e.target.value))}
            className="w-full accent-primary" />
          
          <div className="flex justify-between text-xs text-gray-500 mt-2 font-medium">
            <span>20 HP</span>
            <span>100+ HP</span>
          </div>
        </div>

        {/* Attachments */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Attachments Included
          </h2>
          <div className="flex flex-wrap gap-3">
            <label className="flex items-center gap-2 px-4 py-2 bg-surface border border-gray-200 rounded-xl cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary-50">
              <input type="checkbox" className="hidden" defaultChecked />
              <span className="font-semibold text-gray-700">Plough</span>
            </label>
            <label className="flex items-center gap-2 px-4 py-2 bg-surface border border-gray-200 rounded-xl cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary-50">
              <input type="checkbox" className="hidden" />
              <span className="font-semibold text-gray-700">Rotavator</span>
            </label>
            <label className="flex items-center gap-2 px-4 py-2 bg-surface border border-gray-200 rounded-xl cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary-50">
              <input type="checkbox" className="hidden" defaultChecked />
              <span className="font-semibold text-gray-700">Cultivator</span>
            </label>
            <label className="flex items-center gap-2 px-4 py-2 bg-surface border border-gray-200 rounded-xl cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary-50">
              <input type="checkbox" className="hidden" />
              <span className="font-semibold text-gray-700">Seeder</span>
            </label>
          </div>
        </div>

        {/* Distance */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">Distance Radius</h2>
            <span className="font-bold text-primary">Within {distance} km</span>
          </div>
          <input
            type="range"
            min="1"
            max="50"
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            className="w-full accent-primary" />
          
          <div className="flex justify-between text-xs text-gray-500 mt-2 font-medium">
            <span>1 km</span>
            <span>50 km</span>
          </div>
        </div>

        {/* Availability */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Availability Dates
          </h2>
          <input
            type="date"
            className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl font-semibold text-gray-900 focus:border-primary focus:outline-none bg-white" />
          
        </div>
      </div>

      <div className="p-6 bg-surface border-t border-gray-200">
        <Button fullWidth size="lg" onClick={() => navigate(-1)}>
          Apply Filters (12 Results)
        </Button>
      </div>
    </div>);

}