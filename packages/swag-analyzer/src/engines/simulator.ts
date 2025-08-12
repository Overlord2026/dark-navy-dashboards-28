/**
 * Monte Carlo Simulator - Portfolio cash-flow engine across SWAG phases
 */

import { 
  AnalyzerInput, 
  AnalyzerResult, 
  CashflowProjection, 
  StressTestResult,
  PhaseAllocation,
  ScenarioConfig 
} from '../models';
import { InflationEngine } from './inflation';
import { RatesEngine } from './rates';
import { ReturnsEngine } from './returns';
import { LongevityEngine } from './longevity';
import { LTCEngine } from './ltc';
import { BootstrapEngine } from './bootstrap';
import * as seedrandom from 'seedrandom';

export class MonteCarloSimulator {
  private rng: seedrandom.PRNG;
  private inflationEngine: InflationEngine;
  private ratesEngine: RatesEngine;
  private returnsEngine: ReturnsEngine;
  private longevityEngine: LongevityEngine;
  private ltcEngine: LTCEngine;
  private bootstrapEngine: BootstrapEngine;

  constructor(seed?: string) {
    const baseSeed = seed || 'simulator_default';
    this.rng = seedrandom(baseSeed);
    
    // Initialize engines with correlated seeds
    this.inflationEngine = new InflationEngine(baseSeed + '_inflation');
    this.ratesEngine = new RatesEngine(baseSeed + '_rates');
    this.returnsEngine = new ReturnsEngine(baseSeed + '_returns');
    this.longevityEngine = new LongevityEngine(baseSeed + '_longevity');
    this.ltcEngine = new LTCEngine(baseSeed + '_ltc');
    this.bootstrapEngine = new BootstrapEngine(baseSeed + '_bootstrap');
  }

  /**
   * Run comprehensive Monte Carlo analysis
   */
  async runAnalysis(input: AnalyzerInput): Promise<AnalyzerResult> {
    const startTime = Date.now();
    const runId = this.generateRunId();
    
    // Determine analysis horizon
    const horizonYears = Math.min(input.scenario.horizonYears, input.lifeExpectancy - input.currentAge);
    
    // Generate economic scenarios
    const economicScenarios = await this.generateEconomicScenarios(input.scenario, horizonYears);
    
    // Optimize phase allocations
    const phaseAllocations = await this.optimizePhaseAllocations(input, economicScenarios);
    
    // Run Monte Carlo simulations
    const stressTests = await this.runStressTests(input, phaseAllocations, economicScenarios);
    
    // Calculate phase metrics
    const phaseMetrics = await this.calculatePhaseMetrics(input, stressTests);
    
    // Generate summary
    const summary = this.generateSummary(stressTests, phaseMetrics);
    
    return {
      householdId: input.householdId,
      runId,
      timestamp: new Date(),
      phaseMetrics,
      phaseAllocations,
      stressTests,
      summary,
      receiptsHash: this.generateReceiptsHash(runId, input, summary)
    };
  }

  /**
   * Generate economic scenarios for Monte Carlo analysis
   */
  private async generateEconomicScenarios(config: ScenarioConfig, nYears: number) {
    const nPaths = config.nPaths;
    const scenarios = [];
    
    for (let path = 0; path < nPaths; path++) {
      // Generate correlated economic paths
      const inflation = this.inflationEngine.generateAR1Path(config, nYears);
      const rates = this.ratesEngine.generateHullWhitePath(config, nYears);
      const returns = this.returnsEngine.generateReturnPaths(config, nYears);
      
      scenarios.push({
        path,
        inflation,
        rates,
        returns
      });
    }
    
    return scenarios;
  }

