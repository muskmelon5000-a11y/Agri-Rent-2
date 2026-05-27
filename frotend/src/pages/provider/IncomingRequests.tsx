import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppHeader } from '../../components/shared/AppHeader';
import { BottomNav } from '../../components/shared/BottomNav';
import { Card } from '../../components/shared/Card';
import { Badge } from '../../components/shared/Badge';
import { Avatar } from '../../components/shared/Avatar';
import { CalendarIcon, MapPinIcon, InboxIcon } from 'lucide-react';
import { bookingService, Booking } from '../../services/bookingService';

export function IncomingRequests() {
  const [requests, setRequests] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'accepted' | 'rejected'>('pending');

  useEffect(() => {
    async function loadRequests() {
      try {
        const data = await bookingService.getProviderRequests();
        setRequests(data);
      } catch (error) {
        console.error("Failed to load requests:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadRequests();
  }, []);

  const filteredRequests = requests.filter(req => {
    if (activeTab === 'pending') return req.status === 'pending';
    if (activeTab === 'accepted') return ['accepted', 'active', 'completed'].includes(req.status);
    if (activeTab === 'rejected') return req.status === 'rejected' || req.status === 'cancelled';
    return true;
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-full bg-background pb-20">
      <AppHeader title="Booking Requests" />

      <div className="px-6 py-6 space-y-4">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button 
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${activeTab === 'pending' ? 'bg-primary text-white' : 'bg-surface text-gray-600 border border-gray-200'}`}>
            New ({requests.filter(r => r.status === 'pending').length})
          </button>
          <button 
            onClick={() => setActiveTab('accepted')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${activeTab === 'accepted' ? 'bg-primary text-white' : 'bg-surface text-gray-600 border border-gray-200'}`}>
            Accepted
          </button>
          <button 
            onClick={() => setActiveTab('rejected')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${activeTab === 'rejected' ? 'bg-primary text-white' : 'bg-surface text-gray-600 border border-gray-200'}`}>
            Other
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <p>Loading requests...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <InboxIcon className="w-8 h-8 text-gray-400" />
            </div>
            <p className="font-semibold text-gray-900">No {activeTab} requests</p>
            <p className="text-sm">Requests will appear here when farmers book your machines.</p>
          </div>
        ) : (
          filteredRequests.map((req) => (
            <Link key={req.id} to={`/provider/request/${req.id}`}>
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={req.seeker_name || "Seeker"} size="md" />
                    <div>
                      <h3 className="font-bold text-gray-900">{req.seeker_name || "Farmer"}</h3>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPinIcon className="w-3 h-3" />
                        {req.equipment_village || "Nearby"}
                      </div>
                    </div>
                  </div>
                  <Badge variant={req.status === 'pending' ? 'success' : 'neutral'}>
                    {req.status === 'pending' ? 'New Request' : req.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="bg-gray-50 rounded-xl p-3 mb-4">
                  <p className="font-semibold text-gray-900 mb-1">
                    {req.equipment_name}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CalendarIcon className="w-4 h-4" />
                    {formatDate(req.start_date)} - {formatDate(req.end_date)} ({req.total_days} Days)
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                  <span className="text-sm text-gray-600">
                    Estimated Earnings
                  </span>
                  <span className="text-lg font-bold text-primary">
                    ₹{req.total_amount?.toLocaleString()}
                  </span>
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>

      <BottomNav role="provider" />
    </div>
  );
}