#!/usr/bin/env node

/**
 * Enhanced CI Diagnostic Runner with Database Integration
 * This script runs comprehensive diagnostics and logs results to database
 */

const { createClient } = require('@supabase/supabase-js');
const { runDiagnostics } = require('../index');

// Get environment variables
const SUPABASE_URL = 'https://xcmqjkvyvuhoslbzmlgi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjbXFqa3Z5dnVob3NsYnptbGdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NjQ5MjUsImV4cCI6MjA2MjA0MDkyNX0.x0UM2ezINls7QytsvURR5zYitUiZ52G8Pl5s78ILDfU';

// Parse command line arguments
const args = process.argv.slice(2);
const parsedArgs = {};

args.forEach(arg => {
  if (arg.startsWith('--')) {
    const [key, value] = arg.substring(2).split('=');
    parsedArgs[key] = value || true;
  }
});

// Set configuration
const environment = parsedArgs.environment || 'ci';
const outputFile = parsedArgs.outputFile || 'enhanced-diagnostics-report.json';
const failOnError = parsedArgs.failOnError !== 'false';
const timeout = parseInt(parsedArgs.timeout || '120000', 10);
const gitCommitHash = process.env.GITHUB_SHA || null;
const gitBranch = process.env.GITHUB_REF_NAME || 'unknown';

console.log('🔍 Enhanced Diagnostics Runner Configuration:');
console.log(`  - Environment: ${environment}`);
console.log(`  - Output file: ${outputFile}`);
console.log(`  - Fail on error: ${failOnError}`);
console.log(`  - Timeout: ${timeout}ms`);
console.log(`  - Git commit: ${gitCommitHash?.substring(0, 8) || 'unknown'}`);
console.log(`  - Git branch: ${gitBranch}`);

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Run comprehensive diagnostic tests
 */
async function runComprehensiveDiagnostics() {
  const startTime = Date.now();
  
  try {
    console.log('🚀 Running comprehensive diagnostic tests...');
    
    // Run database tests
    console.log('📊 Running database diagnostics...');
    const { data: basicTests } = await supabase.rpc('test_basic_functionality');
    const { data: edgeTests } = await supabase.rpc('test_edge_functions');
    
    // Run application diagnostics
    console.log('🏗️ Running application diagnostics...');
    const appResults = await runDiagnostics();
    
    // Combine results
    const allTests = [
      ...(basicTests || []),
      ...(edgeTests || [])
    ];
    
    // Calculate statistics
    const totalTests = allTests.length;
    const passedTests = allTests.filter(test => test.pass_fail === 'PASS').length;
    const failedTests = allTests.filter(test => test.pass_fail === 'FAIL').length;
    const warningTests = allTests.filter(test => test.pass_fail === 'WARNING').length;
    
    const overallStatus = failedTests > 0 ? 'fail' : (warningTests > 0 ? 'warning' : 'pass');
    const executionTime = Date.now() - startTime;
    
    // Build comprehensive report
    const report = {
      timestamp: new Date().toISOString(),
      environment,
      git: {
        commit_hash: gitCommitHash,
        branch: gitBranch
      },
      execution_time_ms: executionTime,
      overall_status: overallStatus,
      summary: {
        total_tests: totalTests,
        passed_tests: passedTests,
        failed_tests: failedTests,
        warning_tests: warningTests,
        success_rate: totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0
      },
      database_tests: allTests,
      application_tests: appResults,
      performance_metrics: {
        database_response_time: executionTime,
        memory_usage: process.memoryUsage(),
        system_load: process.cpuUsage()
      }
    };
    
    // Log results to database
    console.log('💾 Logging results to database...');
    const { data: logId, error: logError } = await supabase.rpc('log_diagnostic_test_run', {
      p_environment: environment,
      p_git_commit_hash: gitCommitHash,
      p_git_branch: gitBranch,
      p_total_tests: totalTests,
      p_passed_tests: passedTests,
      p_failed_tests: failedTests,
      p_warnings_count: warningTests,
      p_execution_time_ms: executionTime,
      p_overall_status: overallStatus,
      p_test_results: report,
      p_error_details: failedTests > 0 ? { failed_tests: allTests.filter(t => t.pass_fail === 'FAIL') } : null
    });
    
    if (logError) {
      console.warn('⚠️ Failed to log results to database:', logError.message);
    } else {
      console.log('✅ Results logged to database with ID:', logId);
      report.database_log_id = logId;
    }
    
    // Write report to file
    const fs = require('fs');
    fs.writeFileSync(outputFile, JSON.stringify(report, null, 2));
    console.log(`📄 Report written to ${outputFile}`);
    
    // Print summary
    console.log('\n📋 DIAGNOSTIC SUMMARY:');
    console.log('═'.repeat(50));
    console.log(`Status: ${overallStatus.toUpperCase()}`);
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests} (${report.summary.success_rate}%)`);
    if (failedTests > 0) console.log(`Failed: ${failedTests}`);
    if (warningTests > 0) console.log(`Warnings: ${warningTests}`);
    console.log(`Execution Time: ${executionTime}ms`);
    console.log('═'.repeat(50));
    
    // Print failed tests details
    if (failedTests > 0) {
      console.log('\n❌ FAILED TESTS:');
      allTests.filter(t => t.pass_fail === 'FAIL').forEach(test => {
        console.log(`  • ${test.area_feature} - ${test.test_case}`);
        console.log(`    Expected: ${test.expected_result}`);
        console.log(`    Actual: ${test.actual_result}`);
        if (test.notes) console.log(`    Notes: ${test.notes}`);
      });
    }
    
    // Exit with appropriate code
    if (failOnError && failedTests > 0) {
      console.log('\n💥 Exiting with error code 1 due to test failures');
      process.exit(1);
    } else {
      console.log('\n✅ All critical tests passed successfully');
      process.exit(0);
    }
    
  } catch (error) {
    console.error('💥 Diagnostic runner failed:', error);
    
    // Log error to database
    try {
      await supabase.rpc('log_diagnostic_test_run', {
        p_environment: environment,
        p_git_commit_hash: gitCommitHash,
        p_git_branch: gitBranch,
        p_total_tests: 0,
        p_passed_tests: 0,
        p_failed_tests: 1,
        p_warnings_count: 0,
        p_execution_time_ms: Date.now() - startTime,
        p_overall_status: 'fail',
        p_test_results: { error: error.message },
        p_error_details: { 
          error_message: error.message,
          error_stack: error.stack,
          error_type: 'runner_failure'
        }
      });
    } catch (logError) {
      console.error('Failed to log error to database:', logError);
    }
    
    // Write error report
    const errorReport = {
      timestamp: new Date().toISOString(),
      environment,
      overall_status: 'error',
      error: {
        message: error.message,
        stack: error.stack
      }
    };
    
    const fs = require('fs');
    fs.writeFileSync(outputFile, JSON.stringify(errorReport, null, 2));
    process.exit(1);
  }
}

// Set up timeout
const timeoutPromise = new Promise((_, reject) => {
  setTimeout(() => reject(new Error(`Diagnostics timed out after ${timeout}ms`)), timeout);
});

// Run diagnostics with timeout
Promise.race([
  runComprehensiveDiagnostics(),
  timeoutPromise
])
.catch(error => {
  console.error('💥 Timeout or fatal error:', error);
  process.exit(1);
});