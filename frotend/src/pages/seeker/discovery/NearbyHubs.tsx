import React from 'react';
import { AppHeader } from '../../../components/shared/AppHeader';
import { BottomNav } from '../../../components/shared/BottomNav';
import { Card } from '../../../components/shared/Card';
import { Badge } from '../../../components/shared/Badge';
import { MapPinIcon, TractorIcon, PhoneIcon } from 'lucide-react';
const hubs = [
{
  id: 1,
  name: 'Anandpur Community Hub',
  distance: '2.3 km',
  equipment: 12,
  contact: '+91 98765 43210'
},
{
  id: 2,
  name: 'Kheda Agricultural Center',
  distance: '5.8 km',
  equipment: 18,
  contact: '+91 98765 43211'
},
{
  id: 3,
  name: 'Village Equipment Pool',
  distance: '8.2 km',
  equipment: 8,
  contact: '+91 98765 43212'
}];

export function NearbyHubs() {
  return (
    <div className="min-h-full bg-background pb-20">
      <AppHeader title="Community Hubs" showBack />

      {/* Map Area */}
      <div className="h-64 bg-gradient-to-br from-green-50 to-amber-50 relative">
        <svg
          className="w-full h-full"
          viewBox="0 0 400 300"
          preserveAspectRatio="xMidYMid slice">
          
          <path
            d="M 0 150 Q 200 100 400 150"
            stroke="#D1D5DB"
            strokeWidth="6"
            fill="none" />
          
          <path
            d="M 200 0 Q 180 150 200 300"
            stroke="#D1D5DB"
            strokeWidth="6"
            fill="none" />
          

          <g transform="translate(150, 100)">
            <circle cx="0" cy="0" r="15" fill="#2E7D32" opacity="0.2" />
            <circle cx="0" cy="0" r="10" fill="#2E7D32" />
          </g>

          <g transform="translate(280, 180)">
            <circle cx="0" cy="0" r="15" fill="#2E7D32" opacity="0.2" />
            <circle cx="0" cy="0" r="10" fill="#2E7D32" />
          </g>

          <g transform="translate(100, 220)">
            <circle cx="0" cy="0" r="15" fill="#2E7D32" opacity="0.2" />
            <circle cx="0" cy="0" r="10" fill="#2E7D32" />
          </g>

          <g transform="translate(200, 150)">
            <circle cx="0" cy="0" r="12" fill="#2563EB" opacity="0.3" />
            <circle cx="0" cy="0" r="6" fill="#2563EB" />
          </g>
        </svg>
      </div>

      {/* Hub List */}
      <div className="px-6 py-6 space-y-3">
        <h2 className="text-lg font-bold text-gray-900 mb-3">
          {hubs.length} Hubs Near You
        </h2>

        {hubs.map((hub) =>
        <Card key={hub.id} className="p-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                <TractorIcon className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">{hub.name}</h3>
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <MapPinIcon className="w-4 h-4" />
                    {hub.distance}
                  </span>
                  <Badge variant="secondary" size="sm">
                    {hub.equipment} equipment
                  </Badge>
                </div>
                <a
                href={`tel:${hub.contact}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                
                  <PhoneIcon className="w-4 h-4" />
                  {hub.contact}
                </a>
              </div>
            </div>
          </Card>
        )}
      </div>

      <BottomNav role="seeker" />
    </div>);

}