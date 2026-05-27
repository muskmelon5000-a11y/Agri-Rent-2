import React, { useState } from 'react';
import { AppHeader } from '../../components/shared/AppHeader';
import { Card } from '../../components/shared/Card';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  TractorIcon,
  PlaneIcon } from
'lucide-react';
const faqs = [
{
  category: 'Tractors',
  icon: TractorIcon,
  items: [
  {
    q: 'What should I check before starting the tractor?',
    a: 'Always check engine oil, coolant levels, tire pressure, and ensure all guards and shields are in place before starting.'
  },
  {
    q: 'How do I attach a rotavator safely?',
    a: 'Ensure the tractor is turned off and PTO is disengaged. Align the 3-point linkage, attach the lower links first, then the top link. Finally, connect the PTO shaft ensuring the safety guard is intact.'
  }]

},
{
  category: 'Drones',
  icon: PlaneIcon,
  items: [
  {
    q: 'What weather conditions are safe for drone spraying?',
    a: 'Do not operate in winds exceeding 15 km/h, during rain, or when thunderstorms are nearby. Ideal conditions are early morning or late evening.'
  },
  {
    q: 'How do I clean the drone tank after use?',
    a: 'Rinse the tank thoroughly with clean water at least 3 times. Spray the clean water through the nozzles to clear the lines. Never leave chemicals in the tank overnight.'
  }]

}];

export function FAQEquipment() {
  const [openItem, setOpenItem] = useState<string | null>('Tractors-0');
  const toggleItem = (id: string) => {
    setOpenItem(openItem === id ? null : id);
  };
  return (
    <div className="h-full bg-background flex flex-col">
      <AppHeader title="Equipment FAQs" showBack />

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
        {faqs.map((group) => {
          const Icon = group.icon;
          return (
            <div key={group.category}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary">
                  <Icon className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">
                  {group.category} Safety & Usage
                </h2>
              </div>

              <div className="space-y-3">
                {group.items.map((item, idx) => {
                  const id = `${group.category}-${idx}`;
                  const isOpen = openItem === id;
                  return (
                    <Card key={idx} className="overflow-hidden">
                      <button
                        onClick={() => toggleItem(id)}
                        className="w-full p-4 flex items-start justify-between text-left bg-surface">
                        
                        <span className="font-semibold text-gray-900 pr-4">
                          {item.q}
                        </span>
                        {isOpen ?
                        <ChevronUpIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" /> :

                        <ChevronDownIcon className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        }
                      </button>

                      {isOpen &&
                      <div className="p-4 pt-0 bg-surface border-t border-gray-100">
                          <p className="text-sm text-gray-700 leading-relaxed pt-3">
                            {item.a}
                          </p>
                          {idx === 1 && group.category === 'Tractors' &&
                        <div className="mt-4 h-32 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500 text-sm font-medium">
                              Diagram Placeholder
                            </div>
                        }
                        </div>
                      }
                    </Card>);

                })}
              </div>
            </div>);

        })}
      </div>
    </div>);

}