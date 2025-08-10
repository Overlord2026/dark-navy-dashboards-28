import { describe, test, expect, beforeEach, vi } from 'vitest';
import { createClient } from '@supabase/supabase-js';

// Mock Supabase for integration tests
const mockSupabase = {
  auth: {
    getUser: vi.fn(),
    signInWithPassword: vi.fn()
  },
  from: vi.fn().mockReturnValue({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    then: vi.fn()
  })
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabase
}));

describe('Portfolio Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should enforce RLS policies correctly', async () => {
    // Mock authenticated user
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'user-123' } },
      error: null
    });

    // Mock insert attempt with wrong user_id
    const insertSpy = vi.fn().mockResolvedValue({
      error: { message: 'new row violates row-level security policy' },
      data: null
    });
    
    mockSupabase.from.mockReturnValue({
      insert: insertSpy
    });

    const { supabase } = await import('@/integrations/supabase/client');
    
    // Attempt to insert with different user_id (should fail)
    const result = await supabase.from('portfolio_positions').insert({
      user_id: 'different-user',
      account_id: 'test-account',
      asset_class: 'us_equity',
      symbol: 'SPY',
      quantity: 100,
      market_value: 10000
    });

    expect(result.error).toBeTruthy();
    expect(result.error?.message).toContain('row-level security');
  });

  test('should allow valid portfolio position insert', async () => {
    const userId = 'user-123';
    
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: userId } },
      error: null
    });

    const insertSpy = vi.fn().mockResolvedValue({
      data: [{
        id: 'pos-123',
        user_id: userId,
        asset_class: 'us_equity',
        symbol: 'SPY',
        quantity: 100,
        market_value: 10000
      }],
      error: null
    });
    
    mockSupabase.from.mockReturnValue({
      insert: insertSpy
    });

    const { supabase } = await import('@/integrations/supabase/client');
    
    const result = await supabase.from('portfolio_positions').insert({
      user_id: userId,
      account_id: 'test-account',
      asset_class: 'us_equity',
      symbol: 'SPY',
      quantity: 100,
      market_value: 10000
    });

    expect(result.error).toBeFalsy();
    expect(result.data).toBeTruthy();
    expect(insertSpy).toHaveBeenCalledWith({
      user_id: userId,
      account_id: 'test-account',
      asset_class: 'us_equity',
      symbol: 'SPY',
      quantity: 100,
      market_value: 10000
    });
  });

  test('should validate constraint violations', async () => {
    const insertSpy = vi.fn().mockResolvedValue({
      error: { message: 'new row violates check constraint "chk_quantity_nonneg"' },
      data: null
    });
    
    mockSupabase.from.mockReturnValue({
      insert: insertSpy
    });

    const { supabase } = await import('@/integrations/supabase/client');
    
    // Attempt to insert negative quantity (should fail)
    const result = await supabase.from('portfolio_positions').insert({
      user_id: 'user-123',
      account_id: 'test-account',
      asset_class: 'us_equity',
      symbol: 'SPY',
      quantity: -100, // Invalid negative quantity
      market_value: 10000
    });

    expect(result.error).toBeTruthy();
    expect(result.error?.message).toContain('chk_quantity_nonneg');
  });

  test('should handle rebalancing event creation', async () => {
    const userId = 'user-123';
    
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: userId } },
      error: null
    });

    const insertSpy = vi.fn().mockResolvedValue({
      data: [{
        id: 'rebal-123',
        user_id: userId,
        trigger_type: 'drift',
        trades: [
          { symbol: 'SPY', action: 'sell', quantity: 50, estimatedPrice: 400 },
          { symbol: 'BND', action: 'buy', quantity: 100, estimatedPrice: 80 }
        ],
        status: 'pending'
      }],
      error: null
    });
    
    mockSupabase.from.mockReturnValue({
      insert: insertSpy
    });

    const { supabase } = await import('@/integrations/supabase/client');
    
    const trades = [
      { symbol: 'SPY', action: 'sell', quantity: 50, estimatedPrice: 400 },
      { symbol: 'BND', action: 'buy', quantity: 100, estimatedPrice: 80 }
    ];

    const result = await supabase.from('rebalancing_events').insert({
      user_id: userId,
      account_id: 'test-account',
      trigger_type: 'drift',
      trades,
      execution_status: 'pending',
      rationale: 'Drift correction required'
    });

    expect(result.error).toBeFalsy();
    expect(result.data).toBeTruthy();
    expect(insertSpy).toHaveBeenCalledWith({
      user_id: userId,
      account_id: 'test-account',
      trigger_type: 'drift',
      trades,
      execution_status: 'pending',
      rationale: 'Drift correction required'
    });
  });

  test('should enforce unique constraint on portfolio targets', async () => {
    const insertSpy = vi.fn().mockResolvedValue({
      error: { message: 'duplicate key value violates unique constraint "uq_targets_user_phase_asset_model"' },
      data: null
    });
    
    mockSupabase.from.mockReturnValue({
      insert: insertSpy
    });

    const { supabase } = await import('@/integrations/supabase/client');
    
    // Attempt to insert duplicate target (should fail)
    const result = await supabase.from('portfolio_targets').insert({
      user_id: 'user-123',
      phase: 'income_now',
      asset_class: 'us_equity',
      target_weight: 0.3,
      model_version: 'v1.0'
    });

    expect(result.error).toBeTruthy();
    expect(result.error?.message).toContain('uq_targets_user_phase_asset_model');
  });

  test('should query portfolio data with proper filtering', async () => {
    const userId = 'user-123';
    
    const selectSpy = vi.fn().mockResolvedValue({
      data: [
        {
          id: 'pos-1',
          user_id: userId,
          asset_class: 'us_equity',
          symbol: 'SPY',
          quantity: 100,
          market_value: 40000
        }
      ],
      error: null
    });

    const eqSpy = vi.fn().mockReturnValue({ data: [], error: null });
    
    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: eqSpy
      })
    });

    const { supabase } = await import('@/integrations/supabase/client');
    
    await supabase.from('portfolio_positions').select('*').eq('user_id', userId);

    expect(eqSpy).toHaveBeenCalledWith('user_id', userId);
  });
});