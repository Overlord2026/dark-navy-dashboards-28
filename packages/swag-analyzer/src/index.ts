/**
 * SWAG Analyzer - Main Export
 * Strategic Wealth Alpha GPS™
 */

export * from './models';
export * from './phase_objective';
export * from './monitoring';
export * from './phase_shift';
export * from './alt_models';
export * from './receipts';
export * as engines from './engines';

// Main analyzer class
export class SWAGAnalyzer {
  async analyze(input: any) {
    const { simulate } = await import('./engines/simulator');
    return simulate();
  }
  
  async generateReceipt(data: any) {
    const { makeOutcomeReceipt } = await import('./receipts');
    return makeOutcomeReceipt(data);
  }
}

/**
 * Main SWAG Analyzer class - Entry point for all analysis
 */
export class SWAGAnalyzer {
  private simulator: MonteCarloSimulator;
  private phaseCalculator: PhaseObjectiveCalculator;

  constructor(seed?: string) {
    this.simulator = new MonteCarloSimulator(seed);
    this.phaseCalculator = new PhaseObjectiveCalculator();
  }

  /**
   * Run comprehensive SWAG analysis
   */
  async analyze(input: AnalyzerInput): Promise<AnalyzerResult> {
    // Validate input
    this.validateInput(input);
    
    // Run Monte Carlo simulation
    const result = await this.simulator.runAnalysis(input);
    
    // Calculate detailed phase objectives
    const enhancedPhaseMetrics = this.calculateEnhancedPhaseMetrics(result, input);
    
    return {
      ...result,
      phaseMetrics: enhancedPhaseMetrics
    };
  }

  /**
   * Run quick analysis with fewer Monte Carlo paths
   */
  async quickAnalyze(input: AnalyzerInput): Promise<AnalyzerResult> {
    const quickInput = {
      ...input,
      scenario: {
        ...input.scenario,
        nPaths: Math.min(100, input.scenario.nPaths)
      }
    };
    
    return this.analyze(quickInput);
  }

  /**
   * Generate stress test scenarios only
   */
  async stressTest(
    input: AnalyzerInput,
    scenarios: string[] = ['market_crash', 'inflation_spike', 'longevity_shock', 'ltc_event']
  ): Promise<Partial<AnalyzerResult>> {
    const stressInput = {
      ...input,
      scenario: {
        ...input.scenario,
        nPaths: 500 // Focused stress testing
      }
    };
    
    const result = await this.simulator.runAnalysis(stressInput);
    
    // Filter for stress scenarios only
    const stressTests = result.stressTests.filter(test => 
      scenarios.includes(test.scenario) || test.scenario.includes('stress')
    );
    
    return {
      householdId: result.householdId,
      runId: result.runId,
      timestamp: result.timestamp,
      stressTests,
      summary: {
        ...result.summary,
        keyRisks: result.summary.keyRisks.filter(risk => 
          scenarios.some(scenario => risk.toLowerCase().includes(scenario.toLowerCase()))
        )
      }
    };
  }

  /**
   * Calculate phase transition recommendations
   */
  analyzePhaseTransition(
    currentPhase: 'INCOME_NOW' | 'INCOME_LATER' | 'GROWTH' | 'LEGACY',
    nextPhase: 'INCOME_NOW' | 'INCOME_LATER' | 'GROWTH' | 'LEGACY',
    currentResult: AnalyzerResult,
    projectedResult: AnalyzerResult
  ) {
    return this.phaseCalculator.calculatePhaseTransitionMetrics(
      currentPhase,
      nextPhase,
      currentResult.phaseMetrics[currentPhase],
      projectedResult.phaseMetrics[nextPhase]
    );
  }

  /**
   * Generate rebalancing recommendations based on outcome scores
   */
  generateRebalancingRecommendations(
    result: AnalyzerResult,
    targetScores?: Record<'INCOME_NOW' | 'INCOME_LATER' | 'GROWTH' | 'LEGACY', number>
  ) {
    const defaultTargets = {
      INCOME_NOW: 85,
      INCOME_LATER: 80,
      GROWTH: 75,
      LEGACY: 78
    };
    
    return this.phaseCalculator.generateRebalancingRecommendations(
      result.phaseMetrics,
      targetScores || defaultTargets
    );
  }

