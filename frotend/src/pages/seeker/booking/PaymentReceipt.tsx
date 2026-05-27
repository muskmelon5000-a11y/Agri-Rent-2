import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../../../components/shared/AppHeader';
import { Button } from '../../../components/shared/Button';
import { Card } from '../../../components/shared/Card';
import { DownloadIcon, CheckIcon } from 'lucide-react';
export function PaymentReceipt() {
  const navigate = useNavigate();
  const [isPaid, setIsPaid] = useState(false);
  return (
    <div className="h-full bg-background flex flex-col">
      <AppHeader title="Buy on Hand" showBack />

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* Status Banner */}
        {isPaid ?
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
              <CheckIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-green-800">Buy on Hand Confirmed</p>
              <p className="text-sm text-green-700">
                Waiting for owner confirmation
              </p>
            </div>
          </div> :

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <p className="font-bold text-amber-800 mb-1">Buy on Hand Pending</p>
            <p className="text-sm text-amber-700">
              Please settle the amount with the owner.
            </p>
          </div>
        }

        {/* Receipt Card */}
        <Card className="p-6 relative overflow-hidden">
          {/* Receipt jagged edge effect top/bottom could be added with CSS, keeping it simple here */}
          <div className="text-center mb-6 pb-6 border-b border-dashed border-gray-300">
            <h2 className="text-xl font-bold text-gray-900">Agri-Rent Hub</h2>
            <p className="text-sm text-gray-500">Booking ID: ARH-8492</p>
            <p className="text-sm text-gray-500">Date: Oct 17, 2023</p>
          </div>

          <div className="space-y-4 mb-6 pb-6 border-b border-dashed border-gray-300">
            <div className="flex justify-between">
              <span className="text-gray-600">Mahindra 575 DI (3 Days)</span>
              <span className="font-semibold text-gray-900">₹3,600</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Rotavator Attachment</span>
              <span className="font-semibold text-gray-900">₹900</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Charge</span>
              <span className="font-semibold text-gray-900">₹400</span>
            </div>
          </div>

          <div className="flex justify-between items-center mb-8">
            <span className="text-lg font-bold text-gray-900">
              Total Amount
            </span>
            <span className="text-2xl font-bold text-primary">₹4,900</span>
          </div>

          {/* Signature Area */}
          <div className="bg-gray-50 rounded-xl p-4 h-24 border border-gray-200 flex items-center justify-center">
            <span className="text-gray-400 italic">
              Owner Signature Placeholder
            </span>
          </div>
        </Card>

        {/* Cash Record Toggle */}
        {!isPaid &&
        <Card className="p-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-bold text-gray-900">Mark as Paid (Buy on Hand)</p>
                <p className="text-sm text-gray-600">
                  I have paid the owner in cash
                </p>
              </div>
              <div className="w-6 h-6 rounded border-2 border-gray-300 flex items-center justify-center">
                <input
                type="checkbox"
                className="opacity-0 absolute"
                onChange={(e) => setIsPaid(e.target.checked)} />
              
              </div>
            </label>
          </Card>
        }
      </div>

      {/* Actions */}
      <div className="p-6 bg-surface border-t border-gray-200 space-y-3">
        {isPaid ?
        <Button fullWidth size="lg" onClick={() => navigate('/seeker/home')}>
            Return to Home
          </Button> :

        <Button fullWidth size="lg" disabled>
            Confirm Buy on Hand
          </Button>
        }
        <Button variant="outline" fullWidth>
          <DownloadIcon className="w-5 h-5 mr-2" />
          Download Receipt
        </Button>
      </div>
    </div>);

}