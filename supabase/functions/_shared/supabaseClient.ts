import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Env } from "./secrets.ts";
export const admin=()=>createClient(Env.SB_URL(),Env.SB_SERVICE(),{auth:{persistSession:false}});