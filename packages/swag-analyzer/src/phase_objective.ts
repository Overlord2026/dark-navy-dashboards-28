/**
 * Phase Objective Calculator - Computes ISP, DGBP, LCR, LCI, ATE, and composite OutcomeScore
 */

import { 
  OutcomeMetrics, 
  PhaseId, 
  StressTestResult, 
  CashflowProjection,
  AnalyzerInput,
  RiskProfile 
} from './models';

export class PhaseObjectiveCalculator {
  
  /**
   * Calculate comprehensive outcome metrics for a specific phase
   */
  calculatePhaseOutcomes(
    phaseId: PhaseId,
    stressTests: StressTestResult[],
    input: AnalyzerInput,
    phaseTimeframe: { startYear: number; endYear: number }
  ): OutcomeMetrics {
    
    const phaseTests = this.filterTestsForPhase(stressTests, phaseTimeframe);
    
    const ISP = this.calculateIncomeSufficiencyProbability(phaseTests, input, phaseId);
    const DGBP = this.calculateDrawdownGuardrailBreachProbability(phaseTests, input.risk);
    const LCR = this.calculateLongevityCoverageRatio(phaseTests, input);
    const LCI = this.calculateLegacyConfidenceIndex(phaseTests, input);
    const ATE = this.calculateAfterTaxEfficiency(phaseTests, input);
    
    // Composite OutcomeScore (0-100)
    const OS = this.calculateCompositeOutcomeScore({
      ISP, DGBP, LCR, LCI, ATE
    }, phaseId);
    
    return { ISP, DGBP, LCR, LCI, ATE, OS };
  }

  /**
   * Income Sufficiency Probability (ISP)
   * Probability that income needs are met throughout the phase
   */
  private calculateIncomeSufficiencyProbability(
    phaseTests: StressTestResult[],
    input: AnalyzerInput,
    phaseId: PhaseId
  ): number {
    if (phaseTests.length === 0) return 0;
    
    const sufficientPaths = phaseTests.filter(test => {
      const phaseNeeds = input.cashflowNeeds[phaseId];
      if (!phaseNeeds) return true;
      
      let totalNeed = 0;
      let totalMet = 0;
      
      for (const need of phaseNeeds.schedule) {
        totalNeed += need.amt;
        
        // Check if this need was met in the cashflow
        const yearCashflow = test.cashflows.find(cf => cf.year === need.t);
        if (yearCashflow && yearCashflow.withdrawals >= need.amt * 0.95) { // 95% threshold
          totalMet += need.amt;
        }
      }
      
      return totalNeed === 0 || (totalMet / totalNeed) >= 0.9; // 90% of needs met
    });
    
    return sufficientPaths.length / phaseTests.length;
  }

  /**
   * Drawdown Guardrail Breach Probability (DGBP)
   * Probability of breaching maximum acceptable drawdown limits
   */
  private calculateDrawdownGuardrailBreachProbability(
    phaseTests: StressTestResult[],
    riskProfile: RiskProfile
  ): number {
    if (phaseTests.length === 0) return 0;
    
    const maxAllowableDrawdown = riskProfile.maxDrawdown;
    
    const breachPaths = phaseTests.filter(test => {
      let maxValue = test.cashflows[0]?.endingBalance || 0;
      let maxDrawdown = 0;
      
      for (const cashflow of test.cashflows) {
        maxValue = Math.max(maxValue, cashflow.endingBalance);
        const currentDrawdown = maxValue > 0 ? (maxValue - cashflow.endingBalance) / maxValue : 0;
        maxDrawdown = Math.max(maxDrawdown, currentDrawdown);
      }
      
      return maxDrawdown > maxAllowableDrawdown;
    });
    
    return breachPaths.length / phaseTests.length;
  }

  /**
   * Longevity Coverage Ratio (LCR)
   * Ability to sustain lifestyle through extended longevity scenarios
   */
  private calculateLongevityCoverageRatio(
    phaseTests: StressTestResult[],
    input: AnalyzerInput
  ): number {
    if (phaseTests.length === 0) return 0;
    
    const extendedLifeExpectancy = input.lifeExpectancy + 5; // Test 5 extra years
    const targetAge = input.currentAge + (extendedLifeExpectancy - input.currentAge);
    
    const adequatePaths = phaseTests.filter(test => {
      const finalAge = input.currentAge + test.cashflows.length;
      
      if (finalAge < targetAge) {
        // Path ended early due to portfolio depletion
        return false;
      }
      
      // Check if final portfolio value can support additional years
      const finalValue = test.finalMetrics.portfolioValue;
      const avgAnnualWithdrawal = test.finalMetrics.totalWithdrawals / test.cashflows.length;
      const additionalYearsCovered = finalValue / (avgAnnualWithdrawal || 1);
      
      return additionalYearsCovered >= 5;
    });
    
    return adequatePaths.length / phaseTests.length;
  }

