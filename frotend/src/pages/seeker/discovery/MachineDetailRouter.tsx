import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { equipmentService, Equipment } from '../../../services/equipmentService';
import { MachineDetailTractor } from './MachineDetailTractor';
import { MachineDetailDrone } from './MachineDetailDrone';
import { MachineDetailTools } from './MachineDetailTools';
import { Loader2Icon } from 'lucide-react';

export function MachineDetailRouter() {
  const { id } = useParams();
  const [machine, setMachine] = useState<Equipment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMachine() {
      if (!id) return;
      try {
        const data = await equipmentService.getById(Number(id));
        setMachine(data);
      } catch (error) {
        console.error("Failed to load machine details:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMachine();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-full bg-background flex flex-col items-center justify-center pb-20">
        <Loader2Icon className="w-8 h-8 text-primary animate-spin mb-2" />
        <p className="text-gray-500">Loading details...</p>
      </div>
    );
  }

  if (!machine) {
    return <div className="min-h-full bg-background pb-20 flex items-center justify-center">Machine not found.</div>;
  }

  if (machine.type === 'drone') {
    return <MachineDetailDrone initialMachine={machine} />;
  }
  if (machine.type === 'tool' || machine.type === 'implement') {
    return <MachineDetailTools initialMachine={machine} />;
  }
  
  return <MachineDetailTractor initialMachine={machine} />;
}
