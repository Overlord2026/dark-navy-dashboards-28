export type FamilySegment = "aspiring" | "retirees" | "hnw" | "uhnw";
export type PlanTier = "basic" | "premium" | "elite";
export type SubscriptionTier = PlanTier;

export interface Entitlement { 
  key: string; 
  label: string; 
  plans: PlanTier[]; 
  segments?: FamilySegment[]; 
}

export interface QuickAction {
  id: string;
  name: string;
  description: string;
  icon: string;
  requiredTier: SubscriptionTier;
}

export interface FamilyCard {
  id: string;
  name: string;
  description: string;
  category: string;
  requiredTier: SubscriptionTier;
  segments: FamilySegment[];
  quotas?: {
    basic?: number;
    premium?: number;
    elite?: number;
  };
}

export const quickActions: QuickAction[] = [
  {
    id: 'link-accounts',
    name: 'Link Accounts',
    description: 'Connect your financial accounts',
    icon: 'Link',
    requiredTier: 'basic'
  },
  {
    id: 'upload-doc',
    name: 'Upload a Doc',
    description: 'Upload and organize documents',
    icon: 'Upload',
    requiredTier: 'basic'
  },
  {
    id: 'create-goal',
    name: 'Create a Goal',
    description: 'Set and track financial goals',
    icon: 'Target',
    requiredTier: 'basic'
  },
  {
    id: 'run-swag',
    name: 'Run SWAG™',
    description: 'Scientific Wild Asset Guess analysis',
    icon: 'TrendingUp',
    requiredTier: 'premium'
  },
  {
    id: 'run-monte-carlo',
    name: 'Run Monte Carlo',
    description: 'Advanced portfolio simulation',
    icon: 'BarChart3',
    requiredTier: 'premium'
  },
  {
    id: 'invite-pro',
    name: 'Invite a Pro',
    description: 'Connect with financial professionals',
    icon: 'UserPlus',
    requiredTier: 'basic'
  }
];

export const familyCards: FamilyCard[] = [
  // Basic tier cards
  {
    id: 'accounts-overview',
    name: 'Accounts Overview',
    description: 'View all your financial accounts in one place',
    category: 'Basic Tools',
    requiredTier: 'basic',
    segments: ['aspiring', 'retirees', 'hnw', 'uhnw']
  },
  {
    id: 'goal-tracking',
    name: 'Goal Tracking',
    description: 'Set and monitor your financial goals',
    category: 'Basic Tools',
    requiredTier: 'basic',
    segments: ['aspiring', 'retirees', 'hnw', 'uhnw']
  },
  {
    id: 'document-vault',
    name: 'Document Vault',
    description: 'Secure document storage and management',
    category: 'Basic Tools',
    requiredTier: 'basic',
    segments: ['aspiring', 'retirees', 'hnw', 'uhnw'],
    quotas: { basic: 50, premium: 500, elite: 999 }
  },
  {
    id: 'cash-transfers',
    name: 'Cash & Transfers',
    description: 'Manage cash flow and transfers',
    category: 'Basic Tools',
    requiredTier: 'basic',
    segments: ['aspiring', 'retirees', 'hnw', 'uhnw']
  },

  // Premium/Elite guarded cards
  {
    id: 'vault-advanced',
    name: 'Vault Advanced',
    description: 'Advanced document management with AI indexing',
    category: 'Advanced Features',
    requiredTier: 'premium',
    segments: ['hnw', 'uhnw'],
    quotas: { premium: 1000, elite: 999 }
  },
  {
    id: 'properties',
    name: 'Properties',
    description: 'Real estate portfolio management',
    category: 'Advanced Features',
    requiredTier: 'premium',
    segments: ['retirees', 'hnw', 'uhnw']
  },
  {
    id: 'estate-advanced',
    name: 'Estate Advanced',
    description: 'Comprehensive estate planning tools',
    category: 'Advanced Features',
    requiredTier: 'premium',
    segments: ['hnw', 'uhnw']
  },
  {
    id: 'tax-advanced',
    name: 'Tax Advanced',
    description: 'Advanced tax planning and optimization',
    category: 'Advanced Features',
    requiredTier: 'premium',
    segments: ['retirees', 'hnw', 'uhnw']
  },
  {
    id: 'e-sign-ron-ipen',
    name: 'e-Sign (RON/IPEN)',
    description: 'Remote online notarization and e-signatures',
    category: 'Premium Services',
    requiredTier: 'elite',
    segments: ['hnw', 'uhnw']
  },
  {
    id: 'concierge',
    name: 'Concierge',
    description: 'Dedicated concierge services',
    category: 'Premium Services',
    requiredTier: 'elite',
    segments: ['uhnw']
  }
];

export const tierPricing = {
  basic: {
    id: 'basic',
    name: 'Basic',
    price: 29,
    description: 'Essential family financial tools',
    features: [
      'Accounts Overview',
      'Goal Tracking', 
      'Document Vault (50 docs)',
      'Cash & Transfers',
      'Basic Support'
    ]
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 99,
    description: 'Advanced family office features',
    features: [
      'Everything in Basic',
      'Vault Advanced (1000 docs)',
      'Properties Management',
      'Estate Planning Tools',
      'Tax Optimization',
      'SWAG™ Analysis',
      'Monte Carlo Simulations',
      'Priority Support'
    ]
  },
  elite: {
    id: 'elite',
    name: 'Elite',
    price: 299,
    description: 'Full family office experience',
    features: [
      'Everything in Premium',
      'Unlimited Document Storage',
      'RON/IPEN e-Signatures',
      'Dedicated Concierge',
      'Family Office Services',
      'White-glove Support'
    ]
  }
} as const;