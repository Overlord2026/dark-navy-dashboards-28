// Comprehensive persona type system for my.bfocfo.com

// Family personas
export type FamilyPersona = 
  | 'family_aspiring'
  | 'family_younger' 
  | 'family_wealthy'
  | 'family_executive'
  | 'family_retiree'
  | 'family_business_owner';

// Core professional personas
export type CoreProfessionalPersona =
  | 'pro_advisor'
  | 'pro_cpa'
  | 'pro_attorney'
  | 'pro_insurance'
  | 'pro_bank_trust';

// Healthcare sub-tracks
export type HealthcareProfessionalPersona =
  | 'pro_healthcare_influencer'
  | 'pro_healthcare_clinic'
  | 'pro_healthcare_navigator'
  | 'pro_pharmacy';

// Real estate personas
export type RealEstateProfessionalPersona = 'pro_realtor';

// Combined professional personas
export type ProfessionalPersona = 
  | CoreProfessionalPersona
  | HealthcareProfessionalPersona
  | RealEstateProfessionalPersona;

// All persona types unified
export type PersonaKind = FamilyPersona | ProfessionalPersona;

// Legacy compatibility
export type AllPersonaTypes = PersonaKind;
export type PersonaType = PersonaKind;

// Persona configuration interface
export interface PersonaConfig {
  kind: PersonaKind;
  category: 'family' | 'professional';
  label: string;
  description: string;
  scope?: string;
  primaryFeatures: string[];
  quickLinks: string[];
  dashboardLayout?: 'family' | 'professional' | 'healthcare' | 'realestate';
}

// Trust scoring types
export interface TrustScore {
  id: string;
  tenantId: string;
  professionalId: string;
  baseScore: number;
  decayFactor: number;
  streakCount: number;
  computedScore: number;
  tier: 'Standard' | 'Silver' | 'Gold' | 'Platinum';
  computedAt: Date;
  notes?: string;
}