  /**
   * Legacy Confidence Index (LCI)
   * Probability of preserving intended inheritance/legacy goals
   */
  private calculateLegacyConfidenceIndex(
    phaseTests: StressTestResult[],
    input: AnalyzerInput
  ): number {
    if (phaseTests.length === 0) return 0;
    
    // Extract legacy goals from cashflow needs
    const legacyNeeds = input.cashflowNeeds.LEGACY;
    if (!legacyNeeds || legacyNeeds.schedule.length === 0) {
      // No specific legacy goals, use general wealth preservation
      const preservationPaths = phaseTests.filter(test => 
        test.finalMetrics.portfolioValue >= input.initialPortfolio * 0.5
      );
      return preservationPaths.length / phaseTests.length;
    }
    
    const targetLegacyValue = legacyNeeds.schedule.reduce((sum, need) => sum + need.amt, 0);
    
    const legacyPaths = phaseTests.filter(test => 
      test.finalMetrics.portfolioValue >= targetLegacyValue
    );
    
    return legacyPaths.length / phaseTests.length;
  }

  /**
   * After-Tax Efficiency (ATE)
   * Tax optimization effectiveness across the phase
   */
  private calculateAfterTaxEfficiency(
    phaseTests: StressTestResult[],
    input: AnalyzerInput
  ): number {
    if (phaseTests.length === 0) return 0;
    
    const totalTaxes = phaseTests.reduce((sum, test) => {
      const testTaxes = test.cashflows.reduce((taxSum, cf) => taxSum + cf.taxes, 0);
      return sum + testTaxes;
    }, 0);
    
    const totalWithdrawals = phaseTests.reduce((sum, test) => {
      return sum + test.finalMetrics.totalWithdrawals;
    }, 0);
    
    if (totalWithdrawals === 0) return 1;
    
    const averageTaxRate = totalTaxes / totalWithdrawals;
    const benchmarkTaxRate = input.scenario.taxes.ordinary || 0.22; // 22% benchmark
    
    // Efficiency = 1 - (actual rate / benchmark rate)
    // Higher efficiency when actual rate is lower than benchmark
    const efficiency = Math.max(0, 1 - (averageTaxRate / benchmarkTaxRate));
    
    return Math.min(1, efficiency);
  }

  /**
   * Calculate composite OutcomeScore (0-100)
   * Weighted combination of all metrics with phase-specific weights
   */
  private calculateCompositeOutcomeScore(
    metrics: Omit<OutcomeMetrics, 'OS'>,
    phaseId: PhaseId
  ): number {
    // Phase-specific weights
    const weights = this.getPhaseWeights(phaseId);
    
    // Convert probabilities to scores (0-100)
    const ispScore = metrics.ISP * 100;
    const dgbpScore = (1 - metrics.DGBP) * 100; // Lower DGBP is better
    const lcrScore = Math.min(100, metrics.LCR * 100);
    const lciScore = Math.min(100, metrics.LCI * 100);
    const ateScore = metrics.ATE * 100;
    
    // Weighted composite score
    const compositeScore = 
      weights.ISP * ispScore +
      weights.DGBP * dgbpScore +
      weights.LCR * lcrScore +
      weights.LCI * lciScore +
      weights.ATE * ateScore;
    
    return Math.round(Math.max(0, Math.min(100, compositeScore)));
  }

  /**
   * Get phase-specific weights for outcome metrics
   */
  private getPhaseWeights(phaseId: PhaseId): Record<keyof Omit<OutcomeMetrics, 'OS'>, number> {
    switch (phaseId) {
      case 'INCOME_NOW':
        return {
          ISP: 0.40,  // Income sufficiency is critical
          DGBP: 0.30, // Drawdown protection important
          LCR: 0.15,  // Some longevity consideration
          LCI: 0.05,  // Legacy less important
          ATE: 0.10   // Tax efficiency moderate
        };
        
      case 'INCOME_LATER':
        return {
          ISP: 0.35,  // Income still important
          DGBP: 0.25, // Moderate drawdown focus
          LCR: 0.25,  // Longevity becomes more important
          LCI: 0.10,  // Legacy consideration grows
          ATE: 0.15   // Tax efficiency more important
        };
        
      case 'GROWTH':
        return {
          ISP: 0.25,  // Income less critical
          DGBP: 0.20, // Can tolerate more volatility
          LCR: 0.30,  // Longevity coverage important
          LCI: 0.15,  // Legacy planning consideration
          ATE: 0.10   // Growth over tax optimization
        };
        
      case 'LEGACY':
        return {
          ISP: 0.15,  // Basic income needs
          DGBP: 0.15, // Moderate drawdown concern
          LCR: 0.25,  // Longevity important
          LCI: 0.35,  // Legacy is primary focus
          ATE: 0.10   // Tax efficiency for transfers
        };
        
      default:
        // Balanced weights
        return {
          ISP: 0.25,
          DGBP: 0.25,
          LCR: 0.20,
          LCI: 0.20,
          ATE: 0.10
        };
    }
  }

