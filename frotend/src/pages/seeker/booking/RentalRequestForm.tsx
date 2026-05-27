import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppHeader } from '../../../components/shared/AppHeader';
import { Button } from '../../../components/shared/Button';
import { Input } from '../../../components/shared/Input';
import { Card } from '../../../components/shared/Card';
import { MapPinIcon, TruckIcon, UserIcon } from 'lucide-react';
import { bookingService } from '../../../services/bookingService';

export function RentalRequestForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [delivery, setDelivery] = useState<'pickup' | 'delivery'>('delivery');
  const [area, setArea] = useState('5');
  const [hours, setHours] = useState('6');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // In a real app, equipment details would come from route state or URL params
  const machine = location.state?.machine;
  const equipmentId = machine?.id || location.state?.equipmentId || 1;
  const price = machine?.price_per_day || location.state?.price || 1200;
  const machineName = machine?.name || location.state?.name || "Mahindra 575 DI";
  const startDate = location.state?.startDate || "2023-10-15";
  const endDate = location.state?.endDate || "2023-10-17";
  const totalDays = location.state?.totalDays || 3;

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const booking = await bookingService.create({
        equipment_id: equipmentId,
        start_date: startDate,
        end_date: endDate,
        total_days: totalDays,
        delivery_type: delivery,
        estimated_area: parseFloat(area) || 0,
        estimated_hours: parseFloat(hours) || 0,
        notes: notes
      });
      // Navigate to confirmation with booking details
      navigate('/seeker/confirmation', { state: { booking } });
    } catch (error) {
      console.error("Failed to create booking", error);
      alert("Failed to submit request.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateRange = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return `${s.toLocaleDateString('en-US', options)} - ${e.toLocaleDateString('en-US', options)}`;
  };

  return (
    <div className="h-full bg-background flex flex-col">
      <AppHeader title="Rental Request" showBack />

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* Summary */}
        <Card className="p-4 bg-primary-50 border-primary-200">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-gray-900">{formatDateRange(startDate, endDate)}</span>
            <span className="text-primary font-bold">{totalDays} Days</span>
          </div>
          <p className="text-sm text-gray-700">{machineName} • ₹{price}/day</p>
        </Card>

        {/* Work Details */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Work Details</h2>
          <div className="space-y-4">
            <Input
              label="Estimated Area (Acres)"
              type="number"
              placeholder="e.g. 5"
              value={area}
              onChange={(e) => setArea(e.target.value)} />
            
            <Input
              label="Estimated Hours/Day"
              type="number"
              placeholder="e.g. 6"
              value={hours}
              onChange={(e) => setHours(e.target.value)} />
          </div>
        </div>

        {/* Attachments Needed */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            Attachments Needed
          </h2>
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 bg-surface border border-gray-200 rounded-xl">
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 text-primary rounded focus:ring-primary" />
              
              <span className="font-medium text-gray-900">
                Plough (Included)
              </span>
            </label>
            <label className="flex items-center gap-3 p-3 bg-surface border border-gray-200 rounded-xl">
              <input
                type="checkbox"
                className="w-5 h-5 text-primary rounded focus:ring-primary" />
              
              <div className="flex-1">
                <span className="font-medium text-gray-900 block">
                  Rotavator
                </span>
                <span className="text-sm text-gray-500">+₹300/day</span>
              </div>
            </label>
          </div>
        </div>

        {/* Delivery Option */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            Delivery Option
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setDelivery('pickup')}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${delivery === 'pickup' ? 'border-primary bg-primary-50' : 'border-gray-200 bg-surface'}`}>
              
              <UserIcon
                className={`w-6 h-6 mb-2 ${delivery === 'pickup' ? 'text-primary' : 'text-gray-400'}`} />
              
              <h3 className="font-bold text-gray-900">Self Pickup</h3>
              <p className="text-xs text-gray-600 mt-1">Free</p>
            </button>
            <button
              onClick={() => setDelivery('delivery')}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${delivery === 'delivery' ? 'border-primary bg-primary-50' : 'border-gray-200 bg-surface'}`}>
              
              <TruckIcon
                className={`w-6 h-6 mb-2 ${delivery === 'delivery' ? 'text-primary' : 'text-gray-400'}`} />
              
              <h3 className="font-bold text-gray-900">Delivery</h3>
              <p className="text-xs text-gray-600 mt-1">₹50/km</p>
            </button>
          </div>

          {delivery === 'delivery' &&
          <div className="mt-3 p-3 bg-surface border border-gray-200 rounded-xl flex items-start gap-3">
              <MapPinIcon className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Deliver to:</p>
                <p className="text-sm text-gray-600">
                  Farm Plot 42, Anandpur Village Road
                </p>
                <button className="text-primary text-sm font-semibold mt-1">
                  Change Address
                </button>
              </div>
            </div>
          }
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Notes for Owner (Optional)
          </label>
          <textarea
            className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-primary focus:outline-none resize-none h-24"
            placeholder="Any specific instructions or requirements..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)} />
          
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="p-4 bg-surface border-t border-gray-200 space-y-3">
        <Button
          variant="secondary"
          fullWidth
          onClick={() => navigate('/seeker/calculator')}>
          
          Use Deal-Helper Calculator
        </Button>
        <Button
          fullWidth
          size="lg"
          disabled={isLoading}
          onClick={handleSubmit}>
          
          {isLoading ? "Submitting..." : "Review & Send Request"}
        </Button>
      </div>
    </div>);
}