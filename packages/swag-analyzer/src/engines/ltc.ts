/**
 * Long-Term Care (LTC) Engine - Hazard models for onset, care intensity, and costs
 */

import { LTCProjection, ScenarioConfig } from '../models';
import * as seedrandom from 'seedrandom';

export class LTCEngine {
  private rng: seedrandom.PRNG;

  constructor(seed?: string) {
    this.rng = seedrandom(seed || 'ltc_default');
  }

  /**
   * Generate LTC cost projections using hazard rate models
   */
  generateLTCProjections(
    config: ScenarioConfig,
    currentAge: number,
    gender: 'male' | 'female',
    maxAge: number = 100
  ): LTCProjection[] {
    const { baseHazard, age0, inflation, intensityDist } = config.ltc;
    const projections: LTCProjection[] = [];
    
    let cumulativeCost = 0;
    let hasLTCNeed = false;
    let careIntensity = 0;
    
    for (let age = currentAge; age <= maxAge; age++) {
      // Calculate age-specific hazard rate
      const hazardRate = this.calculateLTCHazardRate(age, baseHazard, age0, gender);
      
      // Determine LTC onset probability
      let onsetProbability = 0;
      if (!hasLTCNeed) {
        onsetProbability = hazardRate;
        if (this.rng() < onsetProbability) {
          hasLTCNeed = true;
          // Sample care intensity from distribution
          careIntensity = this.sampleCareIntensity(intensityDist);
        }
      } else {
        // Already has LTC need, may progress or improve
        careIntensity = this.updateCareIntensity(careIntensity, age);
      }
      
      // Calculate annual cost based on care intensity
      const annualCost = this.calculateAnnualCost(careIntensity, age, currentAge, inflation);
      cumulativeCost += annualCost;
      
      projections.push({
        age,
        onsetProbability,
        careIntensity,
        annualCost,
        cumulativeCost
      });
    }
    
    return projections;
  }

  /**
   * Calculate LTC hazard rate based on age and gender
   * Uses exponential model: h(t) = h₀ * exp(α * (age - age₀))
   */
  private calculateLTCHazardRate(
    age: number,
    baseHazard: number,
    age0: number,
    gender: 'male' | 'female'
  ): number {
    // Gender adjustment: women have higher LTC risk
    const genderMultiplier = gender === 'female' ? 1.3 : 1.0;
    
    // Exponential age progression
    const ageEffect = Math.exp(0.08 * (age - age0)); // 8% annual increase
    
    const hazardRate = baseHazard * genderMultiplier * ageEffect;
    
    return Math.min(hazardRate, 0.4); // Cap at 40% annual probability
  }

  /**
   * Sample care intensity from distribution
   * 0 = No care, 0.33 = Mild, 0.66 = Moderate, 1.0 = Severe
   */
  private sampleCareIntensity(intensityDist: number[]): number {
    const rand = this.rng();
    let cumProb = 0;
    
    for (let i = 0; i < intensityDist.length; i++) {
      cumProb += intensityDist[i];
      if (rand < cumProb) {
        return i / (intensityDist.length - 1); // Normalize to [0,1]
      }
    }
    
    return 1.0; // Default to severe care
  }

  /**
   * Update care intensity over time (progression/improvement)
   */
  private updateCareIntensity(currentIntensity: number, age: number): number {
    // Slight progression bias with age
    const progressionProb = 0.05 + (age - 65) * 0.002; // Increases with age
    const improvementProb = 0.03; // Small chance of improvement
    
    const rand = this.rng();
    
    if (rand < progressionProb) {
      // Progress to higher intensity
      return Math.min(currentIntensity + 0.33, 1.0);
    } else if (rand < progressionProb + improvementProb) {
      // Improve to lower intensity
      return Math.max(currentIntensity - 0.33, 0);
    }
    
    return currentIntensity; // No change
  }

  /**
   * Calculate annual LTC cost based on care intensity
   */
  private calculateAnnualCost(
    careIntensity: number,
    currentAge: number,
    baseAge: number,
    inflation: number
  ): number {
    // Base annual costs by care level (2024 dollars)
    const baseCosts = {
      homeHealth: 65000,      // Home health aide
      adultDaycare: 25000,    // Adult day services
      assistedLiving: 55000,  // Assisted living facility
      nursingHome: 120000     // Nursing home
    };
    
    let annualCost = 0;
    
    if (careIntensity === 0) {
      annualCost = 0;
    } else if (careIntensity <= 0.33) {
      // Mild care: Mix of home health and adult daycare
      annualCost = baseCosts.homeHealth * 0.3 + baseCosts.adultDaycare * 0.7;
    } else if (careIntensity <= 0.66) {
      // Moderate care: Assisted living or more intensive home care
      annualCost = baseCosts.assistedLiving;
    } else {
      // Severe care: Nursing home
      annualCost = baseCosts.nursingHome;
    }
    
    // Adjust for inflation
    const yearsFromBase = currentAge - baseAge;
    const inflationFactor = Math.pow(1 + inflation, yearsFromBase);
    
    return annualCost * inflationFactor;
  }

