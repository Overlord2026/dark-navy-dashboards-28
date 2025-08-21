import { Persona } from '@/types/goal';
import { EntitlementTier } from '@/features/calculators/catalog';

export type NudgeCategory = 'financial_planning' | 'retirement' | 'advanced_planning' | 'tax_optimization' | 'compliance';
export type NudgePriority = 'low' | 'medium' | 'high' | 'critical';
export type NudgeStatus = 'pending' | 'acknowledged' | 'dismissed' | 'completed';

export interface NudgeRule {
  id: string;
  name: string;
  category: NudgeCategory;
  priority: NudgePriority;
  persona?: Persona;
  tier?: EntitlementTier;
  condition: (context: NudgeContext) => boolean;
  message: {
    title: string;
    description: string;
    actionText?: string;
    actionUrl?: string;
  };
  frequency: 'once' | 'daily' | 'weekly' | 'monthly' | 'quarterly';
  cooldownDays?: number;
}

export interface NudgeContext {
  user: {
    id: string;
    persona: Persona;
    tier: EntitlementTier;
    createdAt: Date;
    lastLoginAt: Date;
  };
  financial: {
    hasEmergencyFund: boolean;
    emergencyFundAmount: number;
    hasBudget: boolean;
    budgetCompletionRate: number;
    hasAutoContributions: boolean;
    totalSavings: number;
    age: number;
    retirementDate?: Date;
  };
  compliance: {
    rmdDueDate?: Date;
    medicareEligibilityDate?: Date;
    ssOptimalClaimDate?: Date;
    lastTaxReturn?: Date;
  };
  advanced: {
    hasK1Documents: boolean;
    hasTrustDocuments: boolean;
    familyOfficeEnabled: boolean;
    entityCount: number;
  };
  activity: {
    lastBudgetUpdate?: Date;
    lastGoalReview?: Date;
    lastRiskAssessment?: Date;
  };
}

export interface NudgeEvent {
  id: string;
  ruleId: string;
  userId: string;
  triggeredAt: Date;
  status: NudgeStatus;
  metadata?: Record<string, any>;
}

