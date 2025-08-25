export interface EstateRule {
  state: string;
  will: {
    witnesses: number;
    notary: boolean;
    selfProving: boolean;
  };
  rlt: {
    witnesses: number;
    notary: boolean;
    trusteeSuccession: string[];
  };
  poa: {
    witnesses: number;
    notary: boolean;
    durability: 'automatic' | 'specific' | 'none';
  };
  pourOver: boolean;
  communityProperty: boolean;
  probateThreshold: number;
  probateNotes: string[];
  homesteadExemption: number;
  spousalElection: boolean;
  specialNotes: string[];
}

export interface HealthcareRule {
  state: string;
  healthcarePoa: {
    witnesses: number;
    notary: boolean;
  };
  advanceDirective: {
    witnesses: number;
    notary: boolean;
  };
  hipaa: {
    required: boolean;
    witnesses: number;
  };
  witnesses: number;
  notaryRequired: boolean;
  surrogateTerminology: string;
  notarizationText: string;
  witnessEligibility: string;
  specialNotes: string;
  remoteNotaryAllowed: boolean;
  healthcareForms: string[];
}

const ESTATE_RULES: Record<string, EstateRule> = {
  'CA': {
    state: 'CA',
    will: { witnesses: 2, notary: false, selfProving: true },
    rlt: { witnesses: 0, notary: true, trusteeSuccession: ['Successor Trustee', 'Alternate'] },
    poa: { witnesses: 0, notary: true, durability: 'automatic' },
    pourOver: true,
    communityProperty: true,
    probateThreshold: 184500,
    probateNotes: ['Community property state', 'Simplified small estate procedures available'],
    homesteadExemption: 600000,
    spousalElection: false,
    specialNotes: ['Consider AB Trust for larger estates']
  },
  'NY': {
    state: 'NY',
    will: { witnesses: 2, notary: false, selfProving: true },
    rlt: { witnesses: 0, notary: true, trusteeSuccession: ['Successor Trustee'] },
    poa: { witnesses: 2, notary: true, durability: 'specific' },
    pourOver: true,
    communityProperty: false,
    probateThreshold: 50000,
    probateNotes: ['Complex probate procedures', 'Estate tax considerations'],
    homesteadExemption: 170825,
    spousalElection: true,
    specialNotes: ['SCPA requirements', 'Elective share: 1/3 of estate']
  }
};

const HEALTHCARE_RULES: Record<string, HealthcareRule> = {
  'CA': {
    state: 'CA',
    healthcarePoa: { witnesses: 2, notary: false },
    advanceDirective: { witnesses: 2, notary: false },
    hipaa: { required: true, witnesses: 0 },
    witnesses: 2,
    notaryRequired: false,
    surrogateTerminology: 'Health Care Agent',
    notarizationText: 'State of California notarization block',
    witnessEligibility: 'Adults who are not healthcare providers',
    specialNotes: 'POLST recommended for terminally ill patients',
    remoteNotaryAllowed: true,
    healthcareForms: ['Healthcare POA', 'Advance Directive', 'HIPAA Authorization']
  },
  'NY': {
    state: 'NY',
    healthcarePoa: { witnesses: 2, notary: true },
    advanceDirective: { witnesses: 2, notary: true },
    hipaa: { required: true, witnesses: 0 },
    witnesses: 2,
    notaryRequired: true,
    surrogateTerminology: 'Health Care Proxy',
    notarizationText: 'New York State notarization requirements',
    witnessEligibility: 'Adults who are not related by blood or marriage',
    specialNotes: 'Health Care Proxy Act requirements',
    remoteNotaryAllowed: false,
    healthcareForms: ['Health Care Proxy', 'Living Will', 'HIPAA Authorization']
  }
};

export function getEstateRule(state: string): EstateRule {
  return ESTATE_RULES[state.toUpperCase()] || ESTATE_RULES['CA'];
}

export function getHealthcareRule(state: string): HealthcareRule {
  return HEALTHCARE_RULES[state.toUpperCase()] || HEALTHCARE_RULES['CA'];
}

export { ESTATE_RULES, HEALTHCARE_RULES };