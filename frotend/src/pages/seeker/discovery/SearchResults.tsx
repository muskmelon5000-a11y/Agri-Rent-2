import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { equipmentService, Equipment } from '../../../services/equipmentService';
import { AppHeader } from '../../../components/shared/AppHeader';
import { BottomNav } from '../../../components/shared/BottomNav';
import { Card } from '../../../components/shared/Card';
import { Badge } from '../../../components/shared/Badge';
import { Button } from '../../../components/shared/Button';
import { MapPinIcon, MapIcon, SlidersHorizontalIcon } from 'lucide-react';
export function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function doSearch() {
      if (!initialQuery) return;
      setIsLoading(true);
      try {
        const data = await equipmentService.search(initialQuery);
        setResults(data);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsLoading(false);
      }
    }
    doSearch();
  }, [initialQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: query });
  };

  return (
    <div className="min-h-full bg-background pb-20">
      <AppHeader
        title="Search"
        showBack
        action={
        <Link to="/seeker/search-map">
            <button className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
              <MapIcon className="w-5 h-5 text-primary" />
            </button>
          </Link>
        } />
      
      {/* Search Input */}
      <div className="px-4 py-3 bg-surface border-b border-gray-200">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tractors, tools..."
            className="flex-1 h-10 px-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
          />
          <Button type="submit" size="sm">Search</Button>
        </form>
      </div>

      {/* Sort & Filter Bar */}
      <div className="bg-surface border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <Link to="/seeker/filters" className="flex-1">
          <Button variant="outline" size="sm" fullWidth>
            <SlidersHorizontalIcon className="w-4 h-4" />
            Filters
          </Button>
        </Link>
        <select className="flex-1 h-10 px-3 border-2 border-gray-200 rounded-xl text-sm font-semibold focus:border-primary focus:outline-none">
          <option>Sort: Distance</option>
          <option>Sort: Price Low-High</option>
          <option>Sort: Price High-Low</option>
          <option>Sort: Rating</option>
        </select>
      </div>

      {/* Results Count */}
      {initialQuery && (
        <div className="px-4 py-3">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">
              {results.length} results
            </span>{' '}
            for "{initialQuery}"
          </p>
        </div>
      )}

      {/* Results List */}
      <div className="px-4 pb-4 space-y-3">
        {isLoading ? (
          <div className="py-8 text-center text-gray-500">Searching...</div>
        ) : results.length === 0 && initialQuery ? (
          <div className="py-8 text-center text-gray-500">No results found for "{initialQuery}".</div>
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