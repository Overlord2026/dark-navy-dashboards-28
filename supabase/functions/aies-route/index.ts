import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type RouteReq = {
  user_id: string;
  dataset: string;
  scope: string;
  jurisdiction?: string;
  required_scopes?: string[];
  policy_id: string;
  budget_cents?: number;             // future: budget ceilings (addendum)
};

function score(c: any, juri?: string, reqScopes?: string[]) {
  if (!c.enabled) return -1e9;
  if (juri && !(c.jurisdictions || []).includes(juri)) return -1e9;
  if (reqScopes?.length && !reqScopes.every((s) => (c.data_scopes || []).includes(s))) return -1e9;

  // Simple weighted score: lower is better on these normalized attributes
  const w = { sla: 0.45, error: 0.35, cost: 0.20 };
  return -(w.sla * (c.sla_score ?? 0) + w.error * (c.error_rate ?? 0) + w.cost * (c.cost_score ?? 0));
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  try {
    const body = (await req.json()) as RouteReq;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!
    );

    // Minimal consent check (expand later for per-connector grants)
    const { data: grants } = await supabase
      .from("aies_consent_grants")
      .select("*")
      .eq("subject_user_id", body.user_id)
      .eq("dataset", body.dataset)
      .eq("scope", body.scope)
      .gte("expires_at", new Date().toISOString());

    if (!grants?.length) {
      return new Response(JSON.stringify({ ok: false, error: "no_consent" }), {
        status: 403, headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const { data: conns, error } = await supabase.from("aies_connectors").select("*");
    if (error) throw error;

    const ranked = (conns || [])
      .map((c) => ({ c, s: score(c, body.jurisdiction, body.required_scopes) }))
      .sort((a, b) => b.s - a.s);

    const best = ranked[0]?.c ?? null;
    return new Response(JSON.stringify({ ok: true, connector: best, explain: ranked.slice(0, 5) }), {
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("AIES route error:", e);
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 400, headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});