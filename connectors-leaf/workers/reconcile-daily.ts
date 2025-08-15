#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const { publishEvent } = require('../shared/events');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function processReconciliationDaily() {
  console.log('Starting daily reconciliation process...');
  
  try {
    const reconciliationDate = new Date().toISOString().split('T')[0];
    
    // Get all active connector accounts
    const { data: connectorAccounts, error: accountsError } = await supabase
      .from('connector_accounts')
      .select('id, user_id, account_name, sync_status, last_sync_at, connectors(vendor_name)')
      .eq('sync_status', 'active');

    if (accountsError) throw accountsError;

    console.log(`Processing reconciliation for ${connectorAccounts.length} connector accounts`);

    const reconciliationResults = [];

    for (const connectorAccount of connectorAccounts) {
      const reconciliationData = await reconcileConnectorAccount(connectorAccount, reconciliationDate);
      reconciliationResults.push(reconciliationData);
    }

    // Process exceptions and create reports
    await processDataQualityExceptions(reconciliationResults);
    await createReconciliationReport(reconciliationResults, reconciliationDate);

    await publishEvent({
      kind: 'reconciliation.daily_completed',
      payload: { 
        reconciliation_date: reconciliationDate,
        accounts_processed: connectorAccounts.length,
        exceptions_found: reconciliationResults.reduce((sum, r) => sum + r.exceptions.length, 0)
      },
      entity_id: null // System-level event
    });

    console.log('Daily reconciliation process completed successfully');
  } catch (error) {
    console.error('Daily reconciliation process failed:', error);
    
    await publishEvent({
      kind: 'reconciliation.daily_failed',
      payload: { 
        error: error.message,
        timestamp: new Date().toISOString()
      },
      entity_id: null
    });
  }
}

async function reconcileConnectorAccount(connectorAccount, reconciliationDate) {
  console.log(`Reconciling connector account: ${connectorAccount.account_name}`);
  
  try {
    const reconciliationData = {
      connector_account_id: connectorAccount.id,
      user_id: connectorAccount.user_id,
      vendor: connectorAccount.connectors.vendor_name,
      reconciliation_date: reconciliationDate,
      exceptions: [],
      summary: {
        accounts_checked: 0,
        positions_checked: 0,
        transactions_checked: 0,
        discrepancies_found: 0
      }
    };

    // Check account data integrity
    const accountDiscrepancies = await checkAccountDataIntegrity(connectorAccount.id);
    reconciliationData.summary.accounts_checked = accountDiscrepancies.checked;
    reconciliationData.exceptions.push(...accountDiscrepancies.exceptions);

    // Check position data quality
    const positionDiscrepancies = await checkPositionDataQuality(connectorAccount.id);
    reconciliationData.summary.positions_checked = positionDiscrepancies.checked;
    reconciliationData.exceptions.push(...positionDiscrepancies.exceptions);

    // Check transaction completeness
    const transactionDiscrepancies = await checkTransactionCompleteness(connectorAccount.id);
    reconciliationData.summary.transactions_checked = transactionDiscrepancies.checked;
    reconciliationData.exceptions.push(...transactionDiscrepancies.exceptions);

    // Check sync freshness
    const syncDiscrepancies = await checkSyncFreshness(connectorAccount);
    reconciliationData.exceptions.push(...syncDiscrepancies.exceptions);

    reconciliationData.summary.discrepancies_found = reconciliationData.exceptions.length;

    return reconciliationData;

  } catch (error) {
    console.error(`Failed to reconcile connector account ${connectorAccount.id}:`, error);
    return {
      connector_account_id: connectorAccount.id,
      user_id: connectorAccount.user_id,
      vendor: connectorAccount.connectors?.vendor_name || 'unknown',
      reconciliation_date: reconciliationDate,
      error: error.message,
      exceptions: [{
        entity_type: 'connector_account',
        entity_id: connectorAccount.id,
        exception_type: 'processing_error',
        title: 'Reconciliation Failed',
        description: error.message
      }],
      summary: { accounts_checked: 0, positions_checked: 0, transactions_checked: 0, discrepancies_found: 1 }
    };
  }
}

