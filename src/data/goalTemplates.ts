import { supabase } from "@/integrations/supabase/client";
import type { Persona } from "@/types/goal";
import type { Goal } from "./goals";

export async function getPersonaDefaults(persona: Persona): Promise<Partial<Goal>[]> {
  try {
    const { data, error } = await supabase
      .from("goal_templates")
      .select("*")
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
