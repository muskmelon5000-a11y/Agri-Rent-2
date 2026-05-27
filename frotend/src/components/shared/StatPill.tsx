import React from 'react';
interface StatPillProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: 'up' | 'down';
  trendValue?: string;
}
export function StatPill({
  label,
  value,
  icon,
  trend,
  trendValue
}: StatPillProps) {
  return (
    <div className="bg-surface rounded-2xl p-4 border border-gray-100 shadow-sm">
      <div className="flex items-start justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">{label}</span>
        {icon && <div className="text-primary">{icon}</div>}
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        {trend && trendValue &&
        <span
          className={`text-sm font-semibold mb-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </span>
        }
      </div>
    </div>);

}