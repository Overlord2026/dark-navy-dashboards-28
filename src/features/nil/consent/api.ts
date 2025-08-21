import { recordReceipt } from '@/features/receipts/record';
import { ConsentRDS } from '@/features/receipts/types';

export interface ConsentRequest {
  roles: string[];
  resources: string[];
  ttlDays: number;
  purpose_of_use: string;
}

const activeConsents: ConsentRDS[] = [];

export function issueConsent(request: ConsentRequest): ConsentRDS {
  const consentTime = new Date().toISOString();
  const expiry = new Date(Date.now() + request.ttlDays * 24 * 60 * 60 * 1000).toISOString();
  
  // Calculate freshness score (higher is better, max 1.0)
  const freshnessScore = Math.min(1.0, request.ttlDays / 365);
  
  const rds: ConsentRDS = {
    id: `consent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'Consent-RDS',
    purpose_of_use: request.purpose_of_use,
    scope: {
      minimum_necessary: true,
      roles: request.roles,
      resources: request.resources
    },
    consent_time: consentTime,
    expiry,
    freshness_score: freshnessScore,
    result: 'approve',
    reason: 'OK',
    anchor_ref: null,
    ts: new Date().toISOString()
  };

  activeConsents.push(rds);
  return recordReceipt(rds);
}

export function revokeConsent(consentId: string): ConsentRDS {
  const originalConsent = activeConsents.find(c => c.id === consentId);
  if (!originalConsent) {
    throw new Error('Consent not found');
  }

  // Remove from active consents
  const index = activeConsents.findIndex(c => c.id === consentId);
  if (index > -1) {
    activeConsents.splice(index, 1);
  }

  const rds: ConsentRDS = {
    id: `revoke_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'Consent-RDS',
    purpose_of_use: originalConsent.purpose_of_use,
    scope: originalConsent.scope,
    consent_time: originalConsent.consent_time,
    expiry: originalConsent.expiry,
    freshness_score: 0,
    result: 'deny',
    reason: 'CONSENT_STALE',
    anchor_ref: null,
    ts: new Date().toISOString()
  };

  return recordReceipt(rds);
}

export function getActiveConsents(): ConsentRDS[] {
  return [...activeConsents];
}

export function checkConsentValidity(consentId: string): { valid: boolean; reason?: string } {
  const consent = activeConsents.find(c => c.id === consentId);
  
  if (!consent) {
    return { valid: false, reason: 'CONSENT_NOT_FOUND' };
  }

  if (new Date() > new Date(consent.expiry)) {
    return { valid: false, reason: 'CONSENT_EXPIRED' };
  }

  return { valid: true };
}