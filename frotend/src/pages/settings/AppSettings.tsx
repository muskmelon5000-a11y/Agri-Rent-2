import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppHeader } from '../../components/shared/AppHeader';
import { Card } from '../../components/shared/Card';
import {
  BellIcon,
  MapPinIcon,
  MoonIcon,
  SmartphoneIcon,
  GlobeIcon,
  ShieldIcon } from
'lucide-react';
export function AppSettings() {
  const [pushNotifs, setPushNotifs] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [location, setLocation] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [dataSaver, setDataSaver] = useState(false);
  const Toggle = ({
    checked,
    onChange



  }: {checked: boolean;onChange: () => void;}) =>
  <div
    onClick={onChange}
    className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${checked ? 'bg-primary' : 'bg-gray-300'}`}>
    
      <div
      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${checked ? 'right-1' : 'left-1'}`} />
    
    </div>;

  return (
    <div className="h-full bg-background flex flex-col">
      <AppHeader title="Settings" showBack />

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* Notifications */}
        <div>
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">
            Notifications
          </h2>
          <Card className="divide-y divide-gray-100">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BellIcon className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-semibold text-gray-900">
                    Push Notifications
                  </p>
                  <p className="text-xs text-gray-500">
                    App alerts and updates
                  </p>
                </div>
              </div>
              <Toggle
                checked={pushNotifs}
                onChange={() => setPushNotifs(!pushNotifs)} />
              
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SmartphoneIcon className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-semibold text-gray-900">SMS Alerts</p>
                  <p className="text-xs text-gray-500">
                    Booking confirmations via SMS
                  </p>
                </div>
              </div>
              <Toggle
                checked={smsAlerts}
                onChange={() => setSmsAlerts(!smsAlerts)} />
              
            </div>
          </Card>
        </div>

        {/* Preferences */}
        <div>
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">
            Preferences
          </h2>
          <Card className="divide-y divide-gray-100">
            <Link to="/language-settings" className="block">
              <div className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <GlobeIcon className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Language</p>
                    <p className="text-xs text-gray-500">English</p>
                  </div>
                </div>
                <span className="text-gray-400 font-bold">→</span>
              </div>
            </Link>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPinIcon className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-semibold text-gray-900">
                    Location Services
                  </p>
                  <p className="text-xs text-gray-500">
                    Required for nearby search
                  </p>
                </div>
              </div>
              <Toggle
                checked={location}
                onChange={() => setLocation(!location)} />
              
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MoonIcon className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-semibold text-gray-900">Dark Mode</p>
                  <p className="text-xs text-gray-500">Reduce eye strain</p>
                </div>
              </div>
              <Toggle
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)} />
              
            </div>
          </Card>
        </div>

        {/* Data & Privacy */}
        <div>
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">
            Data & Privacy
          </h2>
          <Card className="divide-y divide-gray-100">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldIcon className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-semibold text-gray-900">Data Saver Mode</p>
                  <p className="text-xs text-gray-500">
                    Load lower quality images
                  </p>
                </div>
              </div>
              <Toggle
                checked={dataSaver}
                onChange={() => setDataSaver(!dataSaver)} />
              
            </div>
            <div className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
              <span className="font-semibold text-gray-900">
                Privacy Policy
              </span>
              <span className="text-gray-400 font-bold">→</span>
            </div>
            <div className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
              <span className="font-semibold text-gray-900">
                Terms of Service
              </span>
              <span className="text-gray-400 font-bold">→</span>
            </div>
          </Card>
        </div>

        <div className="text-center pb-4">
          <p className="text-xs text-gray-400 font-semibold">
            CropMate v1.0.4
          </p>
        </div>
      </div>
    </div>);

}