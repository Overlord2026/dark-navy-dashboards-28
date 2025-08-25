export interface EstateRule {
  state: string;
  will: {
    required: boolean;
    witnessCount: number;
    notaryRequired: boolean;
    witnesses?: number;
    notary?: boolean;
    selfProving?: boolean;
  };
  rlt: {
    allowed: boolean;
    successorTrusteeRequired: boolean;
    notary?: boolean;
    witnesses?: number;
    trusteeSuccession?: string[];
  };
  pourOver: {
    required: boolean;
    witnessCount: number;
  };
  poa: {
    required: boolean;
    notaryRequired: boolean;
    durabilityRequired: boolean;
    notary?: boolean;
    witnesses?: number;
    durability?: string;
  };
  healthcarePoa: {
    required: boolean;
    notaryRequired: boolean;
    witnessCount?: number;
  };
  advanceDirective: {
    required: boolean;
    witnessCount: number;
  };
  hipaa: {
    required: boolean;
  };
  propertyDeed: {
    allowed: string[];
    recordingRequired: boolean;
  };
  beneficiaryDesignations: {
    required: string[];
  };
  fundingRequirements: string[];
  communityProperty?: boolean;
  probateNotes?: string[];
  todPodAllowed?: boolean;
  deedPracticeNote?: string;
  probateThreshold?: number;
  homesteadExemption?: number;
  spousalElection?: boolean;
  specialNotes?: string[];
}

export interface HealthcareRule {
  state: string;
  healthcarePoa: {
    required: boolean;
    notaryRequired: boolean;
    witnessCount: number;
  };
  advanceDirective: {
    required: boolean;
    witnessCount: number;
    notaryRequired: boolean;
  };
  hipaa: {
    required: boolean;
  };
  mentalHealthAdvanceDirective?: {
    allowed: boolean;
    requirements: string[];
  };
  witnesses?: number;
  notaryRequired?: boolean;
  surrogateTerminology?: string[];
  notarizationText?: string;
  witnessEligibility?: string[];
  specialNotes?: string[];
  remoteNotaryAllowed?: boolean;
  healthcareForms?: string[];
}