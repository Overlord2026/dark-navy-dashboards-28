import { ALL_STATES_DC, conservativeEstateRule, conservativeHealthRule } from './registry';

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
  'NJ': {
    code: 'NJ',
    will: { witnesses: 2, notary: false, selfProving: true },
    rlt: { notary: true },
    pourOver: { witnesses: 2, notary: false },
    poa: { notary: true },
    probateNotes: 'Self-proving affidavit recommended; county practices vary.',
    communityProperty: false,
    todPodAllowed: true,
    deedPracticeNote: 'Verify TOD deed availability and county transfer tax.'
  },
  'VA': {
    code: 'VA',
    will: { witnesses: 2, notary: false, selfProving: true },
    rlt: { notary: true },
    pourOver: { witnesses: 2, notary: false },
    poa: { notary: true },
    probateNotes: 'Witness eligibility applies; confirm county formatting.',
    communityProperty: false,
    todPodAllowed: true,
    deedPracticeNote: 'Margin rules vary by county.'
  },
  'WA': {
    code: 'WA',
    will: { witnesses: 2, notary: false, selfProving: true },
    rlt: { notary: true },
    pourOver: { witnesses: 2, notary: false },
    poa: { notary: true },
    probateNotes: 'Community property agreement may affect titling.',
    communityProperty: true,
    todPodAllowed: true,
    deedPracticeNote: 'APN format and margins enforced in many counties.'
  },
  'AZ': {
    code: 'AZ',
    will: { witnesses: 2, notary: false, selfProving: true },
    rlt: { notary: true },
    pourOver: { witnesses: 2, notary: false },
    poa: { notary: true },
    probateNotes: 'Community property; beneficiary deed statutes present.',
    communityProperty: true,
    todPodAllowed: true,
    deedPracticeNote: 'County e-record common; confirm transfer fee.'
  },
  'MA': {
    code: 'MA',
    will: { witnesses: 2, notary: false, selfProving: true },
    rlt: { notary: true },
    pourOver: { witnesses: 2, notary: false },
    poa: { notary: true },
    probateNotes: '"Health Care Proxy" terminology for healthcare; confirm TOD real property availability.',
    communityProperty: false,
    todPodAllowed: false,
    deedPracticeNote: 'Strict recording margins; confirm RPT rules.'
  },
  'TN': {
    code: 'TN',
    will: { witnesses: 2, notary: false, selfProving: true },
    rlt: { notary: true },
    pourOver: { witnesses: 2, notary: false },
    poa: { notary: true },
    probateNotes: 'County fees vary; confirm witness eligibility.',
    communityProperty: false,
    todPodAllowed: true,
    deedPracticeNote: 'Margins and indexing varied.'
  },
  'IN': {
    code: 'IN',
    will: { witnesses: 2, notary: false, selfProving: true },
    rlt: { notary: true },
    pourOver: { witnesses: 2, notary: false },
    poa: { notary: true },
    probateNotes: 'TOD deeds recognized; verify county acceptance.',
    communityProperty: false,
    todPodAllowed: true,
    deedPracticeNote: 'APN required in many counties.'
  },
  'MO': {
    code: 'MO',
    will: { witnesses: 2, notary: false, selfProving: true },
    rlt: { notary: true },
    pourOver: { witnesses: 2, notary: false },
    poa: { notary: true },
    probateNotes: 'Beneficiary deeds supported; review county tax.',
    communityProperty: false,
    todPodAllowed: true,
    deedPracticeNote: 'Margins/format vary by county.'
  },
  'MD': {
    code: 'MD',
    will: { witnesses: 2, notary: false, selfProving: true },
    rlt: { notary: true },
    pourOver: { witnesses: 2, notary: false },
    poa: { notary: true },
    probateNotes: 'County transfer/recordation taxes common.',
    communityProperty: false,
    todPodAllowed: true,
    deedPracticeNote: 'First-page cover conventions vary; confirm.'
  },
  'WI': {
    code: 'WI',
    will: { witnesses: 2, notary: false, selfProving: true },
    rlt: { notary: true },
    pourOver: { witnesses: 2, notary: false },
    poa: { notary: true },
    probateNotes: 'Marital property system akin to community property.',
    communityProperty: true,
    todPodAllowed: true,
    deedPracticeNote: 'APN and margins enforced; check municipal fees.'
  },

  'DEFAULT': {
    code: 'DEFAULT',
    will: { witnesses: 2, notary: false },
    rlt: { notary: true },
    pourOver: { witnesses: 2, notary: false },
    poa: { notary: true }
  }
};

// Add remaining states with conservative defaults - two-step to avoid TDZ
for (const s of ALL_STATES_DC) {
  if (!(s in ESTATE_RULES)) {
    ESTATE_RULES[s] = conservativeEstateRule(s);
  }
}

export function getEstateRule(state: string): EstateRule {
  return ESTATE_RULES[state] || ESTATE_RULES['DEFAULT'];
}

export function getAllEstateStates(): string[] {
  return Object.keys(ESTATE_RULES).filter(k => k !== 'DEFAULT');
}

export function useEstateRules(state: string): EstateRule {
  return ESTATE_RULES[state] || ESTATE_RULES['DEFAULT'];
}

export function useHealthcareRules(stateCode: string): HealthcareRule {
  const { getHealthRule } = require('./healthRules');
  return getHealthRule(stateCode) || getHealthRule('DEFAULT');
}