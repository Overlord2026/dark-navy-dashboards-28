import { describe, test, expect, beforeEach, vi } from '@jest/globals';
import { PortfolioOptimizer } from '@/engines/portfolio/optimizer';
import { PhasePolicy } from '@/engines/portfolio/phasePolicy';
import type { OptimizationInput } from '@/engines/portfolio/optimizer';

// Mock the supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: 'test-user-id' } }
      })
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          data: [],
          error: null
        })
      })
    })
  }
}));

describe('PortfolioOptimizer', () => {
  let mockInput: OptimizationInput;

  beforeEach(() => {
    mockInput = {
      userId: 'test-user',
      phase: 'income_now',
      currentPositions: {
        'us_equity': 0.4,
        'international_equity': 0.2,
        'government_bonds': 0.3,
        'cash': 0.1
      },
      marketData: {
        'us_equity': { price: 100, volatility: 0.16, expectedReturn: 0.08 },
        'international_equity': { price: 90, volatility: 0.18, expectedReturn: 0.09 },
        'government_bonds': { price: 95, volatility: 0.04, expectedReturn: 0.03 },
        'cash': { price: 1, volatility: 0.001, expectedReturn: 0.01 }
      },
      accountValue: 100000,
      constraints: {
        minCash: 0.05,
        maxSingleAsset: 0.5,
        maxAlts: 0.1
      }
    };
  });

  test('should detect drift correctly', async () => {
    const phaseConfig = PhasePolicy.getPhaseConfig('income_now');
    
    // Create targets that would cause drift
    const targets = {
      'us_equity': 0.3, // Current 0.4, target 0.3 = 10% drift
      'international_equity': 0.2, // No drift
      'government_bonds': 0.4, // Current 0.3, target 0.4 = 10% drift
      'cash': 0.1 // No drift
    };

    const result = await PortfolioOptimizer.optimize({
      ...mockInput,
      targets
    });

    expect(result.driftDetected).toBe(true);
    expect(result.trades.length).toBeGreaterThan(0);
    
    // Should have trades to reduce US equity and increase government bonds
    const usEquityTrade = result.trades.find(t => t.assetClass === 'us_equity');
    const bondsTrade = result.trades.find(t => t.assetClass === 'government_bonds');
    
    expect(usEquityTrade?.action).toBe('sell');
    expect(bondsTrade?.action).toBe('buy');
  });

  test('should respect phase constraints', async () => {
    const phaseConfig = PhasePolicy.getPhaseConfig('income_now');
    
    const result = await PortfolioOptimizer.optimize(mockInput);
    
    // Income Now phase should be conservative
    const totalEquityWeight = (result.optimizedWeights.us_equity || 0) + 
                              (result.optimizedWeights.international_equity || 0);
    
    expect(totalEquityWeight).toBeLessThan(0.7); // Conservative allocation
    expect(result.optimizedWeights.cash).toBeGreaterThanOrEqual(phaseConfig.allocationConstraints.minCash);
  });

  test('should generate no trades when already optimized', async () => {
    // Set current positions to match conservative targets
    const optimizedInput = {
      ...mockInput,
      currentPositions: {
        'us_equity': 0.25,
        'international_equity': 0.15,
        'government_bonds': 0.45,
        'cash': 0.15
      }
    };

    const result = await PortfolioOptimizer.optimize(optimizedInput);
    
    expect(result.driftDetected).toBe(false);
    expect(result.trades.length).toBe(0);
    expect(result.rationale).toContain('No significant drift detected');
  });

  test('should calculate utility scores correctly', async () => {
    const result = await PortfolioOptimizer.optimize(mockInput);
    
    expect(result.utilityScore).toBeDefined();
    expect(typeof result.utilityScore).toBe('number');
    expect(result.expectedReturn).toBeGreaterThan(0);
    expect(result.estimatedRisk).toBeGreaterThan(0);
  });

  test('should handle edge cases', async () => {
    // Test with zero account value
    const edgeInput = {
      ...mockInput,
      accountValue: 0
    };

    const result = await PortfolioOptimizer.optimize(edgeInput);
    
    expect(result.trades.length).toBe(0);
    expect(result.rationale).toContain('insufficient account value');
  });

  test('should validate constraint violations', async () => {
    // Create input that violates constraints
    const violatingInput = {
      ...mockInput,
      currentPositions: {
        'us_equity': 0.8, // Violates max single asset
        'cash': 0.02, // Violates min cash
        'real_estate': 0.15, // Violates max alts
        'commodities': 0.03
      }
    };

    const result = await PortfolioOptimizer.optimize(violatingInput);
    
    expect(result.constraintViolations.length).toBeGreaterThan(0);
    expect(result.trades.length).toBeGreaterThan(0);
    
    // Should generate trades to fix violations
    const usEquityTrade = result.trades.find(t => t.assetClass === 'us_equity');
    expect(usEquityTrade?.action).toBe('sell');
  });

  test('should generate proper rationale hash', async () => {
    const result = await PortfolioOptimizer.optimize(mockInput);
    
    expect(result.rationaleHash).toBeDefined();
    expect(result.rationaleHash.length).toBe(64); // SHA-256 produces 64 character hex string
    
    // Same input should produce same hash
    const result2 = await PortfolioOptimizer.optimize(mockInput);
    expect(result.rationaleHash).toBe(result2.rationaleHash);
  });

  test('should handle different phases correctly', async () => {
    const growthInput = { ...mockInput, phase: 'growth' as const };
    const growthResult = await PortfolioOptimizer.optimize(growthInput);
    
    const incomeInput = { ...mockInput, phase: 'income_now' as const };
    const incomeResult = await PortfolioOptimizer.optimize(incomeInput);
    
    // Growth phase should have higher equity allocation
    const growthEquity = (growthResult.optimizedWeights.us_equity || 0) + 
                        (growthResult.optimizedWeights.international_equity || 0);
    const incomeEquity = (incomeResult.optimizedWeights.us_equity || 0) + 
                        (incomeResult.optimizedWeights.international_equity || 0);
    
    expect(growthEquity).toBeGreaterThan(incomeEquity);
  });
});