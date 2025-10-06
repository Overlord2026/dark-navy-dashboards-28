import { supabase } from "@/integrations/supabase/client";
import type { GoalPriority } from "@/types/goals";
import { priorityOrder } from "@/types/goals";
import type { GoalType } from "@/types/goal";

export type Goal = {
  id: string;
  user_id: string;
  persona: "aspiring"|"retiree"|"family"|"advisor";
  type: GoalType;               // inferred from category
  title: string;                 // maps from DB name
  description?: string | null;
  aspirational_description?: string | null;
  image_url?: string | null;
  imageUrl?: string | null;      // alias for compatibility
  category?: string | null;     // DB enum goal_category
  target_date?: string | null;
  targetDate?: string | null;    // alias for compatibility
  target_amount?: number | null;
  targetAmount?: number | null;  // alias for compatibility
  current_amount: number;       // required for progress
  monthly_contribution?: number | null;
  monthlyContribution?: number | null; // alias for compatibility
  priority?: GoalPriority;
  status: "active"|"paused"|"done"|"completed";
  sort_order: number;
  smartr?: {
    specific?: string;
    measurable?: string;
    achievable?: string;
    relevant?: string;
    timeBound?: string;
    rewards?: string;
  };
  progress: { current: number; pct: number };
  assignedAccountIds: string[]; // for compatibility
  created_at: string;
  createdAt: string;            // alias for compatibility
  updated_at: string;
  updatedAt: string;            // alias for compatibility
};

type Row = {
  id: string;
  user_id: string;
  persona: string | null;
  name: string;                      // DB field
  description?: string | null;
  aspirational_description?: string | null;
  image_url?: string | null;
  category?: string | null;
  target_date?: string | null;
  target_amount?: number | null;
  current_amount?: number | null;
  monthly_contribution?: number | null;
  priority?: string | null;          // stored as text
  status?: string | null;
  sort_order?: number | null;
  smartr_data?: any | null;
  created_at: string;
  updated_at: string;
};

// Helper to infer goal type from category
function inferGoalType(category?: string | null): GoalType {
  if (!category) return "custom";
  const mapping: Record<string, GoalType> = {
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

function mapRow(r: Row): Goal {
  const current = Number(r.current_amount ?? 0);
  const target = Number(r.target_amount ?? 0);
  const pct = target > 0 ? Math.round((current / target) * 100) : 0;
  return {
    id: r.id,
    user_id: r.user_id,
    persona: (r.persona as any) ?? "family",
    type: inferGoalType(r.category),
    title: r.name,
    description: r.description ?? null,
    aspirational_description: r.aspirational_description ?? null,
    image_url: r.image_url ?? null,
    imageUrl: r.image_url ?? null,
    category: r.category ?? null,
    target_date: r.target_date ?? null,
    targetDate: r.target_date ?? null,
    target_amount: target,
    targetAmount: target,
    current_amount: current,
    monthly_contribution: r.monthly_contribution ?? null,
    monthlyContribution: r.monthly_contribution ?? null,
    priority: (r.priority as GoalPriority) ?? "medium",
    status: (r.status as any) ?? "active",
    sort_order: r.sort_order ?? 100,
    smartr: r.smartr_data ?? {},
    progress: { current, pct },
    assignedAccountIds: [],
    created_at: r.created_at,
    createdAt: r.created_at,
    updated_at: r.updated_at,
    updatedAt: r.updated_at,
  };
}

export async function listActiveGoals(persona?: "aspiring"|"retiree"|"family"|"advisor") {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return [];

  let query = supabase
    .from("user_goals")
    .select("id,user_id,persona,name,description,aspirational_description,image_url,category,target_date,target_amount,current_amount,monthly_contribution,priority,status,sort_order,smartr_data,created_at,updated_at")
    .eq("user_id", user.id)
    .eq("status","active")
    .order("sort_order",{ ascending:true });

  if (persona && persona !== "family") {
    query = query.eq("persona", persona);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function getTopGoals(persona?: "aspiring"|"retiree"|"family"|"advisor", limit = 3) {
  const rows = await listActiveGoals(persona);
  const sorted = [...rows].sort((a,b) =>
    (priorityOrder[a.priority || "medium"] - priorityOrder[b.priority || "medium"])
  );
  return sorted.slice(0, limit);
}

export async function createGoal(payload: Partial<Goal>) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Not authenticated");

  const body: any = {
    user_id: user.id,
    persona: payload.persona ?? "family",
    name: payload.title ?? "New goal",
    description: payload.description ?? null,
    aspirational_description: payload.aspirational_description ?? null,
    image_url: payload.image_url ?? null,
    category: payload.category ?? null,
    target_date: payload.target_date ?? null,
    target_amount: payload.target_amount ?? null,
    current_amount: payload.current_amount ?? 0,
    monthly_contribution: payload.monthly_contribution ?? null,
    priority: payload.priority ?? "medium",
    status: payload.status ?? "active",
    sort_order: payload.sort_order ?? 100,
    smartr_data: payload.smartr ?? {}
  };

  const { data, error } = await supabase
    .from("user_goals")
    .insert(body)
    .select("id,user_id,persona,name,description,aspirational_description,image_url,category,target_date,target_amount,current_amount,monthly_contribution,priority,status,sort_order,smartr_data,created_at,updated_at")
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("Failed to create goal");
  return mapRow(data as Row);
}

export async function updateGoal(goalId: string, payload: Partial<Goal>) {
  const update: any = {};
  if (payload.title !== undefined) update.name = payload.title;
  if (payload.description !== undefined) update.description = payload.description;
  if (payload.aspirational_description !== undefined) update.aspirational_description = payload.aspirational_description;
  if (payload.image_url !== undefined) update.image_url = payload.image_url;
  if (payload.category !== undefined) update.category = payload.category;
  if (payload.target_date !== undefined) update.target_date = payload.target_date;
  if (payload.target_amount !== undefined) update.target_amount = payload.target_amount;
  if (payload.current_amount !== undefined) update.current_amount = payload.current_amount;
  if (payload.monthly_contribution !== undefined) update.monthly_contribution = payload.monthly_contribution;
  if (payload.priority !== undefined) update.priority = payload.priority;
  if (payload.status !== undefined) update.status = payload.status;
  if (payload.sort_order !== undefined) update.sort_order = payload.sort_order;
  if (payload.smartr !== undefined) update.smartr_data = payload.smartr;

  const { data, error } = await supabase
    .from("user_goals")
    .update(update)
    .eq("id", goalId)
    .select("id,user_id,persona,name,description,aspirational_description,image_url,category,target_date,target_amount,current_amount,monthly_contribution,priority,status,sort_order,smartr_data,created_at,updated_at")
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("Goal not found");
  return mapRow(data as Row);
}

export async function updateGoalProgress(goalId: string, newAmount: number) {
  const { data, error } = await supabase
    .from("user_goals")
    .update({ current_amount: newAmount })
    .eq("id", goalId)
    .select("id,user_id,persona,name,description,aspirational_description,image_url,category,target_date,target_amount,current_amount,monthly_contribution,priority,status,sort_order,smartr_data,created_at,updated_at")
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("Goal not found");
  return mapRow(data as Row);
}

export async function deleteGoal(goalId: string) {
  const { error } = await supabase
    .from("user_goals")
    .delete()
    .eq("id", goalId);
  if (error) throw error;
}
