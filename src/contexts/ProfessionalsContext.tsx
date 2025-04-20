
import React, { createContext, useContext, useState } from 'react';
import { Professional, ProfessionalType } from '@/types/professional';

interface ProfessionalsContextType {
  professionals: Professional[];
  addProfessional: (professional: Professional) => void;
}

const ProfessionalsContext = createContext<ProfessionalsContextType | undefined>(undefined);

export function ProfessionalsProvider({ children }: { children: React.ReactNode }) {
  const [professionals, setProfessionals] = useState<Professional[]>([]);

  const addProfessional = (professional: Professional) => {
    setProfessionals(prev => [...prev, professional]);
  };

  return (
    <ProfessionalsContext.Provider value={{ professionals, addProfessional }}>
      {children}
    </ProfessionalsContext.Provider>
  );
}

export function useProfessionals() {
  const context = useContext(ProfessionalsContext);
  if (context === undefined) {
    throw new Error('useProfessionals must be used within a ProfessionalsProvider');
  }
  return context;
}
