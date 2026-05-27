import React from 'react';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}
export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles =
  'font-semibold rounded-2xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2';
  const variants = {
    primary:
    'bg-primary text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm',
    secondary:
    'bg-secondary text-white hover:bg-secondary-600 active:bg-secondary-700 shadow-sm',
    outline:
    'border-2 border-primary text-primary hover:bg-primary-50 active:bg-primary-100',
    ghost: 'text-primary hover:bg-primary-50 active:bg-primary-100'
  };
  const sizes = {
    sm: 'h-10 px-4 text-sm',
    md: 'h-12 px-6 text-base',
    lg: 'h-14 px-8 text-lg'
  };
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}>
      
      {children}
    </button>);

}