import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../components/shared/Button';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

export function OTPVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const phone = location.state?.phone || '';
  const role = location.state?.role || 'seeker';
  const name = location.state?.name || '';
  const [devOtp, setDevOtp] = useState(location.state?.devOtp || '');
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!phone) {
      navigate('/login');
    }
  }, [phone, navigate]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      const pastedOtp = value.slice(0, 6).split('');
      const newOtp = [...otp];
      pastedOtp.forEach((char, i) => {
        if (index + i < 6) newOtp[index + i] = char;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + pastedOtp.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) return;

    try {
      setIsLoading(true);
      // We pass the role and name to properly register users.
      const userData = await authService.verifyOTP(phone, otpString, role, name);
      login(userData); // context will handle redirection
    } catch (error: any) {
      alert(error.response?.data?.detail || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Enter Verification Code
        </h1>
        <p className="text-base text-gray-600 mb-3">
          We sent a 6-digit code to{' '}
          <span className="font-semibold text-gray-900">+91 {phone}</span>
        </p>
        {devOtp && (
          <div className="p-3.5 bg-green-50 border border-green-200 rounded-2xl">
            <p className="text-sm text-green-800">
              <span className="font-bold">Development Mode:</span> Use OTP{' '}
              <span className="font-mono font-bold text-base text-green-900 bg-green-100 px-2 py-0.5 rounded">{devOtp}</span>
            </p>
          </div>
        )}
      </div>

      {/* OTP Input */}
      <div className="flex-1 px-6">
        <div className="flex gap-3 justify-center mb-6">
          {otp.map((digit, index) =>
          <input
            key={index}
            ref={(el) => inputRefs.current[index] = el}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-2xl focus:border-primary focus:outline-none transition-colors" />
          )}
        </div>

        {/* Resend Timer */}
        <div className="text-center mb-6">
          {timer > 0 ?
          <p className="text-sm text-gray-600">
              Resend code in{' '}
              <span className="font-semibold text-primary">{timer}s</span>
            </p> :

          <button
            className="text-sm font-semibold text-primary"
            onClick={async () => {
              setTimer(30);
              try {
                const res = await authService.sendOTP(phone);
                if (res.dev_otp) {
                  setDevOtp(res.dev_otp);
                  console.log("DEV OTP:", res.dev_otp);
                }
              } catch (err) {
                console.error(err);
              }
            }}>
              Resend Code
            </button>
          }
        </div>

        {/* Change Number */}
        <div className="text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-sm font-semibold text-gray-600 hover:text-primary">
            Change Phone Number
          </button>
        </div>
      </div>

      {/* Verify Button */}
      <div className="p-6 bg-surface border-t border-gray-200">
        <Button
          fullWidth
          size="lg"
          disabled={otp.some((d) => !d) || isLoading}
          onClick={handleVerify}>
          {isLoading ? "Verifying..." : "Verify & Continue"}
        </Button>
      </div>
    </div>);
}