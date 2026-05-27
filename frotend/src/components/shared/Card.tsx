import React from 'react';
interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}
export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      className={`bg-surface rounded-2xl shadow-sm border border-gray-100 ${onClick ? 'cursor-pointer hover:shadow-md active:scale-[0.98] transition-all' : ''} ${className}`}
      onClick={onClick}>
      
      {children}
    </div>);

}