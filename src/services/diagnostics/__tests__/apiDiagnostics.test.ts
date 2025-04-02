
import { testApiEndpoints } from '../apiDiagnostics';

// Mock dependencies
jest.mock('../../logging/loggingService', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  }
}));

jest.mock('../../financial-plans/ApiFinancialPlanService', () => {
  return {
    ApiFinancialPlanService: jest.fn().mockImplementation(() => {
      return {
        getPlans: jest.fn().mockImplementation(() => {
          throw new Error('API implementation not yet available');
        }),
        getPlanById: jest.fn().mockImplementation(() => {
          throw new Error('API implementation not yet available');
        })
      };
    })
  };
});

describe('API Diagnostics', () => {
  test('testApiEndpoints should return diagnostic results', async () => {
    const results = await testApiEndpoints();
    
    // Verify the structure of results
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
    
    // Verify each result has the required properties
    results.forEach(result => {
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('url');
      expect(result).toHaveProperty('method');
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('responseTime');
      expect(result).toHaveProperty('expectedDataStructure');
      
      // The status should be one of: success, warning, error
      expect(['success', 'warning', 'error']).toContain(result.status);
    });
  });
  
  test('should handle API implementation not yet available errors', async () => {
    const results = await testApiEndpoints();
    
    // At least one result should be a warning about API not available
    const apiNotAvailableWarnings = results.filter(
      result => result.status === 'warning' && 
      result.errorMessage?.includes('API implementation not yet available')
    );
    
    expect(apiNotAvailableWarnings.length).toBeGreaterThan(0);
  });
});
