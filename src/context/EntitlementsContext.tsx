"use client";
import type { ReactNode } from "react";
import { createContext, useContext } from "react";

type Entitlements = {
  plan: string;
  persona?: string;
  segment?: string;
  hasPro: boolean;
  hasAdvisor: boolean;
  features: Record<string, boolean>;
  has: (key: string) => boolean;
  quota: (key: string) => number | 'unlimited' | null;
  remainingQuota: (key: string) => number | 'unlimited' | null;
};

const DEFAULT_ENTITLEMENTS: Entitlements = {
  plan: 'basic',
  persona: 'individual',
  segment: 'personal',
  hasPro: false,
  hasAdvisor: false,
  features: {},
  has: () => true,
  quota: () => 'unlimited',
  remainingQuota: () => 'unlimited'
};

const EntitlementsCtx = createContext<Entitlements>(DEFAULT_ENTITLEMENTS);

/** Use in components that read entitlements. Safe, no side effects. */
export function useEntitlements() {
  return useContext(EntitlementsCtx);
}

/** Demo-safe provider: no hooks, no effects, constant value. */
export function EntitlementsProvider({ children }: { children: ReactNode }) {
  return (
    <EntitlementsCtx.Provider value={DEFAULT_ENTITLEMENTS}>
      {children}
    </EntitlementsCtx.Provider>
  );
}