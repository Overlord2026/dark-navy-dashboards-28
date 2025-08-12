/**
 * Test suite for Phase Objective Calculator
 */

import { PhaseObjectiveCalculator } from '../src/phase_objective';
import { StressTestResult, AnalyzerInput, OutcomeMetrics } from '../src/models';
import { createDefaultInput } from '../src/index';

describe('PhaseObjectiveCalculator', () => {
  let calculator: PhaseObjectiveCalculator;
  let mockInput: AnalyzerInput;
  let mockStressTests: StressTestResult[];

  beforeEach(() => {
    calculator = new PhaseObjectiveCalculator();
    
    const baseInput = createDefaultInput('test_household_phase_calc');
    mockInput = {
      ...baseInput,
      cashflowNeeds: {
        INCOME_NOW: {
          schedule: [
            { t: 0, amt: 60000 },
            { t: 1, amt: 62000 }
          ],
          essential: true,
          inflationProtected: true
        },
        INCOME_LATER: {
          schedule: [
            { t: 3, amt: 65000 },
            { t: 5, amt: 70000 }
          ],
          essential: true,
          inflationProtected: true
        },
        GROWTH: {
          schedule: [],
          essential: false,
          inflationProtected: false
        },
        LEGACY: {
          schedule: [
            { t: 25, amt: 500000 }
          ],
          essential: false,
          inflationProtected: false
        }
      }
    } as AnalyzerInput;

    // Create mock stress test results
    mockStressTests = createMockStressTests();
  });

  describe('Income Sufficiency Probability (ISP)', () => {
    test('should calculate 100% ISP when all needs are met', () => {
      const perfectTests: StressTestResult[] = [{
        scenario: 'perfect',
        path: 0,
        phaseMetrics: {} as any,
        cashflows: [
          {
            year: 0,
            age: 65,
            beginningBalance: 1000000,
            contributions: 0,
            withdrawals: 60000,
            investmentReturns: 50000,
            taxes: 10000,
            ltcCosts: 0,
            endingBalance: 980000,
            phaseAllocation: {} as any
          },
          {
            year: 1,
            age: 66,
            beginningBalance: 980000,
            contributions: 0,
            withdrawals: 62000,
            investmentReturns: 45000,
            taxes: 9000,
            ltcCosts: 0,
            endingBalance: 954000,
            phaseAllocation: {} as any
          }
        ],
        finalMetrics: {
          portfolioValue: 954000,
          totalWithdrawals: 122000,
          successProbability: 1,
          yearsToDepletion: 30
        }
      }];

      const metrics = calculator.calculatePhaseOutcomes(
        'INCOME_NOW',
        perfectTests,
        mockInput,
        { startYear: 0, endYear: 2 }
      );

      expect(metrics.ISP).toBe(1.0);
    });

    test('should calculate 0% ISP when no needs are met', () => {
      const failedTests: StressTestResult[] = [{
        scenario: 'failed',
        path: 0,
        phaseMetrics: {} as any,
        cashflows: [
          {
            year: 0,
            age: 65,
            beginningBalance: 100000,
            contributions: 0,
            withdrawals: 10000, // Much less than needed 60000
            investmentReturns: -5000,
            taxes: 1000,
            ltcCosts: 0,
            endingBalance: 84000,
            phaseAllocation: {} as any
          }
        ],
        finalMetrics: {
          portfolioValue: 0,
          totalWithdrawals: 10000,
          successProbability: 0,
          yearsToDepletion: 1
        }
      }];

      const metrics = calculator.calculatePhaseOutcomes(
        'INCOME_NOW',
        failedTests,
        mockInput,
        { startYear: 0, endYear: 2 }
      );

      expect(metrics.ISP).toBe(0);
    });

    test('should handle partial income sufficiency', () => {
      const partialTests: StressTestResult[] = [
        // One successful path
        {
          scenario: 'partial_success',
          path: 0,
          phaseMetrics: {} as any,
          cashflows: [
            {
              year: 0,
              age: 65,
              beginningBalance: 1000000,
              contributions: 0,
              withdrawals: 60000, // Meets requirement
              investmentReturns: 50000,
              taxes: 10000,
              ltcCosts: 0,
              endingBalance: 980000,
              phaseAllocation: {} as any
            }
          ],
          finalMetrics: {
            portfolioValue: 980000,
            totalWithdrawals: 60000,
            successProbability: 1,
            yearsToDepletion: 25
          }
        },
        // One failed path
        {
          scenario: 'partial_failure',
          path: 1,
          phaseMetrics: {} as any,
          cashflows: [
            {
              year: 0,
              age: 65,
              beginningBalance: 100000,
              contributions: 0,
              withdrawals: 30000, // Doesn't meet 60000 requirement
              investmentReturns: 5000,
              taxes: 3000,
              ltcCosts: 0,
              endingBalance: 72000,
              phaseAllocation: {} as any
            }
          ],
          finalMetrics: {
            portfolioValue: 72000,
            totalWithdrawals: 30000,
            successProbability: 1,
            yearsToDepletion: 3
          }
        }
      ];

      const metrics = calculator.calculatePhaseOutcomes(
        'INCOME_NOW',
        partialTests,
        mockInput,
        { startYear: 0, endYear: 1 }
      );

      expect(metrics.ISP).toBe(0.5); // 1 out of 2 paths successful
    });
  });

  describe('Drawdown Guardrail Breach Probability (DGBP)', () => {
    test('should calculate DGBP based on maximum drawdown', () => {
      const drawdownTests: StressTestResult[] = [{
        scenario: 'drawdown_test',
        path: 0,
        phaseMetrics: {} as any,
        cashflows: [
          {
            year: 0,
            age: 65,
            beginningBalance: 1000000,
            contributions: 0,
            withdrawals: 50000,
            investmentReturns: -200000, // 20% loss
            taxes: 5000,
            ltcCosts: 0,
            endingBalance: 745000, // 25.5% drawdown from peak
            phaseAllocation: {} as any
          },
          {
            year: 1,
            age: 66,
            beginningBalance: 745000,
            contributions: 0,
            withdrawals: 50000,
            investmentReturns: 60000,
            taxes: 8000,
            ltcCosts: 0,
            endingBalance: 747000,
            phaseAllocation: {} as any
          }
        ],
        finalMetrics: {
          portfolioValue: 747000,
          totalWithdrawals: 100000,
          successProbability: 1,
          yearsToDepletion: 15
        }
      }];

      const metrics = calculator.calculatePhaseOutcomes(
        'INCOME_NOW',
        drawdownTests,
        mockInput,
        { startYear: 0, endYear: 2 }
      );

      // Should breach the 25% max drawdown limit
      expect(metrics.DGBP).toBe(1.0);
    });

    test('should handle no drawdown breach', () => {
      const noBreachTests: StressTestResult[] = [{
        scenario: 'no_breach',
        path: 0,
        phaseMetrics: {} as any,
        cashflows: [
          {
            year: 0,
            age: 65,
            beginningBalance: 1000000,
            contributions: 0,
            withdrawals: 40000,
            investmentReturns: 60000, // Positive return
            taxes: 8000,
            ltcCosts: 0,
            endingBalance: 1012000,
            phaseAllocation: {} as any
          }
        ],
        finalMetrics: {
          portfolioValue: 1012000,
          totalWithdrawals: 40000,
          successProbability: 1,
          yearsToDepletion: 30
        }
      }];

      const metrics = calculator.calculatePhaseOutcomes(
        'INCOME_NOW',
        noBreachTests,
        mockInput,
        { startYear: 0, endYear: 1 }
      );

      expect(metrics.DGBP).toBe(0);
    });
  });

  describe('Legacy Confidence Index (LCI)', () => {
    test('should calculate high LCI when legacy goals are exceeded', () => {
      const highLegacyTests: StressTestResult[] = [{
        scenario: 'high_legacy',
        path: 0,
        phaseMetrics: {} as any,
        cashflows: [
          {
            year: 25,
            age: 90,
            beginningBalance: 800000,
            contributions: 0,
            withdrawals: 0,
            investmentReturns: 40000,
            taxes: 5000,
            ltcCosts: 0,
            endingBalance: 835000,
            phaseAllocation: {} as any
          }
        ],
        finalMetrics: {
          portfolioValue: 835000, // Exceeds 500k legacy goal
          totalWithdrawals: 500000,
          successProbability: 1,
          yearsToDepletion: 35
        }
      }];

      const metrics = calculator.calculatePhaseOutcomes(
        'LEGACY',
        highLegacyTests,
        mockInput,
        { startYear: 25, endYear: 30 }
      );

      expect(metrics.LCI).toBe(1.0);
    });

    test('should calculate low LCI when legacy goals are not met', () => {
      const lowLegacyTests: StressTestResult[] = [{
        scenario: 'low_legacy',
        path: 0,
        phaseMetrics: {} as any,
        cashflows: [],
        finalMetrics: {
          portfolioValue: 200000, // Below 500k legacy goal
          totalWithdrawals: 800000,
          successProbability: 0,
          yearsToDepletion: 22
        }
      }];

      const metrics = calculator.calculatePhaseOutcomes(
        'LEGACY',
        lowLegacyTests,
        mockInput,
        { startYear: 25, endYear: 30 }
      );

      expect(metrics.LCI).toBe(0);
    });
  });

  describe('Composite Outcome Score (OS)', () => {
    test('should calculate weighted composite score correctly', () => {
      const testMetrics: Omit<OutcomeMetrics, 'OS'> = {
        ISP: 0.85,   // 85%
        DGBP: 0.15,  // 15% (will be inverted to 85%)
        LCR: 0.90,   // 90%
        LCI: 0.80,   // 80%
        ATE: 0.75    // 75%
      };

      const os = (calculator as any).calculateCompositeOutcomeScore(testMetrics, 'INCOME_NOW');
      
      // For INCOME_NOW: ISP=40%, DGBP=30%, LCR=15%, LCI=5%, ATE=10%
      const expectedScore = 
        0.40 * 85 +   // ISP
        0.30 * 85 +   // DGBP (inverted)
        0.15 * 90 +   // LCR
        0.05 * 80 +   // LCI
        0.10 * 75;    // ATE
      
      expect(os).toBeCloseTo(expectedScore, 0);
      expect(os).toBeGreaterThanOrEqual(0);
      expect(os).toBeLessThanOrEqual(100);
    });

    test('should use phase-specific weights', () => {
      const testMetrics: Omit<OutcomeMetrics, 'OS'> = {
        ISP: 0.80,
        DGBP: 0.20,
        LCR: 0.85,
        LCI: 0.90,
        ATE: 0.70
      };

      const incomeNowScore = (calculator as any).calculateCompositeOutcomeScore(testMetrics, 'INCOME_NOW');
      const legacyScore = (calculator as any).calculateCompositeOutcomeScore(testMetrics, 'LEGACY');
      
      // Legacy phase should weight LCI higher, so with high LCI (90%), 
      // legacy score should be higher than income_now score
      expect(legacyScore).toBeGreaterThan(incomeNowScore);
    });
  });

  describe('Phase Transition Analysis', () => {
    test('should recommend transition when metrics improve', () => {
      const currentMetrics: OutcomeMetrics = {
        ISP: 0.70, DGBP: 0.25, LCR: 0.80, LCI: 0.60, ATE: 0.65, OS: 70
      };
      
      const projectedMetrics: OutcomeMetrics = {
        ISP: 0.80, DGBP: 0.20, LCR: 0.85, LCI: 0.75, ATE: 0.70, OS: 78
      };

      const transition = calculator.calculatePhaseTransitionMetrics(
        'INCOME_NOW',
        'INCOME_LATER',
        currentMetrics,
        projectedMetrics
      );

      expect(transition.transitionRecommended).toBe(true);
      expect(transition.confidenceLevel).toBeGreaterThan(0);
      expect(transition.riskAdjustments).toBeInstanceOf(Array);
      expect(transition.allocationChanges).toBeInstanceOf(Array);
    });

    test('should not recommend transition when risk increases too much', () => {
      const currentMetrics: OutcomeMetrics = {
        ISP: 0.85, DGBP: 0.15, LCR: 0.90, LCI: 0.80, ATE: 0.75, OS: 82
      };
      
      const projectedMetrics: OutcomeMetrics = {
        ISP: 0.88, DGBP: 0.40, LCR: 0.85, LCI: 0.85, ATE: 0.80, OS: 85 // High DGBP
      };

      const transition = calculator.calculatePhaseTransitionMetrics(
        'INCOME_NOW',
        'GROWTH',
        currentMetrics,
        projectedMetrics
      );

      expect(transition.transitionRecommended).toBe(false);
      expect(transition.riskAdjustments.length).toBeGreaterThan(0);
    });
  });

  describe('Rebalancing Recommendations', () => {
    test('should generate recommendations for underperforming phases', () => {
      const phaseMetrics = {
        INCOME_NOW: { ISP: 0.60, DGBP: 0.30, LCR: 0.70, LCI: 0.65, ATE: 0.60, OS: 62 },
        INCOME_LATER: { ISP: 0.75, DGBP: 0.20, LCR: 0.80, LCI: 0.70, ATE: 0.70, OS: 74 },
        GROWTH: { ISP: 0.85, DGBP: 0.15, LCR: 0.90, LCI: 0.85, ATE: 0.80, OS: 85 },
        LEGACY: { ISP: 0.80, DGBP: 0.18, LCR: 0.85, LCI: 0.90, ATE: 0.75, OS: 82 }
      };

      const targetScores = {
        INCOME_NOW: 75,
        INCOME_LATER: 75,
        GROWTH: 75,
        LEGACY: 75
      };

      const recommendations = calculator.generateRebalancingRecommendations(
        phaseMetrics,
        targetScores
      );

      // Should recommend improvements for INCOME_NOW (score 62 < target 75)
      const incomeNowRec = recommendations.find(r => r.phaseId === 'INCOME_NOW');
      expect(incomeNowRec).toBeDefined();
      expect(incomeNowRec!.priority).toBe('high'); // Gap > 15
      expect(incomeNowRec!.recommendations.length).toBeGreaterThan(0);

      // Should not recommend for GROWTH (score 85 > target 75)
      const growthRec = recommendations.find(r => r.phaseId === 'GROWTH');
      expect(growthRec).toBeUndefined();
    });

    test('should prioritize recommendations by score gap', () => {
      const phaseMetrics = {
        INCOME_NOW: { ISP: 0.50, DGBP: 0.40, LCR: 0.60, LCI: 0.55, ATE: 0.50, OS: 52 }, // Gap: 23
        INCOME_LATER: { ISP: 0.65, DGBP: 0.25, LCR: 0.70, LCI: 0.65, ATE: 0.65, OS: 67 }, // Gap: 8
        GROWTH: { ISP: 0.80, DGBP: 0.20, LCR: 0.85, LCI: 0.80, ATE: 0.75, OS: 80 },
        LEGACY: { ISP: 0.75, DGBP: 0.22, LCR: 0.80, LCI: 0.85, ATE: 0.70, OS: 77 }
      };

      const targetScores = {
        INCOME_NOW: 75,
        INCOME_LATER: 75,
        GROWTH: 75,
        LEGACY: 75
      };

      const recommendations = calculator.generateRebalancingRecommendations(
        phaseMetrics,
        targetScores
      );

      // Should be sorted by priority (high first)
      expect(recommendations[0].phaseId).toBe('INCOME_NOW'); // Highest gap
      expect(recommendations[0].priority).toBe('high');
      
      if (recommendations.length > 1) {
        expect(recommendations[1].phaseId).toBe('INCOME_LATER'); // Lower gap
        expect(recommendations[1].priority).toBe('low'); // Gap < 15
      }
    });
  });

  // Helper function to create mock stress test results
  function createMockStressTests(): StressTestResult[] {
    return [
      {
        scenario: 'base_case',
        path: 0,
        phaseMetrics: {} as any,
        cashflows: [
          {
            year: 0,
            age: 65,
            beginningBalance: 1000000,
            contributions: 0,
            withdrawals: 60000,
            investmentReturns: 70000,
            taxes: 12000,
            ltcCosts: 0,
            endingBalance: 998000,
            phaseAllocation: {} as any
          },
          {
            year: 1,
            age: 66,
            beginningBalance: 998000,
            contributions: 0,
            withdrawals: 62000,
            investmentReturns: 65000,
            taxes: 11000,
            ltcCosts: 0,
            endingBalance: 990000,
            phaseAllocation: {} as any
          }
        ],
        finalMetrics: {
          portfolioValue: 990000,
          totalWithdrawals: 122000,
          successProbability: 1,
          yearsToDepletion: 25
        }
      }
    ];
  }
});