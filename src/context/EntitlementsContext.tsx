import React, { createContext, useContext, useMemo } from "react";
import { useAuth } from "./AuthContext";
import { Plan } from "@/types/pricing";

type Entitlements = {
  roles: string[];
  features: Record<string, boolean>;
  has: (key: string) => boolean;
  plan: Plan;
  persona?: string;
  segment?: string;
  quota: (key: string) => number | 'unlimited' | null;
  remainingQuota: (key: string) => number | 'unlimited' | null;
};

const EntitlementsContext = createContext<Entitlements | undefined>(undefined);

export function EntitlementsProvider({ children }: { children: React.ReactNode }) {
  // Hook MUST be called inside the component (not at module top-level)
  const { session } = useAuth();

  const value = useMemo<Entitlements>(() => {
    const meta: any = session?.user?.app_metadata ?? {};
    const roles = Array.isArray(meta.roles) ? (meta.roles as string[]) : [];
    const features = (meta.features ?? {}) as Record<string, boolean>;
    
    return { 
      roles, 
      features,
      has: (key: string) => features[key] || false,
      plan: (meta.plan || 'basic') as Plan,
      persona: meta.persona,
      segment: meta.segment,
      quota: (key: string) => null,
      remainingQuota: (key: string) => null
    };
  }, [session?.user?.id, session?.user?.app_metadata]);

  return (
    <EntitlementsContext.Provider value={value}>
      {children}
    </EntitlementsContext.Provider>
  );
}

export function useEntitlements() {
  const ctx = useContext(EntitlementsContext);
  if (!ctx) throw new Error("useEntitlements must be used within <EntitlementsProvider>");
  return ctx;
}