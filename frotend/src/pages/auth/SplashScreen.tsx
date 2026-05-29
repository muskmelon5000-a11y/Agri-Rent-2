import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TractorIcon, SproutIcon, ArrowRightIcon } from 'lucide-react';
import { authService } from '../../services/authService';
import { Button } from '../../components/shared/Button';

export function SplashScreen() {
  const navigate = useNavigate();

  const handleNext = () => {
    const user = authService.getStoredUser();
    if (user) {
      if (user.role === 'provider') {
        navigate('/provider/dashboard');
      } else {
        navigate('/seeker/home');
      }
    } else {
      navigate('/role');
    }
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-primary to-primary-700 flex flex-col items-center px-6 pb-12 pt-20">
      
      {/* Top Spacer */}
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        {/* Logo */}
        <div className="relative mb-10">
          <div className="w-40 h-40 bg-white rounded-full shadow-2xl flex items-center justify-center p-6 transform hover:scale-105 transition-transform">
            <div className="relative">
              <TractorIcon className="w-20 h-20 text-primary" strokeWidth={1.5} />
              <SproutIcon
                className="w-10 h-10 text-secondary absolute -top-4 -right-4"
                strokeWidth={2} />
            </div>
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="text-5xl font-bold text-white mb-4 text-center tracking-tight">
          Agri-Rent Hub
        </h1>

        {/* Tagline */}
        <p className="text-xl text-white/90 font-medium text-center max-w-[250px] leading-relaxed">
          The easiest way to rent and manage farm equipment.
        </p>
      </div>

      {/* Bottom Button Area */}
      <div className="w-full mt-auto">
        <Button 
          variant="secondary" 
          fullWidth 
          size="lg" 
          onClick={handleNext}
          className="shadow-xl text-lg group"
        >
          Get Started
          <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}