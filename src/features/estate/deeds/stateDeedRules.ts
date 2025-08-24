export type DeedType = 'Warranty'|'SpecialWarranty'|'Quitclaim'|'TOD'|'TODD'|'LadyBird';

export type RecordingRule = {
  code: string;      // 'CA','TX', etc.
  allowed: DeedType[];
  todAvailable?: boolean;
  ladyBirdAvailable?: boolean;       // enhanced life estate — only in select states
  witnesses: number; 
  notary: boolean;
  marginRules?: string;              // county format idiosyncrasies
  transferTaxes?: string;            // basic guidance (attorney-only compute)
  eRecordingLikely?: boolean;        // many counties allow; confirm at runtime
  notes?: string;                    // any local caveats
};

export const DEED_RULES: Record<string, RecordingRule> = {
  'CA': {
    code: 'CA',
    allowed: ['Warranty', 'Quitclaim', 'TOD'],
    todAvailable: true,
    ladyBirdAvailable: false,
    witnesses: 0,
    notary: true,
    marginRules: '1 inch margins required',
    transferTaxes: 'Documentary transfer tax applies',
    eRecordingLikely: true,
    notes: 'Prop 13 considerations for family transfers'
  },
  'TX': {
    code: 'TX',
    allowed: ['Warranty', 'SpecialWarranty', 'Quitclaim', 'TOD', 'LadyBird'],
    todAvailable: true,
    ladyBirdAvailable: true,
    witnesses: 0,
    notary: true,
    transferTaxes: 'No state transfer tax',
    eRecordingLikely: true,
    notes: 'Enhanced life estate deeds available'
  },
  'FL': {
    code: 'FL',
    allowed: ['Warranty', 'Quitclaim', 'LadyBird'],
    todAvailable: false,
    ladyBirdAvailable: true,
    witnesses: 2,
    notary: true,
    transferTaxes: 'Documentary stamp tax applies',
    eRecordingLikely: true,
    notes: 'Enhanced life estate deeds available; no TOD deeds'
  },
  'NY': {
    code: 'NY',
    allowed: ['Warranty', 'Quitclaim'],
    todAvailable: false,
    ladyBirdAvailable: false,
    witnesses: 0,
    notary: true,
    transferTaxes: 'Transfer tax and mortgage recording tax may apply',
    eRecordingLikely: false,
    notes: 'No TOD or enhanced life estate deeds'
  },
  'DEFAULT': {
    code: 'DEFAULT',
    allowed: ['Warranty', 'Quitclaim'],
    todAvailable: false,
    ladyBirdAvailable: false,
    witnesses: 0,
    notary: true,
    eRecordingLikely: false
  }
};

export function canUseDeed(state: string, kind: DeedType): boolean {
  return (DEED_RULES[state]?.allowed || DEED_RULES['DEFAULT'].allowed).includes(kind);
}

export function getAvailableDeedTypes(state: string): DeedType[] {
  return DEED_RULES[state]?.allowed || DEED_RULES['DEFAULT'].allowed;
}

export function getDeedRules(state: string): RecordingRule {
  return DEED_RULES[state] || DEED_RULES['DEFAULT'];
}