import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { 
      status: 405,
      headers: corsHeaders 
    });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { event, path, ts, ...props } = body ?? {};
    
    if (!event || typeof event !== "string") {
      return new Response("Bad Request - Event name required", { 
        status: 400,
        headers: corsHeaders 
      });
    }

    console.log(`[Analytics] Capturing event: ${event}`, { path, props });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")! // Use service role for writing
    );

    // Extract user info from Authorization header if present
    const authHeader = req.headers.get('authorization');
    let userId = null;
    
    if (authHeader) {
      const userSupabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!
      );
      
      const { data: { user } } = await userSupabase.auth.getUser(
        authHeader.replace('Bearer ', '')
      );
      
      userId = user?.id || null;
    }

    // Use the existing analytics_events table structure
    const { error } = await supabase.from("analytics_events").insert({
      event_type: event,
      event_category: "user_interaction", 
      event_data: {
        path,
        timestamp: ts || new Date().toISOString(),
        ...props
      },
      user_id: userId,
      session_id: props.session_id || null,
      ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
      user_agent: req.headers.get('user-agent')
    });

    if (error) {
      console.error("Database insert error:", error);
      return new Response(JSON.stringify({ error: "Failed to store event" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    console.log(`[Analytics] Successfully stored event: ${event}`);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Analytics capture error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});