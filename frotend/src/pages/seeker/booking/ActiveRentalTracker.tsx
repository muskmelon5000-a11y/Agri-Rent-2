import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../../../components/shared/AppHeader';
import { BottomNav } from '../../../components/shared/BottomNav';
import { Button } from '../../../components/shared/Button';
import { Card } from '../../../components/shared/Card';
import { Avatar } from '../../../components/shared/Avatar';
import {
  PhoneIcon,
  MessageCircleIcon,
  ClockIcon,
  Loader2Icon } from 'lucide-react';
import { bookingService, Booking } from '../../../services/bookingService';
import { LiveTrackingMap } from '../../../components/shared/LiveTrackingMap';
export function ActiveRentalTracker() {
  const navigate = useNavigate();
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadActiveRental() {
      try {
        const data = await bookingService.getMyBookings();
        const active = data.find(b => b.status === 'active' || b.status === 'accepted' || b.status === 'pending');
        setActiveBooking(active || null);
      } catch (error) {
        console.error("Failed to load active rental:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadActiveRental();
  }, []);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="min-h-full bg-background flex items-center justify-center">
        <Loader2Icon className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!activeBooking) {
    return (
      <div className="min-h-full bg-background pb-20">
        <AppHeader title="Active Rental" showBack />
        <div className="flex flex-col items-center justify-center p-6 text-center h-[60vh]">
          <p className="text-gray-600 mb-4">You have no active rentals.</p>
          <Button onClick={() => navigate('/seeker/home')}>Browse Equipment</Button>
        </div>
        <BottomNav role="seeker" />
      </div>
    );
  }

  // Derive steps based on status
  const steps = [
    {
      label: 'Request Sent',
      time: activeBooking.created_at ? formatDate(activeBooking.created_at) : 'Done',
      completed: true,
      active: activeBooking.status === 'pending'
    },
    {
      label: 'Accepted by Owner',
      time: activeBooking.status === 'pending' ? 'Waiting' : 'Done',
      completed: ['accepted', 'active', 'completed'].includes(activeBooking.status),
      active: activeBooking.status === 'accepted'
    },
    {
      label: 'In Use',
      time: activeBooking.start_date ? `Started ${formatDate(activeBooking.start_date)}` : 'Pending',
      completed: ['active', 'completed'].includes(activeBooking.status),
      active: activeBooking.status === 'active'
    },
    {
      label: 'Completed',
      time: 'Pending',
      completed: activeBooking.status === 'completed',
      active: activeBooking.status === 'completed'
    }
  ];

  return (
    <div className="min-h-full bg-background pb-20">
      <AppHeader title="Active Rental" showBack />

      {/* Live Map */}
      <div className="h-56 relative z-0">
        <LiveTrackingMap 
          initialLat={23.0225} 
          initialLng={72.5714} 
          equipmentName={activeBooking.equipment_name || "Tractor"} 
        />
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Time Remaining */}
        <Card className="p-4 bg-primary text-white border-none">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ClockIcon className="w-8 h-8 opacity-80" />
              <div>
                <p className="text-primary-100 text-sm font-medium">
                  Time Remaining
                </p>
                <h2 className="text-2xl font-bold">1d 4h 30m</h2>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/seeker/extension')}>
              
              Extend
            </Button>
          </div>
        </Card>

        {/* Status Stepper */}
        <Card className="p-6">
          <h3 className="font-bold text-gray-900 mb-6">Rental Status</h3>
          <div className="space-y-6 relative">
            {/* Connecting line */}
            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-200" />

            {steps.map((step, idx) =>
            <div key={idx} className="flex gap-4 relative z-10">
                <div
                className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${step.active ? 'bg-primary ring-4 ring-primary-50' : step.completed ? 'bg-primary' : 'bg-gray-200'}`}>
                
                  {step.completed && !step.active &&
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  
                      <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7" />
                  
                    </svg>
                }
                  {step.active &&
                <div className="w-2 h-2 bg-white rounded-full" />
                }
                </div>
                <div>
                  <p
                  className={`font-bold ${step.active ? 'text-primary' : step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                  
                    {step.label}
                  </p>
                  <p className="text-sm text-gray-500">{step.time}</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Owner Quick Connect */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar name={activeBooking.owner_name || "Owner"} size="md" />
              <div>
                <p className="font-bold text-gray-900">{activeBooking.owner_name || "Owner"}</p>
                <p className="text-sm text-gray-600">Equipment Owner</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate('/seeker/direct-connect', { 
                state: { 
                  ownerName: activeBooking.owner_name, 
                  ownerPhone: activeBooking.owner_phone,
                  equipmentName: activeBooking.equipment_name 
                } 
              })}>
              <PhoneIcon className="w-4 h-4" /> Call
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate('/seeker/direct-connect', { 
                state: { 
                  ownerName: activeBooking.owner_name, 
                  ownerPhone: activeBooking.owner_phone,
                  equipmentName: activeBooking.equipment_name 
                } 
              })}>
              <MessageCircleIcon className="w-4 h-4" /> Chat
            </Button>
          </div>
        </Card>
      </div>

      {/* Bottom Action */}
      <div className="sticky bottom-[72px] left-0 right-0 p-4 bg-surface border-t border-gray-200 z-30 mt-auto">
        <Button fullWidth size="lg" onClick={() => navigate('/seeker/payment')}>
          Buy on Hand
        </Button>
      </div>

      <BottomNav role="seeker" />
    </div>);

}