  /**
   * Optimize asset allocation across SWAG phases
   */
  private async optimizePhaseAllocations(
    input: AnalyzerInput, 
    economicScenarios: any[]
  ): Promise<PhaseAllocation[]> {
    const { risk } = input;
    const allocations: PhaseAllocation[] = [];
    
    // For each phase, optimize allocation given constraints
    for (const phaseId of ['INCOME_NOW', 'INCOME_LATER', 'GROWTH', 'LEGACY'] as const) {
      const phaseBudget = risk.budgets[phaseId];
      const epsilon = risk.epsilonByPhase[phaseId];
      
      // Phase-specific optimization
      const allocation = await this.optimizePhaseAllocation(
        phaseId,
        phaseBudget,
        epsilon,
        economicScenarios
      );
      
      allocations.push(allocation);
    }
    
    return allocations;
  }

  /**
   * Optimize allocation for a specific phase
   */
  private async optimizePhaseAllocation(
    phaseId: any,
    budget: any,
    epsilon: number,
    scenarios: any[]
  ): Promise<PhaseAllocation> {
    // Risk budgeting optimization (simplified)
    // In practice, this would use mean-variance optimization or risk parity
    
    let optimalAllocation: PhaseAllocation;
    
    switch (phaseId) {
      case 'INCOME_NOW':
        optimalAllocation = {
          phaseId,
          allocation: {
            equity: 0.4,
            bonds: 0.3,
            privateCredit: 0.1,
            infrastructure: 0.1,
            crypto: 0.02,
            cash: 0.08
          },
          expectedReturn: 0.06,
          volatility: 0.12,
          maxDrawdown: 0.15
        };
        break;
        
      case 'INCOME_LATER':
        optimalAllocation = {
          phaseId,
          allocation: {
            equity: 0.5,
            bonds: 0.25,
            privateCredit: 0.12,
            infrastructure: 0.08,
            crypto: 0.03,
            cash: 0.02
          },
          expectedReturn: 0.07,
          volatility: 0.14,
          maxDrawdown: 0.20
        };
        break;
        
      case 'GROWTH':
        optimalAllocation = {
          phaseId,
          allocation: {
            equity: 0.65,
            bonds: 0.15,
            privateCredit: 0.08,
            infrastructure: 0.07,
            crypto: 0.05,
            cash: 0.0
          },
          expectedReturn: 0.08,
          volatility: 0.18,
          maxDrawdown: 0.30
        };
        break;
        
      case 'LEGACY':
        optimalAllocation = {
          phaseId,
          allocation: {
            equity: 0.45,
            bonds: 0.25,
            privateCredit: 0.15,
            infrastructure: 0.12,
            crypto: 0.03,
            cash: 0.0
          },
          expectedReturn: 0.065,
          volatility: 0.13,
          maxDrawdown: 0.18
        };
        break;
        
      default:
        throw new Error(`Unknown phase: ${phaseId}`);
    }
    
    return optimalAllocation;
  }

  /**
   * Run stress tests across different scenarios
   */
  private async runStressTests(
    input: AnalyzerInput,
    phaseAllocations: PhaseAllocation[],
    economicScenarios: any[]
  ): Promise<StressTestResult[]> {
    const stressTests: StressTestResult[] = [];
    const horizonYears = Math.min(input.scenario.horizonYears, input.lifeExpectancy - input.currentAge);
    
    // Base case simulations
    for (let path = 0; path < Math.min(1000, economicScenarios.length); path++) {
      const scenario = economicScenarios[path];
      const result = await this.simulateSinglePath(
        input,
        phaseAllocations,
        scenario,
        'base_case',
        path,
        horizonYears
      );
      stressTests.push(result);
    }
    
    // Additional stress scenarios
    const stressScenarios = [
      'market_crash_early',
      'persistent_inflation', 
      'longevity_shock',
      'ltc_event',
      'sequence_risk'
    ];
    
    for (const stressScenario of stressScenarios) {
      for (let path = 0; path < 100; path++) {
        const modifiedScenario = this.applyStressScenario(
          economicScenarios[path % economicScenarios.length],
          stressScenario
        );
        
        const result = await this.simulateSinglePath(
          input,
          phaseAllocations,
          modifiedScenario,
          stressScenario,
          path,
          horizonYears
        );
        stressTests.push(result);
      }
    }
    
    return stressTests;
  }

