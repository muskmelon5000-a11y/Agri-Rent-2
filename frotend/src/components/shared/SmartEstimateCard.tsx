import React from 'react';
import { SparklesIcon } from 'lucide-react';
interface SmartEstimateCardProps {
  title: string;
  children: ReactNode;
  variant?: 'lime' | 'amber';
}
export function SmartEstimateCard({
  title,
  children,
  variant = 'lime'
}: SmartEstimateCardProps) {
  const bgColor = variant === 'lime' ? 'bg-secondary-50' : 'bg-amber-50';
  const borderColor =
  variant === 'lime' ? 'border-secondary-200' : 'border-amber-200';
  return (
    <div className={`${bgColor} border ${borderColor} rounded-2xl p-4`}>
      <div className="flex items-center gap-2 mb-3">
        <SparklesIcon className="w-5 h-5 text-primary" />
        <span className="text-sm font-semibold text-primary">
          Smart Estimate
        </span>
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-3">{title}</h3>
      {children}
    </div>);

}