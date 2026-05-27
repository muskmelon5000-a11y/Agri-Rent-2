import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { equipmentService, Equipment } from '../../services/equipmentService';
import { AppHeader } from '../../components/shared/AppHeader';
import { BottomNav } from '../../components/shared/BottomNav';
import { Card } from '../../components/shared/Card';
import { Badge } from '../../components/shared/Badge';
import { PlusIcon, MoreVerticalIcon } from 'lucide-react';
export function MyEquipmentList() {
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadEquipment() {
      try {
        const data = await equipmentService.getMyEquipment();
        setEquipment(data);
      } catch (error) {
        console.error("Failed to load equipment:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadEquipment();
  }, []);

  const toggleAvailability = async (id: number) => {
    // Optimistic UI update
    setEquipment(equipment.map(item => 
      item.id === id ? { ...item, is_available: !item.is_available } : item
    ));
    try {
      await equipmentService.toggleAvailability(id);
    } catch (error) {
      console.error("Failed to toggle availability:", error);
      // Revert on error
      setEquipment(equipment.map(item => 
        item.id === id ? { ...item, is_available: !item.is_available } : item
      ));
    }
  };
  return (
    <div className="min-h-full bg-background pb-20 relative">
      <AppHeader title="My Equipment" />

      <div className="px-6 py-6 space-y-4">
        {isLoading ? (
          <div className="py-8 text-center text-gray-500">Loading your equipment...</div>
        ) : equipment.length === 0 ? (
          <div className="py-8 text-center text-gray-500">You haven't added any equipment yet.</div>
        ) : equipment.map((item) =>
        <Card key={item.id} className="overflow-hidden">
            <div className="flex gap-4 p-4">
              <img
              src={item.images?.[0] || 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400'}
              alt={item.name}
              className="w-24 h-24 object-cover rounded-xl" />
            
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-semibold text-gray-900 truncate pr-2">
                    {item.name}
                  </h3>
                  <button
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/provider/edit-machine/${item.id}`);
                  }}
                  className="text-gray-400 hover:text-gray-600">
                  
                    <MoreVerticalIcon className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm text-gray-500 mb-2">{item.type}</p>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">This Month</p>
                    <p className="font-bold text-primary">₹{item.price_per_day * item.total_rentals || 0}</p>
                  </div>

                  {/* Availability Toggle */}
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-semibold text-gray-600 mb-1">
                      {item.is_available ? 'Available' : 'Unavailable'}
                    </span>
                    <div
                    onClick={() => toggleAvailability(item.id)}
                    className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${item.is_available ? 'bg-primary' : 'bg-gray-300'}`}>
                    
                      <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${item.is_available ? 'right-1' : 'left-1'}`} />
                    
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {!item.is_available &&
          <div className="bg-amber-50 px-4 py-2 border-t border-amber-100 flex justify-between items-center">
                <span className="text-xs font-medium text-amber-800">
                  Currently Rented Out
                </span>
                <Link
              to="/provider/active-job"
              className="text-xs font-bold text-amber-800 underline">
              
                  View Job
                </Link>
              </div>
          }
          </Card>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => navigate('/provider/add-machine/1')}
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:shadow-xl hover:bg-primary-700 active:scale-95 transition-all flex items-center justify-center z-40">
        
        <PlusIcon className="w-6 h-6" />
      </button>

      <BottomNav role="provider" />
    </div>);

}