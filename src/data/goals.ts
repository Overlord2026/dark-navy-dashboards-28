import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type DbGoal = Database["public"]["Tables"]["user_goals"]["Row"];
type DbGoalInsert = Database["public"]["Tables"]["user_goals"]["Insert"];

// Re-export types from types/goal.ts and types/goals.ts
import type { GoalType, Persona } from '@/types/goal';
export type { GoalPriority } from '@/types/goals';

import type { GoalPriority } from '@/types/goals';

export type Goal = {
  id: string;
  persona?: Persona;
  type: GoalType;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  targetAmount?: number | null;
  targetDate?: string | null;
  monthlyContribution?: number | null;
  priority?: GoalPriority;
  smartr?: {
    specific?: string;
    measurable?: string;
    achievable?: string;
    relevant?: string;
    timeBound?: string;
    rewards?: string;
  };
  progress: {
    current: number;
    pct: number;
  };
  assignedAccountIds: string[];
  createdAt: string;
  updatedAt: string;
  // Internal fields for data layer
  user_id?: string;
  current_amount?: number;
  status?: string;
  sort_order?: number;
  category?: string | null;
  target_date?: string | null;
};

// Helper to infer goal type from category
function inferGoalType(category?: string | null): Goal["type"] {
  if (!category) return "custom";
  const mapping: Record<string, Goal["type"]> = {
    "travel_bucket_list": "bucket_list",
    "retirement": "retirement",
    "education": "education",
    "wedding": "wedding",
    "emergency_fund": "emergency",
    "real_estate": "down_payment",
    "debt_paydown": "debt",
    "other": "savings",
  };
  return mapping[category] || "savings";
}

function mapDbToGoal(row: DbGoal): Goal {
  const current = row.current_amount;
  const target = row.target_amount || 0;
  const pct = target > 0 ? Math.round((current / target) * 100) : 0;

  return {
    id: row.id,
    persona: (row as any).persona,
    type: inferGoalType(row.category),
    title: row.name,
    description: row.description,
    imageUrl: (row as any).image_url,
    targetAmount: row.target_amount,
    targetDate: row.target_date,
    monthlyContribution: (row as any).monthly_contribution,
    priority: (row as any).priority as Goal["priority"],
    smartr: (row as any).smartr_data as Goal["smartr"],
    progress: { current, pct },
    assignedAccountIds: [], // TODO: Fetch from account assignments table
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    // Internal fields
    user_id: row.user_id,
    current_amount: row.current_amount,
    status: row.status || "active",
    sort_order: row.sort_order || 999,
    category: row.category,
    target_date: row.target_date,
  };
}

export async function listActiveGoals(persona?: "aspiring" | "retiree" | "family" | "advisor") {
  const { data, error } = await supabase
    .from("user_goals")
    .select("*")
    .eq("status", "active")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  const goals = (data ?? []).map(mapDbToGoal);

  // Aggregated "family" shows ALL goals; else filter by persona
  if (!persona || persona === "family") return goals;
  return goals.filter(g => g.persona === persona);
}

export async function createGoal(payload: Partial<Goal>) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Not authenticated");

  const insertData: DbGoalInsert = {
    user_id: user.id,
    name: payload.title ?? "New goal",
    category: (payload.category as any) ?? "other",
    description: payload.description ?? null,
    target_date: payload.targetDate ?? null,
    target_amount: payload.targetAmount ?? 0,
    current_amount: payload.current_amount ?? 0,
    status: (payload.status as any) ?? "active",
    sort_order: payload.sort_order ?? 100,
  };

  // Add rich fields
  if (payload.persona) {
    (insertData as any).persona = payload.persona;
  }
  if (payload.imageUrl) {
    (insertData as any).image_url = payload.imageUrl;
  }
  if (payload.monthlyContribution !== undefined) {
    (insertData as any).monthly_contribution = payload.monthlyContribution;
  }
  if (payload.priority) {
    (insertData as any).priority = payload.priority;
  }
  if (payload.smartr) {
    (insertData as any).smartr_data = payload.smartr;
  }

  const { data, error } = await supabase
    .from("user_goals")
    .insert(insertData)
    .select("*")
    .single();

  if (error) throw error;
  return mapDbToGoal(data);
}

// Update goal progress (for quick +$100/250/500 buttons)
export async function updateGoalProgress(goalId: string, newAmount: number) {
  const { data, error } = await supabase
    .from("user_goals")
    .update({ current_amount: newAmount })
    .eq("id", goalId)
    .select()
    .single();
  
  if (error) throw error;
  return mapDbToGoal(data);
}

// Update goal with rich fields
export async function updateGoal(goalId: string, payload: Partial<Goal>) {
  const updateData: any = {};
  
  if (payload.title) updateData.name = payload.title;
  if (payload.description !== undefined) updateData.description = payload.description;
  if (payload.imageUrl !== undefined) updateData.image_url = payload.imageUrl;
  if (payload.priority !== undefined) updateData.priority = payload.priority;
  if (payload.monthlyContribution !== undefined) updateData.monthly_contribution = payload.monthlyContribution;
  if (payload.targetAmount !== undefined) updateData.target_amount = payload.targetAmount;
  if (payload.current_amount !== undefined) updateData.current_amount = payload.current_amount;
  if (payload.targetDate !== undefined) updateData.target_date = payload.targetDate;
  if (payload.smartr !== undefined) updateData.smartr_data = payload.smartr;
  if (payload.category !== undefined) updateData.category = payload.category;
  if (payload.status !== undefined) updateData.status = payload.status;

  const { data, error } = await supabase
    .from("user_goals")
    .update(updateData)
    .eq("id", goalId)
    .select()
    .single();

  if (error) throw error;
  return mapDbToGoal(data);
}

// Delete goal
export async function deleteGoal(goalId: string) {
  const { error } = await supabase
    .from("user_goals")
    .delete()
    .eq("id", goalId);
  
  if (error) throw error;
}

// Get top goals by priority/progress for widgets
export async function getTopGoals(persona?: "aspiring" | "retiree" | "family" | "advisor", limit: number = 3): Promise<Goal[]> {
  const goals = await listActiveGoals(persona);
  
  // Sort by priority (high > medium > low) then by progress percentage
  const priorityOrder: Record<string, number> = { 
    top_aspiration: 0, 
    high: 1, 
    medium: 2, 
    low: 3 
  };
  
  const sorted = goals.sort((a, b) => {
    const aPriority = priorityOrder[a.priority || "medium"] ?? 2;
    const bPriority = priorityOrder[b.priority || "medium"] ?? 2;
    
    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }
    
    // Secondary sort by progress percentage
    return b.progress.pct - a.progress.pct;
  });
  
  return sorted.slice(0, limit);
}
