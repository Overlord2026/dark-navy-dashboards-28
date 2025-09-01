// supabase/functions/policy-eval/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
const h = async (s:string)=>"sha256:"+Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s)))).map(b=>b.toString(16).padStart(2,"0")).join("");
serve(async (req)=>{
  const p = await req.json().catch(()=>({}));
  const inputs_hash = await h(JSON.stringify(p));
  const policy_version = "v1";
  const receipt_hash = await h(inputs_hash+"|"+policy_version);
  return new Response(JSON.stringify({ok:true, decision_rds:{...p, inputs_hash, policy_version, receipt_hash}}), {headers:{ "Content-Type":"application/json"}});
});