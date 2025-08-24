import { recordReceipt } from '@/features/receipts/record';

export interface RothLadderYear {
  year: number;
  conversionAmount: number;
  taxOwed: number;
  availableForWithdrawal: number;
  totalRothBalance: number;
  notes: string;
}

export async function seedRothLadder() {
  const currentYear = new Date().getFullYear();
  
  const ladderPlan: RothLadderYear[] = [
    {
      year: currentYear,
      conversionAmount: 50000,
      taxOwed: 12000,
      availableForWithdrawal: 0,
      totalRothBalance: 50000,
      notes: 'Initial conversion - 24% tax bracket'
    },
    {
      year: currentYear + 1,
      conversionAmount: 55000,
      taxOwed: 13200,
      availableForWithdrawal: 0,
      totalRothBalance: 105000,
      notes: 'Increased conversion amount'
    },
    {
      year: currentYear + 2,
      conversionAmount: 60000,
      taxOwed: 14400,
      availableForWithdrawal: 0,
      totalRothBalance: 165000,
      notes: 'Maximum conversion before higher bracket'
    },
    {
      year: currentYear + 3,
      conversionAmount: 50000,
      taxOwed: 12000,
      availableForWithdrawal: 0,
      totalRothBalance: 215000,
      notes: 'Maintaining optimal tax bracket'
    },
    {
      year: currentYear + 4,
      conversionAmount: 50000,
      taxOwed: 12000,
      availableForWithdrawal: 0,
      totalRothBalance: 265000,
      notes: 'Consistent conversion strategy'
    },
    {
      year: currentYear + 5,
      conversionAmount: 0,
      taxOwed: 0,
      availableForWithdrawal: 50000,
      totalRothBalance: 265000,
      notes: 'First year available for tax-free withdrawal'
    }
  ];

  // Store in localStorage for demo
  localStorage.setItem('roth_ladder_plan', JSON.stringify(ladderPlan));

  // Create proof slip
  const now = new Date().toISOString();
  recordReceipt({
    id: `roth_plan_${Date.now()}`,
    type: 'Decision-RDS',
    policy_version: 'E-2025.08',
    inputs_hash: 'sha256:demo',
    result: 'approve',
    reasons: ['ROTH_PLAN'],
    created_at: now
  } as any);

  return ladderPlan;
}

export function getRothLadderPlan(): RothLadderYear[] {
  try {
    const stored = localStorage.getItem('roth_ladder_plan');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}