
export type ProfessionalType = 
  // Existing types
  | "Tax Professional / Accountant"
  | "Estate Planning Attorney"
  | "Financial Advisor"
  | "Real Estate Agent / Property Manager"
  | "Insurance / LTC Specialist"
  | "Mortgage Broker"
  | "Auto Insurance Provider"
  | "Physician"
  | "Dentist"
  | "Banker"
  | "Consultant"
  | "Service Professional"
  // New wealth segment professional types
  | "Private Banker / Trust Officer"
  | "Estate Planning Consultant"
  | "Business Succession Advisor"
  | "Insurance & Advanced Planning Specialist"
  | "Property Manager / Real Estate Specialist"
  | "Philanthropy Consultant"
  | "Healthcare Advocate"
  | "Luxury Concierge / Travel Specialist"
  | "Divorce / Family Law Advisor"
  | "Platform Aggregator / MFO"
  | "Retirement Plan Advisor"
  | "Private Lender / Credit Specialist"
  | "Family Investment Club Lead"
  | "VC / Private Equity Professional"
  | "Tax Resolution Specialist"
  | "HR / Benefit Consultant"
  | "Other";

// Professional segment categorization
export type ProfessionalSegment = 
  | 'wealth_management'
  | 'legal_advisory'
  | 'tax_compliance'
  | 'insurance_planning'
  | 'real_estate'
  | 'philanthropy'
  | 'healthcare'
  | 'luxury_services'
  | 'investment_management'
  | 'business_advisory'
  | 'family_office';

export interface Professional {
  id: string;
  name: string;
  type: ProfessionalType;
  segment?: ProfessionalSegment;
  company?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  notes?: string;
  rating?: number;
  specialties?: string[];
  certifications?: string[];
  custom_fields?: Record<string, any>;
  external_verification_id?: string;
  external_review_score?: number;
  featured?: boolean;
  sponsored?: boolean;
  show_email?: boolean;
  show_phone?: boolean;
  scheduling_url?: string;
  // New fields for wealth segment professionals
  min_client_assets?: number;
  typical_engagement_fee?: string;
  aum_minimums?: number;
  license_states?: string[];
  practice_areas?: string[];
  client_capacity?: number;
  accepts_referrals?: boolean;
  referral_fee_structure?: string;
  onboarding_process?: string;
  compliance_status?: 'pending' | 'verified' | 'flagged';
  marketplace_tier?: 'standard' | 'premium' | 'elite';
}

// Professional dashboard configuration
export interface ProfessionalDashboardConfig {
  segment: ProfessionalSegment;
  widgets: string[];
  permissions: string[];
  referral_settings: {
    accepts_inbound: boolean;
    accepts_outbound: boolean;
    fee_structure: string;
  };
  onboarding_steps: string[];
  required_documents: string[];
  compliance_requirements: string[];
}
