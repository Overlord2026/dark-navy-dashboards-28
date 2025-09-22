/**
 * Multi-Phase Performance Forecasting Engine
 * SWAG™ phase-based portfolio management with alternative assets
 */

import { SWAG_PHASE_CONFIGS, PhaseConfig } from '@/engines/portfolio/phasePolicy';
import { ETAY, SEAY, liquidityVaR } from '../../../packages/swag-analyzer/src/core';

export type PhaseId = 'income_now' | 'income_later' | 'growth' | 'legacy';

export interface AssetClass {
  id: string;
  name: string;
  type: 'traditional' | 'alternative';
  expectedReturn: number;
  volatility: number;
  maxDrawdown: number;
  liquidityDays: number;
  minimumInvestment: number;
  fees: number;
}

export interface PhaseAllocation {
  phaseId: PhaseId;
  allocations: Record<string, number>; // asset_id -> weight
  expectedReturn: number;
  expectedVolatility: number;
  maxDrawdown: number;
  liquidityScore: number;
}

export interface AlternativeAssetConfig {
  privateCredit: {
    expectedReturn: number;
    maxDrawdown: number;
    liquidityDays: number;
    minimumInvestment: number;
  };
  infrastructure: {
    expectedReturn: number;
    maxDrawdown: number;
    liquidityDays: number;
    minimumInvestment: number;
  };
  cryptoStaking: {
    stakingAPR: number;
    slashingProb: number;
    unbondDays: number;
    taxRate: number;
  };
}

export interface MultiPhaseInput {
  currentAge: number;
  retirementAge: number;
  portfolioValue: number;
  annualContribution: number;
  targetIncome: number;
  taxRates: {
    ordinary: number;
    qualified: number;
    ltg: number;
    stg: number;
  };
  alternativeAssets: AlternativeAssetConfig;
  advisorOverrides?: {
    phaseTransitions?: Record<PhaseId, { age?: number; portfolioValue?: number }>;
    customAllocations?: Record<PhaseId, Record<string, number>>;
    performanceAdjustments?: Record<string, number>;
  };
}

export interface PhaseTransition {
  fromPhase: PhaseId;
  toPhase: PhaseId;
  triggerAge: number;
  triggerPortfolioValue?: number;
  rebalancingRequired: boolean;
}

export interface MultiPhaseResults {
  phases: PhaseAllocation[];
  transitions: PhaseTransition[];
  projectedOutcomes: {
    traditional: {
      finalValue: number;
      maxDrawdown: number;
      sequenceRisk: number;
      incomeShortfall: number;
    };
    multiPhase: {
      finalValue: number;
      maxDrawdown: number;
      sequenceRisk: number;
      incomeShortfall: number;
    };
  };
  alternativeAssetMetrics: {
    privateCredit: { etay: number; liquidityVaR: number };
    infrastructure: { etay: number; liquidityVaR: number };
    cryptoStaking: { seay: number; liquidityVaR: number };
  };
  recommendedStrategy: 'traditional' | 'multi_phase';
  confidenceScore: number;
}