  /**
   * Generate LTC event scenarios for stress testing
   */
  generateLTCEventScenarios(
    config: ScenarioConfig,
    currentAge: number,
    gender: 'male' | 'female'
  ): {
    noLTC: LTCProjection[];
    earlyOnset: LTCProjection[];
    severeNeed: LTCProjection[];
    spouseNeed: LTCProjection[];
  } {
    const base = this.generateLTCProjections(config, currentAge, gender);
    
    // No LTC scenario
    const noLTC = base.map(p => ({ ...p, onsetProbability: 0, careIntensity: 0, annualCost: 0, cumulativeCost: 0 }));
    
    // Early onset scenario (age 70)
    const earlyOnsetConfig = {
      ...config,
      ltc: { ...config.ltc, baseHazard: config.ltc.baseHazard * 3 }
    };
    const earlyOnset = this.generateLTCProjections(earlyOnsetConfig, currentAge, gender);
    
    // Severe need scenario (immediate nursing home level care)
    const severeNeed = this.generateLTCProjections(config, currentAge, gender);
    // Force severe care starting at age 75
    severeNeed.forEach(p => {
      if (p.age >= 75) {
        p.careIntensity = 1.0;
        p.annualCost = this.calculateAnnualCost(1.0, p.age, currentAge, config.ltc.inflation);
      }
    });
    
    // Spouse also needs care scenario (doubled costs)
    const spouseNeed = this.generateLTCProjections(config, currentAge, gender);
    spouseNeed.forEach(p => {
      if (p.age >= 80) {
        p.annualCost *= 1.8; // Not quite double due to some economies of scale
        p.cumulativeCost *= 1.8;
      }
    });
    
    return {
      noLTC,
      earlyOnset,
      severeNeed,
      spouseNeed
    };
  }

  /**
   * Calculate LTC insurance benefit value
   */
  calculateLTCInsuranceBenefit(
    dailyBenefit: number,
    benefitPeriod: number, // In years
    eliminationPeriod: number, // In days
    inflationProtection: boolean,
    inflation: number,
    currentAge: number,
    projectedAge: number
  ): number {
    // Adjust benefit for inflation if protected
    let adjustedBenefit = dailyBenefit;
    if (inflationProtection) {
      const yearsAhead = projectedAge - currentAge;
      adjustedBenefit = dailyBenefit * Math.pow(1 + inflation, yearsAhead);
    }
    
    // Calculate annual benefit (minus elimination period)
    const daysPerYear = 365;
    const eliminationDays = Math.min(eliminationPeriod, daysPerYear);
    const coverageDays = daysPerYear - eliminationDays;
    
    const annualBenefit = adjustedBenefit * coverageDays;
    const totalBenefit = annualBenefit * benefitPeriod;
    
    return totalBenefit;
  }

  /**
   * Calculate present value of LTC risk
   */
  calculateLTCRiskPresentValue(
    projections: LTCProjection[],
    discountRate: number,
    currentAge: number
  ): number {
    let presentValue = 0;
    
    projections.forEach(projection => {
      const yearsAhead = projection.age - currentAge;
      const discountFactor = Math.pow(1 + discountRate, -yearsAhead);
      const expectedCost = projection.onsetProbability * projection.annualCost;
      presentValue += expectedCost * discountFactor;
    });
    
    return presentValue;
  }

  /**
   * Monte Carlo simulation of LTC events
   */
  simulateLTCEvents(
    config: ScenarioConfig,
    currentAge: number,
    gender: 'male' | 'female',
    nSimulations: number
  ): Array<{
    simulation: number;
    onsetAge?: number;
    totalCost: number;
    peakIntensity: number;
    durationYears: number;
  }> {
    const results: Array<{
      simulation: number;
      onsetAge?: number;
      totalCost: number;
      peakIntensity: number;
      durationYears: number;
    }> = [];
    
    for (let sim = 0; sim < nSimulations; sim++) {
      const projections = this.generateLTCProjections(config, currentAge, gender, 100);
      
      let onsetAge: number | undefined;
      let totalCost = 0;
      let peakIntensity = 0;
      let durationYears = 0;
      let inCare = false;
      
      projections.forEach(projection => {
        if (projection.careIntensity > 0 && !inCare) {
          onsetAge = projection.age;
          inCare = true;
        }
        
        if (inCare) {
          totalCost += projection.annualCost;
          peakIntensity = Math.max(peakIntensity, projection.careIntensity);
          durationYears++;
        }
      });
      
      results.push({
        simulation: sim,
        onsetAge,
        totalCost,
        peakIntensity,
        durationYears
      });
    }
    
    return results;
  }
}