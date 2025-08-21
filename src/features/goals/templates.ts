import { Persona, ComplexityTier } from '@/features/personalization/types';

export interface GoalTemplate {
  id: string;
  title: string;
  description: string;
  category: 'emergency' | 'debt' | 'savings' | 'retirement' | 'education' | 'bucket_list' | 'health' | 'charitable' | 'equity' | 'liquidity';
  targetAmountRange: { min: number; max: number };
  timeFrameMonths: number;
  persona: Persona;
  tier: ComplexityTier;
  icon: string;
  color: string;
  priority: number;
}

const foundationalTemplates: GoalTemplate[] = [
  // Aspiring Foundational Goals
  {
    id: 'emergency-fund',
    title: 'Emergency Fund',
    description: 'Build 3-6 months of expenses for financial security',
    category: 'emergency',
    targetAmountRange: { min: 10000, max: 50000 },
    timeFrameMonths: 12,
    persona: 'aspiring',
    tier: 'foundational',
    icon: 'Shield',
    color: 'blue',
    priority: 1
  },
  {
    id: 'debt-paydown',
    title: 'Debt Paydown',
    description: 'Eliminate high-interest debt and improve credit score',
    category: 'debt',
    targetAmountRange: { min: 5000, max: 100000 },
    timeFrameMonths: 24,
    persona: 'aspiring',
    tier: 'foundational',
    icon: 'CreditCard',
    color: 'red',
    priority: 2
  },
  {
    id: 'down-payment',
    title: 'Home Down Payment',
    description: 'Save for your first home purchase',
    category: 'savings',
    targetAmountRange: { min: 20000, max: 200000 },
    timeFrameMonths: 36,
    persona: 'aspiring',
    tier: 'foundational',
    icon: 'Home',
    color: 'green',
    priority: 3
  },
  {
    id: 'college-fund',
    title: 'College Education Fund',
    description: 'Save for children\'s education expenses',
    category: 'education',
    targetAmountRange: { min: 50000, max: 300000 },
    timeFrameMonths: 180, // 15 years
    persona: 'aspiring',
    tier: 'foundational',
    icon: 'GraduationCap',
    color: 'purple',
    priority: 4
  },

  // Retiree Foundational Goals
  {
    id: 'bucket-list-travel',
    title: 'World Travel Adventure',
    description: 'Explore dream destinations and create lasting memories',
    category: 'bucket_list',
    targetAmountRange: { min: 25000, max: 100000 },
    timeFrameMonths: 24,
    persona: 'retiree',
    tier: 'foundational',
    icon: 'Plane',
    color: 'orange',
    priority: 1
  },
  {
    id: 'bucket-list-legacy',
    title: 'Family Legacy Project',
    description: 'Create a meaningful legacy for future generations',
    category: 'bucket_list',
    targetAmountRange: { min: 50000, max: 500000 },
    timeFrameMonths: 60,
    persona: 'retiree',
    tier: 'foundational',
    icon: 'Heart',
    color: 'pink',
    priority: 2
  },
  {
    id: 'health-hsa-reserve',
    title: 'Health & HSA Reserve',
    description: 'Prepare for healthcare costs and long-term care',
    category: 'health',
    targetAmountRange: { min: 50000, max: 200000 },
    timeFrameMonths: 36,
    persona: 'retiree',
    tier: 'foundational',
    icon: 'Activity',
    color: 'teal',
    priority: 3
  },
  {
    id: 'charitable-giving',
    title: 'Charitable Giving Fund',
    description: 'Support causes important to you',
    category: 'charitable',
    targetAmountRange: { min: 10000, max: 100000 },
    timeFrameMonths: 12,
    persona: 'retiree',
    tier: 'foundational',
    icon: 'Heart',
    color: 'green',
    priority: 4
  }
];

