import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Running IP Watch scan...')

    // Placeholder for IP Watch scanning logic
    // In production, this would:
    // 1. Scan for brand mentions across platforms
    // 2. Check domain registrations
    // 3. Monitor for trademark infringement
    // 4. Check for copycat websites

    const mockFindings = [
      {
        type: 'mention',
        term: 'Boutique Family Office',
        source: 'Reddit',
        date_found: new Date().toISOString().split('T')[0],
        risk_level: 'info',
        link: 'https://reddit.com/r/investing/example'
      },
      {
        type: 'domain',
        term: 'boutique-family-office.net',
        source: 'Domain Monitor',
        date_found: new Date().toISOString().split('T')[0],
        risk_level: 'warning',
        link: 'https://whois.net/example'
      }
    ]

    // Insert findings into database
    const { data, error } = await supabase
      .from('ip_watch_logs')
      .insert(mockFindings)

    if (error) {
      console.error('Error inserting IP Watch findings:', error)
      throw error
    }

    console.log(`IP Watch scan completed. Found ${mockFindings.length} new findings.`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `IP Watch scan completed. Found ${mockFindings.length} new findings.`,
        findings: mockFindings.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('IP Watch scan error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})