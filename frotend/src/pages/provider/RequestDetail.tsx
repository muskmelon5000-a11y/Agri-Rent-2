import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppHeader } from '../../components/shared/AppHeader';
import { Button } from '../../components/shared/Button';
import { Card } from '../../components/shared/Card';
import { Avatar } from '../../components/shared/Avatar';
import { CalendarIcon, MapPinIcon, Loader2Icon } from 'lucide-react';
import { bookingService, Booking } from '../../services/bookingService';

export function RequestDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    async function loadBooking() {
      if (!id) return;
      try {
        const data = await bookingService.getById(parseInt(id));
        setBooking(data);
      } catch (error) {
        console.error("Failed to load booking:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadBooking();
  }, [id]);

  const handleStatusUpdate = async (newStatus: string) => {
    if (!booking) return;
    setIsUpdating(true);
    try {
      await bookingService.updateStatus(booking.id, newStatus);
      if (newStatus === 'accepted') {
        navigate('/provider/active-job', { state: { booking } });
      } else {
        navigate('/provider/requests');
      }
    } catch (error) {
      console.error(`Failed to update status to ${newStatus}:`, error);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="h-full bg-background flex flex-col items-center justify-center">
        <Loader2Icon className="w-8 h-8 text-primary animate-spin mb-2" />
        <p className="text-gray-500">Loading details...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="h-full bg-background flex flex-col">
        <AppHeader title="Error" showBack />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <p className="text-gray-600 mb-4">Request not found.</p>
          <Button onClick={() => navigate('/provider/requests')}>Back to Requests</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-background flex flex-col">
      <AppHeader title="Request Details" showBack />

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* Seeker Info */}
        <Card className="p-4 flex items-center gap-4">
          <Avatar name={booking.seeker_name || "Farmer"} size="lg" verified />
          <div>
            <h2 className="text-lg font-bold text-gray-900">{booking.seeker_name || "Farmer"}</h2>
            <p className="text-sm text-gray-600">Verified Farmer • 4.8 ⭐</p>
          </div>
        </Card>

        {/* Request Summary */}
        <Card className="p-5">
          <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">
            Booking Details
          </h3>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-xl">🚜</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{booking.equipment_name}</p>
                <p className="text-sm text-gray-600">Standard Rental</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <CalendarIcon className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {formatDate(booking.start_date)} - {formatDate(booking.end_date)}
                </p>
                <p className="text-sm text-gray-600">{booking.total_days} Days</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPinIcon className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {booking.delivery_type === 'delivery' ? 'Delivery Requested' : 'Self Pickup'}
                </p>
                <p className="text-sm text-gray-600">
                  {booking.delivery_address || booking.equipment_village || "Nearby Hub"}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Earnings */}
        <Card className="p-5 bg-primary-50 border-primary-200">
          <h3 className="font-bold text-gray-900 mb-3">Estimated Earnings</h3>
          <div className="space-y-2 mb-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Rental ({booking.total_days} days)</span>
              <span className="font-medium">₹{(booking.total_amount || 0).toLocaleString()}</span>
            </div>
            {booking.delivery_type === 'delivery' && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-medium text-green-600">Included</span>
              </div>
            )}
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-primary-200">
            <span className="font-bold text-gray-900">Total</span>
            <span className="text-xl font-bold text-primary">₹{(booking.total_amount || 0).toLocaleString()}</span>
          </div>
        </Card>

        {/* Notes */}
        {booking.notes && (
          <div>
            <h3 className="font-bold text-gray-900 mb-2">Notes from Seeker</h3>
            <div className="bg-surface p-4 rounded-xl border border-gray-200 text-sm text-gray-700 italic">
              "{booking.notes}"
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-surface border-t border-gray-200 space-y-3">
        <Button
          fullWidth
          size="lg"
          disabled={isUpdating || booking.status !== 'pending'}
          onClick={() => handleStatusUpdate('accepted')}>
          
          {isUpdating ? "Processing..." : booking.status === 'accepted' ? 'Accepted' : 'Accept Request'}
        </Button>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1"
            disabled={isUpdating || booking.status !== 'pending'}
            onClick={() => handleStatusUpdate('rejected')}>
            Decline
          </Button>
          <Button variant="outline" className="flex-1" disabled={isUpdating || booking.status !== 'pending'}>
            Counter Offer
          </Button>
        </div>
      </div>
    </div>);
}


