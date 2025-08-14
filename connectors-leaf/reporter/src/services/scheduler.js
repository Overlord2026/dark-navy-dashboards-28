import { supabase } from '../index.js'
import { generateReport } from './reportGenerator.js'

export async function scheduledReportJob(frequency = 'monthly') {
  console.log(`Running ${frequency} scheduled report job...`)

  try {
    // Get all active portfolios that need reports
    const { data: portfolios, error: portfoliosError } = await supabase
      .from('portfolios')
      .select(`
        portfolio_id,
        entity_id,
        entities (
          legal_name,
          metadata
        )
      `)
      .eq('status', 'active')

    if (portfoliosError) {
      throw new Error(`Failed to fetch portfolios: ${portfoliosError.message}`)
    }

    console.log(`Found ${portfolios.length} active portfolios`)

    // Calculate period based on frequency
    const endDate = new Date()
    const startDate = new Date()
    
    if (frequency === 'monthly') {
      startDate.setMonth(endDate.getMonth() - 1)
    } else if (frequency === 'quarterly') {
      startDate.setMonth(endDate.getMonth() - 3)
    }

    const period = {
      start: startDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0]
    }

    // Generate reports for each portfolio
    const reportPromises = []
    
    for (const portfolio of portfolios) {
      // Check if reports are already generated for this period
      const { data: existingReports } = await supabase
        .from('reports')
        .select('id, kind')
        .eq('portfolio_id', portfolio.portfolio_id)
        .eq('period_start', period.start)
        .eq('period_end', period.end)

      const existingKinds = new Set(existingReports?.map(r => r.kind) || [])

      // Generate reports for each report type if not already exists
      const reportTypes = ['consolidated', 'performance', 'fees']
      const personaScopes = ['client', 'advisor', 'cpa']

      for (const kind of reportTypes) {
        for (const persona_scope of personaScopes) {
          const reportKey = `${kind}_${persona_scope}`
          
          if (!existingKinds.has(reportKey)) {
            reportPromises.push(
              generateScheduledReport(portfolio, period, kind, persona_scope, frequency)
            )
          }
        }
      }
    }

    // Execute all report generations in parallel (in batches to avoid overwhelming)
    const batchSize = 5
    const results = []
    
    for (let i = 0; i < reportPromises.length; i += batchSize) {
      const batch = reportPromises.slice(i, i + batchSize)
      const batchResults = await Promise.allSettled(batch)
      results.push(...batchResults)
      
      // Small delay between batches
      if (i + batchSize < reportPromises.length) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    // Summarize results
    const successful = results.filter(r => r.status === 'fulfilled').length
    const failed = results.filter(r => r.status === 'rejected').length

    console.log(`Scheduled report job completed: ${successful} successful, ${failed} failed`)

    // Send summary notification
    await sendScheduledReportSummary(frequency, successful, failed, period)

    return {
      frequency,
      period,
      portfolios_processed: portfolios.length,
      reports_generated: successful,
      reports_failed: failed,
      completed_at: new Date().toISOString()
    }

  } catch (error) {
    console.error(`Scheduled report job failed:`, error)
    throw error
  }
}

async function generateScheduledReport(portfolio, period, kind, persona_scope, frequency) {
  try {
    console.log(`Generating ${kind} report for ${portfolio.portfolio_id} (${persona_scope})`)

    const report = await generateReport({
      portfolio_id: portfolio.portfolio_id,
      period,
      kind,
      persona_scope,
      delivery_method: 'storage',
      requested_by: null // System generated
    })

    // Update metadata to indicate this was scheduled
    await supabase
      .from('reports')
      .update({
        metadata: {
          scheduled: true,
          frequency,
          generation_type: 'automated',
          portfolio_name: portfolio.entities?.legal_name
        }
      })
      .eq('id', report.id)

    console.log(`Successfully generated ${kind} report for ${portfolio.portfolio_id}`)

    return {
      portfolio_id: portfolio.portfolio_id,
      kind,
      persona_scope,
      report_id: report.id,
      status: 'success'
    }

  } catch (error) {
    console.error(`Failed to generate ${kind} report for ${portfolio.portfolio_id}:`, error)

    // Record the failure
    await supabase
      .from('exceptions')
      .insert({
        account_id: null,
        kind: 'scheduled_report_failed',
        details: {
          portfolio_id: portfolio.portfolio_id,
          report_kind: kind,
          persona_scope,
          frequency,
          error: error.message
        },
        severity: 'medium',
        opened_at: new Date().toISOString()
      })

    return {
      portfolio_id: portfolio.portfolio_id,
      kind,
      persona_scope,
      status: 'failed',
      error: error.message
    }
  }
}

async function sendScheduledReportSummary(frequency, successful, failed, period) {
  console.log(`Sending ${frequency} report summary: ${successful} successful, ${failed} failed`)

  // In a real implementation, this would send an email or notification
  // For now, we'll just create an audit log entry
  
  await supabase
    .from('system_events')
    .insert({
      event_type: 'scheduled_reports_completed',
      details: {
        frequency,
        period,
        reports_successful: successful,
        reports_failed: failed,
        completed_at: new Date().toISOString()
      },
      severity: failed > 0 ? 'warning' : 'info',
      created_at: new Date().toISOString()
    })

  // Emit event for other systems to consume
  console.log('Event: scheduled_reports.completed', {
    frequency,
    successful,
    failed,
    period
  })
}