export interface NudgeReceipt {
  id: string;
  eventId: string;
  userId: string;
  ruleId: string;
  action: 'triggered' | 'acknowledged' | 'dismissed' | 'completed';
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Aspiring Persona Nudge Rules
const aspiringRules: NudgeRule[] = [
  {
    id: 'missing-emergency-fund',
    name: 'Missing Emergency Fund',
    category: 'financial_planning',
    priority: 'high',
    persona: 'aspiring',
    condition: (context) => !context.financial.hasEmergencyFund || context.financial.emergencyFundAmount < (context.financial.totalSavings * 0.1),
    message: {
      title: 'Build Your Emergency Fund',
      description: 'Financial experts recommend having 3-6 months of expenses saved for emergencies. Start building your safety net today.',
      actionText: 'Calculate Emergency Fund',
      actionUrl: '/calculators/emergency-fund'
    },
    frequency: 'weekly',
    cooldownDays: 7
  },
  {
    id: 'first-budget',
    name: 'Create Your First Budget',
    category: 'financial_planning',
    priority: 'high',
    persona: 'aspiring',
    condition: (context) => !context.financial.hasBudget,
    message: {
      title: 'Create Your First Budget',
      description: 'Budgeting is the foundation of financial success. Take control of your money with a personalized budget.',
      actionText: 'Start Budgeting',
      actionUrl: '/budget'
    },
    frequency: 'once'
  },
  {
    id: 'auto-contribution-setup',
    name: 'Enable Auto Contributions',
    category: 'financial_planning',
    priority: 'medium',
    persona: 'aspiring',
    condition: (context) => !context.financial.hasAutoContributions && context.financial.hasBudget,
    message: {
      title: 'Automate Your Success',
      description: 'Set up automatic contributions to your goals. Pay yourself first and make saving effortless.',
      actionText: 'Set Up Auto-Save',
      actionUrl: '/goals'
    },
    frequency: 'monthly',
    cooldownDays: 30
  }
];

// Retiree Persona Nudge Rules
const retireeRules: NudgeRule[] = [
  {
    id: 'rmd-due',
    name: 'Required Minimum Distribution Due',
    category: 'compliance',
    priority: 'critical',
    persona: 'retiree',
    condition: (context) => {
      if (!context.compliance.rmdDueDate) return false;
      const daysUntilRmd = Math.ceil((context.compliance.rmdDueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return daysUntilRmd <= 90 && daysUntilRmd > 0;
    },
    message: {
      title: 'RMD Deadline Approaching',
      description: 'Your Required Minimum Distribution deadline is approaching. Plan your withdrawal to avoid penalties.',
      actionText: 'Calculate RMD',
      actionUrl: '/calculators/rmd'
    },
    frequency: 'monthly',
    cooldownDays: 30
  },
  {
    id: 'medicare-window',
    name: 'Medicare Enrollment Window',
    category: 'compliance',
    priority: 'high',
    persona: 'retiree',
    condition: (context) => {
      if (!context.compliance.medicareEligibilityDate) return false;
      const daysUntilMedicare = Math.ceil((context.compliance.medicareEligibilityDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return daysUntilMedicare <= 180 && daysUntilMedicare > 0;
    },
    message: {
      title: 'Medicare Enrollment Coming Up',
      description: 'Your Medicare enrollment window is approaching. Review your options to avoid late enrollment penalties.',
      actionText: 'Medicare Planning',
      actionUrl: '/insurance/medicare'
    },
    frequency: 'quarterly',
    cooldownDays: 90
  },
  {
    id: 'ss-claim-timing',
    name: 'Social Security Claim Optimization',
    category: 'retirement',
    priority: 'high',
    persona: 'retiree',
    condition: (context) => {
      if (!context.compliance.ssOptimalClaimDate) return false;
      const daysUntilOptimal = Math.ceil((context.compliance.ssOptimalClaimDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return daysUntilOptimal <= 365 && daysUntilOptimal > 0;
    },
    message: {
      title: 'Optimize Your Social Security',
      description: 'Review your Social Security claiming strategy. Timing can significantly impact your lifetime benefits.',
      actionText: 'SS Calculator',
      actionUrl: '/calculators/social-security'
    },
    frequency: 'quarterly',
    cooldownDays: 90
  }
];

// Advanced Tier Nudge Rules
const advancedRules: NudgeRule[] = [
  {
    id: 'family-office-mode',
    name: 'Enable Family Office Features',
    category: 'advanced_planning',
    priority: 'medium',
    tier: 'elite',
    condition: (context) => !context.advanced.familyOfficeEnabled && context.financial.totalSavings > 5000000,
    message: {
      title: 'Unlock Family Office Features',
      description: 'Your wealth level qualifies for our family office platform. Access advanced planning tools and consolidated reporting.',
      actionText: 'Enable Family Office',
      actionUrl: '/family-office/setup'
    },
    frequency: 'once'
  },
  {
    id: 'k1-hub-setup',
    name: 'Set Up K-1 Document Hub',
    category: 'advanced_planning',
    priority: 'medium',
    tier: 'elite',
    condition: (context) => context.advanced.hasK1Documents && context.advanced.entityCount > 2,
    message: {
      title: 'Organize Your K-1 Documents',
      description: 'Streamline your partnership reporting with our K-1 document hub. Centralize and track all your partnership investments.',
      actionText: 'Set Up K-1 Hub',
      actionUrl: '/documents/k1-hub'
    },
    frequency: 'once'
  },
  {
    id: 'trust-uploads',
    name: 'Upload Trust Documents',
    category: 'advanced_planning',
    priority: 'high',
    tier: 'elite',
    condition: (context) => !context.advanced.hasTrustDocuments && context.financial.totalSavings > 2000000,
    message: {
      title: 'Secure Your Trust Documents',
      description: 'Upload your trust documents for comprehensive estate planning analysis and compliance monitoring.',
      actionText: 'Upload Documents',
      actionUrl: '/documents/trusts'
    },
    frequency: 'monthly',
    cooldownDays: 30
  }
];

// Combine all rules
export const nudgeRules: NudgeRule[] = [
  ...aspiringRules,
  ...retireeRules,
  ...advancedRules
];

// Event emission system
class NudgeEventEmitter {
  private listeners: Map<string, ((event: NudgeEvent) => void)[]> = new Map();

  on(eventType: string, listener: (event: NudgeEvent) => void) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)!.push(listener);
  }

  emit(eventType: string, event: NudgeEvent) {
    const eventListeners = this.listeners.get(eventType);
    if (eventListeners) {
      eventListeners.forEach(listener => listener(event));
    }
  }
}

export const nudgeEmitter = new NudgeEventEmitter();

// Nudge evaluation engine
export class NudgeEngine {
  private receipts: NudgeReceipt[] = [];
  private events: NudgeEvent[] = [];

  constructor() {
    // Set up audit logging
    nudgeEmitter.on('nudge.triggered', this.createReceipt.bind(this));
    nudgeEmitter.on('nudge.acknowledged', this.createReceipt.bind(this));
    nudgeEmitter.on('nudge.dismissed', this.createReceipt.bind(this));
    nudgeEmitter.on('nudge.completed', this.createReceipt.bind(this));
  }

  evaluateNudges(context: NudgeContext): NudgeEvent[] {
    const applicableRules = this.getApplicableRules(context);
    const triggeredEvents: NudgeEvent[] = [];

    for (const rule of applicableRules) {
      if (this.shouldTriggerNudge(rule, context)) {
        const event = this.createNudgeEvent(rule, context);
        triggeredEvents.push(event);
        this.events.push(event);
        
        // Emit the triggered event
        nudgeEmitter.emit('nudge.triggered', event);
      }
    }

    return triggeredEvents;
  }

  private getApplicableRules(context: NudgeContext): NudgeRule[] {
    return nudgeRules.filter(rule => {
      // Check persona match
      if (rule.persona && rule.persona !== context.user.persona) {
        return false;
      }

      // Check tier match
      if (rule.tier && rule.tier !== context.user.tier) {
        return false;
      }

      return true;
    });
  }

  private shouldTriggerNudge(rule: NudgeRule, context: NudgeContext): boolean {
    // Check if condition is met
    if (!rule.condition(context)) {
      return false;
    }

    // Check frequency and cooldown
    const lastTriggered = this.getLastTriggeredDate(rule.id, context.user.id);
    if (lastTriggered && rule.cooldownDays) {
      const daysSinceTriggered = Math.ceil((Date.now() - lastTriggered.getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceTriggered < rule.cooldownDays) {
        return false;
      }
    }

    // Check if it's a once-only rule that has already been triggered
    if (rule.frequency === 'once' && lastTriggered) {
      return false;
    }

    return true;
  }

  private getLastTriggeredDate(ruleId: string, userId: string): Date | null {
    const lastEvent = this.events
      .filter(event => event.ruleId === ruleId && event.userId === userId)
      .sort((a, b) => b.triggeredAt.getTime() - a.triggeredAt.getTime())[0];

    return lastEvent ? lastEvent.triggeredAt : null;
  }

  private createNudgeEvent(rule: NudgeRule, context: NudgeContext): NudgeEvent {
    return {
      id: `nudge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ruleId: rule.id,
      userId: context.user.id,
      triggeredAt: new Date(),
      status: 'pending',
      metadata: {
        priority: rule.priority,
        category: rule.category,
        persona: context.user.persona,
        tier: context.user.tier
      }
    };
  }

  private createReceipt(event: NudgeEvent): void {
    const receipt: NudgeReceipt = {
      id: `receipt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      eventId: event.id,
      userId: event.userId,
      ruleId: event.ruleId,
      action: 'triggered',
      timestamp: new Date(),
      metadata: event.metadata
    };

    this.receipts.push(receipt);
    console.log('Nudge Receipt Created:', receipt);
  }

  // Public methods for updating nudge status
  acknowledgeNudge(eventId: string): void {
    const event = this.events.find(e => e.id === eventId);
    if (event) {
      event.status = 'acknowledged';
      nudgeEmitter.emit('nudge.acknowledged', event);
    }
  }

  dismissNudge(eventId: string): void {
    const event = this.events.find(e => e.id === eventId);
    if (event) {
      event.status = 'dismissed';
      nudgeEmitter.emit('nudge.dismissed', event);
    }
  }

  completeNudge(eventId: string): void {
    const event = this.events.find(e => e.id === eventId);
    if (event) {
      event.status = 'completed';
      nudgeEmitter.emit('nudge.completed', event);
    }
  }

  getActiveNudges(userId: string): NudgeEvent[] {
    return this.events.filter(event => 
      event.userId === userId && 
      event.status === 'pending'
    );
  }

  getAuditTrail(userId: string): NudgeReceipt[] {
    return this.receipts.filter(receipt => receipt.userId === userId);
  }
}

// Singleton instance
export const nudgeEngine = new NudgeEngine();

// Helper functions
export function getRuleById(ruleId: string): NudgeRule | undefined {
  return nudgeRules.find(rule => rule.id === ruleId);
}

export function getRulesByPersona(persona: Persona): NudgeRule[] {
  return nudgeRules.filter(rule => rule.persona === persona || !rule.persona);
}

export function getRulesByTier(tier: EntitlementTier): NudgeRule[] {
  return nudgeRules.filter(rule => rule.tier === tier || !rule.tier);
}

export function getRulesByCategory(category: NudgeCategory): NudgeRule[] {
  return nudgeRules.filter(rule => rule.category === category);
}

export function getRulesByPriority(priority: NudgePriority): NudgeRule[] {
  return nudgeRules.filter(rule => rule.priority === priority);
}