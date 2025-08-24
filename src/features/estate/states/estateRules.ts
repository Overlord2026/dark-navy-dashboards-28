export type EstateRule = {
  code: string;                      // 'CA','TX','FL',...
  will: { witnesses:number; notary:boolean; selfProving?:boolean };
  rlt:  { notary:boolean; spousalConsents?:boolean };
  pourOver: { witnesses:number; notary:boolean };
  poa:  { notary:boolean };
  probateNotes?: string;             // e.g., small estate procedures
  communityProperty?: boolean;
  todPodAllowed?: boolean;
  deedPracticeNote?: string;         // deed guidance (attorney-only drafting)
};

export type HealthcareRule = {
  code: string;                                 // e.g., 'FL', 'TX'
  witnesses: number;                            // e.g., 2 for Advance Directive
  notaryRequired: boolean;                      // is notarization required for HC POA/AD?
  selfProvingAffidavit?: boolean;               // if supported for HC docs
  remoteNotaryAllowed?: boolean;                // RON permitted?
  healthcareForms: ('AdvanceDirective'|'LivingWill'|'HealthcarePOA'|'HIPAA'|'Surrogate')[];
  surrogateTerminology?: string;                // e.g., 'Health Care Proxy' (NY)
  specialNotes?: string;                        // e.g., community property or hospital policy nuance
  notarizationText?: string;                    // state-specific jurat/ack block
  witnessEligibility?: string;                  // e.g., "No treating physician; notary cannot be a witness"
};

export const ESTATE_RULES: Record<string,EstateRule> = {
  'CA': {
    code: 'CA',
    will: { witnesses: 2, notary: false, selfProving: true },
    rlt: { notary: true, spousalConsents: true },
    pourOver: { witnesses: 2, notary: false },
    poa: { notary: true },
    probateNotes: 'Small estate procedures available; county-level nuances.',
    communityProperty: true,
    todPodAllowed: true,
    deedPracticeNote: 'Confirm county margin requirements.'
  },
  'TX': {
    code: 'TX',
    will: { witnesses: 2, notary: false, selfProving: true },
    rlt: { notary: true },
    pourOver: { witnesses: 2, notary: false },
    poa: { notary: true },
    probateNotes: 'Muniment of title option in some cases.',
    communityProperty: true,
    todPodAllowed: true,
    deedPracticeNote: 'Margin/format varies by county.'
  },
  'FL': {
    code: 'FL',
    will: { witnesses: 2, notary: false, selfProving: true },
    rlt: { notary: true },
    pourOver: { witnesses: 2, notary: false },
    poa: { notary: true },
    probateNotes: 'Specific witness eligibility applies; confirm hospital policies for healthcare docs.',
    communityProperty: false,
    todPodAllowed: true,
    deedPracticeNote: 'Enhanced life estate deeds common; confirm county acceptance.'
  },
  'NY': {
    code: 'NY',
    will: { witnesses: 2, notary: false, selfProving: true },
    rlt: { notary: true },
    pourOver: { witnesses: 2, notary: false },
    poa: { notary: true },
    probateNotes: 'Use "Health Care Proxy" terminology for healthcare; TOD deed availability verify.',
    communityProperty: false,
    todPodAllowed: false,
    deedPracticeNote: 'County formatting strict; confirm.'
  },
  'PA': {
    code: 'PA',
    will: { witnesses: 2, notary: false, selfProving: true },
    rlt: { notary: true },
    pourOver: { witnesses: 2, notary: false },
    poa: { notary: true },
    probateNotes: 'Self-proving affidavit recommended.',
    communityProperty: false,
    todPodAllowed: true,
    deedPracticeNote: 'Verify transfer tax & local subset.'
  },
  'IL': {
    code: 'IL',
    will: { witnesses: 2, notary: false, selfProving: true },
    rlt: { notary: true },
    pourOver: { witnesses: 2, notary: false },
    poa: { notary: true },
    probateNotes: 'Check local practices; TOD deed availability verify.',
    communityProperty: false,
    todPodAllowed: true,
    deedPracticeNote: 'County-by-county format differences.'
  },
  'OH': {
    code: 'OH',
    will: { witnesses: 2, notary: false, selfProving: true },
    rlt: { notary: true },
    pourOver: { witnesses: 2, notary: false },
    poa: { notary: true },
    probateNotes: 'Confirm TOD deed; county acceptance varies.',
    communityProperty: false,
    todPodAllowed: true,
    deedPracticeNote: 'Margin/format likely enforced.'
  },
  'GA': {
    code: 'GA',
    will: { witnesses: 2, notary: false, selfProving: true },
    rlt: { notary: true },
    pourOver: { witnesses: 2, notary: false },
    poa: { notary: true },
    probateNotes: 'Witness eligibility; TOD deeds limited/verify.',
    communityProperty: false,
    todPodAllowed: false,
    deedPracticeNote: 'Attorney practice varies; verify taxes.'
  },
  'NC': {
    code: 'NC',
    will: { witnesses: 2, notary: false, selfProving: true },
    rlt: { notary: true },
    pourOver: { witnesses: 2, notary: false },
    poa: { notary: true },
    probateNotes: 'Some counties accept TOD; verify current law.',
    communityProperty: false,
    todPodAllowed: false,
    deedPracticeNote: 'Margins & indexing strict; verify.'
  },
  'MI': {
    code: 'MI',
    will: { witnesses: 2, notary: false, selfProving: true },
    rlt: { notary: true },
    pourOver: { witnesses: 2, notary: false },
    poa: { notary: true },
    probateNotes: 'Enhanced life estate deed ("Lady Bird") recognized; confirm recording detail.',
    communityProperty: false,
    todPodAllowed: true,
    deedPracticeNote: 'County format differences apply.'
  },
  'DEFAULT': {
    code: 'DEFAULT',
    will: { witnesses: 2, notary: false },
    rlt: { notary: true },
    pourOver: { witnesses: 2, notary: false },
    poa: { notary: true }
  }
};

