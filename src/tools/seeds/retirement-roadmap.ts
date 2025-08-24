import { recordReceipt } from '@/features/receipts/record';

export interface RetirementScenario {
  id: string;
  name: string;
  retirementAge: number;
  monthlyIncome: number;
  savingsGoal: number;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  guardrails: {
    emergencyFund: number;
    debtPayoff: boolean;
    insuranceCoverage: boolean;
  };
}

export async function seedRetirementRoadmap() {
  const scenarios: RetirementScenario[] = [
    {
      id: 'conservative',
      name: 'Conservative Plan',
      retirementAge: 67,
      monthlyIncome: 8500,
      savingsGoal: 2100000,
      riskTolerance: 'conservative',
      guardrails: {
        emergencyFund: 85000,
        debtPayoff: true,
        insuranceCoverage: true
      }
    },
    {
      id: 'moderate',
      name: 'Balanced Plan',
      retirementAge: 65,
      monthlyIncome: 12000,
      savingsGoal: 2800000,
      riskTolerance: 'moderate',
      guardrails: {
        emergencyFund: 120000,
        debtPayoff: true,
        insuranceCoverage: true
      }
    },
    {
      id: 'aggressive',
      name: 'Growth Plan',
      retirementAge: 62,
      monthlyIncome: 15000,
      savingsGoal: 3500000,
      riskTolerance: 'aggressive',
      guardrails: {
        emergencyFund: 150000,
        debtPayoff: true,
        insuranceCoverage: true
      }
    }
  ];

  // Store scenarios in localStorage for demo
  localStorage.setItem('retirement_scenarios', JSON.stringify(scenarios));

  // Create proof slips
  const now = new Date().toISOString();
  
  recordReceipt({
    id: `rr_calc_${Date.now()}`,
    type: 'Decision-RDS',
    policy_version: 'E-2025.08',
    inputs_hash: 'sha256:demo',
    result: 'approve',
    reasons: ['CALC_STARTED'],
    created_at: now
  } as any);

  recordReceipt({
    id: `rr_plan_${Date.now()}`,
    type: 'Decision-RDS',
    policy_version: 'E-2025.08',
    inputs_hash: 'sha256:demo',
    result: 'approve',
    reasons: ['PLAN_SAVED'],
    created_at: now
  } as any);

  return scenarios;
}

export function getRetirementScenarios(): RetirementScenario[] {
  try {
    const stored = localStorage.getItem('retirement_scenarios');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}