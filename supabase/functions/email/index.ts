// Edge Function: email
// Reads a Vault secret via server-only RPC and returns "ok".
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,            // set in Function Secrets
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")! // service role, server-only
);

serve(async (_req) => {
  const { data, error } = await supabase.rpc("vault_get_secret", {
    p_name: "sendgrid_api_key",             // the secret you created
  });
  if (error) return new Response(error.message, { status: 500 });

  // Use the secret server-side only. (No logging in real code.)
  const SENDGRID_API_KEY = String(data ?? "");
  return new Response("ok", { status: 200 });
});