export interface PM3Input {
  managerName: string;
  aumTrend: {
    currentAUM: number;
    previousAUM: number;
    growthRate: number; // annualized
  };
  gatingChanges: {
    hasGating: boolean;
    gatingPercentage?: number;
    recentChanges: Array<{
      date: Date;
      type: 'increase' | 'decrease' | 'remove';
      percentage: number;
    }>;
  };
  secondaryPricing: {
    latestPrice?: number;
    nav: number;
    discount: number; // negative for discount, positive for premium
    volume?: number;
  };
  managerCoinvestment: {
    amount: number;
    percentage: number;
    recentChanges: Array<{
      date: Date;
      changeAmount: number;
    }>;
  };
  filingsCadence: {
    expectedFrequency: number; // days between filings
    actualFrequency: number; // actual days between recent filings
    missedFilings: number;
    lastFilingDate: Date;
  };
  vintage: number; // year
  fundSize: number;
}

export interface PM3Output {
  overallScore: number; // 0-100 scale
  componentScores: {
    aumMomentum: number;
    gatingSignal: number;
    secondarySignal: number;
    coinvestSignal: number;
    operationalSignal: number;
  };
  bucketTilt: 'underweight' | 'neutral' | 'overweight';
  liquidityCap: number; // maximum allocation percentage
  riskAdjustment: number; // multiplier for allocation
  explanation: string;
  recommendations: string[];
  confidence: number; // 0-1 scale
}

/**
 * Private Manager Momentum (PM3) Score Calculator
 * Evaluates private fund managers across 5 key signals
 */
export class PM3Calculator {
  private static readonly WEIGHTS = {
    aumMomentum: 0.25,
    gatingSignal: 0.30, // Highest weight - most predictive
    secondarySignal: 0.20,
    coinvestSignal: 0.15,
    operationalSignal: 0.10
  };

  private static readonly SCORE_THRESHOLDS = {
    excellent: 80,
    good: 65,
    neutral: 50,
    poor: 35,
    critical: 20
  };

  static calculate(input: PM3Input): PM3Output {
    try {
      // Calculate individual component scores
      const aumMomentum = this.calculateAUMMomentum(input.aumTrend);
      const gatingSignal = this.calculateGatingSignal(input.gatingChanges);
      const secondarySignal = this.calculateSecondarySignal(input.secondaryPricing);
      const coinvestSignal = this.calculateCoinvestSignal(input.managerCoinvestment);
      const operationalSignal = this.calculateOperationalSignal(input.filingsCadence);

      const componentScores = {
        aumMomentum,
        gatingSignal,
        secondarySignal,
        coinvestSignal,
        operationalSignal
      };

      // Calculate weighted overall score
      const overallScore = Math.min(100, Math.max(0,
        aumMomentum * this.WEIGHTS.aumMomentum +
        gatingSignal * this.WEIGHTS.gatingSignal +
        secondarySignal * this.WEIGHTS.secondarySignal +
        coinvestSignal * this.WEIGHTS.coinvestSignal +
        operationalSignal * this.WEIGHTS.operationalSignal
      ));

      // Determine bucket tilt
      const bucketTilt = this.determineBucketTilt(overallScore);

      // Calculate liquidity cap and risk adjustment
      const liquidityCap = this.calculateLiquidityCap(input, overallScore);
      const riskAdjustment = this.calculateRiskAdjustment(overallScore, input);

      // Generate explanation and recommendations
      const explanation = this.generateExplanation(input, componentScores, overallScore);
      const recommendations = this.generateRecommendations(input, componentScores, overallScore);

      // Calculate confidence based on data quality
      const confidence = this.calculateConfidence(input);

      return {
        overallScore,
        componentScores,
        bucketTilt,
        liquidityCap,
        riskAdjustment,
        explanation,
        recommendations,
        confidence
      };

    } catch (error) {
      console.error('PM3 calculation error:', error);
      return this.getDefaultOutput(input.managerName);
    }
  }

  private static calculateAUMMomentum(aumTrend: PM3Input['aumTrend']): number {
    const { currentAUM, previousAUM, growthRate } = aumTrend;
    
    // Score based on AUM growth trajectory
    let score = 50; // neutral baseline

    // AUM growth component (0-40 points)
    if (growthRate > 0.3) { // >30% growth
      score += 40;
    } else if (growthRate > 0.15) { // 15-30% growth
      score += 30;
    } else if (growthRate > 0.05) { // 5-15% growth
      score += 20;
    } else if (growthRate > -0.05) { // Stable (-5% to 5%)
      score += 10;
    } else if (growthRate > -0.15) { // -5% to -15% decline
      score -= 10;
    } else { // >15% decline
      score -= 30;
    }

    // AUM size stability component (0-10 points)
    const sizeScore = currentAUM > 100000000 ? 10 : currentAUM > 50000000 ? 5 : 0; // $100M+ gets full points
    score += sizeScore;

    return Math.min(100, Math.max(0, score));
  }

