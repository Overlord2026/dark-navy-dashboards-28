import { useMemo } from 'react';
import { useUser } from '@/context/UserContext';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';
import type { FamilyPlanKey, AdvisorPlanKey } from '@/config/tiers';

export type PlanKey = FamilyPlanKey | AdvisorPlanKey;

export interface UserSubscriptionState {
  currentPlanKey: PlanKey | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userRole: 'family' | 'advisor' | null;
  canUpgradeTo: (targetPlan: PlanKey) => boolean;
  isCurrentPlan: (planKey: PlanKey) => boolean;
}

export function useUserSubscription(): UserSubscriptionState {
  const { userProfile, isAuthenticated, isLoading } = useUser();
  const subscriptionAccess = useSubscriptionAccess();

  return useMemo(() => {
    // If not authenticated, no current plan
    if (!isAuthenticated || !userProfile) {
      return {
        currentPlanKey: null,
        isAuthenticated: false,
        isLoading,
        userRole: null,
        canUpgradeTo: () => false,
        isCurrentPlan: () => false,
      };
    }

    // Determine user role and current plan key
    const userRole = userProfile.role === 'advisor' ? 'advisor' : 'family';
    
    // Map client_tier to plan keys
    let currentPlanKey: PlanKey | null = null;
    
    if (userRole === 'advisor') {
      // For advisors, default to basic advisor plan or use subscription access
      currentPlanKey = 'advisor_basic' as AdvisorPlanKey;
      
      // Check subscription access for more accurate plan
      if (subscriptionAccess?.subscriptionPlan?.tier) {
        const tier = subscriptionAccess.subscriptionPlan.tier;
        if (tier === 'premium') {
          currentPlanKey = 'advisor_premium' as AdvisorPlanKey;
        }
      }
    } else {
      // For families, map client_tier to family plan keys
      switch (userProfile.client_tier) {
        case 'basic':
          currentPlanKey = 'free' as FamilyPlanKey;
          break;
        case 'premium':
          currentPlanKey = 'premium' as FamilyPlanKey;
          break;
        default:
          currentPlanKey = 'free' as FamilyPlanKey;
      }
    }

    // Plan hierarchy for upgrade validation
    const familyPlanHierarchy = ['free', 'premium', 'pro'] as const;
    const advisorPlanHierarchy = ['advisor_basic', 'advisor_premium'] as const;

    const canUpgradeTo = (targetPlan: PlanKey): boolean => {
      if (!currentPlanKey) return true;
      
      // Can't "upgrade" to the same plan
      if (currentPlanKey === targetPlan) return false;
      
      // Check if target plan is for the correct user type
      const targetPlanType = familyPlanHierarchy.includes(targetPlan as any) ? 'family' : 'advisor';
      if (targetPlanType !== userRole) return false;
      
      // Check upgrade path
      if (userRole === 'family') {
        const currentIndex = familyPlanHierarchy.indexOf(currentPlanKey as any);
        const targetIndex = familyPlanHierarchy.indexOf(targetPlan as any);
        return targetIndex > currentIndex;
      } else {
        const currentIndex = advisorPlanHierarchy.indexOf(currentPlanKey as any);
        const targetIndex = advisorPlanHierarchy.indexOf(targetPlan as any);
        return targetIndex > currentIndex;
      }
    };

    const isCurrentPlan = (planKey: PlanKey): boolean => {
      return currentPlanKey === planKey;
    };

    return {
      currentPlanKey,
      isAuthenticated,
      isLoading,
      userRole,
      canUpgradeTo,
      isCurrentPlan,
    };
  }, [userProfile, isAuthenticated, isLoading, subscriptionAccess]);
}