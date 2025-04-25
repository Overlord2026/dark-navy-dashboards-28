
import React, { createContext, useContext, useState } from 'react';
import { Professional } from '@/types/professional';

interface ProfessionalsContextType {
  professionals: Professional[];
  setProfessionals: (professionals: Professional[]) => void;
  loading: boolean;
  error: Error | null;
  addProfessional: (professional: Professional) => void;
  updateProfessional: (professional: Professional) => void;
  removeProfessional: (id: string) => void;
}

const ProfessionalsContext = createContext<ProfessionalsContextType | undefined>(undefined);

export function ProfessionalsProvider({ children }: { children: React.ReactNode }) {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addProfessional = (professional: Professional) => {
    setProfessionals(prev => [...prev, professional]);
  };

  const updateProfessional = (professional: Professional) => {
    setProfessionals(prev => 
      prev.map(p => p.id === professional.id ? professional : p)
    );
  };

  const removeProfessional = (id: string) => {
    setProfessionals(prev => prev.filter(p => p.id !== id));
  };

  return (
    <ProfessionalsContext.Provider 
      value={{ 
        professionals, 
        setProfessionals, 
        loading, 
        error,
        addProfessional,
        updateProfessional,
        removeProfessional
      }}
    >
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
