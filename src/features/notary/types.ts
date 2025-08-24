/**
 * Core notarization types and interfaces
 */

export type NotarySession = {
  id: string;
  docId: string;
  docName: string;
  requesterUserId: string;
  state: string;
  mode: 'RON' | 'IN_PERSON';
  signer: {
    name: string;
    email: string;
    phone?: string;
    govtIdType?: string;
  };
  witnesses?: {
    type: 'platform' | 'user';
    count: number;
    names?: string[];
    emails?: string[];
  };
  status: 'requested' | 'scheduled' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  scheduledAt?: string;
  completedAt?: string;
  notaryUserId?: string;
  fees?: {
    amount: number;
    currency: 'USD';
    description?: string;
  };
  outputs?: {
    stampedPdfUrl?: string;
    journalEntryId?: string;
    avUrl?: string;
    hash?: string;
    anchor_ref?: any;
  };
  identityChecks?: {
    kbaScore?: number;
    kbaPassed?: boolean;
    idScanPassed?: boolean;
    livenessPassed?: boolean;
    completedAt?: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type NotaryProfile = {
  userId: string;
  commissionNumber: string;
  jurisdiction: string;
  expiresAt: string;
  sealImageUrl?: string;
  x509Certificate?: string;
  defaultFees: {
    ron: number;
    inPerson: number;
    witnessPerPerson: number;
  };
  availability: {
    timezone: string;
    hours: Array<{
      day: number; // 0-6 (Sunday-Saturday)
      start: string; // HH:mm
      end: string; // HH:mm
    }>;
  };
  isActive: boolean;
  specializations?: string[];
};

export type JournalEntry = {
  id: string;
  sessionId: string;
  notaryUserId: string;
  entryDate: string;
  signerName: string;
  documentName: string;
  documentType: string;
  notarizationType: 'acknowledgment' | 'jurat' | 'oath' | 'affirmation';
  jurisdiction: string;
  mode: 'RON' | 'IN_PERSON';
  witnessCount: number;
  witnessNames?: string[];
  idType?: string;
  idNumber?: string; // masked for privacy
  signerAddress?: string;
  location: string;
  result: 'completed' | 'failed' | 'refused';
  notes?: string;
  fees: number;
  createdAt: string;
};

export type IdentityProofingResult = {
  sessionId: string;
  signerEmail: string;
  kba?: {
    score: number;
    passed: boolean;
    questions: number;
    completedAt: string;
  };
  idScan?: {
    passed: boolean;
    documentType: string;
    confidence: number;
    completedAt: string;
  };
  liveness?: {
    passed: boolean;
    confidence: number;
    completedAt: string;
  };
  overallResult: 'passed' | 'failed' | 'partial';
  completedAt: string;
};

export type NotaryWebhookEvent = {
  type: 'session.requested' | 'session.scheduled' | 'session.started' | 'session.completed' | 'session.failed' | 'session.cancelled';
  sessionId: string;
  timestamp: string;
  data: Partial<NotarySession>;
};

// RDS Receipt types for notary events
export type NotaryDecisionRDS = {
  type: 'Decision-RDS';
  inputs_hash: string;
  policy_version: string;
  payload: {
    action: 'notary.request' | 'notary.schedule' | 'notary.start' | 'notary.complete' | 'notary.fail' | 'notary.cancel' | 'notary.kba.pass' | 'notary.kba.fail' | 'notary.idscan.pass' | 'notary.idscan.fail' | 'notary.liveness.pass' | 'notary.liveness.fail' | 'notary.witness.ack';
    sessionId: string;
    state: string;
    mode: 'RON' | 'IN_PERSON';
    reasons: string[];
    result: 'approve' | 'deny';
    metadata?: Record<string, any>;
  };
  timestamp: string;
};

export type NotaryVaultRDS = {
  type: 'Vault-RDS';
  payload: {
    action: 'keep_safe';
    asset_type: 'stamped_pdf' | 'session_recording' | 'journal_entry' | 'id_scan_images';
    sessionId: string;
    hash: string;
    retention_years: number;
    access_policy: 'notary_only' | 'signer_and_notary' | 'audit_trail';
  };
  timestamp: string;
};

export type NotarySettlementRDS = {
  type: 'Settlement-RDS';
  payload: {
    sessionId: string;
    amount: number;
    currency: 'USD';
    description: string;
    paymentMethod: string;
    status: 'pending' | 'completed' | 'failed';
  };
  timestamp: string;
};