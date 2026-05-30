import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppHeader } from '../../../components/shared/AppHeader';
import { Button } from '../../../components/shared/Button';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

export function AvailabilityCalendar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Real date logic
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  
  // Get machine details from state or use defaults
  const machine = location.state?.machine;
  const equipmentId = machine?.id || 1;
  const price = machine?.price_per_day || 1200;
  const name = machine?.name || "Mahindra 575 DI";
  const image = machine?.images?.[0] || "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=200";

  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const isPastMonth = year < today.getFullYear() || (year === today.getFullYear() && month <= today.getMonth());

  // Convert date to YYYY-MM-DD
  const formatDate = (y: number, m: number, d: number) => {
    return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  };

  const toggleDate = (dateStr: string) => {
    if (selectedDates.includes(dateStr)) {
      setSelectedDates(selectedDates.filter((d) => d !== dateStr));
    } else {
      setSelectedDates([...selectedDates, dateStr].sort());
    }
  };

  const handleContinue = () => {
    if (selectedDates.length === 0) return;
    
    // Sort selected dates to find start and end
    const sorted = [...selectedDates].sort();
    const startDate = sorted[0];
    const endDate = sorted[sorted.length - 1];

    navigate('/seeker/request', {
      state: {
        machine,
        equipmentId,
        price,
        name,
        startDate,
        endDate,
        totalDays: selectedDates.length,
        image
      }
    });
  };

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="h-full bg-background flex flex-col">
      <AppHeader title="Select Dates" showBack />

      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Machine Info Mini */}
        <div className="flex items-center gap-4 mb-6 p-4 bg-surface rounded-2xl border border-gray-100">
          <img
            src={image}
            alt={name}
            className="w-16 h-16 object-cover rounded-xl" />
          
          <div>
            <h3 className="font-bold text-gray-900">{name}</h3>
            <p className="text-sm text-gray-600">₹{price} / day</p>
          </div>
        </div>

        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={prevMonth}
            disabled={isPastMonth}
            className={`w-10 h-10 rounded-full flex items-center justify-center ${isPastMonth ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100'}`}
          >
            <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-lg font-bold text-gray-900">{monthName}</h2>
          <button 
            onClick={nextMonth}
            className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
          >
            <ChevronRightIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 mb-6">
          <div className="grid grid-cols-7 gap-y-4 gap-x-1 mb-4">
            {days.map((day) =>
            <div
              key={day}
              className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                {day}
              </div>
            )}
          </div>

          <div className="grid grid-cols-7 gap-y-2 gap-x-1">
            {/* Empty slots for offset */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateObj = new Date(year, month, day);
              const dateStr = formatDate(year, month, day);
              
              const isPast = dateObj < today;
              const isSelected = selectedDates.includes(dateStr);
              
              let bgClass = 'bg-transparent hover:bg-gray-50 text-gray-700';
              if (isPast) {
                bgClass = 'bg-transparent text-gray-300 cursor-not-allowed opacity-50';
              } else if (isSelected) {
                bgClass = 'bg-primary text-white shadow-lg shadow-primary/30 font-bold scale-105';
              }

              return (
                <div key={day} className="flex justify-center">
                  <button
                    onClick={() => !isPast && toggleDate(dateStr)}
                    disabled={isPast}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-[15px] transition-all duration-200 ${bgClass}`}>
                    {day}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-50 border border-gray-200" />
            <span className="text-sm text-gray-600">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-sm text-gray-600">Selected</span>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="p-4 bg-surface border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-600 font-medium">
            {selectedDates.length} days selected
          </span>
          <span className="text-xl font-bold text-primary">
            ₹{selectedDates.length * price}
          </span>
        </div>
        <Button
          fullWidth
          size="lg"
          disabled={selectedDates.length === 0}
          onClick={handleContinue}>
          Continue to Request
        </Button>
      </div>
    </div>
  );
}