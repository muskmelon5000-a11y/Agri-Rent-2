import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { equipmentService, Equipment } from '../../../services/equipmentService';
import { AppHeader } from '../../../components/shared/AppHeader';
import { BottomNav } from '../../../components/shared/BottomNav';
import { Button } from '../../../components/shared/Button';
import { Badge } from '../../../components/shared/Badge';
import { SmartEstimateCard } from '../../../components/shared/SmartEstimateCard';
import { Avatar } from '../../../components/shared/Avatar';
import {
  MapPinIcon,
  StarIcon,
  FuelIcon,
  GaugeIcon,
  CalendarIcon,
  WrenchIcon } from
'lucide-react';
const images = [
'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
'https://images.unsplash.com/photo-1589395937772-6d5c0e7e2a7f?w=800',
'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800'];

export function MachineDetailTractor({ initialMachine }: { initialMachine?: Equipment }) {
  const { id } = useParams();
  const [machine, setMachine] = useState<Equipment | null>(initialMachine || null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [imageFit, setImageFit] = useState<'cover' | 'contain'>('cover');
  const [acres, setAcres] = useState('5');
  const [selectedRateType, setSelectedRateType] = useState<'hour' | 'day' | 'acre'>('day');

  useEffect(() => {
    async function fetchMachine() {
      if (initialMachine) {
        setMachine(initialMachine);
        setIsLoading(false);
        return;
      }
      if (!id) return;
      try {
        const data = await equipmentService.getById(id!);
        setMachine(data);
      } catch (error) {
        console.error("Failed to load machine details:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMachine();
  }, [id, initialMachine]);

  if (isLoading) {
    return <div className="min-h-full bg-background pb-20 flex items-center justify-center">Loading...</div>;
  }

  if (!machine) {
    return <div className="min-h-full bg-background pb-20 flex items-center justify-center">Machine not found.</div>;
  }

  const machineImages = machine.images?.length ? machine.images : images;

  // Dynamic Fuel Calculation based on tractor HP
  const hpVal = machine.hp || 47;
  const litersPerAcre = Math.min(Math.max(hpVal * 0.05, 1.5), 5.0);
  const estimatedFuel = (parseFloat(acres) || 0) * litersPerAcre;
  const fuelCost = estimatedFuel * 95;

  const perHourRate = machine.price_per_hour || Math.round(machine.price_per_day / 8);
  const perDayRate = machine.price_per_day;
  const perAcreRate = Math.round(machine.price_per_day * 0.7);

  const getSelectedPrice = () => {
    if (selectedRateType === 'hour') return perHourRate;
    if (selectedRateType === 'acre') return perAcreRate;
    return perDayRate;
  };

  return (
    <div className="min-h-full bg-background pb-20">
      <AppHeader title="Tractor Details" showBack />

      {/* Image Gallery */}
      <div className="relative bg-gray-950 flex items-center justify-center h-80 overflow-hidden">
        <img
          src={machineImages[currentImage]}
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

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {machineImages.map((_, idx) =>
          <button
            key={idx}
            onClick={() => setCurrentImage(idx)}
            className={`h-2 rounded-full transition-all ${idx === currentImage ? 'bg-white w-6' : 'bg-white/50 w-2'}`} />
          )}
        </div>
        <Badge variant={machine.is_available ? "success" : "neutral"} className="absolute top-4 right-4 z-10">
          {machine.is_available ? "Available Now" : "Currently Rented"}
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
                {machine.hp ? `${machine.hp} HP • ` : ''}{machine.brand || 'Mahindra'} • {machine.year || '2021'} Model
              </p>
            </div>
            <div className="flex items-center gap-1 bg-secondary-50 px-3 py-2 rounded-xl">
              <StarIcon className="w-5 h-5 text-secondary-700 fill-secondary-700" />
              <span className="font-bold text-gray-900">{machine.rating || '4.8'}</span>
              <span className="text-sm text-gray-600">({machine.total_ratings || 12})</span>
            </div>
          </div>

          {/* Owner */}
          <Link to={`/seeker/owner/${machine.owner_id}`}>
            <div className="flex items-center gap-3 p-4 bg-surface rounded-2xl border border-gray-100 hover:border-emerald-200 transition">
              <Avatar name={machine.owner_name || "Owner"} verified size="md" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{machine.owner_name || "Owner"}</h3>
                <p className="text-sm text-gray-600">
                  Equipment Owner
                </p>
              </div>
              <span className="text-primary font-semibold">→</span>
            </div>
          </Link>
        </div>

        {/* Price Tabs - Interactive */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900">Rental Rates</h2>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              Selected: Per {selectedRateType.toUpperCase()}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setSelectedRateType('hour')}
              className={`rounded-2xl p-4 text-center border-2 transition-all ${
                selectedRateType === 'hour'
                  ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600/20'
                  : 'bg-surface border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className={`text-xs font-semibold mb-1 ${selectedRateType === 'hour' ? 'text-emerald-800' : 'text-gray-600'}`}>
                Per Hour
              </p>
              <p className={`text-xl font-bold ${selectedRateType === 'hour' ? 'text-emerald-700' : 'text-gray-900'}`}>
                ₹{perHourRate}
              </p>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRateType('day')}
              className={`rounded-2xl p-4 text-center border-2 transition-all ${
                selectedRateType === 'day'
                  ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600/20'
                  : 'bg-surface border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className={`text-xs font-semibold mb-1 ${selectedRateType === 'day' ? 'text-emerald-800' : 'text-gray-600'}`}>
                Per Day
              </p>
              <p className={`text-xl font-bold ${selectedRateType === 'day' ? 'text-emerald-700' : 'text-gray-900'}`}>
                ₹{perDayRate}
              </p>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRateType('acre')}
              className={`rounded-2xl p-4 text-center border-2 transition-all ${
                selectedRateType === 'acre'
                  ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600/20'
                  : 'bg-surface border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className={`text-xs font-semibold mb-1 ${selectedRateType === 'acre' ? 'text-emerald-800' : 'text-gray-600'}`}>
                Per Acre
              </p>
              <p className={`text-xl font-bold ${selectedRateType === 'acre' ? 'text-emerald-700' : 'text-gray-900'}`}>
                ₹{perAcreRate}
              </p>
            </button>
          </div>
        </div>

        {/* Dynamic Specifications */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            Specifications
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface rounded-2xl p-4 border border-gray-100 shadow-sm">
              <GaugeIcon className="w-5 h-5 text-emerald-600 mb-2" />
              <p className="text-xs text-gray-500 font-medium">Horsepower</p>
              <p className="text-base font-bold text-gray-900">{machine.hp ? `${machine.hp} HP` : '47 HP'}</p>
            </div>
            <div className="bg-surface rounded-2xl p-4 border border-gray-100 shadow-sm">
              <FuelIcon className="w-5 h-5 text-emerald-600 mb-2" />
              <p className="text-xs text-gray-500 font-medium">Fuel Type</p>
              <p className="text-base font-bold text-gray-900">{machine.fuel_type || 'Diesel'}</p>
            </div>
            <div className="bg-surface rounded-2xl p-4 border border-gray-100 shadow-sm">
              <CalendarIcon className="w-5 h-5 text-emerald-600 mb-2" />
              <p className="text-xs text-gray-500 font-medium">Model Year</p>
              <p className="text-base font-bold text-gray-900">{machine.year || '2021'}</p>
            </div>
            <div className="bg-surface rounded-2xl p-4 border border-gray-100 shadow-sm">
              <WrenchIcon className="w-5 h-5 text-emerald-600 mb-2" />
              <p className="text-xs text-gray-500 font-medium">Drive Type</p>
              <p className="text-base font-bold text-gray-900">{machine.drive_type || '4WD'}</p>
            </div>
          </div>
        </div>

        {/* Attachments */}
        {machine.attachments && machine.attachments.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              Included Attachments
            </h2>
            <div className="flex flex-wrap gap-2">
              {machine.attachments.map((att, idx) => (
                <Badge key={idx} variant="secondary">{att}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Fuel Estimator - Dynamic Logic */}
        <SmartEstimateCard title="Fuel Cost Estimator" variant="amber">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-900 mb-1">
                Enter Field Area (Acres)
              </label>
              <input
                type="number"
                value={acres}
                onChange={(e) => setAcres(e.target.value)}
                className="w-full h-11 px-4 border-2 border-amber-200 rounded-xl font-bold text-gray-900 bg-white focus:border-amber-500 focus:outline-none"
                placeholder="5" />
            </div>
            <div className="bg-white rounded-xl p-4 space-y-2 border border-amber-100 shadow-sm">
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">Estimated Diesel</span>
                <span className="font-bold text-gray-900">
                  {estimatedFuel.toFixed(1)} Liters
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">
                  Estimated Fuel Cost (@₹95/L)
                </span>
                <span className="font-bold text-amber-700">
                  ₹{fuelCost.toFixed(0)}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-600 italic">
              Formula: ~{litersPerAcre.toFixed(1)} L/acre for {machine.hp ? machine.hp + ' HP' : '47 HP'} tractor operation
            </p>
          </div>
        </SmartEstimateCard>

        {/* Location */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Location</h2>
          <div className="bg-surface rounded-2xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <MapPinIcon className="w-5 h-5 text-emerald-600" />
              <span className="font-semibold text-gray-900">
                {machine.village ? `${machine.village}, ${machine.district || ''}` : 'Anandpur, Kheda'}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              {machine.distance_km ? `${machine.distance_km} km from your location` : 'Location verified'}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="sticky bottom-0 left-0 right-0 p-4 bg-surface border-t border-gray-200 z-30 shadow-lg mt-auto">
        <Link to="/seeker/availability" state={{ machine, selectedRateType, ratePrice: getSelectedPrice() }}>
          <Button fullWidth size="lg" className="bg-emerald-600 hover:bg-emerald-700 font-bold text-white shadow-md">
            Check Availability (₹{getSelectedPrice()}/{selectedRateType})
          </Button>
        </Link>
      </div>

      <BottomNav role="seeker" />
    </div>);

}