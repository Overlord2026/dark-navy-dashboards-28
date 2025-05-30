
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface ModelPortfolio {
  id: string;
  name: string;
  provider: string;
  description: string;
  return_rate: string;
  risk_level: string;
  badge_text: string;
  badge_color: string;
  asset_allocation: string;
  tax_status: string;
  series_type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserPortfolioAssignment {
  id: string;
  user_id: string;
  model_portfolio_id: string;
  assigned_accounts: number;
  trading_groups: number;
  assignment_date: string;
  is_active: boolean;
  model_portfolio: ModelPortfolio;
}

export const useBFOModels = () => {
  const [modelPortfolios, setModelPortfolios] = useState<ModelPortfolio[]>([]);
  const [userAssignments, setUserAssignments] = useState<UserPortfolioAssignment[]>([]);
  const [availablePortfolios, setAvailablePortfolios] = useState<ModelPortfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all model portfolios
  const fetchModelPortfolios = async () => {
    try {
      const { data, error } = await supabase
        .from('model_portfolios')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setModelPortfolios(data || []);
    } catch (err) {
      console.error('Error fetching model portfolios:', err);
      setError('Failed to load model portfolios');
    }
  };

  // Fetch user's portfolio assignments
  const fetchUserAssignments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_portfolio_assignments')
        .select(`
          *,
          model_portfolio:model_portfolios(*)
        `)
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('assignment_date', { ascending: false });

      if (error) throw error;
      setUserAssignments(data || []);
    } catch (err) {
      console.error('Error fetching user assignments:', err);
      setError('Failed to load portfolio assignments');
    }
  };

  // Get available portfolios (not assigned to user)
  const getAvailablePortfolios = () => {
    const assignedIds = userAssignments.map(assignment => assignment.model_portfolio_id);
    const available = modelPortfolios.filter(portfolio => !assignedIds.includes(portfolio.id));
    setAvailablePortfolios(available);
  };

  // Assign a portfolio to user
  const assignPortfolio = async (portfolioId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to assign portfolios');
        return false;
      }

      const { error } = await supabase
        .from('user_portfolio_assignments')
        .insert({
          user_id: user.id,
          model_portfolio_id: portfolioId,
          assigned_accounts: 0,
          trading_groups: 0
        });

      if (error) throw error;

      toast.success('Portfolio assigned successfully');
      await fetchUserAssignments();
      return true;
    } catch (err) {
      console.error('Error assigning portfolio:', err);
      toast.error('Failed to assign portfolio');
      return false;
    }
  };

  // Remove portfolio assignment
  const removePortfolioAssignment = async (assignmentId: string) => {
    try {
      const { error } = await supabase
        .from('user_portfolio_assignments')
        .update({ is_active: false })
        .eq('id', assignmentId);

      if (error) throw error;

      toast.success('Portfolio removed successfully');
      await fetchUserAssignments();
      return true;
    } catch (err) {
      console.error('Error removing portfolio assignment:', err);
      toast.error('Failed to remove portfolio');
      return false;
    }
  };

  // Update portfolio assignment details
  const updatePortfolioAssignment = async (
    assignmentId: string, 
    updates: { assigned_accounts?: number; trading_groups?: number }
  ) => {
    try {
      const { error } = await supabase
        .from('user_portfolio_assignments')
        .update(updates)
        .eq('id', assignmentId);

      if (error) throw error;

      toast.success('Portfolio updated successfully');
      await fetchUserAssignments();
      return true;
    } catch (err) {
      console.error('Error updating portfolio assignment:', err);
      toast.error('Failed to update portfolio');
      return false;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      await Promise.all([
        fetchModelPortfolios(),
        fetchUserAssignments()
      ]);
      
      setLoading(false);
    };

    loadData();
  }, []);

  useEffect(() => {
    getAvailablePortfolios();
  }, [modelPortfolios, userAssignments]);

  return {
    modelPortfolios,
    userAssignments,
    availablePortfolios,
    loading,
    error,
    assignPortfolio,
    removePortfolioAssignment,
    updatePortfolioAssignment,
    refetch: () => {
      fetchModelPortfolios();
      fetchUserAssignments();
    }
  };
};
