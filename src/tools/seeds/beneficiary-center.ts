import { recordReceipt } from '@/features/receipts/record';

export interface BeneficiaryRecord {
  id: string;
  accountType: string;
  accountNumber: string;
  primaryBeneficiary: string;
  contingentBeneficiary?: string;
  percentage: number;
  lastUpdated: string;
  status: 'current' | 'outdated' | 'mismatch';
  warnings?: string[];
}

export async function seedBeneficiaryCenter() {
  const beneficiaries: BeneficiaryRecord[] = [
    {
      id: 'bene_401k',
      accountType: '401(k)',
      accountNumber: '****-1234',
      primaryBeneficiary: 'Sarah Johnson (Spouse)',
      contingentBeneficiary: 'Michael Johnson (Son)',
      percentage: 100,
      lastUpdated: '2023-01-15',
      status: 'current',
    },
    {
      id: 'bene_ira',
      accountType: 'Traditional IRA',
      accountNumber: '****-5678',
      primaryBeneficiary: 'Sarah Johnson (Spouse)',
      percentage: 100,
      lastUpdated: '2022-06-20',
      status: 'outdated',
      warnings: ['Last updated over 12 months ago']
    },
    {
      id: 'bene_life',
      accountType: 'Life Insurance',
      accountNumber: 'POL-9876',
      primaryBeneficiary: 'Jane Doe (Ex-spouse)',
      contingentBeneficiary: 'Michael Johnson (Son)',
      percentage: 100,
      lastUpdated: '2020-03-10',
      status: 'mismatch',
      warnings: ['Beneficiary may be outdated', 'Consider updating after life changes']
    }
  ];

  // Store in localStorage for demo
  localStorage.setItem('beneficiary_records', JSON.stringify(beneficiaries));

  // Create proof slip for warning
  const now = new Date().toISOString();
  recordReceipt({
    id: `ben_warn_${Date.now()}`,
    type: 'Decision-RDS',
    policy_version: 'E-2025.08',
    inputs_hash: 'sha256:demo',
    result: 'approve',
    reasons: ['BENEFICIARY_WARN'],
    created_at: now
  } as any);

  return beneficiaries;
}

export function getBeneficiaryRecords(): BeneficiaryRecord[] {
  try {
    const stored = localStorage.getItem('beneficiary_records');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}