  /**
   * Create default scenario configuration
   */
  static createDefaultScenario(): ScenarioConfig {
    return {
      nPaths: 1000,
      horizonYears: 30,
      blockLenMonths: 12,
      
      inflation: {
        mu: 0.025,    // 2.5% long-run inflation
        phi: 0.3,     // Moderate persistence
        sigma: 0.01   // 1% volatility
      },
      
      rates: {
        meanRev: 0.2,     // 20% mean reversion speed
        vol: 0.015,       // 1.5% rate volatility
        longRun: 0.03,    // 3% long-run rate
        r0: 0.025         // Current rate
      },
      
      equity: {
        regimes: 2,
        trans: [[0.9, 0.1], [0.3, 0.7]], // Persistent regimes
        mu: [0.08, -0.05],                // Bull/bear market returns
        sigma: [0.16, 0.25]               // Volatilities by regime
      },
      
      privateCredit: {
        baseYield: 0.06,
        defaultProb: 0.02,
        recovery: 0.6,
        taxChar: 'interest'
      },
      
      infra: {
        baseYield: 0.05,
        rocPct: 0.3,
        depShield: true
      },
      
      crypto: {
        symbols: ['BTC', 'ETH'],
        vol: 0.6,
        corr: 0.3,
        unbondDays: 21,
        slashingProb: 0.001
      },
      
      ltc: {
        baseHazard: 0.01,
        age0: 65,
        inflation: 0.04,
        intensityDist: [0.6, 0.25, 0.1, 0.05] // None, mild, moderate, severe
      },
      
      longevity: {
        male: true,
        gmA: 0.0001,
        gmB: 0.0002,
        gmC: 0.08
      },
      
      taxes: {
        ordinary: 0.22,
        qualified: 0.15,
        ltg: 0.15,
        stg: 0.22,
        state: 0.05,
        ubti: false
      }
    };
  }

  /**
   * Validate analyzer input
   */
  private validateInput(input: AnalyzerInput): void {
    if (!input.householdId) {
      throw new Error('Household ID is required');
    }
    
    if (input.currentAge < 18 || input.currentAge > 100) {
      throw new Error('Current age must be between 18 and 100');
    }
    
    if (input.retirementAge <= input.currentAge) {
      throw new Error('Retirement age must be after current age');
    }
    
    if (input.initialPortfolio <= 0) {
      throw new Error('Initial portfolio value must be positive');
    }
    
    if (!input.scenario || input.scenario.nPaths < 100) {
      throw new Error('Scenario must specify at least 100 Monte Carlo paths');
    }
    
    // Validate risk profile
    if (!input.risk.epsilonByPhase) {
      throw new Error('Risk profile must include epsilon values for all phases');
    }
    
    for (const phaseId of ['INCOME_NOW', 'INCOME_LATER', 'GROWTH', 'LEGACY'] as const) {
      if (!(phaseId in input.risk.epsilonByPhase)) {
        throw new Error(`Risk profile missing epsilon for phase ${phaseId}`);
      }
      
      if (!(phaseId in input.risk.budgets)) {
        throw new Error(`Risk profile missing budgets for phase ${phaseId}`);
      }
    }
  }

  /**
   * Calculate enhanced phase metrics using PhaseObjectiveCalculator
   */
  private calculateEnhancedPhaseMetrics(result: AnalyzerResult, input: AnalyzerInput) {
    const phaseTimeframes = {
      INCOME_NOW: { startYear: 0, endYear: 2 },
      INCOME_LATER: { startYear: 3, endYear: 12 },
      GROWTH: { startYear: 13, endYear: 25 },
      LEGACY: { startYear: 26, endYear: input.scenario.horizonYears }
    };
    
    const enhancedMetrics: Record<'INCOME_NOW' | 'INCOME_LATER' | 'GROWTH' | 'LEGACY', any> = {
      INCOME_NOW: {},
      INCOME_LATER: {},
      GROWTH: {},
      LEGACY: {}
    };
    
    for (const [phaseId, timeframe] of Object.entries(phaseTimeframes) as [keyof typeof phaseTimeframes, any][]) {
      enhancedMetrics[phaseId] = this.phaseCalculator.calculatePhaseOutcomes(
        phaseId,
        result.stressTests,
        input,
        timeframe
      );
    }
    
    return enhancedMetrics;
  }
}

// Export convenience functions
export function createAnalyzer(seed?: string): SWAGAnalyzer {
  return new SWAGAnalyzer(seed);
}

export function createDefaultInput(householdId: string): Partial<AnalyzerInput> {
  return {
    householdId,
    currentAge: 45,
    retirementAge: 65,
    lifeExpectancy: 90,
    initialPortfolio: 1000000,
    holdings: [],
    cashflowNeeds: {
      INCOME_NOW: { schedule: [], essential: true, inflationProtected: true },
      INCOME_LATER: { schedule: [], essential: true, inflationProtected: true },
      GROWTH: { schedule: [], essential: false, inflationProtected: false },
      LEGACY: { schedule: [], essential: false, inflationProtected: false }
    },
    risk: {
      epsilonByPhase: {
        INCOME_NOW: 0.05,
        INCOME_LATER: 0.1,
        GROWTH: 0.15,
        LEGACY: 0.1
      },
      budgets: {
        INCOME_NOW: { bL: 0.1, bA: 0.8, bR: 0.1, bT: 0.05 },
        INCOME_LATER: { bL: 0.05, bA: 0.85, bR: 0.15, bT: 0.08 },
        GROWTH: { bL: 0.02, bA: 0.9, bR: 0.2, bT: 0.1 },
        LEGACY: { bL: 0.05, bA: 0.8, bR: 0.12, bT: 0.15 }
      },
      maxDrawdown: 0.25,
      confidenceLevel: 0.9
    },
    scenario: SWAGAnalyzer.createDefaultScenario()
  };
}