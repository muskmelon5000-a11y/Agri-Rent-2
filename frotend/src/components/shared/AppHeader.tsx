import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, MoreVerticalIcon } from 'lucide-react';
interface AppHeaderProps {
  title: string;
  showBack?: boolean;
  action?: React.ReactNode;
  onBack?: () => void;
}
export function AppHeader({
  title,
  showBack = false,
  action,
  onBack
}: AppHeaderProps) {
  const navigate = useNavigate();
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };
  return (
    <div className="bg-surface border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3 flex-1">
        {showBack &&
        <button
          onClick={handleBack}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors">
          
            <ArrowLeftIcon className="w-5 h-5 text-gray-900" />
          </button>
        }
        <h1 className="text-lg font-semibold text-gray-900 truncate">
          {title}
        </h1>
      </div>
      {action && <div className="ml-2">{action}</div>}
    </div>);

}