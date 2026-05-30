import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  SearchIcon,
  CalendarIcon,
  UserIcon,
  LayoutDashboardIcon,
  TractorIcon,
  InboxIcon,
  MapIcon
} from 'lucide-react';
interface NavItem {
  path: string;
  icon: React.ElementType;
  label: string;
}
const seekerNav: NavItem[] = [
{
  path: '/seeker/home',
  icon: HomeIcon,
  label: 'Home'
},
{
  path: '/seeker/search',
  icon: SearchIcon,
  label: 'Search'
},
{
  path: '/seeker/search-map',
  icon: MapIcon,
  label: 'Map'
},
{
  path: '/seeker/active-rental',
  icon: CalendarIcon,
  label: 'Bookings'
},
{
  path: '/profile',
  icon: UserIcon,
  label: 'Profile'
}];

const providerNav: NavItem[] = [
{
  path: '/provider/dashboard',
  icon: LayoutDashboardIcon,
  label: 'Dashboard'
},
{
  path: '/provider/equipment',
  icon: TractorIcon,
  label: 'Equipment'
},
{
  path: '/provider/requests',
  icon: InboxIcon,
  label: 'Requests'
},
{
  path: '/profile',
  icon: UserIcon,
  label: 'Profile'
}];

interface BottomNavProps {
  role?: 'seeker' | 'provider';
}
export function BottomNav({ role = 'seeker' }: BottomNavProps) {
  const location = useLocation();
  const navItems = role === 'seeker' ? seekerNav : providerNav;
  return (
    <div className="bg-surface border-t border-gray-200 px-2 py-2 flex items-center justify-around fixed bottom-0 left-0 w-full z-40">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
        location.pathname === item.path ||
        location.pathname.startsWith(item.path + '/');
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors min-w-[64px] ${isActive ? 'text-primary bg-primary-50' : 'text-gray-600 hover:bg-gray-50 active:bg-gray-100'}`}>
            
            <Icon className="w-6 h-6" />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>);

      })}
    </div>);

}