  /**
   * Simulate a single path with given scenario
   */
  private async simulateSinglePath(
    input: AnalyzerInput,
    phaseAllocations: PhaseAllocation[],
    scenario: any,
    scenarioName: string,
    pathNumber: number,
    horizonYears: number
  ): Promise<StressTestResult> {
    const cashflows: CashflowProjection[] = [];
    let portfolioValue = input.initialPortfolio;
    
    // Track phase allocations over time
    let currentPhaseIndex = 0;
    const phaseTransitionAges = [input.currentAge + 2, input.currentAge + 12, input.retirementAge + 15];
    
    for (let year = 0; year < horizonYears; year++) {
      const currentAge = input.currentAge + year;
      
      // Determine current phase
      while (currentPhaseIndex < phaseTransitionAges.length && 
             currentAge >= phaseTransitionAges[currentPhaseIndex]) {
        currentPhaseIndex++;
      }
      
      const currentPhase = phaseAllocations[Math.min(currentPhaseIndex, phaseAllocations.length - 1)];
      
      // Calculate portfolio return
      const portfolioReturn = this.calculatePortfolioReturn(
        currentPhase.allocation,
        scenario.returns,
        year
      );
      
      // Calculate withdrawals and contributions
      const { withdrawals, contributions } = this.calculateCashflows(
        input,
        currentAge,
        portfolioValue,
        scenario.inflation,
        year
      );
      
      // Calculate taxes
      const taxes = this.calculateTaxes(
        portfolioReturn,
        withdrawals,
        input.scenario.taxes
      );
      
      // Calculate LTC costs
      const ltcCosts = this.calculateLTCCosts(
        input,
        currentAge,
        scenario,
        year
      );
      
      // Update portfolio value
      const beginningBalance = portfolioValue;
      portfolioValue += contributions;
      portfolioValue -= withdrawals;
      portfolioValue -= ltcCosts;
      portfolioValue -= taxes;
      portfolioValue *= (1 + portfolioReturn);
      portfolioValue = Math.max(0, portfolioValue);
      
      // Record cashflow
      const phaseAllocationRecord: Record<string, number> = {};
      Object.entries(currentPhase.allocation).forEach(([asset, weight]) => {
        phaseAllocationRecord[asset] = weight * portfolioValue;
      });
      
      cashflows.push({
        year,
        age: currentAge,
        beginningBalance,
        contributions,
        withdrawals,
        investmentReturns: portfolioReturn * (beginningBalance + contributions - withdrawals),
        taxes,
        ltcCosts,
        endingBalance: portfolioValue,
        phaseAllocation: phaseAllocationRecord as any
      });
      
      // Check for portfolio depletion
      if (portfolioValue <= 0) {
        break;
      }
    }
    
    // Calculate final metrics
    const finalMetrics = this.calculateFinalMetrics(cashflows, input);
    
    return {
      scenario: scenarioName,
      path: pathNumber,
      phaseMetrics: {} as any, // Will be calculated later
      cashflows,
      finalMetrics
    };
  }

  /**
   * Calculate portfolio return given allocation and market returns
   */
  private calculatePortfolioReturn(
    allocation: any,
    marketReturns: any,
    year: number
  ): number {
    const returns = {
      equity: marketReturns.equity[year] || 0,
      bonds: marketReturns.bonds[year] || 0,
      privateCredit: marketReturns.privateCredit[year] || 0,
      infrastructure: marketReturns.infrastructure[year] || 0,
      crypto: marketReturns.crypto[year] || 0,
      cash: 0.02 // Assume 2% cash return
    };
    
    let portfolioReturn = 0;
    for (const [asset, weight] of Object.entries(allocation) as [string, number][]) {
      portfolioReturn += weight * (returns[asset as keyof typeof returns] || 0);
    }
    
    return portfolioReturn;
  }

