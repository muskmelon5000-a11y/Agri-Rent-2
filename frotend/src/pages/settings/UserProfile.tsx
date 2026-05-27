import { Link } from 'react-router-dom';
import { AppHeader } from '../../components/shared/AppHeader';
import { BottomNav } from '../../components/shared/BottomNav';
import { Card } from '../../components/shared/Card';
import { Avatar } from '../../components/shared/Avatar';
import { Badge } from '../../components/shared/Badge';
import {
  SettingsIcon,
  AwardIcon,
  TrophyIcon,
  HelpCircleIcon,
  LogOutIcon,
  ChevronRightIcon,
  MapPinIcon,
  PhoneIcon } from
'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function UserProfile() {
  const { user } = useAuth();
  const isProvider = user?.role === 'provider';

  return (
    <div className="min-h-full bg-background pb-20">
      <AppHeader title="Profile" />

      <div className="px-6 py-6 space-y-6">
        {/* Profile Header */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar name={user?.name || "Farmer"} size="xl" verified />
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center border-2 border-background">
              <span className="text-sm">✏️</span>
            </button>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {user?.name || "Farmer"}
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <PhoneIcon className="w-4 h-4" />
              +91 {user?.phone || "00000 00000"}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPinIcon className="w-4 h-4" />
              {user?.village || "Unknown"}, {user?.district || "Unknown"}
            </div>
          </div>
        </div>

        {/* Role Switcher */}
        <Card className="p-4 bg-gradient-to-r from-primary-50 to-secondary-50 border-none">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Current Role
              </p>
              <p className="text-xs text-gray-600">
                You are browsing as a {user?.role === 'provider' ? 'Provider' : 'Seeker'}
              </p>
            </div>
            <Link to={isProvider ? "/seeker/home" : "/provider/dashboard"}>
              <button className="px-4 py-2 bg-white text-primary font-bold rounded-xl shadow-sm text-sm">
                Switch to {isProvider ? 'Seeker' : 'Provider'}
              </button>
            </Link>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary">
              <AwardIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{user?.skill_points || 0}</p>
              <p className="text-xs text-gray-600">Skill Points</p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-earth-amber/10 rounded-xl flex items-center justify-center text-earth-amber">
              <span className="text-lg font-bold">4.8</span>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">⭐</p>
              <p className="text-xs text-gray-600">Avg Rating</p>
            </div>
          </Card>
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">
            Community & Achievements
          </h2>

          <Link to="/badges">
            <Card className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-secondary-50 rounded-lg flex items-center justify-center text-secondary-700">
                  <AwardIcon className="w-4 h-4" />
                </div>
                <span className="font-semibold text-gray-900">
                  Skill Badges
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" size="sm">
                  3 New
                </Badge>
                <ChevronRightIcon className="w-5 h-5 text-gray-400" />
              </div>
            </Card>
          </Link>

          <Link to="/leaderboard">
            <Card className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-earth-amber/10 rounded-lg flex items-center justify-center text-earth-amber">
                  <TrophyIcon className="w-4 h-4" />
                </div>
                <span className="font-semibold text-gray-900">
                  Village Leaderboard
                </span>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-gray-400" />
            </Card>
          </Link>
        </div>

        <div className="space-y-2">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 px-2 mt-6">
            Settings & Support
          </h2>

          <Link to="/settings">
            <Card className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
                  <SettingsIcon className="w-4 h-4" />
                </div>
                <span className="font-semibold text-gray-900">
                  App Settings
                </span>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-gray-400" />
            </Card>
          </Link>

          <Link to="/help">
            <Card className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
                  <HelpCircleIcon className="w-4 h-4" />
                </div>
                <span className="font-semibold text-gray-900">
                  Help & Support
                </span>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-gray-400" />
            </Card>
          </Link>

          <Link to="/logout">
            <Card className="p-4 flex items-center justify-between hover:bg-red-50 transition-colors border-red-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                  <LogOutIcon className="w-4 h-4" />
                </div>
                <span className="font-semibold text-red-600">Log Out</span>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-red-300" />
            </Card>
          </Link>
        </div>
      </div>

      <BottomNav role={user?.role === 'provider' ? 'provider' : 'seeker'} />
    </div>);
}