import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppHeader } from '../../../components/shared/AppHeader';
import { Button } from '../../../components/shared/Button';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

export function AvailabilityCalendar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedDates, setSelectedDates] = useState<number[]>([15, 16, 17]);
  
  // Get machine details from state or use defaults
  const machine = location.state?.machine;
  const equipmentId = machine?.id || 1;
  const price = machine?.price_per_day || 1200;
  const name = machine?.name || "Mahindra 575 DI";
  const image = machine?.images?.[0] || "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=200";

  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const dates = Array.from(
    {
      length: 31
    },
    (_, i) => i + 1
  );
  const bookedDates = [5, 6, 7, 22, 23];
  const partialDates = [8, 21];

  const toggleDate = (date: number) => {
    if (bookedDates.includes(date)) return;
    if (selectedDates.includes(date)) {
      setSelectedDates(selectedDates.filter((d) => d !== date));
    } else {
      setSelectedDates([...selectedDates, date].sort((a, b) => a - b));
    }
  };

  const handleContinue = () => {
    // For demo, we assume the month is October 2023
    const year = 2023;
    const month = 10;
    
    // Sort selected dates to find start and end
    const sorted = [...selectedDates].sort((a, b) => a - b);
    const startDay = sorted[0];
    const endDay = sorted[sorted.length - 1];
    
    const startDate = `${year}-${String(month).padStart(2, '0')}-${String(startDay).padStart(2, '0')}`;
    const endDate = `${year}-${String(month).padStart(2, '0')}-${String(endDay).padStart(2, '0')}`;

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
          <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center">
            <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-lg font-bold text-gray-900">October 2023</h2>
          <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center">
            <ChevronRightIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="bg-surface rounded-3xl p-4 shadow-sm border border-gray-100 mb-6">
          <div className="grid grid-cols-7 gap-2 mb-4">
            {days.map((day) =>
            <div
              key={day}
              className="text-center text-sm font-semibold text-gray-500">
              
                {day}
              </div>
            )}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {/* Empty slots for offset */}
            <div />
            <div />
            <div />

            {dates.map((date) => {
              const isBooked = bookedDates.includes(date);
              const isPartial = partialDates.includes(date);
              const isSelected = selectedDates.includes(date);
              let bgClass = 'bg-gray-50 hover:bg-gray-100 text-gray-900';
              if (isBooked)
              bgClass = 'bg-gray-100 text-gray-400 cursor-not-allowed';
              if (isPartial)
              bgClass = 'bg-amber-50 text-amber-700 border border-amber-200';
              if (isSelected) bgClass = 'bg-primary text-white shadow-md';
              return (
                <button
                  key={date}
                  onClick={() => toggleDate(date)}
                  disabled={isBooked}
                  className={`aspect-square rounded-full flex items-center justify-center text-sm font-semibold transition-all ${bgClass}`}>
                  
                  {date}
                </button>);

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
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-100 border border-amber-200" />
            <span className="text-sm text-gray-600">Partial</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-200" />
            <span className="text-sm text-gray-600">Booked</span>
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
    </div>);
}