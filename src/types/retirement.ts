export interface RetirementGoals {
  retirementAge: number;
  retirementDate: Date;
  currentAge: number;
  desiredLifestyle: 'conservative' | 'moderate' | 'affluent';
  annualRetirementIncome: number;
  inflationRate: number;
  lifeExpectancy: number;
}

export interface SocialSecurityInput {
  enabled: boolean;
  currentEarnings: number;
  earningsHistory: number[];
  filingAge: number;
  spousalBenefit: boolean;
  spousalEarnings?: number;
  colaAdjustment: boolean;
}

export interface PensionInput {
  enabled: boolean;
  monthlyBenefit: number;
  startAge: number;
  survivorBenefit: number;
  colaProtection: boolean;
}

export interface InvestmentAccount {
  id: string;
  type: 'traditional_ira' | 'roth_ira' | 'brokerage' | '401k' | '403b' | '457b' | 'hsa' | 'pension';
  balance: number;
  annualContribution: number;
  employerMatch?: number;
  expectedReturn: number;
  taxStatus: 'pre_tax' | 'after_tax' | 'tax_free';
  requiredMinDistribution?: boolean;
  rmdAge?: number;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  currentAmount: number;
  retirementAmount: number;
  inflationProtected: boolean;
  essential: boolean;
}

export interface TaxOptimizationSettings {
  withdrawalSequence: ('taxable' | 'tax_deferred' | 'tax_free')[];
  rothConversionStrategy: boolean;
  taxBracketManagement: boolean;
  harverstLosses: boolean;
}

export interface HealthcareCosts {
  currentAge: number;
  estimatedAnnualCost: number;
  longTermCareInsurance: boolean;
  longTermCareCost: number;
  medicareSupplementation: boolean;
}

export interface LegacyPlanning {
  targetInheritance: number;
  charitableGiving: number;
  estateTaxPlanning: boolean;
}

export interface MonteCarloResults {
  successProbability: number;
  medianPortfolioValue: number;
  worstCase10th: number;
  bestCase90th: number;
  yearsOfPortfolioSustainability: number;
  swagScore: number; // 0-100 confidence score
}

export interface CashFlowProjection {
  year: number;
  age: number;
  beginningBalance: number;
  income: {
    socialSecurity: number;
    pension: number;
    partTimeWork: number;
    other: number;
  };
  withdrawals: {
    taxable: number;
    taxDeferred: number;
    taxFree: number;
  };
  expenses: {
    essential: number;
    discretionary: number;
    healthcare: number;
    taxes: number;
  };
  endingBalance: number;
  portfolioSustainability: 'excellent' | 'good' | 'at_risk' | 'critical';
}

export type GuardrailMethod = 'none' | 'gk';

export interface GuardrailConfig {
  method: GuardrailMethod;
  initial_withdrawal_rate: number;
  bands_pct: number;
  raise_cut_pct: {
    up: number;
    down: number;
  };
}

export interface PolicyMetrics {
  etayFormula: string;
  seayFormula: string;
}

export interface RetirementPolicy {
  guardrails: GuardrailConfig;
  metrics: PolicyMetrics;
}

export interface RetirementAnalysisInput {
  goals: RetirementGoals;
  socialSecurity: SocialSecurityInput;
  pension: PensionInput;
  accounts: InvestmentAccount[];
  expenses: ExpenseCategory[];
  taxOptimization: TaxOptimizationSettings;
  healthcare: HealthcareCosts;
  legacy: LegacyPlanning;
  policy?: RetirementPolicy;
}

export interface RetirementAnalysisResults {
  readinessScore: number; // 0-100
  monthlyIncomeGap: number;
  projectedCashFlow: CashFlowProjection[];
  monteCarlo: MonteCarloResults;
  recommendations: RetirementRecommendation[];
  scenarioComparisons: ScenarioComparison[];
}

export interface RetirementRecommendation {
  id: string;
  type: 'savings_increase' | 'asset_allocation' | 'tax_strategy' | 'healthcare' | 'insurance' | 'timing';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impactAmount: number;
  implementation: string[];
}

export interface ScenarioComparison {
  name: string;
  description: string;
  modifiedInputs: Partial<RetirementAnalysisInput>;
  results: {
    readinessScore: number;
    monthlyIncomeGap: number;
    swagScore: number;
  };
}

export interface RetirementCalculatorState {
  inputs: RetirementAnalysisInput;
  results: RetirementAnalysisResults | null;
  loading: boolean;
  error: string | null;
}

// Minimal SWAG types for quick analysis
export type SwagInputs = { 
  horizonYears: number; 
  spendFloor: number; 
  spendCeiling: number; 
  taxBand?: string; 
  seed?: number; 
};

export type SwagResult = { 
  successProb: number; 
  guardrailFlags: string[]; 
  summary: string; 
  generatedAt: string; 
};

export type SwagScenario = { 
  id: string; 
  name: string; 
  inputs: SwagInputs; 
  result?: SwagResult; 
  tags?: string[]; 
};