import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom tractor/equipment icon for live tracking
const equipmentLiveIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface LiveTrackingMapProps {
  initialLat: number;
  initialLng: number;
  equipmentName?: string;
}

export function LiveTrackingMap({ initialLat, initialLng, equipmentName = "Equipment" }: LiveTrackingMapProps) {
  // Fixed position for the marker
  const currentPos = { lat: initialLat, lng: initialLng };

  return (
    <div className="relative w-full h-full">
      <MapContainer 
        center={[initialLat, initialLng]} 
        zoom={16} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        zoomControl={false}
        dragging={false}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://maps.google.com/">Google Maps</a>'
          url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
        />
        
        {/* The trail of where it has been */}
        {/* Removed simulated path */}

        {/* The current position marker */}
        <Marker position={[currentPos.lat, currentPos.lng]} icon={equipmentLiveIcon}>
          <Popup>
            <b>{equipmentName}</b><br/>
            Live Working...
          </Popup>
        </Marker>
      </MapContainer>

      {/* Live Badge Overlay */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-sm flex items-center gap-2 z-10 pointer-events-none border border-red-100">
        <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
        <span className="text-xs font-bold text-gray-900">Live GPS Tracking</span>
      </div>
    </div>
  );
}
