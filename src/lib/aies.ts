import { supabase } from "@/integrations/supabase/client";

export async function routeConnector(params: {
  user_id: string; dataset: string; scope: string;
  jurisdiction?: string; required_scopes?: string[]; policy_id: string;
}) {
  const { data, error } = await supabase.functions.invoke('aies-route', {
    body: params
  });
  
  if (error) throw error;
  return data;
}

export async function emitReceipt(payload: {
  actor_id: string; persona: string; connector_key: string;
  inputs: unknown; outcomes?: unknown; reason_codes?: unknown; policy_id: string;
  trust_grade?: string;
}) {
  const { data, error } = await supabase.functions.invoke('aies-receipts', {
    body: payload
  });
  
  if (error) throw error;
  return data;
}