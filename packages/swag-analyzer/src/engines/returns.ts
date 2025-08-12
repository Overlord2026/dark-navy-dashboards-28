/**
 * Returns Engine - Regime-switching equity, private credit, infrastructure, crypto
 */

import { ReturnPath, ScenarioConfig } from '../models';
import * as seedrandom from 'seedrandom';

export class ReturnsEngine {
  private rng: seedrandom.PRNG;

  constructor(seed?: string) {
    this.rng = seedrandom(seed || 'returns_default');
  }

  /**
   * Generate multi-asset return paths with regime switching
   */
  generateReturnPaths(config: ScenarioConfig, nYears: number): ReturnPath {
    const equity = this.generateEquityReturns(config, nYears);
    const bonds = this.generateBondReturns(config, nYears);
    const privateCredit = this.generatePrivateCreditReturns(config, nYears);
    const infrastructure = this.generateInfrastructureReturns(config, nYears);
    const crypto = this.generateCryptoReturns(config, nYears);

    return {
      years: Array.from({ length: nYears }, (_, i) => i),
      equity: equity.returns,
      bonds,
      privateCredit,
      infrastructure,
      crypto,
      regimeStates: equity.regimes
    };
  }

  /**
   * Generate regime-switching equity returns
   */
  private generateEquityReturns(config: ScenarioConfig, nYears: number): {
    returns: number[];
    regimes: number[];
  } {
    const { regimes: nRegimes, trans, mu, sigma } = config.equity;
    
    const returns: number[] = [];
    const regimeStates: number[] = [];
    
    // Start in regime 0
    let currentRegime = 0;
    regimeStates.push(currentRegime);
    
    for (let t = 0; t < nYears; t++) {
      // Regime transition
      if (t > 0) {
        const rand = this.rng();
        let cumProb = 0;
        for (let j = 0; j < nRegimes; j++) {
          cumProb += trans[currentRegime][j];
          if (rand < cumProb) {
            currentRegime = j;
            break;
          }
        }
        regimeStates.push(currentRegime);
      }
      
      // Generate return for current regime
      const regimeReturn = mu[currentRegime] + sigma[currentRegime] * this.gaussianRandom();
      returns.push(regimeReturn);
    }

    return { returns, regimes: regimeStates };
  }

  /**
   * Generate bond returns (simplified duration-based model)
   */
  private generateBondReturns(config: ScenarioConfig, nYears: number): number[] {
    const returns: number[] = [];
    const duration = 5; // Average duration
    const baseYield = 0.03; // Base yield
    
    for (let t = 0; t < nYears; t++) {
      // Assume rate changes drive bond returns
      const rateChange = 0.005 * this.gaussianRandom(); // ±0.5% rate moves
      const priceReturn = -duration * rateChange;
      const incomeReturn = baseYield;
      returns.push(incomeReturn + priceReturn);
    }
    
    return returns;
  }

  /**
   * Generate private credit returns with default risk
   */
  private generatePrivateCreditReturns(config: ScenarioConfig, nYears: number): number[] {
    const { baseYield, defaultProb, recovery } = config.privateCredit;
    const returns: number[] = [];
    
    for (let t = 0; t < nYears; t++) {
      let annualReturn = baseYield;
      
      // Default event
      if (this.rng() < defaultProb) {
        const lossGivenDefault = 1 - recovery;
        annualReturn = -lossGivenDefault;
      } else {
        // Add spread volatility
        const spreadVol = 0.02;
        const spreadShock = spreadVol * this.gaussianRandom();
        annualReturn += spreadShock;
      }
      
      returns.push(annualReturn);
    }
    
    return returns;
  }

  /**
   * Generate infrastructure returns with yield + appreciation
   */
  private generateInfrastructureReturns(config: ScenarioConfig, nYears: number): number[] {
    const { baseYield, rocPct } = config.infra;
    const returns: number[] = [];
    
    for (let t = 0; t < nYears; t++) {
      // Income component
      const incomeReturn = baseYield;
      
      // Return of capital
      const rocReturn = baseYield * rocPct;
      
      // Capital appreciation (linked to inflation + real growth)
      const appreciationVol = 0.08;
      const appreciation = 0.02 + appreciationVol * this.gaussianRandom();
      
      const totalReturn = incomeReturn + rocReturn + appreciation;
      returns.push(totalReturn);
    }
    
    return returns;
  }

  /**
   * Generate crypto returns with high volatility and correlation
   */
  private generateCryptoReturns(config: ScenarioConfig, nYears: number): number[] {
    const { vol, corr } = config.crypto;
    const returns: number[] = [];
    
    for (let t = 0; t < nYears; t++) {
      // Crypto-specific factor
      const cryptoFactor = vol * this.gaussianRandom();
      
      // Correlation with equity markets (assumed equity vol ~0.16)
      const equityFactor = 0.16 * this.gaussianRandom();
      const correlatedReturn = corr * equityFactor + Math.sqrt(1 - corr * corr) * cryptoFactor;
      
      // Add mean return assumption
      const meanReturn = 0.08; // High expected return for crypto
      const totalReturn = meanReturn + correlatedReturn;
      
      returns.push(totalReturn);
    }
    
    return returns;
  }

  /**
   * Generate stress test scenarios
   */
  generateStressScenarios(config: ScenarioConfig, nYears: number): {
    base: ReturnPath;
    marketCrash: ReturnPath;
    lowReturns: ReturnPath;
    highInflation: ReturnPath;
    creditCrisis: ReturnPath;
  } {
    const base = this.generateReturnPaths(config, nYears);
    
    // Market crash: First year -30% equity, then recovery
    const crashConfig = { ...config };
    const marketCrash = this.generateReturnPaths(crashConfig, nYears);
    marketCrash.equity[0] = -0.30;
    
    // Persistent low returns
    const lowReturnsConfig = {
      ...config,
      equity: {
        ...config.equity,
        mu: config.equity.mu.map(m => m - 0.03)
      }
    };
    const lowReturns = this.generateReturnPaths(lowReturnsConfig, nYears);
    
    // High inflation scenario affects real returns
    const highInflation = { ...base };
    // Reduce real returns across all assets
    for (let i = 0; i < nYears; i++) {
      highInflation.equity[i] -= 0.02;
      highInflation.bonds[i] -= 0.02;
    }
    
    // Credit crisis: Higher default rates
    const creditCrisisConfig = {
      ...config,
      privateCredit: {
        ...config.privateCredit,
        defaultProb: config.privateCredit.defaultProb * 3
      }
    };
    const creditCrisis = this.generateReturnPaths(creditCrisisConfig, nYears);
    
    return {
      base,
      marketCrash,
      lowReturns,
      highInflation,
      creditCrisis
    };
  }

  /**
   * Calculate portfolio return given asset returns and weights
   */
  calculatePortfolioReturn(
    assetReturns: Record<string, number>,
    weights: Record<string, number>
  ): number {
    let portfolioReturn = 0;
    for (const [asset, weight] of Object.entries(weights)) {
      if (assetReturns[asset] !== undefined) {
        portfolioReturn += weight * assetReturns[asset];
      }
    }
    return portfolioReturn;
  }

  private gaussianRandom(): number {
    const u1 = this.rng();
    const u2 = this.rng();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  }
}