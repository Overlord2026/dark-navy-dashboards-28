// NIL Onboarding Types
export type NILPersonaType = 'athlete' | 'family' | 'advisor' | 'coach' | 'admin' | 'brand';

export interface NILProfile {
  id: string;
  userId: string;
  personaType: NILPersonaType;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
  athleteInfo?: {
    sport: string;
    school: string;
    year: string;
    socialHandles: Record<string, string>;
    nilDeals: number;
    isMinor: boolean;
  };
  familyInfo?: {
    relationToAthlete: string;
    permissions: string[];
    athleteId?: string;
  };
  advisorInfo?: {
    role: 'advisor' | 'coach' | 'agent';
    firm?: string;
    credentials: string[];
    licenses: string[];
    athletes: string[];
  };
  complianceInfo?: {
    documentsUploaded: string[];
    trainingsCompleted: string[];
    lastComplianceCheck: Date;
  };
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  required: boolean;
  completed: boolean;
  personaTypes: NILPersonaType[];
  component?: string;
}

export interface OnboardingFlow {
  id: string;
  personaType: NILPersonaType;
  steps: OnboardingStep[];
  currentStep: number;
  completionPercentage: number;
  estimatedTimeMinutes: number;
}

export interface PlaidConnection {
  accessToken: string;
  itemId: string;
  accountId: string;
  accountName: string;
  institutionName: string;
  accountType: 'checking' | 'savings' | 'investment';
  currentBalance: number;
  availableBalance?: number;
}

export interface DocumentUpload {
  id: string;
  fileName: string;
  fileType: string;
  uploadedAt: Date;
  category: 'identity' | 'compliance' | 'contract' | 'tax' | 'banking';
  status: 'pending' | 'verified' | 'rejected';
  url?: string;
}

export interface InviteData {
  type: 'family' | 'advisor' | 'coach';
  email: string;
  name: string;
  relationship?: string;
  permissions: string[];
  message?: string;
}