import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TestUser {
  email: string
  password: string
  role: string
  full_name: string
  first_name: string
  last_name: string
  subscription_tier: string
}

const testUsers: TestUser[] = [
  {
    email: 'client@test.com',
    password: 'TestClient2024!',
    role: 'client',
    full_name: 'Test Client User',
    first_name: 'Test',
    last_name: 'Client',
    subscription_tier: 'premium'
  },
  {
    email: 'advisor@test.com',
    password: 'TestAdvisor2024!',
    role: 'advisor',
    full_name: 'Test Advisor User',
    first_name: 'Test',
    last_name: 'Advisor',
    subscription_tier: 'premium'
  },
  {
    email: 'accountant@test.com',
    password: 'TestAccountant2024!',
    role: 'accountant',
    full_name: 'Test Accountant User',
    first_name: 'Test',
    last_name: 'Accountant',
    subscription_tier: 'premium'
  },
  {
    email: 'consultant@test.com',
    password: 'TestConsultant2024!',
    role: 'consultant',
    full_name: 'Test Consultant User',
    first_name: 'Test',
    last_name: 'Consultant',
    subscription_tier: 'premium'
  },
  {
    email: 'attorney@test.com',
    password: 'TestAttorney2024!',
    role: 'attorney',
    full_name: 'Test Attorney User',
    first_name: 'Test',
    last_name: 'Attorney',
    subscription_tier: 'premium'
  },
  {
    email: 'admin@test.com',
    password: 'TestAdmin2024!',
    role: 'admin',
    full_name: 'Test Admin User',
    first_name: 'Test',
    last_name: 'Admin',
    subscription_tier: 'elite'
  },
  {
    email: 'sysadmin@test.com',
    password: 'TestSysAdmin2024!',
    role: 'system_administrator',
    full_name: 'Test System Admin',
    first_name: 'Test',
    last_name: 'SysAdmin',
    subscription_tier: 'elite'
  }
]

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create admin client for user creation
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

    // Create regular client for data insertion
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const results = []
    
    // First, create test tenant
    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .upsert({
        id: '11111111-1111-1111-1111-111111111111',
        name: 'QA Test Family Office',
        billing_status: 'enterprise',
        color_palette: {
          primary: '#1F1F1F',
          secondary: '#F5F5F5',
          accent: '#FFD700'
        }
      })
      .select()

    if (tenantError) {
      console.error('Tenant creation error:', tenantError)
    }

    // Create each test user
    for (const testUser of testUsers) {
      try {
        // Create user in auth.users
        const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: testUser.email,
          password: testUser.password,
          email_confirm: true,
          user_metadata: {
            full_name: testUser.full_name,
            first_name: testUser.first_name,
            last_name: testUser.last_name
          }
        })

        if (authError) {
          console.error(`Auth user creation error for ${testUser.email}:`, authError)
          results.push({
            email: testUser.email,
            success: false,
            error: authError.message
          })
          continue
        }

        if (!authUser.user) {
          results.push({
            email: testUser.email,
            success: false,
            error: 'No user returned from auth creation'
          })
          continue
        }

        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: authUser.user.id,
            email: testUser.email,
            full_name: testUser.full_name,
            first_name: testUser.first_name,
            last_name: testUser.last_name,
            role: testUser.role,
            tenant_id: '11111111-1111-1111-1111-111111111111',
            subscription_tier: testUser.subscription_tier,
            subscription_status: 'active',
            add_ons: {},
            two_factor_enabled: false
          })

        if (profileError) {
          console.error(`Profile creation error for ${testUser.email}:`, profileError)
          results.push({
            email: testUser.email,
            success: false,
            error: `Profile error: ${profileError.message}`
          })
          continue
        }

        // Create bank accounts for financial users
        if (['client', 'advisor'].includes(testUser.role)) {
          const bankAccounts = testUser.role === 'client' ? [
            {
              id: `${authUser.user.id.slice(0, 8)}-aaaa-aaaa-aaaa-aaaaaaaaaaaa`,
              user_id: authUser.user.id,
              name: 'Test Checking Account',
              account_type: 'checking',
              balance: 15000.00,
              institution_name: 'Test Bank',
              account_number_last4: '1234'
            },
            {
              id: `${authUser.user.id.slice(0, 8)}-bbbb-bbbb-bbbb-bbbbbbbbbbbb`,
              user_id: authUser.user.id,
              name: 'Test Savings Account',
              account_type: 'savings',
              balance: 50000.00,
              institution_name: 'Test Bank',
              account_number_last4: '5678'
            }
          ] : [
            {
              id: `${authUser.user.id.slice(0, 8)}-cccc-cccc-cccc-cccccccccccc`,
              user_id: authUser.user.id,
              name: 'Advisor Business Account',
              account_type: 'checking',
              balance: 25000.00,
              institution_name: 'Business Bank',
              account_number_last4: '9012'
            }
          ]

          for (const account of bankAccounts) {
            const { error: bankError } = await supabase
              .from('bank_accounts')
              .upsert(account)

            if (bankError) {
              console.error(`Bank account error for ${testUser.email}:`, bankError)
            }
          }
        }

        // Create analytics events
        const { error: analyticsError } = await supabase
          .from('analytics_events')
          .insert({
            user_id: authUser.user.id,
            tenant_id: '11111111-1111-1111-1111-111111111111',
            event_type: 'page_view',
            event_category: 'navigation',
            event_data: {
              page: `/${testUser.role}-dashboard`,
              role: testUser.role,
              test_data: true
            },
            session_id: `test-session-${authUser.user.id.slice(0, 8)}`
          })

        if (analyticsError) {
          console.error(`Analytics error for ${testUser.email}:`, analyticsError)
        }

        results.push({
          email: testUser.email,
          user_id: authUser.user.id,
          role: testUser.role,
          password: testUser.password,
          success: true
        })

      } catch (error) {
        console.error(`Overall error for ${testUser.email}:`, error)
        results.push({
          email: testUser.email,
          success: false,
          error: error.message
        })
      }
    }

    // Log the setup completion
    await supabase
      .from('audit_logs')
      .insert({
        event_type: 'qa_users_setup',
        status: 'success',
        table_name: 'multiple_tables',
        details: {
          action: 'QA test users created',
          users_created: results.filter(r => r.success).length,
          total_attempts: results.length,
          timestamp: new Date().toISOString()
        }
      })

    return new Response(
      JSON.stringify({
        success: true,
        message: `Created ${results.filter(r => r.success).length} test users`,
        results: results,
        tenant_id: '11111111-1111-1111-1111-111111111111'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Setup error:', error)
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