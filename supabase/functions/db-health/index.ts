import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TableInfo {
  table_name: string
  rls_enabled: boolean
  rls_forced: boolean
  policy_count: number
}

interface PolicyInfo {
  table_name: string
  policy_name: string
  command: string
  policy_type: string
}

interface Warning {
  type: 'missing_rls' | 'no_policies' | 'rls_not_forced'
  table_name: string
  message: string
  severity: 'high' | 'medium' | 'low'
}

interface HealthReport {
  tables: TableInfo[]
  policies: PolicyInfo[]
  warnings: Warning[]
  summary: {
    total_tables: number
    tables_with_rls: number
    tables_with_policies: number
    total_warnings: number
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Verify authorization
    const authHeader = req.headers.get('Authorization')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!authHeader || !serviceRoleKey) {
      console.error('Missing authorization header or service role key')
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    if (token !== serviceRoleKey) {
      console.error('Invalid service role key provided')
      return new Response(
        JSON.stringify({ error: 'Invalid authorization' }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabase = createClient(supabaseUrl, serviceRoleKey)

    console.log('Starting database health check...')

    // Get RLS status for all tables
    const { data: tableData, error: tableError } = await supabase
      .rpc('get_table_rls_status')

    if (tableError) {
      console.error('Error getting table RLS status:', tableError)
      
      // Fallback: try to get basic table info if RPC doesn't exist
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .eq('table_type', 'BASE TABLE')

      if (fallbackError) {
        throw new Error(`Failed to query table information: ${fallbackError.message}`)
      }

      // Create basic table info without RLS status
      const tables: TableInfo[] = (fallbackData || []).map((table: any) => ({
        table_name: table.table_name,
        rls_enabled: false,
        rls_forced: false,
        policy_count: 0
      }))

      const warnings: Warning[] = tables.map(table => ({
        type: 'missing_rls' as const,
        table_name: table.table_name,
        message: `Unable to verify RLS status for table ${table.table_name}`,
        severity: 'high' as const
      }))

      const report: HealthReport = {
        tables,
        policies: [],
        warnings,
        summary: {
          total_tables: tables.length,
          tables_with_rls: 0,
          tables_with_policies: 0,
          total_warnings: warnings.length
        }
      }

      return new Response(JSON.stringify(report), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const tables: TableInfo[] = tableData || []

    // Get policy information
    const { data: policyData, error: policyError } = await supabase
      .rpc('get_table_policies')

    let policies: PolicyInfo[] = []
    if (policyError) {
      console.warn('Error getting policy data:', policyError)
    } else {
      policies = policyData || []
    }

    // Generate warnings
    const warnings: Warning[] = []
    
    tables.forEach(table => {
      // Check for missing RLS
      if (!table.rls_enabled) {
        warnings.push({
          type: 'missing_rls',
          table_name: table.table_name,
          message: `Table ${table.table_name} does not have RLS enabled`,
          severity: 'high'
        })
      }

      // Check for RLS not forced
      if (table.rls_enabled && !table.rls_forced) {
        warnings.push({
          type: 'rls_not_forced',
          table_name: table.table_name,
          message: `Table ${table.table_name} has RLS enabled but not forced`,
          severity: 'medium'
        })
      }

      // Check for no policies
      if (table.rls_enabled && table.policy_count === 0) {
        warnings.push({
          type: 'no_policies',
          table_name: table.table_name,
          message: `Table ${table.table_name} has RLS enabled but no policies`,
          severity: 'high'
        })
      }
    })

    // Generate summary
    const summary = {
      total_tables: tables.length,
      tables_with_rls: tables.filter(t => t.rls_enabled).length,
      tables_with_policies: tables.filter(t => t.policy_count > 0).length,
      total_warnings: warnings.length
    }

    const report: HealthReport = {
      tables,
      policies,
      warnings,
      summary
    }

    console.log(`Health check complete: ${summary.total_tables} tables, ${summary.total_warnings} warnings`)

    return new Response(JSON.stringify(report), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Database health check failed:', error)
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