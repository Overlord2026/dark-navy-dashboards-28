/**
 * Reconciliation Job - Scheduled worker to reconcile positions and transactions
 * 
 * This job runs after custody sync to:
 * 1. Validate position quantities match transaction history
 * 2. Identify discrepancies and create exceptions
 * 3. Update position confidence scores
 * 4. Trigger alerts for significant variances
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8'

interface ReconciliationJob {
  entity_id: string;
  account_ids: string[];
  sync_timestamp: string;
  tolerance_percentage?: number;
}

interface PositionReconciliation {
  account_id: string;
  instrument_id: string;
  calculated_quantity: number;
  reported_quantity: number;
  variance: number;
  variance_percentage: number;
  confidence_score: number;
  status: 'match' | 'variance' | 'error';
}

export async function runReconciliationJob(job: ReconciliationJob) {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  )

  const tolerance = job.tolerance_percentage || 0.01 // 1% default tolerance
  console.log(`Starting reconciliation for entity ${job.entity_id}, accounts: ${job.account_ids.join(', ')}`)

  const results: PositionReconciliation[] = []
  let exceptionsCreated = 0

  try {
    for (const account_id of job.account_ids) {
      console.log(`Reconciling account ${account_id}`)

      // Get current positions for the account
      const { data: positions, error: positionsError } = await supabase
        .from('positions')
        .select(`
          account_id,
          instrument_id,
          quantity,
          as_of,
          instruments (symbol, name)
        `)
        .eq('account_id', account_id)
        .order('as_of', { ascending: false })

      if (positionsError) {
        console.error(`Error fetching positions for account ${account_id}:`, positionsError)
        continue
      }

      if (!positions || positions.length === 0) {
        console.log(`No positions found for account ${account_id}`)
        continue
      }

      // Group positions by instrument (latest as_of per instrument)
      const latestPositions = positions.reduce((acc, pos) => {
        if (!acc[pos.instrument_id] || pos.as_of > acc[pos.instrument_id].as_of) {
          acc[pos.instrument_id] = pos
        }
        return acc
      }, {} as Record<string, any>)

      // For each position, calculate expected quantity from transactions
      for (const position of Object.values(latestPositions)) {
        try {
          const reconciliation = await reconcilePosition(supabase, position, tolerance)
          results.push(reconciliation)

          // Create exception if variance exceeds tolerance
          if (reconciliation.status === 'variance' || reconciliation.status === 'error') {
            await createReconciliationException(supabase, reconciliation, position)
            exceptionsCreated++
          }

          // Update position confidence score
          await updatePositionConfidence(supabase, position, reconciliation.confidence_score)

        } catch (error) {
          console.error(`Error reconciling position ${position.instrument_id} in account ${account_id}:`, error)
          
          const errorReconciliation: PositionReconciliation = {
            account_id: position.account_id,
            instrument_id: position.instrument_id,
            calculated_quantity: 0,
            reported_quantity: position.quantity,
            variance: position.quantity,
            variance_percentage: 100,
            confidence_score: 0,
            status: 'error'
          }
          
          results.push(errorReconciliation)
          await createReconciliationException(supabase, errorReconciliation, position, error.message)
          exceptionsCreated++
        }
      }
    }

    // Log reconciliation summary
    const summary = {
      entity_id: job.entity_id,
      accounts_processed: job.account_ids.length,
      positions_reconciled: results.length,
      matches: results.filter(r => r.status === 'match').length,
      variances: results.filter(r => r.status === 'variance').length,
      errors: results.filter(r => r.status === 'error').length,
      exceptions_created: exceptionsCreated,
      avg_confidence: results.length > 0 ? results.reduce((sum, r) => sum + r.confidence_score, 0) / results.length : 0,
      completed_at: new Date().toISOString()
    }

    console.log('Reconciliation completed:', summary)

    // Store reconciliation results
    await supabase
      .from('reconciliation_results')
      .insert({
        entity_id: job.entity_id,
        sync_timestamp: job.sync_timestamp,
        account_ids: job.account_ids,
        summary,
        details: results,
        created_at: new Date().toISOString()
      })

    return summary

  } catch (error) {
    console.error('Reconciliation job failed:', error)
    throw error
  }
}

async function reconcilePosition(
  supabase: any, 
  position: any, 
  tolerance: number
): Promise<PositionReconciliation> {
  const { account_id, instrument_id, quantity: reported_quantity } = position

  // Get all transactions for this instrument in this account
  const { data: transactions, error: transactionError } = await supabase
    .from('transactions')
    .select('type, quantity, amount, trade_date')
    .eq('account_id', account_id)
    .eq('instrument_id', instrument_id)
    .order('trade_date', { ascending: true })

  if (transactionError) {
    throw new Error(`Failed to fetch transactions: ${transactionError.message}`)
  }

  // Calculate expected quantity from transaction history
  let calculated_quantity = 0
  const transactionTypes = {
    purchase: 1,
    sale: -1,
    buy: 1,
    sell: -1,
    transfer_in: 1,
    transfer_out: -1,
    dividend_reinvestment: 1,
    stock_split: 0, // Handle separately
    stock_dividend: 1
  }

  for (const txn of transactions || []) {
    const multiplier = transactionTypes[txn.type] || 0
    if (multiplier !== 0 && txn.quantity) {
      calculated_quantity += txn.quantity * multiplier
    }
  }

  // Calculate variance
  const variance = Math.abs(calculated_quantity - reported_quantity)
  const variance_percentage = reported_quantity !== 0 ? (variance / Math.abs(reported_quantity)) * 100 : 0

  // Determine status and confidence score
  let status: 'match' | 'variance' | 'error'
  let confidence_score: number

  if (variance_percentage <= tolerance * 100) {
    status = 'match'
    confidence_score = Math.max(0.9, 1 - variance_percentage / 100)
  } else if (variance_percentage <= 5) { // 5% threshold for variance vs error
    status = 'variance'
    confidence_score = Math.max(0.3, 0.8 - variance_percentage / 100)
  } else {
    status = 'error'
    confidence_score = Math.max(0.1, 0.5 - variance_percentage / 200)
  }

  return {
    account_id,
    instrument_id,
    calculated_quantity,
    reported_quantity,
    variance,
    variance_percentage,
    confidence_score,
    status
  }
}

async function createReconciliationException(
  supabase: any,
  reconciliation: PositionReconciliation,
  position: any,
  error_message?: string
) {
  const severity = reconciliation.variance_percentage > 10 ? 'high' : 
                   reconciliation.variance_percentage > 2 ? 'medium' : 'low'

  const details = {
    reconciliation_type: 'position_quantity',
    instrument_symbol: position.instruments?.symbol,
    instrument_name: position.instruments?.name,
    reported_quantity: reconciliation.reported_quantity,
    calculated_quantity: reconciliation.calculated_quantity,
    variance: reconciliation.variance,
    variance_percentage: reconciliation.variance_percentage,
    confidence_score: reconciliation.confidence_score,
    error_message
  }

  await supabase
    .from('exceptions')
    .insert({
      account_id: reconciliation.account_id,
      kind: 'reconciliation_variance',
      details,
      severity,
      opened_at: new Date().toISOString()
    })
}

async function updatePositionConfidence(
  supabase: any,
  position: any,
  confidence_score: number
) {
  // Add confidence score to position metadata
  const { error } = await supabase
    .from('positions')
    .update({
      metadata: {
        ...position.metadata,
        confidence_score,
        last_reconciled: new Date().toISOString()
      },
      updated_at: new Date().toISOString()
    })
    .eq('account_id', position.account_id)
    .eq('instrument_id', position.instrument_id)
    .eq('as_of', position.as_of)

  if (error) {
    console.error('Failed to update position confidence:', error)
  }
}

// CLI entry point for manual execution
if (import.meta.main) {
  const job: ReconciliationJob = {
    entity_id: Deno.args[0] || '',
    account_ids: Deno.args[1]?.split(',') || [],
    sync_timestamp: new Date().toISOString(),
    tolerance_percentage: parseFloat(Deno.args[2] || '0.01')
  }

  if (!job.entity_id || job.account_ids.length === 0) {
    console.error('Usage: deno run reconciliation-job.ts <entity_id> <account_ids_comma_separated> [tolerance_percentage]')
    Deno.exit(1)
  }

  try {
    await runReconciliationJob(job)
    console.log('Reconciliation job completed successfully')
  } catch (error) {
    console.error('Reconciliation job failed:', error)
    Deno.exit(1)
  }
}