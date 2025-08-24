import type { RecordingRule } from './types';

// Conservative deed rule generator
export function conservativeDeedRule(state: string): RecordingRule {
  return {
    state,
    allowed: ['warranty', 'quitclaim'],
    recordingRequired: true,
    notaryRequired: true,
    witnessCount: 0,
    transferTaxRequired: true,
    disclosureRequired: true,
    titleInsuranceRecommended: true
  };
}

// Known state recording rules (seeds)
const DEED_SEEDS: Record<string, Partial<RecordingRule>> = {
  CA: {
    allowed: ['grant', 'quitclaim'],
    notaryRequired: true,
    transferTaxRequired: false
  },
  TX: {
    allowed: ['warranty', 'special_warranty'],
    notaryRequired: true,
    witnessCount: 2
  },
  FL: {
    allowed: ['warranty', 'quitclaim'],
    notaryRequired: true,
    witnessCount: 2
  },
  NY: {
    allowed: ['bargain_sale', 'quitclaim'],
    notaryRequired: true,
    transferTaxRequired: true
  }
};

// All US states + DC
const ALL_STATES_DC = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC'
];

// Initialize deed rules
export const DEED_RULES: Record<string, RecordingRule> = {};

// Apply seeds
for (const [state, seed] of Object.entries(DEED_SEEDS)) {
  DEED_RULES[state] = { ...conservativeDeedRule(state), ...seed };
}

// Fill remaining states
for (const state of ALL_STATES_DC) {
  if (!(state in DEED_RULES)) {
    DEED_RULES[state] = conservativeDeedRule(state);
  }
}

export function canUseDeed(state: string, kind: string): boolean {
  return (DEED_RULES[state]?.allowed || []).includes(kind);
}

export function getDeedRule(state: string): RecordingRule {
  return DEED_RULES[state] || conservativeDeedRule(state);
}