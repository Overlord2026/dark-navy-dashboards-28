import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SecurityMetricsRequest {
  timeframe?: 'hour' | 'day' | 'week' | 'month';
  includeDetails?: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { 'Content-Type': 'application/json', ...corsHeaders }}
    );
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user from auth header
    const authHeader = req.headers.get('authorization');
    let userId: string | null = null;
    
    if (authHeader) {
      const { data: { user }, error } = await supabase.auth.getUser(
        authHeader.replace('Bearer ', '')
      );
      if (error || !user) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders }}
        );
      }
      userId = user.id;
    }

    const { timeframe = 'day', includeDetails = false }: SecurityMetricsRequest = await req.json();

    // Calculate time window
    const now = new Date();
    let timeWindow: Date;
    
    switch (timeframe) {
      case 'hour':
        timeWindow = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case 'week':
        timeWindow = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        timeWindow = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default: // day
        timeWindow = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    // Get basic security metrics
    const { data: metrics, error: metricsError } = await supabase.rpc(
      'get_enhanced_security_metrics'
    );

    if (metricsError) {
      console.error('Error getting security metrics:', metricsError);
      throw metricsError;
    }

    // Get security events in timeframe
    const { data: events, error: eventsError } = await supabase
      .from('security_audit_logs')
      .select('event_type, severity, outcome, timestamp, metadata')
      .gte('timestamp', timeWindow.toISOString())
      .order('timestamp', { ascending: false });

    if (eventsError) {
      console.error('Error getting security events:', eventsError);
    }

    const securityEvents = events || [];

    // Calculate aggregated metrics
    const totalEvents = securityEvents.length;
    const criticalEvents = securityEvents.filter(e => e.severity === 'critical').length;
    const blockedAttempts = securityEvents.filter(e => e.outcome === 'blocked').length;
    const failedAuthentications = securityEvents.filter(e => 
      e.event_type.includes('auth') && e.outcome === 'failure'
    ).length;

    // Get MFA compliance
    const { data: mfaStats, error: mfaError } = await supabase
      .from('profiles')
      .select('role, two_factor_enabled')
      .in('role', ['admin', 'tenant_admin', 'system_administrator']);

    let mfaCompliance = 0;
    if (!mfaError && mfaStats) {
      const privilegedUsers = mfaStats.length;
      const mfaEnabledUsers = mfaStats.filter(u => u.two_factor_enabled).length;
      mfaCompliance = privilegedUsers > 0 ? (mfaEnabledUsers / privilegedUsers) * 100 : 100;
    }

    // Get recent incidents
    const { data: incidents, error: incidentsError } = await supabase
      .from('security_incidents')
      .select('id, incident_type, severity, status, created_at')
      .gte('created_at', timeWindow.toISOString())
      .order('created_at', { ascending: false })
      .limit(5);

    const recentIncidents = incidents || [];
    const lastIncident = recentIncidents.length > 0 ? 
      new Date(recentIncidents[0].created_at) : null;

    // Calculate security score
    let securityScore = 100;
    
    // Deduct points for issues
    securityScore -= criticalEvents * 10;
    securityScore -= failedAuthentications * 2;
    securityScore -= Math.max(0, 100 - mfaCompliance) * 0.5;
    securityScore -= recentIncidents.length * 5;

    securityScore = Math.max(0, Math.min(100, securityScore));

    // Determine security status
    let securityStatus: 'excellent' | 'good' | 'warning' | 'critical';
    if (securityScore >= 90) securityStatus = 'excellent';
    else if (securityScore >= 70) securityStatus = 'good';
    else if (securityScore >= 50) securityStatus = 'warning';
    else securityStatus = 'critical';

    // Build response
    const response = {
      totalEvents,
      criticalEvents,
      blockedAttempts,
      failedAuthentications,
      mfaCompliance: Math.round(mfaCompliance),
      recentIncidents: recentIncidents.length,
      lastIncident,
      securityScore: Math.round(securityScore),
      securityStatus,
      timeframe,
      generatedAt: now.toISOString()
    };

    if (includeDetails) {
      (response as any).details = {
        systemMetrics: metrics,
        recentEvents: securityEvents.slice(0, 10),
        incidents: recentIncidents,
        eventBreakdown: {
          by_severity: {
            low: securityEvents.filter(e => e.severity === 'low').length,
            medium: securityEvents.filter(e => e.severity === 'medium').length,
            high: securityEvents.filter(e => e.severity === 'high').length,
            critical: criticalEvents
          },
          by_outcome: {
            success: securityEvents.filter(e => e.outcome === 'success').length,
            failure: securityEvents.filter(e => e.outcome === 'failure').length,
            blocked: blockedAttempts
          }
        }
      };
    }

    return new Response(
      JSON.stringify(response),
      {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          ...corsHeaders 
        }
      }
    );

  } catch (error: any) {
    console.error('Error in get-security-metrics function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          ...corsHeaders 
        }
      }
    );
  }
};

serve(handler);