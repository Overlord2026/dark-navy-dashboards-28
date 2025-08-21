import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
      }
    )

    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization')
    if (authHeader) {
      supabase.auth.setSession({ access_token: authHeader.replace('Bearer ', ''), refresh_token: '' })
    }

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const body = await req.json()
    const { type, feature, plan_hint, source, metadata } = body

    // Validate required fields
    if (!type || !feature || !plan_hint || !source) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: type, feature, plan_hint, source' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create upgrade intent receipt
    const receipt = {
      id: `upgrade_intent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id: user.id,
      type,
      feature,
      plan_hint,
      source,
      metadata: metadata || {},
      timestamp: new Date().toISOString(),
      session_id: req.headers.get('x-session-id') || null
    }

    console.log('Storing upgrade intent receipt:', receipt)

    // Store receipt in a generic receipts table or specific upgrade_intents table
    const { data, error } = await supabase
      .from('upgrade_intent_receipts')
      .insert(receipt)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to store receipt', details: error.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Also log to console for immediate visibility
    console.log('Upgrade intent receipt stored successfully:', data)

    return new Response(
      JSON.stringify({ 
        success: true, 
        receipt_id: receipt.id,
        data 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Upgrade intent receipt error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        message: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})