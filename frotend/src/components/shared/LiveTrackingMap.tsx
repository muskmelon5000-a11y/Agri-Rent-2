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
  const currentPos = { lat: initialLat, lng: initialLng };
  const [mapLayer, setMapLayer] = React.useState<'streets' | 'hybrid' | 'terrain'>('streets');

  const tileUrls = {
    streets: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    hybrid: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    terrain: 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
  };

  return (
    <div className="relative w-full h-full">
      <MapContainer 
        center={[initialLat, initialLng]} 
        zoom={16} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        zoomControl={false}
        dragging={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          key={mapLayer}
          attribution='&copy; <a href="https://maps.google.com/">Google Maps</a>'
          url={tileUrls[mapLayer]}
        />
        
        {/* The current position marker */}
        <Marker position={[currentPos.lat, currentPos.lng]} icon={equipmentLiveIcon}>
          <Popup>
            <b>{equipmentName}</b><br/>
            Live Working...
          </Popup>
        </Marker>
      </MapContainer>

      {/* Live Badge Overlay */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-sm flex items-center gap-2 z-10 border border-red-100">
        <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
        <span className="text-xs font-bold text-gray-900">Live GPS Tracking</span>
      </div>

      {/* Map Layer Controls */}
      <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur rounded-xl shadow-md p-1 flex gap-1 border border-gray-200">
        <button
          onClick={() => setMapLayer('streets')}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold ${mapLayer === 'streets' ? 'bg-emerald-600 text-white' : 'text-gray-700'}`}
        >
          Map
        </button>
        <button
          onClick={() => setMapLayer('hybrid')}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold ${mapLayer === 'hybrid' ? 'bg-emerald-600 text-white' : 'text-gray-700'}`}
        >
          Satellite
        </button>
        <button
          onClick={() => setMapLayer('terrain')}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold ${mapLayer === 'terrain' ? 'bg-emerald-600 text-white' : 'text-gray-700'}`}
        >
          Terrain
        </button>
      </div>
    </div>
  );
}
