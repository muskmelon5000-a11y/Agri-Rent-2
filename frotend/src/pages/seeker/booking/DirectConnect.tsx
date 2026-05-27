import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppHeader } from '../../../components/shared/AppHeader';
import { Button } from '../../../components/shared/Button';
import { Card } from '../../../components/shared/Card';
import { Avatar } from '../../../components/shared/Avatar';
import {
  PhoneIcon,
  MessageCircleIcon,
  MapPinIcon,
  ShieldAlertIcon } from
'lucide-react';
export function DirectConnect() {
  const navigate = useNavigate();
  const location = useLocation();
  const ownerName = location.state?.ownerName || "Owner";
  const ownerPhone = location.state?.ownerPhone || "9876543210";
  const equipmentName = location.state?.equipmentName || "Equipment";

  const handleCall = () => {
    window.location.href = `tel:+91${ownerPhone}`;
  };

  const handleWhatsApp = () => {
    // WhatsApp deep link format
    const url = `https://wa.me/91${ownerPhone}?text=${encodeURIComponent(`Hi ${ownerName}, I have booked your ${equipmentName} on Agri-Rent Hub.`)}`;
    window.open(url, '_blank');
  };
  return (
    <div className="h-full bg-background flex flex-col">
      <AppHeader title="Contact Owner" showBack />

      <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col items-center">
        {/* Big Avatar */}
        <div className="mb-6 relative">
          <Avatar name={ownerName} size="xl" verified />
          <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-4 border-background rounded-full" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">{ownerName}</h1>
        <p className="text-gray-600 mb-8">Owner of {equipmentName}</p>

        {/* Huge Action Buttons */}
        <div className="w-full space-y-4 mb-8">
          <button 
            onClick={handleCall}
            className="w-full h-16 bg-primary text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg hover:bg-primary-700 active:scale-95 transition-all">
            <PhoneIcon className="w-6 h-6" />
            Call +91 {ownerPhone}
          </button>

          <button 
            onClick={handleWhatsApp}
            className="w-full h-16 bg-[#25D366] text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg hover:bg-[#20BD5A] active:scale-95 transition-all">
            <MessageCircleIcon className="w-6 h-6" />
            WhatsApp Message
          </button>
        </div>

        {/* Share Location Toggle */}
        <Card className="w-full p-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                <MapPinIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Share Live Location</p>
                <p className="text-xs text-gray-600">
                  Help owner find your field
                </p>
              </div>
            </div>
            {/* Toggle Switch */}
            <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
            </div>
          </div>
        </Card>

        {/* Safety Tips */}
        <div className="w-full bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <ShieldAlertIcon className="w-6 h-6 text-earth-amber flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Safety Tips</h3>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Always verify equipment condition before use</li>
              <li>Keep all payments recorded in the app</li>
              <li>Do not share OTPs with anyone</li>
            </ul>
          </div>
        </div>
      </div>
    </div>);

}