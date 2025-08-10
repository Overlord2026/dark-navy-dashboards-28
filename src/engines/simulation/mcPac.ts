/**
 * Monte Carlo Portfolio Analysis & Compliance (McPAC) Engine
 * Comprehensive simulation framework for portfolio stress testing and compliance validation
 */

import { PhaseConfig } from '../portfolio/phasePolicy';

export interface McPACInput {
  portfolioWeights: Record<string, number>;
  assetReturns: Record<string, number[]>; // Historical returns
  assetVolatilities: Record<string, number>;
  correlationMatrix: number[][]; // Asset correlation matrix
  phaseConfig: PhaseConfig;
  timeHorizonYears: number;
  numSimulations: number;
  confidenceLevel: number; // e.g., 0.95 for 95% confidence
}

export interface SimulationPath {
  returns: number[];
  cumulativeReturns: number[];
  portfolioValues: number[];
  maxDrawdown: number;
  finalValue: number;
}

export interface McPACOutput {
  expectedReturn: number;
  volatility: number;
  valueAtRisk: number; // VaR at specified confidence level
  conditionalVaR: number; // Expected shortfall
  maxDrawdown: number;
  probabilityOfLoss: number;
  sharpeRatio: number;
  sortinoRatio: number;
  paths: SimulationPath[];
  percentiles: {
    p5: number;
    p25: number;
    p50: number;
    p75: number;
    p95: number;
  };
  complianceMetrics: {
    breachProbability: number;
    expectedExcess: number;
    stressTestResults: Record<string, number>;
  };
  scenarioAnalysis: {
    bestCase: SimulationPath;
    worstCase: SimulationPath;
    medianCase: SimulationPath;
  };
}

export class MonteCarloEngine {
  private static generateRandomNormal(): number {
    // Box-Muller transformation for generating normal random variables
    let u = 0, v = 0;
    while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }

  private static generateCorrelatedReturns(
    expectedReturns: number[],
    correlationMatrix: number[][],
    volatilities: number[]
  ): number[] {
    const n = expectedReturns.length;
    const independent = Array(n).fill(0).map(() => this.generateRandomNormal());
    
    // Cholesky decomposition for correlation
    const L = this.choleskyDecomposition(correlationMatrix);
    const correlated = new Array(n).fill(0);
    
    for (let i = 0; i < n; i++) {
      for (let j = 0; j <= i; j++) {
        correlated[i] += L[i][j] * independent[j];
      }
      // Apply volatility and expected return
      correlated[i] = expectedReturns[i] + volatilities[i] * correlated[i];
    }
    
    return correlated;
  }

  private static choleskyDecomposition(matrix: number[][]): number[][] {
    const n = matrix.length;
    const L = Array(n).fill(null).map(() => Array(n).fill(0));
    
    for (let i = 0; i < n; i++) {
      for (let j = 0; j <= i; j++) {
        if (i === j) {
          let sum = 0;
          for (let k = 0; k < j; k++) {
            sum += L[j][k] * L[j][k];
          }
          L[j][j] = Math.sqrt(matrix[j][j] - sum);
        } else {
          let sum = 0;
          for (let k = 0; k < j; k++) {
            sum += L[i][k] * L[j][k];
          }
          L[i][j] = (matrix[i][j] - sum) / L[j][j];
        }
      }
    }
    
    return L;
  }

  private static calculatePortfolioReturn(
    assetReturns: number[],
    weights: number[]
  ): number {
    return assetReturns.reduce((sum, ret, i) => sum + ret * weights[i], 0);
  }

  private static calculateMaxDrawdown(values: number[]): number {
    let maxDrawdown = 0;
    let peak = values[0];
    
    for (let i = 1; i < values.length; i++) {
      if (values[i] > peak) {
        peak = values[i];
      } else {
        const drawdown = (peak - values[i]) / peak;
        maxDrawdown = Math.max(maxDrawdown, drawdown);
      }
    }
    
    return maxDrawdown;
  }

