import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

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

    const { action, ...payload } = await req.json();

    switch (action) {
      case 'process_file_import':
        return await processFileImport(supabaseClient, payload);
      case 'oauth_callback':
        return await handleOAuthCallback(supabaseClient, payload);
      case 'initiate_oauth':
        return await initiateOAuth(supabaseClient, payload);
      case 'sync_platform_data':
        return await syncPlatformData(supabaseClient, payload);
      case 'rollback_import':
        return await rollbackImport(supabaseClient, payload);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error('Error in platform-import function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function processFileImport(supabase: any, payload: any) {
  const { connectorId, fileContent, fileName, mappings } = payload;

  console.log(`Processing file import for connector: ${connectorId}`);

  // Create import history record
  const { data: historyRecord, error: historyError } = await supabase
    .from('import_export_history')
    .insert({
      connector_id: connectorId,
      operation_type: 'import',
      file_name: fileName,
      status: 'processing',
      field_mapping_used: mappings,
      created_by: payload.userId,
      tenant_id: payload.tenantId
    })
    .select()
    .single();

  if (historyError) throw historyError;

  try {
    // Parse CSV/Excel data
    const records = parseFileContent(fileContent, fileName);
    console.log(`Parsed ${records.length} records from file`);

    // Apply field mappings
    const mappedRecords = records.map(record => applyFieldMapping(record, mappings));

    // Process records in batches
    let processedCount = 0;
    let failedCount = 0;
    const batchSize = 100;

    for (let i = 0; i < mappedRecords.length; i += batchSize) {
      const batch = mappedRecords.slice(i, i + batchSize);
      
      try {
        // Insert into transactions table (example)
        const { data, error } = await supabase
          .from('transactions')
          .insert(batch.map(record => ({
            ...record,
            user_id: payload.userId,
            tenant_id: payload.tenantId,
            import_source: 'platform_import',
            import_history_id: historyRecord.id
          })));

        if (error) throw error;
        processedCount += batch.length;
      } catch (batchError) {
        console.error('Batch processing error:', batchError);
        failedCount += batch.length;
      }
    }

    // Update history record
    await supabase
      .from('import_export_history')
      .update({
        status: failedCount === 0 ? 'completed' : 'completed_with_errors',
        records_processed: processedCount,
        records_failed: failedCount,
        completed_at: new Date().toISOString(),
        rollback_data: { original_records: mappedRecords }
      })
      .eq('id', historyRecord.id);

    return new Response(
      JSON.stringify({
        success: true,
        recordsProcessed: processedCount,
        recordsFailed: failedCount,
        historyId: historyRecord.id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    // Update history with error
    await supabase
      .from('import_export_history')
      .update({
        status: 'failed',
        error_details: { message: error.message },
        completed_at: new Date().toISOString()
      })
      .eq('id', historyRecord.id);

    throw error;
  }
}

async function initiateOAuth(supabase: any, payload: any) {
  const { platform, connectorId, redirectUri } = payload;
  
  // Generate state token for security
  const stateToken = crypto.randomUUID();
  
  // Store OAuth session
  const { data: session, error } = await supabase
    .from('oauth_sessions')
    .insert({
      connector_id: connectorId,
      platform_name: platform,
      state_token: stateToken,
      status: 'pending'
    })
    .select()
    .single();

  if (error) throw error;

  // Generate OAuth URLs based on platform
  let authUrl = '';
  
  if (platform === 'quickbooks') {
    const clientId = Deno.env.get('QUICKBOOKS_CLIENT_ID');
    const scope = 'com.intuit.quickbooks.accounting';
    authUrl = `https://appcenter.intuit.com/connect/oauth2?` +
      `client_id=${clientId}&` +
      `scope=${scope}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `access_type=offline&` +
      `state=${stateToken}`;
  } else if (platform === 'xero') {
    const clientId = Deno.env.get('XERO_CLIENT_ID');
    const scope = 'accounting.transactions accounting.contacts';
    authUrl = `https://login.xero.com/identity/connect/authorize?` +
      `response_type=code&` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${encodeURIComponent(scope)}&` +
      `state=${stateToken}`;
  }

  return new Response(
    JSON.stringify({ authUrl, stateToken }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleOAuthCallback(supabase: any, payload: any) {
  const { code, state, platform } = payload;

  // Verify state token
  const { data: session, error: sessionError } = await supabase
    .from('oauth_sessions')
    .select('*')
    .eq('state_token', state)
    .eq('status', 'pending')
    .single();

  if (sessionError || !session) {
    throw new Error('Invalid or expired OAuth state');
  }

  try {
    let tokenData;
    
    if (platform === 'quickbooks') {
      tokenData = await exchangeQuickBooksToken(code);
    } else if (platform === 'xero') {
      tokenData = await exchangeXeroToken(code);
    }

    // Store encrypted tokens
    await supabase
      .from('oauth_sessions')
      .update({
        auth_code: code,
        access_token_encrypted: tokenData.access_token, // Should be encrypted in production
        refresh_token_encrypted: tokenData.refresh_token,
        expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
        status: 'authorized'
      })
      .eq('id', session.id);

    // Update connector with OAuth credentials
    await supabase
      .from('platform_connectors')
      .update({
        oauth_credentials: {
          session_id: session.id,
          company_id: tokenData.realmId || tokenData.tenantId
        }
      })
      .eq('id', session.connector_id);

    return new Response(
      JSON.stringify({ success: true, message: 'OAuth authorization successful' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    await supabase
      .from('oauth_sessions')
      .update({ status: 'failed' })
      .eq('id', session.id);

    throw error;
  }
}

async function syncPlatformData(supabase: any, payload: any) {
  const { connectorId, dataTypes } = payload;

  // Get connector and OAuth session
  const { data: connector, error: connectorError } = await supabase
    .from('platform_connectors')
    .select(`
      *,
      oauth_sessions!inner(*)
    `)
    .eq('id', connectorId)
    .eq('oauth_sessions.status', 'authorized')
    .single();

  if (connectorError || !connector) {
    throw new Error('Connector not found or not authorized');
  }

  const results = [];

  for (const dataType of dataTypes) {
    try {
      let data;
      
      if (connector.platform_name === 'quickbooks') {
        data = await fetchQuickBooksData(connector.oauth_sessions, dataType);
      } else if (connector.platform_name === 'xero') {
        data = await fetchXeroData(connector.oauth_sessions, dataType);
      }

      // Apply field mappings and store data
      const mappedData = data.map(item => 
        applyFieldMapping(item, connector.field_mappings[dataType])
      );

      // Store in appropriate table
      await storeImportedData(supabase, dataType, mappedData, connector);
      
      results.push({
        dataType,
        recordCount: mappedData.length,
        status: 'success'
      });

    } catch (error) {
      results.push({
        dataType,
        error: error.message,
        status: 'failed'
      });
    }
  }

  return new Response(
    JSON.stringify({ results }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function rollbackImport(supabase: any, payload: any) {
  const { historyId } = payload;

  const { data: history, error } = await supabase
    .from('import_export_history')
    .select('*')
    .eq('id', historyId)
    .single();

  if (error || !history.rollback_data) {
    throw new Error('Import history not found or no rollback data available');
  }

  // Delete imported records
  await supabase
    .from('transactions')
    .delete()
    .eq('import_history_id', historyId);

  // Update history status
  await supabase
    .from('import_export_history')
    .update({
      status: 'rolled_back',
      rolled_back_at: new Date().toISOString()
    })
    .eq('id', historyId);

  return new Response(
    JSON.stringify({ success: true, message: 'Import successfully rolled back' }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Helper functions
function parseFileContent(content: string, fileName: string) {
  // Simple CSV parser - in production, use a robust library
  if (fileName.endsWith('.csv')) {
    const lines = content.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const record: any = {};
      headers.forEach((header, index) => {
        record[header] = values[index] || '';
      });
      return record;
    }).filter(record => Object.values(record).some(v => v !== ''));
  }
  
  throw new Error('Unsupported file format');
}

function applyFieldMapping(record: any, mappings: any) {
  if (!mappings) return record;
  
  const mapped: any = {};
  Object.entries(mappings).forEach(([sourceField, targetField]) => {
    if (record[sourceField] !== undefined) {
      mapped[targetField as string] = record[sourceField];
    }
  });
  
  return mapped;
}

async function exchangeQuickBooksToken(code: string) {
  // Implementation for QuickBooks token exchange
  const clientId = Deno.env.get('QUICKBOOKS_CLIENT_ID');
  const clientSecret = Deno.env.get('QUICKBOOKS_CLIENT_SECRET');
  
  // This is a simplified implementation
  return {
    access_token: 'encrypted_token',
    refresh_token: 'encrypted_refresh',
    expires_in: 3600,
    realmId: 'company_id'
  };
}

async function exchangeXeroToken(code: string) {
  // Implementation for Xero token exchange
  const clientId = Deno.env.get('XERO_CLIENT_ID');
  const clientSecret = Deno.env.get('XERO_CLIENT_SECRET');
  
  // This is a simplified implementation
  return {
    access_token: 'encrypted_token',
    refresh_token: 'encrypted_refresh',
    expires_in: 3600,
    tenantId: 'tenant_id'
  };
}

async function fetchQuickBooksData(session: any, dataType: string) {
  // Implementation for fetching QuickBooks data
  return [];
}

async function fetchXeroData(session: any, dataType: string) {
  // Implementation for fetching Xero data
  return [];
}

async function storeImportedData(supabase: any, dataType: string, data: any[], connector: any) {
  // Store data in appropriate tables based on dataType
  const tableName = dataType === 'transactions' ? 'transactions' : 'chart_of_accounts';
  
  const { error } = await supabase
    .from(tableName)
    .insert(data.map(record => ({
      ...record,
      tenant_id: connector.tenant_id,
      import_source: connector.platform_name
    })));
    
  if (error) throw error;
}