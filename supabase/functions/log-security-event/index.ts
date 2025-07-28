import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SecurityEventRequest {
  event_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resource_type?: string;
  resource_id?: string;
  action_performed?: string;
  outcome?: 'success' | 'failure' | 'blocked';
  metadata?: Record<string, any>;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the current user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      console.error('Authentication error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const eventData: SecurityEventRequest = await req.json();

    // Get client IP and user agent
    const clientIP = req.headers.get('x-forwarded-for') || 
                    req.headers.get('x-real-ip') || 
                    'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // Get user's tenant
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('tenant_id')
      .eq('id', user.id)
      .single();

    // Insert security event log
    const { data, error } = await supabaseClient
      .from('security_audit_logs')
      .insert({
        user_id: user.id,
        event_type: eventData.event_type,
        severity: eventData.severity,
        ip_address: clientIP,
        user_agent: userAgent,
        resource_type: eventData.resource_type,
        resource_id: eventData.resource_id,
        action_performed: eventData.action_performed,
        outcome: eventData.outcome || 'success',
        metadata: eventData.metadata || {},
        tenant_id: profile?.tenant_id
      });

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to log security event' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Log critical events to console for immediate attention
    if (eventData.severity === 'critical') {
      console.log(`CRITICAL SECURITY EVENT: ${eventData.event_type}`, {
        user_id: user.id,
        event_type: eventData.event_type,
        resource_type: eventData.resource_type,
        action: eventData.action_performed,
        outcome: eventData.outcome,
        timestamp: new Date().toISOString(),
        metadata: eventData.metadata
      });
    }

    return new Response(
      JSON.stringify({ success: true, event_id: data?.id }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in log-security-event function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
};

serve(handler);