export const HEALTH_RULES: Record<string, HealthcareRule> = {
  'CA': {
    code: 'CA',
    witnesses: 2,
    notaryRequired: false,
    selfProvingAffidavit: true,
    remoteNotaryAllowed: true,
    healthcareForms: ['AdvanceDirective', 'HealthcarePOA', 'HIPAA'],
    surrogateTerminology: 'Health Care Agent',
    notarizationText: 'State of California, County of ___________\nSubscribed and sworn before me this _____ day of _______, 20__.',
    witnessEligibility: 'No treating physician; witnesses must be adults'
  },
  'TX': {
    code: 'TX',
    witnesses: 2,
    notaryRequired: true,
    remoteNotaryAllowed: true,
    healthcareForms: ['AdvanceDirective', 'HealthcarePOA', 'HIPAA', 'LivingWill'],
    surrogateTerminology: 'Health Care Agent',
    notarizationText: 'State of Texas, County of ___________\nAcknowledged before me this _____ day of _______, 20__.',
    witnessEligibility: 'No treating physician; notary cannot serve as witness'
  },
  'FL': {
    code: 'FL',
    witnesses: 2,
    notaryRequired: true,
    remoteNotaryAllowed: true,
    healthcareForms: ['LivingWill', 'HealthcarePOA', 'HIPAA', 'Surrogate'],
    surrogateTerminology: 'Health Care Surrogate',
    specialNotes: 'Florida requires separate Living Will and Health Care Surrogate documents',
    notarizationText: 'State of Florida, County of ___________\nSworn to and subscribed before me this _____ day of _______, 20__.',
    witnessEligibility: 'No spouse, blood relative, or beneficiary as witness'
  },
  'NY': {
    code: 'NY',
    witnesses: 2,
    notaryRequired: false,
    remoteNotaryAllowed: false,
    healthcareForms: ['AdvanceDirective', 'HealthcarePOA', 'HIPAA'],
    surrogateTerminology: 'Health Care Proxy',
    specialNotes: 'New York uses Health Care Proxy terminology',
    witnessEligibility: 'No treating physician or facility operator as witness'
  },
  'DEFAULT': {
    code: 'DEFAULT',
    witnesses: 2,
    notaryRequired: true,
    healthcareForms: ['AdvanceDirective', 'HealthcarePOA', 'HIPAA'],
    surrogateTerminology: 'Health Care Agent'
  }
};

export function useEstateRules(state: string): EstateRule {
  return ESTATE_RULES[state] || ESTATE_RULES['DEFAULT'];
}

export function useHealthcareRules(stateCode: string): HealthcareRule {
  return HEALTH_RULES[stateCode] || HEALTH_RULES['DEFAULT'];
}