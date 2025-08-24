export interface AuthorityGrant {
  id: string;
  clientId: string;
  role: 'POA' | 'Trustee' | 'Executor';
  subjectId: string;
  createdAt: string;
}

export interface BeneficiaryMismatch {
  accountId: string;
  intent: string;
  current: string;
  fixSuggestion?: string;
}

export interface BinderManifest {
  clientId: string;
  builtAt: string;
  files: { sha256: string; filename?: string }[];
  receipts: { id: string; type: string; ts: string; anchor_ref?: any }[];
  hash: string;
}