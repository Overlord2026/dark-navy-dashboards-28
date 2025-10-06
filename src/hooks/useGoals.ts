import { useEffect, useMemo, useState } from "react";
import {
  listActiveGoals, createGoal, updateGoal, deleteGoal,
  updateGoalProgress, getTopGoals, type Goal
} from "@/data/goals";
import { getPersonaDefaults } from "@/data/goalTemplates";
import { listUserAccounts, assignAccountsToGoal, type Account } from "@/data/accounts";
import type { Persona } from "@/types/goal";
import { priorityOrder } from "@/types/goals";

export function useGoals(persona?: Persona) {
  const [data, setData] = useState<Goal[]|null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<Error|null>(null);
  useEffect(() => { (async () => {
    try { setLoading(true); setData(await listActiveGoals(persona)); setError(null); }
    catch (e:any) { setError(e); setData([]); }
    finally { setLoading(false); }
  })(); }, [persona]);
  return { data, isLoading, error };
}

export function useTopGoals(persona?: Persona, limit = 3) {
  const [goals, setGoals] = useState<Goal[]>([]);
  useEffect(() => { (async () => {
    try { setGoals(await getTopGoals(persona, limit)); }
    catch { setGoals([]); }
  })(); }, [persona, limit]);
  return goals;
}

export function useGoalStats(persona?: Persona) {
  const { data } = useGoals(persona);
  return useMemo(() => {
    if (!data || data.length === 0) return { total: 0, totalSaved: 0, totalTarget: 0, averageProgress: 0, onTrack: 0 };
    const total = data.length;
    const totalSaved = data.reduce((s,g)=> s + (g.progress.current||0), 0);
    const totalTarget = data.reduce((s,g)=> s + (g.target_amount||0), 0);
    const averageProgress = total > 0 ? Math.round(data.reduce((s,g)=> s + (g.progress.pct||0), 0) / total) : 0;
    const onTrack = data.filter(g => (g.progress.pct||0) >= 80).length;
    return { total, totalSaved, totalTarget, averageProgress, onTrack };
  }, [data]);
}

export const useCreateGoal = () => ({
  mutateAsync: (payload: Partial<Goal>) => createGoal(payload),
  isPending: false
});

export const useUpdateGoal = () => ({
  mutateAsync: (payload: Partial<Goal> & { id: string }) => updateGoal(payload.id, payload),
  isPending: false
});

export const useDeleteGoal = () => ({
  mutateAsync: (id: string) => deleteGoal(id),
  isPending: false
});

export const useUpdateGoalProgress = () => ({
  mutateAsync: (id: string, newAmount: number) => updateGoalProgress(id, newAmount),
  isPending: false
});

// Persona defaults/templates
export function usePersonaDefaults(persona?: Persona) {
  const [data, setData] = useState<Partial<Goal>[] | null>(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (!persona) {
      setData(null);
      return;
    }

    // Filter out advisor and family personas as getPersonaDefaults only supports aspiring/retiree
    if (persona === "advisor" || persona === "family") {
      setData([]);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        const template = await getPersonaDefaults(persona);
        // Transform PersonaTemplate to Partial<Goal>[] for backward compatibility
        if (template && template.goals) {
          setData(template.goals.map(g => ({
            title: g.title,
            description: g.description,
            category: g.type,
            targetAmount: g.targetAmount,
            monthlyContribution: g.monthlyContribution,
            smartr: g.smartr,
            persona: g.persona,
          })));
        } else {
          setData([]);
        }
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