  private static calculateGatingSignal(gatingChanges: PM3Input['gatingChanges']): number {
    let score = 70; // Start with good baseline if no gating

    if (!gatingChanges.hasGating) {
      return score; // No gating is positive
    }

    // Base penalty for having gating
    score -= 20;

    // Additional penalties based on gating level
    const currentGating = gatingChanges.gatingPercentage || 0;
    if (currentGating > 50) {
      score -= 30; // Severe gating
    } else if (currentGating > 25) {
      score -= 20; // Moderate gating
    } else if (currentGating > 10) {
      score -= 10; // Light gating
    }

    // Analyze recent changes
    gatingChanges.recentChanges.forEach(change => {
      const monthsAgo = (Date.now() - change.date.getTime()) / (1000 * 60 * 60 * 24 * 30);
      if (monthsAgo <= 12) { // Only consider changes in last 12 months
        if (change.type === 'increase') {
          score -= 15; // Increasing gating is very negative
        } else if (change.type === 'remove') {
          score += 20; // Removing gating is very positive
        } else if (change.type === 'decrease') {
          score += 10; // Decreasing gating is positive
        }
      }
    });

    return Math.min(100, Math.max(0, score));
  }

  private static calculateSecondarySignal(secondaryPricing: PM3Input['secondaryPricing']): number {
    const { latestPrice, nav, discount } = secondaryPricing;

    if (!latestPrice) {
      return 50; // Neutral if no secondary market data
    }

    let score = 50;

    // Score based on discount/premium to NAV
    if (discount < -20) { // >20% discount
      score = 20; // Very negative signal
    } else if (discount < -10) { // 10-20% discount
      score = 35;
    } else if (discount < -5) { // 5-10% discount
      score = 45;
    } else if (discount <= 5) { // -5% to +5% (around NAV)
      score = 65;
    } else if (discount <= 15) { // 5-15% premium
      score = 80;
    } else { // >15% premium
      score = 90; // Very positive signal
    }

    return score;
  }

  private static calculateCoinvestSignal(coinvestment: PM3Input['managerCoinvestment']): number {
    const { amount, percentage, recentChanges } = coinvestment;

    let score = 50;

    // Base score from coinvestment level
    if (percentage > 5) { // >5% coinvestment
      score = 85;
    } else if (percentage > 2) { // 2-5% coinvestment
      score = 75;
    } else if (percentage > 1) { // 1-2% coinvestment
      score = 65;
    } else if (percentage > 0.5) { // 0.5-1% coinvestment
      score = 55;
    } else { // <0.5% coinvestment
      score = 40;
    }

    // Adjust based on recent changes
    recentChanges.forEach(change => {
      const monthsAgo = (Date.now() - change.date.getTime()) / (1000 * 60 * 60 * 24 * 30);
      if (monthsAgo <= 12) { // Consider changes in last 12 months
        if (change.changeAmount > 0) {
          score += 10; // Increasing coinvestment is positive
        } else if (change.changeAmount < 0) {
          score -= 15; // Decreasing coinvestment is negative
        }
      }
    });

    return Math.min(100, Math.max(0, score));
  }

  private static calculateOperationalSignal(filings: PM3Input['filingsCadence']): number {
    const { expectedFrequency, actualFrequency, missedFilings, lastFilingDate } = filings;

    let score = 70; // Start with good baseline

    // Penalty for missed filings
    score -= missedFilings * 10;

    // Penalty for delayed filings
    const delayRatio = actualFrequency / expectedFrequency;
    if (delayRatio > 2) { // More than 2x expected frequency
      score -= 20;
    } else if (delayRatio > 1.5) { // 1.5-2x expected frequency
      score -= 10;
    } else if (delayRatio > 1.2) { // 1.2-1.5x expected frequency
      score -= 5;
    }

    // Check recency of last filing
    const daysSinceLastFiling = (Date.now() - lastFilingDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceLastFiling > expectedFrequency * 2) {
      score -= 15; // Very overdue
    } else if (daysSinceLastFiling > expectedFrequency * 1.5) {
      score -= 10; // Overdue
    }

    return Math.min(100, Math.max(0, score));
  }

  private static determineBucketTilt(score: number): 'underweight' | 'neutral' | 'overweight' {
    if (score >= this.SCORE_THRESHOLDS.excellent) {
      return 'overweight';
    } else if (score >= this.SCORE_THRESHOLDS.good) {
      return 'neutral';
    } else {
      return 'underweight';
    }
  }

  private static calculateLiquidityCap(input: PM3Input, score: number): number {
    let baseCap = 0.15; // 15% base cap for private investments

    // Adjust based on score
    if (score >= this.SCORE_THRESHOLDS.excellent) {
      baseCap = 0.25; // Can go up to 25% for excellent managers
    } else if (score >= this.SCORE_THRESHOLDS.good) {
      baseCap = 0.20; // Up to 20% for good managers
    } else if (score < this.SCORE_THRESHOLDS.poor) {
      baseCap = 0.05; // Cap at 5% for poor managers
    }

    // Additional constraints based on specific issues
    if (input.gatingChanges.hasGating && input.gatingChanges.gatingPercentage > 25) {
      baseCap *= 0.7; // Reduce cap for high gating
    }

    if (input.secondaryPricing.discount < -20) {
      baseCap *= 0.8; // Reduce cap for deeply discounted secondaries
    }

    return Math.min(0.3, Math.max(0.02, baseCap)); // Cap between 2% and 30%
  }

