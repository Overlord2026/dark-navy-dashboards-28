/**
 * Interest Rates Engine - Hull-White 1F and CIR Models
 */

import { RatePath, ScenarioConfig } from '../models';
import * as seedrandom from 'seedrandom';

export class RatesEngine {
  private rng: seedrandom.PRNG;

  constructor(seed?: string) {
    this.rng = seedrandom(seed || 'rates_default');
  }

  /**
   * Generate interest rate path using Hull-White 1-Factor model:
   * dr_t = [θ(t) - αr_t]dt + σdW_t
   */
  generateHullWhitePath(config: ScenarioConfig, nYears: number): RatePath {
    const { meanRev: alpha, vol: sigma, longRun: theta, r0 } = config.rates;
    
    const dt = 1/12; // Monthly steps
    const nSteps = nYears * 12;
    
    const shortRates: number[] = [];
    const longRates: number[] = [];
    const yieldCurve: number[][] = [];
    
    let r = r0;
    
    for (let i = 0; i < nSteps; i++) {
      // Hull-White dynamics
      const dW = this.gaussianRandom() * Math.sqrt(dt);
      const dr = alpha * (theta - r) * dt + sigma * dW;
      r += dr;
      r = Math.max(0.001, r); // Floor at 0.1%
      
      if (i % 12 === 11) { // Annual observation
        shortRates.push(r);
        
        // Generate yield curve using Hull-White term structure
        const curve = this.generateYieldCurve(r, alpha, sigma, theta);
        yieldCurve.push(curve);
        longRates.push(curve[9]); // 10-year rate
      }
    }

    return {
      years: Array.from({ length: shortRates.length }, (_, i) => i),
      shortRates,
      longRates,
      yieldCurve
    };
  }

  /**
   * Generate interest rate path using CIR model:
   * dr_t = κ(θ - r_t)dt + σ√r_t dW_t
   */
  generateCIRPath(config: ScenarioConfig, nYears: number): RatePath {
    const { meanRev: kappa, vol: sigma, longRun: theta, r0 } = config.rates;
    
    const dt = 1/12;
    const nSteps = nYears * 12;
    
    const shortRates: number[] = [];
    const longRates: number[] = [];
    const yieldCurve: number[][] = [];
    
    let r = r0;
    
    for (let i = 0; i < nSteps; i++) {
      const dW = this.gaussianRandom() * Math.sqrt(dt);
      const dr = kappa * (theta - r) * dt + sigma * Math.sqrt(Math.max(r, 0)) * dW;
      r += dr;
      r = Math.max(0.001, r); // Floor at 0.1%
      
      if (i % 12 === 11) {
        shortRates.push(r);
        
        // CIR yield curve (simplified)
        const curve = this.generateCIRYieldCurve(r, kappa, theta, sigma);
        yieldCurve.push(curve);
        longRates.push(curve[9]);
      }
    }

    return {
      years: Array.from({ length: shortRates.length }, (_, i) => i),
      shortRates,
      longRates,
      yieldCurve
    };
  }

  /**
   * Generate yield curve for Hull-White model
   */
  private generateYieldCurve(currentRate: number, alpha: number, sigma: number, theta: number): number[] {
    const maturities = [0.25, 0.5, 1, 2, 3, 5, 7, 10, 20, 30]; // Years
    const curve: number[] = [];
    
    for (const T of maturities) {
      // Hull-White bond pricing formula (simplified)
      const B = (1 - Math.exp(-alpha * T)) / alpha;
      const A = Math.exp((theta - sigma * sigma / (2 * alpha * alpha)) * (B - T) - 
                         (sigma * sigma / (4 * alpha)) * B * B);
      
      const bondPrice = A * Math.exp(-B * currentRate);
      const yieldRate = -Math.log(bondPrice) / T;
      
      curve.push(Math.max(0.001, yieldRate));
    }
    
    return curve;
  }

  /**
   * Generate yield curve for CIR model
   */
  private generateCIRYieldCurve(currentRate: number, kappa: number, theta: number, sigma: number): number[] {
    const maturities = [0.25, 0.5, 1, 2, 3, 5, 7, 10, 20, 30];
    const curve: number[] = [];
    
    for (const T of maturities) {
      // CIR bond pricing (analytical solution)
      const gamma = Math.sqrt(kappa * kappa + 2 * sigma * sigma);
      const B = 2 * (Math.exp(gamma * T) - 1) / 
                ((gamma + kappa) * (Math.exp(gamma * T) - 1) + 2 * gamma);
      const A = Math.pow(2 * gamma * Math.exp((gamma + kappa) * T / 2) / 
                        ((gamma + kappa) * (Math.exp(gamma * T) - 1) + 2 * gamma), 
                        2 * kappa * theta / (sigma * sigma));
      
      const bondPrice = A * Math.exp(-B * currentRate);
      const yieldRate = -Math.log(bondPrice) / T;
      
      curve.push(Math.max(0.001, yieldRate));
    }
    
    return curve;
  }

  /**
   * Generate rate scenarios for stress testing
   */
  generateStressScenarios(config: ScenarioConfig, nYears: number): {
    base: RatePath;
    rising: RatePath;
    falling: RatePath;
    volatile: RatePath;
  } {
    const baseConfig = { ...config };
    
    const risingConfig = {
      ...config,
      rates: { ...config.rates, longRun: config.rates.longRun + 0.02 }
    };
    
    const fallingConfig = {
      ...config,
      rates: { ...config.rates, longRun: config.rates.longRun - 0.015 }
    };
    
    const volatileConfig = {
      ...config,
      rates: { ...config.rates, vol: config.rates.vol * 2 }
    };

    return {
      base: this.generateHullWhitePath(baseConfig, nYears),
      rising: this.generateHullWhitePath(risingConfig, nYears),
      falling: this.generateHullWhitePath(fallingConfig, nYears),
      volatile: this.generateHullWhitePath(volatileConfig, nYears)
    };
  }

  /**
   * Calculate bond returns given rate changes
   */
  calculateBondReturns(initialYield: number, finalYield: number, duration: number): number {
    // Modified duration approximation
    const priceChange = -duration * (finalYield - initialYield);
    const incomeReturn = initialYield;
    return incomeReturn + priceChange;
  }

  private gaussianRandom(): number {
    const u1 = this.rng();
    const u2 = this.rng();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  }
}