import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SyncRequest {
  connection_id: string;
  sync_type?: 'full' | 'incremental';
  force?: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { connection_id, sync_type = 'incremental', force = false }: SyncRequest = await req.json();
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Get connection details
    const { data: connection, error: connError } = await supabase
      .from('connector_connections')
      .select('*')
      .eq('id', connection_id)
      .single();

    if (connError || !connection) {
      throw new Error(`Connection not found: ${connError?.message}`);
    }

    // Route to appropriate provider sync
    let syncResult;
    switch (connection.provider) {
      case 'plaid':
        syncResult = await syncPlaidData(connection, sync_type);
        break;
      case 'bridgeft':
        syncResult = await syncBridgeFTData(connection, sync_type);
        break;
      case 'canoe':
        syncResult = await syncCanoeData(connection, sync_type);
        break;
      default:
        throw new Error(`Unsupported provider: ${connection.provider}`);
    }

    // Update connection sync status
    await supabase
      .from('connector_connections')
      .update({
        last_sync_at: new Date().toISOString(),
        next_sync_at: calculateNextSync(connection.sync_frequency),
        status: 'active',
        error_count: 0,
        last_error: null
      })
      .eq('id', connection_id);

    return new Response(JSON.stringify(syncResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Sync error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function syncPlaidData(connection: any, syncType: string) {
  // Plaid sync implementation
  return { provider: 'plaid', accounts_synced: 0, transactions_synced: 0 };
}

async function syncBridgeFTData(connection: any, syncType: string) {
  // BridgeFT sync implementation  
  return { provider: 'bridgeft', accounts_synced: 0, positions_synced: 0 };
}

async function syncCanoeData(connection: any, syncType: string) {
  // Canoe sync implementation
  return { provider: 'canoe', alternatives_synced: 0 };
}

function calculateNextSync(frequency: string): string {
  const now = new Date();
  switch (frequency) {
    case 'daily': return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
    case 'weekly': return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
    case 'monthly': return new Date(now.setMonth(now.getMonth() + 1)).toISOString();
    default: return now.toISOString();
  }
}