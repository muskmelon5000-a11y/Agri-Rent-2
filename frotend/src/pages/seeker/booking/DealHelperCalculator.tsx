import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../../../components/shared/AppHeader';
import { Button } from '../../../components/shared/Button';
import { Input } from '../../../components/shared/Input';
import { SmartEstimateCard } from '../../../components/shared/SmartEstimateCard';
import { CalculatorIcon } from 'lucide-react';
export function DealHelperCalculator() {
  const navigate = useNavigate();
  return (
    <div className="h-full bg-background flex flex-col">
      <AppHeader title="Deal-Helper" showBack />

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        <div className="text-center mb-2">
          <div className="w-16 h-16 bg-secondary-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CalculatorIcon className="w-8 h-8 text-secondary-700" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Smart Cost Estimator
          </h1>
          <p className="text-gray-600">
            Calculate your total estimated cost including fuel, transport, and
            time.
          </p>
        </div>

        <SmartEstimateCard title="Field Details" variant="lime">
          <div className="space-y-4">
            <Input label="Total Area (Acres)" type="number" defaultValue="5" />

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Crop Type
              </label>
              <select className="w-full h-12 px-4 border-2 border-gray-200 rounded-2xl font-semibold focus:border-primary focus:outline-none bg-white">
                <option>Wheat</option>
                <option>Rice/Paddy</option>
                <option>Sugarcane</option>
                <option>Cotton</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Soil Condition
              </label>
              <select className="w-full h-12 px-4 border-2 border-gray-200 rounded-2xl font-semibold focus:border-primary focus:outline-none bg-white">
                <option>Normal / Dry</option>
                <option>Hard / Dry</option>
                <option>Wet / Muddy</option>
              </select>
            </div>
          </div>
        </SmartEstimateCard>

        <SmartEstimateCard title="Logistics" variant="amber">
          <div className="space-y-4">
            <Input
              label="Distance to Field (km)"
              type="number"
              defaultValue="2.3" />
            
            <Input
              label="Current Diesel Price (₹/L)"
              type="number"
              defaultValue="95" />
            
          </div>
        </SmartEstimateCard>
      </div>

      <div className="p-6 bg-surface border-t border-gray-200">
        <Button
          fullWidth
          size="lg"
          onClick={() => navigate('/seeker/calculator-results')}>
          
          Calculate Total Cost
        </Button>
      </div>
    </div>);

}