  /**
   * Filter stress tests for specific phase timeframe
   */
  private filterTestsForPhase(
    stressTests: StressTestResult[],
    timeframe: { startYear: number; endYear: number }
  ): StressTestResult[] {
    return stressTests.map(test => ({
      ...test,
      cashflows: test.cashflows.filter(cf => 
        cf.year >= timeframe.startYear && cf.year <= timeframe.endYear
      )
    })).filter(test => test.cashflows.length > 0);
  }

  /**
   * Calculate phase transition recommendations
   */
  calculatePhaseTransitionMetrics(
    currentPhaseId: PhaseId,
    nextPhaseId: PhaseId,
    currentMetrics: OutcomeMetrics,
    projectedMetrics: OutcomeMetrics
  ): {
    transitionRecommended: boolean;
    riskAdjustments: string[];
    allocationChanges: string[];
    confidenceLevel: number;
  } {
    // Compare current vs projected metrics
    const metricImprovement = projectedMetrics.OS - currentMetrics.OS;
    const riskIncrease = projectedMetrics.DGBP - currentMetrics.DGBP;
    
    const transitionRecommended = metricImprovement > 5 && riskIncrease < 0.1;
    
    const riskAdjustments: string[] = [];
    const allocationChanges: string[] = [];
    
    if (riskIncrease > 0.05) {
      riskAdjustments.push('Consider reducing volatility during transition');
    }
    
    if (projectedMetrics.ISP < currentMetrics.ISP) {
      riskAdjustments.push('Monitor income sufficiency during phase transition');
    }
    
    // Phase-specific transition guidance
    if (currentPhaseId === 'INCOME_NOW' && nextPhaseId === 'INCOME_LATER') {
      allocationChanges.push('Gradually increase growth allocation');
      allocationChanges.push('Reduce cash positions');
    }
    
    const confidenceLevel = Math.min(
      currentMetrics.OS,
      projectedMetrics.OS,
      (1 - riskIncrease) * 100
    );
    
    return {
      transitionRecommended,
      riskAdjustments,
      allocationChanges,
      confidenceLevel: Math.max(0, confidenceLevel)
    };
  }

  /**
   * Generate outcome-based rebalancing recommendations
   */
  generateRebalancingRecommendations(
    phaseMetrics: Record<PhaseId, OutcomeMetrics>,
    targetScores: Record<PhaseId, number>
  ): Array<{
    phaseId: PhaseId;
    currentScore: number;
    targetScore: number;
    priority: 'high' | 'medium' | 'low';
    recommendations: string[];
  }> {
    const recommendations: Array<{
      phaseId: PhaseId;
      currentScore: number;
      targetScore: number;
      priority: 'high' | 'medium' | 'low';
      recommendations: string[];
    }> = [];
    
    for (const [phaseId, metrics] of Object.entries(phaseMetrics) as [PhaseId, OutcomeMetrics][]) {
      const targetScore = targetScores[phaseId] || 75;
      const gap = targetScore - metrics.OS;
      
      if (gap > 0) {
        const priority = gap > 15 ? 'high' : gap > 8 ? 'medium' : 'low';
        const phaseRecommendations: string[] = [];
        
        // Identify specific improvement areas
        if (metrics.ISP < 0.8) {
          phaseRecommendations.push('Increase income-generating assets allocation');
        }
        
        if (metrics.DGBP > 0.2) {
          phaseRecommendations.push('Reduce portfolio volatility');
        }
        
        if (metrics.LCR < 0.85) {
          phaseRecommendations.push('Enhance longevity protection strategies');
        }
        
        if (metrics.LCI < 0.8) {
          phaseRecommendations.push('Optimize legacy preservation allocation');
        }
        
        if (metrics.ATE < 0.75) {
          phaseRecommendations.push('Implement tax optimization strategies');
        }
        
        recommendations.push({
          phaseId,
          currentScore: metrics.OS,
          targetScore,
          priority,
          recommendations: phaseRecommendations
        });
      }
    }
    
    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }
}