import { Persona, ComplexityTier } from './types';

export interface DashboardModule {
  id: string;
  name: string;
  description: string;
  icon: string;
  persona?: Persona | 'any';
  tier?: ComplexityTier | 'any';
  enabled: boolean;
  order: number;
}

export interface ToolConfig {
  key: string;
  name: string;
  description: string;
  module: string;
  persona: Persona | 'any';
  tier: ComplexityTier | 'any';
  entitlement: 'basic' | 'premium' | 'elite';
  icon?: string;
  category?: string;
}

// Dashboard module ordering based on persona and tier
export function getModuleOrder(persona: Persona, tier: ComplexityTier): string[] {
  const baseOrders = {
    aspiring: ['goals', 'cashflow', 'vault', 'properties', 'education'],
    retiree: ['income', 'goals', 'hsa', 'vault', 'properties']
  };

  const baseOrder = baseOrders[persona];

  // For advanced tier, append Family Office tools
  if (tier === 'advanced') {
    return [...baseOrder, 'family_office'];
  }

  return baseOrder;
}

// Tools access matrix configuration
export const TOOLS_MATRIX: ToolConfig[] = [
  // Income Module (Retiree)
  {
    key: 'rmd_basic',
    name: 'RMD Calculator',
    description: 'Calculate required minimum distributions',
    module: 'income',
    persona: 'retiree',
    tier: 'any',
    entitlement: 'basic',
    icon: 'Calculator',
    category: 'retirement'
  },
  {
    key: 'ss_timing_basic',
    name: 'Social Security Timing',
    description: 'Optimize when to claim benefits',
    module: 'income',
    persona: 'retiree',
    tier: 'any',
    entitlement: 'basic',
    icon: 'Clock',
    category: 'retirement'
  },

  // Goals Module (Aspiring)
  {
    key: 'swag_monte_carlo',
    name: 'SWAG Monte Carlo',
    description: 'Safe withdrawal and growth projections',
    module: 'goals',
    persona: 'aspiring',
    tier: 'any',
    entitlement: 'basic',
    icon: 'TrendingUp',
    category: 'planning'
  },

  // HSA Module (Retiree)
  {
    key: 'hsa_planner',
    name: 'HSA Planner',
    description: 'Health savings account optimization',
    module: 'hsa',
    persona: 'retiree',
    tier: 'any',
    entitlement: 'basic',
    icon: 'Heart',
    category: 'health'
  },

  // Family Office Advanced Tools
  {
    key: 'entity_trust_summary',
    name: 'Entity & Trust Summary',
    description: 'Multi-entity reporting and analysis',
    module: 'reports',
    persona: 'any',
    tier: 'advanced',
    entitlement: 'premium',
    icon: 'Building2',
    category: 'family_office'
  },
  {
    key: 'roth_conversion_ladder',
    name: 'Roth Conversion Ladder',
    description: 'Strategic tax-efficient conversions',
    module: 'tax',
    persona: 'retiree',
    tier: 'advanced',
    entitlement: 'elite',
    icon: 'Ladder',
    category: 'family_office'
  },
  {
    key: 'equity_comp_planner',
    name: 'Equity Compensation Planner',
    description: 'Stock option and RSU optimization',
    module: 'equity_comp',
    persona: 'aspiring',
    tier: 'advanced',
    entitlement: 'premium',
    icon: 'TrendingUp',
    category: 'family_office'
  },
  {
    key: 'charitable_trust',
    name: 'Charitable Trust Calculator',
    description: 'Charitable giving and trust strategies',
    module: 'charitable',
    persona: 'any',
    tier: 'advanced',
    entitlement: 'premium',
    icon: 'Heart',
    category: 'family_office'
  }
];

// Get available tools for a specific persona and tier
export function getAvailableTools(
  persona: Persona, 
  tier: ComplexityTier,
  module?: string
): ToolConfig[] {
  return TOOLS_MATRIX.filter(tool => {
    const personaMatch = tool.persona === 'any' || tool.persona === persona;
    const tierMatch = tool.tier === 'any' || tool.tier === tier;
    const moduleMatch = !module || tool.module === module;
    
    return personaMatch && tierMatch && moduleMatch;
  });
}

// Get tools by category
export function getToolsByCategory(
  persona: Persona,
  tier: ComplexityTier
): Record<string, ToolConfig[]> {
  const availableTools = getAvailableTools(persona, tier);
  
  return availableTools.reduce((acc, tool) => {
    const category = tool.category || 'general';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(tool);
    return acc;
  }, {} as Record<string, ToolConfig[]>);
}

// Check if user has access to a specific tool
export function hasToolAccess(
  tool: ToolConfig,
  userPlan: 'basic' | 'premium' | 'elite'
): boolean {
  const planHierarchy = {
    basic: 0,
    premium: 1,
    elite: 2
  };
  
  return planHierarchy[userPlan] >= planHierarchy[tool.entitlement];
}

// Get upgrade plan hint for a tool
export function getUpgradePlanHint(tool: ToolConfig): 'premium' | 'elite' {
  return tool.entitlement === 'elite' ? 'elite' : 'premium';
}

// Generate upgrade intent receipt data
export function createUpgradeIntentReceipt(
  tool: ToolConfig,
  source: string = 'tools_matrix'
) {
  return {
    type: 'upgrade_intent',
    feature: tool.key,
    plan_hint: getUpgradePlanHint(tool),
    source,
    timestamp: new Date().toISOString(),
    metadata: {
      tool_name: tool.name,
      module: tool.module,
      current_entitlement: tool.entitlement
    }
  };
}