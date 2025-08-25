export type MonteCarloParams = {
  currentAge: number;
  retireAge: number;
  currentBalance: number;
  income: number;
  deferralPct: number;
  employerMatch: {
    kind: 'simple' | 'tiered';
    pct: number;
    limitPct: number;
    tiers?: Array<{ threshold: number; rate: number }>;
  };
  expectedExpenses: number;
  inflationRate?: number;
  returnMean?: number;
  returnStdDev?: number;
  iterations?: number;
};

export type MonteCarloResult = {
  successRate: number;
  medianBalance: number;
  percentiles: {
    p10: number;
    p25: number;
    p50: number;
    p75: number;
    p90: number;
  };
  yearlyProjections: Array<{
    year: number;
    age: number;
    balance: number;
    contribution: number;
    employerMatch: number;
    withdrawal: number;
  }>;
  iterations: number;
  executionTime: number;
};

export type SimulationProgress = {
  completed: number;
  total: number;
  percentage: number;
};