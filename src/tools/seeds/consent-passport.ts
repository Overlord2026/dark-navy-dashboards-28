import { recordReceipt } from '@/features/receipts/record';

export interface ConsentGrant {
  id: string;
  purpose: string;
  scope: {
    minimumNecessary: boolean;
    roles: string[];
    resources: string[];
    dataTypes: string[];
  };
  grantedTo: string;
  grantedBy: string;
  consentTime: string;
  expiry: string;
  status: 'active' | 'expired' | 'revoked';
  freshnessScore: number;
}

export async function seedConsentPassport() {
  const consentGrant: ConsentGrant = {
    id: `consent_${Date.now()}`,
    purpose: 'Financial Planning and Tax Preparation',
    scope: {
      minimumNecessary: true,
      roles: ['Financial Advisor', 'Tax Preparer'],
      resources: ['Investment Accounts', 'Tax Documents', 'Income Statements'],
      dataTypes: ['Account Balances', 'Transaction History', 'Tax Forms']
    },
    grantedTo: 'ABC Financial Advisory, LLC',
    grantedBy: 'John Smith',
    consentTime: new Date().toISOString(),
    expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    freshnessScore: 95
  };

  // Store in localStorage for demo
  localStorage.setItem('consent_grant', JSON.stringify(consentGrant));

  // Create proof slip
  const now = new Date().toISOString();
  recordReceipt({
    id: `consent_${Date.now()}`,
    type: 'Consent-RDS',
    policy_version: 'E-2025.08',
    inputs_hash: 'sha256:demo',
    result: 'approve',
    reasons: ['SURROGATE_GRANT'],
    created_at: now
  } as any);

  return consentGrant;
}

export function getConsentGrant(): ConsentGrant | null {
  try {
    const stored = localStorage.getItem('consent_grant');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}