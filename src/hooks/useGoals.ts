// Hooks using the data layer directly
import { useEffect, useState } from "react";
import { listActiveGoals, createGoal, updateGoal, type Goal } from "@/data/goals";

export function useGoals(persona?: "aspiring"|"retiree"|"family") {
  const [data, setData] = useState<Goal[]|null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<Error|null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const rows = await listActiveGoals(persona);
        setData(rows);
        setError(null);
      } catch (e:any) {
        setError(e);
        setData([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [persona]);

  return { data, isLoading, error };
}

// Legacy exports for compatibility
export const useCreateGoal = () => ({ 
  mutate: async (_payload: any) => {}, 
  mutateAsync: async (payload: any) => createGoal(payload), 
  isPending: false 
});

export const useUpdateGoal = () => ({ 
  mutate: async (_payload: any) => {}, 
  mutateAsync: async (payload: any) => {
    if (!payload.id) throw new Error("Goal ID required");
    return updateGoal(payload.id, payload);
  }, 
  isPending: false 
});

export const useDeleteGoal = () => ({ 
  mutate: async (_id: any) => {}, 
  mutateAsync: async (_id: string) => {}, 
  isPending: false 
});

export const useAccounts = () => ({ data: [] });

export const usePersonaDefaults = (_persona?: any) => ({ data: null, isLoading: false });

export const useAssignAccounts = () => ({ 
  mutate: async (_payload: any) => {}, 
  mutateAsync: async (_payload: any) => {}, 
  isPending: false 
});

export const useSetContributionPlan = () => ({ 
  mutate: async (_payload: any) => {}, 
  mutateAsync: async (_payload: any) => {}, 
  isPending: false 
});

export const useReorderGoals = () => ({ 
  mutate: async (_goalIds: any) => {}, 
  mutateAsync: async (_goalIds: string[]) => {}, 
  isPending: false 
});

export const useTopGoals = (_persona?: any, _limit?: number) => [];
export const useGoalStats = () => ({ total: 0, totalSaved: 0, totalTarget: 0, averageProgress: 0, onTrack: 0 });
export const useGoal = (_goalId?: string) => ({ data: null, isLoading: false, error: null });
