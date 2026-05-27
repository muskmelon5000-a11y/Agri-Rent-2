import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TractorIcon, SproutIcon } from 'lucide-react';
import { authService } from '../../services/authService';
export function SplashScreen() {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
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
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate]);
  return (
    <div className="h-full bg-gradient-to-br from-primary to-primary-700 flex flex-col items-center justify-center px-6">
      {/* Logo */}
      <div className="relative mb-8">
        <div className="w-32 h-32 bg-white rounded-3xl shadow-2xl flex items-center justify-center">
          <div className="relative">
            <TractorIcon className="w-16 h-16 text-primary" strokeWidth={2} />
            <SproutIcon
              className="w-8 h-8 text-secondary absolute -top-2 -right-2"
              strokeWidth={2.5} />
            
          </div>
        </div>
      </div>

      {/* Brand Name */}
      <h1 className="text-4xl font-bold text-white mb-3 text-center">
        Agri-Rent Hub
      </h1>

      {/* Tagline */}
      <p className="text-xl text-white/90 font-medium mb-12 text-center">
        Rent. Earn. Grow.
      </p>

      {/* Loading Indicator */}
      <div className="flex gap-2">
        <div
          className="w-2 h-2 bg-white rounded-full animate-bounce"
          style={{
            animationDelay: '0ms'
          }} />
        
        <div
          className="w-2 h-2 bg-white rounded-full animate-bounce"
          style={{
            animationDelay: '150ms'
          }} />
        
        <div
          className="w-2 h-2 bg-white rounded-full animate-bounce"
          style={{
            animationDelay: '300ms'
          }} />
        
      </div>
    </div>);

}