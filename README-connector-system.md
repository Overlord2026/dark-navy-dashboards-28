# Connector Registry & Custody System

Complete financial data integration system with connectors, custody ingest, reports, exceptions, and billing.

## Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Connectors    │    │   Canonical      │    │    Reports      │
│   Registry      │───▶│   Data Store     │───▶│   & Analytics   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Sync Engine   │    │   Exceptions     │    │   Evidence      │
│   & Workers     │    │   & Monitoring   │    │   & Audit       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Database Schema

### Core Tables

- **connectors**: Registry of available data connectors (Schwab, Fidelity, etc.)
- **connector_accounts**: User connection instances to specific connectors
- **accounts**: Canonical account data normalized across vendors
- **positions**: Holdings data with market values and metadata
- **transactions**: Transaction history with full details
- **reports**: Generated reports with persona-based access control
- **exceptions**: Data quality issues and processing errors
- **billing_daily**: Usage tracking and cost calculation

## Edge Functions

### `/functions/ingest-custody-sync`
Orchestrates data synchronization from custody providers.

**Request:**
```json
{
  "connector_account_id": "uuid",
  "sync_type": "full|incremental",
  "force": false
}
```

**Response:**
```json
{
  "success": true,
  "connector_account_id": "uuid",
  "vendor": "Charles Schwab",
  "accounts_created": 3,
  "positions_created": 15,
  "transactions_created": 8,
  "evidence_id": "uuid",
  "next_sync_at": "2024-01-16T10:00:00Z"
}
```

### `/functions/reports-render`
Generates reports in various formats with evidence tracking.

**Request:**
```json
{
  "report_id": "uuid",
  "format": "pdf|xlsx|csv",
  "delivery_method": "download|email"
}
```

**Response:**
```json
{
  "success": true,
  "report_id": "uuid",
  "file_url": "https://reports.example.com/report_uuid.pdf",
  "format": "pdf",
  "evidence_id": "uuid",
  "expires_at": "2024-02-15T10:00:00Z"
}
```

## Workers

### `reconcile-daily.ts`
Daily data reconciliation worker that:
- Validates data integrity across all connector accounts
- Identifies discrepancies and data quality issues
- Creates exceptions for investigation
- Generates reconciliation reports

### `billing-daily.ts`
Daily billing calculation worker that:
- Tracks usage metrics per entity
- Calculates vendor costs and fees
- Generates billing records
- Emits usage events for monitoring

## Demo Data

The system includes seed data for:
- 5 major custody providers (Schwab, Fidelity, Pershing, Interactive Brokers, TD Ameritrade)
- Sample billing records for the last 3 days
- Demo positions and transactions for testing

## Security & Access Control

### Row Level Security (RLS)
- **User Data Isolation**: Users can only access their own connector accounts, positions, and transactions
- **Persona-Based Reports**: Reports access controlled by persona scope (client, advisor, family_office, institution)
- **Admin-Only Access**: Connectors registry and billing data restricted to admins
- **Exception Visibility**: Users see exceptions for their data, admins see all

### Evidence Tracking
All major operations emit evidence receipts:
- Data synchronization events
- Report generation activities
- Exception creation and resolution
- Billing calculations

## API Endpoints & Demo cURLs

### 1. Trigger Custody Sync
```bash
curl -X POST https://xcmqjkvyvuhoslbzmlgi.supabase.co/functions/v1/ingest-custody-sync \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "connector_account_id": "existing-uuid-from-db",
    "sync_type": "full",
    "force": true
  }'
```

### 2. Generate Report
```bash
curl -X POST https://xcmqjkvyvuhoslbzmlgi.supabase.co/functions/v1/reports-render \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "report_id": "existing-report-uuid",
    "format": "pdf",
    "delivery_method": "download"
  }'
```

### 3. Query Connectors
```bash
curl -X GET "https://xcmqjkvyvuhoslbzmlgi.supabase.co/rest/v1/connectors?select=*" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_USER_JWT"
```

### 4. View Exceptions
```bash
curl -X GET "https://xcmqjkvyvuhoslbzmlgi.supabase.co/rest/v1/exceptions?select=*&status=eq.open&order=severity.desc,created_at.desc" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_USER_JWT"
```

### 5. Check Billing Data (Admin Only)
```bash
curl -X GET "https://xcmqjkvyvuhoslbzmlgi.supabase.co/rest/v1/billing_daily?select=*&order=billing_date.desc" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT"
```

## Deployment Steps

### 1. Database Setup
The migration creates all necessary tables and policies. Run:
```sql
-- Migration has been applied automatically
-- Verify with: SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```

### 2. Environment Variables
Set these in your deployment environment:
```bash
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Edge Functions
Functions are deployed automatically with the codebase:
- `ingest-custody-sync`: Handles data synchronization
- `reports-render`: Generates reports
- `emit-receipt`: Evidence tracking (prerequisite)

### 4. Worker Deployment
Deploy workers to your preferred platform:
```bash
# Using Node.js cron
node connectors-leaf/workers/reconcile-daily.ts
node connectors-leaf/workers/billing-daily.ts

# Or using system cron
0 2 * * * /usr/bin/node /path/to/reconcile-daily.ts
0 3 * * * /usr/bin/node /path/to/billing-daily.ts
```

### 5. Monitoring & Alerts
Set up monitoring for:
- Sync failures (check `connector_accounts.sync_status`)
- Data quality exceptions (monitor `exceptions` table)
- Billing anomalies (track `billing_daily` trends)

## Testing the System

### 1. Create Test Connector Account
```sql
INSERT INTO connector_accounts (
  connector_id, user_id, account_name, external_account_id, sync_status
) VALUES (
  (SELECT id FROM connectors WHERE vendor_name = 'Charles Schwab' LIMIT 1),
  auth.uid(),
  'Test Schwab Account',
  'TEST123456',
  'pending'
);
```

### 2. Trigger Test Sync
Use the sync endpoint with the created connector account ID.

### 3. Generate Test Report
```sql
INSERT INTO reports (
  user_id, persona_id, persona_scope, report_type, report_name, parameters
) VALUES (
  auth.uid(),
  auth.uid(),
  'client',
  'holdings',
  'Test Holdings Report',
  '{}'::jsonb
);
```

Then use the reports-render endpoint with the created report ID.

## Monitoring Queries

### Check Sync Health
```sql
SELECT 
  ca.account_name,
  c.vendor_name,
  ca.sync_status,
  ca.last_sync_at,
  ca.error_count
FROM connector_accounts ca
JOIN connectors c ON ca.connector_id = c.id
WHERE ca.sync_status != 'active' OR ca.last_sync_at < NOW() - INTERVAL '2 days';
```

### Exception Summary
```sql
SELECT 
  exception_type,
  severity,
  COUNT(*) as count,
  COUNT(*) FILTER (WHERE status = 'open') as open_count
FROM exceptions 
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY exception_type, severity
ORDER BY severity DESC, count DESC;
```

### Billing Trends
```sql
SELECT 
  billing_date,
  SUM(active_synced_accounts) as total_accounts,
  SUM(total_estimated_cost) as total_cost,
  AVG(total_estimated_cost) as avg_cost_per_entity
FROM billing_daily 
WHERE billing_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY billing_date
ORDER BY billing_date DESC;
```

This system provides a complete foundation for financial data integration with proper monitoring, billing, and evidence tracking.