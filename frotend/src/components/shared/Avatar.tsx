import React from 'react';
import { UserIcon } from 'lucide-react';
interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  verified?: boolean;
}
export function Avatar({
  src,
  name,
  size = 'md',
  verified = false
}: AvatarProps) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-24 h-24 text-2xl'
  };
  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name.
    split(' ').
    map((n) => n[0]).
    join('').
    toUpperCase().
    slice(0, 2);
  };
  return (
    <div className="relative inline-block">
      <div
        className={`${sizes[size]} rounded-full overflow-hidden bg-primary-100 flex items-center justify-center font-semibold text-primary`}>
        
        {src ?
        <img src={src} alt={name} className="w-full h-full object-cover" /> :
        name ?
        <span>{getInitials(name)}</span> :

        <UserIcon className="w-1/2 h-1/2" />
        }
      </div>
      {verified &&
      <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-secondary rounded-full border-2 border-surface flex items-center justify-center">
          <svg
          className="w-3 h-3 text-white"
          fill="currentColor"
          viewBox="0 0 20 20">
          
            <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd" />
          
          </svg>
        </div>
      }
    </div>);

}