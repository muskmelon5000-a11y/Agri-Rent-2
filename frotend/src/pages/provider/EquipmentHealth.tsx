import React from 'react';
import { AppHeader } from '../../components/shared/AppHeader';
import { Card } from '../../components/shared/Card';
import { SmartEstimateCard } from '../../components/shared/SmartEstimateCard';
import { Button } from '../../components/shared/Button';
import { ActivityIcon, AlertTriangleIcon, CheckCircle2Icon } from 'lucide-react';
export function EquipmentHealth() {
  return (
    <div className="h-full bg-background flex flex-col">
      <AppHeader title="Equipment Health" showBack />

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* Selector */}
        <select className="w-full h-12 px-4 border-2 border-gray-200 rounded-2xl font-bold text-gray-900 focus:border-primary focus:outline-none bg-white shadow-sm">
          <option>Mahindra 575 DI</option>
          <option>Rotavator</option>
        </select>

        {/* Health Score - Rule Based */}
        <SmartEstimateCard title="Overall Health Score" variant="lime">
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 36 36">
                
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="3" />
                
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#8BC34A"
                  strokeWidth="3"
                  strokeDasharray="85, 100" />
                
              </svg>
              <div className="absolute text-2xl font-bold text-gray-900">
                85
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-green-800 mb-1">
                Good Condition
              </p>
              <p className="text-xs text-gray-600">
                Based on hours used (1250h) and recent maintenance logs.
              </p>
            </div>
          </div>
        </SmartEstimateCard>

        {/* Alerts */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            Alerts & Recommendations
          </h2>
          <div className="space-y-3">
            <Card className="p-4 border-l-4 border-l-earth-amber">
              <div className="flex items-start gap-3">
                <AlertTriangleIcon className="w-5 h-5 text-earth-amber flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-gray-900">
                    Oil Change Due Soon
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Approaching 250 hours since last oil change. Recommended
                    within next 2 weeks.
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-l-4 border-l-green-500">
              <div className="flex items-start gap-3">
                <CheckCircle2Icon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-gray-900">
                    Tire Pressure Optimal
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Checked during last service.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <ActivityIcon className="w-5 h-5 text-primary mb-2" />
            <p className="text-sm text-gray-600">Total Hours</p>
            <p className="text-xl font-bold text-gray-900">1,250h</p>
          </Card>
          <Card className="p-4">
            <ActivityIcon className="w-5 h-5 text-earth-terracotta mb-2" />
            <p className="text-sm text-gray-600">Downtime</p>
            <p className="text-xl font-bold text-gray-900">2 Days</p>
            <p className="text-xs text-gray-500">This year</p>
          </Card>
        </div>
      </div>

      <div className="p-6 bg-surface border-t border-gray-200">
        <Button fullWidth size="lg" variant="outline">
          Schedule Service
        </Button>
      </div>
    </div>);

}