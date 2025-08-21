import { Persona, ComplexityTier } from '@/features/personalization/types';

export type Entitlement = 'basic' | 'premium' | 'elite';

export interface CalcItem {
  key: string;
  title: string;
  description: string;
  entitlement: Entitlement;
  persona?: Persona;
  advancedOnly?: boolean;
  category: 'retirement' | 'planning' | 'tax' | 'investment' | 'estate' | 'business';
  estimatedTime: string;
  icon: string;
  tags: string[];
}

const calculatorCatalog: CalcItem[] = [
  // Foundational Calculators (Basic Entitlement)
  {
    key: 'swag-monte-carlo',
    title: 'SWAG/Monte Carlo',
    description: 'Scientific Wild Ass Guess with Monte Carlo analysis for retirement planning',
    entitlement: 'basic',
    category: 'retirement',
    estimatedTime: '5 min',
    icon: 'BarChart3',
    tags: ['retirement', 'probability', 'planning']
  },
  {
    key: 'budget-planner',
    title: 'Budget Planner',
    description: 'Comprehensive budget planning and cash flow analysis',
    entitlement: 'basic',
    category: 'planning',
    estimatedTime: '10 min',
    icon: 'Calculator',
    tags: ['budget', 'cash-flow', 'planning']
  },
  {
    key: 'rmd-basic',
    title: 'RMD Basic Calculator',
    description: 'Calculate Required Minimum Distributions for retirement accounts',
    entitlement: 'basic',
    persona: 'retiree',
    category: 'retirement',
    estimatedTime: '3 min',
    icon: 'PiggyBank',
    tags: ['rmd', 'retirement', 'required']
  },
  {
    key: 'ss-timing-basic',
    title: 'Social Security Timing Basic',
    description: 'Basic Social Security claiming strategy analysis',
    entitlement: 'basic',
    persona: 'retiree',
    category: 'retirement',
    estimatedTime: '5 min',
    icon: 'Users',
    tags: ['social-security', 'timing', 'benefits']
  },
  {
    key: 'emergency-fund',
    title: 'Emergency Fund Calculator',
    description: 'Determine optimal emergency fund size based on expenses',
    entitlement: 'basic',
    persona: 'aspiring',
    category: 'planning',
    estimatedTime: '2 min',
    icon: 'Shield',
    tags: ['emergency', 'savings', 'security']
  },
  {
    key: 'debt-payoff',
    title: 'Debt Payoff Strategy',
    description: 'Optimize debt payoff with avalanche vs snowball comparison',
    entitlement: 'basic',
    persona: 'aspiring',
    category: 'planning',
    estimatedTime: '7 min',
    icon: 'CreditCard',
    tags: ['debt', 'payoff', 'strategy']
  },

  // Advanced Calculators (Premium/Elite Entitlement)
  {
    key: 'charitable-trust',
    title: 'Charitable Trust Analyzer',
    description: 'Analyze charitable remainder and lead trust strategies',
    entitlement: 'premium',
    advancedOnly: true,
    category: 'estate',
    estimatedTime: '15 min',
    icon: 'Heart',
    tags: ['charitable', 'trust', 'tax-deduction']
  },
  {
    key: 'equity-comp-planner',
    title: 'Equity Compensation Planner',
    description: 'Optimize ISOs, NSOs, RSUs, and ESPP strategies',
    entitlement: 'premium',
    advancedOnly: true,
    category: 'tax',
    estimatedTime: '20 min',
    icon: 'TrendingUp',
    tags: ['equity', 'compensation', 'tax-optimization']
  },
  {
    key: 'nua-calculator',
    title: 'Net Unrealized Appreciation (NUA)',
    description: 'Calculate NUA tax advantages for company stock distributions',
    entitlement: 'premium',
    advancedOnly: true,
    category: 'tax',
    estimatedTime: '12 min',
    icon: 'Building2',
    tags: ['nua', 'company-stock', 'tax-strategy']
  },
  {
    key: 'entity-trust-summary',
    title: 'Entity/Trust Summary',
    description: 'Comprehensive analysis of legal entities and trust structures',
    entitlement: 'premium',
    advancedOnly: true,
    category: 'business',
    estimatedTime: '25 min',
    icon: 'Building',
    tags: ['entities', 'trusts', 'structure']
  },
  {
    key: 'roth-conversion-ladder',
    title: 'Roth Conversion Ladder',
    description: 'Advanced Roth conversion planning with tax optimization',
    entitlement: 'elite',
    advancedOnly: true,
    category: 'tax',
    estimatedTime: '30 min',
    icon: 'Layers',
    tags: ['roth', 'conversion', 'tax-planning']
  },
  {
    key: 'estate-tax-planning',
    title: 'Estate Tax Planning',
    description: 'Comprehensive estate tax minimization strategies',
    entitlement: 'elite',
    advancedOnly: true,
    category: 'estate',
    estimatedTime: '35 min',
    icon: 'Crown',
    tags: ['estate', 'tax-planning', 'wealth-transfer']
  },
  {
    key: 'private-equity-analyzer',
    title: 'Private Equity Analyzer',
    description: 'Analyze private equity investments and cash flows',
    entitlement: 'elite',
    advancedOnly: true,
    category: 'investment',
    estimatedTime: '40 min',
    icon: 'Briefcase',
    tags: ['private-equity', 'alternative-investments', 'analysis']
  },
  {
    key: 'family-office-dashboard',
    title: 'Family Office Dashboard',
    description: 'Comprehensive family office reporting and analytics',
    entitlement: 'elite',
    advancedOnly: true,
    category: 'business',
    estimatedTime: '45 min',
    icon: 'LayoutDashboard',
    tags: ['family-office', 'reporting', 'analytics']
  }
];

