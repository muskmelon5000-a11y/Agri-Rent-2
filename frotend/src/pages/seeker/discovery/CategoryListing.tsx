import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { equipmentService, Equipment } from '../../../services/equipmentService';
import { AppHeader } from '../../../components/shared/AppHeader';
import { BottomNav } from '../../../components/shared/BottomNav';
import { Card } from '../../../components/shared/Card';
import { Badge } from '../../../components/shared/Badge';
import { MapPinIcon, SlidersHorizontalIcon } from 'lucide-react';
export function CategoryListing() {
  const { type } = useParams();
  const [results, setResults] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const title = type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Category';

  useEffect(() => {
    async function loadCategory() {
      if (!type) return;
      setIsLoading(true);
      try {
        const data = await equipmentService.getByCategory(type);
        setResults(data);
      } catch (error) {
        console.error("Failed to fetch category:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadCategory();
  }, [type]);

  return (
    <div className="min-h-full bg-background pb-20">
      <AppHeader title={title} showBack />

      {/* Top Tabs */}
      <div className="bg-surface border-b border-gray-200 px-4 py-3 overflow-x-auto phone-scrollbar">
        <div className="flex gap-2">
          <Link to="/seeker/category/tractor">
            <button className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${type === 'tractor' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>
              Tractors
            </button>
          </Link>
          <Link to="/seeker/category/harvester">
            <button className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${type === 'harvester' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>
              Harvesters
            </button>
          </Link>
          <Link to="/seeker/category/implement">
            <button className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${type === 'implement' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>
              Implements
            </button>
          </Link>
          <Link to="/seeker/category/drone">
            <button className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${type === 'drone' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>
              Drones
            </button>
          </Link>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="px-4 py-3 flex gap-2 overflow-x-auto phone-scrollbar">
        <Link to="/seeker/filters">
          <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 flex items-center gap-2 whitespace-nowrap bg-white">
            <SlidersHorizontalIcon className="w-4 h-4" /> Filters
          </button>
        </Link>
        <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 whitespace-nowrap bg-white">
          Available Now
        </button>
        <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 whitespace-nowrap bg-white">
          Under ₹1500/day
        </button>
        <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 whitespace-nowrap bg-white">
          45-55 HP
        </button>
      </div>

      {/* Results List */}
      <div className="px-4 pb-4 space-y-3">
        {isLoading ? (
          <div className="py-8 text-center text-gray-500">Loading {title}...</div>
        ) : results.length === 0 ? (
          <div className="py-8 text-center text-gray-500">No {title} found.</div>
        ) : results.map((machine) =>
        <Link key={machine.id} to={`/seeker/machine/${machine.id}`}>
            <Card className="overflow-hidden">
              <div className="relative">
                <img
                src={machine.images?.[0] || 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400'}
                alt={machine.name}
                className="w-full h-48 object-cover" />
              
                {machine.is_available ?
              <Badge
                variant="success"
                size="sm"
                className="absolute top-3 right-3">
                
                    Available Now
                  </Badge> :

              <Badge
                variant="neutral"
                size="sm"
                className="absolute top-3 right-3">
                
                    Booked
                  </Badge>
              }
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {machine.name}
                    </h3>
                    <p className="text-sm text-gray-600">{machine.hp ? `${machine.hp} HP` : machine.brand}</p>
                  </div>
                  <Badge variant="success" size="sm">
                    ⭐ {machine.rating}
                  </Badge>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <span className="text-lg font-bold text-primary">
                    ₹{machine.price_per_day}
                    <span className="text-sm font-medium">/day</span>
                  </span>
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <MapPinIcon className="w-4 h-4" />
                    {machine.distance_km || 'Unknown'} km
                  </span>
                </div>
              </div>
            </Card>
          </Link>
        )}
      </div>

      <BottomNav role="seeker" />
    </div>);

}