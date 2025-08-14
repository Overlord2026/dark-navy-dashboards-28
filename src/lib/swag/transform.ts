import { ScorecardParams, ScorecardResults } from '@/lib/scorecard/types';

export interface SWAGRoadmapInput {
  profile: {
    age: number;
    retirementAge: number;
    lifeExpectancy: number;
    healthStatus: string;
  };
  goals: {
    targetIncome: number;
    inflationRate: number;
    legacyGoal: number;
  };
  incomes: {
    current: number;
    socialSecurity: number;
    pension: number;
  };
  accounts: Array<{
    type: string;
    balance: number;
    contribution: number;
    return: number;
  }>;
  tax: {
    effectiveRate: number;
    capGainsRate?: number;
  };
  health: {
    ltcInsurance: boolean;
    ltcCoverage?: number;
    medicalExpenses: number;
  };
}

export function scorecardToRoadmap(
  scorecardParams: ScorecardParams,
  scorecardResults: ScorecardResults
): SWAGRoadmapInput {
  return {
    profile: {
      age: scorecardParams.currentAge,
      retirementAge: scorecardParams.targetRetirementAge,
      lifeExpectancy: scorecardParams.lifeExpectancy,
      healthStatus: scorecardParams.health.healthStatus
    },
    goals: {
      targetIncome: scorecardParams.targetRetirementSpend,
      inflationRate: scorecardParams.inflationRate,
      legacyGoal: 0 // Default, can be enhanced
    },
    incomes: {
      current: scorecardParams.currentIncome,
      socialSecurity: scorecardParams.socialSecurityMonthly * 12,
      pension: scorecardParams.pensionMonthly * 12
    },
    accounts: scorecardParams.accounts.map(acc => ({
      type: acc.taxType,
      balance: acc.balance,
      contribution: acc.annualContrib,
      return: acc.expectedReturn
    })),
    tax: {
      effectiveRate: scorecardParams.effectiveTaxRate,
      capGainsRate: scorecardParams.capGainsRate
    },
    health: {
      ltcInsurance: scorecardParams.health.ltcInsurance,
      ltcCoverage: scorecardParams.health.ltcCoverage,
      medicalExpenses: scorecardParams.health.medicalExpenses
    }
  };
}