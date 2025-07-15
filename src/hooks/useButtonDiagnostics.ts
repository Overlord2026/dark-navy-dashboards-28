import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface ButtonTest {
  id: string;
  name: string;
  component: string;
  type: 'add' | 'share';
  status: 'idle' | 'testing' | 'success' | 'error';
  error?: string;
  lastTested?: Date;
  successRate?: number;
}

export interface ButtonDiagnosticsResult {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  successRate: number;
  results: ButtonTest[];
}

export const useButtonDiagnostics = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<ButtonDiagnosticsResult | null>(null);

  const buttonTests: ButtonTest[] = [
    // Add Button Tests
    { id: 'add-property', name: 'Add Property', component: 'PropertyList', type: 'add', status: 'idle' },
    { id: 'add-health-doc', name: 'Add Health Document', component: 'HealthDocs', type: 'add', status: 'idle' },
    { id: 'add-ccda', name: 'Add CCDA File', component: 'ShareData', type: 'add', status: 'idle' },
    { id: 'add-financial-plan', name: 'Add Financial Plan', component: 'FinancialPlanning', type: 'add', status: 'idle' },
    { id: 'add-family-member', name: 'Add Family Member', component: 'FamilyMembers', type: 'add', status: 'idle' },
    { id: 'add-professional', name: 'Add Professional', component: 'Professionals', type: 'add', status: 'idle' },
    { id: 'add-hsa-account', name: 'Add HSA Account', component: 'HSAAccounts', type: 'add', status: 'idle' },
    { id: 'add-bill-payment', name: 'Add Bill Payment', component: 'BillPay', type: 'add', status: 'idle' },
    
    // Share Button Tests
    { id: 'share-data', name: 'Generate Share Link', component: 'ShareData', type: 'share', status: 'idle' },
    { id: 'share-document', name: 'Share Document', component: 'DocumentSharing', type: 'share', status: 'idle' },
    { id: 'share-estate-doc', name: 'Share Estate Document', component: 'EstateDocuments', type: 'share', status: 'idle' },
    { id: 'share-health-doc', name: 'Share Health Document', component: 'HealthDocs', type: 'share', status: 'idle' },
  ];

  const testButton = useCallback(async (buttonTest: ButtonTest): Promise<ButtonTest> => {
    try {
      // Simulate button functionality test
      const testElement = document.querySelector(`[data-testid="${buttonTest.id}"]`);
      
      if (!testElement) {
        return {
          ...buttonTest,
          status: 'error',
          error: 'Button element not found in DOM',
          lastTested: new Date()
        };
      }

      // Check if button is enabled and clickable
      if (testElement.hasAttribute('disabled') || testElement.getAttribute('aria-disabled') === 'true') {
        return {
          ...buttonTest,
          status: 'error',
          error: 'Button is disabled',
          lastTested: new Date()
        };
      }

      // Check for required event handlers
      const hasClickHandler = testElement.getAttribute('onclick') || 
                             testElement.hasAttribute('data-has-click-handler');
      
      if (!hasClickHandler) {
        return {
          ...buttonTest,
          status: 'error',
          error: 'No click handler found',
          lastTested: new Date()
        };
      }

      // Additional checks for share buttons
      if (buttonTest.type === 'share') {
        // Check if sharing dependencies are met
        if (buttonTest.id === 'share-data') {
          const documentsExist = document.querySelector('[data-testid="document-list"]');
          const professionalsExist = document.querySelector('[data-testid="professionals-list"]');
          
          if (!documentsExist) {
            return {
              ...buttonTest,
              status: 'error',
              error: 'No documents available for sharing',
              lastTested: new Date()
            };
          }
        }
      }

      return {
        ...buttonTest,
        status: 'success',
        lastTested: new Date()
      };

    } catch (error) {
      return {
        ...buttonTest,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        lastTested: new Date()
      };
    }
  }, []);

  const runDiagnostics = useCallback(async () => {
    setIsRunning(true);
    
    try {
      const testResults: ButtonTest[] = [];
      
      // Test all buttons
      for (const buttonTest of buttonTests) {
        const result = await testButton(buttonTest);
        testResults.push(result);
      }

      const passedTests = testResults.filter(test => test.status === 'success').length;
      const failedTests = testResults.filter(test => test.status === 'error').length;
      const successRate = (passedTests / testResults.length) * 100;

      const diagnosticsResult: ButtonDiagnosticsResult = {
        totalTests: testResults.length,
        passedTests,
        failedTests,
        successRate,
        results: testResults
      };

      setResults(diagnosticsResult);
      
      // Show summary toast
      if (successRate === 100) {
        toast.success(`All ${testResults.length} button tests passed!`);
      } else {
        toast.warning(`${passedTests}/${testResults.length} button tests passed (${successRate.toFixed(1)}%)`);
      }

    } catch (error) {
      toast.error('Failed to run button diagnostics');
      console.error('Button diagnostics error:', error);
    } finally {
      setIsRunning(false);
    }
  }, [testButton]);

  const testSpecificButton = useCallback(async (buttonId: string) => {
    const buttonTest = buttonTests.find(test => test.id === buttonId);
    if (!buttonTest) {
      toast.error('Button test not found');
      return;
    }

    const result = await testButton(buttonTest);
    
    if (result.status === 'success') {
      toast.success(`${result.name} test passed`);
    } else {
      toast.error(`${result.name} test failed: ${result.error}`);
    }

    return result;
  }, [testButton]);

  const getButtonStatus = useCallback((buttonId: string): ButtonTest | null => {
    return results?.results.find(test => test.id === buttonId) || null;
  }, [results]);

  return {
    isRunning,
    results,
    runDiagnostics,
    testSpecificButton,
    getButtonStatus
  };
};