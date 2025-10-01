import { supabase } from "@/integrations/supabase/client";

export interface SwagScenarioRow {
  id: string;
  user_id: string;
  household_id?: string | null;
  name: string;
  inputs: any;
  result?: any;
  created_at: string;
}

export async function saveScenario(payload: {
  user_id: string;
  household_id?: string | null;
  name: string;
  inputs: any;
  result?: any;
}) {
  const { data, error } = await supabase
    .from("swag_scenarios")
    .insert([payload])
    .select("*")
    .single();
  
  if (error) throw error;
  return data as SwagScenarioRow;
}

export async function listScenarios() {
  const { data, error } = await supabase
    .from("swag_scenarios")
    .select("*")
    .order("created_at", { ascending: false });
  
  if (error) throw error;
  return (data ?? []) as SwagScenarioRow[];
}

export async function deleteScenario(id: string) {
  const { error } = await supabase
    .from("swag_scenarios")
    .delete()
    .eq("id", id);
  
  if (error) throw error;
}
