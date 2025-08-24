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
    allowed: ['Warranty', 'Quitclaim', 'TODD'],
    witnesses: 0,
    notary: true,
    todAvailable: true,
    ladyBirdAvailable: false,
    eRecordingLikely: true,
    marginRules: 'Top margin ~2.5"+ (confirm county).',
    notes: 'TODD accepted; verify current statute.'
  },
  'TX': {
    code: 'TX',
    allowed: ['Warranty', 'SpecialWarranty', 'Quitclaim', 'TOD', 'TODD', 'LadyBird'],
    witnesses: 0,
    notary: true,
    todAvailable: true,
    ladyBirdAvailable: true,
    eRecordingLikely: true,
    notes: 'Muniment of title may apply; margin varies.'
  },
  'FL': {
    code: 'FL',
    allowed: ['Warranty', 'SpecialWarranty', 'Quitclaim', 'LadyBird'],
    witnesses: 2,
    notary: true,
    todAvailable: true,
    ladyBirdAvailable: true,
    eRecordingLikely: true,
    notes: '"Lady Bird" deeds common; confirm county acceptance.'
  },
  'NY': {
    code: 'NY',
    allowed: ['Warranty', 'SpecialWarranty', 'Quitclaim'],
    witnesses: 0,
    notary: true,
    todAvailable: false,
    ladyBirdAvailable: false,
    eRecordingLikely: true,
    notes: 'TOD/TODD availability limited; verify.'
  },
  'PA': {
    code: 'PA',
    allowed: ['Warranty', 'SpecialWarranty', 'Quitclaim', 'TODD'],
    witnesses: 0,
    notary: true,
    todAvailable: true,
    ladyBirdAvailable: false,
    eRecordingLikely: true,
    notes: 'Transfer tax considerations; county format.'
  },
  'IL': {
    code: 'IL',
    allowed: ['Warranty', 'SpecialWarranty', 'Quitclaim', 'TODD'],
    witnesses: 0,
    notary: true,
    todAvailable: true,
    ladyBirdAvailable: false,
    eRecordingLikely: true,
    notes: 'County margin enforcement common.'
  },
  'OH': {
    code: 'OH',
    allowed: ['Warranty', 'SpecialWarranty', 'Quitclaim', 'TODD'],
    witnesses: 0,
    notary: true,
    todAvailable: true,
    ladyBirdAvailable: false,
    eRecordingLikely: true,
    notes: 'County acceptance varies.'
  },
  'GA': {
    code: 'GA',
    allowed: ['Warranty', 'SpecialWarranty', 'Quitclaim'],
    witnesses: 2,
    notary: true,
    todAvailable: false,
    ladyBirdAvailable: false,
    eRecordingLikely: true,
    notes: 'Execution formalities strict; check local.'
  },
  'NC': {
    code: 'NC',
    allowed: ['Warranty', 'SpecialWarranty', 'Quitclaim'],
    witnesses: 2,
    notary: true,
    todAvailable: false,
    ladyBirdAvailable: false,
    eRecordingLikely: true,
    notes: 'Margins/indexing strict.'
  },
  'MI': {
    code: 'MI',
    allowed: ['Warranty', 'SpecialWarranty', 'Quitclaim', 'TODD', 'LadyBird'],
    witnesses: 0,
    notary: true,
    todAvailable: true,
    ladyBirdAvailable: true,
    eRecordingLikely: true,
    notes: 'Enhanced life estate recognized; verify county.'
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