
import { useState, useEffect, useMemo, useCallback } from 'react';
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

export interface PortfolioFilters {
  provider?: string;
  series_type?: string;
  asset_allocation?: string;
  tax_status?: string;
}

export const useBFOModels = () => {
  const [modelPortfolios, setModelPortfolios] = useState<ModelPortfolio[]>([]);
  const [userAssignments, setUserAssignments] = useState<UserPortfolioAssignment[]>([]);
  const [availablePortfolios, setAvailablePortfolios] = useState<ModelPortfolio[]>([]);
  const [filteredPortfolios, setFilteredPortfolios] = useState<ModelPortfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoized computed values for performance
  const portfolioStats = useMemo(() => {
    const assignedIds = userAssignments.map(assignment => assignment.model_portfolio_id);
    const totalAssignedAccounts = userAssignments.reduce((sum, assignment) => sum + assignment.assigned_accounts, 0);
    const totalTradingGroups = userAssignments.reduce((sum, assignment) => sum + assignment.trading_groups, 0);
    
    return {
      totalPortfolios: modelPortfolios.length,
      assignedPortfolios: userAssignments.length,
      availableCount: modelPortfolios.length - userAssignments.length,
      totalAssignedAccounts,
      totalTradingGroups,
      assignedIds
    };
  }, [modelPortfolios, userAssignments]);

  const filterOptions = useMemo(() => {
    const providers = [...new Set(availablePortfolios.map(p => p.provider))].filter(Boolean);
    const seriesTypes = [...new Set(availablePortfolios.map(p => p.series_type))].filter(Boolean);
    const assetAllocations = [...new Set(availablePortfolios.map(p => p.asset_allocation))].filter(Boolean);
    const taxStatuses = [...new Set(availablePortfolios.map(p => p.tax_status))].filter(Boolean);

    return {
      providers,
      seriesTypes,
      assetAllocations,
      taxStatuses
    };
  }, [availablePortfolios]);

  const portfoliosByProvider = useMemo(() => {
    return modelPortfolios.reduce((acc, portfolio) => {
      if (!acc[portfolio.provider]) acc[portfolio.provider] = [];
      acc[portfolio.provider].push(portfolio);
      return acc;
    }, {} as Record<string, ModelPortfolio[]>);
  }, [modelPortfolios]);

  // Fetch all model portfolios with useCallback for performance
  const fetchModelPortfolios = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('model_portfolios')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setModelPortfolios(data || []);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching model portfolios:', err);
      }
      setError('Failed to load model portfolios');
    }
  }, []);

  // Fetch user's portfolio assignments with useCallback
  const fetchUserAssignments = useCallback(async () => {
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
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching user assignments:', err);
      }
      setError('Failed to load portfolio assignments');
    }
  }, []);

  // Get available portfolios (not assigned to user) with useCallback
  const getAvailablePortfolios = useCallback(() => {
    const available = modelPortfolios.filter(portfolio => !portfolioStats.assignedIds.includes(portfolio.id));
    setAvailablePortfolios(available);
    setFilteredPortfolios(available);
  }, [modelPortfolios, portfolioStats.assignedIds]);

  // Filter portfolios based on criteria with useCallback
  const filterPortfolios = useCallback((filters: PortfolioFilters) => {
    let filtered = [...availablePortfolios];

    if (filters.provider) {
      filtered = filtered.filter(p => p.provider === filters.provider);
    }
    if (filters.series_type) {
      filtered = filtered.filter(p => p.series_type === filters.series_type);
    }
    if (filters.asset_allocation) {
      filtered = filtered.filter(p => p.asset_allocation === filters.asset_allocation);
    }
    if (filters.tax_status) {
      filtered = filtered.filter(p => p.tax_status === filters.tax_status);
    }

    setFilteredPortfolios(filtered);
  }, [availablePortfolios]);

  // Assign a portfolio to user with useCallback
  const assignPortfolio = useCallback(async (portfolioId: string) => {
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
      if (process.env.NODE_ENV === 'development') {
        console.error('Error assigning portfolio:', err);
      }
      toast.error('Failed to assign portfolio');
      return false;
    }
  }, [fetchUserAssignments]);

  // Remove portfolio assignment with useCallback
  const removePortfolioAssignment = useCallback(async (assignmentId: string) => {
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
      if (process.env.NODE_ENV === 'development') {
        console.error('Error removing portfolio assignment:', err);
      }
      toast.error('Failed to remove portfolio');
      return false;
    }
  }, [fetchUserAssignments]);

  // Update portfolio assignment details with useCallback
  const updatePortfolioAssignment = useCallback(async (
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
      if (process.env.NODE_ENV === 'development') {
        console.error('Error updating portfolio assignment:', err);
      }
      toast.error('Failed to update portfolio');
      return false;
    }
  }, [fetchUserAssignments]);

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
    if (modelPortfolios.length > 0) {
      getAvailablePortfolios();
    }
  }, [modelPortfolios, getAvailablePortfolios]);

  const refetch = useCallback(() => {
    fetchModelPortfolios();
    fetchUserAssignments();
  }, [fetchModelPortfolios, fetchUserAssignments]);

  return {
    modelPortfolios,
    userAssignments,
    availablePortfolios,
    filteredPortfolios,
    loading,
    error,
    assignPortfolio,
    removePortfolioAssignment,
    updatePortfolioAssignment,
    filterPortfolios,
    // Memoized computed values
    portfolioStats,
    filterOptions,
    portfoliosByProvider,
    refetch
  };
};
