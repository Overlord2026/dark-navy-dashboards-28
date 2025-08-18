import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

type Body = { execution_id?: string; provider: string; policyRef: string };

serve(async (req) => {
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
  const { provider, policyRef, execution_id }: Body = await req.json();

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const sb = createClient(supabaseUrl, supabaseKey);

  // TODO: call real provider; for now assume unknown -> not in force
  const inForce = false;
  const evidence = { provider, policyRef, stub: true };

  await sb.from("aies_policy_checks").insert({
    execution_id: execution_id ?? null,
    provider,
    policy_ref: policyRef,
    in_force: inForce,
    evidence
  });

  return Response.json({ in_force: inForce, evidence });
});