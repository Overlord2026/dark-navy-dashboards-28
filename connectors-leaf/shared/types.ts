import { z } from 'zod';

// =============================================================================
// CANONICAL SCHEMA TYPES
// =============================================================================

// Base Entity Schema
export const BaseEntitySchema = z.object({
  id: z.string().uuid(),
  tenant_id: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  created_by: z.string().uuid().optional(),
  updated_by: z.string().uuid().optional(),
});

// Account Schema
export const AccountSchema = BaseEntitySchema.extend({
  external_id: z.string(),
  provider: z.enum(['bridgeft', 'byallaccounts', 'plaid', 'akoya', 'canoe', 'icapital']),
  account_type: z.enum(['checking', 'savings', 'investment', 'retirement', 'loan', 'credit']),
  account_name: z.string(),
  account_number: z.string().optional(),
  institution_name: z.string(),
  institution_id: z.string().optional(),
  balance: z.number().optional(),
  currency: z.string().default('USD'),
  is_active: z.boolean().default(true),
  metadata: z.record(z.any()).optional(),
});

// Transaction Schema
export const TransactionSchema = BaseEntitySchema.extend({
  account_id: z.string().uuid(),
  external_id: z.string(),
  amount: z.number(),
  currency: z.string().default('USD'),
  transaction_type: z.enum(['debit', 'credit', 'transfer', 'fee', 'dividend', 'interest']),
  transaction_date: z.string().datetime(),
  settlement_date: z.string().datetime().optional(),
  description: z.string(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  merchant_name: z.string().optional(),
  reference_number: z.string().optional(),
  is_pending: z.boolean().default(false),
  metadata: z.record(z.any()).optional(),
});

// Position Schema
export const PositionSchema = BaseEntitySchema.extend({
  account_id: z.string().uuid(),
  security_id: z.string().uuid().optional(),
  external_id: z.string(),
  symbol: z.string().optional(),
  cusip: z.string().optional(),
  isin: z.string().optional(),
  security_name: z.string(),
  security_type: z.enum(['stock', 'bond', 'mutual_fund', 'etf', 'option', 'future', 'commodity', 'cash', 'alternative']),
  quantity: z.number(),
  unit_price: z.number().optional(),
  market_value: z.number().optional(),
  cost_basis: z.number().optional(),
  currency: z.string().default('USD'),
  as_of_date: z.string().datetime(),
  metadata: z.record(z.any()).optional(),
});

// Connection Schema
export const ConnectionSchema = BaseEntitySchema.extend({
  user_id: z.string().uuid(),
  provider: z.enum(['bridgeft', 'byallaccounts', 'plaid', 'akoya', 'canoe', 'icapital']),
  external_connection_id: z.string(),
  status: z.enum(['active', 'inactive', 'error', 'reconnect_required']),
  last_sync_at: z.string().datetime().optional(),
  next_sync_at: z.string().datetime().optional(),
  sync_frequency: z.enum(['daily', 'weekly', 'monthly', 'manual']).default('daily'),
  error_count: z.number().default(0),
  last_error: z.string().optional(),
  access_token_encrypted: z.string().optional(),
  refresh_token_encrypted: z.string().optional(),
  expires_at: z.string().datetime().optional(),
  metadata: z.record(z.any()).optional(),
});

// Notarization Schema
export const NotarizationSchema = BaseEntitySchema.extend({
  document_id: z.string().uuid(),
  user_id: z.string().uuid(),
  notary_provider: z.enum(['docusign', 'notarycam']),
  notary_session_id: z.string(),
  status: z.enum(['pending', 'in_progress', 'completed', 'failed', 'cancelled']),
  state_jurisdiction: z.string(),
  notary_public_id: z.string().optional(),
  notary_commission_expires: z.string().datetime().optional(),
  notarization_date: z.string().datetime().optional(),
  video_recording_url: z.string().optional(),
  certificate_url: z.string().optional(),
  audit_trail: z.array(z.record(z.any())).optional(),
  metadata: z.record(z.any()).optional(),
});

// Report Schema
export const ReportSchema = BaseEntitySchema.extend({
  report_type: z.enum(['account_summary', 'transaction_history', 'position_summary', 'performance', 'tax_summary', 'notarization_certificate']),
  user_id: z.string().uuid(),
  parameters: z.record(z.any()),
  status: z.enum(['queued', 'generating', 'completed', 'failed']),
  file_url: z.string().optional(),
  file_format: z.enum(['pdf', 'csv', 'json', 'xlsx']),
  generated_at: z.string().datetime().optional(),
  expires_at: z.string().datetime().optional(),
  download_count: z.number().default(0),
  error_message: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

// Audit Log Schema
export const AuditLogSchema = BaseEntitySchema.extend({
  event_type: z.string(),
  entity_type: z.string(),
  entity_id: z.string().uuid(),
  user_id: z.string().uuid().optional(),
  ip_address: z.string().optional(),
  user_agent: z.string().optional(),
  changes: z.record(z.any()).optional(),
  previous_values: z.record(z.any()).optional(),
  metadata: z.record(z.any()).optional(),
});

// Exception Schema
export const ExceptionSchema = BaseEntitySchema.extend({
  exception_type: z.enum(['sync_error', 'validation_error', 'api_error', 'timeout', 'authentication_error']),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  source: z.string(),
  entity_type: z.string().optional(),
  entity_id: z.string().uuid().optional(),
  error_message: z.string(),
  error_code: z.string().optional(),
  stack_trace: z.string().optional(),
  resolution_status: z.enum(['open', 'investigating', 'resolved', 'wont_fix']).default('open'),
  assigned_to: z.string().uuid().optional(),
  resolved_at: z.string().datetime().optional(),
  resolution_notes: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

// =============================================================================
// EVENT PAYLOAD TYPES
// =============================================================================

// Base Event Schema
export const BaseEventSchema = z.object({
  event_id: z.string().uuid(),
  event_type: z.string(),
  timestamp: z.string().datetime(),
  source: z.string(),
  tenant_id: z.string().uuid(),
  user_id: z.string().uuid().optional(),
  correlation_id: z.string().uuid().optional(),
  metadata: z.record(z.any()).optional(),
});

// Connection Events
export const ConnectionCreatedEventSchema = BaseEventSchema.extend({
  event_type: z.literal('connection.created'),
  payload: ConnectionSchema,
});

export const ConnectionUpdatedEventSchema = BaseEventSchema.extend({
  event_type: z.literal('connection.updated'),
  payload: z.object({
    connection: ConnectionSchema,
    changes: z.record(z.any()),
  }),
});

export const ConnectionFailedEventSchema = BaseEventSchema.extend({
  event_type: z.literal('connection.failed'),
  payload: z.object({
    connection_id: z.string().uuid(),
    error_message: z.string(),
    error_code: z.string().optional(),
  }),
});

// Sync Events
export const SyncStartedEventSchema = BaseEventSchema.extend({
  event_type: z.literal('sync.started'),
  payload: z.object({
    connection_id: z.string().uuid(),
    sync_type: z.enum(['full', 'incremental']),
  }),
});

export const SyncCompletedEventSchema = BaseEventSchema.extend({
  event_type: z.literal('sync.completed'),
  payload: z.object({
    connection_id: z.string().uuid(),
    sync_type: z.enum(['full', 'incremental']),
    accounts_synced: z.number(),
    transactions_synced: z.number(),
    positions_synced: z.number(),
    duration_ms: z.number(),
  }),
});

export const SyncFailedEventSchema = BaseEventSchema.extend({
  event_type: z.literal('sync.failed'),
  payload: z.object({
    connection_id: z.string().uuid(),
    error_message: z.string(),
    error_code: z.string().optional(),
    partial_success: z.boolean().default(false),
  }),
});

// Notarization Events
export const NotarizationRequestedEventSchema = BaseEventSchema.extend({
  event_type: z.literal('notarization.requested'),
  payload: NotarizationSchema,
});

export const NotarizationCompletedEventSchema = BaseEventSchema.extend({
  event_type: z.literal('notarization.completed'),
  payload: z.object({
    notarization: NotarizationSchema,
    certificate_url: z.string(),
  }),
});

// Report Events
export const ReportRequestedEventSchema = BaseEventSchema.extend({
  event_type: z.literal('report.requested'),
  payload: ReportSchema,
});

export const ReportGeneratedEventSchema = BaseEventSchema.extend({
  event_type: z.literal('report.generated'),
  payload: z.object({
    report: ReportSchema,
    file_url: z.string(),
    file_size_bytes: z.number(),
  }),
});

// =============================================================================
// API REQUEST/RESPONSE TYPES
// =============================================================================

// Connection API
export const CreateConnectionRequestSchema = z.object({
  provider: z.enum(['bridgeft', 'byallaccounts', 'plaid', 'akoya', 'canoe', 'icapital']),
  credentials: z.record(z.string()),
  sync_frequency: z.enum(['daily', 'weekly', 'monthly', 'manual']).default('daily'),
  metadata: z.record(z.any()).optional(),
});

export const UpdateConnectionRequestSchema = z.object({
  sync_frequency: z.enum(['daily', 'weekly', 'monthly', 'manual']).optional(),
  metadata: z.record(z.any()).optional(),
});

// Report API
export const CreateReportRequestSchema = z.object({
  report_type: z.enum(['account_summary', 'transaction_history', 'position_summary', 'performance', 'tax_summary', 'notarization_certificate']),
  parameters: z.record(z.any()),
  file_format: z.enum(['pdf', 'csv', 'json', 'xlsx']).default('pdf'),
});

// Notarization API
export const CreateNotarizationRequestSchema = z.object({
  document_id: z.string().uuid(),
  notary_provider: z.enum(['docusign', 'notarycam']),
  state_jurisdiction: z.string(),
  metadata: z.record(z.any()).optional(),
});

// =============================================================================
// TYPE EXPORTS
// =============================================================================

// Inferred Types
export type Account = z.infer<typeof AccountSchema>;
export type Transaction = z.infer<typeof TransactionSchema>;
export type Position = z.infer<typeof PositionSchema>;
export type Connection = z.infer<typeof ConnectionSchema>;
export type Notarization = z.infer<typeof NotarizationSchema>;
export type Report = z.infer<typeof ReportSchema>;
export type AuditLog = z.infer<typeof AuditLogSchema>;
export type Exception = z.infer<typeof ExceptionSchema>;

// Event Types
export type BaseEvent = z.infer<typeof BaseEventSchema>;
export type ConnectionCreatedEvent = z.infer<typeof ConnectionCreatedEventSchema>;
export type ConnectionUpdatedEvent = z.infer<typeof ConnectionUpdatedEventSchema>;
export type ConnectionFailedEvent = z.infer<typeof ConnectionFailedEventSchema>;
export type SyncStartedEvent = z.infer<typeof SyncStartedEventSchema>;
export type SyncCompletedEvent = z.infer<typeof SyncCompletedEventSchema>;
export type SyncFailedEvent = z.infer<typeof SyncFailedEventSchema>;
export type NotarizationRequestedEvent = z.infer<typeof NotarizationRequestedEventSchema>;
export type NotarizationCompletedEvent = z.infer<typeof NotarizationCompletedEventSchema>;
export type ReportRequestedEvent = z.infer<typeof ReportRequestedEventSchema>;
export type ReportGeneratedEvent = z.infer<typeof ReportGeneratedEventSchema>;

// API Types
export type CreateConnectionRequest = z.infer<typeof CreateConnectionRequestSchema>;
export type UpdateConnectionRequest = z.infer<typeof UpdateConnectionRequestSchema>;
export type CreateReportRequest = z.infer<typeof CreateReportRequestSchema>;
export type CreateNotarizationRequest = z.infer<typeof CreateNotarizationRequestSchema>;

// Union Types
export type AnyEvent = 
  | ConnectionCreatedEvent
  | ConnectionUpdatedEvent
  | ConnectionFailedEvent
  | SyncStartedEvent
  | SyncCompletedEvent
  | SyncFailedEvent
  | NotarizationRequestedEvent
  | NotarizationCompletedEvent
  | ReportRequestedEvent
  | ReportGeneratedEvent;

export type Provider = 'bridgeft' | 'byallaccounts' | 'plaid' | 'akoya' | 'canoe' | 'icapital';
export type ConnectionStatus = 'active' | 'inactive' | 'error' | 'reconnect_required';
export type SyncFrequency = 'daily' | 'weekly' | 'monthly' | 'manual';
export type NotaryProvider = 'docusign' | 'notarycam';
export type ReportType = 'account_summary' | 'transaction_history' | 'position_summary' | 'performance' | 'tax_summary' | 'notarization_certificate';
export type FileFormat = 'pdf' | 'csv' | 'json' | 'xlsx';