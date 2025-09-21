/**
 * SWAG Analyzer Core Models
 * Outcome-first stress testing across retirement phases
 */

export type PhaseId = 'INCOME_NOW' | 'INCOME_LATER' | 'GROWTH' | 'LEGACY';

export interface PhaseBudgets {
  bL: number; // Liquidity budget
  bA: number; // Asset budget  
  bR: number; // Risk budget
  bT: number; // Tax budget
}

export interface RiskProfile {
  epsilonByPhase: Record<PhaseId, number>;   // chance-constraint tolerances per phase
  budgets: Record<PhaseId, PhaseBudgets>;    // hard caps per phase
  maxDrawdown: number;                       // Maximum acceptable drawdown
  confidenceLevel: number;                   // Target confidence level (e.g., 0.95)
}

export interface ScenarioConfig {
  nPaths: number;                           // Monte Carlo paths
  horizonYears: number;                     // Analysis horizon
  blockLenMonths: number;                   // Bootstrap block length
  
  // Economic parameters
  inflation: {
    mu: number;                             // Mean inflation
    phi: number;                            // AR(1) persistence
    sigma: number;                          // Volatility
  };
  
  rates: {
    meanRev: number;                        // Mean reversion speed (Hull-White)
    vol: number;                            // Interest rate volatility
    longRun: number;                        // Long-run rate level
    r0: number;                             // Initial rate
  };
  
  equity: {
    regimes: number;                        // Number of regimes
    trans: number[][];                      // Transition matrix
    mu: number[];                           // Returns by regime
    sigma: number[];                        // Volatility by regime
  };
  
  privateCredit: {
    baseYield: number;                      // Base yield spread
    defaultProb: number;                    // Annual default probability
    recovery: number;                       // Recovery rate
    taxChar: 'interest' | 'ROC' | 'capgain'; // Tax character
  };
  
  infra: {
    baseYield: number;                      // Infrastructure yield
    rocPct: number;                         // Return of capital %
    depShield: boolean;                     // Depreciation tax shield
  };
  
  crypto: {
    symbols: string[];                      // Crypto assets
    vol: number;                            // Base volatility
    corr: number;                           // Correlation with equity
    unbondDays: number;                     // Staking unbonding period
    slashingProb: number;                   // Slashing probability
  };
  
  ltc: {
    baseHazard: number;                     // Base LTC hazard rate
    age0: number;                           // Reference age
    inflation: number;                      // LTC cost inflation
    intensityDist: number[];                // Care intensity distribution
  };
  
  longevity: {
    male: boolean;                          // Gender
    gmA: number;                            // Gompertz-Makeham A parameter
    gmB: number;                            // Gompertz-Makeham B parameter  
    gmC: number;                            // Gompertz-Makeham C parameter
  };
  
  taxes: {
    ordinary: number;                       // Ordinary income rate
    qualified: number;                      // Qualified dividend rate
    ltg: number;                            // Long-term capital gains
    stg: number;                            // Short-term capital gains
    state: number;                          // State tax rate
    ubti: boolean;                          // UBTI considerations
  };
}

export interface OutcomeMetrics {
  ISP: number;    // Income Sufficiency Probability (0..1)
  DGBP: number;   // Drawdown Guardrail Breach Probability (0..1)
  LCR: number;    // Longevity Coverage Ratio
  LCI: number;    // Legacy Confidence Index (0..1)
  ATE: number;    // After-Tax Efficiency (0..1 or scaled)
  OS: number;     // Composite OutcomeScore
}

export interface PhaseAllocation {
  phaseId: PhaseId;
  allocation: {
    equity: number;
    bonds: number;
    privateCredit: number;
    infrastructure: number;
    crypto: number;
    cash: number;
  };
  expectedReturn: number;
  volatility: number;
  maxDrawdown: number;
}

export interface CashflowProjection {
  year: number;
  age: number;
  beginningBalance: number;
  contributions: number;
  withdrawals: number;
  investmentReturns: number;
  taxes: number;
  ltcCosts: number;
  endingBalance: number;
  phaseAllocation: Record<PhaseId, number>;
}

export interface StressTestResult {
  scenario: string;
  path: number;
  phaseMetrics: Record<PhaseId, OutcomeMetrics>;
  cashflows: CashflowProjection[];
  finalMetrics: {
    portfolioValue: number;
    totalWithdrawals: number;
    successProbability: number;
    yearsToDepletion: number;
  };
}

export interface AnalyzerInput {
  householdId: string;
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  initialPortfolio: number;
  
  holdings: Array<{
    symbol: string;
    quantity: number;
    basis: number;
    accountType: 'taxable' | 'tax_deferred' | 'tax_free';
    assetClass: 'equity' | 'bonds' | 'privateCredit' | 'infrastructure' | 'crypto' | 'cash';
  }>;
  
  cashflowNeeds: Record<PhaseId, {
    schedule: Array<{ t: number; amt: number }>;
    essential: boolean;
    inflationProtected: boolean;
  }>;
  
  risk: RiskProfile;
  scenario: ScenarioConfig;
}

export interface AnalyzerResult {
  householdId: string;
  runId: string;
  timestamp: Date;
  
  phaseMetrics: Record<PhaseId, OutcomeMetrics>;
  worstPathIdx: number;
  percentiles: Record<string, number>;
  
  summary: {
    overallScore: number;
    keyRisks: string[];
    recommendations: string[];
  };
  
  receiptsHash?: string;           // AnchorProof integration
  complianceFlags?: string[];      // Regulatory compliance
}

export interface OutcomeReceipt {
  runId: string;
  householdId: string;
  timestamp: Date;
  inputHash: string;
  resultsHash: string;
  phaseScores: Record<PhaseId, number>;
  overallScore: number;
  signature?: string;              // Cryptographic signature
}

export interface MonitoringReceipt {
  monitoringId: string;
  householdId: string;
  period: {
    start: Date;
    end: Date;
  };
  actualVsProjected: {
    returns: number;
    withdrawals: number;
    ltcEvents: boolean;
  };
  driftAnalysis: {
    allocationDrift: Record<PhaseId, number>;
    riskDrift: number;
    rebalanceRecommended: boolean;
  };
  updatedProjections: AnalyzerResult;
}

// Economic Engine Interfaces
export interface InflationPath {
  years: number[];
  rates: number[];
  cumulativeInflation: number[];
}

export interface RatePath {
  years: number[];
  shortRates: number[];
  longRates: number[];
  yieldCurve: number[][];
}

export interface ReturnPath {
  years: number[];
  equity: number[];
  bonds: number[];
  privateCredit: number[];
  infrastructure: number[];
  crypto: number[];
  regimeStates?: number[];
}

export interface LongevityProjection {
  age: number;
  survivalProbability: number;
  mortalityRate: number;
  lifeExpectancyRemaining: number;
}

export interface LTCProjection {
  age: number;
  onsetProbability: number;
  careIntensity: number;          // 0-1 scale
  annualCost: number;
  cumulativeCost: number;
}