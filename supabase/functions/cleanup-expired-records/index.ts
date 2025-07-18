import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CleanupStats {
  otp_codes_deleted: number
  webhook_deliveries_deleted: number  
  tracked_events_deleted: number
  total_deleted: number
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

    console.log('Starting cleanup of expired records...')
    const stats: CleanupStats = {
      otp_codes_deleted: 0,
      webhook_deliveries_deleted: 0,
      tracked_events_deleted: 0,
      total_deleted: 0
    }

    // 1. Clean up expired OTP codes (expired or used)
    console.log('Cleaning up expired OTP codes...')
    const { data: expiredOtpCodes, error: otpError } = await supabaseClient
      .from('user_otp_codes')
      .delete()
      .or('expires_at.lt.now(),is_used.eq.true')
      .select('id')

    if (otpError) {
      console.error('Error cleaning up OTP codes:', otpError)
    } else {
      stats.otp_codes_deleted = expiredOtpCodes?.length || 0
      console.log(`Deleted ${stats.otp_codes_deleted} expired OTP codes`)
    }

    // 2. Clean up old webhook deliveries (older than 30 days)
    console.log('Cleaning up old webhook deliveries...')
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const { data: oldWebhookDeliveries, error: webhookError } = await supabaseClient
      .from('webhook_deliveries')
      .delete()
      .lt('created_at', thirtyDaysAgo.toISOString())
      .select('id')

    if (webhookError) {
      console.error('Error cleaning up webhook deliveries:', webhookError)
    } else {
      stats.webhook_deliveries_deleted = oldWebhookDeliveries?.length || 0
      console.log(`Deleted ${stats.webhook_deliveries_deleted} old webhook deliveries`)
    }

    // 3. Clean up old tracked events (older than 90 days)
    console.log('Cleaning up old tracked events...')
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
    
    const { data: oldTrackedEvents, error: trackedError } = await supabaseClient
      .from('tracked_events')
      .delete()
      .lt('created_at', ninetyDaysAgo.toISOString())
      .select('id')

    if (trackedError) {
      console.error('Error cleaning up tracked events:', trackedError)
    } else {
      stats.tracked_events_deleted = oldTrackedEvents?.length || 0
      console.log(`Deleted ${stats.tracked_events_deleted} old tracked events`)
    }

    // Calculate total
    stats.total_deleted = stats.otp_codes_deleted + stats.webhook_deliveries_deleted + stats.tracked_events_deleted

    console.log('Cleanup completed:', stats)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Cleanup completed successfully',
        stats
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Cleanup function error:', error)
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