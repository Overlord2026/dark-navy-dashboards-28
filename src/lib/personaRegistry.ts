import { Calculator, BookOpen, Shield, TrendingUp, Users, GraduationCap, Heart, Building2 } from 'lucide-react';

export type PersonaType = 'family' | 'professional' | 'institutional';
export type SegmentType = 'young_family' | 'pre_retiree' | 'retiree' | 'high_net_worth' | 'financial_advisor' | 'cpa' | 'attorney' | 'institution';

export interface PersonaSegment {
  id: SegmentType;
  name: string;
  description: string;
  persona: PersonaType;
  flags: string[];
  calculators: string[];
  guides: string[];
  priority_features: string[];
  demographics: {
    age_range?: string;
    income_range?: string;
    net_worth_range?: string;
    life_stage?: string;
  };
  customization: {
    hero_message: string;
    primary_actions: string[];
    recommended_content: string[];
  };
}

export interface Calculator {
  id: string;
  name: string;
  description: string;
  icon: typeof Calculator;
  complexity: 'basic' | 'intermediate' | 'advanced';
  estimated_time: string;
  categories: string[];
  flag_key: string;
}

export interface Guide {
  id: string;
  name: string;
  description: string;
  icon: typeof BookOpen;
  content_type: 'article' | 'video' | 'interactive' | 'checklist';
  estimated_time: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  categories: string[];
  flag_key: string;
}

// Core persona segments configuration
export const personaRegistry: PersonaSegment[] = [
  // Family Personas
  {
    id: 'young_family',
    name: 'Young Family',
    description: 'Families with young children focused on building wealth and planning for the future',
    persona: 'family',
    flags: [
      'calc.monte',
      'calc.rmd',
      'guides.retirement',
      'guides.taxPlanning',
      'features.advancedReporting'
    ],
    calculators: ['retirement_monte_carlo', 'education_savings', 'life_insurance'],
    guides: ['first_home_buying', 'education_planning', 'emergency_fund'],
    priority_features: ['retirement_planning', 'education_savings', 'life_insurance'],
    demographics: {
      age_range: '25-40',
      income_range: '$50k-$150k',
      life_stage: 'accumulation'
    },
    customization: {
      hero_message: 'Build a secure financial future for your growing family',
      primary_actions: ['retirement_calculator', 'education_planning', 'life_insurance_guide'],
      recommended_content: ['emergency_fund_guide', 'investment_basics', 'tax_planning']
    }
  },
  {
    id: 'pre_retiree',
    name: 'Pre-Retiree',
    description: 'Individuals approaching retirement focused on preservation and income planning',
    persona: 'family',
    flags: [
      'calc.monte',
      'calc.rmd',
      'calc.socialSecurity',
      'guides.retirement',
      'guides.estatePlanning'
    ],
    calculators: ['retirement_monte_carlo', 'social_security_optimizer', 'rmd_calculator'],
    guides: ['retirement_income_planning', 'medicare_planning', 'estate_planning'],
    priority_features: ['retirement_income', 'healthcare_planning', 'estate_planning'],
    demographics: {
      age_range: '50-65',
      income_range: '$75k-$300k',
      life_stage: 'pre_retirement'
    },
    customization: {
      hero_message: 'Prepare for a confident and secure retirement',
      primary_actions: ['retirement_income_calculator', 'social_security_optimizer', 'estate_planning'],
      recommended_content: ['medicare_guide', 'tax_efficient_withdrawals', 'legacy_planning']
    }
  },
  {
    id: 'high_net_worth',
    name: 'High Net Worth Family',
    description: 'Affluent families requiring sophisticated wealth management and tax strategies',
    persona: 'family',
    flags: [
      'calc.monte',
      'guides.estatePlanning',
      'guides.taxPlanning',
      'features.advancedReporting',
      'features.plaidIntegration'
    ],
    calculators: ['estate_tax_calculator', 'trust_optimization', 'tax_loss_harvesting'],
    guides: ['advanced_estate_planning', 'trust_strategies', 'charitable_giving'],
    priority_features: ['estate_planning', 'tax_optimization', 'trust_management'],
    demographics: {
      net_worth_range: '$1M+',
      life_stage: 'wealth_preservation'
    },
    customization: {
      hero_message: 'Sophisticated strategies for comprehensive wealth management',
      primary_actions: ['estate_planning', 'tax_optimization', 'trust_calculator'],
      recommended_content: ['advanced_tax_strategies', 'philanthropic_planning', 'succession_planning']
    }
  },

  // Professional Personas
  {
    id: 'financial_advisor',
    name: 'Financial Advisor',
    description: 'Financial professionals serving clients with comprehensive planning services',
    persona: 'professional',
    flags: [
      'calc.monte',
      'calc.rmd',
      'calc.socialSecurity',
      'pros.complianceMode',
      'features.advancedReporting'
    ],
    calculators: ['comprehensive_planning', 'portfolio_optimization', 'retirement_analysis'],
    guides: ['client_onboarding', 'compliance_best_practices', 'practice_management'],
    priority_features: ['client_management', 'compliance_tools', 'planning_software'],
    demographics: {
      life_stage: 'practice_growth'
    },
    customization: {
      hero_message: 'Comprehensive tools for professional financial planning',
      primary_actions: ['client_dashboard', 'planning_tools', 'compliance_center'],
      recommended_content: ['ce_credits', 'practice_growth', 'regulatory_updates']
    }
  },
  {
    id: 'cpa',
    name: 'CPA/Tax Professional',
    description: 'Certified Public Accountants focused on tax planning and compliance',
    persona: 'professional',
    flags: [
      'guides.taxPlanning',
      'pros.complianceMode',
      'features.advancedReporting'
    ],
    calculators: ['tax_projection', 'entity_selection', 'depreciation_calculator'],
    guides: ['tax_law_updates', 'entity_structures', 'business_valuations'],
    priority_features: ['tax_planning', 'compliance_tracking', 'ce_management'],
    demographics: {
      life_stage: 'professional_practice'
    },
    customization: {
      hero_message: 'Advanced tax planning and compliance solutions',
      primary_actions: ['tax_calculator', 'compliance_tracker', 'ce_credits'],
      recommended_content: ['tax_updates', 'planning_strategies', 'client_communication']
    }
  }
];

