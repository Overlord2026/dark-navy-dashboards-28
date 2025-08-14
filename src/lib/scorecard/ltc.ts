import { HealthInputs } from './types';

export interface LTCStressResult {
  riskScore: number;
  pvCost: number;
  selfFundFeasible: boolean;
  annualCost: number;
  durationYears: number;
}

export function runLTCStress(
  health: HealthInputs,
  afterTaxNetWorth: number,
  annualRetirementIncome: number
): LTCStressResult {
  // Base annual LTC cost (varies by region, this is a national average)
  const baseLTCCost = 65000; // Per year for nursing home care
  
  // Risk factors
  let riskMultiplier = 1.0;
  
  // Age risk (increases significantly after 65)
  const ageAtRetirement = health.retirementAge;
  if (ageAtRetirement >= 65) {
    riskMultiplier += (ageAtRetirement - 65) * 0.05;
  }
  
  // Health status impact
  switch (health.healthStatus) {
    case 'poor':
      riskMultiplier += 0.4;
      break;
    case 'fair':
      riskMultiplier += 0.2;
      break;
    case 'good':
      riskMultiplier += 0.1;
      break;
    case 'excellent':
      // No additional risk
      break;
  }
  
  // Family history impact
  switch (health.familyHistory) {
    case 'concerning':
      riskMultiplier += 0.3;
      break;
    case 'average':
      riskMultiplier += 0.1;
      break;
    case 'good':
      // No additional risk
      break;
  }
  
  // Calculate probability of needing LTC (base 70% chance)
  const baseProbability = 0.7;
  const adjustedProbability = Math.min(baseProbability * riskMultiplier, 0.95);
  
  // Expected duration of care (varies by gender and health)
  let expectedDuration = 2.5; // years, national average
  if (health.healthStatus === 'poor') {
    expectedDuration = 4.0;
  } else if (health.healthStatus === 'fair') {
    expectedDuration = 3.0;
  }
  
  // Annual cost with inflation adjustment
  const annualCost = baseLTCCost * riskMultiplier;
  
  // Present value of expected LTC costs
  const discountRate = 0.03; // Conservative discount rate
  const yearsToRetirement = Math.max(health.retirementAge - health.currentAge, 0);
  const costAtRetirement = annualCost * Math.pow(1.03, yearsToRetirement); // 3% annual inflation
  
  // Calculate present value of care costs
  let pvCost = 0;
  for (let year = 0; year < expectedDuration; year++) {
    const yearCost = costAtRetirement * Math.pow(1.03, year);
    const pv = yearCost / Math.pow(1 + discountRate, yearsToRetirement + year);
    pvCost += pv;
  }
  
  // Apply probability
  pvCost *= adjustedProbability;
  
  // Check if existing LTC insurance covers the need
  if (health.ltcInsurance && health.ltcCoverage) {
    const insurancePV = (health.ltcCoverage * 365 * expectedDuration * adjustedProbability) / 
      Math.pow(1 + discountRate, yearsToRetirement);
    pvCost = Math.max(0, pvCost - insurancePV);
  }
  
  // Determine if self-funding is feasible
  const ltcReserveNeeded = pvCost;
  const availableAssets = afterTaxNetWorth;
  const selfFundFeasible = availableAssets >= ltcReserveNeeded * 1.5; // 50% buffer
  
  // Risk score based on coverage adequacy
  let riskScore: number;
  if (health.ltcInsurance && health.ltcCoverage && health.ltcCoverage >= annualCost * 0.8) {
    riskScore = 20; // Well insured
  } else if (selfFundFeasible) {
    riskScore = 40; // Can self-fund
  } else if (availableAssets >= ltcReserveNeeded) {
    riskScore = 60; // Marginal coverage
  } else {
    riskScore = 85; // High risk
  }
  
  return {
    riskScore,
    pvCost,
    selfFundFeasible,
    annualCost: costAtRetirement,
    durationYears: expectedDuration
  };
}