import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SyncRequest {
  entity_id: string;
  connector_account_id: string;
  sync_mode: 'delta' | 'full';
  start_date?: string;
  end_date?: string;
}

interface CustodyAccount {
  account_id: string;
  account_number: string;
  account_type: string;
  custodian: string;
  base_currency: string;
  status: string;
}

interface CustodyPosition {
  account_id: string;
  symbol: string;
  name: string;
  quantity: number;
  cost_basis?: number;
  market_value: number;
  as_of: string;
  identifiers?: Record<string, string>;
}

interface CustodyTransaction {
  account_id: string;
  symbol?: string;
  type: string;
  quantity?: number;
  amount: number;
  trade_date: string;
  settle_date?: string;
  description?: string;
  identifiers?: Record<string, string>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { entity_id, connector_account_id, sync_mode, start_date, end_date }: SyncRequest = await req.json()

    // Environment configuration
    const CONNECTOR_VENDOR = Deno.env.get('CONNECTOR_VENDOR') || 'generic'
    const CONNECTOR_API_BASE = Deno.env.get('CONNECTOR_API_BASE')
    const CONNECTOR_API_KEY = Deno.env.get('CONNECTOR_API_KEY')
    const PAGE_SIZE = parseInt(Deno.env.get('PAGE_SIZE') || '100')
    const START_DATE = start_date || Deno.env.get('START_DATE') || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    if (!CONNECTOR_API_BASE || !CONNECTOR_API_KEY) {
      throw new Error('Missing required environment variables: CONNECTOR_API_BASE, CONNECTOR_API_KEY')
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    console.log(`Starting custody sync for entity ${entity_id}, connector_account ${connector_account_id}, mode: ${sync_mode}`)

    // Step 1: Resolve connector_accounts row
    const { data: connectorAccount, error: connectorError } = await supabaseClient
      .from('connector_accounts')
      .select('*')
      .eq('connector_account_id', connector_account_id)
      .eq('entity_id', entity_id)
      .single()

    if (connectorError || !connectorAccount) {
      throw new Error(`Connector account not found: ${connectorError?.message}`)
    }

    const { institution_id, consent_token, connector_id } = connectorAccount

    // Helper function for API calls with retry logic
    async function apiCallWithRetry(url: string, options: RequestInit, maxRetries = 3): Promise<Response> {
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          const response = await fetch(url, {
            ...options,
            headers: {
              'Authorization': `Bearer ${consent_token}`,
              'Content-Type': 'application/json',
              'X-API-Key': CONNECTOR_API_KEY,
              ...options.headers,
            },
          })

          if (response.status === 429 || response.status >= 500) {
            const backoffMs = Math.pow(2, attempt) * 1000 + Math.random() * 1000
            console.log(`API call failed (${response.status}), retrying in ${backoffMs}ms (attempt ${attempt + 1}/${maxRetries})`)
            await new Promise(resolve => setTimeout(resolve, backoffMs))
            continue
          }

          return response
        } catch (error) {
          if (attempt === maxRetries - 1) throw error
          const backoffMs = Math.pow(2, attempt) * 1000 + Math.random() * 1000
          console.log(`API call error, retrying in ${backoffMs}ms:`, error.message)
          await new Promise(resolve => setTimeout(resolve, backoffMs))
        }
      }
      throw new Error('Max retries exceeded')
    }

    // Helper function to record evidence packages
    async function recordEvidencePackage(data: any, vendor: string, institution: string) {
      const rawJson = JSON.stringify(data)
      const sha256 = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(rawJson))
      const hashHex = Array.from(new Uint8Array(sha256)).map(b => b.toString(16).padStart(2, '0')).join('')

      await supabaseClient
        .from('evidence_packages')
        .insert({
          source_id: connector_account_id,
          vendor,
          institution,
          sha256: hashHex,
          captured_at: new Date().toISOString(),
          metadata: { size: rawJson.length, record_count: Array.isArray(data) ? data.length : 1 }
        })

      return hashHex
    }

    // Helper function to record exceptions
    async function recordException(account_id: string | null, kind: string, details: any, severity: 'low' | 'medium' | 'high' = 'medium') {
      await supabaseClient
        .from('exceptions')
        .insert({
          account_id,
          kind,
          details,
          severity,
          opened_at: new Date().toISOString()
        })
    }

    // Helper function to emit events
    async function emitEvent(event_type: string, payload: any) {
      console.log(`Emitting event: ${event_type}`, payload)
      // In a real implementation, you might use a message queue or pub/sub system
    }

    let syncResults = {
      accounts_synced: 0,
      positions_synced: 0,
      transactions_synced: 0,
      errors: [] as string[]
    }

    try {
      // Step 2: Pull Accounts
      console.log('Fetching accounts...')
      const accountsResponse = await apiCallWithRetry(
        `${CONNECTOR_API_BASE}/accounts?institution_id=${institution_id}`,
        { method: 'GET' }
      )

      if (!accountsResponse.ok) {
        throw new Error(`Failed to fetch accounts: ${accountsResponse.status} ${accountsResponse.statusText}`)
      }

      const accountsData = await accountsResponse.json()
      await recordEvidencePackage(accountsData, CONNECTOR_VENDOR, institution_id)

      // Map and upsert accounts
      const custodyAccounts: CustodyAccount[] = Array.isArray(accountsData.accounts) ? accountsData.accounts : accountsData
      
      for (const custodyAccount of custodyAccounts) {
        try {
          // Mask account number (show last 4 digits)
          const account_number_masked = custodyAccount.account_number.replace(/^.+(.{4})$/, '****$1')

          const { error: accountError } = await supabaseClient
            .from('accounts')
            .upsert({
              account_id: custodyAccount.account_id,
              portfolio_id: entity_id, // Assuming portfolio_id maps to entity_id for simplicity
              custodian: custodyAccount.custodian,
              account_number_masked,
              account_type: custodyAccount.account_type,
              base_currency: custodyAccount.base_currency,
              status: custodyAccount.status,
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'account_id'
            })

          if (accountError) {
            await recordException(custodyAccount.account_id, 'account_upsert_failed', accountError)
            syncResults.errors.push(`Account ${custodyAccount.account_id}: ${accountError.message}`)
          } else {
            syncResults.accounts_synced++
            await emitEvent('account.upserted', { account_id: custodyAccount.account_id, entity_id })
          }
        } catch (error) {
          await recordException(custodyAccount.account_id, 'account_processing_error', { error: error.message })
          syncResults.errors.push(`Account ${custodyAccount.account_id}: ${error.message}`)
        }
      }

      // Step 3: Pull Positions for each account
      console.log('Fetching positions...')
      for (const account of custodyAccounts) {
        try {
          const positionsResponse = await apiCallWithRetry(
            `${CONNECTOR_API_BASE}/accounts/${account.account_id}/positions`,
            { method: 'GET' }
          )

          if (!positionsResponse.ok) {
            throw new Error(`Failed to fetch positions for account ${account.account_id}: ${positionsResponse.status}`)
          }

          const positionsData = await positionsResponse.json()
          const positionsHash = await recordEvidencePackage(positionsData, CONNECTOR_VENDOR, institution_id)

          const custodyPositions: CustodyPosition[] = Array.isArray(positionsData.positions) ? positionsData.positions : positionsData

          for (const position of custodyPositions) {
            try {
              // Create idempotency key
              const source_hash = await crypto.subtle.digest('SHA-256', 
                new TextEncoder().encode(`${account.account_id}:${position.symbol}:${position.as_of}:${positionsHash}`)
              )
              const idempotency_key = Array.from(new Uint8Array(source_hash.slice(0, 16)))
                .map(b => b.toString(16).padStart(2, '0')).join('')

              // First, ensure instrument exists
              const { data: instrument, error: instrumentError } = await supabaseClient
                .from('instruments')
                .upsert({
                  symbol: position.symbol,
                  name: position.name,
                  asset_class: 'equity', // Default, should be mapped from vendor data
                  currency: account.base_currency,
                  identifiers: position.identifiers || {}
                }, {
                  onConflict: 'symbol',
                  ignoreDuplicates: false
                })
                .select('instrument_id')
                .single()

              if (instrumentError) {
                throw new Error(`Failed to upsert instrument: ${instrumentError.message}`)
              }

              const { error: positionError } = await supabaseClient
                .from('positions')
                .upsert({
                  account_id: account.account_id,
                  instrument_id: instrument.instrument_id,
                  quantity: position.quantity,
                  cost_basis: position.cost_basis,
                  market_value: position.market_value,
                  as_of: position.as_of,
                  source: CONNECTOR_VENDOR,
                  source_hash: idempotency_key,
                  updated_at: new Date().toISOString()
                }, {
                  onConflict: 'account_id,instrument_id,as_of,source_hash'
                })

              if (positionError) {
                await recordException(account.account_id, 'position_upsert_failed', positionError)
                syncResults.errors.push(`Position ${position.symbol} in ${account.account_id}: ${positionError.message}`)
              } else {
                syncResults.positions_synced++
                await emitEvent('position.upserted', { 
                  account_id: account.account_id, 
                  instrument_id: instrument.instrument_id,
                  entity_id 
                })
              }
            } catch (error) {
              await recordException(account.account_id, 'position_processing_error', { 
                position: position.symbol, 
                error: error.message 
              })
              syncResults.errors.push(`Position ${position.symbol}: ${error.message}`)
            }
          }
        } catch (error) {
          await recordException(account.account_id, 'positions_fetch_failed', { error: error.message })
          syncResults.errors.push(`Positions for ${account.account_id}: ${error.message}`)
        }
      }

      // Step 4: Pull Transactions for each account
      console.log('Fetching transactions...')
      for (const account of custodyAccounts) {
        try {
          const transactionsResponse = await apiCallWithRetry(
            `${CONNECTOR_API_BASE}/accounts/${account.account_id}/transactions?start_date=${START_DATE}&end_date=${end_date || new Date().toISOString().split('T')[0]}`,
            { method: 'GET' }
          )

          if (!transactionsResponse.ok) {
            throw new Error(`Failed to fetch transactions for account ${account.account_id}: ${transactionsResponse.status}`)
          }

          const transactionsData = await transactionsResponse.json()
          const transactionsHash = await recordEvidencePackage(transactionsData, CONNECTOR_VENDOR, institution_id)

          const custodyTransactions: CustodyTransaction[] = Array.isArray(transactionsData.transactions) ? transactionsData.transactions : transactionsData

          for (const transaction of custodyTransactions) {
            try {
              // Create idempotency key
              const source_hash = await crypto.subtle.digest('SHA-256',
                new TextEncoder().encode(`${account.account_id}:${transaction.trade_date}:${transaction.type}:${transaction.amount}:${transactionsHash}`)
              )
              const idempotency_key = Array.from(new Uint8Array(source_hash.slice(0, 16)))
                .map(b => b.toString(16).padStart(2, '0')).join('')

              let instrument_id = null
              if (transaction.symbol) {
                const { data: instrument } = await supabaseClient
                  .from('instruments')
                  .select('instrument_id')
                  .eq('symbol', transaction.symbol)
                  .single()
                
                instrument_id = instrument?.instrument_id
              }

              const { error: transactionError } = await supabaseClient
                .from('transactions')
                .upsert({
                  account_id: account.account_id,
                  instrument_id,
                  type: transaction.type,
                  quantity: transaction.quantity,
                  amount: transaction.amount,
                  trade_date: transaction.trade_date,
                  settle_date: transaction.settle_date,
                  description: transaction.description,
                  source: CONNECTOR_VENDOR,
                  source_hash: idempotency_key,
                  updated_at: new Date().toISOString()
                }, {
                  onConflict: 'account_id,trade_date,type,amount,source_hash'
                })

              if (transactionError) {
                await recordException(account.account_id, 'transaction_upsert_failed', transactionError)
                syncResults.errors.push(`Transaction ${transaction.type} in ${account.account_id}: ${transactionError.message}`)
              } else {
                syncResults.transactions_synced++
                await emitEvent('transaction.booked', { 
                  account_id: account.account_id, 
                  transaction_type: transaction.type,
                  entity_id 
                })
              }
            } catch (error) {
              await recordException(account.account_id, 'transaction_processing_error', { 
                transaction_type: transaction.type, 
                error: error.message 
              })
              syncResults.errors.push(`Transaction ${transaction.type}: ${error.message}`)
            }
          }
        } catch (error) {
          await recordException(account.account_id, 'transactions_fetch_failed', { error: error.message })
          syncResults.errors.push(`Transactions for ${account.account_id}: ${error.message}`)
        }
      }

      // Step 5: Enqueue reconciliation job for synced accounts
      if (syncResults.positions_synced > 0) {
        console.log('Enqueueing reconciliation job...')
        const accountIds = custodyAccounts.map(a => a.account_id)
        
        // In a real implementation, you would enqueue this to a job queue
        // For now, we'll just log it
        console.log(`Reconciliation needed for accounts: ${accountIds.join(', ')}`)
        
        await emitEvent('reconciliation.enqueued', { 
          entity_id, 
          account_ids: accountIds,
          sync_timestamp: new Date().toISOString()
        })
      }

    } catch (error) {
      console.error('Custody sync failed:', error)
      await recordException(null, 'custody_sync_failed', { 
        entity_id, 
        connector_account_id, 
        error: error.message 
      }, 'high')
      syncResults.errors.push(`Sync failed: ${error.message}`)
    }

    console.log('Custody sync completed:', syncResults)

    return new Response(
      JSON.stringify({ 
        success: syncResults.errors.length === 0,
        results: syncResults
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in custody sync function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})