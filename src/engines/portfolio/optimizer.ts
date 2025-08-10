import { PhaseConfig, AdvisorConstraintOverlay } from './phasePolicy';
import { LARBCalculator, LARBInput } from './larb';
import { UtilityCalculator, UtilityInput } from './utility';

export interface AssetClassData {
  symbol: string;
  name: string;
  expectedReturn: number;
  volatility: number;
  maxDrawdown: number;
  fees: number;
  liquidity: 'high' | 'medium' | 'low';
  correlations: Record<string, number>;
}

export interface OptimizationInput {
  userId: string;
  phaseId: string;
  currentPositions: Record<string, number>;
  assetClassData: Record<string, AssetClassData>;
  clientRiskTolerance: number;
  volatilityRegime: 'low' | 'medium' | 'high' | 'extreme';
  liquidityNeed: number;
  timeHorizon: number;
  maxDrawdownTolerance: number;
  advisorOverlay?: AdvisorConstraintOverlay;
}

export interface OptimizationOutput {
  targetWeights: Record<string, number>;
  expectedReturn: number;
  expectedVolatility: number;
  expectedMaxDrawdown: number;
  totalFees: number;
  utilityScore: number;
  drift: Record<string, number>;
  rebalanceNeeded: boolean;
  recommendations: string[];
  rationale: string;
  confidence: number;
}

export interface PortfolioMetrics {
  expectedReturn: number;
  volatility: number;
  maxDrawdown: number;
  sharpeRatio: number;
  fees: number;
  diversificationRatio: number;
}

/**
 * Portfolio Optimization Engine with SWAG Phase Integration
 */
export class PortfolioOptimizer {
  private static readonly ASSET_CLASSES = [
    'cash',
    'government_bonds',
    'corporate_bonds',
    'high_yield_bonds',
    'us_equity',
    'international_equity', 
    'emerging_markets',
    'real_estate',
    'commodities',
    'private_equity',
    'private_debt',
    'hedge_funds'
  ];

  private static readonly DEFAULT_CORRELATIONS: Record<string, Record<string, number>> = {
    cash: { cash: 1.0, government_bonds: 0.1, corporate_bonds: 0.1, us_equity: 0.0 },
    government_bonds: { cash: 0.1, government_bonds: 1.0, corporate_bonds: 0.8, us_equity: -0.2 },
    corporate_bonds: { cash: 0.1, government_bonds: 0.8, corporate_bonds: 1.0, us_equity: 0.3 },
    us_equity: { cash: 0.0, government_bonds: -0.2, corporate_bonds: 0.3, us_equity: 1.0 },
    international_equity: { us_equity: 0.7, international_equity: 1.0 },
    real_estate: { us_equity: 0.6, real_estate: 1.0 },
    private_equity: { us_equity: 0.8, private_equity: 1.0 },
    private_debt: { corporate_bonds: 0.6, private_debt: 1.0 }
  };

  static async optimize(input: OptimizationInput): Promise<OptimizationOutput> {
    try {
      // Step 1: Calculate LARB (Liquidity-Adjusted Risk Budget)
      const larbInput: LARBInput = {
        phaseConfig: this.getPhaseConfig(input.phaseId),
        clientRiskTolerance: input.clientRiskTolerance,
        currentVolatilityRegime: input.volatilityRegime,
        maxDrawdownTolerance: input.maxDrawdownTolerance,
        liquidityNeed: input.liquidityNeed,
        timeHorizon: input.timeHorizon
      };

      const larbResult = LARBCalculator.calculate(larbInput);

      // Step 2: Generate strategic allocation based on phase and LARB
      const strategicAllocation = this.generateStrategicAllocation(
        input.phaseId,
        larbResult.adjustedRiskBudget,
        input.volatilityRegime
      );

      // Step 3: Apply advisor constraints overlay
      let targetAllocation = strategicAllocation;
      if (input.advisorOverlay) {
        targetAllocation = this.applyAdvisorConstraints(strategicAllocation, input.advisorOverlay);
      }

      // Step 4: Optimize using utility maximization
      const optimizedWeights = await this.optimizeWeights(
        targetAllocation,
        input.assetClassData,
        input.phaseId,
        larbResult
      );

      // Step 5: Calculate portfolio metrics
      const metrics = this.calculatePortfolioMetrics(optimizedWeights, input.assetClassData);

      // Step 6: Calculate drift from current positions
      const drift = this.calculateDrift(input.currentPositions, optimizedWeights);
      const phaseConfig = this.getPhaseConfig(input.phaseId);
      const rebalanceNeeded = this.needsRebalancing(drift, phaseConfig.driftThreshold);

      // Step 7: Generate recommendations
      const recommendations = this.generateRecommendations(
        input.currentPositions,
        optimizedWeights,
        drift,
        metrics,
        phaseConfig
      );

      // Step 8: Create rationale
      const rationale = this.generateRationale(input, larbResult, metrics, recommendations);

      return {
        targetWeights: optimizedWeights,
        expectedReturn: metrics.expectedReturn,
        expectedVolatility: metrics.volatility,
        expectedMaxDrawdown: metrics.maxDrawdown,
        totalFees: metrics.fees,
        utilityScore: await this.calculateUtilityScore(optimizedWeights, input.assetClassData, input.phaseId),
        drift,
        rebalanceNeeded,
        recommendations,
        rationale,
        confidence: larbResult.confidenceLevel
      };

    } catch (error) {
      console.error('Portfolio optimization error:', error);
      throw new Error(`Optimization failed: ${error.message}`);
    }
  }

