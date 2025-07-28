export interface PartnerApplication {
  id: string;
  partner_name: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected' | 'pending_documents';
  submitted_at: string;
  approved_at?: string;
  compliance_status: 'pending' | 'approved' | 'failed' | 'under_review';
  onboarding_docs: string[];
  business_type?: string;
  license_number?: string;
  website_url?: string;
  contact_person?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  loan_products?: string[];
  minimum_loan_amount?: number;
  maximum_loan_amount?: number;
  tenant_id?: string;
  created_at: string;
  updated_at: string;
}

export interface LoanDocument {
  id: string;
  loan_id?: string;
  user_id: string;
  doc_type: string;
  file_url: string;
  file_name?: string;
  file_size?: number;
  status: 'pending' | 'verified' | 'rejected' | 'expired';
  uploaded_at: string;
  verified_at?: string;
  verified_by?: string;
  expiry_date?: string;
  notes?: string;
  tenant_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ComplianceCheck {
  id: string;
  entity_type: 'user' | 'partner_application' | 'loan' | 'partner';
  entity_id: string;
  check_type: string;
  status: 'pending' | 'passed' | 'failed' | 'expired';
  performed_by?: string;
  performed_at: string;
  notes?: string;
  compliance_data?: Record<string, any>;
  risk_score?: number;
  expiry_date?: string;
  tenant_id?: string;
  created_at: string;
  updated_at: string;
}

export interface PartnerOnboardingRequest {
  partnerName: string;
  email: string;
  businessType: string;
  licenseNumber?: string;
  websiteUrl?: string;
  contactPerson: string;
  phone: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  loanProducts: string[];
  minimumLoanAmount?: number;
  maximumLoanAmount?: number;
}

export interface ProcessApplicationRequest {
  applicationId: string;
  action: 'approve' | 'reject' | 'request_documents';
  notes?: string;
}

export const DOCUMENT_TYPES = {
  INCOME_STATEMENT: 'income_statement',
  BANK_STATEMENT: 'bank_statement',
  TAX_RETURN: 'tax_return',
  EMPLOYMENT_VERIFICATION: 'employment_verification',
  ID_DOCUMENT: 'id_document',
  CREDIT_REPORT: 'credit_report',
  ASSET_VERIFICATION: 'asset_verification',
  DEBT_VERIFICATION: 'debt_verification',
  LOAN_APPLICATION: 'loan_application',
  BUSINESS_LICENSE: 'business_license',
  FINANCIAL_STATEMENT: 'financial_statement'
} as const;

export const COMPLIANCE_CHECK_TYPES = {
  INITIAL_SUBMISSION: 'initial_submission',
  INITIAL_REVIEW: 'initial_review',
  INITIAL_APPROVAL: 'initial_approval',
  DOCUMENT_VERIFICATION: 'document_verification',
  CREDIT_CHECK: 'credit_check',
  INCOME_VERIFICATION: 'income_verification',
  IDENTITY_VERIFICATION: 'identity_verification',
  REGULATORY_COMPLIANCE: 'regulatory_compliance',
  RISK_ASSESSMENT: 'risk_assessment'
} as const;

export type DocumentType = typeof DOCUMENT_TYPES[keyof typeof DOCUMENT_TYPES];
export type ComplianceCheckType = typeof COMPLIANCE_CHECK_TYPES[keyof typeof COMPLIANCE_CHECK_TYPES];