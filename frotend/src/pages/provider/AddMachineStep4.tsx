import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppHeader } from '../../components/shared/AppHeader';
import { Button } from '../../components/shared/Button';
import { Input } from '../../components/shared/Input';
import { Card } from '../../components/shared/Card';
import { MapPinIcon, Loader2Icon } from 'lucide-react';
import { equipmentService, EquipmentCreate } from '../../services/equipmentService';
import { useAuth } from '../../context/AuthContext';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function LocationPicker({ position, setPosition }: { position: any, setPosition: any }) {
  const map = useMap();
  
  useMapEvents({
    click(e) {
      setPosition((prev: any) => ({ ...prev, lat: e.latlng.lat, lng: e.latlng.lng, status: 'success' }));
    },
  });

  useEffect(() => {
    if (position.status === 'success') {
      map.flyTo([position.lat, position.lng], map.getZoom(), { animate: true, duration: 1 });
    }
  }, [position.lat, position.lng, map]);

  return position.status === 'success' ? (
    <Marker position={[position.lat, position.lng]} />
  ) : null;
}

export function AddMachineStep4() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const equipmentData = location.state?.equipmentData || {};
  
  const [delivery, setDelivery] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationState, setLocationState] = useState({ lat: 22.3, lng: 73.1, status: 'idle' });

  const handleGetLocation = () => {
    setLocationState(prev => ({ ...prev, status: 'loading' }));
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationState({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            status: 'success'
          });
        },
        (error) => {
          console.error("Error getting location", error);
          setLocationState(prev => ({ ...prev, status: 'error' }));
        }
      );
    } else {
      setLocationState(prev => ({ ...prev, status: 'error' }));
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      const payload: EquipmentCreate = {
        ...equipmentData,
        latitude: locationState.lat,
        longitude: locationState.lng,
        village: user?.village || "Unknown",
        district: user?.district || "Unknown"
      };

      await equipmentService.create(payload);
      navigate('/provider/equipment');
    } catch (error) {
      console.error("Failed to create equipment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full bg-background flex flex-col">
      <AppHeader title="Add Equipment" showBack />

      {/* Stepper */}
      <div className="bg-surface px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-primary">Step 4 of 4</span>
          <span className="text-sm font-medium text-gray-500">
            Location & Delivery
          </span>
        </div>
        <div className="flex gap-2">
          <div className="h-2 flex-1 bg-primary rounded-full" />
          <div className="h-2 flex-1 bg-primary rounded-full" />
          <div className="h-2 flex-1 bg-primary rounded-full" />
          <div className="h-2 flex-1 bg-primary rounded-full" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* Map Location */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            Equipment Location
          </h2>
          <div className="h-64 bg-gray-100 rounded-2xl relative overflow-hidden border border-gray-200 mb-3 z-0">
            <MapContainer 
              center={[locationState.lat, locationState.lng]} 
              zoom={12} 
              style={{ height: '100%', width: '100%' }}
              zoomControl={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationPicker position={locationState} setPosition={setLocationState} />
            </MapContainer>
            {locationState.status !== 'success' && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-white/90 px-3 py-1.5 rounded-full shadow-md text-xs font-bold text-gray-700 z-[1000] pointer-events-none whitespace-nowrap">
                Tap on the map to drop a pin
              </div>
            )}
          </div>
          <Button 
            variant="outline" 
            fullWidth 
            onClick={handleGetLocation}
            disabled={locationState.status === 'loading'}
            className={locationState.status === 'success' ? 'bg-green-50 border-green-200 text-green-700' : ''}
          >
            {locationState.status === 'loading' ? (
              <><Loader2Icon className="w-4 h-4 mr-2 animate-spin" /> Locating...</>
            ) : locationState.status === 'success' ? (
              <><MapPinIcon className="w-4 h-4 mr-2" /> Location Verified</>
            ) : (
              <><MapPinIcon className="w-4 h-4 mr-2" /> Use Current Location</>
            )}
          </Button>
        </div>

        {/* Service Radius */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Service Radius (km)
          </label>
          <input
            type="range"
            min="1"
            max="50"
            defaultValue="15"
            className="w-full" />
          
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1 km</span>
            <span className="font-bold text-primary">15 km</span>
            <span>50 km</span>
          </div>
        </div>

        {/* Delivery Options */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-bold text-gray-900">Offer Delivery</p>
              <p className="text-sm text-gray-600">
                I can transport this to the seeker
              </p>
            </div>
            <div
              onClick={() => setDelivery(!delivery)}
              className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${delivery ? 'bg-primary' : 'bg-gray-300'}`}>
              
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${delivery ? 'right-1' : 'left-1'}`} />
              
            </div>
          </div>

          {delivery &&
          <div className="pt-4 border-t border-gray-100">
              <Input
              label="Delivery Charge per km (₹)"
              type="number"
              defaultValue="50"
              icon={<span className="text-gray-500 font-bold">₹</span>} />
            
            </div>
          }
        </Card>
      </div>

      <div className="p-6 bg-surface border-t border-gray-200">
        <Button
          fullWidth
          size="lg"
          disabled={isSubmitting}
          onClick={handleSubmit}>
          
          {isSubmitting ? (
            <>
              <Loader2Icon className="w-5 h-5 mr-2 animate-spin" />
              Publishing...
            </>
          ) : (
            'Publish Equipment'
          )}
        </Button>
      </div>
    </div>);

}