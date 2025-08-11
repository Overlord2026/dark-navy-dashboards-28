import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type PortfolioPosition = Database['public']['Tables']['portfolio_positions']['Row'];
type PortfolioTarget = Database['public']['Tables']['portfolio_targets']['Row'];
type RebalancingEvent = Database['public']['Tables']['rebalancing_events']['Row'];
type PrivateFundHolding = Database['public']['Tables']['private_fund_holdings']['Row'];

export interface PortfolioData {
  positions: PortfolioPosition[];
  targets: PortfolioTarget[];
  privateFunds: PrivateFundHolding[];
  events: RebalancingEvent[];
}

export interface Trade {
  symbol: string;
  action: 'buy' | 'sell';
  quantity: number;
  estimatedPrice: number;
  assetClass: string;
  rationale: string;
}

export interface OptimizationProposal {
  trades: Trade[];
  rationale: string;
  expectedReturn: number;
  risk: number;
  driftCorrections: Array<{
    assetClass: string;
    currentWeight: number;
    targetWeight: number;
    drift: number;
  }>;
}

export const usePortfolio = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PortfolioData | null>(null);
  const [optimization, setOptimization] = useState<OptimizationProposal | null>(null);
  const { toast } = useToast();

  const loadPortfolioData = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      
      const [positionsRes, targetsRes, privateFundsRes, eventsRes] = await Promise.all([
        supabase.from('portfolio_positions').select('*').eq('user_id', userId),
        supabase.from('portfolio_targets').select('*').eq('user_id', userId),
        supabase.from('private_fund_holdings').select('*').eq('user_id', userId),
        supabase.from('rebalancing_events').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(10)
      ]);

      if (positionsRes.error) throw positionsRes.error;
      if (targetsRes.error) throw targetsRes.error;
      if (privateFundsRes.error) throw privateFundsRes.error;
      if (eventsRes.error) throw eventsRes.error;

      setData({
        positions: positionsRes.data || [],
        targets: targetsRes.data || [],
        privateFunds: privateFundsRes.data || [],
        events: eventsRes.data || []
      });
    } catch (error) {
      console.error('Error loading portfolio data:', error);
      toast({
        title: "Error Loading Portfolio",
        description: "Failed to load your portfolio data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const generateOptimization = useCallback(async (phase: string = 'income_now') => {
    if (!data) return;

    try {
      setLoading(true);
      
      // Call the rebalance edge function
      const { data: result, error } = await supabase.functions.invoke('rebalance', {
        body: {
          accountId: 'current_user',
          currentPositions: data.positions.reduce((acc, pos) => {
            acc[pos.asset_class] = pos.market_value || 0;
            return acc;
          }, {} as Record<string, number>),
          targetWeights: data.targets.reduce((acc, target) => {
            if (target.phase === phase) {
              acc[target.asset_class] = target.target_weight;
            }
            return acc;
          }, {} as Record<string, number>),
          triggers: ['drift_check', 'phase_policy'],
          phase
        }
      });

      if (error) throw error;

      const proposal: OptimizationProposal = {
        trades: result.trades || [],
        rationale: result.rationale || 'Optimization completed',
        expectedReturn: 0.08, // Mock data
        risk: 0.12, // Mock data
        driftCorrections: result.driftCorrections || []
      };

      setOptimization(proposal);
      
      toast({
        title: "Optimization Complete",
        description: `Generated ${proposal.trades.length} trade recommendations`,
      });
    } catch (error) {
      console.error('Error generating optimization:', error);
      toast({
        title: "Optimization Failed",
        description: "Failed to generate portfolio optimization. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [data, toast]);

  const createRebalancingTicket = useCallback(async (proposal: OptimizationProposal) => {
    try {
      setLoading(true);
      
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { error } = await supabase.from('rebalancing_events').insert({
        user_id: user.user.id,
        account_id: 'default-account', // Required field
        trigger_type: 'drift',
        trades: proposal.trades as any,
        trigger_data: {},
        rationale: proposal.rationale
      });

      if (error) throw error;

      toast({
        title: "Rebalancing Ticket Created",
        description: "Your rebalancing request has been submitted for execution.",
      });

      // Reload data to show new event
      await loadPortfolioData(user.user.id);
    } catch (error) {
      console.error('Error creating rebalancing ticket:', error);
      toast({
        title: "Failed to Create Ticket",
        description: "Could not create rebalancing ticket. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [loadPortfolioData, toast]);

  const savePortfolioPosition = useCallback(async (position: Omit<PortfolioPosition, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to save portfolio positions.",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase.from('portfolio_positions').insert({
        ...position,
        user_id: user.user.id
      });

      if (error) throw error;
      
      toast({
        title: "Position Saved",
        description: "Portfolio position has been updated successfully.",
      });
    } catch (error) {
      console.error('Error saving position:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save portfolio position. Please try again.",
        variant: "destructive"
      });
    }
  }, [toast]);

  return {
    data,
    optimization,
    loading,
    loadPortfolioData,
    generateOptimization,
    createRebalancingTicket,
    savePortfolioPosition
  };
};