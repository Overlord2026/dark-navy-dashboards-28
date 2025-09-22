/**
 * Advanced Long-Term Care Stress Testing Engine
 * Enhanced modeling with state-specific costs, gender considerations, and comprehensive scenarios
 */

import { LTC_COST_DATABASE, getStateCosts, getNationalAverage, type CareType, type LTCCostData } from '@/data/ltcCostDatabase';

export interface LTCPersonProfile {
  currentAge: number;
  gender: 'male' | 'female';
  healthStatus: 'excellent' | 'good' | 'fair' | 'poor';
  familyHistory: 'good' | 'average' | 'concerning';
  smoker: boolean;
  exerciseLevel: 'sedentary' | 'light' | 'moderate' | 'active';
  chronicConditions: string[];
}

export interface LTCInsuranceProfile {
  hasInsurance: boolean;
  dailyBenefit?: number;
  benefitPeriod?: number; // in years
  eliminationPeriod?: number; // in days
  inflationProtection?: boolean;
  currentAge?: number;
  premiumStructure?: 'level' | 'step_rate' | 'single_premium';
}

export interface LTCStressTestInputs {
  // Personal Information
  primaryPerson: LTCPersonProfile;
  spouse?: LTCPersonProfile;
  
  // Financial
  currentNetWorth: number;
  liquidAssets: number;
  annualRetirementIncome: number;
  inflationRate: number;
  discountRate: number;
  
  // Location
  currentState: string;
  retirementState?: string;
  
  // Insurance
  primaryInsurance: LTCInsuranceProfile;
  spouseInsurance?: LTCInsuranceProfile;
  
  // Preferences
  preferredCareType: CareType;
  carePreference: 'home_first' | 'facility_first' | 'assisted_living_first';
}

export interface LTCStressScenario {
  name: string;
  description: string;
  primaryPersonNeedsLTC: boolean;
  spouseNeedsLTC: boolean;
  simultaneousCare: boolean;
  careType: CareType;
  careDuration: number; // years
  ageAtOnset: number;
  spouseAgeAtOnset?: number;
  costInflationRate: number;
}

export interface LTCStressResult {
  scenario: LTCStressScenario;
  totalCost: number;
  presentValue: number;
  insuranceCoverage: number;
  outOfPocketCost: number;
  impactOnNetWorth: number;
  liquidityStrain: number;
  monthsOfLiquidityRemaining: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'severe';
  recommendations: string[];
}

export interface LTCComprehensiveAnalysis {
  inputs: LTCStressTestInputs;
  baselineRisk: {
    primaryPersonProbability: number;
    spouseProbability: number;
    simultaneousCareProbability: number;
  };
  scenarios: LTCStressResult[];
  worstCaseScenario: LTCStressResult;
  expectedValueScenario: LTCStressResult;
  insuranceGap: number;
  recommendations: {
    priorityLevel: 'high' | 'medium' | 'low';
    category: 'insurance' | 'savings' | 'planning' | 'relocation';
    description: string;
    estimatedCost: number;
    potentialSavings: number;
  }[];
}

export class LTCStressEngine {
  private readonly CARE_PROBABILITY_BASE = {
    male: 0.68,
    female: 0.74
  };

  private readonly HEALTH_MULTIPLIERS = {
    excellent: 0.8,
    good: 1.0,
    fair: 1.3,
    poor: 1.8
  };

  private readonly FAMILY_HISTORY_MULTIPLIERS = {
    good: 0.9,
    average: 1.0,
    concerning: 1.2
  };

  calculateLTCProbability(person: LTCPersonProfile): number {
    let baseProbability = this.CARE_PROBABILITY_BASE[person.gender];
    
    // Health status adjustment
    baseProbability *= this.HEALTH_MULTIPLIERS[person.healthStatus];
    
    // Family history adjustment
    baseProbability *= this.FAMILY_HISTORY_MULTIPLIERS[person.familyHistory];
    
    // Age adjustment (increases with age)
    if (person.currentAge >= 65) {
      baseProbability *= 1 + ((person.currentAge - 65) * 0.02);
    }
    
    // Lifestyle factors
    if (person.smoker) baseProbability *= 1.15;
    
    const exerciseMultipliers = {
      sedentary: 1.1,
      light: 1.05,
      moderate: 1.0,
      active: 0.95
    };
    baseProbability *= exerciseMultipliers[person.exerciseLevel];
    
    // Chronic conditions
    baseProbability *= 1 + (person.chronicConditions.length * 0.05);
    
    return Math.min(baseProbability, 0.95);
  }

