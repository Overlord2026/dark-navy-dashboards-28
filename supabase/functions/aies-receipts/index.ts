import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function hex(buf: ArrayBuffer) {
  const b = new Uint8Array(buf);
  return [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")! // service role to insert receipts
    );

    const { actor_id, persona, connector_key, inputs, outcomes, reason_codes, policy_id, trust_grade } =
      await req.json();

    // Hash inputs deterministically per spec
    const enc = new TextEncoder();
    const inputsHash = hex(await crypto.subtle.digest("SHA-256", enc.encode(JSON.stringify(inputs ?? {}))));

    // Compute policy hash from DB for "policy in force" anchoring
    const { data: pol, error: polErr } = await supabase
      .from("aies_policies")
      .select("policy_hash")
      .eq("id", policy_id)
      .maybeSingle();
    if (polErr) throw polErr;

    const { data, error } = await supabase
      .from("aies_receipts")
      .insert({
        actor_id,
        persona,
        connector_key,
        inputs,
        outcomes,
        reason_codes,
        policy_id,
        policy_hash: pol?.policy_hash ?? null,
        inputs_hash: inputsHash,
        merkle_leaf: inputsHash,
        trust_grade,
      })
      .select("id")
      .single();
    if (error) throw error;

    return new Response(JSON.stringify({ ok: true, id: data.id }), {
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("AIES receipts error:", e);
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 400,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});