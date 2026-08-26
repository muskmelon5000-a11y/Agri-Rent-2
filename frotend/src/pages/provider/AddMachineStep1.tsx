import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../../components/shared/AppHeader';
import { Button } from '../../components/shared/Button';
import { Input } from '../../components/shared/Input';
export function AddMachineStep1() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: 'tractor',
    name: '',
    brand: '',
    year: '2022',
    hp: '',
    fuel_type: 'Diesel',
    drive_type: '4WD',
    tank_capacity: '40',
    coverage: '2.5',
    has_operator: 'yes',
    crop_type: 'Multicrop',
    working_width: '7ft',
    attachments: [] as string[],
    description: ''
  });

  const availableAttachments = ["Plough", "Rotavator", "Cultivator", "Seed Drill", "Trailer", "Harrow"];

  const toggleAttachment = (att: string) => {
    setFormData(prev => {
      const exists = prev.attachments.includes(att);
      const newAtts = exists ? prev.attachments.filter(a => a !== att) : [...prev.attachments, att];
      return { ...prev, attachments: newAtts };
    });
  };

  const handleNext = () => {
    navigate('/provider/add-machine/2', { state: { equipmentData: formData } });
  };

  return (
    <div className="h-full bg-background flex flex-col">
      <AppHeader title="Add Equipment" showBack />

      {/* Stepper */}
      <div className="bg-surface px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-primary">Step 1 of 4</span>
          <span className="text-sm font-medium text-gray-500">
            Basic Details ({formData.type.toUpperCase()})
          </span>
        </div>
        <div className="flex gap-2">
          <div className="h-2 flex-1 bg-primary rounded-full" />
          <div className="h-2 flex-1 bg-gray-200 rounded-full" />
          <div className="h-2 flex-1 bg-gray-200 rounded-full" />
          <div className="h-2 flex-1 bg-gray-200 rounded-full" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
        {/* Category Select */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Select Equipment Category
          </label>
          <select 
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
            className="w-full h-12 px-4 border-2 border-emerald-600 rounded-2xl font-bold focus:border-primary focus:outline-none bg-emerald-50 text-emerald-900"
          >
            <option value="tractor">🚜 Tractor</option>
            <option value="drone">🛸 Agricultural Drone</option>
            <option value="harvester">🌾 Combine Harvester</option>
            <option value="implement">🛠️ Tool / Implement (Rotavator, Seed Drill, etc.)</option>
          </select>
        </div>

        {/* Equipment Name */}
        <Input 
          label="Equipment Name" 
          placeholder={
            formData.type === 'tractor' ? 'e.g. Mahindra 575 DI' :
            formData.type === 'drone' ? 'e.g. DJI Agras T40' :
            formData.type === 'harvester' ? 'e.g. Claas Crop Tiger 30' :
            'e.g. Shaktiman 7ft Rotavator'
          }
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="Brand / Make" 
            placeholder={
              formData.type === 'tractor' ? 'e.g. Mahindra' :
              formData.type === 'drone' ? 'e.g. DJI' :
              formData.type === 'harvester' ? 'e.g. Claas' :
              'e.g. Shaktiman'
            }
            value={formData.brand}
            onChange={(e) => setFormData({...formData, brand: e.target.value})}
          />
          <Input 
            label="Model Year" 
            type="number" 
            placeholder="e.g. 2022" 
            value={formData.year}
            onChange={(e) => setFormData({...formData, year: e.target.value})}
          />
        </div>

        {/* Dynamic Category Specific Fields */}
        {formData.type === 'tractor' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Horsepower (HP)" 
                type="number" 
                placeholder="e.g. 47" 
                value={formData.hp}
                onChange={(e) => setFormData({...formData, hp: e.target.value})}
              />
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Drive Type</label>
                <select 
                  value={formData.drive_type}
                  onChange={(e) => setFormData({...formData, drive_type: e.target.value})}
                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-2xl font-semibold bg-white"
                >
                  <option value="2WD">2WD (2-Wheel Drive)</option>
                  <option value="4WD">4WD (4-Wheel Drive)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Available Attachments Included
              </label>
              <div className="flex flex-wrap gap-2">
                {availableAttachments.map(att => {
                  const isChecked = formData.attachments.includes(att);
                  return (
                    <button
                      key={att}
                      type="button"
                      onClick={() => toggleAttachment(att)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                        isChecked ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-surface text-gray-700 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {isChecked ? `✓ ${att}` : `+ ${att}`}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {formData.type === 'drone' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Tank Capacity (Liters)" 
                type="number" 
                placeholder="e.g. 40" 
                value={formData.tank_capacity}
                onChange={(e) => setFormData({...formData, tank_capacity: e.target.value})}
              />
              <Input 
                label="Coverage per Battery (Acres)" 
                placeholder="e.g. 2.5" 
                value={formData.coverage}
                onChange={(e) => setFormData({...formData, coverage: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Certified Pilot Included?</label>
              <select 
                value={formData.has_operator}
                onChange={(e) => setFormData({...formData, has_operator: e.target.value})}
                className="w-full h-12 px-4 border-2 border-gray-200 rounded-2xl font-semibold bg-white"
              >
                <option value="yes">Yes, Operator / Pilot included</option>
                <option value="no">No, Drone hardware only</option>
              </select>
            </div>
          </>
        )}

        {formData.type === 'harvester' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Engine Power (HP)" 
                type="number" 
                placeholder="e.g. 75" 
                value={formData.hp}
                onChange={(e) => setFormData({...formData, hp: e.target.value})}
              />
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Crop Compatibility</label>
                <select 
                  value={formData.crop_type}
                  onChange={(e) => setFormData({...formData, crop_type: e.target.value})}
                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-2xl font-semibold bg-white"
                >
                  <option value="Multicrop">Multicrop (Wheat, Rice, Maize)</option>
                  <option value="Paddy/Rice">Paddy / Rice Special</option>
                  <option value="Wheat">Wheat Special</option>
                  <option value="Sugarcane">Sugarcane Special</option>
                </select>
              </div>
            </div>
          </>
        )}

        {formData.type === 'implement' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Size / Width (e.g. 7ft, 8-row)" 
                placeholder="e.g. 7ft" 
                value={formData.working_width}
                onChange={(e) => setFormData({...formData, working_width: e.target.value})}
              />
              <Input 
                label="Required Tractor HP" 
                type="number" 
                placeholder="e.g. 35" 
                value={formData.hp}
                onChange={(e) => setFormData({...formData, hp: e.target.value})}
              />
            </div>
          </>
        )}

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Description & Features
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-primary focus:outline-none resize-none h-28"
            placeholder="Describe condition, working capabilities, and specific instructions for farmers..." />
        </div>
      </div>

      <div className="p-6 bg-surface border-t border-gray-200">
        <Button
          fullWidth
          size="lg"
          disabled={!formData.name}
          onClick={handleNext}>
          
          Next Step
        </Button>
      </div>
    </div>);

}