  private static getPhaseConfig(phaseId: string): PhaseConfig {
    const configs = {
      income_now: { driftThreshold: 0.03, feeCap: 0.005, riskTolerance: 'conservative' as const },
      income_later: { driftThreshold: 0.05, feeCap: 0.0075, riskTolerance: 'moderate' as const },
      growth: { driftThreshold: 0.07, feeCap: 0.01, riskTolerance: 'aggressive' as const },
      legacy: { driftThreshold: 0.1, feeCap: 0.015, riskTolerance: 'moderate' as const }
    };
    return configs[phaseId] as any;
  }

  private static generateStrategicAllocation(
    phaseId: string,
    riskBudget: number,
    regime: string
  ): Record<string, number> {
    const baseAllocations: Record<string, Record<string, number>> = {
      income_now: {
        cash: 0.15,
        government_bonds: 0.25,
        corporate_bonds: 0.20,
        high_yield_bonds: 0.05,
        us_equity: 0.20,
        international_equity: 0.10,
        real_estate: 0.05,
        private_debt: 0.00
      },
      income_later: {
        cash: 0.08,
        government_bonds: 0.15,
        corporate_bonds: 0.15,
        high_yield_bonds: 0.07,
        us_equity: 0.30,
        international_equity: 0.15,
        real_estate: 0.07,
        private_debt: 0.03
      },
      growth: {
        cash: 0.03,
        government_bonds: 0.05,
        corporate_bonds: 0.07,
        high_yield_bonds: 0.05,
        us_equity: 0.40,
        international_equity: 0.25,
        real_estate: 0.08,
        private_equity: 0.05,
        private_debt: 0.02
      },
      legacy: {
        cash: 0.05,
        government_bonds: 0.10,
        corporate_bonds: 0.10,
        high_yield_bonds: 0.05,
        us_equity: 0.30,
        international_equity: 0.20,
        real_estate: 0.10,
        private_equity: 0.08,
        private_debt: 0.02
      }
    };

    let allocation = { ...baseAllocations[phaseId] };

    // Adjust for risk budget
    const riskAssets = ['us_equity', 'international_equity', 'emerging_markets', 'private_equity'];
    const safeAssets = ['cash', 'government_bonds'];

    if (riskBudget < 0.5) {
      // Reduce risk assets, increase safe assets
      const reduction = (0.5 - riskBudget) * 0.5;
      riskAssets.forEach(asset => {
        if (allocation[asset]) {
          allocation[asset] *= (1 - reduction);
        }
      });
      
      const additionalSafe = reduction * 0.3;
      safeAssets.forEach(asset => {
        if (allocation[asset]) {
          allocation[asset] += additionalSafe;
        }
      });
    }

    // Regime adjustments
    if (regime === 'high' || regime === 'extreme') {
      // Increase defensive allocations
      allocation.cash = Math.min(0.25, allocation.cash * 1.5);
      allocation.government_bonds = Math.min(0.35, allocation.government_bonds * 1.3);
      
      // Reduce risky allocations
      allocation.us_equity *= 0.8;
      allocation.international_equity *= 0.7;
      if (allocation.private_equity) allocation.private_equity *= 0.6;
    }

    // Normalize to sum to 1
    const total = Object.values(allocation).reduce((sum, weight) => sum + weight, 0);
    Object.keys(allocation).forEach(asset => {
      allocation[asset] /= total;
    });

    return allocation;
  }

