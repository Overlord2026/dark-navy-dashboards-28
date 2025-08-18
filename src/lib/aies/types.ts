export type Connector = {
  key: string;
  displayName: string;
  jurisdictions: string[];
  dataScopes: string[];
  baseScore: number; // 0..1
  friction: number;  // 0..1 (higher worse)
  risk: number;      // 0..1 (higher worse)
};

export type Consent = {
  id: string;
  userId: string;
  connectorKey: string;
  scopes: string[];
  jurisdiction?: string | null;
  grantedAt: string;   // ISO
  expiresAt?: string | null;
  revokedAt?: string | null;
};

export type BudgetPolicy = {
  scope: string;            // operation key
  role?: string | null;
  ceilingCents: number;
  requiresApproval: boolean;
  approverRole?: string | null;
};

export type ExecutionStatus = 'pending'|'approved'|'blocked'|'running'|'done'|'failed';

export type ZkPredicate = { predicate: string; proof: unknown; verifier?: string };

export type PolicyCheck = { provider: string; policyRef: string; inForce?: boolean; evidence?: unknown };

export type GateResult =
  | { allow: true; reason?: string }
  | { allow: false; reason: string; action?: 'upgrade'|'consent'|'request_approval' };