const advancedTemplates: GoalTemplate[] = [
  // Advanced Equity & Liquidity Goals (both personas)
  {
    id: 'equity-comp-strategy',
    title: 'Equity Compensation Strategy',
    description: 'Optimize ISOs, NSOs, and RSUs for tax efficiency',
    category: 'equity',
    targetAmountRange: { min: 100000, max: 2000000 },
    timeFrameMonths: 48,
    persona: 'aspiring',
    tier: 'advanced',
    icon: 'TrendingUp',
    color: 'indigo',
    priority: 5
  },
  {
    id: 'concentrated-stock',
    title: 'Concentrated Stock Diversification',
    description: 'Reduce single-stock risk through strategic diversification',
    category: 'equity',
    targetAmountRange: { min: 500000, max: 5000000 },
    timeFrameMonths: 36,
    persona: 'aspiring',
    tier: 'advanced',
    icon: 'PieChart',
    color: 'violet',
    priority: 6
  },
  {
    id: 'daf-charitable-trust',
    title: 'Donor Advised Fund Setup',
    description: 'Establish tax-efficient charitable giving structure',
    category: 'charitable',
    targetAmountRange: { min: 50000, max: 1000000 },
    timeFrameMonths: 12,
    persona: 'retiree',
    tier: 'advanced',
    icon: 'Building',
    color: 'emerald',
    priority: 5
  },
  {
    id: 'liquidity-event-prep',
    title: 'Liquidity Event Preparation',
    description: 'Prepare for business sale or major financial event',
    category: 'liquidity',
    targetAmountRange: { min: 1000000, max: 50000000 },
    timeFrameMonths: 24,
    persona: 'aspiring',
    tier: 'advanced',
    icon: 'Landmark',
    color: 'amber',
    priority: 7
  },
  
  // Cross-persona advanced templates
  {
    id: 'equity-comp-retiree',
    title: 'Post-Career Equity Strategy',
    description: 'Manage remaining equity compensation in retirement',
    category: 'equity',
    targetAmountRange: { min: 200000, max: 3000000 },
    timeFrameMonths: 24,
    persona: 'retiree',
    tier: 'advanced',
    icon: 'TrendingUp',
    color: 'indigo',
    priority: 6
  },
  {
    id: 'concentrated-stock-retiree',
    title: 'Legacy Stock Portfolio',
    description: 'Optimize concentrated holdings for estate planning',
    category: 'equity',
    targetAmountRange: { min: 1000000, max: 10000000 },
    timeFrameMonths: 60,
    persona: 'retiree',
    tier: 'advanced',
    icon: 'PieChart',
    color: 'violet',
    priority: 7
  }
];

/**
 * Gets goal templates based on persona and complexity tier
 * Foundational tier returns base templates for the persona
 * Advanced tier appends additional sophisticated templates
 */
export function getGoalTemplates(persona: Persona, tier: ComplexityTier): GoalTemplate[] {
  // Get foundational templates for the persona
  const foundational = foundationalTemplates.filter(template => 
    template.persona === persona && template.tier === 'foundational'
  );

  // If foundational tier, return only foundational templates
  if (tier === 'foundational') {
    return foundational.sort((a, b) => a.priority - b.priority);
  }

  // If advanced tier, append advanced templates for the persona
  const advanced = advancedTemplates.filter(template => 
    template.persona === persona && template.tier === 'advanced'
  );

  return [...foundational, ...advanced].sort((a, b) => a.priority - b.priority);
}

/**
 * Gets bucket list templates specifically for retiree persona
 */
export function getBucketListTemplates(): GoalTemplate[] {
  return foundationalTemplates.filter(template => 
    template.persona === 'retiree' && template.category === 'bucket_list'
  );
}

/**
 * Gets templates by category
 */
export function getTemplatesByCategory(
  category: GoalTemplate['category'], 
  persona: Persona, 
  tier: ComplexityTier
): GoalTemplate[] {
  const allTemplates = getGoalTemplates(persona, tier);
  return allTemplates.filter(template => template.category === category);
}

/**
 * Gets a specific template by ID
 */
export function getTemplateById(id: string): GoalTemplate | undefined {
  const allTemplates = [...foundationalTemplates, ...advancedTemplates];
  return allTemplates.find(template => template.id === id);
}

/**
 * Checks if advanced templates are available for the current tier
 */
export function hasAdvancedTemplates(tier: ComplexityTier): boolean {
  return tier === 'advanced';
}

/**
 * Gets template count by tier and persona
 */
export function getTemplateCount(persona: Persona, tier: ComplexityTier): {
  foundational: number;
  advanced: number;
  total: number;
} {
  const foundational = foundationalTemplates.filter(t => t.persona === persona).length;
  const advanced = tier === 'advanced' 
    ? advancedTemplates.filter(t => t.persona === persona).length 
    : 0;
  
  return {
    foundational,
    advanced,
    total: foundational + advanced
  };
}