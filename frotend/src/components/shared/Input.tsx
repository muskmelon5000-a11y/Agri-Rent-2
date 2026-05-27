import React from 'react';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}
export function Input({
  label,
  error,
  icon,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label &&
      <label className="block text-sm font-semibold text-gray-900 mb-2">
          {label}
        </label>
      }
      <div className="relative">
        {icon &&
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
            {icon}
          </div>
        }
        <input
          className={`w-full h-12 px-4 ${icon ? 'pl-12' : ''} text-base border-2 border-gray-200 rounded-2xl focus:border-primary focus:outline-none transition-colors ${error ? 'border-red-500' : ''} ${className}`}
          {...props} />
        
      </div>
      {error &&
      <p className="text-sm text-red-600 mt-1 font-medium">{error}</p>
      }
    </div>);

}