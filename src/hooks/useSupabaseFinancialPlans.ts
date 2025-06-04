
import { useState, useEffect, useCallback } from 'react';
import { FinancialPlan, FinancialGoal, FinancialPlansSummary } from '@/types/financial-plan';
import { getFinancialPlanService } from '@/services/financial-plans/FinancialPlanServiceFactory';
import { toast } from 'sonner';
import { useUser } from '@/context/UserContext';

/**
 * Hook for interacting with financial plans through Supabase.
 * This provides real-time data persistence and user authentication.
 */
export const useSupabaseFinancialPlans = () => {
  const { user } = useUser();
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

  const service = getFinancialPlanService();

  // Load all plans
  const loadPlans = useCallback(async () => {
    if (!user) {
      setPlans([]);
      setActivePlan(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const fetchedPlans = await service.getPlans();
      setPlans(fetchedPlans);
      
      // Find active plan or use the first one
      const active = fetchedPlans.find(p => p.isActive) || 
                     (fetchedPlans.length > 0 ? fetchedPlans[0] : null);
      setActivePlan(active);
      
      // Get summary
      const plansSummary = await service.getPlansSummary();
      setSummary(plansSummary);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error loading plans'));
      toast.error('Failed to load financial plans. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [service, user]);

  // Initialize on component mount or when user changes
  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  // Create a plan
  const createPlan = async (planData: Partial<FinancialPlan>) => {
    if (!user) {
      toast.error('Please log in to create a financial plan');
      throw new Error('User not authenticated');
    }

    try {
      const newPlan = await service.createPlan(planData);
      await loadPlans(); // Reload plans to ensure consistency
      toast.success('Financial plan created successfully!');
      return newPlan;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create plan';
      toast.error(errorMessage);
      throw err;
    }
  };

  // Update a plan
  const updatePlan = async (id: string, planData: Partial<FinancialPlan>) => {
    try {
      const updatedPlan = await service.updatePlan(id, planData);
      if (updatedPlan) {
        setPlans(prevPlans => 
          prevPlans.map(p => p.id === id ? updatedPlan : p)
        );
        
        // Update active plan if needed
        if (activePlan?.id === id) {
          setActivePlan(updatedPlan);
        }
        
        toast.success('Plan updated successfully!');
      }
      return updatedPlan;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update plan';
      toast.error(errorMessage);
      throw err;
    }
  };

  // Delete a plan
  const deletePlan = async (id: string) => {
    try {
      const success = await service.deletePlan(id);
      if (success) {
        await loadPlans(); // Reload plans to ensure consistency
        toast.success('Plan deleted successfully!');
      }
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete plan';
      toast.error(errorMessage);
      throw err;
    }
  };

  // Save a draft
  const saveDraft = async (draftData: any) => {
    if (!user) {
      toast.error('Please log in to save a draft');
      throw new Error('User not authenticated');
    }

    try {
      const savedDraft = await service.saveDraft(draftData);
      await loadPlans(); // Reload plans to ensure consistency
      toast.success('Draft saved successfully!');
      return savedDraft;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save draft';
      toast.error(errorMessage);
      throw err;
    }
  };

  // Set active plan
  const setActiveFinancialPlan = async (id: string) => {
    try {
      await service.setActivePlan(id);
      await loadPlans(); // Reload plans to ensure consistency
      toast.success('Active plan updated!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to set active plan';
      toast.error(errorMessage);
      throw err;
    }
  };

  // Update a goal
  const updateGoal = async (planId: string, goal: FinancialGoal) => {
    try {
      const success = await service.updateGoal(planId, goal);
      if (success) {
        await loadPlans(); // Reload plans to ensure consistency
        toast.success('Goal updated successfully!');
      }
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update goal';
      toast.error(errorMessage);
      throw err;
    }
  };

  // Toggle favorite status
  const toggleFavorite = async (id: string) => {
    try {
      await service.toggleFavorite(id);
      setPlans(prevPlans => 
        prevPlans.map(p => 
          p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
        )
      );
      toast.success('Favorite status updated!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update favorite status';
      toast.error(errorMessage);
      throw err;
    }
  };

  // Duplicate a plan
  const duplicatePlan = async (id: string) => {
    try {
      const duplicatedPlan = await service.duplicatePlan(id);
      if (duplicatedPlan) {
        await loadPlans(); // Reload plans to ensure consistency
        toast.success('Plan duplicated successfully!');
      }
      return duplicatedPlan;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to duplicate plan';
      toast.error(errorMessage);
      throw err;
    }
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
    refreshPlans: loadPlans
  };
};
