export type EntitlementTier = 'basic' | 'premium' | 'elite';
export type CalculatorCategory = 'foundational' | 'advanced';

export interface Calculator {
  id: string;
  title: string;
  description: string;
  category: CalculatorCategory;
  entitlement: EntitlementTier;
  icon: string;
  route: string;
  tags: string[];
  estimatedTime: string; // e.g., "5 min"
  complexity: 'simple' | 'intermediate' | 'advanced';
  popular?: boolean;
}

const calculatorCatalog: Calculator[] = [
  // Foundational Calculators (Basic Tier)
  {
    id: 'compound-interest',
    title: 'Compound Interest Calculator',
    description: 'Calculate the power of compound interest over time',
    category: 'foundational',
    entitlement: 'basic',
    icon: 'TrendingUp',
    route: '/calculators/compound-interest',
    tags: ['savings', 'growth', 'retirement'],
    estimatedTime: '3 min',
    complexity: 'simple',
    popular: true
  },
  {
    id: 'retirement-savings',
    title: 'Retirement Savings Calculator',
    description: 'Determine how much to save for retirement',
    category: 'foundational',
    entitlement: 'basic',
    icon: 'PiggyBank',
    route: '/calculators/retirement-savings',
    tags: ['retirement', 'savings', '401k'],
    estimatedTime: '5 min',
    complexity: 'simple',
    popular: true
  },
  {
    id: 'mortgage-payment',
    title: 'Mortgage Payment Calculator',
    description: 'Calculate monthly mortgage payments and amortization',
    category: 'foundational',
    entitlement: 'basic',
    icon: 'Home',
    route: '/calculators/mortgage-payment',
    tags: ['mortgage', 'real-estate', 'loans'],
    estimatedTime: '4 min',
    complexity: 'simple'
  },
  {
    id: 'debt-payoff',
    title: 'Debt Payoff Calculator',
    description: 'Create a strategy to pay off debt faster',
    category: 'foundational',
    entitlement: 'basic',
    icon: 'CreditCard',
    route: '/calculators/debt-payoff',
    tags: ['debt', 'payoff', 'strategy'],
    estimatedTime: '6 min',
    complexity: 'simple'
  },
  {
    id: 'emergency-fund',
    title: 'Emergency Fund Calculator',
    description: 'Determine the right emergency fund size for your situation',
    category: 'foundational',
    entitlement: 'basic',
    icon: 'Shield',
    route: '/calculators/emergency-fund',
    tags: ['emergency', 'savings', 'security'],
    estimatedTime: '3 min',
    complexity: 'simple'
  },

  // Premium Tier Calculators
  {
    id: 'tax-loss-harvesting',
    title: 'Tax-Loss Harvesting Calculator',
    description: 'Optimize your tax strategy through strategic loss harvesting',
    category: 'advanced',
    entitlement: 'premium',
    icon: 'Receipt',
    route: '/calculators/tax-loss-harvesting',
    tags: ['tax', 'investing', 'optimization'],
    estimatedTime: '10 min',
    complexity: 'intermediate',
    popular: true
  },
  {
    id: 'asset-allocation',
    title: 'Asset Allocation Optimizer',
    description: 'Build an optimal portfolio based on risk tolerance and goals',
    category: 'advanced',
    entitlement: 'premium',
    icon: 'PieChart',
    route: '/calculators/asset-allocation',
    tags: ['portfolio', 'allocation', 'risk'],
    estimatedTime: '8 min',
    complexity: 'intermediate'
  },
  {
    id: 'college-funding',
    title: 'College Funding Calculator',
    description: 'Plan and save for education expenses with 529 optimization',
    category: 'foundational',
    entitlement: 'premium',
    icon: 'GraduationCap',
    route: '/calculators/college-funding',
    tags: ['education', '529', 'savings'],
    estimatedTime: '7 min',
    complexity: 'intermediate'
  },
  {
    id: 'roth-conversion',
    title: 'Roth IRA Conversion Calculator',
    description: 'Analyze the benefits of converting traditional IRA to Roth',
    category: 'advanced',
    entitlement: 'premium',
    icon: 'RefreshCw',
    route: '/calculators/roth-conversion',
    tags: ['retirement', 'roth', 'tax'],
    estimatedTime: '12 min',
    complexity: 'intermediate'
  },
  {
    id: 'social-security',
    title: 'Social Security Optimizer',
    description: 'Optimize when to claim Social Security benefits',
    category: 'advanced',
    entitlement: 'premium',
    icon: 'Users',
    route: '/calculators/social-security',
    tags: ['social-security', 'retirement', 'benefits'],
    estimatedTime: '9 min',
    complexity: 'intermediate'
  },

  // Elite Tier Calculators
  {
    id: 'estate-tax-planning',
    title: 'Estate Tax Planning Calculator',
    description: 'Advanced estate planning with tax minimization strategies',
    category: 'advanced',
    entitlement: 'elite',
    icon: 'Landmark',
    route: '/calculators/estate-tax-planning',
    tags: ['estate', 'tax', 'planning', 'trust'],
    estimatedTime: '15 min',
    complexity: 'advanced'
  },
  {
    id: 'trust-analysis',
    title: 'Trust Structure Analyzer',
    description: 'Compare different trust structures for wealth transfer',
    category: 'advanced',
    entitlement: 'elite',
    icon: 'Building',
    route: '/calculators/trust-analysis',
    tags: ['trust', 'wealth-transfer', 'tax'],
    estimatedTime: '20 min',
    complexity: 'advanced'
  },
  {
    id: 'business-valuation',
    title: 'Business Valuation Calculator',
    description: 'Value your business for sale, succession, or estate planning',
    category: 'advanced',
    entitlement: 'elite',
    icon: 'Building2',
    route: '/calculators/business-valuation',
    tags: ['business', 'valuation', 'succession'],
    estimatedTime: '18 min',
    complexity: 'advanced'
  },
  {
    id: 'charitable-giving',
    title: 'Charitable Giving Optimizer',
    description: 'Maximize tax benefits through strategic charitable giving',
    category: 'advanced',
    entitlement: 'elite',
    icon: 'Heart',
    route: '/calculators/charitable-giving',
    tags: ['charity', 'tax', 'giving', 'daf'],
    estimatedTime: '14 min',
    complexity: 'advanced'
  },
  {
    id: 'private-equity',
    title: 'Private Equity Calculator',
    description: 'Analyze private equity investments and cash flows',
    category: 'advanced',
    entitlement: 'elite',
    icon: 'TrendingUp',
    route: '/calculators/private-equity',
    tags: ['private-equity', 'investing', 'returns'],
    estimatedTime: '16 min',
    complexity: 'advanced'
  }
];

