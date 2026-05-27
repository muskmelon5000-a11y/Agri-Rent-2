import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../../../components/shared/AppHeader';
import { Button } from '../../../components/shared/Button';
import { Card } from '../../../components/shared/Card';
import { Badge } from '../../../components/shared/Badge';
import {
  FuelIcon,
  ClockIcon,
  TruckIcon,
  IndianRupeeIcon,
  TrendingDownIcon } from
'lucide-react';
export function DealHelperResults() {
  const navigate = useNavigate();
  return (
    <div className="h-full bg-background flex flex-col">
      <AppHeader title="Estimated Costs" showBack />

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* Total Cost Highlight */}
        <div className="bg-primary rounded-3xl p-6 text-center text-white shadow-lg">
          <p className="text-primary-100 font-medium mb-1">
            Total Estimated Cost
          </p>
          <h1 className="text-5xl font-bold mb-4">₹5,140</h1>

          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
            <TrendingDownIcon className="w-4 h-4" />
            <span className="text-sm font-semibold">
              12% cheaper than neighbor avg
            </span>
          </div>
        </div>

        {/* Visual Breakdown Bar */}
        <div>
          <div className="flex h-4 rounded-full overflow-hidden mb-2">
            <div
              className="bg-primary"
              style={{
                width: '70%'
              }} />
            
            <div
              className="bg-earth-terracotta"
              style={{
                width: '22%'
              }} />
            
            <div
              className="bg-earth-amber"
              style={{
                width: '8%'
              }} />
            
          </div>
          <div className="flex justify-between text-xs font-semibold text-gray-500 px-1">
            <span>Rental (70%)</span>
            <span>Fuel (22%)</span>
            <span>Transport (8%)</span>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <h2 className="text-lg font-bold text-gray-900 mt-6 mb-3">
          Cost Breakdown
        </h2>
        <div className="space-y-3">
          <Card className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary">
              <IndianRupeeIcon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Rental Cost</h3>
              <p className="text-sm text-gray-600">3 days @ ₹1,200/day</p>
            </div>
            <span className="text-lg font-bold text-gray-900">₹3,600</span>
          </Card>

          <Card className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-earth-terracotta">
              <FuelIcon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Estimated Fuel</h3>
              <p className="text-sm text-gray-600">12L @ ₹95/L</p>
            </div>
            <span className="text-lg font-bold text-gray-900">₹1,140</span>
          </Card>

          <Card className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-earth-amber">
              <TruckIcon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Transport Cost</h3>
              <p className="text-sm text-gray-600">Delivery & Pickup (4.6km)</p>
            </div>
            <span className="text-lg font-bold text-gray-900">₹400</span>
          </Card>
        </div>

        {/* Time Estimate */}
        <Card className="p-4 bg-secondary-50 border-secondary-200">
          <div className="flex items-start gap-3">
            <ClockIcon className="w-6 h-6 text-secondary-700 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Estimated Time Required
              </h3>
              <p className="text-sm text-gray-700">
                Based on 5 acres of normal soil, expect approximately{' '}
                <span className="font-bold">14-16 hours</span> of machine
                operation time.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="p-6 bg-surface border-t border-gray-200">
        <Button
          fullWidth
          size="lg"
          onClick={() => navigate('/seeker/confirmation')}>
          
          Proceed to Book
        </Button>
      </div>
    </div>);

}