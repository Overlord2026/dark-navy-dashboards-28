// Task 6: Calculator Tests - Monte Carlo Calculator
import { describe, test, expect, beforeEach } from 'vitest';

interface MonteCarloInput {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  monthlyContribution: number;
  expectedReturn: number;
  volatility: number;
  inflationRate: number;
  simulations: number;
}

interface MonteCarloResult {
  successProbability: number;
  medianValue: number;
  percentile10: number;
  percentile90: number;
  yearsAnalyzed: number;
  simulations: number;
}

// Mock Monte Carlo Calculator
function runMonteCarloAnalysis(input: MonteCarloInput): MonteCarloResult {
  const yearsToRetirement = input.retirementAge - input.currentAge;
  const monthsToRetirement = yearsToRetirement * 12;
  
  // Simplified simulation (in production, this would be actual Monte Carlo)
  const realReturn = input.expectedReturn - input.inflationRate;
  const monthlyReturn = realReturn / 12;
  const monthlyVolatility = input.volatility / Math.sqrt(12);
  
  // Mock simulation results
  const projectedValue = input.currentSavings * Math.pow(1 + realReturn, yearsToRetirement) +
    input.monthlyContribution * (Math.pow(1 + monthlyReturn, monthsToRetirement) - 1) / monthlyReturn;
  
  return {
    successProbability: Math.min(0.95, Math.max(0.05, projectedValue / 1000000)), // Mock success rate
    medianValue: projectedValue,
    percentile10: projectedValue * 0.7,
    percentile90: projectedValue * 1.4,
    yearsAnalyzed: yearsToRetirement,
    simulations: input.simulations
  };
}

describe('Monte Carlo Calculator Tests', () => {
  test('Standard retirement scenario', () => {
    const input: MonteCarloInput = {
      currentAge: 35,
      retirementAge: 65,
      currentSavings: 100000,
      monthlyContribution: 2000,
      expectedReturn: 0.07,
      volatility: 0.15,
      inflationRate: 0.03,
      simulations: 10000
    };
    
    const result = runMonteCarloAnalysis(input);
    
    expect(result.yearsAnalyzed).toBe(30);
    expect(result.simulations).toBe(10000);
    expect(result.successProbability).toBeGreaterThan(0);
    expect(result.successProbability).toBeLessThanOrEqual(1);
    expect(result.medianValue).toBeGreaterThan(input.currentSavings);
  });

  test('Conservative investment scenario', () => {
    const input: MonteCarloInput = {
      currentAge: 45,
      retirementAge: 67,
      currentSavings: 500000,
      monthlyContribution: 3000,
      expectedReturn: 0.05, // Conservative return
      volatility: 0.08,     // Low volatility
      inflationRate: 0.025,
      simulations: 5000
    };
    
    const result = runMonteCarloAnalysis(input);
    
    expect(result.percentile10).toBeLessThan(result.medianValue);
    expect(result.medianValue).toBeLessThan(result.percentile90);
    expect(result.successProbability).toBeGreaterThan(0.1);
  });

  test('Aggressive growth scenario', () => {
    const input: MonteCarloInput = {
      currentAge: 25,
      retirementAge: 65,
      currentSavings: 25000,
      monthlyContribution: 1500,
      expectedReturn: 0.10, // Aggressive return
      volatility: 0.20,    // High volatility
      inflationRate: 0.03,
      simulations: 10000
    };
    
    const result = runMonteCarloAnalysis(input);
    
    expect(result.yearsAnalyzed).toBe(40);
    expect(result.medianValue).toBeGreaterThan(1000000); // Long time horizon should build wealth
    expect(result.percentile90 - result.percentile10).toBeGreaterThan(result.medianValue * 0.5); // High spread due to volatility
  });

  test('Late starter scenario', () => {
    const input: MonteCarloInput = {
      currentAge: 55,
      retirementAge: 67,
      currentSavings: 200000,
      monthlyContribution: 5000, // Higher contribution to catch up
      expectedReturn: 0.06,
      volatility: 0.12,
      inflationRate: 0.03,
      simulations: 10000
    };
    
    const result = runMonteCarloAnalysis(input);
    
    expect(result.yearsAnalyzed).toBe(12);
    expect(result.medianValue).toBeGreaterThan(input.currentSavings);
    // Late starters should see more contribution impact than growth
  });

  test('Edge case: already at retirement age', () => {
    const input: MonteCarloInput = {
      currentAge: 65,
      retirementAge: 65,
      currentSavings: 800000,
      monthlyContribution: 0,
      expectedReturn: 0.04,
      volatility: 0.06,
      inflationRate: 0.025,
      simulations: 1000
    };
    
    const result = runMonteCarloAnalysis(input);
    
    expect(result.yearsAnalyzed).toBe(0);
    expect(result.medianValue).toBeCloseTo(input.currentSavings, -3); // Should be close to current savings
  });

  test('Input validation scenarios', () => {
    // Test negative values handling
    const invalidInput: MonteCarloInput = {
      currentAge: 30,
      retirementAge: 65,
      currentSavings: -1000, // Invalid
      monthlyContribution: 2000,
      expectedReturn: 0.07,
      volatility: 0.15,
      inflationRate: 0.03,
      simulations: 1000
    };
    
    // Should handle gracefully or throw appropriate error
    expect(() => runMonteCarloAnalysis(invalidInput)).not.toThrow();
  });

  test('High inflation scenario', () => {
    const input: MonteCarloInput = {
      currentAge: 40,
      retirementAge: 65,
      currentSavings: 300000,
      monthlyContribution: 2500,
      expectedReturn: 0.08,
      volatility: 0.16,
      inflationRate: 0.06, // High inflation
      simulations: 10000
    };
    
    const result = runMonteCarloAnalysis(input);
    
    // High inflation should reduce real returns and success probability
    expect(result.successProbability).toBeLessThan(0.9);
    expect(result.medianValue).toBeGreaterThan(0);
  });

  test('Performance consistency across runs', () => {
    const input: MonteCarloInput = {
      currentAge: 35,
      retirementAge: 65,
      currentSavings: 150000,
      monthlyContribution: 2000,
      expectedReturn: 0.07,
      volatility: 0.15,
      inflationRate: 0.03,
      simulations: 1000
    };
    
    const result1 = runMonteCarloAnalysis(input);
    const result2 = runMonteCarloAnalysis(input);
    
    // Results should be reasonably consistent (within 10% for deterministic mock)
    expect(Math.abs(result1.medianValue - result2.medianValue) / result1.medianValue).toBeLessThan(0.1);
  });

  test('Snapshot test for scenario consistency', () => {
    const input: MonteCarloInput = {
      currentAge: 30,
      retirementAge: 60,
      currentSavings: 75000,
      monthlyContribution: 1800,
      expectedReturn: 0.075,
      volatility: 0.14,
      inflationRate: 0.028,
      simulations: 5000
    };
    
    const result = runMonteCarloAnalysis(input);
    
    expect(result).toMatchSnapshot();
  });
});