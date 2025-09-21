// SWAG™ Tool Tiers and Pricing Configuration
export interface SWAGToolTier {
  id: 'family_premium' | 'professional_basic' | 'professional_premium' | 'enterprise';
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  clientLimit?: number;
  features: string[];
  tools: string[];
}

export const SWAG_TOOL_TIERS: Record<string, SWAGToolTier> = {
  family_premium: {
    id: 'family_premium',
    name: 'Family Premium',
    description: 'SWAG™ tools for individual families',
    monthlyPrice: 29,
    annualPrice: 290,
    clientLimit: 1,
    features: [
      'swag_retirement_roadmap',
      'swag_legacy_planning',
      'basic_analytics',
      'document_vault',
      'professional_collaboration'
    ],
    tools: ['swag-retirement-roadmap', 'estate-planning']
  },
  professional_basic: {
    id: 'professional_basic',
    name: 'Professional Basic',
    description: 'SWAG™ tools for growing practices',
    monthlyPrice: 99,
    annualPrice: 990,
    clientLimit: 10,
    features: [
      'swag_retirement_roadmap',
      'swag_legacy_planning',
      'advanced_analytics',
      'document_vault',
      'professional_collaboration',
      'client_management',
      'basic_branding'
    ],
    tools: ['swag-retirement-roadmap', 'estate-planning']
  },
  professional_premium: {
    id: 'professional_premium',
    name: 'Professional Premium',
    description: 'Advanced SWAG™ tools with white-label features',
    monthlyPrice: 199,
    annualPrice: 1990,
    clientLimit: 50,
    features: [
      'swag_retirement_roadmap',
      'swag_legacy_planning',
      'advanced_analytics',
      'document_vault',
      'professional_collaboration',
      'client_management',
      'white_label_branding',
      'advanced_reporting',
      'api_access',
      'priority_support'
    ],
    tools: ['swag-retirement-roadmap', 'estate-planning']
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Unlimited SWAG™ tools with custom features',
    monthlyPrice: 299,
    annualPrice: 2990,
    features: [
      'swag_retirement_roadmap',
      'swag_legacy_planning',
      'advanced_analytics',
      'document_vault',
      'professional_collaboration',
      'client_management',
      'custom_branding',
      'advanced_reporting',
      'full_api_access',
      'dedicated_support',
      'custom_integrations',
      'team_management'
    ],
    tools: ['swag-retirement-roadmap', 'estate-planning']
  }
};

export interface ProfessionalFeature {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'practice_management' | 'client_portal' | 'compliance' | 'analytics' | 'automation' | 'integrations';
  segment?: string; // specific professional segment
}

export interface ProfessionalPlan {
  id: 'basic' | 'premium' | 'elite';
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  highlighted?: boolean;
}

export const PROFESSIONAL_FEATURES: Record<string, ProfessionalFeature> = {
  // Basic Features
  client_portal: {
    id: 'client_portal',
    name: 'Client Portal',
    description: 'Secure client communication and document sharing',
    icon: 'users',
    category: 'client_portal'
  },
  basic_crm: {
    id: 'basic_crm',
    name: 'Basic CRM',
    description: 'Contact management and lead tracking',
    icon: 'contact',
    category: 'practice_management'
  },
  document_vault: {
    id: 'document_vault',
    name: 'Document Vault',
    description: 'Secure document storage and organization',
    icon: 'folder',
    category: 'practice_management'
  },
  accept_invitations: {
    id: 'accept_invitations',
    name: 'Accept Invitations',
    description: 'Join client teams and family networks',
    icon: 'mail',
    category: 'client_portal'
  },
  basic_reports: {
    id: 'basic_reports',
    name: 'Basic Reports',
    description: 'Standard client reports and summaries',
    icon: 'file_text',
    category: 'analytics'
  },

  // Premium Features
  advanced_crm: {
    id: 'advanced_crm',
    name: 'Advanced CRM',
    description: 'Full practice management with workflows',
    icon: 'workflow',
    category: 'practice_management'
  },
  compliance_tools: {
    id: 'compliance_tools',
    name: 'Compliance Tools',
    description: 'Regulatory compliance and audit trails',
    icon: 'shield_check',
    category: 'compliance'
  },
  esign_integration: {
    id: 'esign_integration',
    name: 'E-Sign Integration',
    description: 'DocuSign and PandaDoc integration',
    icon: 'pen_tool',
    category: 'integrations'
  },
  advanced_analytics: {
    id: 'advanced_analytics',
    name: 'Advanced Analytics',
    description: 'Practice performance and client insights',
    icon: 'trending_up',
    category: 'analytics'
  },
  white_label: {
    id: 'white_label',
    name: 'White Label Portal',
    description: 'Branded client portals with your logo',
    icon: 'palette',
    category: 'client_portal'
  },
  automated_workflows: {
    id: 'automated_workflows',
    name: 'Automated Workflows',
    description: 'Client onboarding and task automation',
    icon: 'zap',
    category: 'automation'
  },

  // Elite Features
  enterprise_integration: {
    id: 'enterprise_integration',
    name: 'Enterprise Integrations',
    description: 'Connect with Salesforce, QuickBooks, and more',
    icon: 'link',
    category: 'integrations'
  },
  custom_dashboards: {
    id: 'custom_dashboards',
    name: 'Custom Dashboards',
    description: 'Personalized practice and client dashboards',
    icon: 'layout_dashboard',
    category: 'analytics'
  },
  api_access: {
    id: 'api_access',
    name: 'API Access',
    description: 'Full API access for custom integrations',
    icon: 'code',
    category: 'integrations'
  },
  dedicated_support: {
    id: 'dedicated_support',
    name: 'Dedicated Support',
    description: 'Priority support with dedicated account manager',
    icon: 'headphones',
    category: 'practice_management'
  },
  custom_training: {
    id: 'custom_training',
    name: 'Custom Training',
    description: 'Personalized team training and onboarding',
    icon: 'graduation_cap',
    category: 'practice_management'
  }
};

