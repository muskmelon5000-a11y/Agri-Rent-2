import { useNavigate, useLocation } from 'react-router-dom';
import { AppHeader } from '../../../components/shared/AppHeader';
import { Button } from '../../../components/shared/Button';
import { Card } from '../../../components/shared/Card';
import {
  CheckCircle2Icon,
  CopyIcon,
  CalendarIcon,
  MapPinIcon } from
'lucide-react';

export function BookingConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state?.booking;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="h-full bg-background flex flex-col">
      <AppHeader title="Confirmation" />

      <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col items-center text-center">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2Icon className="w-12 h-12 text-green-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Booking Requested!
        </h1>
        <p className="text-gray-600 mb-8 max-w-xs">
          Your request has been sent to {booking?.owner_name || "the owner"}. You will be notified once they accept.
        </p>

        {/* Booking ID */}
        <div className="bg-surface border border-gray-200 rounded-2xl px-6 py-3 flex items-center gap-3 mb-8">
          <span className="text-sm text-gray-500">Booking ID:</span>
          <span className="font-bold text-gray-900 tracking-wider">
            ARH-{booking?.id || '0000'}
          </span>
          <button className="text-primary hover:bg-primary-50 p-1 rounded">
            <CopyIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Summary Card */}
        <Card className="w-full text-left p-5 mb-8">
          <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">
            Request Summary
          </h3>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-xl">🚜</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{booking?.equipment_name || "Machine"}</p>
                <p className="text-sm text-gray-600">{booking?.delivery_type === 'delivery' ? 'Delivery Requested' : 'Self Pickup'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <CalendarIcon className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {formatDate(booking?.start_date)} - {formatDate(booking?.end_date)}
                </p>
                <p className="text-sm text-gray-600">{booking?.total_days} Days</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPinIcon className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{booking?.delivery_type === 'delivery' ? 'Deliver to Farm' : 'Pickup from Owner'}</p>
                <p className="text-sm text-gray-600">{booking?.delivery_address || "Standard location"}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
            <span className="font-semibold text-gray-600">Estimated Total</span>
            <span className="text-xl font-bold text-primary">₹{booking?.total_amount?.toLocaleString()}</span>
          </div>
        </Card>
      </div>

      {/* Bottom Actions */}
      <div className="p-6 bg-surface border-t border-gray-200 space-y-3">
        <Button
          fullWidth
          size="lg"
          onClick={() => navigate('/seeker/active-rental')}>
          
          Track Booking Status
        </Button>
        <Button
          variant="outline"
          fullWidth
          onClick={() => navigate('/seeker/home')}>
          
          Back to Home
        </Button>
      </div>
    </div>);
}