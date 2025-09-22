/**
 * SWAG Analytics Integration for Retirement Calculator
 * Integrates the full SWAG analyzer package with retirement planning
 */

import { computeOutcomeMetrics, outcomeScore } from '../../../packages/swag-analyzer/src/phase_objective';
import { ETAY, SEAY, liquidityVaR } from '../../../packages/swag-analyzer/src/core';
import { OutcomeMetrics, PhaseId, AnalyzerInput, AnalyzerResult } from '../../../packages/swag-analyzer/src/models';
import { RetirementAnalysisInput, RetirementAnalysisResults, CashFlowProjection } from '@/types/retirement';

export interface SWAGOutcomeMetrics extends OutcomeMetrics {
  phase: PhaseId;
  confidence: number;
  riskLevel: 'low' | 'moderate' | 'high';
}

export interface SWAGPhaseAnalytics {
  INCOME_NOW: SWAGOutcomeMetrics;
  INCOME_LATER: SWAGOutcomeMetrics;
  GROWTH: SWAGOutcomeMetrics;
  LEGACY: SWAGOutcomeMetrics;
}

export interface SWAGEnhancedResults extends RetirementAnalysisResults {
  swagAnalytics: {
    overallScore: number;
    phaseMetrics: SWAGPhaseAnalytics;
    riskAnalysis: {
      primaryRisks: string[];
      mitigationStrategies: string[];
      confidenceLevel: number;
    };
    phaseRecommendations: Array<{
      phase: PhaseId;
      recommendation: string;
      impact: number;
      urgency: 'high' | 'medium' | 'low';
    }>;
  };
}

/**
 * Calculate SWAG outcome metrics from retirement analysis
 */
export function calculateSWAGMetrics(
  inputs: RetirementAnalysisInput,
  results: RetirementAnalysisResults,
  cashFlowData: CashFlowProjection[]
): SWAGPhaseAnalytics {
  const currentAge = inputs.goals.currentAge;
  const retirementAge = inputs.goals.retirementAge;
  const lifeExpectancy = inputs.goals.lifeExpectancy;
  
  // Define phase timeframes based on age and retirement status
  const phaseTimeframes = {
    INCOME_NOW: { 
      start: Math.max(0, retirementAge - currentAge), 
      end: Math.max(2, retirementAge - currentAge + 2)
    },
    INCOME_LATER: { 
      start: Math.max(2, retirementAge - currentAge + 2), 
      end: Math.max(10, retirementAge - currentAge + 10)
    },
    GROWTH: { 
      start: 0, 
      end: Math.max(15, retirementAge - currentAge)
    },
    LEGACY: { 
      start: Math.max(15, retirementAge - currentAge + 15), 
      end: lifeExpectancy - currentAge
    }
  };

  const analytics: Partial<SWAGPhaseAnalytics> = {};

  // Calculate metrics for each phase
  for (const [phase, timeframe] of Object.entries(phaseTimeframes) as Array<[PhaseId, {start: number, end: number}]>) {
    const phaseData = cashFlowData.slice(timeframe.start, timeframe.end);
    const metrics = calculatePhaseOutcomeMetrics(phase, phaseData, inputs, results);
    
    analytics[phase] = {
      ...metrics,
      phase,
      confidence: calculatePhaseConfidence(metrics),
      riskLevel: determineRiskLevel(metrics)
    };
  }

  return analytics as SWAGPhaseAnalytics;
}

/**
 * Calculate outcome metrics for a specific phase
 */
