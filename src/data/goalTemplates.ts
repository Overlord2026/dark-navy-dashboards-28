import { supabase } from "@/integrations/supabase/client";

export type GoalTemplateRow = {
  id: string;
  persona: "aspiring" | "retiree" | "family";
  type: string;
  title: string;
  description: string | null;
  target_amount: number | null;
  monthly_contribution: number | null;
  smartr_data: any;              // JSONB
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type PersonaTemplate = {
  persona: "aspiring" | "retiree" | "family";
  goals: Array<{
    type: string;
    title: string;
    description?: string | null;
    targetAmount?: number | null;
    monthlyContribution?: number | null;
    smartr?: any;
    persona: "aspiring" | "retiree" | "family";
  }>;
};

export async function getPersonaDefaults(persona: "aspiring" | "retiree"): Promise<PersonaTemplate | null> {
  // Select explicit columns to avoid relying on outdated generated types
  const { data, error } = await supabase
    .from("goal_templates")
    .select(
      "id,persona,type,title,description,target_amount,monthly_contribution,smartr_data,sort_order,is_active,created_at,updated_at"
    );

  if (error) {
    console.error("Failed to fetch goal templates:", error);
    return null;
  }
  const rows = (data ?? []) as unknown as GoalTemplateRow[];
  const filtered = rows.filter(r => r.is_active && r.persona === persona);
  if (filtered.length === 0) return null;

  const goals = filtered
    .sort((a,b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map(r => ({
      type: r.type,
      title: r.title,
      description: r.description,
      targetAmount: r.target_amount,
      monthlyContribution: r.monthly_contribution,
      smartr: r.smartr_data,
      persona: r.persona,
    }));

  return { persona, goals };
}
