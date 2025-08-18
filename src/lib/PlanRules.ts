import { Plan } from '@/types/pricing';

export type PersonaType = 'families' | 'pros';
export type WealthBand = 'aspiring' | 'hnw' | 'uhnw';
export type FamilySegment = 'retirees' | 'aspiring' | 'hnw' | 'entrepreneurs' | 'physicians' | 'executives' | 'independent_women' | 'athletes';
export type ProfessionalSegment = 'advisor' | 'attorney' | 'cpa' | 'accountant' | 'insurance_agent' | 'consultant' | 'coach';

export interface PlanRecommendation {
  planKey: Plan;
  confidence: number; // 0-1 scale
  reason: string;
  features: string[];
}

export interface PlanRulesInput {
  persona: PersonaType;
  segment?: FamilySegment | ProfessionalSegment | string;
  wealthBand?: WealthBand;
  currentPlan?: Plan;
}

/**
 * Core plan recommendation engine
 * Determines the best plan based on persona, segment, and wealth band
 */
export function getPlanRecommendation(input: PlanRulesInput): PlanRecommendation {
  const { persona, segment, wealthBand, currentPlan } = input;

  // Wealth band takes highest priority
  if (wealthBand) {
    switch (wealthBand) {
      case 'aspiring':
        return {
          planKey: 'basic',
          confidence: 0.9,
          reason: 'Basic plan perfect for building foundational wealth habits',
          features: ['Document Vault', 'Goal Tracking', 'Account Aggregation']
        };
      case 'hnw':
        return {
          planKey: 'elite',
          confidence: 0.95,
          reason: 'Elite plan provides advanced features for high-net-worth needs',
          features: ['Advanced Estate Planning', 'Tax Optimization', 'Concierge Services']
        };
      case 'uhnw':
        return {
          planKey: 'elite',
          confidence: 1.0,
          reason: 'Elite plan essential for ultra-high-net-worth complexity',
          features: ['Family Office Services', 'RON/IPEN', 'Unlimited Everything']
        };
    }
  }

  // Family segment-based recommendations
  if (persona === 'families' && segment) {
    switch (segment) {
      case 'aspiring':
        return {
          planKey: 'basic',
          confidence: 0.8,
          reason: 'Start building wealth with essential tools',
          features: ['Automated Saving', 'Document Organization', 'Basic Goals']
        };
      
      case 'retirees':
        return {
          planKey: 'premium',
          confidence: 0.9,
          reason: 'Premium features for retirement income planning',
          features: ['RMD Planning', 'Healthcare Integration', 'Estate Tools']
        };
      
      case 'executives':
        return {
          planKey: 'premium',
          confidence: 0.85,
          reason: 'Advanced features for executive compensation',
          features: ['Equity Comp Tracking', '10b5-1 Plans', 'Tax Optimization']
        };
      
      case 'physicians':
        return {
          planKey: 'premium',
          confidence: 0.85,
          reason: 'Professional-grade tools for medical practices',
          features: ['Malpractice Integration', 'Entity Management', 'LTC Planning']
        };
      
      case 'entrepreneurs':
        return {
          planKey: 'premium',
          confidence: 0.8,
          reason: 'Business-focused wealth management',
          features: ['Entity Workflows', 'Liquidity Planning', 'Succession Tools']
        };
      
      case 'hnw':
        return {
          planKey: 'elite',
          confidence: 0.9,
          reason: 'Comprehensive family office experience',
          features: ['Advanced Vault', 'Estate Planning', 'Tax Strategies']
        };
      
      case 'independent_women':
        return {
          planKey: 'premium',
          confidence: 0.75,
          reason: 'Goal-focused planning with safety features',
          features: ['Safety Controls', 'Goal Planning', 'Priority Support']
        };
      
      case 'athletes':
        return {
          planKey: 'premium',
          confidence: 0.8,
          reason: 'NIL and entertainment industry tools',
          features: ['NIL Contract Management', 'Brand Tracking', 'Advisory Network']
        };
    }
  }

  // Professional segment-based recommendations
  if (persona === 'pros' && segment) {
    switch (segment) {
      case 'advisor':
      case 'attorney':
      case 'cpa':
        return {
          planKey: 'premium',
          confidence: 0.85,
          reason: 'Professional tools for client management',
          features: ['Client Portal', 'Compliance Tools', 'Advanced Analytics']
        };
      
      case 'accountant':
      case 'consultant':
        return {
          planKey: 'basic',
          confidence: 0.7,
          reason: 'Essential professional collaboration tools',
          features: ['Client Access', 'Document Sharing', 'Basic CRM']
        };
      
      case 'insurance_agent':
      case 'coach':
        return {
          planKey: 'basic',
          confidence: 0.75,
          reason: 'Focused tools for client engagement',
          features: ['Lead Management', 'Client Portal', 'Communication Tools']
        };
    }
  }

  // Default fallback
  return {
    planKey: 'basic',
    confidence: 0.5,
    reason: 'Start with basic plan and upgrade as needed',
    features: ['Core Features', 'Basic Support', 'Essential Tools']
  };
}

/**
 * Check if user should see an upgrade suggestion
 */
export function shouldShowUpgradeSuggestion(
  input: PlanRulesInput,
  dismissedSuggestions: string[] = []
): boolean {
  const recommendation = getPlanRecommendation(input);
  const { currentPlan } = input;
  
  // Don't show if already dismissed
  const suggestionKey = `${input.persona}-${input.segment}-${input.wealthBand}`;
  if (dismissedSuggestions.includes(suggestionKey)) {
    return false;
  }
  
  // Don't show if already on recommended plan or higher
  if (currentPlan) {
    const planOrder: Plan[] = ['basic', 'premium', 'elite'];
    const currentIndex = planOrder.indexOf(currentPlan);
    const recommendedIndex = planOrder.indexOf(recommendation.planKey);
    
    if (currentIndex >= recommendedIndex) {
      return false;
    }
  }
  
  // Show if confidence is high enough
  return recommendation.confidence >= 0.7;
}

/**
 * Get upgrade suggestion text for UI
 */
export function getUpgradeSuggestionText(input: PlanRulesInput): string {
  const recommendation = getPlanRecommendation(input);
  const planNames = {
    basic: 'Basic',
    premium: 'Premium', 
    elite: 'Elite'
  };
  
  return `${planNames[recommendation.planKey]} plan recommended for ${input.segment || 'your needs'}`;
}

/**
 * Storage helpers for dismissed suggestions
 */
export const suggestionStorage = {
  getDismissed(): string[] {
    try {
      const stored = localStorage.getItem('dismissed-plan-suggestions');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },
  
  addDismissed(persona: PersonaType, segment?: string, wealthBand?: WealthBand): void {
    const suggestionKey = `${persona}-${segment}-${wealthBand}`;
    const dismissed = this.getDismissed();
    if (!dismissed.includes(suggestionKey)) {
      dismissed.push(suggestionKey);
      localStorage.setItem('dismissed-plan-suggestions', JSON.stringify(dismissed));
    }
  },
  
  clearAll(): void {
    localStorage.removeItem('dismissed-plan-suggestions');
  }
};