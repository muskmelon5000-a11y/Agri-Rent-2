import React from 'react';
import { AppHeader } from '../../components/shared/AppHeader';
import { Button } from '../../components/shared/Button';
import { Input } from '../../components/shared/Input';
import { Card } from '../../components/shared/Card';
import { WrenchIcon, CalendarIcon } from 'lucide-react';
export function MaintenanceLogger() {
  return (
    <div className="h-full bg-background flex flex-col">
      <AppHeader title="Log Maintenance" showBack />

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Select Equipment
          </label>
          <select className="w-full h-12 px-4 border-2 border-gray-200 rounded-2xl font-semibold focus:border-primary focus:outline-none bg-white">
            <option>Mahindra 575 DI</option>
            <option>Rotavator</option>
          </select>
        </div>

        <Card className="p-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Service Details
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Service Type
              </label>
              <select className="w-full h-12 px-4 border-2 border-gray-200 rounded-2xl font-semibold focus:border-primary focus:outline-none bg-white">
                <option>Oil Change</option>
                <option>Filter Replacement</option>
                <option>Tire Repair</option>
                <option>General Servicing</option>
                <option>Major Repair</option>
              </select>
            </div>

            <Input
              label="Cost (₹)"
              type="number"
              placeholder="e.g. 2500"
              icon={<span className="text-gray-500 font-bold">₹</span>} />
            

            <Input
              label="Current Meter Reading (Hours)"
              type="number"
              placeholder="e.g. 1250" />
            

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Notes
              </label>
              <textarea
                className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-primary focus:outline-none resize-none h-24"
                placeholder="Details about the service performed..." />
              
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-primary-50 border-primary-200">
          <div className="flex items-center gap-3 mb-3">
            <CalendarIcon className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-gray-900">Next Service Due</h3>
          </div>
          <input
            type="date"
            className="w-full h-12 px-4 border-2 border-primary-200 rounded-xl font-semibold text-gray-900 focus:border-primary focus:outline-none bg-white" />
          
        </Card>

        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Recent Logs</h2>
          <div className="space-y-3">
            <div className="p-3 bg-surface border border-gray-200 rounded-xl flex items-start gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <WrenchIcon className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Oil Change</p>
                <p className="text-sm text-gray-600">Sep 15, 2023 • ₹1,800</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-surface border-t border-gray-200">
        <Button fullWidth size="lg">
          Save Log Entry
        </Button>
      </div>
    </div>);

}