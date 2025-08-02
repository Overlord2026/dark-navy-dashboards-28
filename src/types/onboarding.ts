export interface OnboardingStepData {
  welcome?: {
    brandSettings?: {
      logo?: string;
      primaryColor?: string;
      welcomeMessage?: string;
    };
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
    }>;
  };
  compliance?: {
    kycStatus: 'pending' | 'passed' | 'failed';
    amlStatus: 'pending' | 'passed' | 'failed';
    ofacStatus: 'pending' | 'passed' | 'failed';
    riskProfile?: string;
  };
}

export interface OnboardingState extends OnboardingStepData {
  currentStep: number;
  totalSteps: number;
  progressPercentage: number;
  status: 'in_progress' | 'completed' | 'needs_attorney' | 'assigned';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedAdvisor?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AIAssistantMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
  metadata?: {
    stepContext?: number;
    actionRequired?: boolean;
    documents?: string[];
  };
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