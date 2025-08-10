import { describe, test, expect, beforeEach, vi } from 'vitest';
import { PortfolioOptimizer } from '@/engines/portfolio/optimizer';
import type { OptimizationInput, OptimizationOutput } from '@/engines/portfolio/optimizer';

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
      phaseId: 'income_now',
      currentPositions: {
        'us_equity': 0.4,
        'international_equity': 0.2,
        'government_bonds': 0.3,
        'cash': 0.1
      },
      assetClassData: {
        'us_equity': { 
          symbol: 'VTI', 
          name: 'US Equity',
          expectedReturn: 0.08, 
          volatility: 0.16, 
          maxDrawdown: 0.20,
          fees: 0.003,
          liquidity: 'high' as const,
          correlations: { 'us_equity': 1.0 }
        },
        'international_equity': { 
          symbol: 'VXUS', 
          name: 'International Equity',
          expectedReturn: 0.09, 
          volatility: 0.18, 
          maxDrawdown: 0.25,
          fees: 0.008,
          liquidity: 'high' as const,
          correlations: { 'international_equity': 1.0 }
        },
        'government_bonds': { 
          symbol: 'VGIT', 
          name: 'Government Bonds',
          expectedReturn: 0.03, 
          volatility: 0.04, 
          maxDrawdown: 0.05,
          fees: 0.003,
          liquidity: 'high' as const,
          correlations: { 'government_bonds': 1.0 }
        },
        'cash': { 
          symbol: 'VMFXX', 
          name: 'Cash',
          expectedReturn: 0.01, 
          volatility: 0.001, 
          maxDrawdown: 0.0,
          fees: 0.0,
          liquidity: 'high' as const,
          correlations: { 'cash': 1.0 }
        }
      },
      clientRiskTolerance: 0.5,
      volatilityRegime: 'medium' as const,
      liquidityNeed: 0.1,
      timeHorizon: 10,
      maxDrawdownTolerance: 0.15
    };
  });

  test('should optimize portfolio correctly', async () => {
    const result = await PortfolioOptimizer.optimize(mockInput);
    
    expect(result.expectedReturn).toBeGreaterThan(0);
    expect(result.expectedVolatility).toBeGreaterThan(0);
    expect(result.utilityScore).toBeGreaterThan(0);
    expect(typeof result.rebalanceNeeded).toBe('boolean');
    expect(Array.isArray(result.recommendations)).toBe(true);
    expect(typeof result.rationale).toBe('string');
  });

  test('should respect phase constraints', async () => {
    const result = await PortfolioOptimizer.optimize(mockInput);
    
    // Income Now phase should be conservative
    const totalEquityWeight = (result.targetWeights.us_equity || 0) + 
                              (result.targetWeights.international_equity || 0);
    
    expect(totalEquityWeight).toBeLessThan(0.7); // Conservative allocation
    expect(result.targetWeights.cash).toBeGreaterThanOrEqual(0.05);
  });

  test('should calculate utility scores correctly', async () => {
    const result = await PortfolioOptimizer.optimize(mockInput);
    
    expect(result.utilityScore).toBeDefined();
    expect(typeof result.utilityScore).toBe('number');
    expect(result.expectedReturn).toBeGreaterThan(0);
    expect(result.expectedVolatility).toBeGreaterThan(0);
  });

  test('should handle edge cases', async () => {
    // Test with zero risk tolerance
    const edgeInput = {
      ...mockInput,
      clientRiskTolerance: 0
    };

    const result = await PortfolioOptimizer.optimize(edgeInput);
    
    expect(result.rebalanceNeeded).toBeDefined();
    expect(result.rationale).toContain('conservative');
  });

  test('should generate proper recommendations', async () => {
    const result = await PortfolioOptimizer.optimize(mockInput);
    
    expect(Array.isArray(result.recommendations)).toBe(true);
    expect(typeof result.rationale).toBe('string');
    expect(result.rationale.length).toBeGreaterThan(0);
  });

  test('should handle different phases correctly', async () => {
    const growthInput = { ...mockInput, phaseId: 'growth' };
    const growthResult = await PortfolioOptimizer.optimize(growthInput);
    
    const incomeInput = { ...mockInput, phaseId: 'income_now' };
    const incomeResult = await PortfolioOptimizer.optimize(incomeInput);
    
    // Growth phase should have higher equity allocation
    const growthEquity = (growthResult.targetWeights.us_equity || 0) + 
                        (growthResult.targetWeights.international_equity || 0);
    const incomeEquity = (incomeResult.targetWeights.us_equity || 0) + 
                        (incomeResult.targetWeights.international_equity || 0);
    
    expect(growthEquity).toBeGreaterThan(incomeEquity);
  });
});