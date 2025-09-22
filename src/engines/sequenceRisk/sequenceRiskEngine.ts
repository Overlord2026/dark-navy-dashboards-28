import { historicalReturns, getReturnsForPeriod, sequenceRiskScenarios } from '@/data/historicalReturns';

export interface SequenceRiskInput {
  initialPortfolio: number;
  annualWithdrawal: number;
  withdrawalRate: number; // as percentage (e.g., 5 for 5%)
  retirementAge: number;
  longevityAge: number;
  startYear: number;
  inflationAdjustedWithdrawals: boolean;
  assetAllocation: {
    stocks: number;
    bonds: number;
    alternatives?: number;
  };
  phaseProtection?: {
    enabled: boolean;
    incomeNowYears: number;
    incomeNowReturn: number; // e.g., 0.08 for 8% private credit
    maxDrawdown: number; // e.g., 0.04 for 4% max drawdown
  };
}

export interface YearProjection {
  year: number;
  age: number;
  beginningBalance: number;
  marketReturn: number;
  portfolioReturn: number;
  withdrawal: number;
  inflationAdjustedWithdrawal: number;
  endingBalance: number;
  withdrawalRate: number;
  portfolioSurvivalYears: number;
  phaseProtected: boolean;
}

export interface SequenceRiskResults {
  totalYears: number;
  portfolioDepletionYear: number | null;
  portfolioSurvivalYears: number;
  finalPortfolioValue: number;
  totalWithdrawals: number;
  maxWithdrawalRate: number;
  projections: YearProjection[];
  scenarioName: string;
  scenarioDescription: string;
  success: boolean; // Did portfolio last through retirement?
  shortfall: number; // If failed, by how much
  worstYears: YearProjection[]; // Top 3 worst performing years
}

export class SequenceRiskEngine {
  
  static analyzeSequenceRisk(input: SequenceRiskInput): SequenceRiskResults {
    const projections: YearProjection[] = [];
    const totalYears = input.longevityAge - input.retirementAge;
    const historicalData = getReturnsForPeriod(input.startYear, input.startYear + totalYears);
    
    let currentBalance = input.initialPortfolio;
    let currentWithdrawal = input.annualWithdrawal;
    let portfolioDepletionYear: number | null = null;
    let totalWithdrawals = 0;
    let maxWithdrawalRate = input.withdrawalRate;
    
    for (let i = 0; i < totalYears; i++) {
      const currentYear = input.startYear + i;
      const currentAge = input.retirementAge + i;
      
      // Use historical data if available, otherwise use average returns
      const yearData = historicalData[i] || { 
        year: currentYear, 
        sp500Return: 0.10, 
        bondReturn: 0.04, 
        inflationRate: 0.03,
        realReturn: 0.07 
      };
      
      // Calculate portfolio return based on asset allocation
      let portfolioReturn = 
        (input.assetAllocation.stocks / 100) * yearData.sp500Return +
        (input.assetAllocation.bonds / 100) * yearData.bondReturn;
      
      // Apply phase protection if enabled and within protection period
      const phaseProtected = input.phaseProtection?.enabled && 
                           i < (input.phaseProtection?.incomeNowYears || 0);
      
      if (phaseProtected) {
        portfolioReturn = input.phaseProtection!.incomeNowReturn;
        // Apply maximum drawdown constraint
        if (portfolioReturn < -input.phaseProtection!.maxDrawdown) {
          portfolioReturn = -input.phaseProtection!.maxDrawdown;
        }
      }
      
      const beginningBalance = currentBalance;
      
      // Apply market return
      currentBalance = currentBalance * (1 + portfolioReturn);
      
      // Take withdrawal
      if (input.inflationAdjustedWithdrawals && i > 0) {
        currentWithdrawal = currentWithdrawal * (1 + yearData.inflationRate);
      }
      
      const actualWithdrawal = Math.min(currentWithdrawal, currentBalance);
      currentBalance -= actualWithdrawal;
      totalWithdrawals += actualWithdrawal;
      
      // Calculate current withdrawal rate
      const currentWithdrawalRate = beginningBalance > 0 ? 
        (actualWithdrawal / beginningBalance) * 100 : 0;
      
      if (currentWithdrawalRate > maxWithdrawalRate) {
        maxWithdrawalRate = currentWithdrawalRate;
      }
      
      // Check for portfolio depletion
      if (currentBalance <= 0 && portfolioDepletionYear === null) {
        portfolioDepletionYear = currentYear;
        currentBalance = 0;
      }
      
      const projection: YearProjection = {
        year: currentYear,
        age: currentAge,
        beginningBalance,
        marketReturn: yearData.sp500Return,
        portfolioReturn,
        withdrawal: actualWithdrawal,
        inflationAdjustedWithdrawal: currentWithdrawal,
        endingBalance: currentBalance,
        withdrawalRate: currentWithdrawalRate,
        portfolioSurvivalYears: portfolioDepletionYear ? 
          portfolioDepletionYear - input.startYear : totalYears,
        phaseProtected
      };
      
      projections.push(projection);
      
      // Stop if portfolio is depleted
      if (currentBalance <= 0) break;
    }
    
    // Find worst performing years
    const worstYears = projections
      .sort((a, b) => a.portfolioReturn - b.portfolioReturn)
      .slice(0, 3);
    
    const portfolioSurvivalYears = portfolioDepletionYear ? 
      portfolioDepletionYear - input.startYear : totalYears;
    
    const success = portfolioSurvivalYears >= totalYears;
    const shortfall = success ? 0 : 
      (totalYears - portfolioSurvivalYears) * input.annualWithdrawal;
    
    // Determine scenario name
    let scenarioName = `Custom Analysis (${input.startYear})`;
    let scenarioDescription = `Portfolio analysis starting in ${input.startYear}`;
    
    if (input.startYear === 2000) {
      scenarioName = sequenceRiskScenarios.dotComCrash.name;
      scenarioDescription = sequenceRiskScenarios.dotComCrash.description;
    } else if (input.startYear === 2008) {
      scenarioName = sequenceRiskScenarios.financialCrisis.name;
      scenarioDescription = sequenceRiskScenarios.financialCrisis.description;
    }
    
    return {
      totalYears,
      portfolioDepletionYear,
      portfolioSurvivalYears,
      finalPortfolioValue: currentBalance,
      totalWithdrawals,
      maxWithdrawalRate,
      projections,
      scenarioName,
      scenarioDescription,
      success,
      shortfall,
      worstYears
    };
  }
  
  static compareScenarios(baseInput: SequenceRiskInput, scenarios: number[]): SequenceRiskResults[] {
    return scenarios.map(startYear => 
      this.analyzeSequenceRisk({ ...baseInput, startYear })
    );
  }
  
  static analyzePhaseProtectionBenefit(input: SequenceRiskInput): {
    withoutProtection: SequenceRiskResults;
    withProtection: SequenceRiskResults;
    benefitYears: number;
    benefitAmount: number;
  } {
    const withoutProtection = this.analyzeSequenceRisk({
      ...input,
      phaseProtection: { ...input.phaseProtection, enabled: false }
    });
    
    const withProtection = this.analyzeSequenceRisk({
      ...input,
      phaseProtection: { ...input.phaseProtection, enabled: true }
    });
    
    const benefitYears = withProtection.portfolioSurvivalYears - withoutProtection.portfolioSurvivalYears;
    const benefitAmount = withProtection.finalPortfolioValue - withoutProtection.finalPortfolioValue;
    
    return {
      withoutProtection,
      withProtection,
      benefitYears,
      benefitAmount
    };
  }
}