// supabase/functions/pmalpha-ddpack/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
serve(async (req)=>{
  const b = await req.json().catch(()=>({}));
  const items = (b.items??[]).map((it:any,i:number)=> typeof it==="string"?{id:it,seq:i+1}:{...it,seq:i+1});
  return new Response(JSON.stringify({id:crypto.randomUUID(), created_at:new Date().toISOString(), items}), {headers:{ "Content-Type":"application/json"}});
});