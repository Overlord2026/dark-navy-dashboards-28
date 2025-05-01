
/**
 * Types for API diagnostics and testing
 */

export interface ApiIntegrationTestResult {
  id: string;
  service: string;
  endpoint: string;
  responseTime: number;
  status: 'success' | 'warning' | 'error';
  message: string;
  authStatus: 'valid' | 'invalid' | 'expired';
}

export interface ApiEndpointPerformance {
  endpoint: string;
  averageResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  errorRate: number;
  callVolume: number;
  lastChecked: string;
}

export interface ApiServiceHealth {
  service: string;
  status: 'operational' | 'degraded' | 'outage';
  lastIncident?: {
    time: string;
    message: string;
  };
  uptime: number;
  responseTime: number;
}

export interface ApiSecurityVulnerability {
  id: string;
  endpoint: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  description: string;
  remediation: string;
  discoveredAt: string;
  status: 'open' | 'in_progress' | 'resolved' | 'accepted';
}

export interface DiagnosticResult {
  id: string;
  timestamp: string;
  category: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: any;
}
