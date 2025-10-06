import { supabase } from "@/integrations/supabase/client";

export type Goal = {
  id: string;
  user_id: string;
  persona: "aspiring" | "retiree" | "family" | "advisor";
  title: string;
  description?: string | null;
  category?: string | null;
  target_date?: string | null;
  target_amount?: number | null;
  status: "active" | "paused" | "done";
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export async function listActiveGoals(persona?: "aspiring" | "retiree" | "family") {
  const { data, error } = await supabase
    .from("user_goals")
    .select("*")
    .eq("status", "active")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  const rows = (data ?? []) as Goal[];

  // Aggregated "family" shows ALL goals; else filter by persona
  if (!persona || persona === "family") return rows;
  return rows.filter(r => r.persona === persona);
}

export async function createGoal(payload: Partial<Goal>) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Not authenticated");

  const body = {
    user_id: user.id,
    persona: (payload.persona as any) ?? "family",
    title: payload.title ?? "New goal",
    description: payload.description ?? null,
    category: payload.category ?? null,
    target_date: payload.target_date ?? null,
    target_amount: payload.target_amount ?? null,
    status: payload.status ?? "active",
    sort_order: payload.sort_order ?? 100
  };

  const { data, error } = await supabase
    .from("user_goals")
    .insert(body)
    .select("*")
    .single();

  if (error) throw error;
  return data as Goal;
}
