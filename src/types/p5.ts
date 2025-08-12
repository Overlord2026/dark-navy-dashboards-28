export type PersonaKind = 'client'|'advisor'|'agent'|'guardian'|'coach'|'sponsor'|'admin';
export type ReasonCode = 'OK'|'BLOCK_CONFLICT'|'REQUIRE_DISCLOSURE'|'CE_OVERDUE'|'TAKEDOWN_DUE_TO_REVOCATION';

export interface ConsentToken {
  id: string; 
  subject_user: string; 
  issuer_user?: string;
  scopes: Record<string, unknown>; 
  conditions?: Record<string, unknown>;
  valid_from?: string; 
  valid_to?: string; 
  status: 'active'|'revoked'|'expired';
}

export interface Persona {
  id: string;
  user_id: string;
  kind: PersonaKind;
  created_at: string;
}

export interface PersonaSession {
  id: string;
  user_id: string;
  persona_id: string;
  active: boolean;
  started_at: string;
  ended_at?: string;
}

export interface ReasonReceipt {
  id: string;
  user_id: string;
  persona_id: string;
  action_key: string;
  reason_code: ReasonCode;
  explanation?: string;
  policy_version?: string;
  content_fingerprint?: string;
  sha256?: string;
  anchor_txid?: string;
  created_at: string;
}