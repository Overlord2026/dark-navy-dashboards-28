import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type DbGoal = Database["public"]["Tables"]["user_goals"]["Row"];
type DbGoalInsert = Database["public"]["Tables"]["user_goals"]["Insert"];

export type Goal = {
  id: string;
  user_id: string;
  persona?: "aspiring" | "retiree" | "family" | "advisor";
  title: string;
  description?: string | null;
  category?: string | null;
  target_date?: string | null;
  target_amount?: number | null;
  current_amount: number;
  status: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

function mapDbToGoal(row: DbGoal): Goal {
  return {
    id: row.id,
    user_id: row.user_id,
    persona: (row as any).persona, // Optional, may not exist yet
    title: row.name,
    description: row.description,
    category: row.category,
    target_date: row.target_date,
    target_amount: row.target_amount,
    current_amount: row.current_amount,
    status: row.status || "active",
    sort_order: row.sort_order || 999,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export async function listActiveGoals(persona?: "aspiring" | "retiree" | "family") {
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
    target_date: payload.target_date ?? null,
    target_amount: payload.target_amount ?? 0,
    current_amount: payload.current_amount ?? 0,
    status: (payload.status as any) ?? "active",
    sort_order: payload.sort_order ?? 100,
  };

  // Add persona if DB supports it
  if (payload.persona) {
    (insertData as any).persona = payload.persona;
  }

  const { data, error } = await supabase
    .from("user_goals")
    .insert(insertData)
    .select("*")
    .single();

  if (error) throw error;
  return mapDbToGoal(data);
}
