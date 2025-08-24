import { recordReceipt } from '@/features/receipts/record';

export interface POAGrant {
  id: string;
  grantor: string;
  agent: string;
  scope: 'limited' | 'general' | 'durable';
  powers: string[];
  limitations?: string[];
  effectiveDate: string;
  expirationDate?: string;
  notarized: boolean;
  witnesses: string[];
  verificationCode: string;
}

export async function seedFinancialPOA() {
  const poaGrant: POAGrant = {
    id: `poa_${Date.now()}`,
    grantor: 'John Smith',
    agent: 'Sarah Johnson (Spouse)',
    scope: 'limited',
    powers: [
      'Banking and financial account management',
      'Investment account transactions',
      'Tax preparation and filing',
      'Insurance claim processing'
    ],
    limitations: [
      'Cannot make gifts exceeding $1,000 annually',
      'Cannot change beneficiaries on accounts',
      'Must provide quarterly reporting to grantor'
    ],
    effectiveDate: new Date().toISOString().split('T')[0],
    expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notarized: true,
    witnesses: ['Michael Johnson', 'Jennifer Davis'],
    verificationCode: 'POA-DEMO-2025-7891'
  };

  // Store in localStorage for demo
  localStorage.setItem('poa_grant', JSON.stringify(poaGrant));

  // Create proof slip
  const now = new Date().toISOString();
  recordReceipt({
    id: `poa_auth_${Date.now()}`,
    type: 'Decision-RDS',
    policy_version: 'E-2025.08',
    inputs_hash: 'sha256:demo',
    result: 'approve',
    reasons: ['AUTHORITY_GRANT'],
    created_at: now
  } as any);

  return poaGrant;
}

export function getPOAGrant(): POAGrant | null {
  try {
    const stored = localStorage.getItem('poa_grant');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}