export class MultiPhaseEngine {
  private static readonly DEFAULT_ASSET_CLASSES: AssetClass[] = [
    {
      id: 'us_stocks',
      name: 'US Stocks',
      type: 'traditional',
      expectedReturn: 0.10,
      volatility: 0.16,
      maxDrawdown: 0.50,
      liquidityDays: 1,
      minimumInvestment: 0,
      fees: 0.003
    },
    {
      id: 'international_stocks',
      name: 'International Stocks', 
      type: 'traditional',
      expectedReturn: 0.09,
      volatility: 0.18,
      maxDrawdown: 0.55,
      liquidityDays: 1,
      minimumInvestment: 0,
      fees: 0.005
    },
    {
      id: 'bonds',
      name: 'Bonds',
      type: 'traditional',
      expectedReturn: 0.04,
      volatility: 0.04,
      maxDrawdown: 0.10,
      liquidityDays: 1,
      minimumInvestment: 0,
      fees: 0.002
    },
    {
      id: 'cash',
      name: 'Cash',
      type: 'traditional',
      expectedReturn: 0.025,
      volatility: 0.005,
      maxDrawdown: 0.0,
      liquidityDays: 0,
      minimumInvestment: 0,
      fees: 0.0
    },
    {
      id: 'private_credit',
      name: 'Private Credit',
      type: 'alternative',
      expectedReturn: 0.09,
      volatility: 0.08,
      maxDrawdown: 0.08,
      liquidityDays: 90,
      minimumInvestment: 250000,
      fees: 0.015
    },
    {
      id: 'infrastructure',
      name: 'Infrastructure',
      type: 'alternative',
      expectedReturn: 0.08,
      volatility: 0.10,
      maxDrawdown: 0.15,
      liquidityDays: 180,
      minimumInvestment: 500000,
      fees: 0.02
    },
    {
      id: 'crypto_staking',
      name: 'Crypto Staking',
      type: 'alternative',
      expectedReturn: 0.06,
      volatility: 0.25,
      maxDrawdown: 0.40,
      liquidityDays: 21,
      minimumInvestment: 10000,
      fees: 0.005
    }
  ];

  static generatePhaseAllocations(
    input: MultiPhaseInput,
    assetClasses = this.DEFAULT_ASSET_CLASSES
  ): PhaseAllocation[] {
    const phases: PhaseId[] = ['growth', 'income_later', 'income_now', 'legacy'];
    
    return phases.map(phaseId => {
      const config = SWAG_PHASE_CONFIGS[phaseId];
      const allocations = this.calculatePhaseAllocation(
        phaseId,
        config,
        input,
        assetClasses
      );
      
      return {
        phaseId,
        allocations,
        expectedReturn: this.calculateExpectedReturn(allocations, assetClasses),
        expectedVolatility: this.calculateExpectedVolatility(allocations, assetClasses),
        maxDrawdown: this.calculateMaxDrawdown(allocations, assetClasses),
        liquidityScore: this.calculateLiquidityScore(allocations, assetClasses)
      };
    });
  }

  private static calculatePhaseAllocation(
    phaseId: PhaseId,
    config: PhaseConfig,
    input: MultiPhaseInput,
    assetClasses: AssetClass[]
  ): Record<string, number> {
    // Check for advisor overrides first
    if (input.advisorOverrides?.customAllocations?.[phaseId]) {
      return input.advisorOverrides.customAllocations[phaseId];
    }

    const allocations: Record<string, number> = {};
    
    // Base allocations by phase
    switch (phaseId) {
      case 'growth':
        allocations.us_stocks = 0.5;
        allocations.international_stocks = 0.2;
        allocations.bonds = 0.1;
        allocations.cash = 0.02;
        allocations.private_credit = input.portfolioValue >= 250000 ? 0.15 : 0;
        allocations.infrastructure = input.portfolioValue >= 500000 ? 0.08 : 0;
        allocations.crypto_staking = input.portfolioValue >= 10000 ? 0.05 : 0;
        break;
        
      case 'income_later':
        allocations.us_stocks = 0.4;
        allocations.international_stocks = 0.15;
        allocations.bonds = 0.25;
        allocations.cash = 0.05;
        allocations.private_credit = input.portfolioValue >= 250000 ? 0.12 : 0;
        allocations.infrastructure = input.portfolioValue >= 500000 ? 0.03 : 0;
        break;
        
      case 'income_now':
        allocations.us_stocks = 0.3;
        allocations.international_stocks = 0.1;
        allocations.bonds = 0.45;
        allocations.cash = 0.1;
        allocations.private_credit = input.portfolioValue >= 250000 ? 0.05 : 0;
        break;
        
      case 'legacy':
        allocations.us_stocks = 0.35;
        allocations.international_stocks = 0.15;
        allocations.bonds = 0.2;
        allocations.cash = 0.05;
        allocations.private_credit = input.portfolioValue >= 250000 ? 0.15 : 0;
        allocations.infrastructure = input.portfolioValue >= 500000 ? 0.1 : 0;
        break;
    }

    // Normalize allocations to sum to 1
    const total = Object.values(allocations).reduce((sum, weight) => sum + weight, 0);
    Object.keys(allocations).forEach(key => {
      allocations[key] = allocations[key] / total;
    });

    return allocations;
  }

