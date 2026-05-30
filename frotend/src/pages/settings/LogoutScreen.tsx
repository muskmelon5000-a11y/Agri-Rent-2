import React from 'react';
import { AppHeader } from '../../components/shared/AppHeader';
import { Button } from '../../components/shared/Button';
import { LogOutIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function LogoutScreen() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  return (
    <div className="h-full bg-background flex flex-col">
      <AppHeader title="Log Out" showBack />

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <LogOutIcon className="w-10 h-10 text-red-500" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          Are you sure you want to log out?
        </h1>
        <p className="text-gray-600 text-center mb-8 max-w-xs">
          You will need to verify your phone number with an OTP to log back in.
        </p>

        <div className="w-full space-y-3">
          <Button
            fullWidth
            size="lg"
            className="bg-red-600 hover:bg-red-700 active:bg-red-800"
            onClick={() => logout()}>
            
            Yes, Log Out
          </Button>
          <Button
            variant="outline"
            fullWidth
            size="lg"
            onClick={() => navigate(-1)}>
            
            Cancel
          </Button>
        </div>
      </div>
    </div>);

}