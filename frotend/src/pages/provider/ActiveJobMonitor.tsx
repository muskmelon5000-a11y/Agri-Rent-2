import { useLocation, useNavigate } from 'react-router-dom';
import { AppHeader } from '../../components/shared/AppHeader';
import { BottomNav } from '../../components/shared/BottomNav';
import { Button } from '../../components/shared/Button';
import { Card } from '../../components/shared/Card';
import { SmartEstimateCard } from '../../components/shared/SmartEstimateCard';
import { Avatar } from '../../components/shared/Avatar';
import { PhoneIcon, MessageCircleIcon, ClockIcon, FuelIcon } from 'lucide-react';
import { bookingService, Booking } from '../../services/bookingService';
import { useState } from 'react';
import { LiveTrackingMap } from '../../components/shared/LiveTrackingMap';

export function ActiveJobMonitor() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isUpdating, setIsUpdating] = useState(false);
  const booking = location.state?.booking as Booking;

  const handleEndJob = async () => {
    if (!booking) return;
    setIsUpdating(true);
    try {
      await bookingService.updateStatus(booking.id, 'completed');
      navigate('/provider/completed', { state: { booking } });
    } catch (error) {
      console.error("Failed to end job:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (!booking) {
    return (
      <div className="h-full bg-background flex flex-col items-center justify-center p-6 text-center">
        <p className="text-gray-600 mb-4">No active job found.</p>
        <Button onClick={() => navigate('/provider/requests')}>View Requests</Button>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background pb-20">
      <AppHeader title="Active Job" showBack />

      {/* Live Map */}
      <div className="h-56 relative z-0">
        <LiveTrackingMap 
          initialLat={23.0225} 
          initialLng={72.5714} 
          equipmentName={booking.equipment_name || "Equipment"} 
        />
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Status Banner */}
        <div className="bg-primary text-white rounded-2xl p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-3">
            <span className="w-3 h-3 bg-white rounded-full animate-pulse" />
          </div>
          <h2 className="text-xl font-bold mb-1">Job in Progress</h2>
          <p className="text-primary-100">Started on {formatDate(booking.start_date)}</p>
        </div>

        {/* Seeker Quick Connect */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar name={booking.seeker_name || "Farmer"} size="md" />
              <div>
                <p className="font-bold text-gray-900">{booking.seeker_name || "Farmer"}</p>
                <p className="text-sm text-gray-600">Seeker</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2"
              onClick={() => {
                if (booking.seeker_phone) {
                  window.location.href = `tel:+91${booking.seeker_phone}`;
                } else {
                  alert("Seeker's phone number is not available.");
                }
              }}
            >
              <PhoneIcon className="w-4 h-4" /> Call
            </Button>
            <Button
              className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white border-none"
              onClick={() => {
                if (booking.seeker_phone) {
                  const url = `https://wa.me/91${booking.seeker_phone}?text=${encodeURIComponent(`Hi ${booking.seeker_name}, regarding your CropMate booking for ${booking.equipment_name}...`)}`;
                  window.open(url, '_blank');
                } else {
                  alert("Seeker's phone number is not available.");
                }
              }}
            >
              <MessageCircleIcon className="w-4 h-4" /> Chat
            </Button>
          </div>
        </Card>

        {/* Job Details */}
        <Card className="p-4">
          <h3 className="font-bold text-gray-900 mb-4">Equipment Details</h3>
          <div className="flex items-center gap-4 mb-4">
            <img
              src={booking.equipment_image || "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=200"}
              alt={booking.equipment_name}
              className="w-16 h-16 object-cover rounded-xl" />
            
            <div>
              <p className="font-bold text-gray-900">{booking.equipment_name}</p>
              <p className="text-sm text-gray-600">Booking: {booking.total_days} Days</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
            <ClockIcon className="w-4 h-4" />
            <span>Ends on {formatDate(booking.end_date)}</span>
          </div>
        </Card>

        {/* Fuel Tracker - Rule-Based Logic */}
        <SmartEstimateCard title="Fuel Usage Estimate" variant="amber">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-earth-terracotta">
              <FuelIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-700">Estimated Fuel Used</p>
              <p className="text-xl font-bold text-gray-900">~15 Liters</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Based on 6 hrs operation</span>
              <span className="font-medium text-gray-900">₹1,425 cost</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-earth-terracotta h-2 rounded-full"
                style={{
                  width: '40%'
                }} />
              
            </div>
          </div>
        </SmartEstimateCard>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-surface border-t border-gray-200">
        <Button
          fullWidth
          size="lg"
          disabled={isUpdating}
          onClick={handleEndJob}>
          
          {isUpdating ? "Processing..." : "End Job & Generate Bill"}
        </Button>
      </div>

      <BottomNav role="provider" />
    </div>);
}