export type ChecklistItemKey =
  | 'will'
  | 'rlt'
  | 'pour_over'
  | 'poa_financial'
  | 'hc_poa'
  | 'advance_directive'
  | 'hipaa'
  | 'deed_recorded'
  | 'beneficiary_sync'
  | 'funding_letters'
  | 'attorney_review_final'
  | 'notary_final';

export type ChecklistStatus = 'COMPLETE' | 'PENDING' | 'NEEDS_ATTENTION' | 'EXPIRED';

export type ChecklistItem = {
  key: ChecklistItemKey;
  status: ChecklistStatus;
  updatedAt: string;
  reasons?: string[];           // short reason codes (content-free)
  refs?: string[];              // vault ids / hashes (no PII)
};

export type Checklist = {
  clientId: string;
  state?: string;
  items: Record<ChecklistItemKey, ChecklistItem>;
  hash?: string;                // hash of canonical view (for compare)
  lastUpdated: string;
};

export const CHECKLIST_ITEM_LABELS: Record<ChecklistItemKey, string> = {
  will: 'Last Will & Testament',
  rlt: 'Revocable Living Trust',
  pour_over: 'Pour-Over Will',
  poa_financial: 'Financial Power of Attorney',
  hc_poa: 'Healthcare Power of Attorney',
  advance_directive: 'Advance Directive',
  hipaa: 'HIPAA Authorization',
  deed_recorded: 'Property Deed (Recorded)',
  beneficiary_sync: 'Beneficiary Designations',
  funding_letters: 'Trust Funding Letters',
  attorney_review_final: 'Attorney Review (Final)',
  notary_final: 'Notary Completion'
};

export const STATUS_ICONS: Record<ChecklistStatus, string> = {
  COMPLETE: '✓',
  PENDING: '◷',
  NEEDS_ATTENTION: '⚠',
  EXPIRED: '⏰'
};

export const STATUS_COLORS: Record<ChecklistStatus, string> = {
  COMPLETE: 'text-green-700',
  PENDING: 'text-gray-700',
  NEEDS_ATTENTION: 'text-amber-800',
  EXPIRED: 'text-red-700'
};