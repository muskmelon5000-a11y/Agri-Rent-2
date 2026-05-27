import React, { useState, useEffect } from 'react';
import { AppHeader } from '../../components/shared/AppHeader';
import { BottomNav } from '../../components/shared/BottomNav';
import { Card } from '../../components/shared/Card';
import { Button } from '../../components/shared/Button';
import { DownloadIcon, TrendingUpIcon } from 'lucide-react';
import { providerService, ProviderDashboard, EarningsDay } from '../../services/providerService';

export function EarningsReport() {
  const [dashboard, setDashboard] = useState<ProviderDashboard | null>(null);
  const [monthlyData, setMonthlyData] = useState<EarningsDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [dashRes, monthRes] = await Promise.all([
          providerService.getDashboard(),
          providerService.getMonthlyEarnings()
        ]);
        setDashboard(dashRes);
        setMonthlyData(monthRes);
      } catch (error) {
        console.error("Failed to load earnings:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading || !dashboard) {
    return <div className="min-h-full bg-background flex items-center justify-center">Loading earnings...</div>;
  }
  return (
    <div className="min-h-full bg-background pb-20">
      <AppHeader title="Earnings Report" showBack />

      <div className="px-6 py-6 space-y-6">
        {/* Period Selector */}
        <div className="flex bg-surface rounded-xl p-1 border border-gray-200">
          <button className="flex-1 py-2 text-sm font-semibold text-gray-600 rounded-lg">
            Week
          </button>
          <button className="flex-1 py-2 text-sm font-semibold bg-primary text-white rounded-lg shadow-sm">
            Month
          </button>
          <button className="flex-1 py-2 text-sm font-semibold text-gray-600 rounded-lg">
            Year
          </button>
        </div>

        {/* Big Total */}
        <div className="text-center py-4">
          <p className="text-gray-600 font-medium mb-1">This Month's Earnings</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">₹{dashboard.total_earnings_month}</h1>
          {dashboard.earnings_change_pct !== 0 && (
            <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${dashboard.earnings_change_pct > 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
              <TrendingUpIcon className={`w-4 h-4 ${dashboard.earnings_change_pct < 0 ? 'rotate-180' : ''}`} />
              {dashboard.earnings_change_pct > 0 ? '+' : ''}{dashboard.earnings_change_pct}% vs last month
            </div>
          )}
        </div>

        {/* Chart Placeholder - Dynamic */}
        <Card className="p-4 h-48 flex flex-col justify-end relative overflow-hidden">
          <div className="absolute top-4 left-4 text-sm font-bold text-gray-900">
            6-Month Revenue
          </div>
          <div className="flex items-end justify-between h-32 gap-2 mt-8">
            {monthlyData.map((data, i) => {
              const maxVal = Math.max(...monthlyData.map(d => d.value), 1);
              const heightPct = (data.value / maxVal) * 100;
              return (
                <div key={i} className="w-full bg-primary-100 rounded-t-md relative group h-full flex items-end">
                  <div
                    className="w-full bg-primary rounded-t-md transition-all"
                    style={{ height: `${heightPct}%` }} />
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2 px-1">
            {monthlyData.map((data, i) => (
              <span key={i}>{data.name}</span>
            ))}
          </div>
        </Card>

        {/* Breakdown */}
        {dashboard.top_machine_name && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Top Performer</h2>
            <div className="space-y-3">
              <Card className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={dashboard.top_machine_image || 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=200'} className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <p className="font-bold text-gray-900">{dashboard.top_machine_name}</p>
                    <p className="text-sm text-gray-600">{dashboard.top_machine_rentals} rentals</p>
                  </div>
                </div>
                <span className="font-bold text-gray-900">₹{dashboard.top_machine_earnings}</span>
              </Card>
            </div>
          </div>
        )}

        <Button variant="outline" fullWidth>
          <DownloadIcon className="w-5 h-5 mr-2" />
          Download CSV Report
        </Button>
      </div>

      <BottomNav role="provider" />
    </div>);

}