import type { EstateRule } from './types';

export type { EstateRule } from './types';

// Conservative estate rule generator
export function conservativeEstateRule(state: string): EstateRule {
  return {
    state,
    will: { required: true, witnessCount: 2, notaryRequired: true },
    rlt: { allowed: true, successorTrusteeRequired: true },
    pourOver: { required: false, witnessCount: 2 },
    poa: { required: true, notaryRequired: true, durabilityRequired: true },
    healthcarePoa: { required: true, notaryRequired: true },
    advanceDirective: { required: true, witnessCount: 2 },
    hipaa: { required: true },
    propertyDeed: { allowed: ['warranty', 'quitclaim'], recordingRequired: true },
    beneficiaryDesignations: { required: ['401k', 'ira', 'life_insurance'] },
    fundingRequirements: ['bank_accounts', 'investment_accounts', 'real_estate']
  };
}

// Known state rules (seeds)
const STATE_SEEDS: Record<string, Partial<EstateRule>> = {
  CA: {
    will: { required: true, witnessCount: 2, notaryRequired: false },
    rlt: { allowed: true, successorTrusteeRequired: true },
    propertyDeed: { allowed: ['grant', 'quitclaim'], recordingRequired: true }
  },
  TX: {
    will: { required: true, witnessCount: 2, notaryRequired: true },
    propertyDeed: { allowed: ['warranty', 'special_warranty'], recordingRequired: true }
  },
  FL: {
    will: { required: true, witnessCount: 2, notaryRequired: true },
    propertyDeed: { allowed: ['warranty', 'quitclaim'], recordingRequired: true }
  },
  NY: {
    will: { required: true, witnessCount: 2, notaryRequired: false },
    propertyDeed: { allowed: ['bargain_sale', 'quitclaim'], recordingRequired: true }
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

// Initialize with seeds first
export const ESTATE_RULES: Record<string, EstateRule> = {};

// Apply seeds
for (const [state, seed] of Object.entries(STATE_SEEDS)) {
  ESTATE_RULES[state] = { ...conservativeEstateRule(state), ...seed };
}

// Fill remaining states with conservative rules
for (const state of ALL_STATES_DC) {
  if (!(state in ESTATE_RULES)) {
    ESTATE_RULES[state] = conservativeEstateRule(state);
  }
}

export function getEstateRule(state: string): EstateRule {
  return ESTATE_RULES[state] || conservativeEstateRule(state);
}

export function useEstateRules() {
  return { ESTATE_RULES, getEstateRule };
}

export type { HealthcareRule } from './types';

export function useHealthcareRules() {
  return { ESTATE_RULES, getEstateRule };
}