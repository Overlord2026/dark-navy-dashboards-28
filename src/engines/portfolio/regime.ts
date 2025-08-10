export interface RegimeInput {
  realizedVolatility: number; // 30-day realized volatility
  vixLevel?: number; // VIX or VIX proxy
  marketReturns: number[]; // recent daily returns for trend analysis
  correlationLevel: number; // cross-asset correlation
  liquidityStress?: number; // bid-ask spreads or other liquidity metrics
}

export interface RegimeOutput {
  regime: 'low' | 'medium' | 'high' | 'extreme';
  confidence: number; // 0-1 scale
  signals: {
    volatility: 'low' | 'medium' | 'high' | 'extreme';
    trend: 'stable' | 'declining' | 'volatile';
    correlation: 'low' | 'medium' | 'high';
    liquidity: 'good' | 'stressed' | 'crisis';
  };
  description: string;
  recommendations: string[];
  transitionProbability?: Record<string, number>;
}

export interface RegimeThresholds {
  volatility: { low: number; medium: number; high: number };
  vix: { low: number; medium: number; high: number };
  correlation: { low: number; medium: number };
}

/**
 * Simple Regime Classifier for Market Conditions
 * Uses realized volatility, VIX proxy, and correlation patterns
 */
export class RegimeClassifier {
  private static readonly THRESHOLDS: RegimeThresholds = {
    volatility: { low: 0.12, medium: 0.18, high: 0.25 }, // Annual volatility thresholds
    vix: { low: 15, medium: 25, high: 35 }, // VIX level thresholds
    correlation: { low: 0.3, medium: 0.6 } // Cross-asset correlation thresholds
  };

  private static readonly REGIME_DESCRIPTIONS = {
    low: 'Low volatility, stable markets with normal correlations',
    medium: 'Moderate volatility with some uncertainty but functioning markets',
    high: 'Elevated volatility and stress with increased correlations',
    extreme: 'Crisis conditions with very high volatility and correlation breakdown'
  };

  static classify(input: RegimeInput): RegimeOutput {
    const signals = this.analyzeSignals(input);
    const regime = this.determineRegime(signals);
    const confidence = this.calculateConfidence(input, signals);
    const recommendations = this.generateRecommendations(regime, signals);
    const transitionProbability = this.estimateTransitionProbabilities(regime, input);

    return {
      regime,
      confidence,
      signals,
      description: this.REGIME_DESCRIPTIONS[regime],
      recommendations,
      transitionProbability
    };
  }

  private static analyzeSignals(input: RegimeInput): RegimeOutput['signals'] {
    const { realizedVolatility, vixLevel, marketReturns, correlationLevel, liquidityStress } = input;

    // Volatility signal
    let volatilitySignal: 'low' | 'medium' | 'high' | 'extreme';
    if (realizedVolatility < this.THRESHOLDS.volatility.low) {
      volatilitySignal = 'low';
    } else if (realizedVolatility < this.THRESHOLDS.volatility.medium) {
      volatilitySignal = 'medium';
    } else if (realizedVolatility < this.THRESHOLDS.volatility.high) {
      volatilitySignal = 'high';
    } else {
      volatilitySignal = 'extreme';
    }

    // Trend signal from returns
    let trendSignal: 'stable' | 'declining' | 'volatile';
    if (marketReturns.length >= 10) {
      const returns = marketReturns.slice(-10); // Last 10 observations
      const volatilityOfReturns = this.calculateStandardDeviation(returns);
      const meanReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
      
      if (volatilityOfReturns < 0.015 && Math.abs(meanReturn) < 0.002) {
        trendSignal = 'stable';
      } else if (meanReturn < -0.005) {
        trendSignal = 'declining';
      } else {
        trendSignal = 'volatile';
      }
    } else {
      trendSignal = 'stable'; // Default if insufficient data
    }

    // Correlation signal
    let correlationSignal: 'low' | 'medium' | 'high';
    if (correlationLevel < this.THRESHOLDS.correlation.low) {
      correlationSignal = 'low';
    } else if (correlationLevel < this.THRESHOLDS.correlation.medium) {
      correlationSignal = 'medium';
    } else {
      correlationSignal = 'high';
    }

    // Liquidity signal
    let liquiditySignal: 'good' | 'stressed' | 'crisis';
    if (liquidityStress === undefined) {
      liquiditySignal = 'good'; // Default if no data
    } else if (liquidityStress < 0.002) {
      liquiditySignal = 'good';
    } else if (liquidityStress < 0.005) {
      liquiditySignal = 'stressed';
    } else {
      liquiditySignal = 'crisis';
    }

    return {
      volatility: volatilitySignal,
      trend: trendSignal,
      correlation: correlationSignal,
      liquidity: liquiditySignal
    };
  }

  private static determineRegime(signals: RegimeOutput['signals']): 'low' | 'medium' | 'high' | 'extreme' {
    // Weighted scoring system
    let score = 0;
    
    // Volatility component (40% weight)
    const volMap = { low: 0, medium: 1, high: 2, extreme: 3 };
    score += volMap[signals.volatility] * 0.4;
    
    // Trend component (20% weight)
    const trendMap = { stable: 0, declining: 1, volatile: 2 };
    score += trendMap[signals.trend] * 0.2;
    
    // Correlation component (25% weight)
    const corrMap = { low: 0, medium: 1, high: 2 };
    score += corrMap[signals.correlation] * 0.25;
    
    // Liquidity component (15% weight)
    const liqMap = { good: 0, stressed: 1, crisis: 2 };
    score += liqMap[signals.liquidity] * 0.15;

    // Convert score to regime
    if (score < 0.7) return 'low';
    if (score < 1.4) return 'medium';
    if (score < 2.1) return 'high';
    return 'extreme';
  }

