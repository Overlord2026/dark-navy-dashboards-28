
import { useState, useEffect, useCallback } from 'react';
import { FinancialPlan, FinancialGoal, FinancialPlansSummary } from '@/types/financial-plan';
import { getFinancialPlanService } from '@/services/financial-plans/FinancialPlanServiceFactory';
import { toast } from 'sonner';

/**
 * Optimized hook for financial plans with single fetch per page load
 * and efficient state management for CRUD operations
 */
export const useFinancialPlans = () => {
  const [plans, setPlans] = useState<FinancialPlan[]>([]);
  const [activePlan, setActivePlan] = useState<FinancialPlan | null>(null);
  const [summary, setSummary] = useState<FinancialPlansSummary>({
    activePlans: 0,
    draftPlans: 0,
    totalGoals: 0,
    averageSuccessRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  const service = getFinancialPlanService();

  // Calculate summary from local state instead of re-fetching
  const calculateSummary = useCallback((plansList: FinancialPlan[]): FinancialPlansSummary => {
    const activePlans = plansList.filter(p => p.status === 'Active').length;
    const draftPlans = plansList.filter(p => p.status === 'Draft').length;
    const totalGoals = plansList.reduce((acc, plan) => acc + (plan.goals?.length || 0), 0);
    const averageSuccessRate = plansList.length > 0 
      ? plansList.reduce((acc, plan) => acc + (plan.successRate || 0), 0) / plansList.length 
      : 0;

    return {
      activePlans,
      draftPlans,
      totalGoals,
      averageSuccessRate
    };
  }, []);

  // Single fetch on mount - no unnecessary re-fetches
  const loadPlansOnce = useCallback(async () => {
    if (hasInitialized) return;

    try {
      setLoading(true);
      setError(null);
      
      const fetchedPlans = await service.getPlans();
      setPlans(fetchedPlans);
      
      // Find active plan from fetched data
      const active = fetchedPlans.find(p => p.isActive) || 
                     (fetchedPlans.length > 0 ? fetchedPlans[0] : null);
      setActivePlan(active);
      
      // Calculate summary from fetched data
      const plansSummary = calculateSummary(fetchedPlans);
      setSummary(plansSummary);
      
      setHasInitialized(true);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error loading plans'));
      toast.error('Error loading financial plans');
    } finally {
      setLoading(false);
    }
  }, [service, hasInitialized, calculateSummary]);

  // Initialize once on mount
  useEffect(() => {
    loadPlansOnce();
  }, [loadPlansOnce]);

  // Optimized create with local state update
  const createPlan = async (planData: Partial<FinancialPlan>) => {
    try {
      const newPlan = await service.createPlan(planData);
      
      // Update local state immediately for better UX
      const updatedPlans = [...plans, newPlan];
      setPlans(updatedPlans);
      setSummary(calculateSummary(updatedPlans));
      
      toast.success('Financial plan created successfully');
      return newPlan;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error creating plan';
      toast.error(errorMessage);
      throw err;
    }
  };

  // Optimized update with local state management
  const updatePlan = async (id: string, planData: Partial<FinancialPlan>) => {
    try {
      const updatedPlan = await service.updatePlan(id, planData);
      if (updatedPlan) {
        // Update local state efficiently
        const updatedPlans = plans.map(p => p.id === id ? updatedPlan : p);
        setPlans(updatedPlans);
        setSummary(calculateSummary(updatedPlans));
        
        // Update active plan if needed
        if (activePlan?.id === id) {
          setActivePlan(updatedPlan);
        }
      }
      return updatedPlan;
    } catch (err) {
      throw err;
    }
  };

  // Optimized delete with local state update
  const deletePlan = async (id: string) => {
    try {
      const success = await service.deletePlan(id);
      if (success) {
        // Update local state immediately
        const updatedPlans = plans.filter(p => p.id !== id);
        setPlans(updatedPlans);
        setSummary(calculateSummary(updatedPlans));
        
        // Handle active plan deletion
        if (activePlan?.id === id) {
          const newActive = updatedPlans.find(p => p.isActive) || 
                           (updatedPlans.length > 0 ? updatedPlans[0] : null);
          setActivePlan(newActive);
        }
        
        toast.success('Financial plan deleted successfully');
      }
      return success;
    } catch (err) {
      toast.error('Failed to delete financial plan');
      throw err;
    }
  };

  // Optimized draft save
  const saveDraft = async (draftData: any) => {
    try {
      const savedDraft = await service.saveDraft(draftData);
      
      // Add to local state
      const updatedPlans = [...plans, savedDraft];
      setPlans(updatedPlans);
      setSummary(calculateSummary(updatedPlans));
      
      toast.success('Draft saved successfully');
      return savedDraft;
    } catch (err) {
      toast.error('Failed to save draft');
      throw err;
    }
  };

  // Optimized active plan setting
  const setActiveFinancialPlan = async (id: string) => {
    try {
      await service.setActivePlan(id);
      
      // Update local state efficiently
      const updatedPlans = plans.map(p => ({ 
        ...p, 
        isActive: p.id === id 
      }));
      setPlans(updatedPlans);
      
      const newActivePlan = updatedPlans.find(p => p.id === id) || null;
      setActivePlan(newActivePlan);
    } catch (err) {
      toast.error('Failed to set active plan');
      throw err;
    }
  };

  // Optimized goal update
  const updateGoal = async (planId: string, goal: FinancialGoal) => {
    try {
      const success = await service.updateGoal(planId, goal);
      if (success) {
        // Update local state efficiently
        const updatedPlans = plans.map(p => {
          if (p.id === planId) {
            const updatedGoals = p.goals.some(g => g.id === goal.id)
              ? p.goals.map(g => g.id === goal.id ? goal : g)
              : [...p.goals, goal];
            return { ...p, goals: updatedGoals };
          }
          return p;
        });
        
        setPlans(updatedPlans);
        setSummary(calculateSummary(updatedPlans));
        
        // Update active plan if it's the one being modified
        if (activePlan?.id === planId) {
          const updatedActivePlan = updatedPlans.find(p => p.id === planId);
          if (updatedActivePlan) {
            setActivePlan(updatedActivePlan);
          }
        }
      }
      return success;
    } catch (err) {
      throw err;
    }
  };

  // Optimized favorite toggle
  const toggleFavorite = async (id: string) => {
    try {
      await service.toggleFavorite(id);
      
      // Update local state immediately
      const updatedPlans = plans.map(p => 
        p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
      );
      setPlans(updatedPlans);
      
      // Update active plan if needed
      if (activePlan?.id === id) {
        setActivePlan({ ...activePlan, isFavorite: !activePlan.isFavorite });
      }
    } catch (err) {
      toast.error('Failed to update favorite status');
      throw err;
    }
  };

  // Optimized duplicate
  const duplicatePlan = async (id: string) => {
    try {
      const duplicatedPlan = await service.duplicatePlan(id);
      if (duplicatedPlan) {
        // Add to local state
        const updatedPlans = [...plans, duplicatedPlan];
        setPlans(updatedPlans);
        setSummary(calculateSummary(updatedPlans));
        
        toast.success('Plan duplicated successfully');
      }
      return duplicatedPlan;
    } catch (err) {
      toast.error('Failed to duplicate plan');
      throw err;
    }
  };

  // Manual refresh for edge cases only
  const refreshPlans = async () => {
    setHasInitialized(false);
    await loadPlansOnce();
  };

  return {
    plans,
    activePlan,
    summary,
    loading,
    error,
    createPlan,
    updatePlan,
    deletePlan,
    saveDraft,
    setActivePlan: setActiveFinancialPlan,
    updateGoal,
    toggleFavorite,
    duplicatePlan,
    refreshPlans
  };
};
