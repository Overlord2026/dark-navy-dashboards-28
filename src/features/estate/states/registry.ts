import type { DeedType } from '../deeds/stateDeedRules';

export const ALL_STATES_DC = [
  'AL','AK','AR','CO','CT','DE','DC','HI','IA','ID','KS','KY','LA','ME','MN','MS','MT','NE','NV','NH','NM','ND','OK','OR','RI','SC','SD','UT','VT','WV','WY'
  // (leave out the 20 states already seeded: CA, TX, FL, NY, PA, IL, OH, GA, NC, MI, NJ, VA, WA, AZ, MA, TN, IN, MO, MD, WI)
];

export const COMMUNITY_PROPERTY_STATES = ['AZ','CA','ID','LA','NV','NM','TX','WA','WI'];

export function conservativeEstateRule(code: string) {
  const cp = COMMUNITY_PROPERTY_STATES.includes(code);
  return {
    code,
    will: { witnesses: 2, notary: false, selfProving: true },
    rlt: { notary: true },
    pourOver: { witnesses: 2, notary: false },
    poa: { notary: true },
    probateNotes: 'Verify county practices; self-proving affidavit recommended.',
    communityProperty: cp,
    todPodAllowed: false,           // TODO: verify TOD/TODD for this state
    deedPracticeNote: 'Placeholder; confirm margins/transfer tax with counsel.'
  };
}

export function conservativeDeedRule(code: string) {
  return {
    code,
    allowed: ['Warranty', 'SpecialWarranty', 'Quitclaim'] as DeedType[],   // baseline
    witnesses: 0, 
    notary: true,
    todAvailable: false, 
    ladyBirdAvailable: false,          // TODO: verify
    eRecordingLikely: false,
    marginRules: 'Top margin ~3" (verify county).',
    notes: 'Default placeholder; recording conventions vary by county.'
  };
}

export function conservativeHealthRule(code: string) {
  // default to 2 witnesses, no notary, AD + HC-POA + HIPAA as baseline
  return {
    code, 
    witnesses: 2, 
    notaryRequired: false, 
    selfProvingAffidavit: true,
    remoteNotaryAllowed: false,
    healthcareForms: ['AdvanceDirective', 'HealthcarePOA', 'HIPAA'] as ('AdvanceDirective'|'LivingWill'|'HealthcarePOA'|'HIPAA'|'Surrogate')[],
    surrogateTerminology: 'Healthcare Agent',
    specialNotes: 'Default placeholder; verify hospital acceptance.'
  };
}

export function getDefaultCountyMeta(state: string, county: string) {
  return {
    state,
    county,
    pageSize: 'Letter' as const,
    topMarginIn: 3.0,
    leftMarginIn: 1.0,
    rightMarginIn: 1.0,
    bottomMarginIn: 1.0,
    firstPageStamp: { xIn: 6.0, yIn: 0.5, wIn: 2.5, hIn: 3.0 },
    requiresReturnAddress: true,
    requiresPreparer: true,
    requiresGranteeAddress: false,
    requiresAPN: false,
    eRecording: false,
    providers: [],
    notes: 'DEFAULT FALLBACK - Verify county requirements with local recorder'
  };
}