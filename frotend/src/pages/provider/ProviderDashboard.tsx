import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BottomNav } from '../../components/shared/BottomNav';
import { Card } from '../../components/shared/Card';
import { StatPill } from '../../components/shared/StatPill';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUpIcon, CalendarIcon, InboxIcon, PlusIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { providerService, ProviderDashboard as DashboardData } from '../../services/providerService';

export function ProviderDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const dashboardData = await providerService.getDashboard();
        setData(dashboardData);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (isLoading || !data) {
    return <div className="min-h-full bg-background flex items-center justify-center">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-full bg-background pb-20">
      {/* Header */}
      <div className="bg-secondary-700 px-6 pt-6 pb-8 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-white/80 text-sm font-medium mb-1">
              Provider Dashboard
            </p>
            <h1 className="text-white text-2xl font-bold">{user?.name || "Provider"}</h1>
          </div>
          <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-2xl">🔔</span>
            {data.pending_requests > 0 && (
              <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-secondary-700" />
            )}
          </button>
        </div>

        {/* Revenue Summary */}
        <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/20">
          <p className="text-white/80 text-sm font-medium mb-1">
            This Month's Earnings
          </p>
          <div className="flex items-end gap-3">
            <h2 className="text-4xl font-bold text-white">₹{data.total_earnings_month}</h2>
            {data.earnings_change_pct !== 0 && (
              <span className={`text-sm font-semibold mb-1 flex items-center ${data.earnings_change_pct > 0 ? 'text-green-300' : 'text-red-300'}`}>
                <TrendingUpIcon className={`w-4 h-4 mr-1 ${data.earnings_change_pct < 0 ? 'rotate-180' : ''}`} /> 
                {data.earnings_change_pct > 0 ? '+' : ''}{data.earnings_change_pct}%
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          <Link to="/provider/add-machine/1">
            <Card className="p-3 text-center hover:bg-primary-50 transition-colors">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <PlusIcon className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs font-semibold text-gray-900">Add Machine</p>
            </Card>
          </Link>
          <Link to="/provider/requests">
            <Card className="p-3 text-center hover:bg-secondary-50 transition-colors relative">
              {data.pending_requests > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs font-bold flex items-center justify-center">
                  {data.pending_requests}
                </div>
              )}
              <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <InboxIcon className="w-5 h-5 text-secondary-700" />
              </div>
              <p className="text-xs font-semibold text-gray-900">Requests</p>
            </Card>
          </Link>
          <Link to="/provider/availability">
            <Card className="p-3 text-center hover:bg-amber-50 transition-colors">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <CalendarIcon className="w-5 h-5 text-earth-amber" />
              </div>
              <p className="text-xs font-semibold text-gray-900">Calendar</p>
            </Card>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatPill label="Active Rentals" value={data.active_rentals.toString()} />
          <StatPill label="Completed Jobs" value={data.completed_jobs.toString()} />
        </div>

        {/* Earnings Chart */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Weekly Revenue</h3>
            <Link
              to="/provider/earnings"
              className="text-sm font-semibold text-primary">
              Details →
            </Link>
          </div>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.weekly_chart}>
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  formatter={(value) => [`₹${value}`, 'Revenue']} />
                
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#2E7D32"
                  strokeWidth={3}
                  dot={{
                    fill: '#2E7D32',
                    strokeWidth: 2,
                    r: 4
                  }}
                  activeDot={{
                    r: 6
                  }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Top Performing Machine */}
        {data.top_machine_name && (
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Top Performer</h3>
            <Card className="flex gap-4 p-4">
              <img
                src={data.top_machine_image || 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=200'}
                alt="Top machine"
                className="w-20 h-20 object-cover rounded-xl" />
              
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">
                  {data.top_machine_name}
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  {data.top_machine_rentals} rentals this month
                </p>
                <p className="text-primary font-bold">₹{data.top_machine_earnings} earned</p>
              </div>
            </Card>
          </div>
        )}
      </div>

      <BottomNav role="provider" />
    </div>);
}