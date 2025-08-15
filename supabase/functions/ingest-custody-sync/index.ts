import { serviceClient } from "../_shared/auth.ts";
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from "../_shared/secrets.ts";

// Runtime checks
void SUPABASE_URL; void SUPABASE_SERVICE_ROLE_KEY;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, idempotency-key',
}

interface SyncRequest {
  connector_account_id: string
  sync_type?: 'full' | 'incremental'
  force?: boolean
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = serviceClient();

    const { connector_account_id, sync_type = 'incremental', force = false }: SyncRequest = await req.json()

    console.log(`Starting custody sync for connector account: ${connector_account_id}`)

    // Get connector account details
    const { data: connectorAccount, error: accountError } = await supabase
      .from('connector_accounts')
      .select(`
        *,
        connectors (
          connector_name,
          vendor_name,
          connector_type,
          api_endpoint,
          auth_type
        )
      `)
      .eq('id', connector_account_id)
      .single()

    if (accountError || !connectorAccount) {
      throw new Error(`Connector account not found: ${accountError?.message}`)
    }

    // Update sync status to processing
    await supabase
      .from('connector_accounts')
      .update({ 
        sync_status: 'active',
        last_sync_at: new Date().toISOString(),
        error_count: 0,
        last_error_message: null
      })
      .eq('id', connector_account_id)

    // Simulate vendor-specific sync based on connector type
    const syncResult = await performVendorSync(connectorAccount)
    
    // Store canonical data
    const { accountsCreated, positionsCreated, transactionsCreated } = await storeCanonicalData(
      supabase, 
      connectorAccount, 
      syncResult
    )

    // Emit evidence for the sync operation
    const evidenceId = await emitSyncEvidence(supabase, {
      connector_account_id,
      sync_type,
      vendor: connectorAccount.connectors.vendor_name,
      accounts_synced: accountsCreated,
      positions_synced: positionsCreated,
      transactions_synced: transactionsCreated,
      sync_result: syncResult
    })

    // Schedule next sync
    const nextSyncAt = new Date(Date.now() + getNextSyncInterval(connectorAccount.sync_frequency))
    await supabase
      .from('connector_accounts')
      .update({ 
        next_sync_at: nextSyncAt.toISOString(),
        sync_status: 'active'
      })
      .eq('id', connector_account_id)

