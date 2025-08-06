export type ClientPersona = 'hnw_client' | 'pre_retiree' | 'next_gen' | 'family_office_admin' | 'client';

// Professional personas for service providers  
export type ProfessionalPersona = 'advisor' | 'attorney' | 'cpa' | 'insurance_agent' | 'consultant' | 'coach' | 'enterprise_admin' | 'accountant' | 'compliance' | 'imo_fmo' | 'agency' | 'organization' | 'healthcare_consultant' | 'realtor' | 'property_manager';

// Special personas for VIP and reserved profiles
export type SpecialPersona = 'vip_reserved';

// Union type for all persona types
export type AllPersonaTypes = ClientPersona | ProfessionalPersona | SpecialPersona;

// Legacy types for backward compatibility
export type PersonaType = AllPersonaTypes;

export interface PersonaConfig {
  id: ClientPersona;
  name: string;
  welcomeMessage: string;
  primaryCTA: string;
  secondaryCTA?: string;
  badgeText?: string;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
  features: {
    showLegacyVault: boolean;
    showRetirementTimeline: boolean;
    showMilestoneTracker: boolean;
    showUserManagement: boolean;
    showPrivateInvestments: boolean;
    showEducationBasics: boolean;
    showEstatePlanning: boolean;
    showAnnuityEducation: boolean;
  };
  marketplaceOrder: string[];
  educationPriority: string[];
  theme?: {
    primaryColor?: string;
    accent?: string;
  };
}

export const PERSONA_CONFIGS: Record<ClientPersona, PersonaConfig> = {
  hnw_client: {
    id: 'hnw_client',
    name: 'High Net Worth Client',
    welcomeMessage: 'Your Private Family Office is Ready, {name}!',
    primaryCTA: 'Speak to Your Private Advisor',
    badgeText: 'Premium Client',
    badgeVariant: 'default',
    features: {
      showLegacyVault: true,
      showRetirementTimeline: false,
      showMilestoneTracker: false,
      showUserManagement: false,
      showPrivateInvestments: true,
      showEducationBasics: false,
      showEstatePlanning: true,
      showAnnuityEducation: false
    },
    marketplaceOrder: ['Private Investments', 'Estate Planning', 'Tax Optimization', 'Health & Wellness'],
    educationPriority: ['Estate Planning Advanced', 'Tax Strategies', 'Private Markets', 'Wealth Preservation']
  },
  pre_retiree: {
    id: 'pre_retiree',
    name: 'Pre-Retiree',
    welcomeMessage: 'Ready for your next chapter, {name}?',
    primaryCTA: 'Meet Your Advisor for a Retirement Review',
    secondaryCTA: 'Add Retirement Goal',
    features: {
      showLegacyVault: false,
      showRetirementTimeline: true,
      showMilestoneTracker: false,
      showUserManagement: false,
      showPrivateInvestments: false,
      showEducationBasics: false,
      showEstatePlanning: false,
      showAnnuityEducation: true
    },
    marketplaceOrder: ['Retirement Planning', 'Annuities & Insurance', 'Health & Wellness', 'Estate Planning'],
    educationPriority: ['Social Security Guide', 'Retirement Income Planning', 'Healthcare Costs', 'Legacy Planning']
  },
  next_gen: {
    id: 'next_gen',
    name: 'Next-Gen/Emerging Wealth',
    welcomeMessage: "You're building your legacy, {name}!",
    primaryCTA: 'Set Your First Goal',
    secondaryCTA: 'Start Learning',
    features: {
      showLegacyVault: false,
      showRetirementTimeline: false,
      showMilestoneTracker: true,
      showUserManagement: false,
      showPrivateInvestments: false,
      showEducationBasics: true,
      showEstatePlanning: false,
      showAnnuityEducation: false
    },
    marketplaceOrder: ['Personal Finance 101', 'Investment Basics', 'Goal Setting', 'Professional Network'],
    educationPriority: ['Personal Finance 101', 'Intro to Investing', 'Building Credit', 'Emergency Fund']
  },
  family_office_admin: {
    id: 'family_office_admin',
    name: 'Family Office Admin',
    welcomeMessage: 'Coordinating for your whole family, {name}?',
    primaryCTA: 'Add Family Members',
    secondaryCTA: 'Invite Professional',
    badgeText: 'Family Admin',
    badgeVariant: 'secondary',
    features: {
      showLegacyVault: true,
      showRetirementTimeline: false,
      showMilestoneTracker: false,
      showUserManagement: true,
      showPrivateInvestments: false,
      showEducationBasics: false,
      showEstatePlanning: true,
      showAnnuityEducation: false
    },
    marketplaceOrder: ['Family Coordination', 'Document Sharing', 'Professional Services', 'Estate Planning'],
    educationPriority: ['Family Governance', 'Communication Tools', 'Legal Structure', 'Multi-Generational Planning']
  },
  client: {
    id: 'client',
    name: 'Client',
    welcomeMessage: 'Welcome to your financial future, {name}!',
    primaryCTA: 'Get Started',
    features: {
      showLegacyVault: false,
      showRetirementTimeline: false,
      showMilestoneTracker: true,
      showUserManagement: false,
      showPrivateInvestments: false,
      showEducationBasics: true,
      showEstatePlanning: false,
      showAnnuityEducation: false
    },
    marketplaceOrder: ['Getting Started', 'Professional Network', 'Investment Basics', 'Financial Planning'],
    educationPriority: ['Financial Basics', 'Investment 101', 'Goal Setting', 'Professional Guidance']
  }
};

// Legacy welcome messages for backward compatibility
export const PERSONA_WELCOME_MESSAGES = {
  hnw_client: 'Your Private Family Office is Ready, {name}!',
  pre_retiree: 'Ready for your next chapter, {name}?',
  next_gen: "You're building your legacy, {name}!",
  family_office_admin: 'Coordinating for your whole family, {name}?'
};

// Legacy function for backward compatibility
export const getPersonaFromRole = (role: string): ClientPersona => {
  if (role.includes('premium') || role.includes('hnw')) return 'hnw_client';
  if (role.includes('pre_retiree')) return 'pre_retiree';
  if (role.includes('next_gen')) return 'next_gen';
  if (role.includes('admin')) return 'family_office_admin';
  return 'hnw_client';
};