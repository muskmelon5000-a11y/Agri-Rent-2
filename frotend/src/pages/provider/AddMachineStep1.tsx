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
    year: '',
    hp: '',
    description: ''
  });

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
            Basic Details
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
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Category
          </label>
          <select 
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
            className="w-full h-12 px-4 border-2 border-gray-200 rounded-2xl font-semibold focus:border-primary focus:outline-none bg-white">
            <option value="tractor">Tractor</option>
            <option value="harvester">Harvester</option>
            <option value="implement">Implement / Tool</option>
            <option value="drone">Drone</option>
          </select>
        </div>

        <Input 
          label="Equipment Name" 
          placeholder="e.g. Mahindra 575 DI" 
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="Brand" 
            placeholder="e.g. Mahindra" 
            value={formData.brand}
            onChange={(e) => setFormData({...formData, brand: e.target.value})}
          />
          <Input 
            label="Model Year" 
            type="number" 
            placeholder="e.g. 2019" 
            value={formData.year}
            onChange={(e) => setFormData({...formData, year: e.target.value})}
          />
        </div>

        <Input 
          label="Horsepower (HP)" 
          type="number" 
          placeholder="e.g. 47" 
          value={formData.hp}
          onChange={(e) => setFormData({...formData, hp: e.target.value})}
        />

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-primary focus:outline-none resize-none h-32"
            placeholder="Describe the condition, features, and any specific rules for renters..." />
          
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