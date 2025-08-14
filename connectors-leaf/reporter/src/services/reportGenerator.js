import { renderToBuffer } from '@react-pdf/renderer'
import React from 'react'
import { supabase } from '../index.js'
import { ConsolidatedReport } from '../templates/ConsolidatedReport.jsx'
import { PerformanceReport } from '../templates/PerformanceReport.jsx'
import { FeesReport } from '../templates/FeesReport.jsx'
import { CashTreasuryReport } from '../templates/CashTreasuryReport.jsx'

export async function generateReport({
  portfolio_id,
  period,
  kind,
  persona_scope,
  format = 'pdf',
  delivery_method = 'storage',
  requested_by
}) {
  console.log(`Generating ${kind} report for portfolio ${portfolio_id}`, {
    period,
    persona_scope,
    requested_by
  })

  try {
    // Fetch canonical data based on report type
    const data = await fetchReportData(portfolio_id, period, kind, persona_scope)
    
    // Generate PDF based on report kind
    let reportComponent
    switch (kind) {
      case 'consolidated':
        reportComponent = React.createElement(ConsolidatedReport, { data, persona_scope, period })
        break
      case 'performance':
        reportComponent = React.createElement(PerformanceReport, { data, persona_scope, period })
        break
      case 'fees':
        reportComponent = React.createElement(FeesReport, { data, persona_scope, period })
        break
      case 'cash_treasury':
        reportComponent = React.createElement(CashTreasuryReport, { data, persona_scope, period })
        break
      default:
        throw new Error(`Unsupported report kind: ${kind}`)
    }

    // Render PDF to buffer
    const pdfBuffer = await renderToBuffer(reportComponent)
    
    // Generate filename
    const timestamp = new Date().toISOString().slice(0, 10)
    const filename = `${kind}_report_${portfolio_id}_${timestamp}_${persona_scope}.pdf`

    let storage_url = null
    let report_id = null

    if (delivery_method === 'storage') {
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('reports')
        .upload(`${portfolio_id}/${filename}`, pdfBuffer, {
          contentType: 'application/pdf',
          cacheControl: '3600'
        })

      if (uploadError) {
        throw new Error(`Failed to upload report: ${uploadError.message}`)
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('reports')
        .getPublicUrl(uploadData.path)

      storage_url = publicUrlData.publicUrl

      // Create reports table entry
      const { data: reportRecord, error: reportError } = await supabase
        .from('reports')
        .insert({
          portfolio_id,
          kind,
          period_start: period.start,
          period_end: period.end,
          storage_url,
          filename,
          persona_scope,
          file_size: pdfBuffer.length,
          generated_by: requested_by,
          metadata: {
            delivery_method,
            format,
            generation_time: new Date().toISOString()
          }
        })
        .select()
        .single()

      if (reportError) {
        console.error('Failed to create report record:', reportError)
        // Don't throw - the PDF was generated successfully
      } else {
        report_id = reportRecord.id
      }

      // Emit event
      await emitReportEvent('report.rendered', {
        report_id,
        portfolio_id,
        kind,
        persona_scope,
        storage_url,
        generated_by: requested_by
      })
    }

    console.log(`Report generated successfully: ${filename}`)

    return {
      id: report_id,
      buffer: pdfBuffer,
      filename,
      storage_url,
      created_at: new Date().toISOString()
    }

  } catch (error) {
    console.error('Report generation failed:', error)
    
    // Record exception
    await supabase
      .from('exceptions')
      .insert({
        account_id: null,
        kind: 'report_generation_failed',
        details: {
          portfolio_id,
          kind,
          persona_scope,
          error: error.message,
          requested_by
        },
        severity: 'medium',
        opened_at: new Date().toISOString()
      })

    throw error
  }
}

async function fetchReportData(portfolio_id, period, kind, persona_scope) {
  console.log(`Fetching data for ${kind} report...`)

  try {
    // Get portfolio information
    const { data: portfolio, error: portfolioError } = await supabase
      .from('v_portfolios_persona')
      .select('*')
      .eq('portfolio_id', portfolio_id)
      .single()

    if (portfolioError) {
      throw new Error(`Portfolio not found: ${portfolioError.message}`)
    }

    // Get accounts for this portfolio
    const { data: accounts, error: accountsError } = await supabase
      .from('v_accounts_persona')
      .select('*')
      .eq('portfolio_id', portfolio_id)

    if (accountsError) {
      throw new Error(`Failed to fetch accounts: ${accountsError.message}`)
    }

    // Get positions as of period end
    const { data: positions, error: positionsError } = await supabase
      .from('v_positions_persona')
      .select(`
        *,
        instruments (symbol, name, asset_class)
      `)
      .in('account_id', accounts.map(a => a.account_id))
      .lte('as_of', period.end)
      .order('as_of', { ascending: false })

    if (positionsError) {
      throw new Error(`Failed to fetch positions: ${positionsError.message}`)
    }

    // Get transactions for the period
    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .select(`
        *,
        instruments (symbol, name)
      `)
      .in('account_id', accounts.map(a => a.account_id))
      .gte('trade_date', period.start)
      .lte('trade_date', period.end)
      .order('trade_date', { ascending: false })

    if (transactionsError) {
      throw new Error(`Failed to fetch transactions: ${transactionsError.message}`)
    }

    // Get price data for performance calculations
    const { data: prices, error: pricesError } = await supabase
      .from('prices')
      .select('*')
      .gte('as_of', period.start)
      .lte('as_of', period.end)

    if (pricesError) {
      console.warn('Failed to fetch price data:', pricesError.message)
    }

    // Compile data based on report type and persona scope
    return await compileReportData({
      portfolio,
      accounts,
      positions,
      transactions,
      prices,
      period,
      kind,
      persona_scope
    })

  } catch (error) {
    console.error('Failed to fetch report data:', error)
    throw error
  }
}

async function compileReportData({ portfolio, accounts, positions, transactions, prices, period, kind, persona_scope }) {
  // Group positions by latest as_of date per instrument per account
  const latestPositions = positions.reduce((acc, pos) => {
    const key = `${pos.account_id}_${pos.instrument_id}`
    if (!acc[key] || pos.as_of > acc[key].as_of) {
      acc[key] = pos
    }
    return acc
  }, {})

  // Calculate portfolio totals
  const totalValue = Object.values(latestPositions).reduce((sum, pos) => sum + (pos.market_value || 0), 0)
  const totalCostBasis = Object.values(latestPositions).reduce((sum, pos) => sum + (pos.cost_basis || 0), 0)

  // Calculate asset allocation
  const assetAllocation = Object.values(latestPositions).reduce((acc, pos) => {
    const assetClass = pos.instruments?.asset_class || 'Other'
    if (!acc[assetClass]) {
      acc[assetClass] = { asset_class: assetClass, market_value: 0, cost_basis: 0, count: 0 }
    }
    acc[assetClass].market_value += pos.market_value || 0
    acc[assetClass].cost_basis += pos.cost_basis || 0
    acc[assetClass].count += 1
    return acc
  }, {})

  // Add percentages to asset allocation
  Object.values(assetAllocation).forEach(allocation => {
    allocation.percentage = totalValue > 0 ? (allocation.market_value / totalValue) * 100 : 0
  })

  // Get top holdings
  const topHoldings = Object.values(latestPositions)
    .filter(pos => pos.instruments)
    .map(pos => ({
      symbol: pos.instruments.symbol,
      name: pos.instruments.name,
      quantity: pos.quantity,
      market_value: pos.market_value,
      portfolio_percentage: totalValue > 0 ? (pos.market_value / totalValue) * 100 : 0
    }))
    .sort((a, b) => b.market_value - a.market_value)

  // Calculate account summaries
  const accountSummaries = accounts.map(account => {
    const accountPositions = Object.values(latestPositions).filter(pos => pos.account_id === account.account_id)
    const accountValue = accountPositions.reduce((sum, pos) => sum + (pos.market_value || 0), 0)
    
    return {
      account_id: account.account_id,
      custodian: account.custodian,
      account_number_masked: account.account_number_masked,
      account_type: account.account_type,
      market_value: accountValue,
      cash_balance: account.cash_balance || 0
    }
  })

  // Base report data
  const reportData = {
    portfolio_name: portfolio.name || `Portfolio ${portfolio.portfolio_id}`,
    total_value: totalValue,
    total_cost_basis: totalCostBasis,
    total_return: totalCostBasis > 0 ? ((totalValue - totalCostBasis) / totalCostBasis) * 100 : 0,
    accounts_count: accounts.length,
    asset_allocation: Object.values(assetAllocation),
    top_holdings: topHoldings,
    accounts: accountSummaries,
    generated_at: new Date().toISOString()
  }

  // Add report-specific data
  if (kind === 'performance') {
    // Add performance metrics (simplified calculations)
    reportData.ytd_return = 8.5 // Mock data - would calculate from price history
    reportData.annualized_return = 7.2
    reportData.sharpe_ratio = 1.1
    reportData.benchmark = {
      name: 'S&P 500',
      period_return: 6.8,
      ytd_return: 7.1
    }
    reportData.excess_return = reportData.total_return - reportData.benchmark.period_return
    
    reportData.account_performance = accountSummaries.map(account => ({
      ...account,
      beginning_value: account.market_value * 0.92, // Mock
      ending_value: account.market_value,
      return: 8.7, // Mock
      net_contributions: account.market_value * 0.05 // Mock
    }))

    reportData.asset_class_performance = Object.values(assetAllocation).map(asset => ({
      name: asset.asset_class,
      return: Math.random() * 20 - 5, // Mock performance data
      contribution: (asset.market_value / totalValue) * Math.random() * 10,
      weight: asset.percentage
    }))

    reportData.risk_metrics = {
      volatility: 14.2,
      max_drawdown: -8.1,
      beta: 0.95
    }

    // Tax implications for CPA persona
    if (persona_scope === 'cpa' || persona_scope === 'admin') {
      reportData.tax_implications = [
        {
          category: 'Short Term Gains',
          realized_gains: totalValue * 0.02,
          unrealized_gains: totalValue * 0.05,
          tax_efficiency: 85
        },
        {
          category: 'Long Term Gains',
          realized_gains: totalValue * 0.08,
          unrealized_gains: totalValue * 0.12,
          tax_efficiency: 92
        }
      ]
    }
  }

  if (kind === 'fees') {
    // Add fee analysis
    reportData.total_fees = totalValue * 0.0075 // 0.75% mock fee
    reportData.fee_breakdown = [
      { category: 'Management Fees', amount: totalValue * 0.005, percentage: 0.5 },
      { category: 'Trading Costs', amount: totalValue * 0.0015, percentage: 0.15 },
      { category: 'Other Fees', amount: totalValue * 0.001, percentage: 0.1 }
    ]
  }

  if (kind === 'cash_treasury') {
    // Add cash and treasury analysis
    const cashPositions = Object.values(latestPositions).filter(pos => 
      pos.instruments?.asset_class === 'Cash' || pos.instruments?.symbol?.includes('CASH')
    )
    
    reportData.total_cash = cashPositions.reduce((sum, pos) => sum + (pos.market_value || 0), 0)
    reportData.cash_percentage = totalValue > 0 ? (reportData.total_cash / totalValue) * 100 : 0
    reportData.cash_by_account = accountSummaries.map(account => ({
      ...account,
      cash_percentage: account.market_value > 0 ? (account.cash_balance / account.market_value) * 100 : 0
    }))
  }

  return reportData
}

async function emitReportEvent(event_type, payload) {
  console.log(`Emitting event: ${event_type}`, payload)
  // In a real implementation, this would publish to a message queue or event system
}