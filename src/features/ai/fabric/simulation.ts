/**
 * AI Fabric Simulation Studio
 * Monte Carlo, What-If, and Stress Testing for AI decisions
 */

import { reason } from './reasoning';
import { emitEvent } from './events';
import { recordReceipt } from '@/features/receipts/record';

export type SimulationScenario = {
  id: string;
  name: string;
  description: string;
  parameters: Record<string, any>;
  iterations?: number;
};

export type SimulationResult = {
  scenarioId: string;
  outcomes: Array<{
    iteration: number;
    result: any;
    probability: number;
    confidence: number;
  }>;
  summary: {
    meanOutcome: number;
    standardDeviation: number;
    confidenceInterval: [number, number];
    successRate: number;
  };
  recommendations: string[];
};

export class SimulationStudio {
  async runMonteCarloRetirement(userId: string, params: {
    currentAge: number;
    retirementAge: number;
    currentSavings: number;
    monthlyContribution: number;
    expectedReturn: number;
    inflationRate: number;
    targetIncome: number;
  }): Promise<SimulationResult> {
    
    const iterations = 1000;
    const outcomes = [];
    
    // Log simulation start
    await recordReceipt({
      type: 'Decision-RDS',
      action: 'ai.simulation.start',
      reasons: ['monte_carlo', 'retirement', userId],
      created_at: new Date().toISOString()
    } as any);
    
    // Run Monte Carlo simulation
    for (let i = 0; i < iterations; i++) {
      const yearlyReturn = this.randomNormal(params.expectedReturn, 0.15); // 15% volatility
      const inflation = this.randomNormal(params.inflationRate, 0.02);
      
      const yearsToRetirement = params.retirementAge - params.currentAge;
      let portfolio = params.currentSavings;
      
      // Accumulation phase
      for (let year = 0; year < yearsToRetirement; year++) {
        portfolio *= (1 + yearlyReturn);
        portfolio += params.monthlyContribution * 12;
      }
      
      // Calculate success (can support target income for 30 years)
      const annualIncome = portfolio * 0.04; // 4% rule
      const realIncome = annualIncome / Math.pow(1 + inflation, yearsToRetirement);
      const success = realIncome >= params.targetIncome;
      
      outcomes.push({
        iteration: i,
        result: realIncome,
        probability: success ? 1 : 0,
        confidence: Math.min(1, realIncome / params.targetIncome)
      });
    }
    
    // Calculate summary statistics
    const incomes = outcomes.map(o => o.result);
    const successRate = outcomes.filter(o => o.probability > 0).length / iterations;
    const meanIncome = incomes.reduce((sum, val) => sum + val, 0) / iterations;
    const variance = incomes.reduce((sum, val) => sum + Math.pow(val - meanIncome, 2), 0) / iterations;
    const stdDev = Math.sqrt(variance);
    
    const sortedIncomes = incomes.sort((a, b) => a - b);
    const confidenceInterval: [number, number] = [
      sortedIncomes[Math.floor(iterations * 0.05)],
      sortedIncomes[Math.floor(iterations * 0.95)]
    ];
    
    const recommendations = this.generateRetirementRecommendations(successRate, params);
    
    // Log simulation completion
    await emitEvent({
      type: 'advise.issued',
      actor: userId,
      subject: 'retirement_simulation',
      meta: { successRate, meanIncome, iterations }
    });
    
    return {
      scenarioId: 'retirement_monte_carlo',
      outcomes,
      summary: {
        meanOutcome: meanIncome,
        standardDeviation: stdDev,
        confidenceInterval,
        successRate
      },
      recommendations
    };
  }
  
  async runWhatIfAnalysis(userId: string, baseScenario: any, variations: Array<{
    name: string;
    changes: Record<string, any>;
  }>): Promise<Record<string, SimulationResult>> {
    
    const results: Record<string, SimulationResult> = {};
    
    for (const variation of variations) {
      const scenario = { ...baseScenario, ...variation.changes };
      
      // Run reasoning with modified scenario
      const decision = await reason({
        userId,
        scope: 'what_if_analysis',
        query: `analyze scenario: ${variation.name}`,
        data: scenario
      });
      
      // Stub result - replace with actual scenario analysis
      results[variation.name] = {
        scenarioId: variation.name,
        outcomes: [{
          iteration: 1,
          result: decision.confidence,
          probability: decision.confidence,
          confidence: decision.confidence
        }],
        summary: {
          meanOutcome: decision.confidence,
          standardDeviation: 0.1,
          confidenceInterval: [decision.confidence - 0.1, decision.confidence + 0.1],
          successRate: decision.confidence
        },
        recommendations: decision.reasoning
      };
    }
    
    await recordReceipt({
      type: 'Decision-RDS',
      action: 'ai.simulation.what_if',
      reasons: [userId, `scenarios_${variations.length}`],
      created_at: new Date().toISOString()
    } as any);
    
    return results;
  }
  
  private randomNormal(mean: number, stdDev: number): number {
    // Box-Muller transform for normal distribution
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + z0 * stdDev;
  }
  
  private generateRetirementRecommendations(successRate: number, params: any): string[] {
    const recommendations = [];
    
    if (successRate < 0.7) {
      recommendations.push('Consider increasing monthly contributions');
      recommendations.push('Evaluate more aggressive investment allocation');
      recommendations.push('Consider working 1-2 additional years');
    }
    
    if (successRate > 0.9) {
      recommendations.push('Current plan exceeds retirement goals');
      recommendations.push('Consider early retirement options');
      recommendations.push('Evaluate tax optimization strategies');
    }
    
    return recommendations;
  }
}

export const simulationStudio = new SimulationStudio();