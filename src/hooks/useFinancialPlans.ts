
import { useState, useEffect, useCallback } from 'react';
import { FinancialPlan, FinancialGoal, FinancialPlansSummary } from '@/types/financial-plan';
import { getFinancialPlanService } from '@/services/financial-plans/FinancialPlanServiceFactory';
import { toast } from 'sonner';

/**
 * Hook for interacting with financial plans through the service layer.
 * This decouples the UI from the data source implementation.
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

  const service = getFinancialPlanService();

  // Load all plans
  const loadPlans = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const fetchedPlans = await service.getPlans();
      setPlans(fetchedPlans);
      
      // Find active plan
      const active = fetchedPlans.find(p => p.isActive) || 
                     (fetchedPlans.length > 0 ? fetchedPlans[0] : null);
      setActivePlan(active);
      
      // Get summary
      const plansSummary = await service.getPlansSummary();
      setSummary(plansSummary);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error loading plans'));
      toast.error('Error loading financial plans');
    } finally {
      setLoading(false);
    }
  }, [service]);

  // Initialize on component mount
  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  // Create a plan
  const createPlan = async (planData: Partial<FinancialPlan>) => {
    try {
      const newPlan = await service.createPlan(planData);
      await loadPlans(); // Reload plans to ensure consistency
      return newPlan;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error creating plan';
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
      }
      return updatedPlan;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error updating plan';
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
      }
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error deleting plan';
      // Intentionally not showing toast for deleted plans
      throw err;
    }
  };

  // Save a draft
  const saveDraft = async (draftData: any) => {
    try {
      const savedDraft = await service.saveDraft(draftData);
      await loadPlans(); // Reload plans to ensure consistency
      return savedDraft;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error saving draft';
      toast.error(errorMessage);
      throw err;
    }
  };

  // Set active plan
  const setActiveFinancialPlan = async (id: string) => {
    try {
      await service.setActivePlan(id);
      await loadPlans(); // Reload plans to ensure consistency
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error setting active plan';
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
      }
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error updating goal';
      // Disable toast notifications for goals to prevent ghost toasts
      // toast.error(errorMessage);
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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error toggling favorite';
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
      }
      return duplicatedPlan;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error duplicating plan';
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
