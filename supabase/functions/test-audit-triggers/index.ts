import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Set the auth context for the client
    const token = authHeader.replace('Bearer ', '');
    await supabaseClient.auth.setSession({ access_token: token, refresh_token: '' });

    console.log('Starting audit trigger tests...');

    // Test the audit logging function
    const { data: testResults, error: testError } = await supabaseClient
      .rpc('test_audit_logging');

    if (testError) {
      console.error('Test function error:', testError);
      return new Response(
        JSON.stringify({ 
          error: 'Test function failed', 
          details: testError.message 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get recent audit logs to verify the triggers are working
    const { data: recentAudits, error: auditError } = await supabaseClient
      .from('audit_logs')
      .select('*')
      .like('event_type', 'table_audit_%')
      .order('created_at', { ascending: false })
      .limit(20);

    if (auditError) {
      console.error('Audit logs query error:', auditError);
    }

    // Get audit summary
    const { data: auditSummary, error: summaryError } = await supabaseClient
      .from('audit_summary')
      .select('*')
      .limit(10);

    if (summaryError) {
      console.error('Audit summary query error:', summaryError);
    }

    // Test specific table operations to trigger audits
    console.log('Testing direct table operations...');
    
    // Test bank account operations
    const { data: newAccount, error: insertError } = await supabaseClient
      .from('bank_accounts')
      .insert({
        name: 'Audit Test Account',
        account_type: 'checking',
        balance: 5000.00
      })
      .select()
      .single();

    let operationResults = [];

    if (!insertError && newAccount) {
      operationResults.push({ operation: 'INSERT bank_account', status: 'SUCCESS', id: newAccount.id });

      // Update the account
      const { error: updateError } = await supabaseClient
        .from('bank_accounts')
        .update({ balance: 7500.00, name: 'Updated Audit Test Account' })
        .eq('id', newAccount.id);

      if (!updateError) {
        operationResults.push({ operation: 'UPDATE bank_account', status: 'SUCCESS', id: newAccount.id });
      } else {
        operationResults.push({ operation: 'UPDATE bank_account', status: 'FAILED', error: updateError.message });
      }

      // Delete the account
      const { error: deleteError } = await supabaseClient
        .from('bank_accounts')
        .delete()
        .eq('id', newAccount.id);

      if (!deleteError) {
        operationResults.push({ operation: 'DELETE bank_account', status: 'SUCCESS', id: newAccount.id });
      } else {
        operationResults.push({ operation: 'DELETE bank_account', status: 'FAILED', error: deleteError.message });
      }
    } else {
      operationResults.push({ operation: 'INSERT bank_account', status: 'FAILED', error: insertError?.message });
    }

    // Test health metrics operations
    const { data: newMetric, error: metricInsertError } = await supabaseClient
      .from('health_metrics')
      .insert({
        type: 'weight',
        value: '150',
        unit: 'lbs'
      })
      .select()
      .single();

    if (!metricInsertError && newMetric) {
      operationResults.push({ operation: 'INSERT health_metrics', status: 'SUCCESS', id: newMetric.id });

      // Update the metric
      const { error: metricUpdateError } = await supabaseClient
        .from('health_metrics')
        .update({ value: '152', notes: 'Post-workout measurement' })
        .eq('id', newMetric.id);

      if (!metricUpdateError) {
        operationResults.push({ operation: 'UPDATE health_metrics', status: 'SUCCESS', id: newMetric.id });
      }

      // Delete the metric
      const { error: metricDeleteError } = await supabaseClient
        .from('health_metrics')
        .delete()
        .eq('id', newMetric.id);

      if (!metricDeleteError) {
        operationResults.push({ operation: 'DELETE health_metrics', status: 'SUCCESS', id: newMetric.id });
      }
    } else {
      operationResults.push({ operation: 'INSERT health_metrics', status: 'FAILED', error: metricInsertError?.message });
    }

    // Get the latest audit logs after our operations
    const { data: finalAudits, error: finalAuditError } = await supabaseClient
      .from('audit_logs')
      .select('*')
      .like('event_type', 'table_audit_%')
      .order('created_at', { ascending: false })
      .limit(10);

    console.log('Audit trigger tests completed');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Audit trigger tests completed',
        testResults: testResults || [],
        operationResults,
        recentAudits: recentAudits || [],
        finalAudits: finalAudits || [],
        auditSummary: auditSummary || [],
        timestamp: new Date().toISOString()
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Audit trigger test error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});