  private static calculateRiskAdjustment(score: number, input: PM3Input): number {
    let adjustment = 1.0; // Neutral baseline

    if (score >= this.SCORE_THRESHOLDS.excellent) {
      adjustment = 1.2; // 20% increase for excellent managers
    } else if (score >= this.SCORE_THRESHOLDS.good) {
      adjustment = 1.1; // 10% increase for good managers
    } else if (score < this.SCORE_THRESHOLDS.poor) {
      adjustment = 0.7; // 30% decrease for poor managers
    } else if (score < this.SCORE_THRESHOLDS.critical) {
      adjustment = 0.5; // 50% decrease for critical managers
    }

    return adjustment;
  }

  private static generateExplanation(
    input: PM3Input,
    scores: PM3Output['componentScores'],
    overallScore: number
  ): string {
    const components = [
      `AUM: ${scores.aumMomentum.toFixed(0)}`,
      `Gating: ${scores.gatingSignal.toFixed(0)}`,
      `Secondary: ${scores.secondarySignal.toFixed(0)}`,
      `Coinvest: ${scores.coinvestSignal.toFixed(0)}`,
      `Operations: ${scores.operationalSignal.toFixed(0)}`
    ];

    const level = overallScore >= 80 ? 'Excellent' :
                  overallScore >= 65 ? 'Good' :
                  overallScore >= 50 ? 'Neutral' :
                  overallScore >= 35 ? 'Poor' : 'Critical';

    return `${input.managerName}: ${level} (${overallScore.toFixed(0)}) | ${components.join(' | ')}`;
  }

  private static generateRecommendations(
    input: PM3Input,
    scores: PM3Output['componentScores'],
    overallScore: number
  ): string[] {
    const recommendations = [];

    if (overallScore >= this.SCORE_THRESHOLDS.excellent) {
      recommendations.push('Consider increasing allocation to this manager');
      recommendations.push('Monitor for any changes in key metrics');
    } else if (overallScore >= this.SCORE_THRESHOLDS.good) {
      recommendations.push('Maintain current allocation');
      recommendations.push('Continue monitoring performance');
    } else if (overallScore >= this.SCORE_THRESHOLDS.neutral) {
      recommendations.push('Consider neutral weighting');
      recommendations.push('Watch for improvement in weak areas');
    } else {
      recommendations.push('Consider reducing allocation');
      recommendations.push('Implement enhanced monitoring');
    }

    // Specific recommendations based on component scores
    if (scores.gatingSignal < 40) {
      recommendations.push('High gating risk - limit liquidity exposure');
    }

    if (scores.secondarySignal < 40) {
      recommendations.push('Significant NAV discount - investigate underlying issues');
    }

    if (scores.coinvestSignal < 40) {
      recommendations.push('Low manager coinvestment - question alignment');
    }

    if (scores.operationalSignal < 40) {
      recommendations.push('Operational issues detected - require improved reporting');
    }

    return recommendations;
  }

  private static calculateConfidence(input: PM3Input): number {
    let confidence = 0.8; // Base confidence

    // Reduce confidence based on missing data
    if (!input.secondaryPricing.latestPrice) confidence *= 0.9;
    if (input.managerCoinvestment.recentChanges.length === 0) confidence *= 0.95;
    if (input.gatingChanges.recentChanges.length === 0) confidence *= 0.95;

    // Reduce confidence for very new or very old funds
    const fundAge = new Date().getFullYear() - input.vintage;
    if (fundAge < 2) confidence *= 0.8; // Very new fund
    if (fundAge > 15) confidence *= 0.9; // Very old fund

    return Math.max(0.5, Math.min(1.0, confidence));
  }

  private static getDefaultOutput(managerName: string): PM3Output {
    return {
      overallScore: 50,
      componentScores: {
        aumMomentum: 50,
        gatingSignal: 50,
        secondarySignal: 50,
        coinvestSignal: 50,
        operationalSignal: 50
      },
      bucketTilt: 'neutral',
      liquidityCap: 0.1,
      riskAdjustment: 1.0,
      explanation: `${managerName}: Insufficient data for PM3 analysis`,
      recommendations: ['Gather more data for proper PM3 scoring'],
      confidence: 0.3
    };
  }

  /**
   * Batch calculate PM3 scores for multiple managers
   */
  static batchCalculate(inputs: PM3Input[]): PM3Output[] {
    return inputs.map(input => this.calculate(input));
  }

  /**
   * Get PM3 score thresholds for categorization
   */
  static getScoreThresholds(): typeof PM3Calculator.SCORE_THRESHOLDS {
    return this.SCORE_THRESHOLDS;
  }
}