/**
 * Gets available calculators based on user's persona, complexity tier, and entitlement
 */
export function getAvailableCalculators(
  persona: Persona,
  tier: ComplexityTier,
  userEntitlement: Entitlement
): CalcItem[] {
  return calculatorCatalog.filter(calc => {
    // Hide advanced-only calculators if user is not in advanced tier
    if (calc.advancedOnly && tier !== 'advanced') {
      return false;
    }

    // Show calculators that match persona (or have no persona restriction)
    if (calc.persona && calc.persona !== persona) {
      return false;
    }

    return true;
  });
}

/**
 * Gets all calculators (for admin/preview purposes)
 */
export function getAllCalculators(): CalcItem[] {
  return calculatorCatalog;
}

/**
 * Gets calculators by category
 */
export function getCalculatorsByCategory(
  category: CalcItem['category'],
  persona: Persona,
  tier: ComplexityTier,
  userEntitlement: Entitlement
): CalcItem[] {
  const available = getAvailableCalculators(persona, tier, userEntitlement);
  return available.filter(calc => calc.category === category);
}

/**
 * Gets a specific calculator by key
 */
export function getCalculatorByKey(key: string): CalcItem | undefined {
  return calculatorCatalog.find(calc => calc.key === key);
}

/**
 * Checks if user has access to a calculator
 */
export function hasCalculatorAccess(calcKey: string, userEntitlement: Entitlement): boolean {
  const calc = getCalculatorByKey(calcKey);
  if (!calc) return false;

  const entitlementLevels: Record<Entitlement, number> = {
    basic: 1,
    premium: 2,
    elite: 3
  };

  return entitlementLevels[userEntitlement] >= entitlementLevels[calc.entitlement];
}

/**
 * Gets the required entitlement for a calculator
 */
export function getRequiredEntitlement(calcKey: string): Entitlement | null {
  const calc = getCalculatorByKey(calcKey);
  return calc ? calc.entitlement : null;
}

/**
 * Generates pricing URL for gated calculator
 */
export function getPricingUrl(calcKey: string): string {
  const calc = getCalculatorByKey(calcKey);
  const tier = calc?.entitlement || 'premium';
  return `/pricing?feature=${calcKey}&tier=${tier}`;
}

/**
 * Gets calculators count by entitlement level
 */
export function getCalculatorCounts(persona: Persona, tier: ComplexityTier): {
  basic: number;
  premium: number;
  elite: number;
  total: number;
  available: number;
} {
  const available = getAvailableCalculators(persona, tier, 'elite'); // Get all possible
  
  const basic = available.filter(c => c.entitlement === 'basic').length;
  const premium = available.filter(c => c.entitlement === 'premium').length;
  const elite = available.filter(c => c.entitlement === 'elite').length;
  
  return {
    basic,
    premium,
    elite,
    total: basic + premium + elite,
    available: available.length
  };
}

/**
 * Searches calculators by title, description, or tags
 */
export function searchCalculators(
  query: string,
  persona: Persona,
  tier: ComplexityTier,
  userEntitlement: Entitlement
): CalcItem[] {
  const available = getAvailableCalculators(persona, tier, userEntitlement);
  const searchTerm = query.toLowerCase();
  
  return available.filter(calc =>
    calc.title.toLowerCase().includes(searchTerm) ||
    calc.description.toLowerCase().includes(searchTerm) ||
    calc.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
}