  private static applyAdvisorConstraints(
    baseAllocation: Record<string, number>,
    overlay: AdvisorConstraintOverlay
  ): Record<string, number> {
    const adjusted = { ...baseAllocation };
    const { customConstraints } = overlay;

    // Apply exclusions
    if (customConstraints.excludedAssetClasses) {
      customConstraints.excludedAssetClasses.forEach(asset => {
        if (adjusted[asset]) {
          const excludedWeight = adjusted[asset];
          delete adjusted[asset];
          
          // Redistribute to remaining assets
          const remainingAssets = Object.keys(adjusted);
          remainingAssets.forEach(remainingAsset => {
            adjusted[remainingAsset] += excludedWeight / remainingAssets.length;
          });
        }
      });
    }

    // Apply minimum allocations
    if (customConstraints.minAllocations) {
      Object.entries(customConstraints.minAllocations).forEach(([asset, minWeight]) => {
        if (adjusted[asset] < minWeight) {
          adjusted[asset] = minWeight;
        }
      });
    }

    // Apply maximum allocations
    if (customConstraints.maxAllocations) {
      Object.entries(customConstraints.maxAllocations).forEach(([asset, maxWeight]) => {
        if (adjusted[asset] > maxWeight) {
          adjusted[asset] = maxWeight;
        }
      });
    }

    // Renormalize
    const total = Object.values(adjusted).reduce((sum, weight) => sum + weight, 0);
    Object.keys(adjusted).forEach(asset => {
      adjusted[asset] /= total;
    });

    return adjusted;
  }

  private static async optimizeWeights(
    strategicAllocation: Record<string, number>,
    assetData: Record<string, AssetClassData>,
    phaseId: string,
    larbResult: any
  ): Promise<Record<string, number>> {
    // Simple mean-variance optimization with utility constraints
    const assets = Object.keys(strategicAllocation);
    let bestWeights = { ...strategicAllocation };
    let bestUtility = -Infinity;

    // Generate candidate allocations around strategic allocation
    const candidates = this.generateCandidateAllocations(strategicAllocation, 50);

    for (const candidate of candidates) {
      const utility = await this.calculateUtilityScore(candidate, assetData, phaseId);
      if (utility > bestUtility) {
        bestUtility = utility;
        bestWeights = { ...candidate };
      }
    }

    return bestWeights;
  }

  private static generateCandidateAllocations(
    baseAllocation: Record<string, number>,
    numCandidates: number
  ): Record<string, number>[] {
    const candidates = [baseAllocation]; // Include base allocation
    const assets = Object.keys(baseAllocation);

    for (let i = 0; i < numCandidates - 1; i++) {
      const candidate = { ...baseAllocation };
      
      // Apply random perturbations
      assets.forEach(asset => {
        const perturbation = (Math.random() - 0.5) * 0.1; // ±5% perturbation
        candidate[asset] = Math.max(0, candidate[asset] + perturbation);
      });

      // Normalize
      const total = Object.values(candidate).reduce((sum, weight) => sum + weight, 0);
      assets.forEach(asset => {
        candidate[asset] /= total;
      });

      candidates.push(candidate);
    }

    return candidates;
  }

  private static calculatePortfolioMetrics(
    weights: Record<string, number>,
    assetData: Record<string, AssetClassData>
  ): PortfolioMetrics {
    let expectedReturn = 0;
    let totalFees = 0;
    let portfolioVariance = 0;
    let maxDrawdown = 0;

    // Calculate expected return and fees
    Object.entries(weights).forEach(([asset, weight]) => {
      const data = assetData[asset];
      if (data) {
        expectedReturn += weight * data.expectedReturn;
        totalFees += weight * data.fees;
        maxDrawdown += weight * data.maxDrawdown;
      }
    });

    // Calculate portfolio variance (simplified)
    Object.entries(weights).forEach(([asset1, weight1]) => {
      const data1 = assetData[asset1];
      if (!data1) return;

      Object.entries(weights).forEach(([asset2, weight2]) => {
        const data2 = assetData[asset2];
        if (!data2) return;

        const correlation = data1.correlations[asset2] || 
                          data2.correlations[asset1] || 
                          (asset1 === asset2 ? 1.0 : 0.3); // Default correlation

        portfolioVariance += weight1 * weight2 * data1.volatility * data2.volatility * correlation;
      });
    });

    const volatility = Math.sqrt(portfolioVariance);
    const sharpeRatio = (expectedReturn - 0.02) / volatility; // Assuming 2% risk-free rate

    // Simple diversification ratio (number of meaningful positions)
    const meaningfulPositions = Object.values(weights).filter(w => w > 0.02).length;
    const diversificationRatio = meaningfulPositions / Object.keys(weights).length;

    return {
      expectedReturn,
      volatility,
      maxDrawdown,
      sharpeRatio,
      fees: totalFees,
      diversificationRatio
    };
  }