async function checkAccountDataIntegrity(connectorAccountId) {
  const exceptions = [];
  
  // Check for accounts with missing required fields
  const { data: accountsWithIssues } = await supabase
    .from('accounts')
    .select('id, account_number, account_name, current_balance')
    .eq('connector_account_id', connectorAccountId)
    .or('account_number.is.null,account_name.is.null,current_balance.is.null');

  for (const account of accountsWithIssues || []) {
    exceptions.push({
      entity_type: 'account',
      entity_id: account.id,
      exception_type: 'data_quality',
      severity: 'high',
      title: 'Missing Required Account Data',
      description: `Account ${account.account_number || 'unknown'} has missing required fields`
    });
  }

  // Check for duplicate account numbers
  const { data: duplicates } = await supabase
    .rpc('find_duplicate_accounts', { p_connector_account_id: connectorAccountId });

  for (const duplicate of duplicates || []) {
    exceptions.push({
      entity_type: 'account',
      entity_id: duplicate.id,
      exception_type: 'data_quality',
      severity: 'medium',
      title: 'Duplicate Account Number',
      description: `Account number ${duplicate.account_number} appears multiple times`
    });
  }

  const { count: totalAccounts } = await supabase
    .from('accounts')
    .select('id', { count: 'exact', head: true })
    .eq('connector_account_id', connectorAccountId);

  return {
    checked: totalAccounts || 0,
    exceptions
  };
}

async function checkPositionDataQuality(connectorAccountId) {
  const exceptions = [];
  
  // Get all accounts for this connector
  const { data: accounts } = await supabase
    .from('accounts')
    .select('id')
    .eq('connector_account_id', connectorAccountId);

  if (!accounts || accounts.length === 0) {
    return { checked: 0, exceptions };
  }

  const accountIds = accounts.map(a => a.id);

  // Check for positions with negative quantities (should not normally happen)
  const { data: negativePositions } = await supabase
    .from('positions')
    .select('id, symbol, quantity')
    .in('account_id', accountIds)
    .lt('quantity', 0);

  for (const position of negativePositions || []) {
    exceptions.push({
      entity_type: 'position',
      entity_id: position.id,
      exception_type: 'data_quality',
      severity: 'medium',
      title: 'Negative Position Quantity',
      description: `Position ${position.symbol} has negative quantity: ${position.quantity}`
    });
  }

  // Check for positions with zero market value but non-zero quantity
  const { data: zeroValuePositions } = await supabase
    .from('positions')
    .select('id, symbol, quantity, market_value')
    .in('account_id', accountIds)
    .gt('quantity', 0)
    .eq('market_value', 0);

  for (const position of zeroValuePositions || []) {
    exceptions.push({
      entity_type: 'position',
      entity_id: position.id,
      exception_type: 'data_quality',
      severity: 'low',
      title: 'Zero Market Value Position',
      description: `Position ${position.symbol} has quantity but zero market value`
    });
  }

  const { count: totalPositions } = await supabase
    .from('positions')
    .select('id', { count: 'exact', head: true })
    .in('account_id', accountIds);

  return {
    checked: totalPositions || 0,
    exceptions
  };
}

async function checkTransactionCompleteness(connectorAccountId) {
  const exceptions = [];
  
  // Get all accounts for this connector
  const { data: accounts } = await supabase
    .from('accounts')
    .select('id')
    .eq('connector_account_id', connectorAccountId);

  if (!accounts || accounts.length === 0) {
    return { checked: 0, exceptions };
  }

  const accountIds = accounts.map(a => a.id);

  // Check for transactions with missing settlement dates (older than 3 days)
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  const { data: unsettledTransactions } = await supabase
    .from('transactions')
    .select('id, external_transaction_id, transaction_date')
    .in('account_id', accountIds)
    .is('settlement_date', null)
    .lte('transaction_date', threeDaysAgo);

  for (const transaction of unsettledTransactions || []) {
    exceptions.push({
      entity_type: 'transaction',
      entity_id: transaction.id,
      exception_type: 'data_quality',
      severity: 'medium',
      title: 'Missing Settlement Date',
      description: `Transaction ${transaction.external_transaction_id} from ${transaction.transaction_date} lacks settlement date`
    });
  }

  // Check for transactions with zero amounts
  const { data: zeroAmountTransactions } = await supabase
    .from('transactions')
    .select('id, external_transaction_id, transaction_type')
    .in('account_id', accountIds)
    .eq('amount', 0)
    .not('transaction_type', 'in', '(fee,interest)');

  for (const transaction of zeroAmountTransactions || []) {
    exceptions.push({
      entity_type: 'transaction',
      entity_id: transaction.id,
      exception_type: 'data_quality',
      severity: 'low',
      title: 'Zero Amount Transaction',
      description: `Transaction ${transaction.external_transaction_id} has zero amount`
    });
  }

  const { count: totalTransactions } = await supabase
    .from('transactions')
    .select('id', { count: 'exact', head: true })
    .in('account_id', accountIds);

  return {
    checked: totalTransactions || 0,
    exceptions
  };
}

