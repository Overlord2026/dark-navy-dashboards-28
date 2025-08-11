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
      assets: [
        { symbol: 'VTI', expectedReturn: 0.08, risk: 0.16 },
        { symbol: 'VXUS', expectedReturn: 0.09, risk: 0.18 },
        { symbol: 'VGIT', expectedReturn: 0.03, risk: 0.04 },
        { symbol: 'VMFXX', expectedReturn: 0.01, risk: 0.001 }
      ],
      constraints: { riskTolerance: 0.5 }
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
    
    // Should have reasonable target weights
    expect(Object.keys(result.targetWeights).length).toBeGreaterThan(0);
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
      constraints: { riskTolerance: 0 }
    };

    const result = await PortfolioOptimizer.optimize(edgeInput);
    
    expect(result.rebalanceNeeded).toBeDefined();
    expect(result.rationale).toBeDefined();
  });

  test('should generate proper recommendations', async () => {
    const result = await PortfolioOptimizer.optimize(mockInput);
    
    expect(Array.isArray(result.recommendations)).toBe(true);
    expect(typeof result.rationale).toBe('string');
    expect(result.rationale.length).toBeGreaterThan(0);
  });

  test('should handle different risk tolerance levels', async () => {
    const conservativeInput = { 
      ...mockInput,
      constraints: { riskTolerance: 0.2 }
    };
    const aggressiveInput = { 
      ...mockInput,
      constraints: { riskTolerance: 0.9 }
    };
    
    const conservativeResult = await PortfolioOptimizer.optimize(conservativeInput);
    const aggressiveResult = await PortfolioOptimizer.optimize(aggressiveInput);
    
    // Both should produce valid results
    expect(conservativeResult.utilityScore).toBeGreaterThan(0);
    expect(aggressiveResult.utilityScore).toBeGreaterThan(0);
  });
});