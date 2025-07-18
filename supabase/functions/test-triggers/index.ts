import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TriggerTestResult {
  test_name: string
  status: 'PASSED' | 'FAILED'
  details: string
  timestamp: string
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

    console.log('Starting comprehensive trigger validation tests...')
    const results: TriggerTestResult[] = []

    // Test 1: Transfer Validation - Insufficient Funds
    console.log('Testing transfer validation - insufficient funds...')
    try {
      await supabaseClient.from('transfers').insert({
        user_id: '00000000-0000-0000-0000-000000000002',
        from_account_id: '22222222-2222-2222-2222-222222222222', // $100 balance
        to_account_id: '44444444-4444-4444-4444-444444444444',
        amount: 500.00, // More than available
        transfer_fee: 5.00,
        status: 'pending',
        reference_number: 'TEST-INSUFFICIENT-' + Date.now()
      })
      
      results.push({
        test_name: 'Transfer: Insufficient Funds',
        status: 'FAILED',
        details: 'Transfer should have been blocked',
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      results.push({
        test_name: 'Transfer: Insufficient Funds',
        status: 'PASSED',
        details: `Correctly blocked: ${error.message}`,
        timestamp: new Date().toISOString()
      })
    }

    // Test 2: Transfer Validation - Closed Account
    console.log('Testing transfer validation - closed account...')
    try {
      await supabaseClient.from('transfers').insert({
        user_id: '00000000-0000-0000-0000-000000000003',
        from_account_id: '33333333-3333-3333-3333-333333333333', // Closed account
        to_account_id: '44444444-4444-4444-4444-444444444444',
        amount: 100.00,
        transfer_fee: 5.00,
        status: 'pending',
        reference_number: 'TEST-CLOSED-' + Date.now()
      })
      
      results.push({
        test_name: 'Transfer: Closed Account',
        status: 'FAILED',
        details: 'Transfer from closed account should have been blocked',
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      results.push({
        test_name: 'Transfer: Closed Account',
        status: 'PASSED',
        details: `Correctly blocked: ${error.message}`,
        timestamp: new Date().toISOString()
      })
    }

    // Test 3: Valid Transfer
    console.log('Testing valid transfer...')
    try {
      await supabaseClient.from('transfers').insert({
        user_id: '00000000-0000-0000-0000-000000000001',
        from_account_id: '11111111-1111-1111-1111-111111111111', // $10,000 balance
        to_account_id: '44444444-4444-4444-4444-444444444444',
        amount: 1000.00,
        transfer_fee: 10.00,
        status: 'pending',
        reference_number: 'TEST-VALID-' + Date.now()
      })
      
      results.push({
        test_name: 'Transfer: Valid Transfer',
        status: 'PASSED',
        details: 'Valid transfer was accepted',
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      results.push({
        test_name: 'Transfer: Valid Transfer',
        status: 'FAILED',
        details: `Valid transfer was blocked: ${error.message}`,
        timestamp: new Date().toISOString()
      })
    }

    // Test 4: HSA Over-contribution
    console.log('Testing HSA over-contribution...')
    try {
      await supabaseClient.from('hsa_contributions').insert({
        account_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        tx_date: new Date().toISOString().split('T')[0],
        amount: 10000.00, // Way over limit
        source: 'employee'
      })
      
      results.push({
        test_name: 'HSA: Over-contribution',
        status: 'FAILED',
        details: 'Over-contribution should have been blocked',
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      results.push({
        test_name: 'HSA: Over-contribution',
        status: 'PASSED',
        details: `Correctly blocked: ${error.message}`,
        timestamp: new Date().toISOString()
      })
    }

    // Test 5: HSA Inactive Account
    console.log('Testing HSA inactive account...')
    try {
      await supabaseClient.from('hsa_contributions').insert({
        account_id: 'cccccccc-cccc-cccc-cccc-cccccccccccc', // Inactive account
        tx_date: new Date().toISOString().split('T')[0],
        amount: 100.00,
        source: 'employee'
      })
      
      results.push({
        test_name: 'HSA: Inactive Account',
        status: 'FAILED',
        details: 'Contribution to inactive account should have been blocked',
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      results.push({
        test_name: 'HSA: Inactive Account',
        status: 'PASSED',
        details: `Correctly blocked: ${error.message}`,
        timestamp: new Date().toISOString()
      })
    }

    // Test 6: Valid HSA Contribution
    console.log('Testing valid HSA contribution...')
    try {
      await supabaseClient.from('hsa_contributions').insert({
        account_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        tx_date: new Date().toISOString().split('T')[0],
        amount: 500.00, // Within limits
        source: 'employee'
      })
      
      results.push({
        test_name: 'HSA: Valid Contribution',
        status: 'PASSED',
        details: 'Valid HSA contribution was accepted',
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      results.push({
        test_name: 'HSA: Valid Contribution',
        status: 'FAILED',
        details: `Valid contribution was blocked: ${error.message}`,
        timestamp: new Date().toISOString()
      })
    }

    // Test 7: Emergency Access Logging
    console.log('Testing emergency access logging...')
    try {
      await supabaseClient.from('health_doc_access_log').insert({
        doc_id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
        accessed_by_user_id: '00000000-0000-0000-0000-000000000001',
        access_type: 'emergency',
        access_method: 'emergency',
        emergency_token: 'EMERGENCY-TOKEN-123',
        emergency_context: 'Medical emergency - patient unconscious',
        ip_address: '192.168.1.100',
        user_agent: 'Emergency Response App',
        accessed_at: new Date().toISOString()
      })
      
      results.push({
        test_name: 'Healthcare: Emergency Access Logging',
        status: 'PASSED',
        details: 'Emergency access was logged successfully',
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      results.push({
        test_name: 'Healthcare: Emergency Access Logging',
        status: 'FAILED',
        details: `Emergency access logging failed: ${error.message}`,
        timestamp: new Date().toISOString()
      })
    }

    // Get audit log summary
    const { count: auditLogCount } = await supabaseClient
      .from('audit_logs')
      .select('*', { count: 'exact', head: true })

    console.log('Trigger validation tests completed:', results)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Comprehensive trigger validation completed',
        test_results: results,
        summary: {
          total_tests: results.length,
          passed: results.filter(r => r.status === 'PASSED').length,
          failed: results.filter(r => r.status === 'FAILED').length,
          audit_logs_created: auditLogCount || 0
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Trigger validation test error:', error)
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