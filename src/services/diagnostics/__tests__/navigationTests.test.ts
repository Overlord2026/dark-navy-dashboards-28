
import { testNavigation } from '../navigationTests';

// Mock any dependencies
jest.mock('../tabDiagnostics', () => ({
  diagnoseDashboardTab: jest.fn().mockResolvedValue({
    route: '/dashboard',
    status: 'success',
    message: 'Dashboard loaded successfully'
  }),
  diagnoseCashManagementTab: jest.fn().mockResolvedValue({
    route: '/cash-management',
    status: 'success',
    message: 'Cash Management loaded successfully'
  }),
  runAllTabDiagnostics: jest.fn().mockResolvedValue({
    dashboard: {
      route: '/dashboard',
      status: 'success',
      message: 'Dashboard loaded successfully'
    }
  })
}));

describe('Navigation Tests', () => {
  it('should return an array of test results', async () => {
    const results = await testNavigation();
    
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
    
    // Verify each result has the required properties
    results.forEach(result => {
      expect(result).toHaveProperty('route');
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('message');
      
      // Verify status is one of the allowed values
      expect(['success', 'warning', 'error']).toContain(result.status);
    });
  });
});
