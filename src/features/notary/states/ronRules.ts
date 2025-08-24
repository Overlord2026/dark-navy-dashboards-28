/**
 * State-specific Remote Online Notarization (RON) policy matrix
 */

export type RonRule = {
  code: string;                   // 'CA','FL','TX',...
  allowed: boolean;               // RON permitted?
  kbaLevel: 'none' | 'kb2' | 'kb5';   // question depth (e.g., 2 or 5)
  idScanRequired: boolean;        // document authentication required?
  livenessRequired: boolean;      // face liveness check?
  audioVideoRetentionDays: number;// RON A/V retention
  eJournalRequired: boolean;      // electronic journal entry required
  sealFormat: 'image' | 'x509';     // eSeal type; may support both
  notaryLocation: 'inState' | 'US'; // notary must be located where commissioned
  witnessPolicy: 'none' | 'user' | 'platform'; // witness procurement
  specialOath?: string;           // any state-specific oath text
  notes?: string;
};

export const RON_RULES: Record<string, RonRule> = {
  // Conservative defaults; override with real policy as confirmed
  'FL': { 
    code: 'FL', 
    allowed: true, 
    kbaLevel: 'kb5', 
    idScanRequired: true, 
    livenessRequired: true, 
    audioVideoRetentionDays: 10 * 365, 
    eJournalRequired: true, 
    sealFormat: 'image', 
    notaryLocation: 'inState', 
    witnessPolicy: 'platform', 
    specialOath: 'State of Florida standard oath.', 
    notes: 'Confirm witness presence rules' 
  },
  'TX': { 
    code: 'TX', 
    allowed: true, 
    kbaLevel: 'kb5', 
    idScanRequired: true, 
    livenessRequired: true, 
    audioVideoRetentionDays: 5 * 365, 
    eJournalRequired: true, 
    sealFormat: 'image', 
    notaryLocation: 'inState', 
    witnessPolicy: 'user' 
  },
  'VA': { 
    code: 'VA', 
    allowed: true, 
    kbaLevel: 'kb5', 
    idScanRequired: true, 
    livenessRequired: true, 
    audioVideoRetentionDays: 5 * 365, 
    eJournalRequired: true, 
    sealFormat: 'x509', 
    notaryLocation: 'inState', 
    witnessPolicy: 'platform' 
  },
  'NY': { 
    code: 'NY', 
    allowed: true, 
    kbaLevel: 'kb5', 
    idScanRequired: true, 
    livenessRequired: true, 
    audioVideoRetentionDays: 10 * 365, 
    eJournalRequired: true, 
    sealFormat: 'image', 
    notaryLocation: 'inState', 
    witnessPolicy: 'user' 
  },
  'CA': { 
    code: 'CA', 
    allowed: false, 
    kbaLevel: 'none', 
    idScanRequired: false, 
    livenessRequired: false, 
    audioVideoRetentionDays: 0, 
    eJournalRequired: false, 
    sealFormat: 'image', 
    notaryLocation: 'US', 
    witnessPolicy: 'none', 
    notes: 'RON prohibited; use in-person.' 
  },
  'AZ': { 
    code: 'AZ', 
    allowed: true, 
    kbaLevel: 'kb5', 
    idScanRequired: true, 
    livenessRequired: true, 
    audioVideoRetentionDays: 5 * 365, 
    eJournalRequired: true, 
    sealFormat: 'image', 
    notaryLocation: 'inState', 
    witnessPolicy: 'platform' 
  },
  'CO': { 
    code: 'CO', 
    allowed: true, 
    kbaLevel: 'kb5', 
    idScanRequired: true, 
    livenessRequired: true, 
    audioVideoRetentionDays: 5 * 365, 
    eJournalRequired: true, 
    sealFormat: 'image', 
    notaryLocation: 'inState', 
    witnessPolicy: 'user' 
  },
  'NV': { 
    code: 'NV', 
    allowed: true, 
    kbaLevel: 'kb5', 
    idScanRequired: true, 
    livenessRequired: true, 
    audioVideoRetentionDays: 5 * 365, 
    eJournalRequired: true, 
    sealFormat: 'image', 
    notaryLocation: 'inState', 
    witnessPolicy: 'platform' 
  }
  // Add remaining states as verified
};

export function getRonRule(state: string): RonRule {
  const r = RON_RULES[state];
  return r || { 
    code: state, 
    allowed: false, 
    kbaLevel: 'none', 
    idScanRequired: false, 
    livenessRequired: false, 
    audioVideoRetentionDays: 0, 
    eJournalRequired: false, 
    sealFormat: 'image', 
    notaryLocation: 'US', 
    witnessPolicy: 'none' 
  };
}

export function validateRonRequest(state: string, mode: 'RON' | 'IN_PERSON'): { valid: boolean; reason?: string } {
  const rule = getRonRule(state);
  
  if (mode === 'RON' && !rule.allowed) {
    return { valid: false, reason: `RON not permitted in ${state}. Use in-person notarization.` };
  }
  
  return { valid: true };
}