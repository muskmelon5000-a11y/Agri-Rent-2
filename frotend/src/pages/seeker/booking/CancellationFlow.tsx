import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../../../components/shared/AppHeader';
import { Button } from '../../../components/shared/Button';
import { Card } from '../../../components/shared/Card';
import { AlertCircleIcon } from 'lucide-react';
const reasons = [
'Found a better alternative',
'Work is delayed/postponed',
'Equipment no longer needed',
'Owner requested cancellation',
'Other'];

export function CancellationFlow() {
  const navigate = useNavigate();
  const [selectedReason, setSelectedReason] = useState('');
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="h-full bg-background flex flex-col relative">
      <AppHeader title="Cancel Booking" showBack />

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* Warning Card */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircleIcon className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-red-900 mb-1">Cancellation Policy</h3>
            <p className="text-sm text-red-700 leading-relaxed">
              Cancellations made within 24 hours of the start time may incur a
              fee of ₹500. Frequent cancellations may affect your profile
              rating.
            </p>
          </div>
        </div>

        {/* Reasons List */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            Why are you cancelling?
          </h2>
          <div className="space-y-3">
            {reasons.map((reason) =>
            <label
              key={reason}
              className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedReason === reason ? 'border-primary bg-primary-50' : 'border-gray-200 bg-surface'}`}>
              
                <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedReason === reason ? 'border-primary' : 'border-gray-300'}`}>
                
                  {selectedReason === reason &&
                <div className="w-2.5 h-2.5 bg-primary rounded-full" />
                }
                </div>
                <span className="font-medium text-gray-900">{reason}</span>
              </label>
            )}
          </div>
        </div>

        {selectedReason === 'Other' &&
        <textarea
          className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-primary focus:outline-none resize-none h-24"
          placeholder="Please specify..." />

        }
      </div>

      <div className="p-6 bg-surface border-t border-gray-200">
        <Button
          variant="outline"
          className="text-red-600 border-red-200 hover:bg-red-50 active:bg-red-100"
          fullWidth
          size="lg"
          disabled={!selectedReason}
          onClick={() => setShowModal(true)}>
          
          Cancel Booking
        </Button>
      </div>

      {/* Confirmation Modal */}
      {showModal &&
      <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
          <Card className="w-full p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircleIcon className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Are you sure?
            </h2>
            <p className="text-gray-600 mb-6">
              This action cannot be undone. The owner will be notified
              immediately.
            </p>
            <div className="space-y-3">
              <Button
              fullWidth
              className="bg-red-600 hover:bg-red-700 text-white border-none"
              onClick={() => navigate('/seeker/home')}>
              
                Yes, Cancel Booking
              </Button>
              <Button
              variant="ghost"
              fullWidth
              onClick={() => setShowModal(false)}>
              
                No, Keep Booking
              </Button>
            </div>
          </Card>
        </div>
      }
    </div>);

}