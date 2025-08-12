/**
 * Monte Carlo simulation engine for retirement analysis
 */

export interface SimulationInput {
  initialPortfolio: number;
  monthlyExpenses: number;
  inflationRate: number;
  assetAllocation: Record<string, number>;
  assetReturns: Record<string, { mean: number; volatility: number }>;
  withdrawalStrategy: 'fixed' | 'dynamic' | 'guardrails';
  timeHorizon: number; // years
  paths: number;
  seed?: number;
}

export interface SimulationPath {
  pathId: number;
  years: number[];
  portfolioValues: number[];
  withdrawals: number[];
  inflationAdjustedValues: number[];
  success: boolean;
  depletionYear?: number;
}

export interface SimulationResult {
  successProbability: number;
  worstDecile: number;
  medianPortfolioValue: number;
  sustainabilityYears: number;
  paths: SimulationPath[];
  summary: {
    byPhase: Record<string, {
      avgValue: number;
      successRate: number;
      worstCase: number;
    }>;
  };
}

export class MonteCarloSimulator {
  private rng: () => number;

  constructor(seed?: number) {
    this.rng = this.createSeededRandom(seed || Date.now());
  }

  private createSeededRandom(seed: number): () => number {
    let x = Math.sin(seed) * 10000;
    return () => {
      x = Math.sin(x) * 10000;
      return x - Math.floor(x);
    };
  }

  private normalRandom(mean: number = 0, stdDev: number = 1): number {
    // Box-Muller transformation
    const u1 = this.rng();
    const u2 = this.rng();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + z * stdDev;
  }

  private generateInflationPath(years: number, baseRate: number, volatility: number = 0.02): number[] {
    const path: number[] = [];
    let currentRate = baseRate;
    
    for (let i = 0; i < years; i++) {
      // Mean reversion model
      const shock = this.normalRandom(0, volatility);
      currentRate = baseRate * 0.7 + currentRate * 0.3 + shock;
      currentRate = Math.max(0, Math.min(0.1, currentRate)); // Cap between 0-10%
      path.push(currentRate);
    }
    
    return path;
  }

  private generateAssetReturns(
    years: number, 
    assetReturns: Record<string, { mean: number; volatility: number }>
  ): Record<string, number[]> {
    const returns: Record<string, number[]> = {};
    
    for (const [asset, params] of Object.entries(assetReturns)) {
      returns[asset] = [];
      
      for (let i = 0; i < years; i++) {
        const annualReturn = this.normalRandom(params.mean, params.volatility);
        returns[asset].push(annualReturn);
      }
    }
    
    return returns;
  }

  simulate(input: SimulationInput): SimulationResult {
    const paths: SimulationPath[] = [];
    let successCount = 0;
    const finalValues: number[] = [];
    
    for (let pathId = 0; pathId < input.paths; pathId++) {
      const path = this.simulatePath(input, pathId);
      paths.push(path);
      
      if (path.success) {
        successCount++;
      }
      
      finalValues.push(path.portfolioValues[path.portfolioValues.length - 1]);
    }
    
    finalValues.sort((a, b) => a - b);
    const successProbability = successCount / input.paths;
    const worstDecile = finalValues[Math.floor(input.paths * 0.1)];
    const medianPortfolioValue = finalValues[Math.floor(input.paths * 0.5)];
    
    // Calculate sustainability years
    const depletionYears = paths
      .filter(p => !p.success && p.depletionYear)
      .map(p => p.depletionYear!);
    
    const sustainabilityYears = depletionYears.length > 0 
      ? depletionYears.reduce((sum, year) => sum + year, 0) / depletionYears.length
      : input.timeHorizon;

    // Phase analysis
    const phaseBreakpoints = {
      'INCOME_NOW': [0, 5],
      'INCOME_LATER': [5, 15],
      'GROWTH': [15, 25],
      'LEGACY': [25, input.timeHorizon]
    };

    const byPhase: Record<string, any> = {};
    
    for (const [phase, [start, end]] of Object.entries(phaseBreakpoints)) {
      const phaseValues = paths.map(path => {
        const phaseYears = path.portfolioValues.slice(start, Math.min(end, path.portfolioValues.length));
        return phaseYears.length > 0 ? phaseYears[phaseYears.length - 1] : 0;
      });
      
      phaseValues.sort((a, b) => a - b);
      
      byPhase[phase] = {
        avgValue: phaseValues.reduce((sum, val) => sum + val, 0) / phaseValues.length,
        successRate: phaseValues.filter(val => val > 0).length / phaseValues.length,
        worstCase: phaseValues[Math.floor(phaseValues.length * 0.1)]
      };
    }

    return {
      successProbability,
      worstDecile,
      medianPortfolioValue,
      sustainabilityYears,
      paths,
      summary: { byPhase }
    };
  }

  private simulatePath(input: SimulationInput, pathId: number): SimulationPath {
    const years: number[] = [];
    const portfolioValues: number[] = [];
    const withdrawals: number[] = [];
    const inflationAdjustedValues: number[] = [];
    
    let currentValue = input.initialPortfolio;
    let currentExpenses = input.monthlyExpenses * 12;
    
    const inflationPath = this.generateInflationPath(input.timeHorizon, input.inflationRate);
    const assetReturnPaths = this.generateAssetReturns(input.timeHorizon, input.assetReturns);
    
    let success = true;
    let depletionYear: number | undefined;
    
    for (let year = 0; year < input.timeHorizon; year++) {
      years.push(year);
      
      // Apply inflation to expenses
      if (year > 0) {
        currentExpenses *= (1 + inflationPath[year - 1]);
      }
      
      // Calculate portfolio return
      let totalReturn = 0;
      for (const [asset, allocation] of Object.entries(input.assetAllocation)) {
        if (assetReturnPaths[asset]) {
          totalReturn += allocation * assetReturnPaths[asset][year];
        }
      }
      
      // Apply return to portfolio
      currentValue *= (1 + totalReturn);
      
      // Withdraw expenses
      const withdrawal = Math.min(currentExpenses, currentValue);
      currentValue -= withdrawal;
      
      portfolioValues.push(currentValue);
      withdrawals.push(withdrawal);
      
      // Calculate inflation-adjusted value
      const cumulativeInflation = inflationPath.slice(0, year + 1)
        .reduce((acc, rate) => acc * (1 + rate), 1);
      inflationAdjustedValues.push(currentValue / cumulativeInflation);
      
      // Check for depletion
      if (currentValue <= 0 && !depletionYear) {
        success = false;
        depletionYear = year;
        break;
      }
    }
    
    return {
      pathId,
      years,
      portfolioValues,
      withdrawals,
      inflationAdjustedValues,
      success,
      depletionYear
    };
  }
}

export function createDefaultSimulation(portfolioValue: number): SimulationInput {
  return {
    initialPortfolio: portfolioValue,
    monthlyExpenses: portfolioValue * 0.04 / 12, // 4% withdrawal rate
    inflationRate: 0.025,
    assetAllocation: {
      'stocks': 0.6,
      'bonds': 0.3,
      'cash': 0.1
    },
    assetReturns: {
      'stocks': { mean: 0.08, volatility: 0.18 },
      'bonds': { mean: 0.04, volatility: 0.05 },
      'cash': { mean: 0.025, volatility: 0.001 }
    },
    withdrawalStrategy: 'dynamic',
    timeHorizon: 30,
    paths: 5000
  };
}