export interface MonitoringJob {
  id: string;
  tenantId: string;
  professionalId: string;
  kind: 'trust_recompute';
  dueAt: Date;
  status: 'pending' | 'running' | 'done' | 'error';
  lastError?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Persona session tracking
export interface PersonaSession {
  id: string;
  tenantId: string;
  userId: string;
  personaId?: string;
  personaKind?: PersonaKind;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Persona configuration map
export const PERSONA_CONFIGS: Record<PersonaKind, PersonaConfig> = {
  // Family personas
  family_aspiring: {
    kind: 'family_aspiring',
    category: 'family',
    label: 'Aspiring Family',
    description: 'Building wealth and financial foundation',
    scope: 'wealth_building',
    primaryFeatures: ['Savings Plans', 'Investment Basics', 'Goal Setting'],
    quickLinks: ['/services/planning', '/services/investments', '/calculators']
  },
  family_younger: {
    kind: 'family_younger',
    category: 'family',
    label: 'Younger Family',
    description: 'Growing family with children',
    scope: 'family_growth',
    primaryFeatures: ['Budget Management', 'College Savings', '401(k) Setup'],
    quickLinks: ['/services/cash', '/solutions/education', '/dashboards']
  },
  family_wealthy: {
    kind: 'family_wealthy',
    category: 'family',
    label: 'Wealthy Family',
    description: 'High net worth family management',
    scope: 'wealth_management',
    primaryFeatures: ['Private Markets', 'Tax Coordination', 'Estate Planning'],
    quickLinks: ['/services/private-markets', '/services/taxes', '/services/estate']
  },
  family_executive: {
    kind: 'family_executive',
    category: 'family',
    label: 'Executive Family',
    description: 'Corporate executives and equity compensation',
    scope: 'executive_planning',
    primaryFeatures: ['Equity Comp', 'RSU Management', '10b5-1 Plans'],
    quickLinks: ['/solutions/equity-comp', '/solutions/tax-season', '/dashboards']
  },
  family_retiree: {
    kind: 'family_retiree',
    category: 'family',
    label: 'Retiree Family',
    description: 'Retirement and income planning',
    scope: 'retirement',
    primaryFeatures: ['Income Planning', 'RMDs', 'Healthcare'],
    quickLinks: ['/solutions/income-now', '/solutions/rmds', '/services/health']
  },
  family_business_owner: {
    kind: 'family_business_owner',
    category: 'family',
    label: 'Business Owner Family',
    description: 'Family business and exit planning',
    scope: 'business_ownership',
    primaryFeatures: ['Entity Design', 'Exit Planning', 'Cash Flow'],
    quickLinks: ['/services/entities', '/solutions/owner-exit', '/services/taxes']
  },

  // Core professional personas
  pro_advisor: {
    kind: 'pro_advisor',
    category: 'professional',
    label: 'Financial Advisor',
    description: 'Comprehensive financial planning services',
    scope: 'financial_planning',
    primaryFeatures: ['Client Management', 'Meeting Kits', 'Performance Tracking'],
    quickLinks: ['/pros/advisors', '/solutions/meetings', '/workspace/recommendations'],
    dashboardLayout: 'professional'
  },
  pro_cpa: {
    kind: 'pro_cpa',
    category: 'professional',
    label: 'CPA/Accountant',
    description: 'Tax preparation and accounting services',
    scope: 'tax_accounting',
    primaryFeatures: ['Tax Preparation', 'Client Documents', 'Compliance'],
    quickLinks: ['/solutions/tax-season', '/services/documents', '/services/entities'],
    dashboardLayout: 'professional'
  },
  pro_attorney: {
    kind: 'pro_attorney',
    category: 'professional',
    label: 'Estate Attorney',
    description: 'Estate planning and legal services',
    scope: 'legal_estate',
    primaryFeatures: ['Estate Planning', 'Trust Management', 'Document Signing'],
    quickLinks: ['/solutions/estate-gaps', '/services/estate', '/services/documents'],
    dashboardLayout: 'professional'
  },
  pro_insurance: {
    kind: 'pro_insurance',
    category: 'professional',
    label: 'Insurance Professional',
    description: 'Insurance and risk management',
    scope: 'insurance',
    primaryFeatures: ['Case Design', 'Policy Review', 'Underwriting'],
    quickLinks: ['/solutions/insurance-cases', '/solutions/policy-review', '/solutions/underwriting'],
    dashboardLayout: 'professional'
  },
  pro_bank_trust: {
    kind: 'pro_bank_trust',
    category: 'professional',
    label: 'Bank/Trust Officer',
    description: 'Trust and banking services',
    scope: 'trust_banking',
    primaryFeatures: ['Trust Management', 'Distributions', 'Compliance'],
    quickLinks: ['/solutions/distributions', '/solutions/audit', '/solutions/compliance'],
    dashboardLayout: 'professional'
  },

  // Healthcare sub-tracks
  pro_healthcare_influencer: {
    kind: 'pro_healthcare_influencer',
    category: 'professional',
    label: 'Healthcare Influencer/Advisor',
    description: 'Creates public health content; no PHI access',
    scope: 'public_advice',
    primaryFeatures: ['Content Creation', 'Public Education', 'Health Advocacy'],
    quickLinks: ['/solutions/health-content', '/solutions/public-education', '/dashboards'],
    dashboardLayout: 'healthcare'
  },
  pro_healthcare_clinic: {
    kind: 'pro_healthcare_clinic',
    category: 'professional',
    label: 'Clinic / Testing Provider',
    description: 'Orders/collects tests; manages results & billing',
    scope: 'testing_ops',
    primaryFeatures: ['Test Management', 'Results Processing', 'Billing'],
    quickLinks: ['/solutions/testing', '/solutions/results', '/solutions/billing'],
    dashboardLayout: 'healthcare'
  },
  pro_healthcare_navigator: {
    kind: 'pro_healthcare_navigator',
    category: 'professional',
    label: 'Care Navigator/Coach',
    description: 'Coordinates care plans & permissions',
    scope: 'care_plans',
    primaryFeatures: ['Care Planning', 'Patient Navigation', 'Coordination'],
    quickLinks: ['/solutions/care-plans', '/solutions/permissions', '/solutions/coordination'],
    dashboardLayout: 'healthcare'
  },
  pro_pharmacy: {
    kind: 'pro_pharmacy',
    category: 'professional',
    label: 'Pharmacy & Shots',
    description: 'Vaccines, reimbursement, inventory',
    scope: 'vaccines_ops',
    primaryFeatures: ['Vaccine Management', 'Inventory', 'Reimbursement'],
    quickLinks: ['/solutions/vaccines', '/solutions/inventory', '/solutions/reimbursement'],
    dashboardLayout: 'healthcare'
  },

  // Real estate
  pro_realtor: {
    kind: 'pro_realtor',
    category: 'professional',
    label: 'Real Estate Professional',
    description: 'Real estate services and property management',
    scope: 'real_estate',
    primaryFeatures: ['Property Management', 'Client Services', 'Market Analysis'],
    quickLinks: ['/pros/realtors', '/solutions/property', '/solutions/market-analysis'],
    dashboardLayout: 'realestate'
  }
};

// Helper functions
export const getPersonaConfig = (kind: PersonaKind): PersonaConfig => {
  return PERSONA_CONFIGS[kind];
};

export const getFamilyPersonas = (): PersonaConfig[] => {
  return Object.values(PERSONA_CONFIGS).filter(config => config.category === 'family');
};

export const getProfessionalPersonas = (): PersonaConfig[] => {
  return Object.values(PERSONA_CONFIGS).filter(config => config.category === 'professional');
};

export const getHealthcarePersonas = (): PersonaConfig[] => {
  const healthcareKinds: HealthcareProfessionalPersona[] = [
    'pro_healthcare_influencer',
    'pro_healthcare_clinic', 
    'pro_healthcare_navigator',
    'pro_pharmacy'
  ];
  return healthcareKinds.map(kind => PERSONA_CONFIGS[kind]);
};

export const isProfessionalPersona = (kind: PersonaKind): boolean => {
  return PERSONA_CONFIGS[kind].category === 'professional';
};

export const isHealthcarePersona = (kind: PersonaKind): boolean => {
  const healthcareKinds: HealthcareProfessionalPersona[] = [
    'pro_healthcare_influencer',
    'pro_healthcare_clinic',
    'pro_healthcare_navigator', 
    'pro_pharmacy'
  ];
  return healthcareKinds.includes(kind as HealthcareProfessionalPersona);
};