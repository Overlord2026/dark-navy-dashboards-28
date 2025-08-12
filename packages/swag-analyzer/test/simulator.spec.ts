/**
 * Test suite for SWAG Analyzer Monte Carlo Simulator
 */

import { MonteCarloSimulator } from '../src/engines/simulator';
import { SWAGAnalyzer, createDefaultInput } from '../src/index';
import { AnalyzerInput } from '../src/models';

describe('MonteCarloSimulator', () => {
  let simulator: MonteCarloSimulator;
  let testInput: AnalyzerInput;

  beforeEach(() => {
    // Use fixed seed for reproducible tests
    simulator = new MonteCarloSimulator('test_seed_123');
    
    // Create test input
    const baseInput = createDefaultInput('test_household_123');
    testInput = {
      ...baseInput,
      scenario: {
        ...baseInput.scenario!,
        nPaths: 100, // Reduce for faster testing
        horizonYears: 20
      }
    } as AnalyzerInput;
  });

  describe('Economic Scenario Generation', () => {
    test('should generate consistent scenarios with fixed seed', async () => {
      const scenarios1 = await (simulator as any).generateEconomicScenarios(testInput.scenario, 10);
      const scenarios2 = await (simulator as any).generateEconomicScenarios(testInput.scenario, 10);
      
      expect(scenarios1).toHaveLength(100);
      expect(scenarios2).toHaveLength(100);
      
      // With same seed, first scenarios should be identical
      expect(scenarios1[0].inflation.rates[0]).toBeCloseTo(scenarios2[0].inflation.rates[0], 6);
      expect(scenarios1[0].returns.equity[0]).toBeCloseTo(scenarios2[0].returns.equity[0], 6);
    });

    test('should generate paths of correct length', async () => {
      const scenarios = await (simulator as any).generateEconomicScenarios(testInput.scenario, 15);
      
      expect(scenarios[0].inflation.rates).toHaveLength(15);
      expect(scenarios[0].rates.shortRates).toHaveLength(15);
      expect(scenarios[0].returns.equity).toHaveLength(15);
    });

    test('should generate realistic economic values', async () => {
      const scenarios = await (simulator as any).generateEconomicScenarios(testInput.scenario, 10);
      
      for (const scenario of scenarios.slice(0, 10)) { // Test first 10 scenarios
        // Inflation rates should be reasonable (-5% to +15%)
        scenario.inflation.rates.forEach((rate: number) => {
          expect(rate).toBeGreaterThan(-0.05);
          expect(rate).toBeLessThan(0.15);
        });
        
        // Interest rates should be non-negative
        scenario.rates.shortRates.forEach((rate: number) => {
          expect(rate).toBeGreaterThanOrEqual(0.001);
        });
        
        // Equity returns should be within reasonable bounds (-50% to +100%)
        scenario.returns.equity.forEach((ret: number) => {
          expect(ret).toBeGreaterThan(-0.5);
          expect(ret).toBeLessThan(1.0);
        });
      }
    });
  });

  describe('Portfolio Return Calculation', () => {
    test('should calculate weighted portfolio returns correctly', () => {
      const allocation = {
        equity: 0.6,
        bonds: 0.3,
        cash: 0.1,
        privateCredit: 0,
        infrastructure: 0,
        crypto: 0
      };
      
      const marketReturns = {
        equity: [0.1, 0.05, -0.02],
        bonds: [0.03, 0.04, 0.06],
        privateCredit: [0.06],
        infrastructure: [0.05],
        crypto: [0.15],
        regimeStates: [0, 0, 1]
      };
      
      const portfolioReturn = (simulator as any).calculatePortfolioReturn(allocation, marketReturns, 0);
      const expectedReturn = 0.6 * 0.1 + 0.3 * 0.03 + 0.1 * 0.02; // 0.02 cash return
      
      expect(portfolioReturn).toBeCloseTo(expectedReturn, 4);
    });

    test('should handle missing asset returns gracefully', () => {
      const allocation = {
        equity: 0.5,
        bonds: 0.3,
        nonExistentAsset: 0.2,
        cash: 0,
        privateCredit: 0,
        infrastructure: 0,
        crypto: 0
      };
      
      const marketReturns = {
        equity: [0.08],
        bonds: [0.04],
        privateCredit: [0],
        infrastructure: [0],
        crypto: [0]
      };
      
      const portfolioReturn = (simulator as any).calculatePortfolioReturn(allocation, marketReturns, 0);
      const expectedReturn = 0.5 * 0.08 + 0.3 * 0.04; // Missing asset treated as 0 return
      
      expect(portfolioReturn).toBeCloseTo(expectedReturn, 4);
    });
  });

  describe('Cashflow Calculations', () => {
    test('should calculate contributions during working years', () => {
      const currentAge = 45;
      const portfolioValue = 500000;
      const mockInflationPath = { rates: [0.025], cumulativeInflation: [1.0] };
      
      const { contributions, withdrawals } = (simulator as any).calculateCashflows(
        testInput,
        currentAge,
        portfolioValue,
        mockInflationPath,
        0
      );
      
      expect(contributions).toBeGreaterThan(0);
      expect(withdrawals).toBe(0); // Not retired yet
      expect(contributions).toBeLessThanOrEqual(50000); // Contribution cap
    });

    test('should calculate withdrawals during retirement', () => {
      const currentAge = 67; // Retired
      const portfolioValue = 1000000;
      const mockInflationPath = { rates: [0.025], cumulativeInflation: [1.0] };
      
      // Add some cashflow needs
      const retirementInput = {
        ...testInput,
        cashflowNeeds: {
          ...testInput.cashflowNeeds,
          INCOME_NOW: {
            schedule: [{ t: 0, amt: 60000 }],
            essential: true,
            inflationProtected: true
          }
        }
      };
      
      const { contributions, withdrawals } = (simulator as any).calculateCashflows(
        retirementInput,
        currentAge,
        portfolioValue,
        mockInflationPath,
        0
      );
      
      expect(contributions).toBe(0); // No contributions in retirement
      expect(withdrawals).toBeGreaterThan(0);
    });
  });

  describe('Full Analysis Run', () => {
    test('should complete analysis without errors', async () => {
      const result = await simulator.runAnalysis(testInput);
      
      expect(result).toBeDefined();
      expect(result.householdId).toBe('test_household_123');
      expect(result.runId).toMatch(/^swag_\d+_[a-z0-9]+$/);
      expect(result.timestamp).toBeInstanceOf(Date);
      expect(result.phaseAllocations).toHaveLength(4);
      expect(result.stressTests.length).toBeGreaterThan(0);
      expect(result.summary).toBeDefined();
    });

    test('should generate phase allocations for all SWAG phases', async () => {
      const result = await simulator.runAnalysis(testInput);
      
      const phaseIds = result.phaseAllocations.map(pa => pa.phaseId);
      expect(phaseIds).toContain('INCOME_NOW');
      expect(phaseIds).toContain('INCOME_LATER');
      expect(phaseIds).toContain('GROWTH');
      expect(phaseIds).toContain('LEGACY');
      
      // Each allocation should sum to approximately 1.0
      result.phaseAllocations.forEach(allocation => {
        const totalWeight = Object.values(allocation.allocation).reduce((sum, weight) => sum + weight, 0);
        expect(totalWeight).toBeCloseTo(1.0, 2);
      });
    });

    test('should produce reasonable final metrics', async () => {
      const result = await simulator.runAnalysis(testInput);
      
      expect(result.summary.overallScore).toBeGreaterThanOrEqual(0);
      expect(result.summary.overallScore).toBeLessThanOrEqual(100);
      expect(result.summary.percentiles.p50).toBeGreaterThanOrEqual(0);
      expect(result.summary.keyRisks).toBeInstanceOf(Array);
      expect(result.summary.recommendations).toBeInstanceOf(Array);
    });

    test('should handle stress scenarios correctly', async () => {
      const result = await simulator.runAnalysis(testInput);
      
      const stressScenarios = result.stressTests.map(test => test.scenario);
      const uniqueScenarios = [...new Set(stressScenarios)];
      
      // Should have base case plus stress scenarios
      expect(uniqueScenarios.length).toBeGreaterThan(1);
      expect(uniqueScenarios).toContain('base_case');
      
      // Stress scenarios should show different outcomes
      const baseResults = result.stressTests.filter(test => test.scenario === 'base_case');
      const stressResults = result.stressTests.filter(test => test.scenario !== 'base_case');
      
      expect(baseResults.length).toBeGreaterThan(0);
      expect(stressResults.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    test('should handle empty portfolio gracefully', async () => {
      const invalidInput = {
        ...testInput,
        initialPortfolio: 0
      };
      
      await expect(simulator.runAnalysis(invalidInput)).rejects.toThrow();
    });

    test('should handle very short time horizons', async () => {
      const shortInput = {
        ...testInput,
        scenario: {
          ...testInput.scenario,
          horizonYears: 1
        }
      };
      
      const result = await simulator.runAnalysis(shortInput);
      expect(result.stressTests[0].cashflows).toHaveLength(1);
    });
  });
});

describe('SWAGAnalyzer Integration', () => {
  let analyzer: SWAGAnalyzer;
  let testInput: AnalyzerInput;

  beforeEach(() => {
    analyzer = new SWAGAnalyzer('integration_test_seed');
    
    const baseInput = createDefaultInput('integration_test_household');
    testInput = {
      ...baseInput,
      scenario: {
        ...baseInput.scenario!,
        nPaths: 50 // Faster for integration tests
      }
    } as AnalyzerInput;
  });

  test('should perform quick analysis', async () => {
    const result = await analyzer.quickAnalyze(testInput);
    
    expect(result).toBeDefined();
    expect(result.summary.overallScore).toBeGreaterThanOrEqual(0);
    expect(result.summary.overallScore).toBeLessThanOrEqual(100);
  });

  test('should generate rebalancing recommendations', async () => {
    const result = await analyzer.analyze(testInput);
    const recommendations = analyzer.generateRebalancingRecommendations(result);
    
    expect(recommendations).toBeInstanceOf(Array);
    recommendations.forEach(rec => {
      expect(rec.phaseId).toMatch(/^(INCOME_NOW|INCOME_LATER|GROWTH|LEGACY)$/);
      expect(rec.priority).toMatch(/^(high|medium|low)$/);
      expect(rec.recommendations).toBeInstanceOf(Array);
    });
  });

  test('should handle stress testing', async () => {
    const stressResult = await analyzer.stressTest(testInput, ['market_crash', 'inflation_spike']);
    
    expect(stressResult.stressTests).toBeDefined();
    expect(stressResult.summary?.keyRisks).toBeInstanceOf(Array);
  });
});