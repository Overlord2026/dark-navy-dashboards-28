import { PhaseConfig } from './phasePolicy';

export interface LARBInput {
  phaseConfig: PhaseConfig;
  clientRiskTolerance: number; // 0-100 scale
  currentVolatilityRegime: 'low' | 'medium' | 'high' | 'extreme';
  maxDrawdownTolerance: number; // percentage
  liquidityNeed: number; // 0-1 scale
  timeHorizon: number; // years
}

export interface LARBOutput {
  adjustedRiskBudget: number; // 0-1 scale
  liquidityAdjustment: number; // multiplier
  regimeAdjustment: number; // multiplier
  recommendedVolatility: number; // target portfolio volatility
  confidenceLevel: number; // 0-1 scale
  explanation: string;
}

/**
 * Liquidity-Adjusted Risk Budget (LARB) Calculator
 * Formula: LARB = f(phase, horizon, clientRisk) * h(volRegime, drawdown) * liquidityPenalty
 */
export class LARBCalculator {
  private static readonly VOLATILITY_REGIMES = {
    low: { multiplier: 1.2, threshold: 0.12 },
    medium: { multiplier: 1.0, threshold: 0.18 },
    high: { multiplier: 0.8, threshold: 0.25 },
    extreme: { multiplier: 0.6, threshold: 0.35 }
  };

  private static readonly BASE_RISK_BUDGETS = {
    conservative: 0.3,
    moderate: 0.6,
    aggressive: 0.9
  };

  static calculate(input: LARBInput): LARBOutput {
    // Step 1: Base risk budget from phase policy
    const baseRiskBudget = this.BASE_RISK_BUDGETS[input.phaseConfig.riskTolerance];
    
    // Step 2: Client risk tolerance adjustment (0-100 to 0.5-1.5 multiplier)
    const clientAdjustment = 0.5 + (input.clientRiskTolerance / 100);
    
    // Step 3: Time horizon adjustment (longer horizon = higher risk capacity)
    const horizonAdjustment = Math.min(1.5, 0.8 + (input.timeHorizon / 50));
    
    // Step 4: Volatility regime adjustment
    const regimeData = this.VOLATILITY_REGIMES[input.currentVolatilityRegime];
    const regimeAdjustment = regimeData.multiplier;
    
    // Step 5: Drawdown tolerance adjustment
    const drawdownAdjustment = Math.min(1.3, input.maxDrawdownTolerance / 20);
    
    // Step 6: Liquidity penalty (higher liquidity need = lower risk)
    const liquidityPenalty = 1 - (input.liquidityNeed * 0.3);
    
    // Calculate final adjusted risk budget
    const adjustedRiskBudget = Math.min(1.0, Math.max(0.1,
      baseRiskBudget * clientAdjustment * horizonAdjustment * regimeAdjustment * drawdownAdjustment * liquidityPenalty
    ));
    
    // Calculate recommended portfolio volatility
    const recommendedVolatility = adjustedRiskBudget * regimeData.threshold;
    
    // Calculate confidence level based on input consistency
    const confidenceLevel = this.calculateConfidence(input, adjustedRiskBudget);
    
    // Generate explanation
    const explanation = this.generateExplanation(input, {
      baseRiskBudget,
      clientAdjustment,
      horizonAdjustment,
      regimeAdjustment,
      drawdownAdjustment,
      liquidityPenalty,
      adjustedRiskBudget,
      recommendedVolatility
    });

    return {
      adjustedRiskBudget,
      liquidityAdjustment: liquidityPenalty,
      regimeAdjustment,
      recommendedVolatility,
      confidenceLevel,
      explanation
    };
  }

  private static calculateConfidence(input: LARBInput, finalRiskBudget: number): number {
    let confidence = 0.8; // base confidence
    
    // Reduce confidence if there are conflicting signals
    const phaseRisk = this.BASE_RISK_BUDGETS[input.phaseConfig.riskTolerance];
    const clientRisk = input.clientRiskTolerance / 100;
    
    // Check for alignment between phase policy and client risk tolerance
    const riskAlignment = 1 - Math.abs(phaseRisk - clientRisk);
    confidence *= (0.7 + 0.3 * riskAlignment);
    
    // Reduce confidence in extreme volatility regimes
    if (input.currentVolatilityRegime === 'extreme') {
      confidence *= 0.8;
    }
    
    // Reduce confidence if liquidity needs are very high with long horizon
    if (input.liquidityNeed > 0.8 && input.timeHorizon > 20) {
      confidence *= 0.9;
    }
    
    return Math.max(0.3, Math.min(1.0, confidence));
  }

  private static generateExplanation(
    input: LARBInput,
    calculations: Record<string, number>
  ): string {
    const parts = [
      `Base ${input.phaseConfig.name} risk budget: ${(calculations.baseRiskBudget * 100).toFixed(0)}%`,
      `Client risk tolerance adjustment: ${(calculations.clientAdjustment * 100).toFixed(0)}%`,
      `Time horizon boost: ${(calculations.horizonAdjustment * 100).toFixed(0)}%`,
      `${input.currentVolatilityRegime} volatility regime: ${(calculations.regimeAdjustment * 100).toFixed(0)}%`,
      `Liquidity constraint: ${(calculations.liquidityPenalty * 100).toFixed(0)}%`,
      `Final risk budget: ${(calculations.adjustedRiskBudget * 100).toFixed(0)}%`,
      `Target volatility: ${(calculations.recommendedVolatility * 100).toFixed(1)}%`
    ];

    return parts.join(' → ');
  }

  /**
   * Calculate regime-specific risk adjustments for different asset classes
   */
  static getAssetClassRiskAdjustments(regime: string): Record<string, number> {
    const adjustments: Record<string, Record<string, number>> = {
      low: {
        cash: 0.8,
        government_bonds: 0.9,
        corporate_bonds: 1.0,
        us_equity: 1.1,
        international_equity: 1.1,
        real_estate: 1.0,
        commodities: 1.0,
        private_equity: 1.0,
        private_debt: 1.0
      },
      medium: {
        cash: 1.0,
        government_bonds: 1.0,
        corporate_bonds: 1.0,
        us_equity: 1.0,
        international_equity: 1.0,
        real_estate: 1.0,
        commodities: 1.0,
        private_equity: 1.0,
        private_debt: 1.0
      },
      high: {
        cash: 1.2,
        government_bonds: 1.1,
        corporate_bonds: 1.0,
        us_equity: 0.9,
        international_equity: 0.8,
        real_estate: 0.9,
        commodities: 0.8,
        private_equity: 0.7,
        private_debt: 0.9
      },
      extreme: {
        cash: 1.5,
        government_bonds: 1.3,
        corporate_bonds: 1.1,
        us_equity: 0.7,
        international_equity: 0.6,
        real_estate: 0.7,
        commodities: 0.6,
        private_equity: 0.5,
        private_debt: 0.8
      }
    };

    return adjustments[regime] || adjustments.medium;
  }
}