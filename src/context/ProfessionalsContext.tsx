
import React, { createContext, useContext } from "react";
import { Professional } from "@/types/professional";
import { useSupabaseProfessionals } from "@/hooks/useSupabaseProfessionals";

// Create context
type ProfessionalsContextType = {
  professionals: Professional[];
  loading: boolean;
  saving: boolean;
  addProfessional: (professional: Omit<Professional, 'id'>) => Promise<any>;
  updateProfessional: (professional: Professional) => Promise<any>;
  removeProfessional: (id: string) => Promise<void>;
  refreshProfessionals: () => Promise<void>;
};

const ProfessionalsContext = createContext<ProfessionalsContextType | undefined>(undefined);

// Provider component
export const ProfessionalsProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    professionals,
    loading,
    saving,
    addProfessional,
    updateProfessional,
    removeProfessional,
    refreshProfessionals
  } = useSupabaseProfessionals();

  return (
    <ProfessionalsContext.Provider value={{ 
      professionals,
      loading,
      saving,
      addProfessional, 
      updateProfessional, 
      removeProfessional,
      refreshProfessionals
    }}>
      {children}
    </ProfessionalsContext.Provider>
  );
};

// Hook for using the professionals context
export const useProfessionals = () => {
  const context = useContext(ProfessionalsContext);
  if (context === undefined) {
    throw new Error("useProfessionals must be used within a ProfessionalsProvider");
  }
  return context;
};
