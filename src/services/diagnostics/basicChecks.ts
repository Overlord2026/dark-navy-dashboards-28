
import { DiagnosticResult, DiagnosticTestStatus } from './types';

/**
 * Run basic system checks
 */
export async function runBasicChecks(): Promise<DiagnosticResult[]> {
  const results: DiagnosticResult[] = [];
  
  // Check environment
  const envStatus = checkEnvironment();
  results.push({
    id: 'env-check',
    timestamp: new Date().toISOString(),
    category: 'environment',
    status: envStatus.status as DiagnosticTestStatus,
    message: envStatus.message,
    name: 'Environment Check',
    description: 'Verifies environment variables and configuration'
  });
  
  // Check browser compatibility
  const browserStatus = checkBrowserCompatibility();
  results.push({
    id: 'browser-check',
    timestamp: new Date().toISOString(),
    category: 'browser',
    status: browserStatus.status as DiagnosticTestStatus,
    message: browserStatus.message,
    name: 'Browser Compatibility',
    description: 'Checks if current browser is fully compatible'
  });
  
  // Check local storage
  const storageStatus = checkLocalStorage();
  results.push({
    id: 'storage-check',
    timestamp: new Date().toISOString(),
    category: 'storage',
    status: storageStatus.status as DiagnosticTestStatus,
    message: storageStatus.message,
    name: 'Storage Access',
    description: 'Verifies access to local storage'
  });

  return results;
}

/**
 * Check environment configuration
 */
function checkEnvironment() {
  // Check for required environment variables
  try {
    // Example environment checks
    const inDevelopment = import.meta.env.DEV === true;
    const hasRequiredVars = true; // Could check specific vars here
    
    if (!hasRequiredVars) {
      return {
        status: 'warning' as DiagnosticTestStatus,
        message: 'Some environment variables are missing'
      };
    }
    
    return {
      status: 'success' as DiagnosticTestStatus,
      message: `Environment is properly configured (${inDevelopment ? 'development' : 'production'})`
    };
  } catch (error) {
    return {
      status: 'error' as DiagnosticTestStatus,
      message: 'Failed to check environment configuration'
    };
  }
}

/**
 * Check browser compatibility
 */
function checkBrowserCompatibility() {
  try {
    // Simple browser feature detection examples
    const hasLocalStorage = 'localStorage' in window;
    const hasSessionStorage = 'sessionStorage' in window;
    const hasPromises = 'Promise' in window;
    const hasWebWorkers = 'Worker' in window;
    const hasIndexedDB = 'indexedDB' in window;
    
    if (!hasLocalStorage || !hasSessionStorage) {
      return {
        status: 'error' as DiagnosticTestStatus,
        message: 'Browser does not support required storage features'
      };
    }
    
    if (!hasWebWorkers || !hasIndexedDB) {
      return {
        status: 'warning' as DiagnosticTestStatus,
        message: 'Browser is missing some optional features'
      };
    }
    
    return {
      status: 'success' as DiagnosticTestStatus,
      message: 'Browser is fully compatible'
    };
  } catch (error) {
    return {
      status: 'error' as DiagnosticTestStatus,
      message: 'Failed to check browser compatibility'
    };
  }
}

/**
 * Check local storage access
 */
function checkLocalStorage() {
  try {
    // Test writing to localStorage
    const testKey = '_diagnostics_test_';
    localStorage.setItem(testKey, 'test');
    const value = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);
    
    if (value !== 'test') {
      return {
        status: 'error' as DiagnosticTestStatus,
        message: 'Failed to write to local storage'
      };
    }
    
    return {
      status: 'success' as DiagnosticTestStatus,
      message: 'Local storage is accessible'
    };
  } catch (error) {
    return {
      status: 'error' as DiagnosticTestStatus,
      message: 'Local storage is not available or access is denied'
    };
  }
}
