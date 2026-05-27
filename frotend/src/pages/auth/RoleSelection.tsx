import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TractorIcon, UserIcon } from 'lucide-react';
export function RoleSelection() {
  const navigate = useNavigate();
  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome to Agri-Rent Hub
        </h1>
        <p className="text-base text-gray-600">
          How would you like to use the app?
        </p>
      </div>

      {/* Role Cards */}
      <div className="flex-1 px-6 space-y-4 pb-6">
        {/* Seeker Card */}
        <button
          onClick={() => navigate('/login', { state: { role: 'seeker' } })}
          className="w-full bg-surface rounded-3xl p-6 border-2 border-gray-200 hover:border-primary hover:shadow-lg transition-all active:scale-[0.98]">
          
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center flex-shrink-0">
              <UserIcon className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                I want to RENT equipment
              </h2>
              <p className="text-base text-gray-600 leading-relaxed">
                Find and rent tractors, harvesters, drones, and tools for your
                farming needs
              </p>
              <div className="mt-4 inline-flex items-center text-primary font-semibold">
                Continue as Seeker →
              </div>
            </div>
          </div>

          {/* Illustration placeholder */}
          <div className="mt-4 h-32 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl flex items-center justify-center">
            <span className="text-6xl">🌾</span>
          </div>
        </button>

        {/* Provider Card */}
        <button
          onClick={() => navigate('/login', { state: { role: 'provider' } })}
          className="w-full bg-surface rounded-3xl p-6 border-2 border-gray-200 hover:border-secondary hover:shadow-lg transition-all active:scale-[0.98]">
          
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-secondary-50 rounded-2xl flex items-center justify-center flex-shrink-0">
              <TractorIcon className="w-8 h-8 text-secondary-700" />
            </div>
            <div className="flex-1 text-left">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                I OWN equipment
              </h2>
              <p className="text-base text-gray-600 leading-relaxed">
                List your equipment and earn by renting it out to farmers in
                your area
              </p>
              <div className="mt-4 inline-flex items-center text-secondary-700 font-semibold">
                Continue as Provider →
              </div>
            </div>
          </div>

          {/* Illustration placeholder */}
          <div className="mt-4 h-32 bg-gradient-to-br from-secondary-50 to-primary-50 rounded-2xl flex items-center justify-center">
            <span className="text-6xl">🚜</span>
          </div>
        </button>
      </div>
    </div>);

}