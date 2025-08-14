export type TaxType = 'taxable' | 'trad' | 'roth' | 'hsa' | 'annuity_qualified' | 'annuity_nonqualified';

export interface Account {
  id?: string;
  name: string;
  taxType: TaxType;
  balance: number;
  annualContrib: number;
  expectedReturn: number;
  qualified: boolean;
}

export interface HealthInputs {
  currentAge: number;
  retirementAge: number;
  healthStatus: 'excellent' | 'good' | 'fair' | 'poor';
  familyHistory: 'good' | 'average' | 'concerning';
  ltcInsurance: boolean;
  ltcCoverage?: number;
  medicalExpenses: number;
  prescriptionCosts: number;
}

export interface ScorecardParams {
  // Demographics
  currentAge: number;
  targetRetirementAge: number;
  lifeExpectancy: number;
  
  // Income & Savings
  currentIncome: number;
  savingsRate: number; // percentage
  
  // Spending
  targetRetirementSpend: number;
  inflationRate: number;
  
  // Investment
  expectedReturn: number;
  
  // Taxes
  effectiveTaxRate: number;
  capGainsRate?: number;
  
  // Social Security & Pension
  socialSecurityMonthly: number;
  pensionMonthly: number;
  
  // Health
  health: HealthInputs;
  
  // Accounts
  accounts: Account[];
}

export interface ScorecardResults {
  score: number;
  breakdown: {
    funding: number;
    taxEfficiency: number;
    investmentFit: number;
    longevity: number;
    resilience: number;
  };
  afterTaxNW: number;
  spendAtStart: number;
  guaranteed: number;
  firstYearGap: number;
  estTaxYear1: number;
  ltc: {
    riskScore: number;
    pvCost: number;
    selfFundFeasible: boolean;
  };
  slices: {
    taxable: number;
    traditional: number;
    roth: number;
    hsa: number;
    annuities: number;
  };
}

export interface WithdrawalSlice {
  source: TaxType;
  amount: number;
  taxRate: number;
  afterTaxAmount: number;
}