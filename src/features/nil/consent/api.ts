import { recordReceipt } from '@/features/receipts/record';
import { ConsentRDS } from '@/features/receipts/types';
import { anchorBatch } from '@/features/anchor/simple-providers';

export interface ConsentRequest {
  roles: string[];
  resources: string[];
  ttlDays: number;
  purpose_of_use: string;
}

const activeConsents: ConsentRDS[] = [];

export async function issueConsent(request: ConsentRequest): Promise<ConsentRDS> {
  const consentTime = new Date().toISOString();
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + request.ttlDays);
  const expiry = expiryDate.toISOString();
  
  // Calculate freshness score (days until expiry / total days)
  const daysUntilExpiry = Math.floor((expiryDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
  const freshnessScore = Math.max(0, daysUntilExpiry / request.ttlDays);
  
  const consentRDS: ConsentRDS = {
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

  // Anchor the consent
  try {
    const consentHash = btoa(JSON.stringify({
      roles: request.roles,
      resources: request.resources,
      purpose: request.purpose_of_use,
      expiry
    })).slice(0, 24);
    
    const anchorRef = await anchorBatch(consentHash);
    consentRDS.anchor_ref = anchorRef;
  } catch (error) {
    console.warn('Failed to anchor consent:', error);
  }

  const receipt = recordReceipt(consentRDS);
  activeConsents.push(receipt as ConsentRDS);
  
  console.info('nil.consent.issued', { 
    id: receipt.id, 
    roles: request.roles, 
    resources: request.resources,
    freshnessScore,
    expiry 
  });
  
  return receipt as ConsentRDS;
}

export function revokeConsent(consentId: string): ConsentRDS {
  const consent = activeConsents.find(c => c.id === consentId);
  if (!consent) {
    throw new Error('Consent not found');
  }

  // Update the consent to revoked
  consent.result = 'deny';
  consent.reason = 'CONSENT_STALE';
  consent.ts = new Date().toISOString();

  // Create a new revocation receipt
  const revocationRDS: ConsentRDS = {
    ...consent,
    id: `revoke_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    result: 'deny',
    reason: 'CONSENT_STALE',
    ts: new Date().toISOString()
  };

  const revokeReceipt = recordReceipt(revocationRDS);
  
  console.info('nil.consent.revoked', { originalId: consentId, revokeId: revokeReceipt.id });
  
  return revokeReceipt as ConsentRDS;
}

export function getActiveConsents(): ConsentRDS[] {
  return activeConsents.filter(c => c.result === 'approve');
}

// Validate consent is still fresh and covers required scope
export function validateConsent(consent: ConsentRDS, requiredRoles: string[], requiredResources: string[]): {
  valid: boolean;
  reason: 'OK' | 'CONSENT_STALE' | 'SCOPE_MISMATCH';
  details?: string;
} {
  // Check if consent is expired
  const now = new Date();
  const expiryDate = new Date(consent.expiry);
  
  if (now > expiryDate) {
    return {
      valid: false,
      reason: 'CONSENT_STALE',
      details: `Consent expired on ${expiryDate.toLocaleDateString()}`
    };
  }
  
  // Check if required roles are covered
  const missingRoles = requiredRoles.filter(role => !consent.scope.roles.includes(role));
  if (missingRoles.length > 0) {
    return {
      valid: false,
      reason: 'SCOPE_MISMATCH',
      details: `Missing roles: ${missingRoles.join(', ')}`
    };
  }
  
  // Check if required resources are covered
  const missingResources = requiredResources.filter(resource => !consent.scope.resources.includes(resource));
  if (missingResources.length > 0) {
    return {
      valid: false,
      reason: 'SCOPE_MISMATCH',
      details: `Missing resources: ${missingResources.join(', ')}`
    };
  }
  
  return {
    valid: true,
    reason: 'OK'
  };
}

// For backward compatibility
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