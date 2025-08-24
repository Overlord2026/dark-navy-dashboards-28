import { ProPersona, ConsentScope } from '../types';

export interface ConsentRDS {
  type: 'Consent-RDS';
  inputs_hash: string;
  policy_version: string;
  payload: {
    persona: ProPersona;
    scope: ConsentScope;
    ttlDays: number;
    purpose: string;
    result: 'approve' | 'deny';
    reason_codes?: string[];
  };
  timestamp: string;
}

const POLICY_VERSION = 'v1.0';

function hash(obj: unknown): string {
  return btoa(JSON.stringify(obj)).slice(0, 24);
}

export function recordConsentRDS(payload: Omit<ConsentRDS['payload'], 'result'> & { result?: 'approve' | 'deny' }): ConsentRDS {
  const fullPayload = {
    ...payload,
    result: payload.result || 'approve' as const
  };

  const receipt: ConsentRDS = {
    type: 'Consent-RDS',
    inputs_hash: hash(fullPayload),
    policy_version: POLICY_VERSION,
    payload: fullPayload,
    timestamp: new Date().toISOString()
  };

  console.log('[Consent-RDS]', receipt);
  
  // Store for consent checking
  storeConsentReceipt(receipt);
  
  return receipt;
}

export function checkConsentFreshness(persona: ProPersona, purpose: string): boolean {
  try {
    const stored = localStorage.getItem('consent_receipts');
    if (!stored) return false;

    const receipts: ConsentRDS[] = JSON.parse(stored);
    const relevant = receipts.filter(r => 
      r.payload.persona === persona && 
      r.payload.purpose === purpose &&
      r.payload.result === 'approve'
    );

    if (relevant.length === 0) return false;

    // Check if most recent consent is still valid
    const latest = relevant.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )[0];

    const consentAge = Date.now() - new Date(latest.timestamp).getTime();
    const ttlMs = latest.payload.ttlDays * 24 * 60 * 60 * 1000;

    return consentAge <= ttlMs;
  } catch {
    return false;
  }
}

export function getConsentStatus(persona: ProPersona, purpose: string) {
  try {
    const stored = localStorage.getItem('consent_receipts');
    if (!stored) return { hasConsent: false, expiresAt: null, receiptId: null };

    const receipts: ConsentRDS[] = JSON.parse(stored);
    const latest = receipts
      .filter(r => 
        r.payload.persona === persona && 
        r.payload.purpose === purpose &&
        r.payload.result === 'approve'
      )
      .sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )[0];

    if (!latest) return { hasConsent: false, expiresAt: null, receiptId: null };

    const expiresAt = new Date(
      new Date(latest.timestamp).getTime() + (latest.payload.ttlDays * 24 * 60 * 60 * 1000)
    );

    return {
      hasConsent: expiresAt > new Date(),
      expiresAt,
      receiptId: latest.inputs_hash
    };
  } catch {
    return { hasConsent: false, expiresAt: null, receiptId: null };
  }
}

function storeConsentReceipt(receipt: ConsentRDS) {
  try {
    const stored = localStorage.getItem('consent_receipts');
    const receipts: ConsentRDS[] = stored ? JSON.parse(stored) : [];
    receipts.unshift(receipt);
    
    // Keep only last 100 receipts
    const trimmed = receipts.slice(0, 100);
    localStorage.setItem('consent_receipts', JSON.stringify(trimmed));
  } catch (error) {
    console.error('Failed to store consent receipt:', error);
  }
}

export function recordConsentDenial(persona: ProPersona, purpose: string, reasonCodes: string[]): ConsentRDS {
  return recordConsentRDS({
    persona,
    scope: { contact: false, marketing: false, analytics: false, third_party_sharing: false },
    ttlDays: 0,
    purpose,
    result: 'deny',
    reason_codes: reasonCodes
  });
}
