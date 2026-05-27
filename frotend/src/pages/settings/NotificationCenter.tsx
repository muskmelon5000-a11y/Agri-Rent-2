import React from 'react';
import { AppHeader } from '../../components/shared/AppHeader';
import { Card } from '../../components/shared/Card';
import {
  TractorIcon,
  CheckCircle2Icon,
  AlertTriangleIcon,
  TagIcon } from
'lucide-react';
const notifications = [
{
  id: 1,
  title: 'Booking Accepted!',
  message: 'Suresh Patel accepted your request for Mahindra 575 DI.',
  time: '2 hours ago',
  type: 'success',
  unread: true,
  icon: CheckCircle2Icon
},
{
  id: 2,
  title: 'Upcoming Rental Reminder',
  message:
  'Your rental starts tomorrow at 8:00 AM. Please contact the owner.',
  time: '5 hours ago',
  type: 'info',
  unread: true,
  icon: TractorIcon
},
{
  id: 3,
  title: 'Special Bundle Discount',
  opacity: 'opacity-70',
  message: 'Rent a tractor + rotavator this weekend and save 15%!',
  time: '1 day ago',
  type: 'promo',
  unread: false,
  icon: TagIcon
},
{
  id: 4,
  title: 'Payment Pending',
  opacity: 'opacity-70',
  message: 'Please mark your cash payment for booking ARH-8492 as complete.',
  time: '2 days ago',
  type: 'warning',
  unread: false,
  icon: AlertTriangleIcon
}];

export function NotificationCenter() {
  return (
    <div className="h-full bg-background flex flex-col">
      <AppHeader
        title="Notifications"
        showBack
        action={
        <button className="text-sm font-semibold text-primary">
            Mark all read
          </button>
        } />
      

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button className="px-4 py-2 bg-primary text-white rounded-full text-sm font-semibold">
            All
          </button>
          <button className="px-4 py-2 bg-surface text-gray-600 border border-gray-200 rounded-full text-sm font-semibold">
            Bookings
          </button>
          <button className="px-4 py-2 bg-surface text-gray-600 border border-gray-200 rounded-full text-sm font-semibold">
            Promos
          </button>
        </div>

        {notifications.map((notif) => {
          const Icon = notif.icon;
          let iconColor = 'text-blue-600';
          let iconBg = 'bg-blue-50';
          if (notif.type === 'success') {
            iconColor = 'text-green-600';
            iconBg = 'bg-green-50';
          } else if (notif.type === 'warning') {
            iconColor = 'text-earth-amber';
            iconBg = 'bg-amber-50';
          } else if (notif.type === 'promo') {
            iconColor = 'text-purple-600';
            iconBg = 'bg-purple-50';
          }
          return (
            <Card
              key={notif.id}
              className={`p-4 relative ${notif.opacity || ''} ${notif.unread ? 'border-primary-200 bg-primary-50/30' : ''}`}>
              
              {notif.unread &&
              <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-primary rounded-full" />
              }
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
                  
                  <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>
                <div className="pr-4">
                  <h3
                    className={`font-bold mb-1 ${notif.unread ? 'text-gray-900' : 'text-gray-700'}`}>
                    
                    {notif.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                    {notif.message}
                  </p>
                  <span className="text-xs font-semibold text-gray-400">
                    {notif.time}
                  </span>
                </div>
              </div>
            </Card>);

        })}
      </div>
    </div>);

}