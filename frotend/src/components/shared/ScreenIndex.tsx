import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { XIcon, ListIcon } from 'lucide-react';
const screens = [
{
  module: 'Onboarding & Auth',
  screens: [
  {
    name: 'Splash',
    path: '/splash'
  },

  {
    name: 'Role Selection',
    path: '/role'
  },
  {
    name: 'Phone Login',
    path: '/login'
  },
  {
    name: 'OTP Verification',
    path: '/otp'
  }]

},
{
  module: 'Seeker: Discovery',
  screens: [
  {
    name: 'Home Dashboard',
    path: '/seeker/home'
  },
  {
    name: 'Category Listing',
    path: '/seeker/category/tractors'
  },
  {
    name: 'Search Results - List',
    path: '/seeker/search'
  },
  {
    name: 'Search Results - Map',
    path: '/seeker/search-map'
  },
  {
    name: 'Advanced Filters',
    path: '/seeker/filters'
  },
  {
    name: 'Machine Detail - Tractor',
    path: '/seeker/machine/tractor'
  },
  {
    name: 'Machine Detail - Drone',
    path: '/seeker/machine/drone'
  },
  {
    name: 'Machine Detail - Tools',
    path: '/seeker/machine/tools'
  },
  {
    name: 'Owner Profile',
    path: '/seeker/owner/1'
  },
  {
    name: 'Nearby Hubs Map',
    path: '/seeker/hubs'
  }]

},
{
  module: 'Seeker: Booking',
  screens: [
  {
    name: 'Availability Calendar',
    path: '/seeker/availability'
  },
  {
    name: 'Rental Request Form',
    path: '/seeker/request'
  },
  {
    name: 'Deal-Helper Calculator',
    path: '/seeker/calculator'
  },
  {
    name: 'Deal-Helper Results',
    path: '/seeker/calculator-results'
  },
  {
    name: 'Booking Confirmation',
    path: '/seeker/confirmation'
  },
  {
    name: 'Active Rental Tracker',
    path: '/seeker/active-rental'
  },
  {
    name: 'Direct-Connect',
    path: '/seeker/direct-connect'
  },
  {
    name: 'Payment/Receipt',
    path: '/seeker/payment'
  },
  {
    name: 'Extension Request',
    path: '/seeker/extension'
  },
  {
    name: 'Cancellation Flow',
    path: '/seeker/cancel'
  }]

},
{
  module: 'Provider: Management',
  screens: [
  {
    name: 'Provider Dashboard',
    path: '/provider/dashboard'
  },
  {
    name: 'My Equipment List',
    path: '/provider/equipment'
  },
  {
    name: 'Add Machine - Step 1',
    path: '/provider/add-machine/1'
  },
  {
    name: 'Add Machine - Step 2',
    path: '/provider/add-machine/2'
  },
  {
    name: 'Add Machine - Step 3',
    path: '/provider/add-machine/3'
  },
  {
    name: 'Add Machine - Step 4',
    path: '/provider/add-machine/4'
  },
  {
    name: 'Edit Machine',
    path: '/provider/edit-machine/1'
  },
  {
    name: 'Availability Toggle',
    path: '/provider/availability'
  },
  {
    name: 'Incoming Requests',
    path: '/provider/requests'
  },
  {
    name: 'Request Detail',
    path: '/provider/request/1'
  },
  {
    name: 'Active Job Monitor',
    path: '/provider/active-job'
  },
  {
    name: 'Completed Jobs',
    path: '/provider/completed'
  },
  {
    name: 'Earnings Report',
    path: '/provider/earnings'
  },
  {
    name: 'Maintenance Logger',
    path: '/provider/maintenance'
  },
  {
    name: 'Equipment Health',
    path: '/provider/health'
  }]

},
{
  module: 'Settings & Profile',
  screens: [
  {
    name: 'User Profile',
    path: '/profile'
  },
  {
    name: 'Skill-Badge Gallery',
    path: '/badges'
  },
  {
    name: 'Village Leaderboard',
    path: '/leaderboard'
  },
  {
    name: 'Notification Center',
    path: '/notifications'
  },
  {
    name: 'Help/Support',
    path: '/help'
  },
  {
    name: 'FAQ Equipment Use',
    path: '/faq'
  },
  {
    name: 'App Settings',
    path: '/settings'
  },
  {
    name: 'Language Toggle',
    path: '/language-settings'
  },
  {
    name: 'Logout',
    path: '/logout'
  },
  {
    name: 'Feedback/Rating',
    path: '/feedback'
  }]

}];

export function ScreenIndex() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95 px-6 py-3 flex items-center gap-2 font-semibold z-50">
        
        <ListIcon className="w-5 h-5" />
        Screens (50)
      </button>

      {/* Drawer */}
      {isOpen &&
      <>
          <div
          className="fixed inset-0 bg-black/50 z-50"
          onClick={() => setIsOpen(false)} />
        
          <div className="fixed right-0 top-0 bottom-0 w-96 bg-surface shadow-2xl z-50 overflow-y-auto">
            <div className="sticky top-0 bg-surface border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                All Screens (50)
              </h2>
              <button
              onClick={() => setIsOpen(false)}
              className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center">
              
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-6">
              {screens.map((module, idx) =>
            <div key={idx}>
                  <h3 className="text-sm font-bold text-primary mb-2">
                    {module.module}
                  </h3>
                  <div className="space-y-1">
                    {module.screens.map((screen, screenIdx) =>
                <Link
                  key={screenIdx}
                  to={screen.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-900 font-medium text-sm transition-colors">
                  
                        {screen.name}
                      </Link>
                )}
                  </div>
                </div>
            )}
            </div>
          </div>
        </>
      }
    </>);

}