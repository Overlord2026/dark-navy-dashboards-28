export type AutofillScope = 
  | 'estate.core'
  | 'estate.health' 
  | 'estate.deeds'
  | 'estate.beneficiary'
  | 'estate.review'
  | 'estate.notary'
  | 'estate.upload'
  | 'estate.email'
  | 'estate.drive';

export type AutofillConsent = {
  clientId: string;
  grantedBy: string;
  grantedAt: string;
  scopes: AutofillScope[];
  ttlDays?: number;
};

export const DEFAULT_SCOPES: AutofillScope[] = [
  'estate.core',
  'estate.health', 
  'estate.deeds',
  'estate.review',
  'estate.notary'
];

export const SCOPE_DESCRIPTIONS: Record<AutofillScope, string> = {
  'estate.core': 'Core estate documents (Will, Trust, Pour-Over Will)',
  'estate.health': 'Healthcare documents (Healthcare POA, Advance Directive, HIPAA)',
  'estate.deeds': 'Property deeds and real estate documents',
  'estate.beneficiary': 'Beneficiary designations and transfer-on-death forms',
  'estate.review': 'Attorney review packets and final documents',
  'estate.notary': 'Notarized documents from notary sessions',
  'estate.upload': 'Secure file uploads from family portal',
  'estate.email': 'Documents from email drop-box',
  'estate.drive': 'Documents from cloud storage integration'
};

// Storage for consent (in production would be in database)
const consentStore = new Map<string, AutofillConsent>();

export function grantConsent(consent: AutofillConsent): void {
  consentStore.set(consent.clientId, consent);
  console.log(`[Vault Autofill] Consent granted for ${consent.clientId}:`, consent.scopes);
}

export function revokeConsent(clientId: string): void {
  consentStore.delete(clientId);
  console.log(`[Vault Autofill] Consent revoked for ${clientId}`);
}

export function hasConsent(clientId: string, scope: AutofillScope): boolean {
  const consent = consentStore.get(clientId);
  if (!consent) return false;
  
  // Check TTL if specified
  if (consent.ttlDays) {
    const grantedAt = new Date(consent.grantedAt);
    const expiresAt = new Date(grantedAt.getTime() + consent.ttlDays * 24 * 60 * 60 * 1000);
    if (new Date() > expiresAt) {
      consentStore.delete(clientId);
      return false;
    }
  }
  
  return consent.scopes.includes(scope);
}

export function getConsent(clientId: string): AutofillConsent | null {
  return consentStore.get(clientId) || null;
}