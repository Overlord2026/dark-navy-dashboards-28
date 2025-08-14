import { ScorecardParams, ScorecardResults, Account } from './types';
import { afterTaxValueForDisplay, planWithdrawals, calculateTaxEfficiencyScore } from './tax';
import { runLTCStress } from './ltc';

export function runScorecardTaxAware(params: ScorecardParams): ScorecardResults {
  const {
    currentAge,
    targetRetirementAge,
    lifeExpectancy,
    currentIncome,
    savingsRate,
    targetRetirementSpend,
    inflationRate,
    expectedReturn,
    effectiveTaxRate,
    capGainsRate,
    socialSecurityMonthly,
    pensionMonthly,
    health,
    accounts
  } = params;
  
  const yearsToRetirement = targetRetirementAge - currentAge;
  const retirementYears = lifeExpectancy - targetRetirementAge;
  
  // Calculate current savings and projected accumulation
  const annualSavings = currentIncome * (savingsRate / 100);
  const totalCurrentBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  
  // Project account balances to retirement with contributions
  const futureAccounts: Account[] = accounts.map(acc => {
    const futureBalance = acc.balance * Math.pow(1 + acc.expectedReturn, yearsToRetirement) +
      acc.annualContrib * (Math.pow(1 + acc.expectedReturn, yearsToRetirement) - 1) / acc.expectedReturn;
    
    return {
      ...acc,
      balance: futureBalance
    };
  });
  
  // Calculate after-tax net worth at retirement
  const afterTaxNW = futureAccounts.reduce((sum, acc) => {
    return sum + afterTaxValueForDisplay(acc.balance, acc.taxType, effectiveTaxRate, capGainsRate);
  }, 0);
  
  // Calculate guaranteed income
  const guaranteed = (socialSecurityMonthly + pensionMonthly) * 12;
  
  // Calculate spending target at retirement (adjusted for inflation)
  const spendAtStart = targetRetirementSpend * Math.pow(1 + inflationRate, yearsToRetirement);
  
  // Calculate first year gap (income needed from investments)
  const firstYearGap = Math.max(0, spendAtStart - guaranteed);
  
  // Calculate portfolio withdrawal slices
  const withdrawalSlices = planWithdrawals(firstYearGap, futureAccounts, effectiveTaxRate, capGainsRate);
  const totalWithdrawalAmount = withdrawalSlices.reduce((sum, slice) => sum + slice.amount, 0);
  const estTaxYear1 = withdrawalSlices.reduce((sum, slice) => sum + (slice.amount * slice.taxRate), 0);
  
  // Calculate withdrawal slices breakdown
  const slicesByType = withdrawalSlices.reduce((acc, slice) => {
    switch (slice.source) {
      case 'taxable':
        acc.taxable += slice.amount;
        break;
      case 'trad':
        acc.traditional += slice.amount;
        break;
      case 'roth':
        acc.roth += slice.amount;
        break;
      case 'hsa':
        acc.hsa += slice.amount;
        break;
      case 'annuity_qualified':
      case 'annuity_nonqualified':
        acc.annuities += slice.amount;
        break;
    }
    return acc;
  }, { taxable: 0, traditional: 0, roth: 0, hsa: 0, annuities: 0 });
  
  // Run LTC stress test
  const ltcResult = runLTCStress(health, afterTaxNW, spendAtStart);
  
  // Calculate component scores
  const fundingScore = calculateFundingScore(afterTaxNW, firstYearGap, retirementYears);
  const taxEfficiencyScore = calculateTaxEfficiencyScore(futureAccounts, effectiveTaxRate);
  const investmentFitScore = calculateInvestmentFitScore(accounts, currentAge, targetRetirementAge);
  const longevityScore = calculateLongevityScore(afterTaxNW, spendAtStart, retirementYears, expectedReturn);
  const resilienceScore = calculateResilienceScore(ltcResult, afterTaxNW, guaranteed, spendAtStart);
  
  // Calculate overall score (weighted average)
  const score = Math.round(
    fundingScore * 0.35 +
    taxEfficiencyScore * 0.2 +
    investmentFitScore * 0.15 +
    longevityScore * 0.2 +
    resilienceScore * 0.1
  );
  
  return {
    score: Math.max(0, Math.min(100, score)),
    breakdown: {
      funding: fundingScore,
      taxEfficiency: taxEfficiencyScore,
      investmentFit: investmentFitScore,
      longevity: longevityScore,
      resilience: resilienceScore
    },
    afterTaxNW,
    spendAtStart,
    guaranteed,
    firstYearGap,
    estTaxYear1,
    ltc: ltcResult,
    slices: slicesByType
  };
}

