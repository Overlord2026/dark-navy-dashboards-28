import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8'

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
    // Parse request body
    const { account_id } = await req.json()

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the user from the request
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get the account to sync
    const { data: account, error: accountError } = await supabaseClient
      .from('bank_accounts')
      .select('*')
      .eq('id', account_id)
      .eq('user_id', user.id)
      .eq('is_plaid_linked', true)
      .single()

    if (accountError || !account) {
      return new Response(
        JSON.stringify({ error: 'Account not found or not Plaid-linked' }),
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get Plaid credentials from environment
    const PLAID_CLIENT_ID = Deno.env.get('PLAID_CLIENT_ID')
    const PLAID_SECRET_KEY = Deno.env.get('PLAID_SECRET_KEY')
    const PLAID_ENVIRONMENT = Deno.env.get('PLAID_ENVIRONMENT') || 'sandbox'

    if (!PLAID_CLIENT_ID || !PLAID_SECRET_KEY) {
      console.error('Missing Plaid credentials')
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Note: In a real implementation, you would need to securely store and retrieve 
    // the Plaid access token for this account. For this demo, we'll simulate the sync.
    
    console.log(`Syncing account ${account_id} for user ${user.id}`)

    // Simulate balance update (in production, you'd fetch from Plaid)
    const mockNewBalance = account.balance + Math.random() * 100 - 50

    const { data: updatedAccount, error: updateError } = await supabaseClient
      .from('bank_accounts')
      .update({
        balance: mockNewBalance,
        last_plaid_sync: new Date().toISOString(),
      })
      .eq('id', account_id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateError) {
      console.error('Database update error:', updateError)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to update account',
          details: updateError 
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log(`Successfully synced account ${account_id}`)

    return new Response(
      JSON.stringify({ 
        success: true,
        account: updatedAccount
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in plaid-sync-accounts:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})