function calculatePhaseOutcomeMetrics(
  phase: PhaseId,
  phaseData: CashFlowProjection[],
  inputs: RetirementAnalysisInput,
  results: RetirementAnalysisResults
): OutcomeMetrics {
  // Income Sufficiency Probability (ISP)
  const totalIncome = phaseData.reduce((sum, year) => 
    sum + Object.values(year.income).reduce((a, b) => a + b, 0), 0
  );
  const totalExpenses = phaseData.reduce((sum, year) => 
    sum + Object.values(year.expenses).reduce((a, b) => a + b, 0), 0
  );
  const ISP = Math.min(1, totalIncome / Math.max(totalExpenses, 1));

  // Drawdown Guardrail Breach Probability (DGBP)
  const maxDrawdownYears = phaseData.filter(year => {
    const totalWithdrawals = Object.values(year.withdrawals).reduce((a, b) => a + b, 0);
    return totalWithdrawals > year.beginningBalance * 0.04; // 4% rule breach
  }).length;
  const DGBP = maxDrawdownYears / Math.max(phaseData.length, 1);

  // Longevity Coverage Ratio (LCR)
  const avgBalance = phaseData.reduce((sum, year) => sum + year.endingBalance, 0) / Math.max(phaseData.length, 1);
  const avgExpenses = totalExpenses / Math.max(phaseData.length, 1);
  const LCR = avgBalance / Math.max(avgExpenses * 10, 1); // 10 years coverage

  // Legacy Confidence Index (LCI) - more relevant for LEGACY phase
  const finalBalance = phaseData[phaseData.length - 1]?.endingBalance || 0;
  const LCI = phase === 'LEGACY' 
    ? Math.min(1, finalBalance / Math.max(inputs.goals.annualRetirementIncome * 5, 1))
    : Math.min(1, finalBalance / Math.max(inputs.goals.annualRetirementIncome * 2, 1));

  // After-Tax Efficiency (ATE) - simplified calculation
  const totalTaxes = phaseData.reduce((sum, year) => sum + year.expenses.taxes, 0);
  const totalReturns = phaseData.reduce((sum, year) => sum + (year.endingBalance - year.beginningBalance), 0);
  const ATE = Math.max(0, Math.min(1, 1 - (totalTaxes / Math.max(Math.abs(totalReturns), 1))));

  // Compute final metrics using the SWAG analyzer
  return computeOutcomeMetrics({
    isp: ISP,
    dgbp: DGBP,
    lcr: LCR,
    lci: LCI,
    ate: ATE
  });
}

/**
 * Calculate confidence level for a phase based on its metrics
 */
function calculatePhaseConfidence(metrics: OutcomeMetrics): number {
  // Weighted confidence based on outcome metrics
  const weights = { ISP: 0.3, DGBP: 0.25, LCR: 0.2, LCI: 0.15, ATE: 0.1 };
  
  return Math.min(100, Math.max(0, (
    metrics.ISP * weights.ISP * 100 +
    (1 - metrics.DGBP) * weights.DGBP * 100 +
    Math.min(1, metrics.LCR) * weights.LCR * 100 +
    metrics.LCI * weights.LCI * 100 +
    metrics.ATE * weights.ATE * 100
  )));
}

/**
 * Determine risk level based on outcome metrics
 */
function determineRiskLevel(metrics: OutcomeMetrics): 'low' | 'moderate' | 'high' {
  const riskScore = metrics.DGBP * 0.4 + (1 - metrics.ISP) * 0.3 + (1 - Math.min(1, metrics.LCR)) * 0.3;
  
  if (riskScore < 0.2) return 'low';
  if (riskScore < 0.4) return 'moderate';
  return 'high';
}

/**
 * Generate phase-specific recommendations
 */
export function generatePhaseRecommendations(
  phaseMetrics: SWAGPhaseAnalytics,
  inputs: RetirementAnalysisInput
): Array<{
  phase: PhaseId;
  recommendation: string;
  impact: number;
  urgency: 'high' | 'medium' | 'low';
}> {
  const recommendations: Array<{
    phase: PhaseId;
    recommendation: string;
    impact: number;
    urgency: 'high' | 'medium' | 'low';
  }> = [];

  // Analyze each phase
  Object.entries(phaseMetrics).forEach(([phase, metrics]) => {
    const phaseId = phase as PhaseId;
    
    // Income sufficiency recommendations
    if (metrics.ISP < 0.8) {
      recommendations.push({
        phase: phaseId,
        recommendation: `Increase savings rate or reduce expenses for ${phase.replace('_', ' ').toLowerCase()} phase`,
        impact: (0.8 - metrics.ISP) * 100,
        urgency: metrics.ISP < 0.6 ? 'high' : 'medium'
      });
    }

    // Drawdown risk recommendations
    if (metrics.DGBP > 0.3) {
      recommendations.push({
        phase: phaseId,
        recommendation: `Implement guardrails to reduce drawdown risk in ${phase.replace('_', ' ').toLowerCase()} phase`,
        impact: metrics.DGBP * 50,
        urgency: metrics.DGBP > 0.5 ? 'high' : 'medium'
      });
    }

    // Longevity coverage recommendations
    if (metrics.LCR < 1.0 && (phaseId === 'INCOME_LATER' || phaseId === 'LEGACY')) {
      recommendations.push({
        phase: phaseId,
        recommendation: `Improve longevity coverage for ${phase.replace('_', ' ').toLowerCase()} phase`,
        impact: (1.0 - metrics.LCR) * 30,
        urgency: metrics.LCR < 0.5 ? 'high' : 'medium'
      });
    }

    // Tax efficiency recommendations
    if (metrics.ATE < 0.7) {
      recommendations.push({
        phase: phaseId,
        recommendation: `Optimize tax efficiency for ${phase.replace('_', ' ').toLowerCase()} phase through better withdrawal sequencing`,
        impact: (0.7 - metrics.ATE) * 40,
        urgency: 'medium'
      });
    }
  });

  return recommendations.sort((a, b) => {
    const urgencyOrder = { high: 3, medium: 2, low: 1 };
    return urgencyOrder[b.urgency] - urgencyOrder[a.urgency] || b.impact - a.impact;
  });
}