// Calculators registry
export const calculatorsRegistry: Calculator[] = [
  {
    id: 'retirement_monte_carlo',
    name: 'Retirement Monte Carlo',
    description: 'Advanced retirement planning with Monte Carlo simulation',
    icon: Calculator,
    complexity: 'advanced',
    estimated_time: '10-15 minutes',
    categories: ['retirement', 'planning'],
    flag_key: 'calc.monte'
  },
  {
    id: 'social_security_optimizer',
    name: 'Social Security Optimizer',
    description: 'Optimize your Social Security claiming strategy',
    icon: TrendingUp,
    complexity: 'intermediate',
    estimated_time: '5-10 minutes',
    categories: ['retirement', 'social_security'],
    flag_key: 'calc.socialSecurity'
  },
  {
    id: 'rmd_calculator',
    name: 'RMD Calculator',
    description: 'Calculate required minimum distributions',
    icon: Calculator,
    complexity: 'basic',
    estimated_time: '3-5 minutes',
    categories: ['retirement', 'taxes'],
    flag_key: 'calc.rmd'
  }
];

// Guides registry
export const guidesRegistry: Guide[] = [
  {
    id: 'retirement_planning',
    name: 'Retirement Planning Guide',
    description: 'Comprehensive guide to planning your retirement',
    icon: BookOpen,
    content_type: 'interactive',
    estimated_time: '20-30 minutes',
    difficulty: 'intermediate',
    categories: ['retirement', 'planning'],
    flag_key: 'guides.retirement'
  },
  {
    id: 'tax_planning',
    name: 'Tax Planning Strategies',
    description: 'Optimize your tax situation with proven strategies',
    icon: Shield,
    content_type: 'article',
    estimated_time: '15-20 minutes',
    difficulty: 'intermediate',
    categories: ['taxes', 'planning'],
    flag_key: 'guides.taxPlanning'
  },
  {
    id: 'estate_planning',
    name: 'Estate Planning Essentials',
    description: 'Protect your family and legacy with proper estate planning',
    icon: Heart,
    content_type: 'checklist',
    estimated_time: '25-35 minutes',
    difficulty: 'advanced',
    categories: ['estate', 'planning'],
    flag_key: 'guides.estatePlanning'
  }
];

// Helper functions for persona registry
export const getPersonaSegment = (segmentId: SegmentType): PersonaSegment | undefined => {
  return personaRegistry.find(segment => segment.id === segmentId);
};

export const getPersonasByType = (persona: PersonaType): PersonaSegment[] => {
  return personaRegistry.filter(segment => segment.persona === persona);
};

export const getCalculatorsForSegment = (segmentId: SegmentType): Calculator[] => {
  const segment = getPersonaSegment(segmentId);
  if (!segment) return [];
  
  return calculatorsRegistry.filter(calc => 
    segment.calculators.includes(calc.id)
  );
};

export const getGuidesForSegment = (segmentId: SegmentType): Guide[] => {
  const segment = getPersonaSegment(segmentId);
  if (!segment) return [];
  
  return guidesRegistry.filter(guide => 
    segment.guides.includes(guide.id)
  );
};

export const getFlagsForSegment = (segmentId: SegmentType): string[] => {
  const segment = getPersonaSegment(segmentId);
  return segment?.flags || [];
};

export const getPersonalizedContent = (segmentId: SegmentType) => {
  const segment = getPersonaSegment(segmentId);
  if (!segment) return null;

  return {
    segment,
    calculators: getCalculatorsForSegment(segmentId),
    guides: getGuidesForSegment(segmentId),
    flags: getFlagsForSegment(segmentId)
  };
};