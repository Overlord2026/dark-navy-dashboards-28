// Deno / Supabase Edge auth helpers
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Env, need } from './secrets.ts';

export type Caller = { userId: string; entityId: string | null; role: string | null };

// Use for user-invoked endpoints (respects RLS)
export function userClient(req: Request) {
  return createClient(
    Env.SB_URL(),
    need("SUPABASE_ANON_KEY"),
    { global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } }, auth: { persistSession: false } }
  );
}

// Use ONLY for cron/vendor ingest (bypasses RLS)
export function serviceClient() {
  return createClient(Env.SB_URL(), Env.SB_SERVICE(), { auth: { persistSession: false } });
}

export function getCaller(req: Request): Caller {
  try {
    const jwt = req.headers.get("Authorization")?.replace(/^Bearer\s+/i, "") || "";
    const claims = JSON.parse(atob((jwt.split(".")[1] ?? "e30=")));
    // tolerate multiple places for entity/role (user_metadata/app_metadata/top-level)
    const meta = claims?.app_metadata ?? claims?.user_metadata ?? {};
    const entityId = claims.app_entity_id ?? meta.app_entity_id ?? meta.entity_id ?? null;
    const role = claims.app_role ?? claims.role ?? meta.app_role ?? null;
    return { userId: claims.sub ?? null, entityId, role };
  } catch {
    return { userId: null, entityId: null, role: null };
  }
}