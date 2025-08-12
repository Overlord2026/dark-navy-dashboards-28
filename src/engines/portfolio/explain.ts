/**
 * Portfolio decision explainability
 */

export type ReasonCode = 
  | 'TAX_DRAG' 
  | 'SEQ_RISK' 
  | 'RESERVE_SHORTFALL' 
  | 'REGIME_SHIFT'
  | 'LIQUIDITY_MISMATCH'
  | 'CONCENTRATION_RISK'
  | 'FEE_OPTIMIZATION'
  | 'REBALANCE_DRIFT';

export interface ExplanationItem {
  code: ReasonCode;
  severity: 'low' | 'medium' | 'high';
  humanText: string;
  assetImpacted?: string;
  phaseImpacted?: string;
  quantitativeImpact?: number;
  recommendation?: string;
}

export interface DecisionExplanation {
  decision: string;
  rationale: string;
  explanations: ExplanationItem[];
  confidence: number; // 0-1
}

export class PortfolioExplainer {
  private explanations: ExplanationItem[] = [];

  addExplanation(item: ExplanationItem): void {
    this.explanations.push(item);
  }

  getTaxDragExplanation(asset: string, taxDrag: number): ExplanationItem {
    return {
      code: 'TAX_DRAG',
      severity: taxDrag > 0.02 ? 'high' : taxDrag > 0.01 ? 'medium' : 'low',
      humanText: `${asset} generates significant tax drag (${(taxDrag * 100).toFixed(1)}% annually). Consider tax-efficient alternatives or tax-advantaged account placement.`,
      assetImpacted: asset,
      quantitativeImpact: taxDrag,
      recommendation: taxDrag > 0.02 
        ? `Replace with tax-efficient ETF or move to tax-deferred account`
        : `Monitor tax efficiency and consider periodic tax-loss harvesting`
    };
  }

  getSequenceRiskExplanation(phase: string, volatility: number): ExplanationItem {
    return {
      code: 'SEQ_RISK',
      severity: volatility > 0.15 ? 'high' : 'medium',
      humanText: `${phase} phase faces sequence-of-returns risk due to high volatility (${(volatility * 100).toFixed(1)}%). Early negative returns could significantly impact sustainability.`,
      phaseImpacted: phase,
      quantitativeImpact: volatility,
      recommendation: `Increase bond allocation and maintain larger cash reserves for early retirement years`
    };
  }

  getReserveShortfallExplanation(currentReserve: number, targetReserve: number): ExplanationItem {
    const shortfall = targetReserve - currentReserve;
    return {
      code: 'RESERVE_SHORTFALL',
      severity: shortfall > targetReserve * 0.5 ? 'high' : shortfall > targetReserve * 0.2 ? 'medium' : 'low',
      humanText: `Cash reserves are $${shortfall.toLocaleString()} below target. Insufficient liquidity for unexpected expenses or market downturns.`,
      quantitativeImpact: shortfall,
      recommendation: `Build cash reserves to ${targetReserve.toLocaleString()} before increasing growth allocations`
    };
  }

  getRegimeShiftExplanation(currentRegime: string, trigger: string): ExplanationItem {
    return {
      code: 'REGIME_SHIFT',
      severity: 'high',
      humanText: `Market regime shifted to ${currentRegime} based on ${trigger}. Activating defensive positioning to preserve capital.`,
      recommendation: `Temporarily increase cash allocation and reduce risk exposure until market stabilizes`
    };
  }

  getLiquidityMismatchExplanation(asset: string, phase: string, liquidityGap: number): ExplanationItem {
    return {
      code: 'LIQUIDITY_MISMATCH',
      severity: liquidityGap > 0.5 ? 'high' : liquidityGap > 0.2 ? 'medium' : 'low',
      humanText: `${asset} has limited liquidity for ${phase} phase needs. May face penalties or delays when accessing funds.`,
      assetImpacted: asset,
      phaseImpacted: phase,
      quantitativeImpact: liquidityGap,
      recommendation: liquidityGap > 0.5 
        ? `Consider more liquid alternatives or reduce allocation`
        : `Monitor liquidity needs and maintain adequate liquid reserves`
    };
  }

  getConcentrationRiskExplanation(asset: string, allocation: number, limit: number): ExplanationItem {
    return {
      code: 'CONCENTRATION_RISK',
      severity: allocation > limit * 1.5 ? 'high' : 'medium',
      humanText: `${asset} represents ${(allocation * 100).toFixed(1)}% of portfolio, exceeding ${(limit * 100).toFixed(0)}% concentration limit. Increases portfolio risk.`,
      assetImpacted: asset,
      quantitativeImpact: allocation - limit,
      recommendation: `Diversify holdings and reduce concentration to below ${(limit * 100).toFixed(0)}%`
    };
  }

  getFeeOptimizationExplanation(asset: string, fee: number, alternative?: string): ExplanationItem {
    return {
      code: 'FEE_OPTIMIZATION',
      severity: fee > 0.015 ? 'medium' : 'low',
      humanText: `${asset} has ${(fee * 100).toFixed(2)}% annual fees. ${alternative ? `Consider lower-cost alternative: ${alternative}` : 'Look for lower-cost alternatives'}.`,
      assetImpacted: asset,
      quantitativeImpact: fee,
      recommendation: alternative 
        ? `Switch to ${alternative} to reduce fees`
        : `Research lower-fee alternatives in same asset class`
    };
  }

  getRebalanceDriftExplanation(asset: string, currentWeight: number, targetWeight: number): ExplanationItem {
    const drift = Math.abs(currentWeight - targetWeight);
    return {
      code: 'REBALANCE_DRIFT',
      severity: drift > 0.1 ? 'medium' : 'low',
      humanText: `${asset} has drifted ${(drift * 100).toFixed(1)}% from target allocation. Rebalancing needed to maintain risk profile.`,
      assetImpacted: asset,
      quantitativeImpact: drift,
      recommendation: drift > 0.05 
        ? `Rebalance to target allocation during next review`
        : `Monitor drift and rebalance if exceeds 5% threshold`
    };
  }

  generateDecisionExplanation(
    decision: string,
    confidence: number,
    ...explanations: ExplanationItem[]
  ): DecisionExplanation {
    const highSeverityCount = explanations.filter(e => e.severity === 'high').length;
    const mediumSeverityCount = explanations.filter(e => e.severity === 'medium').length;
    
    let rationale = `Decision confidence: ${(confidence * 100).toFixed(0)}%. `;
    
    if (highSeverityCount > 0) {
      rationale += `${highSeverityCount} high-priority issue(s) identified. `;
    }
    if (mediumSeverityCount > 0) {
      rationale += `${mediumSeverityCount} medium-priority optimization(s) available. `;
    }
    
    rationale += 'See detailed explanations below.';

    return {
      decision,
      rationale,
      explanations,
      confidence
    };
  }

  getAllExplanations(): ExplanationItem[] {
    return [...this.explanations];
  }

  clear(): void {
    this.explanations = [];
  }
}