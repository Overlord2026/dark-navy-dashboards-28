// Legacy API shim - forwards to data layer
import { listActiveGoals, createGoal, updateGoal } from "@/data/goals";
import type { Goal } from "@/data/goals";
import type { GoalPriority } from "@/types/goals";
import { toPriority, fromPriority } from "@/types/goals";

/**
 * Legacy shape for compatibility
 */
export type LegacyGoal = Goal & {
  priority?: number | GoalPriority;
};

export const goalsApi = {
  listGoals: async (): Promise<LegacyGoal[]> => {
    const rows = await listActiveGoals();
    return rows.map((g: any) => {
      if ("priority" in g && g.priority != null) {
        return { ...g, priority: typeof g.priority === "string" ? fromPriority(g.priority as GoalPriority) : g.priority };
      }
      return g;
    });
  },

  createGoal: async (payload: Partial<LegacyGoal>): Promise<LegacyGoal> => {
    const body: any = { ...payload };
    if (typeof body.priority === "number") {
      body.priority = toPriority(body.priority);
    }
    const created = await createGoal(body);
    const priorityValue = ("priority" in created && created.priority) ? fromPriority(created.priority as GoalPriority) : undefined;
    return { ...created, priority: priorityValue as any };
  },

  updateGoal: async (payload: Partial<LegacyGoal>): Promise<LegacyGoal> => {
    if (!payload.id) throw new Error("Goal ID required for update");
    const body: any = { ...payload };
    if (typeof body.priority === "number") {
      body.priority = toPriority(body.priority);
    }
    const updated = await updateGoal(payload.id, body);
    const priorityValue = ("priority" in updated && updated.priority) ? fromPriority(updated.priority as GoalPriority) : undefined;
    return { ...updated, priority: priorityValue as any };
  },

  deleteGoal: async (id: string): Promise<void> => {
    // Not implemented in data layer yet
    throw new Error("Delete not implemented");
  },

  getAccounts: async (): Promise<any[]> => {
    return [];
  },

  getPersonaDefaults: async (persona: string): Promise<any> => {
    return { persona, goals: [] };
  },

  assignAccounts: async (payload: any): Promise<void> => {},

  setContributionPlan: async (payload: any): Promise<void> => {},

  reorderGoals: async (goalIds: string[]): Promise<void> => {},
};

export const goalKeys = {
  all: ['goals'] as const,
  lists: () => [...goalKeys.all, 'list'] as const,
  list: (filters: string) => [...goalKeys.lists(), { filters }] as const,
  details: () => [...goalKeys.all, 'detail'] as const,
  detail: (id: string) => [...goalKeys.details(), id] as const,
  accounts: ['accounts'] as const,
  personaDefaults: (persona: string) => ['persona-defaults', persona] as const,
};

export default goalsApi;
