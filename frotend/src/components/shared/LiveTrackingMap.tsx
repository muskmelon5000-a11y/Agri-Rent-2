import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
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
  // We simulate live movement by updating the marker coordinate slightly every 2 seconds
  const [currentPos, setCurrentPos] = useState<{lat: number, lng: number}>({ lat: initialLat, lng: initialLng });
  const [path, setPath] = useState<[number, number][]>([[initialLat, initialLng]]);

  useEffect(() => {
    // Simulated movement parameters (plowing a field pattern or simple movement)
    let step = 0;
    const intervalId = setInterval(() => {
      setCurrentPos(prev => {
        // Move slightly right and up
        const latOffset = Math.sin(step * 0.5) * 0.0001; 
        const lngOffset = Math.cos(step * 0.5) * 0.0001 + 0.00005;
        
        const newLat = prev.lat + latOffset;
        const newLng = prev.lng + lngOffset;
        
        setPath(p => [...p, [newLat, newLng]]);
        return { lat: newLat, lng: newLng };
      });
      step += 1;
    }, 2000); // update every 2 seconds

    return () => clearInterval(intervalId);
  }, []);

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
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* The trail of where it has been */}
        <Polyline positions={path} color="#ef4444" weight={4} opacity={0.6} dashArray="5, 10" />

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
