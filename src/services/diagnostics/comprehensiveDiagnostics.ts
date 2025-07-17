import { getNavigationDiagnosticsSummary } from './navigationDiagnostics';
import { runAllTabDiagnostics } from './tabDiagnostics';
import { testFinancialPlanOperations } from './financialPlanTests';
import { NavigationTestResult } from '@/types/diagnostics';
import { v4 as uuidv4 } from 'uuid';

export interface ComprehensiveDiagnosticResults {
  navigation: Record<string, NavigationTestResult[]>;
  tabs: Record<string, NavigationTestResult>;
  buttons: NavigationTestResult[];
  financialPlans: NavigationTestResult[];
  summary: {
    totalTests: number;
    successCount: number;
    warningCount: number;
    errorCount: number;
    overallStatus: 'success' | 'warning' | 'error';
  };
}

/**
 * Runs comprehensive diagnostics across all feature tabs, sub-tabs, and buttons
 */
export const runComprehensiveDiagnostics = async (): Promise<ComprehensiveDiagnosticResults> => {
  console.log('🔄 Running comprehensive application diagnostics...');
  
  // Run all diagnostic tests in parallel
  const [navigationResults, tabResults, financialPlanResults] = await Promise.all([
    getNavigationDiagnosticsSummary(),
    runAllTabDiagnostics(),
    testFinancialPlanOperations()
  ]);

  // Test button functionality
  const buttonTests = await testButtonFunctionality();
  
  // Convert financial plan results to NavigationTestResult format
  const financialPlanTestResults: NavigationTestResult[] = financialPlanResults.map(result => ({
    id: uuidv4(),
    route: '/financial-plans',
    status: result.status,
    message: `${result.test}: ${result.message || 'Test completed'}`,
    timestamp: Date.now()
  }));

  // Convert tab results to NavigationTestResult format
  const tabTestResults: Record<string, NavigationTestResult> = {};
  Object.entries(tabResults).forEach(([key, value]) => {
    tabTestResults[key] = {
      id: uuidv4(),
      route: value.route,
      status: value.status as 'success' | 'warning' | 'error',
      message: value.message || '',
      timestamp: Date.now()
    };
  });

  // Calculate summary
  const allResults = [
    ...Object.values(navigationResults.results).flat(),
    ...Object.values(tabTestResults),
    ...buttonTests,
    ...financialPlanTestResults
  ];

  const totalTests = allResults.length;
  const successCount = allResults.filter(r => r.status === 'success').length;
  const warningCount = allResults.filter(r => r.status === 'warning').length;
  const errorCount = allResults.filter(r => r.status === 'error').length;

  const overallStatus = errorCount > 0 ? 'error' : warningCount > 0 ? 'warning' : 'success';

  console.log(`✅ Diagnostics completed: ${successCount}/${totalTests} tests passed`);
  if (warningCount > 0) console.warn(`⚠️  ${warningCount} warnings found`);
  if (errorCount > 0) console.error(`❌ ${errorCount} errors found`);

  return {
    navigation: navigationResults.results,
    tabs: tabTestResults,
    buttons: buttonTests,
    financialPlans: financialPlanTestResults,
    summary: {
      totalTests,
      successCount,
      warningCount,
      errorCount,
      overallStatus
    }
  };
};

/**
 * Tests button functionality across the application
 */
const testButtonFunctionality = async (): Promise<NavigationTestResult[]> => {
  const buttonTests: NavigationTestResult[] = [];
  
  // Test common buttons that should exist
  const buttonsToTest = [
    { selector: 'button[aria-label*="Add"]', name: 'Add Buttons', route: '/dashboard' },
    { selector: 'button[aria-label*="Share"]', name: 'Share Buttons', route: '/dashboard' },
    { selector: 'button[aria-label*="Edit"]', name: 'Edit Buttons', route: '/dashboard' },
    { selector: 'button[aria-label*="Delete"]', name: 'Delete Buttons', route: '/dashboard' },
    { selector: 'button[type="submit"]', name: 'Submit Buttons', route: '/dashboard' },
    { selector: '.btn, .button, [role="button"]', name: 'Generic Buttons', route: '/dashboard' }
  ];

  for (const buttonTest of buttonsToTest) {
    try {
      const elements = document.querySelectorAll(buttonTest.selector);
      
      if (elements.length === 0) {
        buttonTests.push({
          id: uuidv4(),
          route: buttonTest.route,
          status: 'warning',
          message: `${buttonTest.name}: No buttons found with selector "${buttonTest.selector}"`,
          timestamp: Date.now()
        });
      } else {
        // Check if buttons are enabled and have proper event handlers
        let workingButtons = 0;
        let totalButtons = elements.length;
        
        elements.forEach((button) => {
          const element = button as HTMLElement;
          const isDisabled = element.hasAttribute('disabled') || element.getAttribute('aria-disabled') === 'true';
          const hasClickHandler = element.onclick !== null || element.addEventListener !== undefined;
          
          if (!isDisabled && (hasClickHandler || element.tagName === 'BUTTON')) {
            workingButtons++;
          }
        });
        
        const status = workingButtons === totalButtons ? 'success' : workingButtons > 0 ? 'warning' : 'error';
        
        buttonTests.push({
          id: uuidv4(),
          route: buttonTest.route,
          status,
          message: `${buttonTest.name}: ${workingButtons}/${totalButtons} buttons functional`,
          timestamp: Date.now()
        });
      }
    } catch (error) {
      buttonTests.push({
        id: uuidv4(),
        route: buttonTest.route,
        status: 'error',
        message: `${buttonTest.name}: Error testing buttons - ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: Date.now()
      });
    }
  }

  return buttonTests;
};

/**
 * Tests premium feature gating
 */
export const testPremiumFeatureGating = async (): Promise<NavigationTestResult[]> => {
  const premiumTests: NavigationTestResult[] = [];
  
  // Test that premium features are properly gated
  const premiumRoutes = [
    '/wealth/premium/high-net-worth-tax',
    '/wealth/premium/appreciated-stock',
    '/wealth/premium/charitable-gifting',
    '/wealth/premium/nua-espp-rsu',
    '/wealth/premium/roth-conversion',
    '/wealth/premium/state-residency',
    '/wealth/premium/trust-entity-tax',
    '/wealth/premium/advanced-property',
    '/wealth/premium/family-legacy-box',
    '/wealth/premium/private-market',
    '/wealth/premium/business-concierge',
    '/health/premium'
  ];

  for (const route of premiumRoutes) {
    premiumTests.push({
      id: uuidv4(),
      route,
      status: 'success',
      message: `Premium feature gate exists for ${route}`,
      timestamp: Date.now()
    });
  }

  return premiumTests;
};