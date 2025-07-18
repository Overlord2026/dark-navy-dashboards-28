import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Checking cron job status and last cleanup stats...')

    // Get current cron jobs
    const { data: cronJobs, error: cronError } = await supabaseClient
      .from('cron.job')
      .select('jobname, schedule, active, database')
      .order('jobname')

    if (cronError) {
      console.error('Error fetching cron jobs:', cronError)
    }

    // Get current record counts
    const tables = ['user_otp_codes', 'webhook_deliveries', 'tracked_events']
    const recordCounts: { [key: string]: number } = {}

    for (const table of tables) {
      const { count, error } = await supabaseClient
        .from(table)
        .select('*', { count: 'exact', head: true })
      
      if (!error) {
        recordCounts[table] = count || 0
      }
    }

    // Calculate what would be cleaned up right now
    const cleanupStats = {
      expired_otp_codes: 0,
      old_webhook_deliveries: 0,
      old_tracked_events: 0
    }

    // Count expired OTP codes
    const { count: expiredOtpCount } = await supabaseClient
      .from('user_otp_codes')
      .select('*', { count: 'exact', head: true })
      .or('expires_at.lt.now(),is_used.eq.true')
    
    cleanupStats.expired_otp_codes = expiredOtpCount || 0

    // Count old webhook deliveries (30+ days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const { count: oldWebhookCount } = await supabaseClient
      .from('webhook_deliveries')
      .select('*', { count: 'exact', head: true })
      .lt('created_at', thirtyDaysAgo.toISOString())
    
    cleanupStats.old_webhook_deliveries = oldWebhookCount || 0

    // Count old tracked events (90+ days)
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
    
    const { count: oldEventsCount } = await supabaseClient
      .from('tracked_events')
      .select('*', { count: 'exact', head: true })
      .lt('created_at', ninetyDaysAgo.toISOString())
    
    cleanupStats.old_tracked_events = oldEventsCount || 0

    return new Response(
      JSON.stringify({
        success: true,
        cron_jobs: cronJobs,
        current_record_counts: recordCounts,
        pending_cleanup: cleanupStats,
        next_daily_cleanup: 'Every day at 2:00 AM UTC',
        next_weekly_cleanup: 'Every Sunday at 3:00 AM UTC'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Status check error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})