  private static async calculateUtilityScore(
    weights: Record<string, number>,
    assetData: Record<string, AssetClassData>,
    phaseId: string
  ): Promise<number> {
    const metrics = this.calculatePortfolioMetrics(weights, assetData);
    
    const utilityInput: UtilityInput = {
      expectedReturn: metrics.expectedReturn,
      volatility: metrics.volatility,
      maxDrawdown: metrics.maxDrawdown,
      fees: metrics.fees,
      liquidityPenalty: this.calculateLiquidityPenalty(weights, assetData),
      phaseWeight: 1.0
    };

    const utility = UtilityCalculator.calculate(utilityInput, phaseId);
    return utility.utilityScore;
  }

  private static calculateLiquidityPenalty(
    weights: Record<string, number>,
    assetData: Record<string, AssetClassData>
  ): number {
    let illiquidWeight = 0;
    Object.entries(weights).forEach(([asset, weight]) => {
      const data = assetData[asset];
      if (data && data.liquidity === 'low') {
        illiquidWeight += weight;
      } else if (data && data.liquidity === 'medium') {
        illiquidWeight += weight * 0.5;
      }
    });
    return illiquidWeight;
  }

  private static calculateDrift(
    current: Record<string, number>,
    target: Record<string, number>
  ): Record<string, number> {
    const drift: Record<string, number> = {};
    
    const allAssets = new Set([...Object.keys(current), ...Object.keys(target)]);
    
    allAssets.forEach(asset => {
      const currentWeight = current[asset] || 0;
      const targetWeight = target[asset] || 0;
      drift[asset] = targetWeight - currentWeight;
    });

    return drift;
  }

  private static needsRebalancing(
    drift: Record<string, number>,
    threshold: number
  ): boolean {
    return Object.values(drift).some(d => Math.abs(d) > threshold);
  }

  private static generateRecommendations(
    current: Record<string, number>,
    target: Record<string, number>,
    drift: Record<string, number>,
    metrics: PortfolioMetrics,
    phaseConfig: PhaseConfig
  ): string[] {
    const recommendations = [];

    // Check for major drifts
    Object.entries(drift).forEach(([asset, driftAmount]) => {
      if (Math.abs(driftAmount) > 0.05) {
        const action = driftAmount > 0 ? 'increase' : 'decrease';
        recommendations.push(`${action} ${asset} allocation by ${Math.abs(driftAmount * 100).toFixed(1)}%`);
      }
    });

    // Check fees vs phase cap
    if (metrics.fees > phaseConfig.feeCap) {
      recommendations.push(`Consider lower-cost alternatives - current fees ${(metrics.fees * 100).toFixed(2)}% exceed ${phaseConfig.name} phase cap of ${(phaseConfig.feeCap * 100).toFixed(2)}%`);
    }

    // Check diversification
    if (metrics.diversificationRatio < 0.6) {
      recommendations.push('Consider increasing diversification across asset classes');
    }

    // Check Sharpe ratio
    if (metrics.sharpeRatio < 0.5) {
      recommendations.push('Portfolio risk-adjusted returns may be improved');
    }

    return recommendations;
  }

  private static generateRationale(
    input: OptimizationInput,
    larbResult: any,
    metrics: PortfolioMetrics,
    recommendations: string[]
  ): string {
    return [
      `${input.phaseId.replace('_', ' ').toUpperCase()} phase optimization:`,
      `Risk budget: ${(larbResult.adjustedRiskBudget * 100).toFixed(0)}%`,
      `Expected return: ${(metrics.expectedReturn * 100).toFixed(1)}%`,
      `Volatility: ${(metrics.volatility * 100).toFixed(1)}%`,
      `Total fees: ${(metrics.fees * 100).toFixed(2)}%`,
      `Confidence: ${(larbResult.confidenceLevel * 100).toFixed(0)}%`,
      recommendations.length > 0 ? `Key actions: ${recommendations.slice(0, 2).join(', ')}` : 'Portfolio is well-aligned'
    ].join(' | ');
  }
}