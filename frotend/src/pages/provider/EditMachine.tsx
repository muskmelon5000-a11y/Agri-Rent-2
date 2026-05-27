import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppHeader } from '../../components/shared/AppHeader';
import { Button } from '../../components/shared/Button';
import { Input } from '../../components/shared/Input';
import { Card } from '../../components/shared/Card';
import { TrashIcon, Loader2Icon } from 'lucide-react';
import { equipmentService, Equipment } from '../../services/equipmentService';
export function EditMachine() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [machine, setMachine] = useState<Equipment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function load() {
      if (!id) return;
      try {
        const data = await equipmentService.getById(Number(id));
        setMachine(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [id]);

  const handleSave = async () => {
    if (!machine || !id) return;
    try {
      setIsSaving(true);
      await equipmentService.update(Number(id), {
        name: machine.name,
        brand: machine.brand,
        year: machine.year,
        hp: machine.hp,
        price_per_day: machine.price_per_day,
        price_per_hour: machine.price_per_hour
      });
      navigate('/provider/equipment');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (window.confirm("Are you sure you want to delete this equipment?")) {
      try {
        await equipmentService.delete(Number(id));
        navigate('/provider/equipment');
      } catch (e) {
        console.error(e);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="h-full bg-background flex flex-col items-center justify-center">
        <Loader2Icon className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!machine) return null;

  return (
    <div className="h-full bg-background flex flex-col">
      <AppHeader title="Edit Equipment" showBack />

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        <Card className="p-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Basic Details
          </h2>
          <div className="space-y-4">
            <Input 
              label="Equipment Name" 
              value={machine.name} 
              onChange={e => setMachine({...machine, name: e.target.value})} 
            />
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Brand" 
                value={machine.brand || ''} 
                onChange={e => setMachine({...machine, brand: e.target.value})} 
              />
              <Input 
                label="Model Year" 
                type="number" 
                value={machine.year || ''} 
                onChange={e => setMachine({...machine, year: Number(e.target.value) || undefined})} 
              />
            </div>
            <Input 
              label="Horsepower (HP)" 
              type="number" 
              value={machine.hp || ''} 
              onChange={e => setMachine({...machine, hp: Number(e.target.value) || undefined})} 
            />
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Pricing</h2>
          <div className="space-y-4">
            <Input
              label="Daily Rate (₹)"
              type="number"
              value={machine.price_per_day}
              onChange={e => setMachine({...machine, price_per_day: Number(e.target.value) || 0})}
              icon={<span className="text-gray-500 font-bold">₹</span>} />
            
            <Input
              label="Hourly Rate (₹)"
              type="number"
              value={machine.price_per_hour || ''}
              onChange={e => setMachine({...machine, price_per_hour: Number(e.target.value) || undefined})}
              icon={<span className="text-gray-500 font-bold">₹</span>} />
            
          </div>
        </Card>

        <Button
          variant="outline"
          fullWidth
          onClick={handleDelete}
          className="text-red-600 border-red-200 hover:bg-red-50">
          
          <TrashIcon className="w-5 h-5 mr-2" />
          Delete Equipment
        </Button>
      </div>

      <div className="p-6 bg-surface border-t border-gray-200 space-y-3">
        <Button
          fullWidth
          size="lg"
          disabled={isSaving}
          onClick={handleSave}>
          
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>);

}