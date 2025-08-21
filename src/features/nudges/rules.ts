import { Persona, ComplexityTier, UserFacts } from '@/features/personalization/types';

export interface Nudge {
  id: string;
  title: string;
  description: string;
  type: 'action' | 'reminder' | 'opportunity';
  priority: 'low' | 'medium' | 'high';
  persona?: Persona;
  advancedOnly?: boolean;
  action?: {
    label: string;
    route?: string;
    onClick?: () => void;
  };
}

interface NudgeContext {
  persona: Persona;
  tier: ComplexityTier;
  facts: UserFacts;
}

/**
 * Evaluates and returns relevant nudges based on user context
 */
export function evalNudges({ persona, tier, facts }: NudgeContext): Nudge[] {
  const nudges: Nudge[] = [];

  // Aspiring persona nudges
  if (persona === 'aspiring') {
    // Missing emergency fund check
    if (facts.estimatedLinkedAssetsUSD < 10000) {
      nudges.push({
        id: 'missingEmergencyFund',
        title: 'Build Emergency Fund',
        description: 'Start with 3-6 months of expenses for financial security',
        type: 'action',
        priority: 'high',
        persona: 'aspiring',
        action: {
          label: 'Create Goal',
          route: '/goals-home'
        }
      });
    }

    // First budget nudge
    if (facts.entitiesCount === 0 && facts.propertiesCount === 0) {
      nudges.push({
        id: 'firstBudget',
        title: 'Create Your First Budget',
        description: 'Track spending and identify savings opportunities',
        type: 'action',
        priority: 'medium',
        persona: 'aspiring',
        action: {
          label: 'Start Budgeting',
          route: '/calculators'
        }
      });
    }

    // Auto contribution reminder
    if (!facts.equityCompPresent) {
      nudges.push({
        id: 'autoContributionOn',
        title: 'Automate Your Savings',
        description: 'Set up automatic contributions to reach goals faster',
        type: 'reminder',
        priority: 'medium',
        persona: 'aspiring',
        action: {
          label: 'Learn More',
          route: '/education'
        }
      });
    }
  }

  // Retiree persona nudges
  if (persona === 'retiree') {
    // RMD due check (mock based on assets)
    if (facts.estimatedLinkedAssetsUSD > 100000) {
      nudges.push({
        id: 'rmdDue',
        title: 'RMD Planning Required',
        description: 'Plan your required minimum distributions for tax efficiency',
        type: 'reminder',
        priority: 'high',
        persona: 'retiree',
        action: {
          label: 'Calculate RMD',
          route: '/calculators'
        }
      });
    }

    // Medicare window
    nudges.push({
      id: 'medicareWindow',
      title: 'Medicare Enrollment Window',
      description: 'Review your Medicare options and enrollment timeline',
      type: 'reminder',
      priority: 'medium',
      persona: 'retiree',
      action: {
        label: 'Review Options',
        route: '/healthcare'
      }
    });

    // Social Security timing
    if (!facts.hasAltsOrPrivate) {
      nudges.push({
        id: 'ssClaimTiming',
        title: 'Optimize Social Security Timing',
        description: 'Maximize your benefits with strategic claiming',
        type: 'opportunity',
        priority: 'medium',
        persona: 'retiree',
        action: {
          label: 'Run Analysis',
          route: '/calculators'
        }
      });
    }
  }

  // Advanced tier nudges (for both personas)
  if (tier === 'advanced') {
    nudges.push({
      id: 'familyOfficeMode',
      title: 'Family Office Features Available',
      description: 'Explore advanced wealth management tools and strategies',
      type: 'opportunity',
      priority: 'low',
      advancedOnly: true,
      action: {
        label: 'Explore Features',
        route: '/advanced'
      }
    });

    // K1 hub setup for complex investments
    if (facts.k1Count >= 1 || facts.hasAltsOrPrivate) {
      nudges.push({
        id: 'k1HubSetup',
        title: 'Set Up K-1 Tracking Hub',
        description: 'Organize and track your partnership distributions',
        type: 'action',
        priority: 'medium',
        advancedOnly: true,
        action: {
          label: 'Set Up Hub',
          route: '/entities'
        }
      });
    }

    // Trust uploads for estate planning
    if (facts.estateInstrumentsPresent || facts.estimatedLinkedAssetsUSD > 2000000) {
      nudges.push({
        id: 'trustUploads',
        title: 'Upload Trust Documents',
        description: 'Centralize your estate planning documents for review',
        type: 'action',
        priority: 'medium',
        advancedOnly: true,
        action: {
          label: 'Upload Documents',
          route: '/vault'
        }
      });
    }
  }

  return nudges.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}