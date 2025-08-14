// Generated TypeScript client for Connector & Evidence Service API
// Generated on: <%= new Date().toISOString() %>

export interface ApiConfig {
  baseUrl: string;
  apiKey?: string;
  timeout?: number;
}

export interface SyncResult {
  provider: string;
  accounts_synced: number;
  transactions_synced: number;
  positions_synced: number;
  duration_ms: number;
}

export interface CreateNotarizationRequest {
  document_id: string;
  user_id: string;
  state_jurisdiction: string;
  preferred_provider?: 'docusign' | 'notarycam';
}

export interface NotarizationSession {
  notarization_id: string;
  session_url: string;
  provider: 'docusign' | 'notarycam';
}

export interface CreateReportRequest {
  report_type: 'account_summary' | 'transaction_history' | 'position_summary' | 'performance' | 'tax_summary' | 'notarization_certificate';
  parameters?: Record<string, any>;
  file_format?: 'pdf' | 'csv' | 'json' | 'xlsx';
}

export interface Report {
  id: string;
  report_type: string;
  status: 'queued' | 'generating' | 'completed' | 'failed';
  file_url?: string;
  created_at: string;
}

export interface Exception {
  id: string;
  entity_id: string;
  account_id?: string;
  exception_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'acknowledged' | 'resolved';
  description: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface BillingSummary {
  entity_id: string;
  period: {
    from: string;
    to: string;
  };
  total_cost: number;
  total_accounts: number;
  total_alt_positions: number;
  total_notarizations: number;
  cost_breakdown: {
    base_cost: number;
    alts_cost: number;
    notary_cost: number;
    vendor_cost: number;
  };
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface ApiError {
  error: string;
  details?: Record<string, any>;
}

export class ConnectorApiClient {
  private config: ApiConfig;

  constructor(config: ApiConfig) {
    this.config = {
      timeout: 30000,
      ...config
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {})
    };

    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }

    const requestOptions: RequestInit = {
      ...options,
      headers,
      signal: AbortSignal.timeout(this.config.timeout!)
    };

    try {
      const response = await fetch(url, requestOptions);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(`API Error ${response.status}: ${errorData.error || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  // Data Ingestion
  async triggerCustodySync(data: {
    entity_id: string;
    connector_account_id: string;
    sync_mode?: 'delta' | 'full';
  }): Promise<SyncResult> {
    return this.request<SyncResult>('/ingest/custody-sync', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async triggerHeldawaySync(data: {
    entity_id: string;
    provider_account_id: string;
    sync_mode?: 'delta' | 'full';
  }): Promise<void> {
    return this.request<void>('/ingest/heldaway-sync', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async processAltsWebhook(data: {
    event_type: string;
    data: Record<string, any>;
    timestamp: string;
  }): Promise<void> {
    return this.request<void>('/ingest/alts-webhook', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Notarization
  async scheduleNotarization(data: CreateNotarizationRequest): Promise<NotarizationSession> {
    return this.request<NotarizationSession>('/notary/schedule', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Reports
  async renderReport(data: CreateReportRequest): Promise<Report> {
    return this.request<Report>('/reports/render', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async listReports(params?: {
    portfolio_id?: string;
    persona?: 'client' | 'advisor' | 'cpa' | 'admin';
    report_type?: string;
    from_date?: string;
    to_date?: string;
  }): Promise<{ reports: Report[] }> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, value);
      });
    }
    
    const query = searchParams.toString();
    return this.request<{ reports: Report[] }>(`/reports${query ? `?${query}` : ''}`);
  }

  // Exceptions
  async listExceptions(params?: {
    entity_id?: string;
    severity?: 'low' | 'medium' | 'high' | 'critical';
    status?: 'open' | 'acknowledged' | 'resolved';
    page?: number;
    limit?: number;
  }): Promise<{ data: Exception[]; pagination: Pagination }> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, value.toString());
      });
    }
    
    const query = searchParams.toString();
    return this.request<{ data: Exception[]; pagination: Pagination }>(`/exceptions${query ? `?${query}` : ''}`);
  }

  async resolveException(id: string, data: {
    resolved_by: string;
    resolution_notes: string;
    resolution_action?: string;
  }): Promise<void> {
    return this.request<void>(`/exceptions/${id}/resolve`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Billing
  async getBillingSummary(params: {
    entity_id: string;
    from: string;
    to?: string;
    granularity?: 'daily' | 'weekly' | 'monthly';
  }): Promise<BillingSummary> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) searchParams.append(key, value);
    });
    
    return this.request<BillingSummary>(`/billing/summary?${searchParams.toString()}`);
  }
}

// Persona-scoped clients
export class ClientApiClient extends ConnectorApiClient {
  constructor(config: ApiConfig) {
    super(config);
  }

  // Client-specific methods with restricted access
  async getMyReports(portfolioId?: string): Promise<{ reports: Report[] }> {
    return this.listReports({ 
      portfolio_id: portfolioId, 
      persona: 'client' 
    });
  }

  async getMyExceptions(): Promise<{ data: Exception[]; pagination: Pagination }> {
    return this.listExceptions({ 
      status: 'open',
      severity: 'medium' // Clients see medium+ severity only
    });
  }
}

export class AdvisorApiClient extends ConnectorApiClient {
  constructor(config: ApiConfig) {
    super(config);
  }

  // Advisor-specific methods
  async getClientReports(portfolioId: string): Promise<{ reports: Report[] }> {
    return this.listReports({ 
      portfolio_id: portfolioId, 
      persona: 'advisor' 
    });
  }

  async getClientExceptions(entityId: string): Promise<{ data: Exception[]; pagination: Pagination }> {
    return this.listExceptions({ 
      entity_id: entityId,
      status: 'open'
    });
  }

  async getClientBilling(entityId: string, from: string, to?: string): Promise<BillingSummary> {
    return this.getBillingSummary({
      entity_id: entityId,
      from,
      to
    });
  }
}

export class CpaApiClient extends ConnectorApiClient {
  constructor(config: ApiConfig) {
    super(config);
  }

  // CPA-specific methods with tax detail access
  async getTaxReports(portfolioId: string): Promise<{ reports: Report[] }> {
    return this.listReports({ 
      portfolio_id: portfolioId, 
      persona: 'cpa',
      report_type: 'tax_summary'
    });
  }

  async getComplianceExceptions(entityId: string): Promise<{ data: Exception[]; pagination: Pagination }> {
    return this.listExceptions({ 
      entity_id: entityId,
      severity: 'high' // CPAs see high+ severity
    });
  }
}

// Example usage documentation
export const examples = {
  // Basic client initialization
  basicUsage: `
    import { ConnectorApiClient } from './typescript-client';
    
    const client = new ConnectorApiClient({
      baseUrl: 'https://your-project-ref.supabase.co/functions/v1',
      apiKey: 'your-jwt-token'
    });
    
    // Trigger custody sync
    const syncResult = await client.triggerCustodySync({
      entity_id: 'uuid-here',
      connector_account_id: 'uuid-here',
      sync_mode: 'delta'
    });
  `,

  // Persona-specific usage
  personaUsage: `
    import { AdvisorApiClient } from './typescript-client';
    
    const advisorClient = new AdvisorApiClient({
      baseUrl: 'https://your-project-ref.supabase.co/functions/v1',
      apiKey: 'advisor-jwt-token'
    });
    
    // Get client reports (advisor persona)
    const reports = await advisorClient.getClientReports('portfolio-uuid');
    
    // Get client exceptions
    const exceptions = await advisorClient.getClientExceptions('entity-uuid');
  `,

  // Error handling
  errorHandling: `
    try {
      const result = await client.triggerCustodySync({
        entity_id: 'invalid-uuid',
        connector_account_id: 'another-uuid'
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error('API Error:', error.message);
        // Handle specific error cases
        if (error.message.includes('401')) {
          // Handle unauthorized
        } else if (error.message.includes('400')) {
          // Handle bad request
        }
      }
    }
  `
};

export default ConnectorApiClient;