    const response = {
      success: true,
      connector_account_id,
      vendor: connectorAccount.connectors.vendor_name,
      sync_type,
      accounts_created: accountsCreated,
      positions_created: positionsCreated,
      transactions_created: transactionsCreated,
      evidence_id: evidenceId,
      next_sync_at: nextSyncAt.toISOString()
    }

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Custody sync failed:', error)
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function performVendorSync(connectorAccount: any) {
  // Simulate vendor-specific API calls
  const vendor = connectorAccount.connectors.vendor_name.toLowerCase()
  
  console.log(`Performing ${vendor} sync for account: ${connectorAccount.account_name}`)
  
  // Stub vendor implementations
  switch (vendor) {
    case 'charles schwab':
      return await syncSchwabData(connectorAccount)
    case 'fidelity':
      return await syncFidelityData(connectorAccount)
    case 'bny mellon pershing':
      return await syncPershingData(connectorAccount)
    default:
      return await syncGenericCustodyData(connectorAccount)
  }
}

async function syncSchwabData(connectorAccount: any) {
  // Stub Schwab API sync
  console.log('Syncing Schwab custody data...')
  
  return {
    accounts: [
      {
        account_number: 'SCH001234567',
        account_name: 'Schwab Individual Account',
        account_type: 'investment',
        current_balance: 1250000.50,
        currency: 'USD'
      }
    ],
    positions: [
      {
        symbol: 'AAPL',
        asset_name: 'Apple Inc.',
        asset_class: 'equity',
        quantity: 500,
        unit_price: 175.25,
        market_value: 87625.00
      },
      {
        symbol: 'MSFT',
        asset_name: 'Microsoft Corporation',
        asset_class: 'equity',
        quantity: 300,
        unit_price: 378.85,
        market_value: 113655.00
      }
    ],
    transactions: [
      {
        external_transaction_id: 'SCH_TXN_001',
        transaction_type: 'buy',
        symbol: 'AAPL',
        quantity: 100,
        price: 174.50,
        amount: 17450.00,
        transaction_date: new Date().toISOString().split('T')[0]
      }
    ]
  }
}

async function syncFidelityData(connectorAccount: any) {
  // Stub Fidelity API sync
  console.log('Syncing Fidelity custody data...')
  
  return {
    accounts: [{
      account_number: 'FID987654321',
      account_name: 'Fidelity Brokerage Account',
      account_type: 'investment',
      current_balance: 850000.75,
      currency: 'USD'
    }],
    positions: [],
    transactions: []
  }
}

async function syncPershingData(connectorAccount: any) {
  // Stub Pershing NetX360 API sync
  console.log('Syncing Pershing custody data...')
  
  return {
    accounts: [{
      account_number: 'PER555666777',
      account_name: 'Pershing Custody Account',
      account_type: 'custody',
      current_balance: 2500000.00,
      currency: 'USD'
    }],
    positions: [],
    transactions: []
  }
}

async function syncGenericCustodyData(connectorAccount: any) {
  // Generic custody data sync
  console.log('Syncing generic custody data...')
  
  return {
    accounts: [{
      account_number: 'GEN123456789',
      account_name: 'Generic Custody Account',
      account_type: 'custody',
      current_balance: 500000.00,
      currency: 'USD'
    }],
    positions: [],
    transactions: []
  }
}

async function storeCanonicalData(supabase: any, connectorAccount: any, syncResult: any) {
  let accountsCreated = 0
  let positionsCreated = 0
  let transactionsCreated = 0

  // Store accounts
  for (const accountData of syncResult.accounts) {
    const { error } = await supabase
      .from('accounts')
      .upsert({
        connector_account_id: connectorAccount.id,
        user_id: connectorAccount.user_id,
        account_number: accountData.account_number,
        account_name: accountData.account_name,
        account_type: accountData.account_type,
        institution_name: connectorAccount.connectors.vendor_name,
        currency: accountData.currency,
        current_balance: accountData.current_balance,
        last_updated_at: new Date().toISOString()
      }, {
        onConflict: 'connector_account_id,account_number'
      })
    
    if (!error) accountsCreated++
  }

  // Store positions if any accounts were created
  if (syncResult.positions && syncResult.positions.length > 0) {
    const { data: accounts } = await supabase
      .from('accounts')
      .select('id')
      .eq('connector_account_id', connectorAccount.id)
      .limit(1)

    if (accounts && accounts.length > 0) {
      const accountId = accounts[0].id
      
      for (const positionData of syncResult.positions) {
        const { error } = await supabase
          .from('positions')
          .upsert({
            account_id: accountId,
            user_id: connectorAccount.user_id,
            symbol: positionData.symbol,
            asset_name: positionData.asset_name,
            asset_class: positionData.asset_class,
            quantity: positionData.quantity,
            unit_price: positionData.unit_price,
            market_value: positionData.market_value,
            as_of_date: new Date().toISOString().split('T')[0]
          }, {
            onConflict: 'account_id,symbol,as_of_date'
          })
        
        if (!error) positionsCreated++
      }
    }
  }

  // Store transactions
  if (syncResult.transactions && syncResult.transactions.length > 0) {
    const { data: accounts } = await supabase
      .from('accounts')
      .select('id')
      .eq('connector_account_id', connectorAccount.id)
      .limit(1)

    if (accounts && accounts.length > 0) {
      const accountId = accounts[0].id
      
      for (const transactionData of syncResult.transactions) {
        const { error } = await supabase
          .from('transactions')
          .upsert({
            account_id: accountId,
            user_id: connectorAccount.user_id,
            external_transaction_id: transactionData.external_transaction_id,
            transaction_type: transactionData.transaction_type,
            symbol: transactionData.symbol,
            quantity: transactionData.quantity,
            price: transactionData.price,
            amount: transactionData.amount,
            transaction_date: transactionData.transaction_date
          }, {
            onConflict: 'account_id,external_transaction_id'
          })
        
        if (!error) transactionsCreated++
      }
    }
  }

  return { accountsCreated, positionsCreated, transactionsCreated }
}

async function emitSyncEvidence(supabase: any, syncData: any) {
  try {
    const { data, error } = await supabase.functions.invoke('emit-receipt', {
      body: {
        subject_type: 'custody_sync',
        subject_id: syncData.connector_account_id,
        event_type: 'data_ingested',
        explanation: `Custody data sync completed for ${syncData.vendor}`,
        metadata: {
          sync_type: syncData.sync_type,
          vendor: syncData.vendor,
          accounts_synced: syncData.accounts_synced,
          positions_synced: syncData.positions_synced,
          transactions_synced: syncData.transactions_synced,
          timestamp: new Date().toISOString()
        }
      }
    })

    if (error) {
      console.error('Failed to emit sync evidence:', error)
      return null
    }

    return data?.evidence_id
  } catch (error) {
    console.error('Error emitting sync evidence:', error)
    return null
  }
}

function getNextSyncInterval(frequency: string): number {
  switch (frequency) {
    case 'realtime':
      return 15 * 60 * 1000 // 15 minutes
    case 'hourly':
      return 60 * 60 * 1000 // 1 hour
    case 'daily':
      return 24 * 60 * 60 * 1000 // 24 hours
    case 'weekly':
      return 7 * 24 * 60 * 60 * 1000 // 7 days
    default:
      return 24 * 60 * 60 * 1000 // Default to daily
  }
}