  private static runSingleSimulation(
    weights: number[],
    expectedReturns: number[],
    volatilities: number[],
    correlationMatrix: number[][],
    timeHorizonYears: number,
    initialValue: number = 100000
  ): SimulationPath {
    const periodsPerYear = 252; // Daily simulations
    const totalPeriods = Math.floor(timeHorizonYears * periodsPerYear);
    const dt = 1 / periodsPerYear;
    
    const returns: number[] = [];
    const cumulativeReturns: number[] = [];
    const portfolioValues: number[] = [initialValue];
    
    let cumulativeReturn = 0;
    
    for (let t = 0; t < totalPeriods; t++) {
      const assetReturns = this.generateCorrelatedReturns(
        expectedReturns.map(r => r * dt), // Scale to daily
        correlationMatrix,
        volatilities.map(v => v * Math.sqrt(dt)) // Scale volatility
      );
      
      const portfolioReturn = this.calculatePortfolioReturn(assetReturns, weights);
      returns.push(portfolioReturn);
      
      cumulativeReturn += portfolioReturn;
      cumulativeReturns.push(cumulativeReturn);
      
      const newValue = portfolioValues[portfolioValues.length - 1] * (1 + portfolioReturn);
      portfolioValues.push(newValue);
    }
    
    const maxDrawdown = this.calculateMaxDrawdown(portfolioValues);
    const finalValue = portfolioValues[portfolioValues.length - 1];
    
    return {
      returns,
      cumulativeReturns,
      portfolioValues,
      maxDrawdown,
      finalValue
    };
  }

