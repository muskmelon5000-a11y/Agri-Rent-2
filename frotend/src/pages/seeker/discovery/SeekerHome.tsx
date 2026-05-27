import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BottomNav } from '../../../components/shared/BottomNav';
import { Card } from '../../../components/shared/Card';
import { Badge } from '../../../components/shared/Badge';
import {
  MapPinIcon,
  SearchIcon,
  TractorIcon,
  SproutIcon,
  WrenchIcon,
  PlaneIcon,
  CloudSunIcon } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { equipmentService, Equipment } from '../../../services/equipmentService';

const categories = [
{
  name: 'Tractors',
  icon: TractorIcon,
  path: '/seeker/category/tractor',
  color: 'bg-primary-50 text-primary'
},
{
  name: 'Harvesters',
  icon: SproutIcon,
  path: '/seeker/category/harvester',
  color: 'bg-secondary-50 text-secondary-700'
},
{
  name: 'Implements',
  icon: WrenchIcon,
  path: '/seeker/category/implement',
  color: 'bg-earth-amber/10 text-earth-amber'
},
{
  name: 'Drones',
  icon: PlaneIcon,
  path: '/seeker/category/drone',
  color: 'bg-earth-blue/10 text-earth-blue'
}];

export function SeekerHome() {
  const { user } = useAuth();
  const [nearbyMachines, setNearbyMachines] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Default Ahmedabad center if GPS not available
  const [userLocation, setUserLocation] = useState({ lat: 23.0225, lng: 72.5714 });

  useEffect(() => {
    // Get user GPS location if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
        },
        (err) => console.log("GPS denied, using default location")
      );
    }
  }, []);

  useEffect(() => {
    async function loadNearby() {
      try {
        setIsLoading(true);
        const data = await equipmentService.getNearby({
          lat: userLocation.lat,
          lng: userLocation.lng,
          radius_km: 20
        });
        setNearbyMachines(data);
      } catch (error) {
        console.error("Failed to fetch nearby equipment:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadNearby();
  }, [userLocation]);

  return (
    <div className="min-h-full bg-background pb-20">
      {/* Header */}
      <div className="bg-primary px-6 pt-6 pb-8 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/80 text-sm font-medium mb-1">नमस्ते,</p>
            <h1 className="text-white text-2xl font-bold">{user?.name || "Farmer"}</h1>
          </div>
          <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-2xl">🔔</span>
          </button>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-white/90 mb-4">
          <MapPinIcon className="w-4 h-4" />
          <span className="text-sm font-medium">{user?.village ? `${user.village}${user.district ? `, ${user.district}` : ''}` : "Anandpur, Kheda District"}</span>
        </div>

        {/* Search Bar */}
        <Link to="/seeker/search">
          <div className="bg-white rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm">
            <SearchIcon className="w-5 h-5 text-gray-400" />
            <span className="text-gray-500">
              Search tractors, tools, equipment...
            </span>
          </div>
        </Link>
      </div>

      {/* Categories */}
      <div className="px-6 py-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Browse by Category
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link key={cat.name} to={cat.path}>
                <Card className="p-4">
                  <div
                    className={`w-12 h-12 ${cat.color} rounded-2xl flex items-center justify-center mb-3`}>
                    
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                </Card>
              </Link>);

          })}
        </div>
      </div>

      {/* Nearby Available Now */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">
            Available Near You
          </h2>
          <Link
            to="/seeker/search-map"
            className="text-sm font-semibold text-primary">
            Map View →
          </Link>
        </div>
        
        {isLoading ? (
          <div className="py-8 text-center text-gray-500">Loading nearby equipment...</div>
        ) : nearbyMachines.length === 0 ? (
          <div className="py-8 text-center text-gray-500">No equipment found within 20km</div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {nearbyMachines.map((machine) =>
            <Link key={machine.id} to={`/seeker/machine/${machine.id}`}>
                <Card className="w-64 flex-shrink-0">
                  <img
                  src={machine.images?.[0] || 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400'}
                  alt={machine.name}
                  className="w-full h-40 object-cover rounded-t-2xl" />
                
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1 truncate w-40">
                          {machine.name}
                        </h3>
                        <p className="text-sm text-gray-600">{machine.hp ? `${machine.hp} HP` : machine.brand}</p>
                      </div>
                      <Badge variant="success" size="sm">
                        ⭐ {machine.rating}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-lg font-bold text-primary">
                        ₹{machine.price_per_day}
                        <span className="text-sm font-medium">/day</span>
                      </span>
                      <span className="text-sm text-gray-600 flex items-center gap-1">
                        <MapPinIcon className="w-4 h-4" />
                        {machine.distance_km} km
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Hubs Near You */}
      <div className="px-6 pb-6">
        <Link to="/seeker/hubs">
          <Card className="p-4 bg-gradient-to-br from-secondary-50 to-primary-50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
                <MapPinIcon className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Community Equipment Hubs
                </h3>
                <p className="text-sm text-gray-600">3 hubs within 10 km</p>
              </div>
              <span className="text-primary font-semibold">→</span>
            </div>
          </Card>
        </Link>
      </div>

      {/* Weather Tip */}
      <div className="px-6 pb-6">
        <Card className="p-4 bg-amber-50 border-amber-200">
          <div className="flex items-start gap-3">
            <CloudSunIcon className="w-6 h-6 text-earth-amber flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Season Tip</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Rabi season is ideal for wheat planting. Consider booking a
                rotavator for soil preparation.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <BottomNav role="seeker" />
    </div>);
}