  calculateExpectedCareDuration(person: LTCPersonProfile, state: string): number {
    const stateData = getStateCosts(state) || getNationalAverage();
    let baseDuration = stateData.avgCareLength[person.gender];
    
    // Health status adjustment
    const healthDurationMultipliers = {
      excellent: 0.8,
      good: 1.0,
      fair: 1.2,
      poor: 1.5
    };
    
    baseDuration *= healthDurationMultipliers[person.healthStatus];
    
    // Age adjustment
    if (person.currentAge >= 80) {
      baseDuration *= 1.2;
    } else if (person.currentAge >= 75) {
      baseDuration *= 1.1;
    }
    
    return baseDuration;
  }

  calculateAnnualCost(careType: CareType, state: string, roomType: 'private' | 'semi_private' = 'private'): number {
    const stateData = getStateCosts(state) || getNationalAverage();
    
    switch (careType) {
      case 'nursing_home':
        return roomType === 'private' 
          ? stateData.costs.nursing_home.private_room
          : stateData.costs.nursing_home.semi_private_room;
      case 'assisted_living':
        return stateData.costs.assisted_living;
      case 'home_health':
        return stateData.costs.home_health;
      case 'adult_day_care':
        return stateData.costs.adult_day_care;
      default:
        return stateData.costs.nursing_home.private_room;
    }
  }

  calculateInsuranceBenefit(
    insurance: LTCInsuranceProfile,
    careType: CareType,
    careDuration: number,
    inflationRate: number,
    yearsFromNow: number
  ): number {
    if (!insurance.hasInsurance || !insurance.dailyBenefit) return 0;
    
    let dailyBenefit = insurance.dailyBenefit;
    
    // Apply inflation protection
    if (insurance.inflationProtection) {
      dailyBenefit *= Math.pow(1 + inflationRate, yearsFromNow);
    }
    
    const annualBenefit = dailyBenefit * 365;
    const totalBenefitPeriod = Math.min(careDuration, insurance.benefitPeriod || careDuration);
    
    // Account for elimination period
    const eliminationPeriodYears = (insurance.eliminationPeriod || 0) / 365;
    const coveredYears = Math.max(0, totalBenefitPeriod - eliminationPeriodYears);
    
    return annualBenefit * coveredYears;
  }

  generateStressScenarios(inputs: LTCStressTestInputs): LTCStressScenario[] {
    const scenarios: LTCStressScenario[] = [];
    const primaryAge = inputs.primaryPerson.currentAge;
    const spouseAge = inputs.spouse?.currentAge || primaryAge;
    
    // Base scenarios
    scenarios.push({
      name: 'Primary Person - Nursing Home Care',
      description: 'Primary person requires nursing home care for average duration',
      primaryPersonNeedsLTC: true,
      spouseNeedsLTC: false,
      simultaneousCare: false,
      careType: 'nursing_home',
      careDuration: this.calculateExpectedCareDuration(inputs.primaryPerson, inputs.currentState),
      ageAtOnset: primaryAge + 15,
      costInflationRate: inputs.inflationRate + 0.02 // Healthcare inflation typically higher
    });

    if (inputs.spouse) {
      scenarios.push({
        name: 'Spouse - Nursing Home Care',
        description: 'Spouse requires nursing home care for average duration',
        primaryPersonNeedsLTC: false,
        spouseNeedsLTC: true,
        simultaneousCare: false,
        careType: 'nursing_home',
        careDuration: this.calculateExpectedCareDuration(inputs.spouse, inputs.currentState),
        ageAtOnset: spouseAge + 15,
        costInflationRate: inputs.inflationRate + 0.02
      });

      scenarios.push({
        name: 'Both Spouses - Simultaneous Care',
        description: 'Both spouses require LTC simultaneously (worst case)',
        primaryPersonNeedsLTC: true,
        spouseNeedsLTC: true,
        simultaneousCare: true,
        careType: 'nursing_home',
        careDuration: Math.max(
          this.calculateExpectedCareDuration(inputs.primaryPerson, inputs.currentState),
          this.calculateExpectedCareDuration(inputs.spouse, inputs.currentState)
        ),
        ageAtOnset: primaryAge + 15,
        spouseAgeAtOnset: spouseAge + 15,
        costInflationRate: inputs.inflationRate + 0.02
      });
    }

    // Alternative care scenarios
    scenarios.push({
      name: 'Primary Person - Extended Home Care',
      description: 'Primary person receives extended home health care',
      primaryPersonNeedsLTC: true,
      spouseNeedsLTC: false,
      simultaneousCare: false,
      careType: 'home_health',
      careDuration: this.calculateExpectedCareDuration(inputs.primaryPerson, inputs.currentState) * 1.5,
      ageAtOnset: primaryAge + 12,
      costInflationRate: inputs.inflationRate + 0.025
    });

    // Early onset scenario
    scenarios.push({
      name: 'Early Onset LTC - Primary Person',
      description: 'Primary person requires care earlier than expected',
      primaryPersonNeedsLTC: true,
      spouseNeedsLTC: false,
      simultaneousCare: false,
      careType: 'nursing_home',
      careDuration: this.calculateExpectedCareDuration(inputs.primaryPerson, inputs.currentState) * 1.2,
      ageAtOnset: primaryAge + 8,
      costInflationRate: inputs.inflationRate + 0.02
    });

    return scenarios;
  }

