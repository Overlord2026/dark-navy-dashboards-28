/**
 * Longevity Engine - Gompertz-Makeham mortality modeling
 */

import { LongevityProjection, ScenarioConfig } from '../models';
import * as seedrandom from 'seedrandom';

export class LongevityEngine {
  private rng: seedrandom.PRNG;

  constructor(seed?: string) {
    this.rng = seedrandom(seed || 'longevity_default');
  }

  /**
   * Generate longevity projections using Gompertz-Makeham model:
   * μ(x) = A + B*exp(C*x)
   * where μ(x) is mortality rate at age x
   */
  generateLongevityProjection(
    config: ScenarioConfig,
    currentAge: number,
    maxAge: number = 120
  ): LongevityProjection[] {
    const { male, gmA, gmB, gmC } = config.longevity;
    const projections: LongevityProjection[] = [];
    
    let survivalProb = 1.0;
    
    for (let age = currentAge; age <= maxAge; age++) {
      // Gompertz-Makeham mortality rate
      const mortalityRate = this.calculateMortalityRate(age, gmA, gmB, gmC, male);
      
      // Update survival probability
      if (age > currentAge) {
        survivalProb *= (1 - mortalityRate);
      }
      
      // Calculate remaining life expectancy
      const lifeExpectancy = this.calculateLifeExpectancy(age, gmA, gmB, gmC, male, maxAge);
      
      projections.push({
        age,
        survivalProbability: survivalProb,
        mortalityRate,
        lifeExpectancyRemaining: lifeExpectancy
      });
    }
    
    return projections;
  }

  /**
   * Calculate mortality rate using Gompertz-Makeham model
   */
  private calculateMortalityRate(
    age: number,
    A: number,
    B: number,
    C: number,
    isMale: boolean
  ): number {
    // Gender adjustment factors (simplified)
    const genderAdjustment = isMale ? 1.2 : 0.8;
    
    // Gompertz-Makeham formula with background mortality (A) and age-dependent term
    const mortalityRate = A + B * Math.exp(C * age);
    
    return Math.min(mortalityRate * genderAdjustment, 0.99); // Cap at 99%
  }

  /**
   * Calculate remaining life expectancy from current age
   */
  private calculateLifeExpectancy(
    currentAge: number,
    A: number,
    B: number,
    C: number,
    isMale: boolean,
    maxAge: number
  ): number {
    let expectancy = 0;
    let survivalProb = 1.0;
    
    for (let age = currentAge + 1; age <= maxAge; age++) {
      const mortalityRate = this.calculateMortalityRate(age, A, B, C, isMale);
      survivalProb *= (1 - mortalityRate);
      expectancy += survivalProb;
    }
    
    return expectancy;
  }

  /**
   * Generate Monte Carlo longevity paths
   */
  generateLongevityPaths(
    config: ScenarioConfig,
    currentAge: number,
    nPaths: number
  ): Array<{ path: number; deathAge: number; survivedToAge: number[] }> {
    const { gmA, gmB, gmC, male } = config.longevity;
    const paths: Array<{ path: number; deathAge: number; survivedToAge: number[] }> = [];
    
    for (let pathIdx = 0; pathIdx < nPaths; pathIdx++) {
      const survivedToAge: number[] = [];
      let age = currentAge;
      let alive = true;
      
      while (alive && age < 120) {
        const mortalityRate = this.calculateMortalityRate(age, gmA, gmB, gmC, male);
        
        if (this.rng() < mortalityRate) {
          alive = false;
        } else {
          survivedToAge.push(age);
          age++;
        }
      }
      
      paths.push({
        path: pathIdx,
        deathAge: age,
        survivedToAge
      });
    }
    
    return paths;
  }

  /**
   * Calculate joint survival probability for couples
   */
  calculateJointSurvival(
    age1: number,
    age2: number,
    isMale1: boolean,
    isMale2: boolean,
    config: ScenarioConfig,
    yearsAhead: number
  ): {
    bothSurvive: number;
    oneSurvives: number;
    neitherSurvives: number;
  } {
    const { gmA, gmB, gmC } = config.longevity;
    
    let survivalProb1 = 1.0;
    let survivalProb2 = 1.0;
    
    for (let year = 0; year < yearsAhead; year++) {
      const mortality1 = this.calculateMortalityRate(age1 + year, gmA, gmB, gmC, isMale1);
      const mortality2 = this.calculateMortalityRate(age2 + year, gmA, gmB, gmC, isMale2);
      
      survivalProb1 *= (1 - mortality1);
      survivalProb2 *= (1 - mortality2);
    }
    
    const bothSurvive = survivalProb1 * survivalProb2;
    const oneSurvives = survivalProb1 + survivalProb2 - 2 * bothSurvive;
    const neitherSurvives = 1 - survivalProb1 - survivalProb2 + bothSurvive;
    
    return {
      bothSurvive,
      oneSurvives,
      neitherSurvives
    };
  }

  /**
   * Generate longevity stress scenarios
   */
  generateStressScenarios(
    config: ScenarioConfig,
    currentAge: number
  ): {
    base: LongevityProjection[];
    longevity: LongevityProjection[];     // Live longer than expected
    shortLived: LongevityProjection[];    // Shorter than expected
  } {
    const base = this.generateLongevityProjection(config, currentAge);
    
    // Longevity scenario: Reduce mortality rates by 20%
    const longevityConfig = {
      ...config,
      longevity: {
        ...config.longevity,
        gmA: config.longevity.gmA * 0.8,
        gmB: config.longevity.gmB * 0.8
      }
    };
    const longevity = this.generateLongevityProjection(longevityConfig, currentAge);
    
    // Short-lived scenario: Increase mortality rates by 20%
    const shortLivedConfig = {
      ...config,
      longevity: {
        ...config.longevity,
        gmA: config.longevity.gmA * 1.2,
        gmB: config.longevity.gmB * 1.2
      }
    };
    const shortLived = this.generateLongevityProjection(shortLivedConfig, currentAge);
    
    return {
      base,
      longevity,
      shortLived
    };
  }

  /**
   * Calculate Social Security longevity adjustment
   */
  calculateSocialSecurityAdjustment(claimAge: number, fullRetirementAge: number): number {
    if (claimAge < fullRetirementAge) {
      // Early retirement reduction
      const monthsEarly = (fullRetirementAge - claimAge) * 12;
      const reduction = Math.min(monthsEarly * 0.0055, 0.25); // Max 25% reduction
      return 1 - reduction;
    } else if (claimAge > fullRetirementAge) {
      // Delayed retirement credits
      const yearsDelayed = claimAge - fullRetirementAge;
      const increase = Math.min(yearsDelayed * 0.08, 0.32); // Max 32% increase (age 70)
      return 1 + increase;
    }
    
    return 1.0; // No adjustment at full retirement age
  }
}