  private static calculateConfidence(input: RegimeInput, signals: RegimeOutput['signals']): number {
    let confidence = 0.8; // Base confidence
    
    // Reduce confidence if signals are mixed
    const signalValues = [
      signals.volatility === 'low' ? 0 : signals.volatility === 'medium' ? 1 : signals.volatility === 'high' ? 2 : 3,
      signals.trend === 'stable' ? 0 : signals.trend === 'declining' ? 1 : 2,
      signals.correlation === 'low' ? 0 : signals.correlation === 'medium' ? 1 : 2,
      signals.liquidity === 'good' ? 0 : signals.liquidity === 'stressed' ? 1 : 2
    ];
    
    const signalStd = this.calculateStandardDeviation(signalValues);
    if (signalStd > 1) {
      confidence *= 0.7; // Reduce confidence for mixed signals
    }
    
    // Reduce confidence if we have limited data
    if (input.marketReturns.length < 20) {
      confidence *= 0.9;
    }
    
    if (input.vixLevel === undefined) {
      confidence *= 0.85;
    }
    
    if (input.liquidityStress === undefined) {
      confidence *= 0.9;
    }

    return Math.max(0.3, Math.min(1.0, confidence));
  }

  private static generateRecommendations(
    regime: 'low' | 'medium' | 'high' | 'extreme',
    signals: RegimeOutput['signals']
  ): string[] {
    const recommendations = [];

    switch (regime) {
      case 'low':
        recommendations.push('Consider increasing risk asset allocations');
        recommendations.push('Focus on growth-oriented strategies');
        if (signals.correlation === 'low') {
          recommendations.push('Good environment for active diversification');
        }
        break;

      case 'medium':
        recommendations.push('Maintain balanced allocation with slight defensive tilt');
        recommendations.push('Monitor for regime changes');
        if (signals.trend === 'declining') {
          recommendations.push('Consider adding some defensive assets');
        }
        break;

      case 'high':
        recommendations.push('Reduce risk asset exposure');
        recommendations.push('Increase cash and government bond allocations');
        recommendations.push('Avoid illiquid investments');
        if (signals.correlation === 'high') {
          recommendations.push('Traditional diversification may be less effective');
        }
        break;

      case 'extreme':
        recommendations.push('Move to defensive positions immediately');
        recommendations.push('Maximize liquidity and minimize risk');
        recommendations.push('Avoid rebalancing until conditions stabilize');
        recommendations.push('Consider capital preservation strategies');
        break;
    }

    return recommendations;
  }

  private static estimateTransitionProbabilities(
    currentRegime: string,
    input: RegimeInput
  ): Record<string, number> {
    // Simple transition matrix based on historical patterns
    const baseTransitions: Record<string, Record<string, number>> = {
      low: { low: 0.7, medium: 0.25, high: 0.04, extreme: 0.01 },
      medium: { low: 0.2, medium: 0.6, high: 0.18, extreme: 0.02 },
      high: { low: 0.05, medium: 0.3, high: 0.55, extreme: 0.1 },
      extreme: { low: 0.02, medium: 0.08, high: 0.3, extreme: 0.6 }
    };

    let transitions = { ...baseTransitions[currentRegime] };

    // Adjust based on current signals
    if (input.realizedVolatility > this.THRESHOLDS.volatility.high) {
      // High volatility increases probability of staying in stressed regimes
      transitions.extreme *= 1.2;
      transitions.high *= 1.1;
      transitions.low *= 0.8;
      transitions.medium *= 0.9;
    }

    if (input.vixLevel && input.vixLevel > this.THRESHOLDS.vix.high) {
      // High VIX suggests continued stress
      transitions.extreme *= 1.15;
      transitions.high *= 1.05;
    }

    // Normalize probabilities
    const total = Object.values(transitions).reduce((sum, prob) => sum + prob, 0);
    Object.keys(transitions).forEach(regime => {
      transitions[regime] /= total;
    });

    return transitions;
  }

  private static calculateStandardDeviation(values: number[]): number {
    if (values.length < 2) return 0;
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / (values.length - 1);
    
    return Math.sqrt(variance);
  }

  /**
   * Get regime-specific asset class adjustments
   */
  static getRegimeAdjustments(regime: string): Record<string, number> {
    const adjustments: Record<string, Record<string, number>> = {
      low: {
        cash: 0.8,
        government_bonds: 0.9,
        corporate_bonds: 1.0,
        us_equity: 1.2,
        international_equity: 1.15,
        private_equity: 1.1,
        real_estate: 1.05
      },
      medium: {
        cash: 1.0,
        government_bonds: 1.0,
        corporate_bonds: 1.0,
        us_equity: 1.0,
        international_equity: 1.0,
        private_equity: 1.0,
        real_estate: 1.0
      },
      high: {
        cash: 1.3,
        government_bonds: 1.2,
        corporate_bonds: 1.0,
        us_equity: 0.8,
        international_equity: 0.7,
        private_equity: 0.6,
        real_estate: 0.8
      },
      extreme: {
        cash: 1.5,
        government_bonds: 1.4,
        corporate_bonds: 1.1,
        us_equity: 0.6,
        international_equity: 0.5,
        private_equity: 0.4,
        real_estate: 0.6
      }
    };

    return adjustments[regime] || adjustments.medium;
  }
}