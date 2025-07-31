// Comprehensive QA Diagnostics Runner
import { runComprehensiveDiagnostics, testPremiumFeatureGating } from './src/services/diagnostics/comprehensiveDiagnostics.js';
import { testAllNavigationRoutes } from './src/services/diagnostics/navigationDiagnostics.js';
import { runAllTabDiagnostics } from './src/services/diagnostics/tabDiagnostics.js';
import { testFinancialPlanOperations } from './src/services/diagnostics/financialPlanTests.js';

console.log('🔍 COMPREHENSIVE QA DIAGNOSTICS\n');
console.log('================================');

const runQADiagnostics = async () => {
  const results = {
    navigation: null,
    tabs: null,
    financialPlans: null,
    premiumFeatures: null,
    comprehensive: null,
    summary: {
      totalTests: 0,
      passed: 0,
      warnings: 0,
      errors: 0,
      overallStatus: 'unknown'
    }
  };

  try {
    // Navigation Tests
    console.log('🧭 Running Navigation & Routing Tests...');
    results.navigation = await testAllNavigationRoutes();
    const navResults = Object.values(results.navigation).flat();
    const navPassed = navResults.filter(r => r.status === 'success').length;
    console.log(`   ✅ Navigation: ${navPassed}/${navResults.length} routes accessible\n`);

    // Tab Diagnostics
    console.log('📋 Running Tab & Component Tests...');
    results.tabs = await runAllTabDiagnostics();
    const tabResults = Object.values(results.tabs);
    const tabPassed = tabResults.filter(r => r.status === 'success').length;
    console.log(`   ✅ Tabs: ${tabPassed}/${tabResults.length} components functional\n`);

    // Financial Plan Tests
    console.log('💰 Running Financial Features Tests...');
    results.financialPlans = await testFinancialPlanOperations();
    const finPassed = results.financialPlans.filter(r => r.status === 'success').length;
    console.log(`   ✅ Financial: ${finPassed}/${results.financialPlans.length} operations working\n`);

    // Premium Feature Gating
    console.log('🔒 Running Premium Feature Access Tests...');
    results.premiumFeatures = await testPremiumFeatureGating();
    const premPassed = results.premiumFeatures.filter(r => r.status === 'success').length;
    console.log(`   ✅ Premium: ${premPassed}/${results.premiumFeatures.length} access controls active\n`);

    // Comprehensive Diagnostics
    console.log('📊 Running Full System Diagnostics...');
    results.comprehensive = await runComprehensiveDiagnostics();
    
    // Calculate summary
    results.summary = {
      totalTests: results.comprehensive.summary.totalTests,
      passed: results.comprehensive.summary.successCount,
      warnings: results.comprehensive.summary.warningCount,
      errors: results.comprehensive.summary.errorCount,
      overallStatus: results.comprehensive.summary.overallStatus
    };

    console.log('\n🎯 QA DIAGNOSTICS SUMMARY');
    console.log('==========================');
    console.log(`📊 Total Tests: ${results.summary.totalTests}`);
    console.log(`✅ Passed: ${results.summary.passed}`);
    console.log(`⚠️  Warnings: ${results.summary.warnings}`);
    console.log(`❌ Errors: ${results.summary.errors}`);
    console.log(`🏆 Overall Status: ${results.summary.overallStatus.toUpperCase()}`);
    
    // Detailed Issues Report
    if (results.summary.warnings > 0 || results.summary.errors > 0) {
      console.log('\n🚨 CRITICAL ISSUES REQUIRING ATTENTION');
      console.log('======================================');
      
      const allIssues = [
        ...results.comprehensive.buttons,
        ...results.comprehensive.financialPlans,
        ...Object.values(results.comprehensive.navigation).flat(),
        ...Object.values(results.comprehensive.tabs)
      ].filter(test => test.status !== 'success');
      
      const criticalIssues = allIssues.filter(issue => issue.status === 'error');
      const warnings = allIssues.filter(issue => issue.status === 'warning');
      
      if (criticalIssues.length > 0) {
        console.log('\n❌ CRITICAL ERRORS (Must Fix Before Production):');
        criticalIssues.forEach(issue => {
          console.log(`   ❌ ${issue.route || issue.name}: ${issue.message}`);
        });
      }
      
      if (warnings.length > 0) {
        console.log('\n⚠️  WARNINGS (Review Recommended):');
        warnings.forEach(issue => {
          console.log(`   ⚠️  ${issue.route || issue.name}: ${issue.message}`);
        });
      }
    }

    // Production Readiness Assessment
    console.log('\n🚀 PRODUCTION READINESS ASSESSMENT');
    console.log('===================================');
    
    const readinessScore = Math.round((results.summary.passed / results.summary.totalTests) * 100);
    const isProductionReady = readinessScore >= 95 && results.summary.errors === 0;
    
    console.log(`📈 Readiness Score: ${readinessScore}%`);
    console.log(`🎯 Production Ready: ${isProductionReady ? 'YES ✅' : 'NO ❌'}`);
    
    if (!isProductionReady) {
      console.log('\n🔧 REQUIRED ACTIONS BEFORE PRODUCTION:');
      if (results.summary.errors > 0) {
        console.log(`   • Fix ${results.summary.errors} critical error(s)`);
      }
      if (readinessScore < 95) {
        console.log(`   • Improve test pass rate to 95%+ (currently ${readinessScore}%)`);
      }
    }
    
    console.log('\n🎉 QA Diagnostics Complete!');
    return results;
    
  } catch (error) {
    console.error('❌ QA Diagnostics Failed:', error);
    return { error: error.message, results };
  }
};

runQADiagnostics();