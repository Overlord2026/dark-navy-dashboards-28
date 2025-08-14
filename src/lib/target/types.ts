export type TargetParams = {
  currentAge: number;
  retireAge: number;
  workRate: number; // 0..1 (e.g., 0.6 = 3 days/wk)
  spendTarget: number; // annual after-tax desired spending
  savingsRate: number; // % of earned income saved
  inflation: number; // e.g., 0.025
  expGrowth: number; // spending growth (real or nominal)
  ror: number; // blended expectation
  taxRate: number; // effective; can swap to brackets later
  ssStartAge?: number;
  pensions?: { startAge: number; amount: number }[];
  balances?: { name: string; taxType: "taxable" | "trad" | "roth"; value: number }[];
  horizon?: number; // years to project (default 40)
  currentIncome?: number; // base income when working
};

export type YearRow = {
  year: number;
  age: number;
  earned: number;
  ss: number;
  pensions: number;
  grossIncome: number;
  taxes: number;
  spending: number;
  savings: number;
  portfolioStart: number;
  portfolioEnd: number;
  withdrawals: number;
};

export type TargetResult = {
  params: TargetParams;
  rows: YearRow[];
  success?: number;
  gapAmount: number;
  successRate?: number;
  targetMet: boolean;
};

export type SavedTargetRun = {
  id: string;
  label: string;
  params: TargetParams;
  computed: TargetResult;
  gapAmount: number;
  createdAt: string;
  scenario_id?: string;
  household_id?: string;
};