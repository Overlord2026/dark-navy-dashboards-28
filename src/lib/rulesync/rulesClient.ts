import { supabase } from "@/lib/supabaseClient";
import { sha256Hex } from "@/lib/canonical";

export type PolicyBundle = {
  id: string;
  tenant_id: string;
  domain: string;
  jurisdiction: string;
  version: string;
  bundle_id: string;
  provider_id: string;
  provider_sig: string | null;
  content: any;
  content_hash: string;
  effective_at: string;
  created_at: string;
  created_by: string;
};

export async function ensureTenant(): Promise<string> {
  const { data, error } = await supabase.rpc("ensure_user_tenant");
  if (error) throw error;
  return data as string;
}

export async function resolveBundle(domain: string, jurisdiction: string): Promise<PolicyBundle | null> {
  await ensureTenant();
  const { data, error } = await supabase.rpc("rules_resolve", { p_domain: domain, p_jurisdiction: jurisdiction });
  if (error) throw error;
  return (Array.isArray(data) ? data[0] : data) || null;
}

export async function publishMockUpdate(domain: string, jurisdiction: string) {
  const tenant_id = await ensureTenant();
  const now = new Date().toISOString();
  const version = now; // timestamp version
  const content = {
    rules: [
      { id: "baseline.hitl", when: "always", require: "HITL_APPROVAL:2-of-3" }
    ],
    meta: { domain, jurisdiction, issued_at: now }
  };
  const content_hash = await sha256Hex(JSON.stringify(content));
  const bundle_id = `rs://${domain}@${version}`;
  const { data, error } = await supabase.from("policy_bundles").insert({
    tenant_id, domain, jurisdiction, version, bundle_id,
    provider_id: "internal", provider_sig: null,
    content, content_hash, effective_at: now,
    created_by: (await supabase.auth.getUser()).data?.user?.id || null
  }).select("*").single();
  if (error) throw error;

  // Find previous for diff (if any)
  const prev = await resolveBundle(domain, jurisdiction);
  if (prev && prev.id !== data.id) {
    const prevKeys = Object.keys(prev.content || {});
    const newKeys  = Object.keys(content || {});
    const diff = {
      keys_added: newKeys.filter(k => !prevKeys.includes(k)),
      keys_removed: prevKeys.filter(k => !newKeys.includes(k)),
      note: "content-free diff (no PII)"
    };
    const { error: dErr } = await supabase.from("policy_diffs").insert({
      tenant_id, from_bundle: prev.id, to_bundle: data.id, diff_summary: diff,
      created_by: (await supabase.auth.getUser()).data?.user?.id || null
    });
    if (dErr) throw dErr;
  }
  return data as PolicyBundle;
}