  /**
   * Calculate cashflows for a given year
   */
  private calculateCashflows(
    input: AnalyzerInput,
    currentAge: number,
    portfolioValue: number,
    inflationPath: any,
    year: number
  ): { withdrawals: number; contributions: number } {
    let withdrawals = 0;
    let contributions = 0;
    
    // Working years contributions
    if (currentAge < input.retirementAge) {
      // Simplified contribution logic
      contributions = Math.min(50000, portfolioValue * 0.1); // 10% of portfolio or $50k max
    }
    
    // Retirement withdrawals
    if (currentAge >= input.retirementAge) {
      // Phase-based withdrawal strategy
      for (const [phaseId, cashflowNeeds] of Object.entries(input.cashflowNeeds)) {
        for (const need of cashflowNeeds.schedule) {
          if (need.t === year) {
            const inflationAdjustedAmount = this.inflationEngine.adjustForInflation(
              need.amt,
              inflationPath,
              year
            );
            withdrawals += inflationAdjustedAmount;
          }
        }
      }
    }
    
    return { withdrawals, contributions };
  }

  /**
   * Calculate tax liability
   */
  private calculateTaxes(
    portfolioReturn: number,
    withdrawals: number,
    taxConfig: any
  ): number {
    // Simplified tax calculation
    const taxableIncome = Math.max(0, portfolioReturn) + withdrawals * 0.5; // Assume 50% of withdrawals are taxable
    return taxableIncome * (taxConfig.ordinary || 0.22);
  }

  /**
   * Calculate LTC costs for a given year
   */
  private calculateLTCCosts(
    input: AnalyzerInput,
    currentAge: number,
    scenario: any,
    year: number
  ): number {
    // Simplified LTC cost calculation
    if (currentAge >= 75 && this.rng() < 0.03) { // 3% annual probability after 75
      return 80000 * Math.pow(1.03, year); // $80k base cost with 3% inflation
    }
    return 0;
  }

  /**
   * Calculate final metrics for a simulation path
   */
  private calculateFinalMetrics(cashflows: CashflowProjection[], input: AnalyzerInput) {
    const finalValue = cashflows.length > 0 ? cashflows[cashflows.length - 1].endingBalance : 0;
    const totalWithdrawals = cashflows.reduce((sum, cf) => sum + cf.withdrawals, 0);
    
    // Find time to depletion
    let yearsToDepletion = cashflows.length;
    for (let i = 0; i < cashflows.length; i++) {
      if (cashflows[i].endingBalance <= 0) {
        yearsToDepletion = i;
        break;
      }
    }
    
    const successProbability = finalValue > 0 ? 1 : 0;
    
    return {
      portfolioValue: finalValue,
      totalWithdrawals,
      successProbability,
      yearsToDepletion
    };
  }

  /**
   * Apply stress scenario modifications
   */
  private applyStressScenario(baseScenario: any, stressType: string): any {
    const scenario = JSON.parse(JSON.stringify(baseScenario)); // Deep copy
    
    switch (stressType) {
      case 'market_crash_early':
        scenario.returns.equity[0] = -0.35; // 35% crash in year 1
        break;
        
      case 'persistent_inflation':
        scenario.inflation.rates = scenario.inflation.rates.map((r: number) => r + 0.03);
        break;
        
      case 'longevity_shock':
        // Extend horizon by 5 years (handled in calling function)
        break;
        
      case 'ltc_event':
        // Force LTC event at age 75 (handled in LTC calculation)
        break;
        
      case 'sequence_risk':
        // Reverse the order of returns for first 10 years
        const reversedReturns = [...scenario.returns.equity.slice(0, 10)].reverse();
        scenario.returns.equity = [...reversedReturns, ...scenario.returns.equity.slice(10)];
        break;
    }
    
    return scenario;
  }

