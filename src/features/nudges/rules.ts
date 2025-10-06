import { Persona, ComplexityTier, UserFacts } from '@/features/personalization/types';
import { priorityOrder } from '@/types/goals';

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
    // Create Emergency Fund (OB-3 requirement)
    if (facts.estimatedLinkedAssetsUSD < 10000) {
      nudges.push({
        id: 'createEmergencyFund',
        title: 'Create Emergency Fund',
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

    // First Budget (OB-3 requirement)
    if (facts.entitiesCount === 0 && facts.propertiesCount === 0) {
      nudges.push({
        id: 'firstBudget',
        title: 'First Budget',
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

    // Auto-contribution On (OB-3 requirement)
    if (!facts.equityCompPresent) {
      nudges.push({
        id: 'autoContributionOn',
        title: 'Auto-contribution On',
        description: 'Set up automatic contributions to reach goals faster',
        type: 'reminder',
        priority: 'medium',
        persona: 'aspiring',
        action: {
          label: 'Set Up Auto-Save',
          route: '/goals-home'
        }
      });
    }
  }

  // Retiree persona nudges
  if (persona === 'retiree') {
    // RMD due soon (OB-3 requirement)
    if (facts.estimatedLinkedAssetsUSD > 100000) {
      nudges.push({
        id: 'rmdDueSoon',
        title: 'RMD due soon',
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

    // Medicare window open (OB-3 requirement)
    nudges.push({
      id: 'medicareWindowOpen',
      title: 'Medicare window open',
      description: 'Review your Medicare options and enrollment timeline',
      type: 'reminder',
      priority: 'medium',
      persona: 'retiree',
      action: {
        label: 'Review Options',
        route: '/healthcare'
      }
    });

    // SS claim timing check (OB-3 requirement)
    if (!facts.hasAltsOrPrivate) {
      nudges.push({
        id: 'ssClaimTimingCheck',
        title: 'SS claim timing check',
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

  // Advanced tier nudges (for both personas) - OB-3 requirements
  if (tier === 'advanced') {
    // Family Office summary available
    nudges.push({
      id: 'familyOfficeSummaryAvailable',
      title: 'Family Office summary available',
      description: 'Explore advanced wealth management tools and strategies',
      type: 'opportunity',
      priority: 'low',
      advancedOnly: true,
      action: {
        label: 'View Summary',
        route: '/reports'
      }
    });

    // K-1 Hub setup (OB-3 requirement)
    if (facts.k1Count >= 1 || facts.hasAltsOrPrivate) {
      nudges.push({
        id: 'k1HubSetup',
        title: 'K-1 Hub setup',
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

    // Trust uploads needed (OB-3 requirement)
    if (facts.estateInstrumentsPresent || facts.estimatedLinkedAssetsUSD > 2000000) {
      nudges.push({
        id: 'trustUploadsNeeded',
        title: 'Trust uploads needed',
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
    // Use centralized priority order
    const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 2;
    const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 2;
    return aPriority - bPriority;
  });
}