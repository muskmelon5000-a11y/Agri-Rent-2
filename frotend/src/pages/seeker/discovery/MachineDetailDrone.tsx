import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppHeader } from '../../../components/shared/AppHeader';
import { BottomNav } from '../../../components/shared/BottomNav';
import { Button } from '../../../components/shared/Button';
import { Badge } from '../../../components/shared/Badge';
import { SmartEstimateCard } from '../../../components/shared/SmartEstimateCard';
import { Avatar } from '../../../components/shared/Avatar';
import { equipmentService, Equipment } from '../../../services/equipmentService';
import {
  MapPinIcon,
  StarIcon,
  BatteryIcon,
  GaugeIcon,
  CalendarIcon } from
'lucide-react';

export function MachineDetailDrone({ initialMachine }: { initialMachine?: Equipment }) {
  const [machine] = useState<Equipment | null>(initialMachine || null);
  const [acres, setAcres] = useState('10');
  const [imageFit, setImageFit] = useState<'cover' | 'contain'>('cover');
  
  if (!machine) {
    return <div className="min-h-full bg-background pb-20 flex items-center justify-center">Machine not found.</div>;
  }
  const coveragePerBattery = 2.5;
  const batteriesNeeded = Math.ceil(Number(acres) / coveragePerBattery);
  const timeEstimate = batteriesNeeded * 15;
  return (
    <div className="min-h-full bg-background pb-20">
      <AppHeader title="Drone Details" showBack />

      {/* Image */}
      <div className="relative bg-gray-950 flex items-center justify-center h-80 overflow-hidden">
        <img
          src={machine.images ? (JSON.parse(machine.images)[0] || 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800') : 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800'}
          alt={machine.name}
          className={`w-full h-full transition-all duration-300 ${
            imageFit === 'contain' ? 'object-contain p-2' : 'object-cover object-center'
          }`}
        />
        
        {/* Fit/Fill Toggle Button */}
        <button
          type="button"
          onClick={() => setImageFit(prev => prev === 'cover' ? 'contain' : 'cover')}
          className="absolute top-4 left-4 bg-black/60 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/20 shadow hover:bg-black/80 transition"
        >
          {imageFit === 'cover' ? '🔍 Fit Full Photo' : '🔎 Fill Banner'}
        </button>
        
        <Badge variant="success" className="absolute top-4 right-4 z-10">
          Available Now
        </Badge>
      </div>

      {/* Main Info */}
      <div className="px-6 py-6 space-y-6">
        <div>
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {machine.name}
              </h1>
              <p className="text-base text-gray-600">
                {machine.brand || 'Agricultural Drone'} • {machine.year || '2022'}
              </p>
            </div>
            <div className="flex items-center gap-1 bg-secondary-50 px-3 py-2 rounded-xl">
              <StarIcon className="w-5 h-5 text-secondary-700 fill-secondary-700" />
              <span className="font-bold text-gray-900">{machine.rating || '4.9'}</span>
              <span className="text-sm text-gray-600">({machine.total_ratings || 0})</span>
            </div>
          </div>

          {/* Owner */}
          <Link to={`/seeker/owner/${machine.owner_id}`}>
            <div className="flex items-center gap-3 p-4 bg-surface rounded-2xl border border-gray-100">
              <Avatar name={machine.owner_name || "Owner"} verified size="md" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{machine.owner_name || "Owner"}</h3>
                <p className="text-sm text-gray-600">
                  Drone Operator
                </p>
              </div>
              <span className="text-primary font-semibold">→</span>
            </div>
          </Link>
        </div>

        {/* Price */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Rental Rates</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-primary-50 border-2 border-primary rounded-2xl p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Per Acre</p>
              <p className="text-2xl font-bold text-primary">₹{Math.round(machine.price_per_day / 10)}</p>
            </div>
            <div className="bg-surface border-2 border-gray-200 rounded-2xl p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Per Day</p>
              <p className="text-2xl font-bold text-gray-900">₹{machine.price_per_day}</p>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            Specifications
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface rounded-2xl p-4 border border-gray-100">
              <GaugeIcon className="w-5 h-5 text-primary mb-2" />
              <p className="text-sm text-gray-600">Tank Capacity</p>
              <p className="text-lg font-bold text-gray-900">40 L</p>
            </div>
            <div className="bg-surface rounded-2xl p-4 border border-gray-100">
              <BatteryIcon className="w-5 h-5 text-primary mb-2" />
              <p className="text-sm text-gray-600">Coverage/Battery</p>
              <p className="text-lg font-bold text-gray-900">2.5 acres</p>
            </div>
            <div className="bg-surface rounded-2xl p-4 border border-gray-100">
              <CalendarIcon className="w-5 h-5 text-primary mb-2" />
              <p className="text-sm text-gray-600">Year</p>
              <p className="text-lg font-bold text-gray-900">2022</p>
            </div>
            <div className="bg-surface rounded-2xl p-4 border border-gray-100">
              <span className="text-2xl mb-2 block">🎯</span>
              <p className="text-sm text-gray-600">Spray Width</p>
              <p className="text-lg font-bold text-gray-900">11 m</p>
            </div>
          </div>
        </div>

        {/* Spray Coverage Estimator - Rule-Based Logic */}
        <SmartEstimateCard title="Spray Coverage Estimator" variant="lime">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Enter Area (Acres)
              </label>
              <input
                type="number"
                value={acres}
                onChange={(e) => setAcres(e.target.value)}
                className="w-full h-12 px-4 border-2 border-gray-200 rounded-2xl font-semibold focus:border-primary focus:outline-none"
                placeholder="10" />
              
            </div>
            <div className="bg-white rounded-xl p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Batteries Needed</span>
                <span className="font-bold text-gray-900">
                  {batteriesNeeded}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Estimated Time</span>
                <span className="font-bold text-secondary-700">
                  {timeEstimate} min
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Cost</span>
                <span className="font-bold text-primary">
                  ₹{(Number(acres) * Math.round(machine.price_per_day / 10)).toFixed(0)}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-600 italic">
              Formula: 2.5 acres/battery, 15 min/battery cycle
            </p>
          </div>
        </SmartEstimateCard>

        {/* Location */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Location</h2>
          <div className="bg-surface rounded-2xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <MapPinIcon className="w-5 h-5 text-primary" />
              <span className="font-semibold text-gray-900">
                {machine.village || 'Vadodara, Gujarat'}
              </span>
            </div>
            <p className="text-sm text-gray-600">{machine.distance_km ? `${machine.distance_km} km` : '8.5 km'} from your location</p>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-surface border-t border-gray-200">
        <Link to="/seeker/availability" state={{ machine }}>
          <Button fullWidth size="lg">
            Check Availability
          </Button>
        </Link>
      </div>

      <BottomNav role="seeker" />
    </div>);

}