  static simulate(input: McPACInput): McPACOutput {
    const {
      portfolioWeights,
      assetReturns,
      assetVolatilities,
      correlationMatrix,
      phaseConfig,
      timeHorizonYears,
      numSimulations,
      confidenceLevel
    } = input;

    // Convert to arrays for easier processing
    const assetNames = Object.keys(portfolioWeights);
    const weights = assetNames.map(name => portfolioWeights[name]);
    const expectedReturns = assetNames.map(name => 
      assetReturns[name].reduce((sum, ret) => sum + ret, 0) / assetReturns[name].length
    );
    const volatilities = assetNames.map(name => assetVolatilities[name]);

    // Run Monte Carlo simulations
    const paths: SimulationPath[] = [];
    
    for (let i = 0; i < numSimulations; i++) {
      const path = this.runSingleSimulation(
        weights,
        expectedReturns,
        volatilities,
        correlationMatrix,
        timeHorizonYears
      );
      paths.push(path);
    }

    // Calculate statistics
    const finalValues = paths.map(p => p.finalValue);
    const returns = paths.map(p => (p.finalValue - 100000) / 100000);
    const maxDrawdowns = paths.map(p => p.maxDrawdown);
    
    finalValues.sort((a, b) => a - b);
    returns.sort((a, b) => a - b);
    
    const expectedReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - expectedReturn, 2), 0) / (returns.length - 1);
    const volatility = Math.sqrt(variance);
    
    // Risk metrics
    const varIndex = Math.floor((1 - confidenceLevel) * numSimulations);
    const valueAtRisk = Math.abs(returns[varIndex]);
    
    const tailReturns = returns.slice(0, varIndex);
    const conditionalVaR = tailReturns.length > 0 ? 
      Math.abs(tailReturns.reduce((sum, ret) => sum + ret, 0) / tailReturns.length) : 0;
    
    const maxDrawdown = Math.max(...maxDrawdowns);
    const probabilityOfLoss = returns.filter(ret => ret < 0).length / numSimulations;
    
    // Risk-adjusted returns
    const riskFreeRate = 0.02; // 2% risk-free rate
    const sharpeRatio = (expectedReturn - riskFreeRate) / volatility;
    
    const downside = returns.filter(ret => ret < riskFreeRate);
    const downsideVolatility = downside.length > 0 ? 
      Math.sqrt(downside.reduce((sum, ret) => sum + Math.pow(ret - riskFreeRate, 2), 0) / downside.length) : 0;
    const sortinoRatio = downsideVolatility > 0 ? (expectedReturn - riskFreeRate) / downsideVolatility : 0;

    // Percentiles
    const percentiles = {
      p5: finalValues[Math.floor(0.05 * numSimulations)],
      p25: finalValues[Math.floor(0.25 * numSimulations)],
      p50: finalValues[Math.floor(0.50 * numSimulations)],
      p75: finalValues[Math.floor(0.75 * numSimulations)],
      p95: finalValues[Math.floor(0.95 * numSimulations)]
    };

    // Compliance metrics
    const thresholdBreaches = paths.filter(p => 
      p.maxDrawdown > phaseConfig.allocationConstraints.maxSingleAsset
    ).length;
    
    const complianceMetrics = {
      breachProbability: thresholdBreaches / numSimulations,
      expectedExcess: thresholdBreaches > 0 ? 
        maxDrawdowns.filter(dd => dd > phaseConfig.allocationConstraints.maxSingleAsset)
          .reduce((sum, dd) => sum + dd - phaseConfig.allocationConstraints.maxSingleAsset, 0) / thresholdBreaches : 0,
      stressTestResults: {
        '2008_crisis': this.stressTest(paths, -0.37), // 2008 market drop
        'covid_crash': this.stressTest(paths, -0.34), // COVID-19 crash
        'dotcom_bubble': this.stressTest(paths, -0.49) // Dot-com bubble
      }
    };

    // Scenario analysis
    const bestCaseIndex = finalValues.indexOf(Math.max(...finalValues));
    const worstCaseIndex = finalValues.indexOf(Math.min(...finalValues));
    const medianCaseIndex = Math.floor(numSimulations / 2);
    
    const scenarioAnalysis = {
      bestCase: paths[bestCaseIndex],
      worstCase: paths[worstCaseIndex],
      medianCase: paths[medianCaseIndex]
    };

    return {
      expectedReturn,
      volatility,
      valueAtRisk,
      conditionalVaR,
      maxDrawdown,
      probabilityOfLoss,
      sharpeRatio,
      sortinoRatio,
      paths,
      percentiles,
      complianceMetrics,
      scenarioAnalysis
    };
  }

  private static stressTest(paths: SimulationPath[], stressReturn: number): number {
    // Apply stress scenario to all paths and calculate average impact
    const stressedReturns = paths.map(path => {
      const stressedFinalValue = path.finalValue * (1 + stressReturn);
      return (stressedFinalValue - 100000) / 100000;
    });
    
    return stressedReturns.reduce((sum, ret) => sum + ret, 0) / stressedReturns.length;
  }

  /**
   * Generate efficient frontier points for portfolio optimization
   */
  static generateEfficientFrontier(
    expectedReturns: number[],
    covarianceMatrix: number[][],
    numPoints: number = 50
  ): Array<{ return: number; risk: number; weights: number[] }> {
    // Simplified efficient frontier calculation
    const points: Array<{ return: number; risk: number; weights: number[] }> = [];
    
    // For demonstration - in practice, use quadratic programming
    for (let i = 0; i < numPoints; i++) {
      const targetReturn = 0.05 + (0.15 * i) / numPoints;
      
      // Equal weight portfolio as example (should use optimization)
      const n = expectedReturns.length;
      const weights = new Array(n).fill(1 / n);
      
      const portfolioReturn = weights.reduce((sum, w, idx) => sum + w * expectedReturns[idx], 0);
      const portfolioVariance = this.calculatePortfolioVariance(weights, covarianceMatrix);
      const portfolioRisk = Math.sqrt(portfolioVariance);
      
      points.push({
        return: portfolioReturn,
        risk: portfolioRisk,
        weights
      });
    }
    
    return points.sort((a, b) => a.risk - b.risk);
  }

  private static calculatePortfolioVariance(weights: number[], covarianceMatrix: number[][]): number {
    let variance = 0;
    const n = weights.length;
    
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        variance += weights[i] * weights[j] * covarianceMatrix[i][j];
      }
    }
    
    return variance;
  }
}