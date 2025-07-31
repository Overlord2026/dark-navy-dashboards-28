import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const testEmails = [
  'client@test.com',
  'advisor@test.com', 
  'accountant@test.com',
  'consultant@test.com',
  'attorney@test.com',
  'admin@test.com',
  'sysadmin@test.com'
]

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create admin client for user deletion
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Create regular client for data cleanup
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const results = []

    // Log cleanup start
    await supabase
      .from('audit_logs')
      .insert({
        event_type: 'qa_cleanup_start',
        status: 'success',
        table_name: 'multiple_tables',
        details: {
          action: 'Starting QA user cleanup',
          timestamp: new Date().toISOString()
        }
      })

    // Get all test users from auth
    const { data: users, error: usersError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (usersError) {
      throw new Error(`Failed to list users: ${usersError.message}`)
    }

    // Filter and delete test users
    for (const email of testEmails) {
      try {
        const user = users.users.find(u => u.email === email)
        
        if (user) {
          // Delete from auth.users (this will cascade to profiles due to foreign key)
          const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id)
          
          if (deleteError) {
            console.error(`Error deleting user ${email}:`, deleteError)
            results.push({
              email,
              success: false,
              error: deleteError.message
            })
          } else {
            results.push({
              email,
              user_id: user.id,
              success: true
            })
          }
        } else {
          results.push({
            email,
            success: true,
            note: 'User not found (already deleted)'
          })
        }
      } catch (error) {
        console.error(`Error processing ${email}:`, error)
        results.push({
          email,
          success: false,
          error: error.message
        })
      }
    }

    // Clean up related data that might remain
    await supabase
      .from('analytics_events')
      .delete()
      .ilike('session_id', 'test-session-%')

    await supabase
      .from('bank_accounts')
      .delete()
      .in('name', ['Test Checking Account', 'Test Savings Account', 'Advisor Business Account'])

    // Remove test tenant
    await supabase
      .from('tenants')
      .delete()
      .eq('id', '11111111-1111-1111-1111-111111111111')

    // Clean up setup-related audit logs
    await supabase
      .from('audit_logs')
      .delete()
      .eq('event_type', 'qa_users_setup')

    // Verify cleanup
    const { data: remainingProfiles } = await supabase
      .from('profiles')
      .select('email')
      .in('email', testEmails)

    const { data: remainingAccounts } = await supabase
      .from('bank_accounts')
      .select('name')
      .in('name', ['Test Checking Account', 'Test Savings Account', 'Advisor Business Account'])

    const { data: remainingEvents } = await supabase
      .from('analytics_events')
      .select('session_id')
      .ilike('session_id', 'test-session-%')

    // Log cleanup completion
    await supabase
      .from('audit_logs')
      .insert({
        event_type: 'qa_cleanup_complete',
        status: 'success',
        table_name: 'multiple_tables',
        details: {
          action: 'QA user cleanup completed',
          users_deleted: results.filter(r => r.success).length,
          remaining_profiles: remainingProfiles?.length || 0,
          remaining_accounts: remainingAccounts?.length || 0,
          remaining_events: remainingEvents?.length || 0,
          timestamp: new Date().toISOString()
        }
      })

    return new Response(
      JSON.stringify({
        success: true,
        message: `Cleaned up ${results.filter(r => r.success).length} test users`,
        results: results,
        verification: {
          remaining_profiles: remainingProfiles?.length || 0,
          remaining_accounts: remainingAccounts?.length || 0,
          remaining_events: remainingEvents?.length || 0
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Cleanup error:', error)
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