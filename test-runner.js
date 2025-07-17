import { runComprehensiveDiagnostics, testPremiumFeatureGating } from './services/diagnostics/comprehensiveDiagnostics';
import { testAllNavigationRoutes } from './services/diagnostics/navigationDiagnostics';
import { runAllTabDiagnostics } from './services/diagnostics/tabDiagnostics';
import { testFinancialPlanOperations } from './services/diagnostics/financialPlanTests';

console.log('🚀 Starting comprehensive application tests...\n');

const runTests = async () => {
  try {
    console.log('📋 Running Navigation Tests...');
    const navigationTests = await testAllNavigationRoutes();
    const navResults = Object.values(navigationTests).flat();
    console.log(`✅ Navigation: ${navResults.filter(r => r.status === 'success').length}/${navResults.length} passed\n`);

    console.log('🔖 Running Tab Diagnostics...');
    const tabTests = await runAllTabDiagnostics();
    const tabResults = Object.values(tabTests);
    console.log(`✅ Tabs: ${tabResults.filter(r => r.status === 'success').length}/${tabResults.length} passed\n`);

    console.log('💰 Running Financial Plan Tests...');
    const financialTests = await testFinancialPlanOperations();
    console.log(`✅ Financial Plans: ${financialTests.filter(r => r.status === 'success').length}/${financialTests.length} passed\n`);

    console.log('🔒 Running Premium Feature Gating Tests...');
    const premiumTests = await testPremiumFeatureGating();
    console.log(`✅ Premium Features: ${premiumTests.filter(r => r.status === 'success').length}/${premiumTests.length} passed\n`);

    console.log('📊 Running Comprehensive Diagnostics...');
    const comprehensiveResults = await runComprehensiveDiagnostics();
    
    console.log('\n🎯 COMPREHENSIVE TEST RESULTS:');
    console.log('=====================================');
    console.log(`Total Tests: ${comprehensiveResults.summary.totalTests}`);
    console.log(`✅ Passed: ${comprehensiveResults.summary.successCount}`);
    console.log(`⚠️  Warnings: ${comprehensiveResults.summary.warningCount}`);
    console.log(`❌ Errors: ${comprehensiveResults.summary.errorCount}`);
    console.log(`Overall Status: ${comprehensiveResults.summary.overallStatus.toUpperCase()}`);
    
    if (comprehensiveResults.summary.warningCount > 0 || comprehensiveResults.summary.errorCount > 0) {
      console.log('\n🔍 ISSUES FOUND:');
      console.log('================');
      
      const allIssues = [
        ...comprehensiveResults.buttons,
        ...comprehensiveResults.financialPlans,
        ...Object.values(comprehensiveResults.navigation).flat(),
        ...Object.values(comprehensiveResults.tabs)
      ].filter(test => test.status !== 'success');
      
      allIssues.forEach(issue => {
        const icon = issue.status === 'error' ? '❌' : '⚠️';
        console.log(`${icon} ${issue.route}: ${issue.message}`);
      });
    }
    
    console.log('\n🎉 Test execution completed!');
    
  } catch (error) {
    console.error('❌ Test execution failed:', error);
  }
};

runTests();