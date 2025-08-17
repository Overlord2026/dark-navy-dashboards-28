import { useState, useEffect } from 'react';
import { nilEntitlements, agentFeatures, athleteSegments, AgentFeature } from '@/data/nilEntitlements';
import { SubscriptionTier } from '@/data/familiesPricingTiers';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';

export interface NILAccess {
  currentTier: SubscriptionTier;
  athleteEducation: {
    availableModules: number;
    availableResources: number;
    hasAITutor: boolean;
    hasPersonalCoach: boolean;
  };
  agentTools: {
    clientLimit: number;
    hasComplianceAlerts: boolean;
    hasAdvancedReporting: boolean;
    hasWhiteLabel: boolean;
  };
  disclosureManagement: {
    templatesLimit: number;
    hasAutomatedFiling: boolean;
    hasAIReview: boolean;
    hasLegalReview: boolean;
  };
  hasFeatureAccess: (feature: AgentFeature) => boolean;
  getFeatureQuota: (featureId: string) => number | null;
}

export function useNILAccess(): NILAccess {
  const { subscriptionPlan, isLoading } = useSubscriptionAccess();
  const [currentTier, setCurrentTier] = useState<SubscriptionTier>('basic');

  useEffect(() => {
    if (!isLoading && subscriptionPlan) {
      const tier = subscriptionPlan.subscription_tier || 'basic';
      if (tier === 'free') {
        setCurrentTier('basic');
      } else if (['basic', 'premium', 'elite'].includes(tier)) {
        setCurrentTier(tier as SubscriptionTier);
      } else {
        setCurrentTier('basic');
      }
    }
  }, [subscriptionPlan, isLoading]);

  const tierHierarchy: Record<SubscriptionTier, number> = {
    basic: 1,
    premium: 2,
    elite: 3
  };

  const hasFeatureAccess = (feature: AgentFeature): boolean => {
    return tierHierarchy[currentTier] >= tierHierarchy[feature.requiredTier];
  };

  const getFeatureQuota = (featureId: string): number | null => {
    const feature = agentFeatures.find(f => f.id === featureId);
    if (!feature?.quotas) return null;
    
    return feature.quotas[currentTier] || null;
  };

  const athleteEducation = nilEntitlements.athleteEducation[currentTier];
  const agentTools = nilEntitlements.agentTools[currentTier];
  const disclosureManagement = nilEntitlements.disclosureManagement[currentTier];

  return {
    currentTier,
    athleteEducation: {
      availableModules: athleteEducation.modules,
      availableResources: athleteEducation.resources,
      hasAITutor: 'aiTutor' in athleteEducation ? athleteEducation.aiTutor : false,
      hasPersonalCoach: 'personalCoach' in athleteEducation ? athleteEducation.personalCoach : false
    },
    agentTools: {
      clientLimit: agentTools.clientLimit,
      hasComplianceAlerts: agentTools.complianceAlerts,
      hasAdvancedReporting: 'advancedReporting' in agentTools ? agentTools.advancedReporting : false,
      hasWhiteLabel: 'whiteLabel' in agentTools ? agentTools.whiteLabel : false
    },
    disclosureManagement: {
      templatesLimit: disclosureManagement.templatesLimit,
      hasAutomatedFiling: disclosureManagement.automatedFiling,
      hasAIReview: 'aiReview' in disclosureManagement ? disclosureManagement.aiReview : false,
      hasLegalReview: 'legalReview' in disclosureManagement ? disclosureManagement.legalReview : false
    },
    hasFeatureAccess,
    getFeatureQuota
  };
}