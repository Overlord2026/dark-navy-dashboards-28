export interface QATestResult {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'warning' | 'running' | 'pending';
  message: string;
  details?: string;
  duration?: number;
  timestamp: Date;
}

export interface QATestCategory {
  name: string;
  tests: QATestResult[];
  passed: number;
  failed: number;
  warnings: number;
  total: number;
}

export interface APIIntegrationStatus {
  plaid: 'connected' | 'error' | 'warning' | 'testing';
  stripe: 'connected' | 'error' | 'warning' | 'testing';
  resend: 'connected' | 'error' | 'warning' | 'testing';
  database: 'connected' | 'error' | 'warning' | 'testing';
}