  analyzeScenario(scenario: LTCStressScenario, inputs: LTCStressTestInputs): LTCStressResult {
    const yearsToOnset = scenario.ageAtOnset - inputs.primaryPerson.currentAge;
    const state = inputs.retirementState || inputs.currentState;
    
    // Calculate costs
    const annualCostAtOnset = this.calculateAnnualCost(scenario.careType, state);
    const inflatedAnnualCost = annualCostAtOnset * Math.pow(1 + scenario.costInflationRate, yearsToOnset);
    
    let totalCost = 0;
    let insuranceCoverage = 0;
    
    // Primary person costs
    if (scenario.primaryPersonNeedsLTC) {
      const primaryTotalCost = inflatedAnnualCost * scenario.careDuration;
      totalCost += primaryTotalCost;
      
      insuranceCoverage += this.calculateInsuranceBenefit(
        inputs.primaryInsurance,
        scenario.careType,
        scenario.careDuration,
        inputs.inflationRate,
        yearsToOnset
      );
    }
    
    // Spouse costs
    if (scenario.spouseNeedsLTC && inputs.spouse && inputs.spouseInsurance) {
      const spouseYearsToOnset = scenario.spouseAgeAtOnset 
        ? scenario.spouseAgeAtOnset - inputs.spouse.currentAge
        : yearsToOnset;
      
      const spouseInflatedCost = annualCostAtOnset * Math.pow(1 + scenario.costInflationRate, spouseYearsToOnset);
      const spouseTotalCost = spouseInflatedCost * scenario.careDuration;
      totalCost += spouseTotalCost;
      
      insuranceCoverage += this.calculateInsuranceBenefit(
        inputs.spouseInsurance,
        scenario.careType,
        scenario.careDuration,
        inputs.inflationRate,
        spouseYearsToOnset
      );
    }
    
    // Calculate present value
    const presentValue = totalCost / Math.pow(1 + inputs.discountRate, yearsToOnset);
    const insurancePV = insuranceCoverage / Math.pow(1 + inputs.discountRate, yearsToOnset);
    const outOfPocketCost = Math.max(0, totalCost - insuranceCoverage);
    const outOfPocketPV = Math.max(0, presentValue - insurancePV);
    
    // Impact analysis
    const impactOnNetWorth = outOfPocketPV / inputs.currentNetWorth;
    const liquidityStrain = outOfPocketCost / inputs.liquidAssets;
    const monthsOfLiquidityRemaining = (inputs.liquidAssets - outOfPocketCost) / (inputs.annualRetirementIncome / 12);
    
    // Risk assessment
    let riskLevel: 'low' | 'moderate' | 'high' | 'severe';
    if (impactOnNetWorth < 0.1) riskLevel = 'low';
    else if (impactOnNetWorth < 0.3) riskLevel = 'moderate';
    else if (impactOnNetWorth < 0.6) riskLevel = 'high';
    else riskLevel = 'severe';
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(outOfPocketPV, insuranceCoverage, inputs);
    
    return {
      scenario,
      totalCost,
      presentValue,
      insuranceCoverage,
      outOfPocketCost,
      impactOnNetWorth,
      liquidityStrain,
      monthsOfLiquidityRemaining,
      riskLevel,
      recommendations
    };
  }

