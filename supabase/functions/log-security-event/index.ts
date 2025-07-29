import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
      status: 405, headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { events } = await req.json();
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

    if (!events || !Array.isArray(events)) {
      return new Response(JSON.stringify({ error: 'Invalid events data' }), {
        status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    const results = [];
    for (const event of events) {
      const { data, error } = await supabase.rpc('log_security_event', {
        p_event_type: event.eventType,
        p_severity: event.severity,
        p_resource_type: event.resourceType,
        p_resource_id: event.resourceId,
        p_action_performed: event.action,
        p_outcome: event.outcome || 'success',
        p_metadata: { ...event.metadata, ip_address: clientIP }
      });

      if (!error) results.push(data);
    }

    return new Response(JSON.stringify({ success: true, processed: results.length }), {
      status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });

  } catch (error: any) {
    console.error('Security event logging error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
};

serve(handler);