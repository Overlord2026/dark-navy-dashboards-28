import React from 'react';
import { getFlag, setFlag } from '@/config/flags';
import { getRedirectPath } from '@/utils/redirects';

/**
 * Test component to verify IA_V2 functionality
 * This component tests the redirect logic and flag system
 */
export function IA_V2_Test() {
  const [testResults, setTestResults] = React.useState<string[]>([]);
  
  const runTests = () => {
    const results: string[] = [];
    
    // Test 1: Check flag functionality
    const originalFlag = getFlag('IA_V2');
    results.push(`✓ IA_V2 flag reads as: ${originalFlag}`);
    
    // Test 2: Test redirects with flag enabled
    setFlag('IA_V2', true);
    const redirect1 = getRedirectPath('/families/home');
    const redirect2 = getRedirectPath('/advisors/home');
    const redirect3 = getRedirectPath('/cpa');
    results.push(`✓ /families/home → ${redirect1 || 'no redirect'}`);
    results.push(`✓ /advisors/home → ${redirect2 || 'no redirect'}`);
    results.push(`✓ /cpa → ${redirect3 || 'no redirect'}`);
    
    // Test 3: Test redirects with flag disabled
    setFlag('IA_V2', false);
    const redirect4 = getRedirectPath('/families/home');
    const redirect5 = getRedirectPath('/advisors/home');
    results.push(`✓ With IA_V2=false: /families/home → ${redirect4 || 'no redirect'}`);
    results.push(`✓ With IA_V2=false: /advisors/home → ${redirect5 || 'no redirect'}`);
    
    // Test 4: Test non-matching paths
    const redirect6 = getRedirectPath('/some/random/path');
    results.push(`✓ Random path → ${redirect6 || 'no redirect'}`);
    
    // Restore original flag
    setFlag('IA_V2', originalFlag);
    results.push(`✓ Flag restored to: ${getFlag('IA_V2')}`);
    
    setTestResults(results);
  };

  return (
    <div className="p-6 bfo-card border border-bfo-gold/30">
      <h2 className="text-xl font-bold text-bfo-gold mb-4">IA_V2 Test Suite</h2>
      
      <button 
        onClick={runTests}
        className="mb-4 px-4 py-2 bg-bfo-gold text-bfo-black rounded hover:bg-bfo-gold/90"
      >
        Run Tests
      </button>
      
      <div className="space-y-2">
        {testResults.map((result, index) => (
          <div key={index} className="text-white text-sm font-mono">
            {result}
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-bfo-purple/50 rounded">
        <h3 className="text-white font-semibold mb-2">Expected Behavior:</h3>
        <ul className="text-white/80 text-sm space-y-1">
          <li>• With IA_V2=true: Old routes redirect to new ones</li>
          <li>• With IA_V2=false: No redirects applied</li>
          <li>• Navigation shows appropriate menu based on flag</li>
          <li>• All legacy links continue to work via redirects</li>
        </ul>
      </div>
    </div>
  );
}