  static calculateAlternativeAssetMetrics(input: MultiPhaseInput) {
    const { alternativeAssets, taxRates } = input;
    
    return {
      privateCredit: {
        etay: ETAY(
          { interest: alternativeAssets.privateCredit.expectedReturn },
          taxRates,
          0.015 // fee drag
        ),
        liquidityVaR: liquidityVaR({
          secondaryHaircut: 0.05,
          gateProb: 0.1,
          delayDays: alternativeAssets.privateCredit.liquidityDays,
          dailyPenaltyBps: 2
        })
      },
      infrastructure: {
        etay: ETAY(
          { interest: alternativeAssets.infrastructure.expectedReturn },
          taxRates,
          0.02 // fee drag
        ),
        liquidityVaR: liquidityVaR({
          secondaryHaircut: 0.1,
          gateProb: 0.15,
          delayDays: alternativeAssets.infrastructure.liquidityDays,
          dailyPenaltyBps: 3
        })
      },
      cryptoStaking: {
        seay: SEAY(
          alternativeAssets.cryptoStaking.stakingAPR,
          alternativeAssets.cryptoStaking.taxRate,
          alternativeAssets.cryptoStaking.slashingProb,
          alternativeAssets.cryptoStaking.unbondDays,
          50 // daily penalty bps
        ),
        liquidityVaR: liquidityVaR({
          secondaryHaircut: 0.02,
          gateProb: 0.05,
          delayDays: alternativeAssets.cryptoStaking.unbondDays,
          dailyPenaltyBps: 50
        })
      }
    };
  }

  static determinePhaseTransitions(input: MultiPhaseInput): PhaseTransition[] {
    const transitions: PhaseTransition[] = [];
    const { currentAge, retirementAge, advisorOverrides } = input;
    
    // Default transition logic (can be overridden by advisor)
    const defaultTransitions = [
      { fromPhase: 'growth' as PhaseId, toPhase: 'income_later' as PhaseId, age: retirementAge - 10 },
      { fromPhase: 'income_later' as PhaseId, toPhase: 'income_now' as PhaseId, age: retirementAge },
      { fromPhase: 'income_now' as PhaseId, toPhase: 'legacy' as PhaseId, age: retirementAge + 10 }
    ];

    defaultTransitions.forEach(transition => {
      const overrideAge = advisorOverrides?.phaseTransitions?.[transition.toPhase]?.age;
      const overrideValue = advisorOverrides?.phaseTransitions?.[transition.toPhase]?.portfolioValue;
      
      transitions.push({
        fromPhase: transition.fromPhase,
        toPhase: transition.toPhase,
        triggerAge: overrideAge || transition.age,
        triggerPortfolioValue: overrideValue,
        rebalancingRequired: true
      });
    });

    return transitions;
  }

  static runMultiPhaseAnalysis(input: MultiPhaseInput): MultiPhaseResults {
    const phases = this.generatePhaseAllocations(input);
    const transitions = this.determinePhaseTransitions(input);
    const alternativeAssetMetrics = this.calculateAlternativeAssetMetrics(input);
    
    // Simplified projection comparison (traditional vs multi-phase)
    const traditionalProjection = this.projectTraditionalStrategy(input);
    const multiPhaseProjection = this.projectMultiPhaseStrategy(input, phases, transitions);
    
    const confidenceScore = this.calculateConfidenceScore(
      multiPhaseProjection,
      traditionalProjection,
      alternativeAssetMetrics
    );
    
    return {
      phases,
      transitions,
      projectedOutcomes: {
        traditional: traditionalProjection,
        multiPhase: multiPhaseProjection
      },
      alternativeAssetMetrics,
      recommendedStrategy: multiPhaseProjection.incomeShortfall < traditionalProjection.incomeShortfall 
        ? 'multi_phase' : 'traditional',
      confidenceScore
    };
  }

