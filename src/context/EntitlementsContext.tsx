import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { 
  Plan, 
  FeatureKey, 
  UserEntitlements, 
  Entitlement, 
  PLAN_FEATURES, 
  FEATURE_QUOTAS 
} from '@/types/pricing';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';
import { TrialManager, TrialGrant } from '@/lib/trialManager';

interface EntitlementsContextType {
  entitlements: UserEntitlements | null;
  loading: boolean;
  has: (key: FeatureKey) => boolean;
  quota: (key: FeatureKey) => number | 'unlimited' | null;
  remainingQuota: (key: FeatureKey) => number | 'unlimited' | null;
  plan: Plan;
  persona?: string;
  segment?: string;
  activeTrial?: TrialGrant | null;
  daysRemainingInTrial?: number;
  loadEntitlements: () => Promise<void>;
}

const EntitlementsContext = createContext<EntitlementsContextType | undefined>(undefined);

export function useEntitlements() {
  const context = useContext(EntitlementsContext);
  if (context === undefined) {
    throw new Error('useEntitlements must be used within an EntitlementsProvider');
  }
  return context;
}

interface EntitlementsProviderProps {
  children: ReactNode;
}

export function EntitlementsProvider({ children }: EntitlementsProviderProps) {
  const { userProfile } = useAuth();
  const { subscriptionPlan } = useSubscriptionAccess();
  const [entitlements, setEntitlements] = useState<UserEntitlements | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTrial, setActiveTrial] = useState<TrialGrant | null>(null);
  const [daysRemainingInTrial, setDaysRemainingInTrial] = useState<number>();

  const loadEntitlements = async () => {
    if (!userProfile) {
      setEntitlements(null);
      setLoading(false);
      return;
    }

    try {
      // Get base plan from subscription system
      const basePlan: Plan = (subscriptionPlan?.subscription_tier || 'basic') as Plan;
      
      // Check for active trial
      const trial = await TrialManager.getActiveTrial(userProfile.id);
      setActiveTrial(trial);
      
      // Determine effective plan (trial plan overrides subscription plan if active)
      const effectivePlan = trial && !TrialManager.isTrialExpired(trial) ? trial.plan : basePlan;
      
      if (trial && !TrialManager.isTrialExpired(trial)) {
        setDaysRemainingInTrial(TrialManager.getDaysRemaining(trial));
      }
      
      // Check if we have cached entitlements
      const cacheKey = `entitlements_${userProfile.id}_${effectivePlan}`;
      const cached = localStorage.getItem(cacheKey);
      
      if (cached) {
        const cachedData = JSON.parse(cached);
        if (Date.now() - cachedData.timestamp < 300000) { // 5 min cache
          setEntitlements(cachedData.entitlements);
          setLoading(false);
          return;
        }
      }

      // Load from Supabase  
      const { data: userEntitlementsData } = await supabase
        .from('profiles')
        .select('subscription_tier, role')
        .eq('id', userProfile.id)
        .single();

      // Build entitlements based on effective plan
      const planFeatures = PLAN_FEATURES[effectivePlan] || [];
      const entitlementsMap: Record<FeatureKey, Entitlement> = {} as Record<FeatureKey, Entitlement>;

      // Create entitlements for all features
      Object.keys(PLAN_FEATURES).forEach(planKey => {
        PLAN_FEATURES[planKey as Plan].forEach(featureKey => {
          const hasAccess = planFeatures.includes(featureKey);
          const quota = FEATURE_QUOTAS[effectivePlan]?.[featureKey] || null;
          
          entitlementsMap[featureKey] = {
            featureKey,
            hasAccess,
            quota,
            usedQuota: 0, // TODO: Load from usage tracking
            remainingQuota: typeof quota === 'number' ? quota : quota === 'unlimited' ? 'unlimited' : 0
          };
        });
      });

      const userEntitlements: UserEntitlements = {
        plan: effectivePlan,
        persona: userEntitlementsData?.role || undefined,
        segment: 'basic',
        entitlements: entitlementsMap
      };

      // Cache the result
      localStorage.setItem(cacheKey, JSON.stringify({
        entitlements: userEntitlements,
        timestamp: Date.now()
      }));

      setEntitlements(userEntitlements);
    } catch (error) {
      console.error('Error loading entitlements:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntitlements();
  }, [userProfile, subscriptionPlan]);

  const has = (key: FeatureKey): boolean => {
    return entitlements?.entitlements[key]?.hasAccess || false;
  };

  const quota = (key: FeatureKey): number | 'unlimited' | null => {
    return entitlements?.entitlements[key]?.quota || null;
  };

  const remainingQuota = (key: FeatureKey): number | 'unlimited' | null => {
    const entitlement = entitlements?.entitlements[key];
    if (!entitlement) return null;
    
    if (entitlement.quota === 'unlimited') return 'unlimited';
    if (typeof entitlement.quota === 'number' && typeof entitlement.usedQuota === 'number') {
      return Math.max(0, entitlement.quota - entitlement.usedQuota);
    }
    
    return entitlement.remainingQuota || null;
  };

  const value: EntitlementsContextType = {
    entitlements,
    loading,
    has,
    quota,
    remainingQuota,
    plan: entitlements?.plan || 'basic',
    persona: entitlements?.persona,
    segment: entitlements?.segment,
    activeTrial,
    daysRemainingInTrial,
    loadEntitlements
  };

  return (
    <EntitlementsContext.Provider value={value}>
      {children}
    </EntitlementsContext.Provider>
  );
}