export interface CalculatorAccessResult {
  hasAccess: boolean;
  userTier: EntitlementTier;
  requiredTier: EntitlementTier;
  upgradeUrl?: string;
}

export function getCalculatorCatalog(): Calculator[] {
  return calculatorCatalog;
}

export function getFoundationalCalculators(): Calculator[] {
  return calculatorCatalog.filter(calc => calc.category === 'foundational');
}

export function getAdvancedCalculators(): Calculator[] {
  return calculatorCatalog.filter(calc => calc.category === 'advanced');
}

export function getCalculatorsByTier(tier: EntitlementTier): Calculator[] {
  const tierHierarchy: Record<EntitlementTier, EntitlementTier[]> = {
    basic: ['basic'],
    premium: ['basic', 'premium'],
    elite: ['basic', 'premium', 'elite']
  };
  
  return calculatorCatalog.filter(calc => 
    tierHierarchy[tier].includes(calc.entitlement)
  );
}

export function getPopularCalculators(): Calculator[] {
  return calculatorCatalog.filter(calc => calc.popular);
}

export function getCalculatorById(id: string): Calculator | undefined {
  return calculatorCatalog.find(calc => calc.id === id);
}

export function checkCalculatorAccess(
  calculatorId: string, 
  userTier: EntitlementTier
): CalculatorAccessResult {
  const calculator = getCalculatorById(calculatorId);
  
  if (!calculator) {
    return {
      hasAccess: false,
      userTier,
      requiredTier: 'basic'
    };
  }

  const tierHierarchy: Record<EntitlementTier, number> = {
    basic: 1,
    premium: 2,
    elite: 3
  };

  const hasAccess = tierHierarchy[userTier] >= tierHierarchy[calculator.entitlement];
  
  const result: CalculatorAccessResult = {
    hasAccess,
    userTier,
    requiredTier: calculator.entitlement
  };

  if (!hasAccess) {
    result.upgradeUrl = `/pricing?feature=${calculator.id}&tier=${calculator.entitlement}`;
  }

  return result;
}

export function getUpgradeUrl(feature: string, requiredTier: EntitlementTier): string {
  return `/pricing?feature=${feature}&tier=${requiredTier}`;
}

export function searchCalculators(query: string): Calculator[] {
  const searchTerm = query.toLowerCase();
  return calculatorCatalog.filter(calc => 
    calc.title.toLowerCase().includes(searchTerm) ||
    calc.description.toLowerCase().includes(searchTerm) ||
    calc.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
}

export function getCalculatorsByTag(tag: string): Calculator[] {
  return calculatorCatalog.filter(calc => 
    calc.tags.includes(tag.toLowerCase())
  );
}