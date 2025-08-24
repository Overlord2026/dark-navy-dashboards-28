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

export const ESTATE_RULES: Record<string,EstateRule> = {
  'CA': {
    code: 'CA',
    will: { witnesses: 2, notary: false, selfProving: true },
    rlt: { notary: true, spousalConsents: true },
    pourOver: { witnesses: 2, notary: false },
    poa: { notary: true },
    probateNotes: 'Small estate procedure available for estates under $184,500',
    communityProperty: true,
    todPodAllowed: true,
    deedPracticeNote: 'Transfer on death deeds permitted for real property'
  },
  'TX': {
    code: 'TX',
    will: { witnesses: 2, notary: false, selfProving: true },
    rlt: { notary: true },
    pourOver: { witnesses: 2, notary: false },
    poa: { notary: true },
    probateNotes: 'Independent administration preferred',
    communityProperty: true,
    todPodAllowed: true
  },
  'FL': {
    code: 'FL',
    will: { witnesses: 2, notary: true, selfProving: true },
    rlt: { notary: true },
    pourOver: { witnesses: 2, notary: true },
    poa: { notary: true },
    probateNotes: 'Summary administration available for estates under $75,000',
    todPodAllowed: false
  },
  'NY': {
    code: 'NY',
    will: { witnesses: 2, notary: false, selfProving: true },
    rlt: { notary: true },
    pourOver: { witnesses: 2, notary: false },
    poa: { notary: true },
    probateNotes: 'Voluntary administration available for small estates'
  },
  'DEFAULT': {
    code: 'DEFAULT',
    will: { witnesses: 2, notary: false },
    rlt: { notary: true },
    pourOver: { witnesses: 2, notary: false },
    poa: { notary: true }
  }
};

export function useEstateRules(state: string): EstateRule {
  return ESTATE_RULES[state] || ESTATE_RULES['DEFAULT'];
}