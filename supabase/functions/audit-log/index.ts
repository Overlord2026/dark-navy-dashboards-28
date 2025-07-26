import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
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

    if (req.method !== 'GET') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get user from auth
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'User not authenticated' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if user has appropriate role to view audit logs
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('role, tenant_id')
      .eq('id', user.id)
      .single();

    if (!profile || !['admin', 'compliance_officer', 'system_administrator', 'tenant_admin'].includes(profile.role)) {
      return new Response(JSON.stringify({ error: 'Insufficient permissions' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const url = new URL(req.url);
    const tableName = url.searchParams.get('table_name');
    const recordId = url.searchParams.get('record_id');
    const eventType = url.searchParams.get('event_type');
    const startDate = url.searchParams.get('start_date');
    const endDate = url.searchParams.get('end_date');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    // Build query for product audit log
    let query = supabaseClient
      .from('product_audit_log')
      .select(`
        *,
        profiles:user_id (
          id,
          first_name,
          last_name,
          email
        )
      `)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    // Apply filters based on user role
    if (profile.role !== 'system_administrator') {
      query = query.eq('tenant_id', profile.tenant_id);
    }

    if (tableName) {
      query = query.eq('table_name', tableName);
    }
    if (recordId) {
      query = query.eq('record_id', recordId);
    }
    if (eventType) {
      query = query.eq('action_type', eventType);
    }
    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    const { data: auditLogs, error: auditError, count } = await query;

    if (auditError) {
      console.error('Error fetching audit logs:', auditError);
      return new Response(JSON.stringify({ error: auditError.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Also fetch compliance tracking logs
    let complianceQuery = supabaseClient
      .from('product_compliance_tracking')
      .select(`
        *,
        investment_products:product_id (
          id,
          name,
          ria_firm
        ),
        profiles:reviewed_by (
          id,
          first_name,
          last_name,
          email
        )
      `)
      .order('created_at', { ascending: false });

    if (profile.role !== 'system_administrator') {
      complianceQuery = complianceQuery.eq('tenant_id', profile.tenant_id);
    }

    const { data: complianceLogs, error: complianceError } = await complianceQuery;

    if (complianceError) {
      console.error('Error fetching compliance logs:', complianceError);
      return new Response(JSON.stringify({ error: complianceError.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      audit_logs: auditLogs,
      compliance_logs: complianceLogs,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in audit-log function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});