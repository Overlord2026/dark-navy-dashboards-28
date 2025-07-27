export type FiduciaryProductType = 'ltc' | 'medicare' | 'iul';

export interface ProductEducation {
  id: string;
  productType: FiduciaryProductType;
  title: string;
  subtitle: string;
  overview: string;
  howItWorks: string[];
  pros: string[];
  cons: string[];
  hiddenRisks: string[];
  fiduciaryNote: string;
}

export interface DecisionTool {
  id: string;
  productType: FiduciaryProductType;
  title: string;
  description: string;
  questions: DecisionQuestion[];
  calculatorType: 'ltc-needs' | 'medicare-eligibility' | 'iul-cost';
}

export interface DecisionQuestion {
  id: string;
  question: string;
  type: 'number' | 'select' | 'boolean' | 'range';
  options?: string[];
  required: boolean;
  helpText?: string;
}

export interface QuoteRequest {
  id: string;
  userId: string;
  productType: FiduciaryProductType;
  requestType: 'quote' | 'consultation';
  personalInfo: {
    age: number;
    state: string;
    zipCode: string;
    income?: number;
    healthStatus?: string;
  };
  productSpecific: Record<string, any>;
  preferredContact: 'phone' | 'email' | 'video';
  existingAdvisor?: string;
  shareWithFamily?: boolean;
  status: 'pending' | 'matched' | 'contacted' | 'completed';
  matchedAdvisorId?: string;
  created_at: string;
  updated_at: string;
}

export interface FiduciaryAdvisor {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  state: string;
  specialties: FiduciaryProductType[];
  licenses: string[];
  eAndO: {
    carrier: string;
    amount: number;
    expiryDate: string;
  };
  fiduciaryBadge: boolean;
  clientReviews: AdvisorReview[];
  complianceStatus: 'pending' | 'verified' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface AdvisorReview {
  id: string;
  clientName: string;
  rating: number;
  review: string;
  productType: FiduciaryProductType;
  verified: boolean;
  created_at: string;
}

export interface ComplianceAudit {
  id: string;
  quoteRequestId: string;
  advisorId: string;
  communicationType: 'initial_contact' | 'quote_delivery' | 'follow_up' | 'policy_sale';
  timestamp: string;
  details: Record<string, any>;
  complianceFlags: string[];
  created_at: string;
}