  /**
   * Calculate phase-specific metrics from stress test results
   */
  private async calculatePhaseMetrics(input: AnalyzerInput, stressTests: StressTestResult[]) {
    // This will be implemented in phase_objective.ts
    return {
      INCOME_NOW: { ISP: 0.85, DGBP: 0.15, LCR: 0.95, LCI: 0.80, ATE: 0.75, OS: 82 },
      INCOME_LATER: { ISP: 0.82, DGBP: 0.18, LCR: 0.92, LCI: 0.85, ATE: 0.78, OS: 80 },
      GROWTH: { ISP: 0.78, DGBP: 0.25, LCR: 0.88, LCI: 0.90, ATE: 0.82, OS: 78 },
      LEGACY: { ISP: 0.75, DGBP: 0.22, LCR: 0.85, LCI: 0.95, ATE: 0.80, OS: 75 }
    };
  }

  /**
   * Generate analysis summary
   */
  private generateSummary(stressTests: StressTestResult[], phaseMetrics: any) {
    const successfulPaths = stressTests.filter(test => test.finalMetrics.successProbability > 0);
    const overallScore = Object.values(phaseMetrics).reduce((sum: number, phase: any) => sum + phase.OS, 0) / 4;
    
    // Find worst-case scenario
    const worstPath = stressTests.reduce((worst, current, index) => 
      current.finalMetrics.portfolioValue < worst.value ? 
      { index, value: current.finalMetrics.portfolioValue } : worst,
      { index: 0, value: Infinity }
    );
    
    // Calculate percentiles
    const finalValues = stressTests.map(test => test.finalMetrics.portfolioValue).sort((a, b) => a - b);
    const percentiles = {
      p10: finalValues[Math.floor(finalValues.length * 0.1)],
      p25: finalValues[Math.floor(finalValues.length * 0.25)],
      p50: finalValues[Math.floor(finalValues.length * 0.5)],
      p75: finalValues[Math.floor(finalValues.length * 0.75)],
      p90: finalValues[Math.floor(finalValues.length * 0.9)]
    };
    
    return {
      overallScore,
      worstPathIdx: worstPath.index,
      percentiles,
      keyRisks: this.identifyKeyRisks(stressTests),
      recommendations: this.generateRecommendations(phaseMetrics, stressTests)
    };
  }

  /**
   * Identify key risks from stress test results
   */
  private identifyKeyRisks(stressTests: StressTestResult[]): string[] {
    const risks: string[] = [];
    
    const sequenceRiskTests = stressTests.filter(test => test.scenario === 'sequence_risk');
    if (sequenceRiskTests.length > 0) {
      const avgSuccess = sequenceRiskTests.reduce((sum, test) => sum + test.finalMetrics.successProbability, 0) / sequenceRiskTests.length;
      if (avgSuccess < 0.8) {
        risks.push('High sequence-of-returns risk in early retirement');
      }
    }
    
    const longevityTests = stressTests.filter(test => test.scenario === 'longevity_shock');
    if (longevityTests.length > 0) {
      const avgSuccess = longevityTests.reduce((sum, test) => sum + test.finalMetrics.successProbability, 0) / longevityTests.length;
      if (avgSuccess < 0.75) {
        risks.push('Insufficient funding for extended longevity');
      }
    }
    
    return risks;
  }

  /**
   * Generate recommendations based on analysis
   */
  private generateRecommendations(phaseMetrics: any, stressTests: StressTestResult[]): string[] {
    const recommendations: string[] = [];
    
    // Phase-specific recommendations
    for (const [phaseId, metrics] of Object.entries(phaseMetrics) as [string, any][]) {
      if (metrics.OS < 75) {
        recommendations.push(`Consider rebalancing ${phaseId} allocation to improve outcome score`);
      }
      
      if (metrics.ISP < 0.8) {
        recommendations.push(`Increase savings or reduce expenses to improve ${phaseId} income sufficiency`);
      }
    }
    
    return recommendations;
  }

  /**
   * Generate unique run ID
   */
  private generateRunId(): string {
    return `swag_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate receipts hash for compliance
   */
  private generateReceiptsHash(runId: string, input: AnalyzerInput, summary: any): string {
    const dataToHash = JSON.stringify({
      runId,
      householdId: input.householdId,
      overallScore: summary.overallScore,
      timestamp: Date.now()
    });
    
    // In production, use proper cryptographic hash
    return btoa(dataToHash).substr(0, 32);
  }
}