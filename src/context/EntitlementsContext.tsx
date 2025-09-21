import { createContext, useContext, ReactNode } from 'react';
import { useSubscriptionAccess, type SubscriptionAccess } from '@/hooks/useSubscriptionAccess';

const EntitlementsContext = createContext<SubscriptionAccess | undefined>(undefined);

export function EntitlementsProvider({ children }: { children: ReactNode }) {
  const value = useSubscriptionAccess(); // hooks run here, inside component
  return <EntitlementsContext.Provider value={value}>{children}</EntitlementsContext.Provider>;
}

export function useEntitlements() {
  const ctx = useContext(EntitlementsContext);
  if (!ctx) throw new Error('useEntitlements must be used within EntitlementsProvider');
  return ctx;
}