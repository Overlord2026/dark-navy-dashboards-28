export interface WhiteLabelConfig {
  companyName: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  customDomain?: string;
  welcomeMessage?: string;
  customSteps?: OnboardingStepConfig[];
  pricingTier: 'starter' | 'professional' | 'enterprise';
  features: {
    aiAssistant: boolean;
    documentOcr: boolean;
    digitalSignature: boolean;
    apiIntegrations: boolean;
    customBranding: boolean;
    multiCustodian: boolean;
  };
}

export interface OnboardingStepConfig {
  id: string;
  name: string;
  title: string;
  description: string;
  enabled: boolean;
  required: boolean;
  order: number;
  customFields?: any[];
}

export interface ReferralInfo {
  type: 'direct' | 'advisor' | 'cpa' | 'attorney' | 'partner';
  referrerName?: string;
  referrerId?: string;
  referrerFirm?: string;
  referrerEmail?: string;
  referralCode?: string;
  partnerTier?: string;
}

export interface OnboardingStepData {
  welcome?: {
    brandSettings?: WhiteLabelConfig;
    referralInfo?: ReferralInfo;
  };
  clientInfo?: {
    primaryClient: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      dateOfBirth?: string;
      ssn?: string;
      citizenship?: string;
      maritalStatus?: string;
    };
    householdMembers?: Array<{
      firstName: string;
      lastName: string;
      relationship: string;
      dateOfBirth?: string;
      ssn?: string;
    }>;
    address?: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  custodianSelection?: {
    selectedCustodians: string[];
    accountTypes: Array<{
      custodian: string;
      accountType: string;
      transferAmount?: number;
      currentInstitution?: string;
    }>;
  };
  documents?: {
    uploaded: Array<{
      id: string;
      name: string;
      type: string;
      url: string;
      extractedData?: any;
      ocrStatus?: 'pending' | 'completed' | 'failed';
    }>;
    required: string[];
  };
  digitalApplication?: {
    applications: Array<{
      custodian: string;
      accountType: string;
      status: 'pending' | 'submitted' | 'approved' | 'rejected';
      applicationId?: string;
      docusignEnvelopeId?: string;
      signatureUrl?: string;
    }>;
  };
  compliance?: {
    kycStatus: 'pending' | 'passed' | 'failed';
    amlStatus: 'pending' | 'passed' | 'failed';
    ofacStatus: 'pending' | 'passed' | 'failed';
    riskProfile?: string;
  };
  pricing?: {
    selectedTier: string;
    monthlyFee: number;
    setupFee: number;
    features: string[];
  };
}

export interface OnboardingState extends OnboardingStepData {
  currentStep: number;
  totalSteps: number;
  progressPercentage: number;
  status: 'in_progress' | 'completed' | 'needs_attorney' | 'assigned' | 'stalled' | 'pending_signature';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedAdvisor?: string;
  referralInfo?: ReferralInfo;
  whiteLabelConfig?: WhiteLabelConfig;
  customStepsConfig?: OnboardingStepConfig[];
  createdAt: string;
  updatedAt: string;
  estimatedCompletion?: string;
}

export interface AIAssistantMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: {
    stepContext?: number;
    actionRequired?: boolean;
    documents?: string[];
    suggestedActions?: string[];
    urgency?: 'low' | 'medium' | 'high';
  };
}

export interface AIAssistantCapabilities {
  conversationalHelp: boolean;
  documentParsing: boolean;
  progressTracking: boolean;
  proactiveReminders: boolean;
  escalationToHuman: boolean;
}

export interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  assignee?: 'client' | 'advisor' | 'admin';
  metadata?: any;
}

export type CustodianType = 'schwab' | 'fidelity' | 'altruist' | 'ibkr' | 'other';

export interface CustodianConfig {
  id: CustodianType;
  name: string;
  logo?: string;
  apiSupported: boolean;
  accountTypes: string[];
  supportedFeatures: {
    digitalApplication: boolean;
    acatsTransfer: boolean;
    docusignIntegration: boolean;
    realTimeStatus: boolean;
  };
}

export interface AdvisorDashboardFilter {
  status?: string[];
  priority?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  assignedTo?: string;
}

export interface ComplianceCheck {
  id: string;
  type: 'kyc' | 'aml' | 'ofac' | 'risk_assessment';
  status: 'pending' | 'passed' | 'failed' | 'manual_review';
  result?: any;
  performedAt?: string;
  performedBy?: string;
  notes?: string;
}