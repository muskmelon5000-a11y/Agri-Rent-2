import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { LeafIcon, MailIcon, LockIcon, UserIcon, CheckCircleIcon, ArrowRightIcon, PhoneIcon } from 'lucide-react';
import { Button } from '../../components/shared/Button';

export function AuthPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  
  // Form State
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('');
  const [role, setRole] = useState<'seeker' | 'provider'>('seeker');
  
  // OTP State
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  
  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [devOtp, setDevOtp] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const user = await authService.login(email, password);
      login(user);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || password.length < 6) {
      setError("Please fill all fields (password min 6 chars)");
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const response = await authService.sendOTP(email);
      if (response.dev_otp) {
        setDevOtp(response.dev_otp);
      }
      setShowOTP(true);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifySignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const user = await authService.signup(email, otp, password, name, role, village, district, phone);
      login(user);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-primary mb-2">
          <LeafIcon className="w-12 h-12" />
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
          AgriRent
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Smart Equipment Sharing
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-primary/5 sm:rounded-2xl sm:px-10 border border-gray-100">
          
          {/* Tabs */}
          {!showOTP && (
            <div className="flex border-b border-gray-200 mb-6">
              <button
                className={`flex-1 py-3 text-center text-sm font-medium border-b-2 transition-colors ${activeTab === 'login' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                onClick={() => { setActiveTab('login'); setError(''); }}
              >
                Log In
              </button>
              <button
                className={`flex-1 py-3 text-center text-sm font-medium border-b-2 transition-colors ${activeTab === 'signup' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                onClick={() => { setActiveTab('signup'); setError(''); }}
              >
                Sign Up
              </button>
            </div>
          )}

          {error && (
            <div className="mb-4 bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          {/* LOGIN FLOW */}
          {activeTab === 'login' && !showOTP && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MailIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-3 border outline-none transition-all"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-3 border outline-none transition-all"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-12" isLoading={isLoading}>
                Login
              </Button>
            </form>
          )}

          {/* SIGNUP FLOW (Step 1) */}
          {activeTab === 'signup' && !showOTP && (
            <form onSubmit={handleSendOTP} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-3 mb-2">
                <button
                  type="button"
                  onClick={() => setRole('seeker')}
                  className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${role === 'seeker' ? 'border-primary bg-primary-50 text-primary' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                >
                  <span className="text-2xl">🌾</span>
                  <span className="text-sm font-medium">I want to rent</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('provider')}
                  className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${role === 'provider' ? 'border-primary bg-primary-50 text-primary' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                >
                  <span className="text-2xl">🚜</span>
                  <span className="text-sm font-medium">I own machines</span>
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-3 border outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MailIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-3 border outline-none transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number (Optional)</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <PhoneIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-3 border outline-none transition-all"
                    placeholder="10 digit number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Village/Town</label>
                  <input
                    type="text"
                    required
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="mt-1 focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-lg p-3 border outline-none transition-all"
                    placeholder="Village Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">District</label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="mt-1 focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-lg p-3 border outline-none transition-all"
                    placeholder="District Name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Create Password</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-3 border outline-none transition-all"
                    placeholder="Min 6 characters"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-12" isLoading={isLoading}>
                Send OTP <ArrowRightIcon className="ml-2 w-4 h-4" />
              </Button>
            </form>
          )}

          {/* SIGNUP FLOW (Step 2: OTP) */}
          {showOTP && (
            <form onSubmit={handleVerifySignup} className="space-y-5">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Verify your email</h3>
                <p className="text-sm text-gray-500 mt-1">
                  We sent a code to <span className="font-semibold text-gray-900">{email}</span>
                </p>
                {devOtp && (
                  <div className="mt-3 inline-block bg-primary-50 text-primary text-xs font-bold px-3 py-1.5 rounded-lg border border-primary-100">
                    Dev Mode OTP: {devOtp}
                  </div>
                )}
              </div>

              <div>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="focus:ring-primary focus:border-primary block w-full text-center text-2xl tracking-[0.5em] font-bold border-gray-300 rounded-lg p-4 border outline-none transition-all"
                    placeholder="------"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-12" isLoading={isLoading}>
                Create Account <CheckCircleIcon className="ml-2 w-5 h-5" />
              </Button>
              
              <div className="text-center mt-4">
                <button 
                  type="button" 
                  onClick={() => setShowOTP(false)} 
                  className="text-sm text-primary font-medium hover:underline"
                >
                  Change Email Address
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
