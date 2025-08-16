#!/usr/bin/env -S deno run --allow-env --allow-net

/**
 * Database Health Check Client Script
 * 
 * Usage:
 *   deno run --allow-env --allow-net scripts/check-rls.ts
 * 
 * Environment variables required:
 *   SUPABASE_URL - Your Supabase project URL
 *   SUPABASE_SERVICE_ROLE_KEY - Your service role key
 */

interface HealthReport {
  tables: Array<{
    table_name: string
    rls_enabled: boolean
    rls_forced: boolean
    policy_count: number
  }>
  policies: Array<{
    table_name: string
    policy_name: string
    command: string
    policy_type: string
  }>
  warnings: Array<{
    type: string
    table_name: string
    message: string
    severity: 'high' | 'medium' | 'low'
  }>
  summary: {
    total_tables: number
    tables_with_rls: number
    tables_with_policies: number
    total_warnings: number
  }
}

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  gray: '\x1b[90m'
}

function colorize(text: string, color: keyof typeof colors): string {
  return `${colors[color]}${text}${colors.reset}`
}

function printHeader(title: string): void {
  console.log(`\n${colorize('='.repeat(50), 'blue')}`)
  console.log(colorize(title, 'blue'))
  console.log(colorize('='.repeat(50), 'blue'))
}

function printSummary(summary: HealthReport['summary']): void {
  printHeader('📊 SUMMARY')
  
  console.log(`Total Tables: ${summary.total_tables}`)
  console.log(`Tables with RLS: ${colorize(summary.tables_with_rls.toString(), 'green')}`)
  console.log(`Tables with Policies: ${colorize(summary.tables_with_policies.toString(), 'green')}`)
  console.log(`Total Warnings: ${colorize(summary.total_warnings.toString(), summary.total_warnings === 0 ? 'green' : 'red')}`)
}

function printWarnings(warnings: HealthReport['warnings']): void {
  if (warnings.length === 0) {
    console.log(`\n${colorize('✅ No warnings found!', 'green')}`)
    return
  }

  printHeader('⚠️  WARNINGS')
  
  const grouped = warnings.reduce((acc, warning) => {
    if (!acc[warning.severity]) acc[warning.severity] = []
    acc[warning.severity].push(warning)
    return acc
  }, {} as Record<string, typeof warnings>)

  // Print high severity first
  for (const severity of ['high', 'medium', 'low']) {
    const items = grouped[severity] || []
    if (items.length === 0) continue

    const color = severity === 'high' ? 'red' : severity === 'medium' ? 'yellow' : 'gray'
    const icon = severity === 'high' ? '🚨' : severity === 'medium' ? '⚠️' : 'ℹ️'
    
    console.log(`\n${icon} ${colorize(severity.toUpperCase() + ' SEVERITY', color)}`)
    items.forEach(warning => {
      console.log(`  ${colorize('•', color)} ${warning.table_name}: ${warning.message}`)
    })
  }
}

function printOverallStatus(warnings: HealthReport['warnings']): void {
  console.log('\n' + '='.repeat(50))
  
  const highCount = warnings.filter(w => w.severity === 'high').length
  const mediumCount = warnings.filter(w => w.severity === 'medium').length
  
  if (highCount > 0) {
    console.log(colorize('🔴 CRITICAL ISSUES FOUND', 'red'))
    console.log(colorize(`${highCount} high severity issues require immediate attention`, 'red'))
  } else if (mediumCount > 0) {
    console.log(colorize('🟡 WARNINGS DETECTED', 'yellow'))
    console.log(colorize(`${mediumCount} medium severity issues should be reviewed`, 'yellow'))
  } else {
    console.log(colorize('🟢 ALL CHECKS PASSED', 'green'))
    console.log(colorize('Database security configuration looks good!', 'green'))
  }
  
  console.log('='.repeat(50))
}

async function main(): Promise<void> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  if (!supabaseUrl || !serviceRoleKey) {
    console.error(colorize('❌ Missing environment variables:', 'red'))
    console.error('   SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required')
    console.error('\nSet them in your environment or use:')
    console.error('   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... deno run ...')
    Deno.exit(1)
  }

  console.log(colorize('🔍 Checking database health...', 'blue'))

  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/db-health`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`HTTP ${response.status}: ${error}`)
    }

    const report: HealthReport = await response.json()
    
    printSummary(report.summary)
    printWarnings(report.warnings)
    printOverallStatus(report.warnings)

    // Exit with error code if there are high severity warnings
    const highSeverityCount = report.warnings.filter(w => w.severity === 'high').length
    if (highSeverityCount > 0) {
      Deno.exit(1)
    }

  } catch (error) {
    console.error(colorize(`❌ Health check failed: ${error.message}`, 'red'))
    Deno.exit(1)
  }
}

if (import.meta.main) {
  await main()
}