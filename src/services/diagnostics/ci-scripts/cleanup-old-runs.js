#!/usr/bin/env node

/**
 * Cleanup script for old diagnostic test runs
 * Maintains database hygiene by removing old test records
 */

const { createClient } = require('@supabase/supabase-js');

// Get environment variables
const SUPABASE_URL = 'https://xcmqjkvyvuhoslbzmlgi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjbXFqa3Z5dnVob3NsYnptbGdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NjQ5MjUsImV4cCI6MjA2MjA0MDkyNX0.x0UM2ezINls7QytsvURR5zYitUiZ52G8Pl5s78ILDfU';

// Parse command line arguments
const args = process.argv.slice(2);
const retentionDays = parseInt(args.find(arg => arg.startsWith('--retention-days='))?.split('=')[1] || '90', 10);

console.log(`🧹 Diagnostic Test Cleanup Configuration:`);
console.log(`  - Retention period: ${retentionDays} days`);

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Main cleanup function
 */
async function cleanupOldRuns() {
  try {
    console.log('🔍 Starting cleanup of old diagnostic test runs...');
    
    // Get statistics before cleanup
    const { data: statsBefore } = await supabase.rpc('get_diagnostic_test_stats', {
      p_environment: null,
      p_days_back: 365 // Get full year stats
    });
    
    console.log(`📊 Current statistics:`);
    console.log(`  - Total runs in last year: ${statsBefore?.total_runs || 0}`);
    console.log(`  - Success rate: ${statsBefore?.success_rate || 0}%`);
    
    // Run cleanup function
    const { data: deletedCount, error } = await supabase.rpc('cleanup_old_diagnostic_runs', {
      p_retention_days: retentionDays
    });
    
    if (error) {
      throw new Error(`Cleanup failed: ${error.message}`);
    }
    
    console.log(`✅ Cleanup completed successfully`);
    console.log(`🗑️ Deleted ${deletedCount || 0} old test run records`);
    
    // Get statistics after cleanup
    const { data: statsAfter } = await supabase.rpc('get_diagnostic_test_stats', {
      p_environment: null,
      p_days_back: retentionDays
    });
    
    console.log(`📈 Retained statistics (last ${retentionDays} days):`);
    console.log(`  - Total runs: ${statsAfter?.total_runs || 0}`);
    console.log(`  - Success rate: ${statsAfter?.success_rate || 0}%`);
    console.log(`  - Average execution time: ${statsAfter?.avg_execution_time_ms || 0}ms`);
    
    process.exit(0);
    
  } catch (error) {
    console.error('💥 Cleanup failed:', error);
    process.exit(1);
  }
}

cleanupOldRuns();