  private generateRecommendations(outOfPocketCost: number, insuranceCoverage: number, inputs: LTCStressTestInputs): string[] {
    const recommendations: string[] = [];
    
    if (outOfPocketCost > inputs.liquidAssets * 0.5) {
      recommendations.push('Consider increasing LTC insurance coverage to reduce out-of-pocket exposure');
    }
    
    if (!inputs.primaryInsurance.hasInsurance) {
      recommendations.push('Evaluate LTC insurance options while still healthy and insurable');
    }
    
    if (insuranceCoverage < outOfPocketCost * 0.3) {
      recommendations.push('Current insurance coverage may be insufficient for projected costs');
    }
    
    const expensiveStates = ['AK', 'CT', 'MA', 'NY', 'NJ'];
    if (expensiveStates.includes(inputs.currentState)) {
      recommendations.push('Consider relocating to a lower-cost state for retirement to reduce LTC expenses');
    }
    
    return recommendations;
  }

  runComprehensiveAnalysis(inputs: LTCStressTestInputs): LTCComprehensiveAnalysis {
    // Calculate baseline probabilities
    const primaryProbability = this.calculateLTCProbability(inputs.primaryPerson);
    const spouseProbability = inputs.spouse ? this.calculateLTCProbability(inputs.spouse) : 0;
    const simultaneousCareProbability = primaryProbability * spouseProbability * 0.3; // 30% chance of overlap
    
    // Generate and analyze scenarios
    const scenarios = this.generateStressScenarios(inputs);
    const results = scenarios.map(scenario => this.analyzeScenario(scenario, inputs));
    
    // Find worst case and expected value scenarios
    const worstCaseScenario = results.reduce((worst, current) => 
      current.outOfPocketCost > worst.outOfPocketCost ? current : worst
    );
    
    const expectedValueScenario = results.find(r => r.scenario.name.includes('Primary Person - Nursing Home')) || results[0];
    
    // Calculate insurance gap
    const totalExpectedCost = expectedValueScenario.totalCost;
    const totalInsuranceCoverage = expectedValueScenario.insuranceCoverage;
    const insuranceGap = Math.max(0, totalExpectedCost - totalInsuranceCoverage);
    
    // Generate comprehensive recommendations
    const recommendations = this.generateComprehensiveRecommendations(results, inputs);
    
    return {
      inputs,
      baselineRisk: {
        primaryPersonProbability: primaryProbability,
        spouseProbability,
        simultaneousCareProbability
      },
      scenarios: results,
      worstCaseScenario,
      expectedValueScenario,
      insuranceGap,
      recommendations
    };
  }

  private generateComprehensiveRecommendations(
    results: LTCStressResult[], 
    inputs: LTCStressTestInputs
  ): LTCComprehensiveAnalysis['recommendations'] {
    const recommendations: LTCComprehensiveAnalysis['recommendations'] = [];
    
    const worstCase = results.reduce((worst, current) => 
      current.outOfPocketCost > worst.outOfPocketCost ? current : worst
    );
    
    // Insurance recommendations
    if (!inputs.primaryInsurance.hasInsurance) {
      recommendations.push({
        priorityLevel: 'high',
        category: 'insurance',
        description: 'Purchase comprehensive LTC insurance while healthy and insurable',
        estimatedCost: 3500, // Annual premium estimate
        potentialSavings: worstCase.outOfPocketCost * 0.7
      });
    }
    
    // Savings recommendations
    if (worstCase.impactOnNetWorth > 0.3) {
      recommendations.push({
        priorityLevel: 'high',
        category: 'savings',
        description: 'Increase retirement savings to build LTC reserve fund',
        estimatedCost: 0,
        potentialSavings: worstCase.outOfPocketCost * 0.5
      });
    }
    
    return recommendations;
  }
}