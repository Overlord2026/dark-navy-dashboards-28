import type { MonteCarloParams, MonteCarloResult } from './types';

// Box-Muller transform for normal distribution
function normalRandom(mean: number = 0, stdDev: number = 1): number {
  const u1 = Math.random();
  const u2 = Math.random();
  const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return z0 * stdDev + mean;
}

function calculateEmployerMatch(
  salary: number,
  deferralPct: number,
  match: MonteCarloParams['employerMatch']
): number {
  const employeeContrib = salary * (deferralPct / 100);
  const employeeContribPct = Math.min(deferralPct, match.limitPct);
  
  if (match.kind === 'simple') {
    return salary * (employeeContribPct / 100) * (match.pct / 100);
  }
  
  // Tiered matching
  let matchAmount = 0;
  let remainingPct = employeeContribPct;
  
  for (const tier of match.tiers || []) {
    if (remainingPct <= 0) break;
    const tierPct = Math.min(remainingPct, tier.threshold);
    matchAmount += salary * (tierPct / 100) * (tier.rate / 100);
    remainingPct -= tierPct;
  }
  
  return matchAmount;
}

function runSingleSimulation(params: MonteCarloParams): {
  finalBalance: number;
  yearlyData: Array<{ year: number; age: number; balance: number; contribution: number; employerMatch: number; withdrawal: number }>;
} {
  const {
    currentAge,
    retireAge,
    currentBalance,
    income,
    deferralPct,
    employerMatch,
    expectedExpenses,
    inflationRate = 0.025,
    returnMean = 0.07,
    returnStdDev = 0.15
  } = params;

  let balance = currentBalance;
  let currentIncome = income;
  let currentExpenses = expectedExpenses;
  const yearlyData = [];
  
  // Accumulation phase (working years)
  for (let age = currentAge; age < retireAge; age++) {
    const year = age - currentAge + 1;
    
    // Apply inflation to income and expenses
    currentIncome *= (1 + inflationRate);
    currentExpenses *= (1 + inflationRate);
    
    // Calculate contributions
    const employeeContrib = currentIncome * (deferralPct / 100);
    const employerContrib = calculateEmployerMatch(currentIncome, deferralPct, employerMatch);
    const totalContrib = employeeContrib + employerContrib;
    
    // Apply investment return (with volatility)
    const returnRate = normalRandom(returnMean, returnStdDev);
    balance = (balance + totalContrib) * (1 + returnRate);
    
    yearlyData.push({
      year,
      age,
      balance,
      contribution: totalContrib,
      employerMatch: employerContrib,
      withdrawal: 0
    });
  }
  
  // Retirement phase
  for (let age = retireAge; age < Math.min(retireAge + 30, 100); age++) {
    const year = age - currentAge + 1;
    
    // Apply inflation to expenses
    currentExpenses *= (1 + inflationRate);
    
    // Calculate required withdrawal
    const withdrawal = currentExpenses;
    
    // Apply investment return
    const returnRate = normalRandom(returnMean, returnStdDev);
    balance = (balance - withdrawal) * (1 + returnRate);
    
    // Stop if balance goes negative
    if (balance < 0) {
      balance = 0;
      break;
    }
    
    yearlyData.push({
      year,
      age,
      balance,
      contribution: 0,
      employerMatch: 0,
      withdrawal
    });
  }
  
  return { finalBalance: balance, yearlyData };
}

export function runMonteCarloSimulation(params: MonteCarloParams): MonteCarloResult {
  const startTime = performance.now();
  const iterations = params.iterations || 10000;
  const results: number[] = [];
  const allYearlyData: Array<Array<any>> = [];
  
  for (let i = 0; i < iterations; i++) {
    const simulation = runSingleSimulation(params);
    results.push(simulation.finalBalance);
    if (i === 0) {
      // Store first simulation's yearly data as representative
      allYearlyData.push(simulation.yearlyData);
    }
  }
  
  // Calculate success rate (balance > 0 at end)
  const successCount = results.filter(balance => balance > 0).length;
  const successRate = (successCount / iterations) * 100;
  
  // Sort results for percentile calculations
  results.sort((a, b) => a - b);
  
  const getPercentile = (p: number) => {
    const index = Math.ceil((p / 100) * iterations) - 1;
    return results[Math.max(0, index)];
  };
  
  const executionTime = performance.now() - startTime;
  
  return {
    successRate,
    medianBalance: getPercentile(50),
    percentiles: {
      p10: getPercentile(10),
      p25: getPercentile(25),
      p50: getPercentile(50),
      p75: getPercentile(75),
      p90: getPercentile(90)
    },
    yearlyProjections: allYearlyData[0] || [],
    iterations,
    executionTime
  };
}