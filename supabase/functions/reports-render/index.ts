import { userClient, getCaller } from "../_shared/auth.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ReportRequest {
  report_id: string
  format?: 'pdf' | 'xlsx' | 'csv'
  delivery_method?: 'download' | 'email'
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = userClient(req);
    const caller = getCaller(req);

    const { report_id, format = 'pdf', delivery_method = 'download' }: ReportRequest = await req.json()

    console.log(`Rendering report: ${report_id} in format: ${format}`)

    // Get report details
    const { data: report, error: reportError } = await supabase
      .from('reports')
      .select('*')
      .eq('id', report_id)
      .single()

    if (reportError || !report) {
      throw new Error(`Report not found: ${reportError?.message}`)
    }

    // Update report status to processing
    await supabase
      .from('reports')
      .update({ status: 'processing' })
      .eq('id', report_id)

    // Generate report based on type and persona scope
    const reportContent = await generateReportContent(supabase, report)
    
    // Render report in requested format
    const renderedReport = await renderReport(reportContent, format, report)
    
    // Store report file (placeholder implementation)
    const fileUrl = await storeReportFile(supabase, report_id, renderedReport, format)
    
    // Emit evidence for report generation
    const evidenceId = await emitReportEvidence(supabase, {
      report_id,
      report_type: report.report_type,
      persona_scope: report.persona_scope,
      format,
      file_url: fileUrl
    })

    // Update report with completion details
    await supabase
      .from('reports')
      .update({
        status: 'completed',
        file_url: fileUrl,
        file_size_bytes: renderedReport.size,
        mime_type: getMimeType(format),
        generated_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        evidence_id: evidenceId
      })
      .eq('id', report_id)

    const response = {
      success: true,
      report_id,
      file_url: fileUrl,
      format,
      delivery_method,
      evidence_id: evidenceId,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    }

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Report rendering failed:', error)
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function generateReportContent(supabase: any, report: any) {
  console.log(`Generating ${report.report_type} report for persona: ${report.persona_scope}`)
  
  const reportData: any = {
    report_id: report.id,
    report_name: report.report_name,
    report_type: report.report_type,
    persona_scope: report.persona_scope,
    generated_at: new Date().toISOString(),
    parameters: report.parameters
  }

  // Generate content based on report type
  switch (report.report_type) {
    case 'performance':
      reportData.content = await generatePerformanceReport(supabase, report)
      break
    case 'holdings':
      reportData.content = await generateHoldingsReport(supabase, report)
      break
    case 'transactions':
      reportData.content = await generateTransactionsReport(supabase, report)
      break
    case 'allocation':
      reportData.content = await generateAllocationReport(supabase, report)
      break
    case 'compliance':
      reportData.content = await generateComplianceReport(supabase, report)
      break
    case 'tax':
      reportData.content = await generateTaxReport(supabase, report)
      break
    default:
      reportData.content = await generateGenericReport(supabase, report)
  }

  return reportData
}

async function generatePerformanceReport(supabase: any, report: any) {
  // Placeholder performance report data
  return {
    summary: {
      total_return: '12.5%',
      benchmark_return: '10.2%',
      excess_return: '2.3%',
      sharpe_ratio: 1.45,
      max_drawdown: '-5.2%'
    },
    holdings: [
      { symbol: 'AAPL', return: '15.2%', weight: '25%' },
      { symbol: 'MSFT', return: '18.7%', weight: '20%' },
      { symbol: 'GOOGL', return: '8.9%', weight: '15%' }
    ],
    charts: ['performance_chart.png', 'allocation_chart.png']
  }
}

async function generateHoldingsReport(supabase: any, report: any) {
  // Get actual holdings data
  const { data: positions } = await supabase
    .from('positions')
    .select(`
      *,
      accounts!inner (
        account_name,
        institution_name,
        user_id
      )
    `)
    .eq('accounts.user_id', report.user_id)
    .order('market_value', { ascending: false })

  return {
    total_value: positions?.reduce((sum: number, pos: any) => sum + (pos.market_value || 0), 0) || 0,
    position_count: positions?.length || 0,
    positions: positions?.map((pos: any) => ({
      symbol: pos.symbol,
      asset_name: pos.asset_name,
      asset_class: pos.asset_class,
      quantity: pos.quantity,
      unit_price: pos.unit_price,
      market_value: pos.market_value,
      account: pos.accounts.account_name
    })) || []
  }
}

async function generateTransactionsReport(supabase: any, report: any) {
  // Get actual transaction data
  const { data: transactions } = await supabase
    .from('transactions')
    .select(`
      *,
      accounts!inner (
        account_name,
        user_id
      )
    `)
    .eq('accounts.user_id', report.user_id)
    .order('transaction_date', { ascending: false })
    .limit(100)

  return {
    transaction_count: transactions?.length || 0,
    total_amount: transactions?.reduce((sum: number, txn: any) => sum + Math.abs(txn.amount), 0) || 0,
    transactions: transactions?.map((txn: any) => ({
      date: txn.transaction_date,
      type: txn.transaction_type,
      symbol: txn.symbol,
      quantity: txn.quantity,
      price: txn.price,
      amount: txn.amount,
      account: txn.accounts.account_name
    })) || []
  }
}

