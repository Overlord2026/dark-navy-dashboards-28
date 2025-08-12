/**
 * Bootstrap Engine - Block bootstrap for sequence-of-returns risk
 */

import { ScenarioConfig } from '../models';
import * as seedrandom from 'seedrandom';

export class BootstrapEngine {
  private rng: seedrandom.PRNG;

  constructor(seed?: string) {
    this.rng = seedrandom(seed || 'bootstrap_default');
  }

  /**
   * Generate bootstrap return sequences to capture sequence-of-returns risk
   */
  generateBootstrapSequences(
    historicalReturns: number[],
    nSequences: number,
    sequenceLength: number,
    blockLength: number = 12
  ): number[][] {
    const sequences: number[][] = [];
    
    for (let seq = 0; seq < nSequences; seq++) {
      const sequence = this.generateBlockBootstrapSequence(
        historicalReturns,
        sequenceLength,
        blockLength
      );
      sequences.push(sequence);
    }
    
    return sequences;
  }

  /**
   * Generate single block bootstrap sequence
   * Preserves short-term return correlations by sampling blocks instead of individual returns
   */
  private generateBlockBootstrapSequence(
    historicalReturns: number[],
    targetLength: number,
    blockLength: number
  ): number[] {
    const sequence: number[] = [];
    const maxStartIndex = historicalReturns.length - blockLength;
    
    while (sequence.length < targetLength) {
      // Randomly select a starting point for the block
      const startIndex = Math.floor(this.rng() * maxStartIndex);
      
      // Extract the block
      for (let i = 0; i < blockLength && sequence.length < targetLength; i++) {
        sequence.push(historicalReturns[startIndex + i]);
      }
    }
    
    return sequence.slice(0, targetLength);
  }

  /**
   * Generate bootstrap sequences for multiple asset classes
   */
  generateMultiAssetBootstrap(
    historicalData: {
      equity: number[];
      bonds: number[];
      alternatives: number[];
    },
    config: ScenarioConfig,
    nSequences: number,
    sequenceLength: number
  ): Array<{
    sequence: number;
    equity: number[];
    bonds: number[];
    alternatives: number[];
  }> {
    const { blockLenMonths } = config;
    const results: Array<{
      sequence: number;
      equity: number[];
      bonds: number[];
      alternatives: number[];
    }> = [];
    
    for (let seq = 0; seq < nSequences; seq++) {
      // Generate correlated bootstrap by using same block starting points
      const equity = this.generateCorrelatedBootstrapSequence(
        historicalData.equity,
        sequenceLength,
        blockLenMonths
      );
      
      const bonds = this.generateCorrelatedBootstrapSequence(
        historicalData.bonds,
        sequenceLength,
        blockLenMonths,
        equity.blockIndices // Use same block structure
      );
      
      const alternatives = this.generateCorrelatedBootstrapSequence(
        historicalData.alternatives,
        sequenceLength,
        blockLenMonths,
        equity.blockIndices
      );
      
      results.push({
        sequence: seq,
        equity: equity.returns,
        bonds: bonds.returns,
        alternatives: alternatives.returns
      });
    }
    
    return results;
  }

  /**
   * Generate correlated bootstrap sequence maintaining cross-asset correlations
   */
  private generateCorrelatedBootstrapSequence(
    historicalReturns: number[],
    targetLength: number,
    blockLength: number,
    predefinedBlocks?: number[]
  ): { returns: number[]; blockIndices: number[] } {
    const returns: number[] = [];
    const blockIndices: number[] = [];
    const maxStartIndex = historicalReturns.length - blockLength;
    
    let blockIndex = 0;
    
    while (returns.length < targetLength) {
      let startIndex: number;
      
      if (predefinedBlocks && blockIndex < predefinedBlocks.length) {
        // Use predefined block to maintain correlation
        startIndex = predefinedBlocks[blockIndex];
      } else {
        // Generate new random block
        startIndex = Math.floor(this.rng() * maxStartIndex);
        blockIndices.push(startIndex);
      }
      
      // Extract the block
      for (let i = 0; i < blockLength && returns.length < targetLength; i++) {
        const returnIndex = (startIndex + i) % historicalReturns.length;
        returns.push(historicalReturns[returnIndex]);
      }
      
      blockIndex++;
    }
    
    return {
      returns: returns.slice(0, targetLength),
      blockIndices: predefinedBlocks || blockIndices
    };
  }

  /**
   * Generate stress test bootstrap focusing on crisis periods
   */
  generateCrisisBootstrap(
    historicalReturns: number[],
    crisisPeriods: Array<{ start: number; end: number }>,
    nSequences: number,
    sequenceLength: number,
    crisisWeight: number = 0.3 // 30% of blocks from crisis periods
  ): number[][] {
    const sequences: number[][] = [];
    
    for (let seq = 0; seq < nSequences; seq++) {
      const sequence: number[] = [];
      
      while (sequence.length < sequenceLength) {
        let blockReturns: number[];
        
        if (this.rng() < crisisWeight && crisisPeriods.length > 0) {
          // Sample from crisis period
          blockReturns = this.sampleCrisisBlock(historicalReturns, crisisPeriods);
        } else {
          // Sample from normal periods
          blockReturns = this.sampleNormalBlock(historicalReturns, crisisPeriods);
        }
        
        // Add block to sequence
        for (const ret of blockReturns) {
          if (sequence.length < sequenceLength) {
            sequence.push(ret);
          }
        }
      }
      
      sequences.push(sequence);
    }
    
    return sequences;
  }

