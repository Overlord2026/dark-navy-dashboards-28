export interface EstateRule {
  state: string;
  will: {
    required: boolean;
    witnessCount: number;
    notaryRequired: boolean;
  };
  rlt: {
    allowed: boolean;
    successorTrusteeRequired: boolean;
  };
  pourOver: {
    required: boolean;
    witnessCount: number;
  };
  poa: {
    required: boolean;
    notaryRequired: boolean;
    durabilityRequired: boolean;
  };
  healthcarePoa: {
    required: boolean;
    notaryRequired: boolean;
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
}