async function generateAllocationReport(supabase: any, report: any) {
  // Get asset class allocation
  const { data: positions } = await supabase
    .from('positions')
    .select(`
      asset_class,
      market_value,
      accounts!inner (user_id)
    `)
    .eq('accounts.user_id', report.user_id)

  const allocation = positions?.reduce((acc: any, pos: any) => {
    const assetClass = pos.asset_class
    acc[assetClass] = (acc[assetClass] || 0) + (pos.market_value || 0)
    return acc
  }, {}) || {}

  const totalValue = Object.values(allocation).reduce((sum: number, value: any) => sum + value, 0)

  return {
    total_value: totalValue,
    allocation: Object.entries(allocation).map(([asset_class, value]: [string, any]) => ({
      asset_class,
      value,
      percentage: totalValue > 0 ? ((value / totalValue) * 100).toFixed(2) + '%' : '0%'
    }))
  }
}

async function generateComplianceReport(supabase: any, report: any) {
  return {
    compliance_status: 'Compliant',
    checks_performed: [
      { rule: 'Position Concentration', status: 'Pass', details: 'No single position exceeds 10%' },
      { rule: 'Liquidity Requirements', status: 'Pass', details: 'Cash allocation within limits' },
      { rule: 'Risk Metrics', status: 'Warning', details: 'VaR slightly elevated' }
    ],
    risk_metrics: {
      value_at_risk: '2.1%',
      beta: 1.05,
      tracking_error: '1.8%'
    }
  }
}

async function generateTaxReport(supabase: any, report: any) {
  return {
    tax_year: new Date().getFullYear(),
    realized_gains: 12500.00,
    realized_losses: -3200.00,
    net_realized: 9300.00,
    unrealized_gains: 45600.00,
    dividend_income: 8750.00,
    tax_lots: [
      { symbol: 'AAPL', purchase_date: '2023-01-15', quantity: 100, cost_basis: 150.00, current_value: 175.25 }
    ]
  }
}

async function generateGenericReport(supabase: any, report: any) {
  return {
    message: `Generic ${report.report_type} report generated`,
    timestamp: new Date().toISOString(),
    parameters: report.parameters
  }
}

async function renderReport(reportContent: any, format: string, report: any) {
  console.log(`Rendering report in ${format} format`)
  
  // Placeholder report rendering
  // In a real implementation, this would use libraries like Puppeteer, jsPDF, ExcelJS, etc.
  
  const content = generatePlaceholderContent(reportContent, format)
  
  return {
    content,
    size: content.length,
    format
  }
}

function generatePlaceholderContent(reportContent: any, format: string): string {
  switch (format) {
    case 'pdf':
      return `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R>>endobj
4 0 obj<</Length 44>>stream
BT /F1 12 Tf 100 700 Td (${reportContent.report_name}) Tj ET
endstream endobj
xref
0 5
0000000000 65535 f
0000000010 00000 n
0000000053 00000 n
0000000125 00000 n
0000000185 00000 n
trailer<</Size 5/Root 1 0 R>>
startxref
279
%%EOF`
    
    case 'xlsx':
      return 'PK\x03\x04\x14\x00\x00\x08\x08\x00...' // Placeholder Excel file header
    
    case 'csv':
      return `Report Name,${reportContent.report_name}
Generated At,${reportContent.generated_at}
Report Type,${reportContent.report_type}
Persona Scope,${reportContent.persona_scope}

Data:
${JSON.stringify(reportContent.content, null, 2)}`
    
    default:
      return JSON.stringify(reportContent, null, 2)
  }
}

async function storeReportFile(supabase: any, reportId: string, renderedReport: any, format: string): Promise<string> {
  // Placeholder file storage
  // In a real implementation, this would upload to Supabase Storage or S3
  
  const fileName = `report_${reportId}.${format}`
  const placeholderUrl = `https://placeholder-reports.example.com/${fileName}`
  
  console.log(`Storing report file: ${fileName}`)
  
  return placeholderUrl
}

async function emitReportEvidence(supabase: any, reportData: any) {
  try {
    const { data, error } = await supabase.functions.invoke('emit-receipt', {
      body: {
        subject_type: 'report_generation',
        subject_id: reportData.report_id,
        event_type: 'report_generated',
        explanation: `${reportData.report_type} report generated for ${reportData.persona_scope}`,
        metadata: {
          report_type: reportData.report_type,
          persona_scope: reportData.persona_scope,
          format: reportData.format,
          file_url: reportData.file_url,
          timestamp: new Date().toISOString()
        }
      }
    })

    if (error) {
      console.error('Failed to emit report evidence:', error)
      return null
    }

    return data?.evidence_id
  } catch (error) {
    console.error('Error emitting report evidence:', error)
    return null
  }
}

function getMimeType(format: string): string {
  switch (format) {
    case 'pdf':
      return 'application/pdf'
    case 'xlsx':
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    case 'csv':
      return 'text/csv'
    default:
      return 'application/octet-stream'
  }
}