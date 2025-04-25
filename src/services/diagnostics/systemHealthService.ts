
import { testAccess } from './accessTests';
import { testApiEndpoints } from './apiDiagnostics';
import { testTabAccess } from './tabDiagnostics';
import { DiagnosticTestStatus } from './types';

export interface SystemHealthSummary {
  overall: DiagnosticTestStatus;
  timestamp: string;
  services: {
    name: string;
    status: DiagnosticTestStatus;
    message: string;
    details?: any;
  }[];
}

export async function runSystemHealthCheck(): Promise<SystemHealthSummary> {
  try {
    const [accessResults, apiResults, tabResults] = await Promise.all([
      testAccess(),
      testApiEndpoints(),
      testTabAccess()
    ]);

    const services = [
      ...accessResults.map(r => ({
        name: 'Access Control',
        status: r.status,
        message: r.message || '',
      })),
      ...apiResults.map(r => ({
        name: r.name,
        status: r.status,
        message: r.message || '',
        details: r
      })),
      ...tabResults.map(r => ({
        name: r.name,
        status: r.status,
        message: r.message || '',
      }))
    ];

    const hasErrors = services.some(s => s.status === 'error');
    const hasWarnings = services.some(s => s.status === 'warning');
    
    return {
      overall: hasErrors ? 'error' : hasWarnings ? 'warning' : 'success',
      timestamp: new Date().toISOString(),
      services
    };
  } catch (error) {
    console.error('System health check failed:', error);
    return {
      overall: 'error',
      timestamp: new Date().toISOString(),
      services: [{
        name: 'System Check',
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      }]
    };
  }
}