function calculateFundingScore(afterTaxNW: number, firstYearGap: number, retirementYears: number): number {
  if (firstYearGap === 0) return 100;
  
  const sustainableWithdrawal = afterTaxNW * 0.04; // 4% rule
  const coverage = sustainableWithdrawal / firstYearGap;
  
  if (coverage >= 1.5) return 100;
  if (coverage >= 1.2) return 85;
  if (coverage >= 1.0) return 70;
  if (coverage >= 0.8) return 55;
  if (coverage >= 0.6) return 40;
  if (coverage >= 0.4) return 25;
  return 10;
}

function calculateInvestmentFitScore(accounts: Account[], currentAge: number, targetRetirementAge: number): number {
  const yearsToRetirement = targetRetirementAge - currentAge;
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  
  if (totalBalance === 0) return 50; // Neutral if no accounts
  
  // Calculate weighted average expected return
  const weightedReturn = accounts.reduce((sum, acc) => {
    return sum + (acc.expectedReturn * acc.balance / totalBalance);
  }, 0);
  
  // Age-appropriate return expectations
  const ageFactor = Math.max(0, (100 - currentAge) / 100);
  const recommendedReturn = 0.04 + (ageFactor * 0.04); // 4-8% based on age
  
  const returnDiff = Math.abs(weightedReturn - recommendedReturn);
  
  if (returnDiff <= 0.01) return 100;
  if (returnDiff <= 0.02) return 85;
  if (returnDiff <= 0.03) return 70;
  if (returnDiff <= 0.04) return 55;
  return 40;
}

function calculateLongevityScore(
  afterTaxNW: number,
  spendAtStart: number,
  retirementYears: number,
  expectedReturn: number
): number {
  if (spendAtStart === 0) return 100;
  
  // Calculate portfolio sustainability over retirement period
  let portfolioValue = afterTaxNW;
  const realReturn = expectedReturn - 0.03; // Adjust for 3% inflation
  
  for (let year = 0; year < retirementYears; year++) {
    portfolioValue = (portfolioValue - spendAtStart) * (1 + realReturn);
    if (portfolioValue < 0) {
      const survivalRate = year / retirementYears;
      return Math.round(survivalRate * 100);
    }
    spendAtStart *= 1.03; // Inflate spending
  }
  
  // Portfolio survived the full period
  const finalValue = portfolioValue;
  if (finalValue > afterTaxNW) return 100; // Portfolio grew
  if (finalValue > afterTaxNW * 0.5) return 85; // Reasonable depletion
  if (finalValue > 0) return 70; // Lasted but depleted
  return 60;
}

function calculateResilienceScore(
  ltcResult: any,
  afterTaxNW: number,
  guaranteed: number,
  spendAtStart: number
): number {
  let score = 100;
  
  // Penalize for LTC risk
  score -= (ltcResult.riskScore * 0.3);
  
  // Penalize for low guaranteed income coverage
  const guaranteedCoverage = guaranteed / spendAtStart;
  if (guaranteedCoverage < 0.3) score -= 20;
  else if (guaranteedCoverage < 0.5) score -= 10;
  
  // Penalize for concentrated risk
  const emergencyFund = afterTaxNW * 0.1;
  if (emergencyFund < spendAtStart * 2) score -= 15;
  
  return Math.max(0, Math.round(score));
}