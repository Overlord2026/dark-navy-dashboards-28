
import React, { createContext, useContext, useState } from 'react';

interface Professional {
  id: string;
  name: string;
  type: string;
  specialties?: string[];
  location?: string;
}

interface ProfessionalsContextType {
  professionals: Professional[];
  setProfessionals: (professionals: Professional[]) => void;
  loading: boolean;
  error: Error | null;
}

const ProfessionalsContext = createContext<ProfessionalsContextType | undefined>(undefined);

export function ProfessionalsProvider({ children }: { children: React.ReactNode }) {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  return (
    <ProfessionalsContext.Provider 
      value={{ 
        professionals, 
        setProfessionals, 
        loading, 
        error 
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
