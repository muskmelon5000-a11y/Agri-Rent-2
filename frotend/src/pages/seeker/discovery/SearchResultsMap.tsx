import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppHeader } from '../../../components/shared/AppHeader';
import { BottomNav } from '../../../components/shared/BottomNav';
import { Card } from '../../../components/shared/Card';
import { Badge } from '../../../components/shared/Badge';
import { ListIcon, MapPinIcon } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { equipmentService, Equipment } from '../../../services/equipmentService';

// Fix Leaflet icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom equipment icon
const equipmentIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to handle map movement
function MapMoveListener({ onMoveEnd }: { onMoveEnd: (center: any) => void }) {
  useMapEvents({
    moveend: (e) => {
      onMoveEnd(e.target.getCenter());
    },
  });
  return null;
}

// Component to programmatically fly to a new location when GPS updates
function MapUpdater({ center }: { center: { lat: number, lng: number } }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([center.lat, center.lng], map.getZoom(), { animate: true });
  }, [center.lat, center.lng, map]);
  return null;
}

export function SearchResultsMap() {
  const [activePin, setActivePin] = useState<number | null>(null);
  const [machines, setMachines] = useState<Equipment[]>([]);
  const [mapCenter, setMapCenter] = useState({ lat: 23.0225, lng: 72.5714 });
  const [searchCenter, setSearchCenter] = useState({ lat: 23.0225, lng: 72.5714 });
  const [isLoading, setIsLoading] = useState(false);

  // Map layer state: 'streets' | 'hybrid' | 'terrain'
  const [mapLayer, setMapLayer] = useState<'streets' | 'hybrid' | 'terrain'>('streets');
  
  // Search bar state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const tileUrls = {
    streets: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    hybrid: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    terrain: 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
  };

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setMapCenter(loc);
          setSearchCenter(loc);
        },
        (err) => {
          console.log("GPS denied, using default location");
          alert("Could not get your location. Please check browser permissions.");
        }
      );
    }
  };

  useEffect(() => {
    requestLocation();
  }, []);

  const handleLocationSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setIsSearchingLocation(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&countrycodes=in`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const topResult = data[0];
        const newLoc = { lat: parseFloat(topResult.lat), lng: parseFloat(topResult.lon) };
        setMapCenter(newLoc);
        setSearchCenter(newLoc);
        setSearchResults([]);
      } else {
        alert("Location not found. Try searching for a nearby district or city name.");
      }
    } catch (err) {
      console.error("Geocoding search error:", err);
    } finally {
      setIsSearchingLocation(false);
    }
  };

  const loadNearby = async (center: { lat: number, lng: number }) => {
    try {
      setIsLoading(true);
      const data = await equipmentService.getNearby({
        lat: center.lat,
        lng: center.lng,
        radius_km: 20
      });
      setMachines(data);
      setSearchCenter(center);
    } catch (error) {
      console.error("Failed to fetch map equipment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNearby(mapCenter);
  }, [mapCenter.lat, mapCenter.lng]);

  const handleSearchArea = () => {
    loadNearby(mapCenter);
  };

  return (
    <div className="h-full bg-background flex flex-col relative">
      {/* Top Header & Search Bar Overlay */}
      <div className="absolute top-0 left-0 right-0 z-[1000] p-3 bg-gradient-to-b from-black/60 via-black/30 to-transparent">
        <div className="flex items-center gap-2 mb-2">
          <Link to="/seeker/home" className="w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow flex items-center justify-center text-gray-800">
            ←
          </Link>

          {/* Location Search Form */}
          <form onSubmit={handleLocationSearch} className="flex-1 relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search village, city, district in India..."
              className="w-full h-10 pl-9 pr-20 rounded-full bg-white/95 backdrop-blur shadow-md text-sm font-medium text-gray-900 border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <MapPinIcon className="w-4 h-4 text-emerald-600 absolute left-3 pointer-events-none" />
            <button
              type="submit"
              disabled={isSearchingLocation}
              className="absolute right-1 px-3 py-1 bg-emerald-600 text-white font-bold text-xs rounded-full shadow hover:bg-emerald-700 transition"
            >
              {isSearchingLocation ? "Locating..." : "Search"}
            </button>
          </form>

          <Link to="/seeker/search">
            <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow flex items-center justify-center text-gray-800">
              <ListIcon className="w-5 h-5 text-emerald-700" />
            </button>
          </Link>
        </div>
      </div>

      {/* Full Screen Map */}
      <div className="flex-1 relative z-0">
        <MapContainer 
          center={[mapCenter.lat, mapCenter.lng]} 
          zoom={12} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            key={mapLayer}
            attribution='&copy; <a href="https://maps.google.com/">Google Maps</a>'
            url={tileUrls[mapLayer]}
          />
          
          <MapMoveListener onMoveEnd={setMapCenter} />
          <MapUpdater center={searchCenter} />

          {/* User Location Marker */}
          <Circle 
            center={[searchCenter.lat, searchCenter.lng]}
            radius={20000} // 20km
            pathOptions={{ color: '#059669', fillColor: '#10B981', fillOpacity: 0.15, weight: 2 }}
          />
          <Marker position={[searchCenter.lat, searchCenter.lng]}>
            <Popup>📍 Your Search Location</Popup>
          </Marker>

          {/* Equipment Pins */}
          {machines.map((machine) => (
            <Marker 
              key={machine.id} 
              position={[machine.latitude, machine.longitude]}
              icon={equipmentIcon}
              eventHandlers={{
                click: () => setActivePin(machine.id),
              }}
            >
              <Popup>
                <b>{machine.name}</b><br/>
                ₹{machine.price_per_day}/day
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Floating Google Maps Style Layer Switcher */}
        <div className="absolute top-20 right-4 z-[1000] bg-white/95 backdrop-blur rounded-2xl shadow-lg border border-gray-200 p-1 flex flex-col gap-1">
          <button
            onClick={() => setMapLayer('streets')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
              mapLayer === 'streets' ? 'bg-emerald-600 text-white shadow' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            🗺️ Map
          </button>
          <button
            onClick={() => setMapLayer('hybrid')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
              mapLayer === 'hybrid' ? 'bg-emerald-600 text-white shadow' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            🛰️ Satellite
          </button>
          <button
            onClick={() => setMapLayer('terrain')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
              mapLayer === 'terrain' ? 'bg-emerald-600 text-white shadow' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            ⛰️ Terrain
          </button>
        </div>

        {/* Search this area button */}
        {Math.abs(mapCenter.lat - searchCenter.lat) > 0.05 && (
          <button 
            onClick={handleSearchArea}
            className="absolute top-20 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur px-4 py-2 rounded-full shadow-lg text-xs font-bold text-emerald-800 border border-emerald-200 z-[1000] animate-bounce"
          >
            {isLoading ? "Searching..." : "🔄 Search this map area"}
          </button>
        )}

        {/* Locate Me Button */}
        <button
          onClick={requestLocation}
          className="absolute bottom-60 right-4 bg-white/95 backdrop-blur p-3 rounded-full shadow-xl border border-gray-200 z-[1000] text-emerald-700 hover:scale-105 transition"
          title="Go to my GPS location"
        >
          <MapPinIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Sheet for Results */}
      <div className="absolute bottom-16 left-0 right-0 p-4 pb-6 bg-gradient-to-t from-black/20 to-transparent pointer-events-none z-[1000]">
        <div className="flex gap-4 overflow-x-auto phone-scrollbar pointer-events-auto snap-x">
          {machines.map((machine) =>
          <Link
            key={machine.id}
            to={`/seeker/machine/${machine.id}`}
            className="snap-center">
              <Card
              className={`w-72 flex-shrink-0 transition-all ${activePin === machine.id ? 'ring-2 ring-primary scale-100' : 'scale-95 opacity-90 bg-white/90'}`}>
                <div className="flex gap-3 p-3">
                  <img
                  src={machine.images?.[0] || 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400'}
                  alt={machine.name}
                  className="w-24 h-24 object-cover rounded-xl" />
                
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">
                        {machine.name}
                      </h3>
                      <div className="flex items-center gap-1 mb-1">
                        <Badge variant="success" size="sm">
                          ⭐ {machine.rating}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-primary">
                        ₹{machine.price_per_day}
                        <span className="text-xs font-medium text-gray-500">
                          /day
                        </span>
                      </p>
                      <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                        <MapPinIcon className="w-3 h-3" /> {machine.distance_km} km
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          )}
        </div>
      </div>

      <div className="relative z-[1000]">
        <BottomNav role="seeker" />
      </div>
    </div>);
}