export const PROFESSIONAL_PLANS: Record<string, ProfessionalPlan> = {
  basic: {
    id: 'basic',
    name: 'Professional Basic',
    description: 'Essential tools for growing practices',
    monthlyPrice: 49,
    annualPrice: 490,
    features: [
      'client_portal',
      'basic_crm',
      'document_vault',
      'accept_invitations',
      'basic_reports'
    ]
  },
  premium: {
    id: 'premium',
    name: 'Professional Premium',
    description: 'Advanced practice management and compliance',
    monthlyPrice: 149,
    annualPrice: 1490,
    highlighted: true,
    features: [
      'client_portal',
      'basic_crm',
      'document_vault',
      'accept_invitations',
      'basic_reports',
      'advanced_crm',
      'compliance_tools',
      'esign_integration',
      'advanced_analytics',
      'white_label',
      'automated_workflows'
    ]
  },
  elite: {
    id: 'elite',
    name: 'Professional Elite',
    description: 'Enterprise-grade practice management',
    monthlyPrice: 299,
    annualPrice: 2990,
    features: [
      'client_portal',
      'basic_crm',
      'document_vault',
      'accept_invitations',
      'basic_reports',
      'advanced_crm',
      'compliance_tools',
      'esign_integration',
      'advanced_analytics',
      'white_label',
      'automated_workflows',
      'enterprise_integration',
      'custom_dashboards',
      'api_access',
      'dedicated_support',
      'custom_training'
    ]
  }
};

export const PROFESSIONAL_SEGMENTS = [
  { id: 'advisor', name: 'Financial Advisor', icon: 'trending_up' },
  { id: 'cpa', name: 'CPA', icon: 'calculator' },
  { id: 'attorney_estate', name: 'Attorney (Estate)', icon: 'scale' },
  { id: 'attorney_litigation', name: 'Attorney (Litigation)', icon: 'gavel' },
  { id: 'realtor', name: 'Realtor', icon: 'home' },
  { id: 'insurance_life', name: 'Insurance (Life/Annuity)', icon: 'shield' },
  { id: 'insurance_health', name: 'Insurance (Medicare, LTC)', icon: 'heart' },
  { id: 'healthcare', name: 'Healthcare', icon: 'stethoscope' },
  { id: 'influencer', name: 'Influencer', icon: 'megaphone' }
];

// Utility functions
export const getSWAGToolTier = (tierId: string): SWAGToolTier | null => {
  return SWAG_TOOL_TIERS[tierId] || null;
};

export const canAccessSWAGTool = (userTier: string, toolKey: string): boolean => {
  const tier = getSWAGToolTier(userTier);
  return tier ? tier.tools.includes(toolKey) : false;
};

export const getClientLimit = (tierId: string): number | null => {
  const tier = getSWAGToolTier(tierId);
  return tier?.clientLimit || null;
};

export default {
  features: PROFESSIONAL_FEATURES,
  plans: PROFESSIONAL_PLANS,
  segments: PROFESSIONAL_SEGMENTS,
  swagTiers: SWAG_TOOL_TIERS,
  getSWAGToolTier,
  canAccessSWAGTool,
  getClientLimit
};