async function checkSyncFreshness(connectorAccount) {
  const exceptions = [];
  
  // Check if last sync was more than expected frequency
  if (connectorAccount.last_sync_at) {
    const lastSync = new Date(connectorAccount.last_sync_at);
    const now = new Date();
    const hoursSinceSync = (now.getTime() - lastSync.getTime()) / (1000 * 60 * 60);
    
    let expectedHours = 24; // Default to daily
    if (connectorAccount.sync_frequency === 'hourly') expectedHours = 1;
    else if (connectorAccount.sync_frequency === 'realtime') expectedHours = 0.25;
    else if (connectorAccount.sync_frequency === 'weekly') expectedHours = 168;
    
    if (hoursSinceSync > expectedHours * 2) { // Allow 2x the expected frequency as grace period
      exceptions.push({
        entity_type: 'connector_account',
        entity_id: connectorAccount.id,
        exception_type: 'sync_failure',
        severity: 'high',
        title: 'Stale Sync Data',
        description: `Last sync was ${Math.round(hoursSinceSync)} hours ago, expected every ${expectedHours} hours`
      });
    }
  }

  return { exceptions };
}

async function processDataQualityExceptions(reconciliationResults) {
  console.log('Processing data quality exceptions...');
  
  const allExceptions = reconciliationResults.flatMap(r => r.exceptions);
  
  for (const exception of allExceptions) {
    // Insert exception into database
    await supabase
      .from('exceptions')
      .upsert({
        entity_id: exception.entity_id,
        entity_type: exception.entity_type,
        exception_type: exception.exception_type,
        severity: exception.severity || 'medium',
        title: exception.title,
        description: exception.description,
        error_details: exception.error_details || {},
        status: 'open'
      }, {
        onConflict: 'entity_type,entity_id,exception_type'
      });
  }
  
  console.log(`Processed ${allExceptions.length} data quality exceptions`);
}

async function createReconciliationReport(reconciliationResults, reconciliationDate) {
  console.log('Creating reconciliation report...');
  
  const summary = {
    total_accounts: reconciliationResults.length,
    total_exceptions: reconciliationResults.reduce((sum, r) => sum + r.exceptions.length, 0),
    by_severity: {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    },
    by_type: {}
  };
  
  // Calculate statistics
  for (const result of reconciliationResults) {
    for (const exception of result.exceptions) {
      const severity = exception.severity || 'medium';
      summary.by_severity[severity] = (summary.by_severity[severity] || 0) + 1;
      
      const type = exception.exception_type;
      summary.by_type[type] = (summary.by_type[type] || 0) + 1;
    }
  }
  
  // This would typically generate and store a formal report
  console.log('Reconciliation Summary:', JSON.stringify(summary, null, 2));
  
  return summary;
}

// Helper RPC function that would need to be created in Supabase
// CREATE OR REPLACE FUNCTION find_duplicate_accounts(p_connector_account_id UUID)
// RETURNS TABLE(id UUID, account_number TEXT, count BIGINT) AS $$
// BEGIN
//   RETURN QUERY
//   SELECT a.id, a.account_number, COUNT(*)::BIGINT
//   FROM accounts a
//   WHERE a.connector_account_id = p_connector_account_id
//   GROUP BY a.id, a.account_number
//   HAVING COUNT(*) > 1;
// END;
// $$ LANGUAGE plpgsql;

// Run if called directly
if (require.main === module) {
  processReconciliationDaily()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Reconciliation processing failed:', error);
      process.exit(1);
    });
}

module.exports = { processReconciliationDaily };