import React from 'react';
interface BadgeProps {
  children: ReactNode;
  variant?:
  'primary' |
  'secondary' |
  'success' |
  'warning' |
  'error' |
  'neutral';
  size?: 'sm' | 'md';
}
export function Badge({
  children,
  variant = 'primary',
  size = 'md'
}: BadgeProps) {
  const variants = {
    primary: 'bg-primary-50 text-primary border-primary-200',
    secondary: 'bg-secondary-50 text-secondary-700 border-secondary-200',
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    error: 'bg-red-50 text-red-700 border-red-200',
    neutral: 'bg-gray-100 text-gray-700 border-gray-200'
  };
  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1'
  };
  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full border ${variants[variant]} ${sizes[size]}`}>
      
      {children}
    </span>);

}