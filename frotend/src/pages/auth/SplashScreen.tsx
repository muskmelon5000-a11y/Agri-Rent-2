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
      navigate('/login');
    }
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-primary to-primary-700 flex flex-col items-center px-6 pb-12 pt-20">
      
      {/* Top Spacer */}
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        {/* Logo */}
        <div className="relative mb-10 animate-fade-in-up">
          <div className="w-40 h-40 bg-white/20 backdrop-blur-lg rounded-full shadow-[0_0_40px_rgba(255,255,255,0.1)] flex items-center justify-center p-6 border border-white/30 transform hover:scale-105 transition-all duration-300">
            <div className="relative">
              <SproutIcon className="w-20 h-20 text-white" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="text-6xl font-bold text-white mb-4 text-center tracking-tight animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          CropMate
        </h1>

        {/* Tagline */}
        <p className="text-xl text-white/90 font-light text-center max-w-[280px] leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          The intelligent way to rent and manage farm equipment.
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