  /**
   * Sample block from crisis periods
   */
  private sampleCrisisBlock(
    historicalReturns: number[],
    crisisPeriods: Array<{ start: number; end: number }>
  ): number[] {
    const period = crisisPeriods[Math.floor(this.rng() * crisisPeriods.length)];
    const blockLength = Math.min(12, period.end - period.start); // Max 12 months
    const startIndex = period.start + Math.floor(this.rng() * (period.end - period.start - blockLength));
    
    return historicalReturns.slice(startIndex, startIndex + blockLength);
  }

  /**
   * Sample block from non-crisis periods
   */
  private sampleNormalBlock(
    historicalReturns: number[],
    crisisPeriods: Array<{ start: number; end: number }>
  ): number[] {
    const blockLength = 12;
    let attempts = 0;
    const maxAttempts = 100;
    
    while (attempts < maxAttempts) {
      const startIndex = Math.floor(this.rng() * (historicalReturns.length - blockLength));
      const endIndex = startIndex + blockLength;
      
      // Check if block overlaps with any crisis period
      const inCrisis = crisisPeriods.some(period => 
        (startIndex >= period.start && startIndex <= period.end) ||
        (endIndex >= period.start && endIndex <= period.end)
      );
      
      if (!inCrisis) {
        return historicalReturns.slice(startIndex, endIndex);
      }
      
      attempts++;
    }
    
    // Fallback: return random block
    const startIndex = Math.floor(this.rng() * (historicalReturns.length - blockLength));
    return historicalReturns.slice(startIndex, startIndex + blockLength);
  }

  /**
   * Calculate sequence-of-returns risk metrics
   */
  analyzeSequenceRisk(
    portfolioReturns: number[],
    withdrawalRate: number,
    initialValue: number
  ): {
    finalValue: number;
    timeToDepletion: number | null;
    maxDrawdown: number;
    withdrawalsSustained: number;
  } {
    let portfolioValue = initialValue;
    const annualWithdrawal = initialValue * withdrawalRate;
    let maxValue = initialValue;
    let maxDrawdown = 0;
    let timeToDepletion: number | null = null;
    let withdrawalsSustained = 0;
    
    for (let year = 0; year < portfolioReturns.length; year++) {
      // Beginning of year withdrawal
      portfolioValue -= annualWithdrawal;
      withdrawalsSustained++;
      
      if (portfolioValue <= 0) {
        timeToDepletion = year;
        break;
      }
      
      // Investment return
      portfolioValue *= (1 + portfolioReturns[year]);
      
      // Track drawdown
      maxValue = Math.max(maxValue, portfolioValue);
      const currentDrawdown = (maxValue - portfolioValue) / maxValue;
      maxDrawdown = Math.max(maxDrawdown, currentDrawdown);
    }
    
    return {
      finalValue: Math.max(0, portfolioValue),
      timeToDepletion,
      maxDrawdown,
      withdrawalsSustained
    };
  }

  /**
   * Generate return scenarios with different sequence-of-returns patterns
   */
  generateSequenceScenarios(
    baseReturns: number[],
    nYears: number
  ): {
    favorable: number[];    // Good returns early
    unfavorable: number[];  // Poor returns early
    volatile: number[];     // High volatility throughout
    recovery: number[];     // Crash followed by recovery
  } {
    const sortedReturns = [...baseReturns].sort((a, b) => b - a);
    const midpoint = Math.floor(nYears / 2);
    
    // Favorable: Best returns first
    const favorable = [
      ...sortedReturns.slice(0, midpoint),
      ...sortedReturns.slice(midpoint).reverse()
    ].slice(0, nYears);
    
    // Unfavorable: Worst returns first
    const unfavorable = [...favorable].reverse();
    
    // Volatile: Alternate between high and low returns
    const volatile: number[] = [];
    const highs = sortedReturns.slice(0, Math.floor(baseReturns.length / 2));
    const lows = sortedReturns.slice(Math.floor(baseReturns.length / 2));
    
    for (let i = 0; i < nYears; i++) {
      if (i % 2 === 0) {
        volatile.push(highs[i % highs.length]);
      } else {
        volatile.push(lows[i % lows.length]);
      }
    }
    
    // Recovery: Large negative return followed by strong recovery
    const recovery = [...baseReturns];
    recovery[0] = -0.35; // 35% crash
    recovery[1] = 0.25;  // 25% recovery
    recovery[2] = 0.15;  // 15% recovery
    
    return {
      favorable,
      unfavorable,
      volatile,
      recovery
    };
  }
}