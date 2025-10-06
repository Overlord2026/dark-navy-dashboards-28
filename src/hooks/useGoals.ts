import { useEffect, useState } from "react";
import { 
  listActiveGoals, 
  createGoal, 
  updateGoal, 
  deleteGoal as deleteGoalData,
  getTopGoals as getTopGoalsData,
  type Goal 
} from "@/data/goals";
import { getPersonaDefaults } from "@/data/goalTemplates";
import { listUserAccounts, assignAccountsToGoal, type Account } from "@/data/accounts";
import type { Persona } from "@/types/goal";

// Main hook for fetching goals
export function useGoals(persona?: Persona) {
  const [data, setData] = useState<Goal[] | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const rows = await listActiveGoals(persona);
        setData(rows);
        setError(null);
      } catch (e: any) {
        setError(e);
        setData([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [persona]);

  return { data, isLoading, error };
}

// Top goals for widgets
export function useTopGoals(persona?: Persona, limit: number = 3) {
  const [data, setData] = useState<Goal[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const rows = await getTopGoalsData(persona, limit);
        setData(rows);
      } catch (e) {
        console.error("Error fetching top goals:", e);
        setData([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [persona, limit]);

  return data;
}

// Persona defaults/templates
export function usePersonaDefaults(persona?: Persona) {
  const [data, setData] = useState<Partial<Goal>[] | null>(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (!persona) {
      setData(null);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        const templates = await getPersonaDefaults(persona);
        setData(templates);
      } catch (e) {
        console.error("Error fetching persona defaults:", e);
        setData([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [persona]);

  return { data, isLoading };
}

// Accounts for assignment
export function useAccounts() {
  const [data, setData] = useState<Account[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const accounts = await listUserAccounts();
        setData(accounts);
      } catch (e) {
        console.error("Error fetching accounts:", e);
        setData([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { data, isLoading };
}

// Create goal mutation
export function useCreateGoal() {
  const [isPending, setPending] = useState(false);

  return {
    mutate: async (payload: Partial<Goal>) => {
      setPending(true);
      try {
        await createGoal(payload);
      } finally {
        setPending(false);
      }
    },
    mutateAsync: async (payload: Partial<Goal>) => {
      setPending(true);
      try {
        return await createGoal(payload);
      } finally {
        setPending(false);
      }
    },
    isPending,
  };
}

// Update goal mutation
export function useUpdateGoal() {
  const [isPending, setPending] = useState(false);

  return {
    mutate: async (payload: Partial<Goal> & { id: string }) => {
      setPending(true);
      try {
        await updateGoal(payload.id, payload);
      } finally {
        setPending(false);
      }
    },
    mutateAsync: async (payload: Partial<Goal> & { id: string }) => {
      setPending(true);
      try {
        return await updateGoal(payload.id, payload);
      } finally {
        setPending(false);
      }
    },
    isPending,
  };
}

// Delete goal mutation
export function useDeleteGoal() {
  const [isPending, setPending] = useState(false);

  return {
    mutate: async (id: string) => {
      setPending(true);
      try {
        await deleteGoalData(id);
      } finally {
        setPending(false);
      }
    },
    mutateAsync: async (id: string) => {
      setPending(true);
      try {
        await deleteGoalData(id);
      } finally {
        setPending(false);
      }
    },
    isPending,
  };
}

// Assign accounts to goal
export function useAssignAccounts() {
  const [isPending, setPending] = useState(false);

  return {
    mutate: async (payload: { goalId: string; accountIds: string[] }) => {
      setPending(true);
      try {
        await assignAccountsToGoal(payload.goalId, payload.accountIds);
      } finally {
        setPending(false);
      }
    },
    mutateAsync: async (payload: { goalId: string; accountIds: string[] }) => {
      setPending(true);
      try {
        await assignAccountsToGoal(payload.goalId, payload.accountIds);
      } finally {
        setPending(false);
      }
    },
    isPending,
  };
}

// Stubs for features not yet implemented
export function useSetContributionPlan() {
  return {
    mutate: async (_payload: any) => {},
    mutateAsync: async (_payload: any) => {},
    isPending: false,
  };
}

export function useReorderGoals() {
  return {
    mutate: async (_goalIds: string[]) => {},
    mutateAsync: async (_goalIds: string[]) => {},
    isPending: false,
  };
}

export function useGoalStats() {
  return { total: 0, totalSaved: 0, totalTarget: 0, averageProgress: 0, onTrack: 0 };
}

export function useGoal(_goalId?: string) {
  return { data: null, isLoading: false, error: null };
}
