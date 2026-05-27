import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../components/shared/Button';
import { Input } from '../../components/shared/Input';
import { PhoneIcon, UserIcon } from 'lucide-react';
import { authService } from '../../services/authService';

export function PhoneLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = location.state?.role || 'seeker';
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async () => {
    try {
      setIsLoading(true);
      const res = await authService.sendOTP(phone);
      if (res.dev_otp) {
        console.log("DEV OTP:", res.dev_otp);
      }
      navigate('/otp', { state: { phone, devOtp: res.dev_otp, role, name } });
    } catch (error) {
      alert("Failed to send OTP. Ensure backend is running.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Enter Your Phone Number
        </h1>
        <p className="text-base text-gray-600">
          We'll send you a verification code
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 space-y-6">
        {/* Country Code Selector */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Country
          </label>
          <div className="h-12 px-4 bg-surface border-2 border-gray-200 rounded-2xl flex items-center gap-3">
            <span className="text-2xl">🇮🇳</span>
            <span className="text-base font-semibold text-gray-900">
              India (+91)
            </span>
          </div>
        </div>

        {/* Name Input */}
        <Input
          label="Full Name"
          type="text"
          placeholder="Ramesh Patel"
          value={name}
          onChange={(e) => setName(e.target.value)}
          icon={<UserIcon className="w-5 h-5" />} />

        {/* Phone Input */}
        <Input
          label="Phone Number"
          type="tel"
          placeholder="9876543210"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          icon={<PhoneIcon className="w-5 h-5" />} />
        

        {/* Terms Checkbox */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-5 h-5 mt-0.5 rounded border-2 border-gray-300 text-primary focus:ring-2 focus:ring-primary" />
          
          <span className="text-sm text-gray-600 leading-relaxed">
            I agree to the{' '}
            <span className="text-primary font-semibold">Terms of Service</span>{' '}
            and{' '}
            <span className="text-primary font-semibold">Privacy Policy</span>
          </span>
        </label>

        {/* Info Card */}
        <div className="bg-primary-50 border border-primary-200 rounded-2xl p-4">
          <p className="text-sm text-gray-700 leading-relaxed">
            <span className="font-semibold">Secure Login:</span> We use OTP
            verification to keep your account safe. Standard SMS rates may
            apply.
          </p>
        </div>
      </div>

      {/* Send OTP Button */}
      <div className="p-6 bg-surface border-t border-gray-200">
        <Button
          fullWidth
          size="lg"
          disabled={phone.length !== 10 || !name.trim() || !agreed || isLoading}
          onClick={handleSendOTP}>
          
          {isLoading ? "Sending..." : "Send OTP"}
        </Button>
      </div>
    </div>);
}