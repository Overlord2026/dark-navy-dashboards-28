
import { runDiagnostics } from '../index';
import { testNavigation } from '../navigationTests';
import { testPermissions } from '../permissionTests';
import { testApiIntegrations } from '../apiIntegrationTests';
import { testFormValidation } from '../formValidationTests';
import { runPerformanceTests } from '../performanceTests';
import { runSecurityTests } from '../securityTests';
import { DiagnosticTestStatus } from '../types';

// Mock the service functions to prevent actual API calls during tests
jest.mock('../navigationTests');
jest.mock('../permissionTests');
jest.mock('../apiIntegrationTests');
jest.mock('../formValidationTests');
jest.mock('../performanceTests');
jest.mock('../securityTests');
jest.mock('../../logging/loggingService', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  }
}));
jest.mock('../../auditLog/auditLogService', () => ({
  auditLog: {
    log: jest.fn()
  }
}));

describe('Diagnostics Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('runDiagnostics', () => {
    it('should run all diagnostic tests and return a combined report', async () => {
      // Mock successful test results
      (testNavigation as jest.Mock).mockResolvedValue([
        { route: '/test', status: 'success', message: 'Test passed' }
      ]);
      (testPermissions as jest.Mock).mockReturnValue([
        { name: 'test', status: 'success', message: 'Test passed' }
      ]);
      (testApiIntegrations as jest.Mock).mockReturnValue([
        { endpoint: '/api/test', status: 'success', message: 'Test passed' }
      ]);
      (testFormValidation as jest.Mock).mockReturnValue([
        { form: 'test', status: 'success', message: 'Test passed' }
      ]);
      (runPerformanceTests as jest.Mock).mockResolvedValue([
        { name: 'test', status: 'success', message: 'Test passed' }
      ]);
      (runSecurityTests as jest.Mock).mockResolvedValue([
        { name: 'test', status: 'success', message: 'Test passed' }
      ]);

      const result = await runDiagnostics();

      expect(result).toBeDefined();
      expect(result.overall).toBe('success');
      expect(testNavigation).toHaveBeenCalled();
      expect(testPermissions).toHaveBeenCalled();
      expect(testApiIntegrations).toHaveBeenCalled();
      expect(testFormValidation).toHaveBeenCalled();
      expect(runPerformanceTests).toHaveBeenCalled();
      expect(runSecurityTests).toHaveBeenCalled();
    });

    it('should report warning status when warnings are present', async () => {
      // Mock results with warnings
      (testNavigation as jest.Mock).mockResolvedValue([
        { route: '/test', status: 'success', message: 'Test passed' }
      ]);
      (testPermissions as jest.Mock).mockReturnValue([
        { name: 'test', status: 'warning', message: 'Warning detected' }
      ]);
      (testApiIntegrations as jest.Mock).mockReturnValue([
        { endpoint: '/api/test', status: 'success', message: 'Test passed' }
      ]);
      (testFormValidation as jest.Mock).mockReturnValue([
        { form: 'test', status: 'success', message: 'Test passed' }
      ]);
      (runPerformanceTests as jest.Mock).mockResolvedValue([
        { name: 'test', status: 'success', message: 'Test passed' }
      ]);
      (runSecurityTests as jest.Mock).mockResolvedValue([
        { name: 'test', status: 'success', message: 'Test passed' }
      ]);

      const result = await runDiagnostics();

      expect(result.overall).toBe('warning');
    });

    it('should report error status when errors are present', async () => {
      // Mock results with errors
      (testNavigation as jest.Mock).mockResolvedValue([
        { route: '/test', status: 'success', message: 'Test passed' }
      ]);
      (testPermissions as jest.Mock).mockReturnValue([
        { name: 'test', status: 'success', message: 'Test passed' }
      ]);
      (testApiIntegrations as jest.Mock).mockReturnValue([
        { endpoint: '/api/test', status: 'error', message: 'Error detected' }
      ]);
      (testFormValidation as jest.Mock).mockReturnValue([
        { form: 'test', status: 'success', message: 'Test passed' }
      ]);
      (runPerformanceTests as jest.Mock).mockResolvedValue([
        { name: 'test', status: 'success', message: 'Test passed' }
      ]);
      (runSecurityTests as jest.Mock).mockResolvedValue([
        { name: 'test', status: 'success', message: 'Test passed' }
      ]);

      const result = await runDiagnostics();

      expect(result.overall).toBe('error');
    });
  });
});
