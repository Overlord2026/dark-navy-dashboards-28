export interface ProfessionalAssignment {
  id: string;
  professional_id: string;
  client_id: string;
  assigned_by: string;
  relationship: string; // 'lead_advisor' | 'service_rep' | 'cpa' | 'estate_attorney' | 'insurance' | 'health_pro'
  status: 'active' | 'pending' | 'ended';
  notes?: string;
  start_date: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface ProfessionalReview {
  id: string;
  professional_id: string;
  reviewer_id: string;
  rating: number; // 1-5
  comment?: string;
  created_at: string;
  updated_at: string;
}

export interface ProfessionalInvitation {
  id: string;
  email: string;
  invited_by: string;
  invited_as: string;
  status: 'sent' | 'accepted' | 'rejected' | 'expired';
  invite_token: string;
  expires_at: string;
  tenant_id: string;
  created_at: string;
  updated_at: string;
}

export interface ProfessionalCompliance {
  id: string;
  professional_id: string;
  doc_type: string;
  doc_url?: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  last_reviewed?: string;
  created_at: string;
  updated_at: string;
}

export interface EnhancedProfessional {
  id: string;
  name: string;
  email: string;
  type: string;
  firm?: string;
  company?: string;
  phone?: string;
  website?: string;
  address?: string;
  location?: string;
  notes?: string;
  bio?: string;
  photo_url?: string;
  verified: boolean;
  languages: string[];
  status: 'active' | 'inactive' | 'pending';
  accepting_new_clients: boolean;
  fee_model?: string;
  ratings_average: number;
  reviews_count: number;
  availability?: any;
  specialties: string[];
  certifications: string[];
  tenant_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  // Related data
  assignments?: ProfessionalAssignment[];
  reviews?: ProfessionalReview[];
  compliance?: ProfessionalCompliance[];
}

export interface TeamMember extends EnhancedProfessional {
  assignment: ProfessionalAssignment;
}

export type ProfessionalRelationship = 
  | 'lead_advisor'
  | 'service_rep' 
  | 'cpa'
  | 'estate_attorney'
  | 'trust_attorney'
  | 'insurance'
  | 'health_pro'
  | 'wellness_coach'
  | 'real_estate'
  | 'philanthropy'
  | 'travel_advisor'
  | 'property_manager'
  | 'concierge'
  | 'family_coordinator'
  | 'investment_advisor'
  | 'tax_strategist'
  | 'other';

export const PROFESSIONAL_RELATIONSHIPS: Record<ProfessionalRelationship, string> = {
  lead_advisor: 'Lead Advisor',
  service_rep: 'Client Concierge',
  cpa: 'CPA / Tax Professional',
  estate_attorney: 'Estate Attorney',
  trust_attorney: 'Trust Attorney',
  insurance: 'Insurance Specialist',
  health_pro: 'Health Professional',
  wellness_coach: 'Wellness Coach',
  real_estate: 'Real Estate Advisor',
  philanthropy: 'Charitable/Philanthropy Consultant',
  travel_advisor: 'Travel Advisor',
  property_manager: 'Property Manager',
  concierge: 'Family Concierge',
  family_coordinator: 'Family Coordinator',
  investment_advisor: 'Investment Advisor',
  tax_strategist: 'Tax Strategist',
  other: 'Other Professional'
};

// Professional categories for better organization
export const PROFESSIONAL_CATEGORIES = {
  'Advisory & Planning': ['lead_advisor', 'investment_advisor', 'tax_strategist'],
  'Legal & Tax': ['estate_attorney', 'trust_attorney', 'cpa'],
  'Health & Wellness': ['health_pro', 'wellness_coach'],
  'Property & Assets': ['real_estate', 'property_manager', 'insurance'],
  'Lifestyle & Coordination': ['service_rep', 'concierge', 'travel_advisor', 'family_coordinator'],
  'Specialized Services': ['philanthropy', 'other']
} as const;