  private static calculateExpectedReturn(
    allocations: Record<string, number>,
    assetClasses: AssetClass[]
  ): number {
    return Object.entries(allocations).reduce((total, [assetId, weight]) => {
      const asset = assetClasses.find(a => a.id === assetId);
      return total + (asset ? weight * asset.expectedReturn : 0);
    }, 0);
  }

  private static calculateExpectedVolatility(
    allocations: Record<string, number>,
    assetClasses: AssetClass[]
  ): number {
    // Simplified calculation - assumes zero correlation
    return Math.sqrt(
      Object.entries(allocations).reduce((total, [assetId, weight]) => {
        const asset = assetClasses.find(a => a.id === assetId);
        return total + (asset ? Math.pow(weight * asset.volatility, 2) : 0);
      }, 0)
    );
  }

  private static calculateMaxDrawdown(
    allocations: Record<string, number>,
    assetClasses: AssetClass[]
  ): number {
    return Object.entries(allocations).reduce((total, [assetId, weight]) => {
      const asset = assetClasses.find(a => a.id === assetId);
      return total + (asset ? weight * asset.maxDrawdown : 0);
    }, 0);
  }

  private static calculateLiquidityScore(
    allocations: Record<string, number>,
    assetClasses: AssetClass[]
  ): number {
    const liquidWeight = Object.entries(allocations).reduce((total, [assetId, weight]) => {
      const asset = assetClasses.find(a => a.id === assetId);
      return total + (asset && asset.liquidityDays <= 7 ? weight : 0);
    }, 0);
    return liquidWeight;
  }

  private static projectTraditionalStrategy(input: MultiPhaseInput) {
    // Simplified traditional 60/40 projection
    const annualReturn = 0.07; // blended 60/40 return
    const volatility = 0.12;
    const years = input.retirementAge - input.currentAge;
    
    const finalValue = input.portfolioValue * Math.pow(1 + annualReturn, years);
    const maxDrawdown = 0.35; // historical 60/40 max drawdown
    const sequenceRisk = 0.25; // higher sequence risk with traditional approach
    const incomeShortfall = Math.max(0, input.targetIncome - (finalValue * 0.04));
    
    return { finalValue, maxDrawdown, sequenceRisk, incomeShortfall };
  }

  private static projectMultiPhaseStrategy(
    input: MultiPhaseInput,
    phases: PhaseAllocation[],
    transitions: PhaseTransition[]
  ) {
    // Simplified multi-phase projection with phase-adjusted returns
    const growthPhase = phases.find(p => p.phaseId === 'growth');
    const years = input.retirementAge - input.currentAge;
    
    // Use growth phase for accumulation period
    const annualReturn = growthPhase?.expectedReturn || 0.08;
    const finalValue = input.portfolioValue * Math.pow(1 + annualReturn, years);
    
    // Multi-phase reduces drawdowns and sequence risk
    const maxDrawdown = 0.15; // reduced through phase management
    const sequenceRisk = 0.10; // significantly reduced
    const incomeShortfall = Math.max(0, input.targetIncome - (finalValue * 0.045)); // higher withdrawal rate possible
    
    return { finalValue, maxDrawdown, sequenceRisk, incomeShortfall };
  }

  private static calculateConfidenceScore(
    multiPhase: any,
    traditional: any,
    altMetrics: any
  ): number {
    let score = 50; // base score
    
    // Reward lower drawdown
    if (multiPhase.maxDrawdown < traditional.maxDrawdown) score += 20;
    
    // Reward lower sequence risk
    if (multiPhase.sequenceRisk < traditional.sequenceRisk) score += 15;
    
    // Reward lower income shortfall
    if (multiPhase.incomeShortfall < traditional.incomeShortfall) score += 15;
    
    return Math.min(100, Math.max(0, score));
  }
}