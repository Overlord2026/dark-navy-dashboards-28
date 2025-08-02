import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ExportRequest {
  format: 'csv' | 'pdf';
  dateRange: {
    from: string;
    to: string;
  };
  filters?: {
    advisor?: string;
    campaign?: string;
    agency?: string;
    source?: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Verify the user
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      throw new Error('Invalid token')
    }

    const { format, dateRange, filters }: ExportRequest = await req.json()

    console.log('Export request:', { format, dateRange, filters, userId: user.id })

    // Build query with filters
    let leadsQuery = supabase
      .from('leads')
      .select(`
        *,
        campaigns:campaign_id (campaign_name),
        marketing_agencies:agency_id (name),
        appointments!leads_appointments_lead_id_fkey (
          appt_1_scheduled,
          appt_1_attended,
          appt_2_scheduled,
          appt_2_attended,
          appt_3_scheduled,
          appt_3_attended
        )
      `)
      .gte('created_at', dateRange.from)
      .lte('created_at', dateRange.to)

    if (filters?.advisor) leadsQuery = leadsQuery.eq('advisor_id', filters.advisor)
    if (filters?.campaign) leadsQuery = leadsQuery.eq('campaign_id', filters.campaign)
    if (filters?.agency) leadsQuery = leadsQuery.eq('agency_id', filters.agency)
    if (filters?.source) leadsQuery = leadsQuery.eq('lead_source', filters.source)

    const { data: leads, error: leadsError } = await leadsQuery

    if (leadsError) {
      console.error('Error fetching leads:', leadsError)
      throw leadsError
    }

    // Fetch ad spend data
    let spendQuery = supabase
      .from('ad_spend_tracking')
      .select('*')
      .gte('spend_date', dateRange.from.split('T')[0])
      .lte('spend_date', dateRange.to.split('T')[0])

    if (filters?.advisor) spendQuery = spendQuery.eq('advisor_id', filters.advisor)
    if (filters?.agency) spendQuery = spendQuery.eq('agency_id', filters.agency)

    const { data: adSpend, error: spendError } = await spendQuery

    if (spendError) {
      console.error('Error fetching ad spend:', spendError)
      throw spendError
    }

    // Calculate metrics
    const totalAdSpend = adSpend?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0
    const totalLeads = leads?.length || 0
    const qualifiedLeads = leads?.filter(lead => lead.qualified).length || 0
    const clientsWon = leads?.filter(lead => lead.client_converted).length || 0

    // Calculate appointment metrics
    let appt1Scheduled = 0, appt1Attended = 0
    let appt2Scheduled = 0, appt2Attended = 0
    let appt3Scheduled = 0, appt3Attended = 0

    leads?.forEach(lead => {
      const appointment = lead.appointments?.[0]
      if (appointment?.appt_1_scheduled) appt1Scheduled++
      if (appointment?.appt_1_attended) appt1Attended++
      if (appointment?.appt_2_scheduled) appt2Scheduled++
      if (appointment?.appt_2_attended) appt2Attended++
      if (appointment?.appt_3_scheduled) appt3Scheduled++
      if (appointment?.appt_3_attended) appt3Attended++
    })

    const costPerLead = totalLeads > 0 ? totalAdSpend / totalLeads : 0
    const costPerQualifiedAppt = appt1Attended > 0 ? totalAdSpend / appt1Attended : 0
    const costPerSale = clientsWon > 0 ? totalAdSpend / clientsWon : 0
    const showRate1st = appt1Scheduled > 0 ? (appt1Attended / appt1Scheduled) * 100 : 0
    const showRate2nd = appt2Scheduled > 0 ? (appt2Attended / appt2Scheduled) * 100 : 0
    const showRate3rd = appt3Scheduled > 0 ? (appt3Attended / appt3Scheduled) * 100 : 0
    const conversionRate = totalLeads > 0 ? (clientsWon / totalLeads) * 100 : 0

    if (format === 'csv') {
      // Generate CSV
      const csvHeaders = [
        'Date Range',
        'Total Ad Spend',
        'Total Leads',
        'Cost Per Lead',
        'Qualified Leads',
        'Cost Per Qualified Appt',
        'Clients Won',
        'Cost Per Sale',
        '1st Appt Show Rate',
        '2nd Appt Show Rate',
        '3rd Appt Show Rate',
        'Conversion Rate'
      ]

      const csvData = [
        csvHeaders.join(','),
        [
          `${dateRange.from} to ${dateRange.to}`,
          totalAdSpend.toFixed(2),
          totalLeads,
          costPerLead.toFixed(2),
          qualifiedLeads,
          costPerQualifiedAppt.toFixed(2),
          clientsWon,
          costPerSale.toFixed(2),
          showRate1st.toFixed(1) + '%',
          showRate2nd.toFixed(1) + '%',
          showRate3rd.toFixed(1) + '%',
          conversionRate.toFixed(1) + '%'
        ].join(',')
      ]

      // Add individual lead data
      csvData.push('')
      csvData.push('Lead Details:')
      csvData.push([
        'Name',
        'Email',
        'Phone',
        'Source',
        'Campaign',
        'Agency',
        'Lead Value',
        'Qualified',
        'Client Converted',
        'Created Date'
      ].join(','))

      leads?.forEach(lead => {
        csvData.push([
          lead.name || '',
          lead.email || '',
          lead.phone || '',
          lead.lead_source || '',
          lead.campaigns?.campaign_name || '',
          lead.marketing_agencies?.name || '',
          lead.lead_value || 0,
          lead.qualified ? 'Yes' : 'No',
          lead.client_converted ? 'Yes' : 'No',
          new Date(lead.created_at).toLocaleDateString()
        ].join(','))
      })

      const csvContent = csvData.join('\n')

      return new Response(csvContent, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="roi-export-${new Date().toISOString().split('T')[0]}.csv"`
        }
      })
    } else if (format === 'pdf') {
      // For PDF, return structured data that the frontend can use to generate PDF
      const reportData = {
        dateRange: `${dateRange.from} to ${dateRange.to}`,
        summary: {
          totalAdSpend,
          totalLeads,
          costPerLead,
          qualifiedLeads,
          costPerQualifiedAppt,
          clientsWon,
          costPerSale,
          showRate1st,
          showRate2nd,
          showRate3rd,
          conversionRate
        },
        funnel: [
          { stage: 'Leads Generated', count: totalLeads },
          { stage: 'Qualified Leads', count: qualifiedLeads },
          { stage: '1st Appt Scheduled', count: appt1Scheduled },
          { stage: '1st Appt Attended', count: appt1Attended },
          { stage: '2nd Appt Attended', count: appt2Attended },
          { stage: '3rd Appt Attended', count: appt3Attended },
          { stage: 'Clients Won', count: clientsWon }
        ],
        leads: leads?.map(lead => ({
          name: lead.name,
          email: lead.email,
          source: lead.lead_source,
          campaign: lead.campaigns?.campaign_name,
          agency: lead.marketing_agencies?.name,
          value: lead.lead_value,
          qualified: lead.qualified,
          converted: lead.client_converted,
          created: new Date(lead.created_at).toLocaleDateString()
        })) || []
      }

      return new Response(JSON.stringify(reportData), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      })
    }

    throw new Error('Invalid format requested')

  } catch (error) {
    console.error('Export error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})