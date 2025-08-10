export interface UtilityInput {
  expectedReturn: number; // annualized
  volatility: number; // annualized
  maxDrawdown: number; // historical or projected
  fees: number; // total expense ratio
  liquidityPenalty: number; // 0-1 scale based on liquidity constraints
  phaseWeight: number; // importance weight for this phase
}

export interface UtilityWeights {
  lambda1: number; // volatility penalty
  lambda2: number; // max drawdown penalty
  lambda3: number; // fee penalty
  lambda4: number; // liquidity penalty
}

export interface UtilityOutput {
  utilityScore: number;
  components: {
    expectedReturn: number;
    volatilityPenalty: number;
    drawdownPenalty: number;
    feePenalty: number;
    liquidityPenalty: number;
  };
  risk: number;
  adjustedReturn: number;
  explanation: string;
}

/**
 * Fee-Aware Utility Function
 * U = ER - λ1*Vol - λ2*MaxDD - λ3*Fees - λ4*LiquidityPenalty
 */
export class UtilityCalculator {
  private static readonly DEFAULT_WEIGHTS: UtilityWeights = {
    lambda1: 2.0, // volatility penalty coefficient
    lambda2: 3.0, // max drawdown penalty coefficient  
    lambda3: 10.0, // fee penalty coefficient (fees hurt a lot)
    lambda4: 1.5 // liquidity penalty coefficient
  };

  private static readonly PHASE_WEIGHT_ADJUSTMENTS: Record<string, Partial<UtilityWeights>> = {
    income_now: {
      lambda1: 3.0, // higher volatility penalty for income now
      lambda2: 4.0, // higher drawdown penalty
      lambda4: 2.0 // higher liquidity penalty
    },
    income_later: {
      lambda1: 2.5,
      lambda2: 3.5,
      lambda4: 1.8
    },
    growth: {
      lambda1: 1.5, // lower volatility penalty for growth
      lambda2: 2.0, // lower drawdown penalty
      lambda4: 1.0 // lower liquidity penalty
    },
    legacy: {
      lambda1: 1.8,
      lambda2: 2.5,
      lambda3: 12.0, // higher fee sensitivity for legacy
      lambda4: 1.2
    }
  };

  static calculate(
    input: UtilityInput,
    phaseId: string,
    customWeights?: Partial<UtilityWeights>
  ): UtilityOutput {
    // Get phase-adjusted weights
    const baseWeights = { ...this.DEFAULT_WEIGHTS };
    const phaseAdjustments = this.PHASE_WEIGHT_ADJUSTMENTS[phaseId] || {};
    const weights = { ...baseWeights, ...phaseAdjustments, ...customWeights };

    // Calculate penalty components
    const volatilityPenalty = weights.lambda1 * input.volatility;
    const drawdownPenalty = weights.lambda2 * input.maxDrawdown;
    const feePenalty = weights.lambda3 * input.fees;
    const liquidityPenalty = weights.lambda4 * input.liquidityPenalty;

    // Calculate utility score
    const utilityScore = input.expectedReturn - volatilityPenalty - drawdownPenalty - feePenalty - liquidityPenalty;

    // Calculate risk-adjusted return (Sharpe-like ratio)
    const totalRisk = input.volatility + input.maxDrawdown * 0.5; // weight drawdown as half of volatility
    const adjustedReturn = (input.expectedReturn - input.fees) / Math.max(0.01, totalRisk);

    // Generate explanation
    const explanation = this.generateExplanation(input, weights, {
      volatilityPenalty,
      drawdownPenalty,
      feePenalty,
      liquidityPenalty,
      utilityScore
    });

    return {
      utilityScore,
      components: {
        expectedReturn: input.expectedReturn,
        volatilityPenalty,
        drawdownPenalty,
        feePenalty,
        liquidityPenalty
      },
      risk: totalRisk,
      adjustedReturn,
      explanation
    };
  }

  private static generateExplanation(
    input: UtilityInput,
    weights: UtilityWeights,
    penalties: Record<string, number>
  ): string {
    const formatPercent = (num: number) => `${(num * 100).toFixed(1)}%`;
    
    return [
      `Expected Return: ${formatPercent(input.expectedReturn)}`,
      `Volatility Penalty (λ=${weights.lambda1}): -${formatPercent(penalties.volatilityPenalty)}`,
      `Drawdown Penalty (λ=${weights.lambda2}): -${formatPercent(penalties.drawdownPenalty)}`,
      `Fee Penalty (λ=${weights.lambda3}): -${formatPercent(penalties.feePenalty)}`,
      `Liquidity Penalty (λ=${weights.lambda4}): -${formatPercent(penalties.liquidityPenalty)}`,
      `Net Utility: ${formatPercent(penalties.utilityScore)}`
    ].join(' | ');
  }

  /**
   * Compare multiple allocations and rank by utility
   */
  static compareAllocations(
    allocations: Array<{ name: string; input: UtilityInput }>,
    phaseId: string,
    customWeights?: Partial<UtilityWeights>
  ): Array<{ name: string; utility: UtilityOutput; rank: number }> {
    const results = allocations.map(allocation => ({
      name: allocation.name,
      utility: this.calculate(allocation.input, phaseId, customWeights)
    }));

    // Sort by utility score (descending)
    results.sort((a, b) => b.utility.utilityScore - a.utility.utilityScore);

    // Add rankings
    return results.map((result, index) => ({
      ...result,
      rank: index + 1
    }));
  }

  /**
   * Calculate break-even fee: what fee would make two allocations equivalent?
   */
  static calculateBreakEvenFee(
    allocation1: UtilityInput,
    allocation2: UtilityInput,
    phaseId: string
  ): number {
    const weights = { ...this.DEFAULT_WEIGHTS, ...this.PHASE_WEIGHT_ADJUSTMENTS[phaseId] };
    
    // U1 = U2 when ER1 - λ3*Fee1 - Other1 = ER2 - λ3*Fee2 - Other2
    // Solve for Fee1 when Fee2 = allocation2.fees
    
    const other1 = weights.lambda1 * allocation1.volatility + 
                   weights.lambda2 * allocation1.maxDrawdown + 
                   weights.lambda4 * allocation1.liquidityPenalty;
                   
    const other2 = weights.lambda1 * allocation2.volatility + 
                   weights.lambda2 * allocation2.maxDrawdown + 
                   weights.lambda4 * allocation2.liquidityPenalty;

    const breakEvenFee = (allocation1.expectedReturn - other1 - allocation2.expectedReturn + other2 + weights.lambda3 * allocation2.fees) / weights.lambda3;

    return Math.max(0, breakEvenFee);
  }

  /**
   * Sensitivity analysis: how does utility change with parameter changes?
   */
  static sensitivityAnalysis(
    baseInput: UtilityInput,
    phaseId: string,
    parameter: keyof UtilityInput,
    range: { min: number; max: number; steps: number }
  ): Array<{ value: number; utility: number; change: number }> {
    const baseUtility = this.calculate(baseInput, phaseId).utilityScore;
    const step = (range.max - range.min) / range.steps;
    const results = [];

    for (let i = 0; i <= range.steps; i++) {
      const value = range.min + (i * step);
      const testInput = { ...baseInput, [parameter]: value };
      const utility = this.calculate(testInput, phaseId).utilityScore;
      const change = utility - baseUtility;
      
      results.push({ value, utility, change });
    }

    return results;
  }
}