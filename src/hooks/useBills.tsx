
import React, { createContext, useContext, ReactNode } from 'react';
import { Bill, BillCategory, BillOptimizationInsight } from '@/types/bill';
import { useBillsManagement, BillsManagementHook } from './useBillsManagement';
import { useInsightsManagement, InsightsManagementHook } from './useInsightsManagement';

interface BillsContextProps extends BillsManagementHook, InsightsManagementHook {
  // Combined interface from both hooks
}

const BillsContext = createContext<BillsContextProps | undefined>(undefined);

export function BillsProvider({ children }: { children: ReactNode }) {
  const billsManagement = useBillsManagement();
  const insightsManagement = useInsightsManagement(billsManagement.bills);

  // Combine both hooks into a single context
  const value: BillsContextProps = {
    ...billsManagement,
    ...insightsManagement,
  };

  return (
    <BillsContext.Provider value={value}>
      {children}
    </BillsContext.Provider>
  );
}

export const useBills = () => {
  const context = useContext(BillsContext);
  if (context === undefined) {
    throw new Error('useBills must be used within a BillsProvider');
  }
  return context;
};