/**
 * Calculate advanced tax efficiency using SWAG models
 */
export function calculateAdvancedTaxEfficiency(
  inputs: RetirementAnalysisInput,
  cashFlowData: CashFlowProjection[]
): {
  etay: number;
  seay: number;
  liquidityVar: number;
  taxOptimizationPotential: number;
} {
  // Calculate Effective Tax-Adjusted Yield (ETAY)
  const composition = {
    interest: 0.3,  // Simplified composition
    qualified: 0.4,
    ltg: 0.2,
    stg: 0.1
  };

  const taxRates = {
    ordinary: inputs.taxOptimization ? 0.22 : 0.24, // Assume some optimization
    qualified: 0.15,
    ltg: 0.15,
    stg: 0.22
  };

  const etay = ETAY(composition, taxRates, 0.01); // 1% fee drag

  // Calculate Staking Equivalent After-tax Yield (SEAY) - hypothetical
  const seay = SEAY(0.05, 0.22, 0.001, 21, 0.001);

  // Calculate Liquidity Value at Risk
  const liquidityVar = liquidityVaR({
    secondaryHaircut: 0.05,
    gateProb: 0.1,
    delayDays: 30,
    dailyPenaltyBps: 1
  });

  // Tax optimization potential
  const currentTaxes = cashFlowData.reduce((sum, year) => sum + year.expenses.taxes, 0);
  const totalWithdrawals = cashFlowData.reduce((sum, year) => 
    sum + Object.values(year.withdrawals).reduce((a, b) => a + b, 0), 0
  );
  const taxOptimizationPotential = Math.max(0, (currentTaxes / Math.max(totalWithdrawals, 1)) - 0.15);

  return {
    etay,
    seay,
    liquidityVar,
    taxOptimizationPotential
  };
}

/**
 * Transform retirement inputs to SWAG analyzer format
 */
export function transformToSWAGInput(
  inputs: RetirementAnalysisInput,
  householdId: string
): Partial<AnalyzerInput> {
  return {
    householdId,
    currentAge: inputs.goals.currentAge,
    retirementAge: inputs.goals.retirementAge,
    lifeExpectancy: inputs.goals.lifeExpectancy,
    initialPortfolio: inputs.accounts.reduce((sum, acc) => sum + acc.balance, 0),
    
    holdings: inputs.accounts.map((account, index) => ({
      symbol: `ACCT_${index}`,
      quantity: 1,
      basis: account.balance,
      accountType: account.taxStatus === 'pre_tax' ? 'tax_deferred' : 
                   account.taxStatus === 'tax_free' ? 'tax_free' : 'taxable',
      assetClass: 'equity' // Simplified
    })),
    
    cashflowNeeds: {
      INCOME_NOW: {
        schedule: [{ t: 0, amt: inputs.goals.annualRetirementIncome }],
        essential: true,
        inflationProtected: true
      },
      INCOME_LATER: {
        schedule: [{ t: 5, amt: inputs.goals.annualRetirementIncome }],
        essential: true,
        inflationProtected: true
      },
      GROWTH: {
        schedule: [],
        essential: false,
        inflationProtected: false
      },
      LEGACY: {
        schedule: [{ t: 20, amt: inputs.legacy?.targetInheritance || 0 }],
        essential: false,
        inflationProtected: false
      }
    }
  };
}