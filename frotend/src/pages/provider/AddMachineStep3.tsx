import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppHeader } from '../../components/shared/AppHeader';
import { Button } from '../../components/shared/Button';
import { Input } from '../../components/shared/Input';
import { Card } from '../../components/shared/Card';
export function AddMachineStep3() {
  const navigate = useNavigate();
  const location = useLocation();
  const equipmentData = location.state?.equipmentData || {};

  const [pricePerDay, setPricePerDay] = useState('');
  const [pricePerHour, setPricePerHour] = useState('');

  const handleNext = () => {
    const updatedData = {
      ...equipmentData,
      price_per_day: Number(pricePerDay) || 0,
      price_per_hour: Number(pricePerHour) || 0,
    };
    navigate('/provider/add-machine/4', { state: { equipmentData: updatedData } });
  };

  return (
    <div className="h-full bg-background flex flex-col">
      <AppHeader title="Add Equipment" showBack />

      {/* Stepper */}
      <div className="bg-surface px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-primary">Step 3 of 4</span>
          <span className="text-sm font-medium text-gray-500">
            Pricing & Rates
          </span>
        </div>
        <div className="flex gap-2">
          <div className="h-2 flex-1 bg-primary rounded-full" />
          <div className="h-2 flex-1 bg-primary rounded-full" />
          <div className="h-2 flex-1 bg-primary rounded-full" />
          <div className="h-2 flex-1 bg-gray-200 rounded-full" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Rental Rates</h2>
          <div className="space-y-4">
            <Input
              label="Daily Rate (₹)"
              type="number"
              placeholder="e.g. 1200"
              value={pricePerDay}
              onChange={(e) => setPricePerDay(e.target.value)}
              icon={<span className="text-gray-500 font-bold">₹</span>} />
            
            <Input
              label="Hourly Rate (₹) - Optional"
              type="number"
              placeholder="e.g. 150"
              value={pricePerHour}
              onChange={(e) => setPricePerHour(e.target.value)}
              icon={<span className="text-gray-500 font-bold">₹</span>} />
            
            <Input
              label="Per Acre Rate (₹) - Optional"
              type="number"
              placeholder="e.g. 800"
              icon={<span className="text-gray-500 font-bold">₹</span>} />
            
          </div>
        </div>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="font-bold text-gray-900">Weekly Discount</p>
              <p className="text-sm text-gray-600">Offer 10% off for 7+ days</p>
            </div>
            <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
            </div>
          </div>
        </Card>

        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Terms</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Minimum Booking Duration
              </label>
              <select className="w-full h-12 px-4 border-2 border-gray-200 rounded-2xl font-semibold focus:border-primary focus:outline-none bg-white">
                <option>1 Day</option>
                <option>2 Days</option>
                <option>3 Days</option>
              </select>
            </div>
            <Input
              label="Security Deposit (₹) - Optional"
              type="number"
              placeholder="e.g. 500"
              icon={<span className="text-gray-500 font-bold">₹</span>} />
            
          </div>
        </div>
      </div>

      <div className="p-6 bg-surface border-t border-gray-200">
        <Button
          fullWidth
          size="lg"
          disabled={!pricePerDay}
          onClick={handleNext}>
          
          Next Step
        </Button>
      </div>
    </div>);

}