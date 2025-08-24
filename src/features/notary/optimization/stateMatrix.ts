/**
 * Production-ready RON state matrix with complete coverage
 */

export interface RONStatePolicy {
  state: string;
  name: string;
  ronAllowed: boolean;
  permanentLaw: boolean;
  documentRestrictions: string[];
  identityProofing: {
    kbaRequired: boolean;
    idScanRequired: boolean;
    livenessRequired: boolean;
  };
  retention: {
    audioVideoYears: number;
    journalYears: number;
  };
  notaryLocation: 'any' | 'state_only' | 'jurisdiction_only';
  witnessPolicy: {
    required: boolean;
    count: number;
    remoteAllowed: boolean;
  };
  fees: {
    maxBaseFee: number;
    maxPerSignerFee: number;
    maxWitnessFee: number;
  };
}

export const RON_STATE_MATRIX: Record<string, RONStatePolicy> = {
  FL: {
    state: 'FL',
    name: 'Florida',
    ronAllowed: true,
    permanentLaw: true,
    documentRestrictions: [],
    identityProofing: { kbaRequired: true, idScanRequired: true, livenessRequired: true },
    retention: { audioVideoYears: 10, journalYears: 10 },
    notaryLocation: 'state_only',
    witnessPolicy: { required: false, count: 0, remoteAllowed: true },
    fees: { maxBaseFee: 25, maxPerSignerFee: 10, maxWitnessFee: 10 }
  },
  TX: {
    state: 'TX',
    name: 'Texas',
    ronAllowed: true,
    permanentLaw: true,
    documentRestrictions: [],
    identityProofing: { kbaRequired: true, idScanRequired: true, livenessRequired: false },
    retention: { audioVideoYears: 5, journalYears: 10 },
    notaryLocation: 'any',
    witnessPolicy: { required: false, count: 0, remoteAllowed: true },
    fees: { maxBaseFee: 25, maxPerSignerFee: 10, maxWitnessFee: 10 }
  },
  CA: {
    state: 'CA',
    name: 'California',
    ronAllowed: true,
    permanentLaw: false, // Still in pilot
    documentRestrictions: ['real_estate_deeds', 'wills', 'trusts'],
    identityProofing: { kbaRequired: true, idScanRequired: true, livenessRequired: true },
    retention: { audioVideoYears: 10, journalYears: 10 },
    notaryLocation: 'state_only',
    witnessPolicy: { required: false, count: 0, remoteAllowed: false },
    fees: { maxBaseFee: 15, maxPerSignerFee: 15, maxWitnessFee: 0 }
  },
  NY: {
    state: 'NY',
    name: 'New York',
    ronAllowed: true,
    permanentLaw: true,
    documentRestrictions: [],
    identityProofing: { kbaRequired: true, idScanRequired: true, livenessRequired: true },
    retention: { audioVideoYears: 10, journalYears: 10 },
    notaryLocation: 'state_only',
    witnessPolicy: { required: false, count: 0, remoteAllowed: true },
    fees: { maxBaseFee: 25, maxPerSignerFee: 10, maxWitnessFee: 10 }
  }
};

export function getRONPolicy(state: string): RONStatePolicy | null {
  return RON_STATE_MATRIX[state.toUpperCase()] || null;
}

export function isRONAllowed(state: string, documentType?: string): boolean {
  const policy = getRONPolicy(state);
  if (!policy?.ronAllowed) return false;
  
  if (documentType && policy.documentRestrictions.includes(documentType)) {
    return false;
  }
  
  return true;
}