import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../../../components/shared/AppHeader';
import { Button } from '../../../components/shared/Button';
import { Card } from '../../../components/shared/Card';
import { CalendarIcon, ArrowRightIcon } from 'lucide-react';
export function ExtensionRequest() {
  const navigate = useNavigate();
  const [days, setDays] = useState(1);
  const dailyRate = 1200;
  const additionalCost = days * dailyRate;
  return (
    <div className="h-full bg-background flex flex-col">
      <AppHeader title="Extend Rental" showBack />

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* Current vs New Dates */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase mb-1">
                Current End Date
              </p>
              <p className="font-bold text-gray-900">Oct 17, 2023</p>
            </div>
            <ArrowRightIcon className="w-5 h-5 text-gray-400" />
            <div className="text-right">
              <p className="text-xs text-primary font-semibold uppercase mb-1">
                New End Date
              </p>
              <p className="font-bold text-primary">Oct {17 + days}, 2023</p>
            </div>
          </div>
        </Card>

        {/* Days Selector */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Add Days</h2>
          <div className="flex items-center justify-center gap-6 bg-surface p-4 rounded-2xl border border-gray-200">
            <button
              onClick={() => setDays(Math.max(1, days - 1))}
              className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-700 hover:bg-gray-200">
              
              -
            </button>
            <div className="text-center w-20">
              <span className="text-4xl font-bold text-gray-900">{days}</span>
              <p className="text-sm text-gray-600">Days</p>
            </div>
            <button
              onClick={() => setDays(days + 1)}
              className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-xl font-bold text-primary hover:bg-primary-100">
              
              +
            </button>
          </div>
        </div>

        {/* Additional Cost */}
        <Card className="p-4 bg-primary-50 border-primary-200">
          <div className="flex justify-between items-center mb-1">
            <span className="text-gray-700">Additional Cost</span>
            <span className="text-xl font-bold text-primary">
              ₹{additionalCost}
            </span>
          </div>
          <p className="text-sm text-gray-600 text-right">
            ({days} days @ ₹{dailyRate}/day)
          </p>
        </Card>

        {/* Reason */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Reason for Extension
          </label>
          <textarea
            className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-primary focus:outline-none resize-none h-24"
            placeholder="e.g. Work is taking longer than expected due to hard soil..." />
          
        </div>
      </div>

      <div className="p-6 bg-surface border-t border-gray-200">
        <Button
          fullWidth
          size="lg"
          onClick={() => navigate('/seeker/active-rental')}>
          
          Send Extension Request
        </Button>
      </div>
    </div>);

}