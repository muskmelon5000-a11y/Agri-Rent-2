import React from 'react';
import { Link } from 'react-router-dom';
import { AppHeader } from '../../../components/shared/AppHeader';
import { BottomNav } from '../../../components/shared/BottomNav';
import { Button } from '../../../components/shared/Button';
import { Badge } from '../../../components/shared/Badge';
import { SmartEstimateCard } from '../../../components/shared/SmartEstimateCard';
import { Avatar } from '../../../components/shared/Avatar';
import { MapPinIcon, StarIcon, TagIcon } from 'lucide-react';
import { equipmentService, Equipment } from '../../../services/equipmentService';
import { useState } from 'react';

export function MachineDetailTools({ initialMachine }: { initialMachine?: Equipment }) {
  const [machine] = useState<Equipment | null>(initialMachine || null);
  const [imageFit, setImageFit] = useState<'cover' | 'contain'>('cover');

  if (!machine) {
    return <div className="min-h-full bg-background pb-20 flex items-center justify-center">Machine not found.</div>;
  }
  let toolImages: string[] = [];
  if (Array.isArray(machine.images)) {
    toolImages = machine.images;
  } else if (typeof machine.images === 'string') {
    try {
      const parsed = JSON.parse(machine.images);
      toolImages = Array.isArray(parsed) ? parsed : [machine.images];
    } catch (e) {
      if ((machine.images as string).startsWith("http")) toolImages = [machine.images as string];
    }
  }
  const primaryToolImage = toolImages[0] || 'https://images.unsplash.com/photo-1416339442236-8ceb164046f8?w=800';

  return (
    <div className="min-h-full bg-background pb-20">
      <AppHeader title="Tool Details" showBack />

      {/* Image */}
      <div className="relative bg-gray-950 flex items-center justify-center h-80 overflow-hidden">
        <img
          src={primaryToolImage}
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
                {machine.brand || 'Hand-operated'} • {machine.year || 'Standard Tool'}
              </p>
            </div>
            <div className="flex items-center gap-1 bg-secondary-50 px-3 py-2 rounded-xl">
              <StarIcon className="w-5 h-5 text-secondary-700 fill-secondary-700" />
              <span className="font-bold text-gray-900">{machine.rating || '4.7'}</span>
              <span className="text-sm text-gray-600">({machine.total_ratings || 0})</span>
            </div>
          </div>

          {/* Owner */}
          <Link to={`/seeker/owner/${machine.owner_id}`}>
            <div className="flex items-center gap-3 p-4 bg-surface rounded-2xl border border-gray-100">
              <Avatar name={machine.owner_name || "Owner"} verified size="md" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{machine.owner_name || "Owner"}</h3>
                <p className="text-sm text-gray-600">Tool Owner</p>
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
              <p className="text-sm text-gray-600 mb-1">Per Day</p>
              <p className="text-2xl font-bold text-primary">₹{machine.price_per_day}</p>
            </div>
            <div className="bg-surface border-2 border-gray-200 rounded-2xl p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Per Week</p>
              <p className="text-2xl font-bold text-gray-900">₹{machine.price_per_day * 6}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Description</h2>
          <div className="bg-surface rounded-2xl p-4 border border-gray-100">
            <p className="text-base text-gray-700 leading-relaxed">
              {machine.description || "High-quality agricultural tool suitable for farm operations. Lightweight and easy to operate."}
            </p>
          </div>
        </div>

        {/* Bundle Discount - Rule-Based Logic */}
        <SmartEstimateCard title="Bundle Discount Available" variant="lime">
          <div className="space-y-3">
            <p className="text-sm text-gray-700">
              Rent this tool with other equipment and save!
            </p>
            <div className="bg-white rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Seed Drill + Fertilizer Spreader
                </span>
                <Badge variant="success" size="sm">
                  Save 15%
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">3+ tools together</span>
                <Badge variant="success" size="sm">
                  Save 20%
                </Badge>
              </div>
            </div>
            <p className="text-xs text-gray-600 italic">
              Bundle discounts applied automatically at checkout
            </p>
          </div>
        </SmartEstimateCard>

        {/* Features */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Features</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 bg-surface rounded-xl border border-gray-100">
              <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
                <TagIcon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-gray-900">
                8-row capacity
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-surface rounded-xl border border-gray-100">
              <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
                <TagIcon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-gray-900">
                Adjustable seed spacing
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-surface rounded-xl border border-gray-100">
              <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
                <TagIcon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-gray-900">
                Lightweight design
              </span>
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Location</h2>
          <div className="bg-surface rounded-2xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <MapPinIcon className="w-5 h-5 text-primary" />
              <span className="font-semibold text-gray-900">
                {machine.village || 'Anandpur, Kheda'}
              </span>
            </div>
            <p className="text-sm text-gray-600">{machine.distance_km ? `${machine.distance_km} km` : '1.8 km'} from your location</p>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="sticky bottom-0 left-0 right-0 p-4 bg-surface border-t border-gray-200 z-30 shadow-lg mt-auto">
        <Link to="/seeker/availability" state={{ machine, ratePrice: machine.price_per_day, selectedRateType: 'day' }}>
          <Button fullWidth size="lg" className="bg-emerald-600 hover:bg-emerald-700 font-bold text-white shadow-md">
            Check Availability & Book Implement
          </Button>
        </Link>
      </div>

      <BottomNav role="seeker" />
    </div>);

}