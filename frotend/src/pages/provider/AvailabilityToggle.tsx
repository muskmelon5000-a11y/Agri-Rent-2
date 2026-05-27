import React, { useState } from 'react';
import { AppHeader } from '../../components/shared/AppHeader';
import { Card } from '../../components/shared/Card';
import { Button } from '../../components/shared/Button';
import { CalendarIcon, SettingsIcon } from 'lucide-react';
export function AvailabilityToggle() {
  const [isAvailable, setIsAvailable] = useState(true);
  return (
    <div className="h-full bg-background flex flex-col">
      <AppHeader title="Manage Availability" showBack />

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        <Card className="p-4 flex items-center gap-4">
          <img
            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=200"
            alt="Tractor"
            className="w-16 h-16 object-cover rounded-xl" />
          
          <div className="flex-1">
            <h3 className="font-bold text-gray-900">Mahindra 575 DI</h3>
            <p className="text-sm text-gray-600">Tractor</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Quick Toggle</h2>
              <p className="text-sm text-gray-600">
                Instantly mark as unavailable
              </p>
            </div>
            <div
              onClick={() => setIsAvailable(!isAvailable)}
              className={`w-14 h-8 rounded-full relative cursor-pointer transition-colors ${isAvailable ? 'bg-primary' : 'bg-gray-300'}`}>
              
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${isAvailable ? 'right-1' : 'left-1'}`} />
              
            </div>
          </div>

          <div
            className={`p-4 rounded-xl border ${isAvailable ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
            
            <p
              className={`text-sm font-semibold ${isAvailable ? 'text-green-800' : 'text-amber-800'}`}>
              
              {isAvailable ?
              'Currently visible to seekers and accepting bookings.' :
              'Currently hidden from search results. No new bookings will be accepted.'}
            </p>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <CalendarIcon className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-bold text-gray-900">
              Block Specific Dates
            </h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Select dates on the calendar when this equipment will be
            unavailable.
          </p>
          <Button variant="outline" fullWidth>
            Open Calendar
          </Button>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <SettingsIcon className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-bold text-gray-900">Recurring Rules</h2>
          </div>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-surface border border-gray-200 rounded-xl">
              <span className="font-medium text-gray-900">
                Unavailable on Sundays
              </span>
              <input
                type="checkbox"
                className="w-5 h-5 text-primary rounded focus:ring-primary" />
              
            </label>
            <label className="flex items-center justify-between p-3 bg-surface border border-gray-200 rounded-xl">
              <span className="font-medium text-gray-900">
                Require 1 day notice
              </span>
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 text-primary rounded focus:ring-primary" />
              
            </label>
          </div>
        </Card>
      </div>
    </div>);

}