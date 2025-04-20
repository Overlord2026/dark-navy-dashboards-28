import React, { createContext, useContext, useState } from 'react';

interface FinancialPlanContextType {
  planDetails: any; // Replace 'any' with a more specific type
  updatePlanDetails: (details: any) => void; // Replace 'any' with a more specific type
}

const FinancialPlanContext = createContext<FinancialPlanContextType | undefined>(undefined);

export function FinancialPlanProvider({ children }: { children: React.ReactNode }) {
  const [planDetails, setPlanDetails] = useState({});

  const updatePlanDetails = (details: any) => { // Replace 'any' with a more specific type
    setPlanDetails(details);
  };

  return (
    <FinancialPlanContext.Provider value={{ planDetails, updatePlanDetails }}>
      {children}
    </FinancialPlanContext.Provider>
  );
}

export function useFinancialPlan() {
  const context = useContext(FinancialPlanContext);
  if (context === undefined) {
    throw new Error('useFinancialPlan must be used within a FinancialPlanProvider');
  }
  return context;
}
