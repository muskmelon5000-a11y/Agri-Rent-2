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
  const [acres, setAcres] = useState('5');
  const estimatedFuel = Number(acres) * 2.5;
  const fuelCost = estimatedFuel * 95;

  useEffect(() => {
    async function fetchMachine() {
      if (initialMachine) {
        setMachine(initialMachine);
        setIsLoading(false);
        return;
      }
      if (!id) return;
      try {
        const data = await equipmentService.getById(Number(id));
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

  return (
    <div className="min-h-full bg-background pb-20">
      <AppHeader title="Tractor Details" showBack />

      {/* Image Gallery */}
      <div className="relative">
        <img
          src={machineImages[currentImage]}
          alt={machine.name}
          className="w-full h-72 object-cover" />
        
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {machineImages.map((_, idx) =>
          <button
            key={idx}
            onClick={() => setCurrentImage(idx)}
            className={`w-2 h-2 rounded-full transition-all ${idx === currentImage ? 'bg-white w-6' : 'bg-white/50'}`} />

          )}
        </div>
        <Badge variant="success" className="absolute top-4 right-4">
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
                {machine.hp ? `${machine.hp} HP • ` : ''}{machine.brand || 'Standard'} • {machine.year || '2020'} Model
              </p>
            </div>
            <div className="flex items-center gap-1 bg-secondary-50 px-3 py-2 rounded-xl">
              <StarIcon className="w-5 h-5 text-secondary-700 fill-secondary-700" />
              <span className="font-bold text-gray-900">{machine.rating || '4.5'}</span>
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
                  Equipment Owner
                </p>
              </div>
              <span className="text-primary font-semibold">→</span>
            </div>
          </Link>
        </div>

        {/* Price Tabs */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Rental Rates</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-primary-50 border-2 border-primary rounded-2xl p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Per Hour</p>
              <p className="text-2xl font-bold text-primary">₹{machine.price_per_hour || Math.round(machine.price_per_day / 8)}</p>
            </div>
            <div className="bg-surface border-2 border-gray-200 rounded-2xl p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Per Day</p>
              <p className="text-2xl font-bold text-gray-900">₹{machine.price_per_day}</p>
            </div>
            <div className="bg-surface border-2 border-gray-200 rounded-2xl p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Per Acre</p>
              <p className="text-2xl font-bold text-gray-900">₹{Math.round(machine.price_per_day * 0.7)}</p>
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
              <p className="text-sm text-gray-600">Horsepower</p>
              <p className="text-lg font-bold text-gray-900">47 HP</p>
            </div>
            <div className="bg-surface rounded-2xl p-4 border border-gray-100">
              <FuelIcon className="w-5 h-5 text-primary mb-2" />
              <p className="text-sm text-gray-600">Fuel Type</p>
              <p className="text-lg font-bold text-gray-900">Diesel</p>
            </div>
            <div className="bg-surface rounded-2xl p-4 border border-gray-100">
              <CalendarIcon className="w-5 h-5 text-primary mb-2" />
              <p className="text-sm text-gray-600">Year</p>
              <p className="text-lg font-bold text-gray-900">2019</p>
            </div>
            <div className="bg-surface rounded-2xl p-4 border border-gray-100">
              <WrenchIcon className="w-5 h-5 text-primary mb-2" />
              <p className="text-sm text-gray-600">Drive Type</p>
              <p className="text-lg font-bold text-gray-900">4WD</p>
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

        {/* Fuel Estimator - Rule-Based Logic */}
        <SmartEstimateCard title="Fuel Cost Estimator" variant="amber">
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
                placeholder="5" />
              
            </div>
            <div className="bg-white rounded-xl p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Estimated Diesel</span>
                <span className="font-bold text-gray-900">
                  {estimatedFuel.toFixed(1)} L
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">
                  Fuel Cost (@₹95/L)
                </span>
                <span className="font-bold text-earth-terracotta">
                  ₹{fuelCost.toFixed(0)}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-600 italic">
              Formula: 2.5 L/acre for ploughing operation
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
                {machine.village || 'Anandpur, Kheda'}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              {machine.distance_km ? `${machine.distance_km} km from your location` : 'Location verified'}
            </p>
            <div className="h-32 bg-gradient-to-br from-green-50 to-amber-50 rounded-xl flex items-center justify-center">
              <span className="text-4xl">🗺️</span>
            </div>
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