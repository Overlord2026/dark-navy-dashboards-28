/**
 * Inflation Engine - CPI AR(1) and Ornstein-Uhlenbeck Models
 */

import { InflationPath, ScenarioConfig } from '../models';
import * as seedrandom from 'seedrandom';

export class InflationEngine {
  private rng: seedrandom.PRNG;

  constructor(seed?: string) {
    this.rng = seedrandom(seed || 'inflation_default');
  }

  /**
   * Generate inflation path using AR(1) model:
   * r_t = μ + φ(r_{t-1} - μ) + ε_t
   */
  generateAR1Path(config: ScenarioConfig, nYears: number): InflationPath {
    const { mu, phi, sigma } = config.inflation;
    const rates: number[] = [mu]; // Start at long-run mean
    let cumulativeInflation = 1.0;
    const cumulativeInflationPath: number[] = [cumulativeInflation];

    for (let t = 1; t < nYears; t++) {
      const shock = this.gaussianRandom() * sigma;
      const rate = mu + phi * (rates[t - 1] - mu) + shock;
      rates.push(Math.max(-0.1, rate)); // Floor at -10% deflation
      
      cumulativeInflation *= (1 + rate);
      cumulativeInflationPath.push(cumulativeInflation);
    }

    return {
      years: Array.from({ length: nYears }, (_, i) => i),
      rates,
      cumulativeInflation: cumulativeInflationPath
    };
  }

  /**
   * Generate inflation path using Ornstein-Uhlenbeck process:
   * dr_t = κ(θ - r_t)dt + σdW_t
   */
  generateOUPath(config: ScenarioConfig, nYears: number, dt: number = 1/12): InflationPath {
    const { mu: theta, sigma } = config.inflation;
    const kappa = 1 - config.inflation.phi; // Convert from AR(1) to OU parameterization
    
    const nSteps = Math.floor(nYears / dt);
    const rates: number[] = [];
    let r = theta; // Start at long-run mean
    let cumulativeInflation = 1.0;
    const cumulativeInflationPath: number[] = [];

    for (let i = 0; i < nSteps; i++) {
      const dW = this.gaussianRandom() * Math.sqrt(dt);
      const dr = kappa * (theta - r) * dt + sigma * dW;
      r += dr;
      r = Math.max(-0.1, r); // Floor at -10%
      
      if (i % 12 === 11) { // Annual observation
        rates.push(r);
        cumulativeInflation *= Math.pow(1 + r, dt * 12);
        cumulativeInflationPath.push(cumulativeInflation);
      }
    }

    return {
      years: Array.from({ length: rates.length }, (_, i) => i),
      rates,
      cumulativeInflation: cumulativeInflationPath
    };
  }

  /**
   * Generate multiple inflation scenarios for stress testing
   */
  generateStressScenarios(config: ScenarioConfig, nYears: number): {
    base: InflationPath;
    low: InflationPath;
    high: InflationPath;
    volatile: InflationPath;
  } {
    const baseConfig = { ...config };
    
    const lowConfig = { 
      ...config, 
      inflation: { ...config.inflation, mu: config.inflation.mu - 0.015 } 
    };
    
    const highConfig = { 
      ...config, 
      inflation: { ...config.inflation, mu: config.inflation.mu + 0.02 } 
    };
    
    const volatileConfig = { 
      ...config, 
      inflation: { ...config.inflation, sigma: config.inflation.sigma * 2 } 
    };

    return {
      base: this.generateAR1Path(baseConfig, nYears),
      low: this.generateAR1Path(lowConfig, nYears),
      high: this.generateAR1Path(highConfig, nYears),
      volatile: this.generateAR1Path(volatileConfig, nYears)
    };
  }

  /**
   * Calculate real return given nominal return and inflation
   */
  toRealReturn(nominalReturn: number, inflationRate: number): number {
    return (1 + nominalReturn) / (1 + inflationRate) - 1;
  }

  /**
   * Adjust cashflow need for inflation
   */
  adjustForInflation(baseAmount: number, inflationPath: InflationPath, year: number): number {
    if (year >= inflationPath.cumulativeInflation.length) {
      return baseAmount * inflationPath.cumulativeInflation[inflationPath.cumulativeInflation.length - 1];
    }
    return baseAmount * inflationPath.cumulativeInflation[year];
  }

  private gaussianRandom(): number {
    // Box-Muller transform
    const u1 = this.rng();
    const u2 = this.rng();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  }
}