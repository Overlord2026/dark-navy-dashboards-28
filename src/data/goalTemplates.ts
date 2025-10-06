import { supabase } from "@/integrations/supabase/client";
import type { Persona } from "@/types/goal";
import type { Goal } from "./goals";

export async function getPersonaDefaults(persona: Persona): Promise<Partial<Goal>[]> {
  try {
    // Cast the table reference to bypass type inference issues
    const table: any = supabase.from("goal_templates");
    const { data, error } = await table
      .select("id, persona, title, description, type, target_amount, monthly_contribution, smartr_data, sort_order, is_active")
      .eq("persona", persona)
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching persona defaults:", error);
      return [];
    }

    return (data || []).map((t: any) => ({
      type: t.type as Goal["type"],
      title: t.title,
      description: t.description,
      targetAmount: t.target_amount || undefined,
      monthlyContribution: t.monthly_contribution || undefined,
      smartr: t.smartr_data || undefined,
      persona,
    }));
  } catch (error) {
    console.error("Exception fetching persona defaults:", error);
    return [];
  }
}
