# Connector & Evidence Service

A production-ready financial data connectors and evidence service for wealth management platforms.

## Architecture

- **Runtime**: Supabase (Postgres + RLS) + Supabase Edge Functions (Deno)
- **Languages**: TypeScript (Edge), SQL (Postgres), Node.js (PDF generation)
- **Security**: Least-privilege access, audit trails, optional TEE for PII processing
- **Pattern**: Evented ingestion → canonical schema → reports API → persona-aware access

## Repository Structure

```
/db        -> SQL migrations (canonical schema + RLS + policies)
/functions -> Supabase Edge Functions (Deno)
/workers   -> Scheduled jobs (reconcile, billing, sync)
/api       -> OpenAPI specs + generated TS client
/shared    -> TS types (zod) for canonical schema + event payloads
/reporter  -> Report Publisher (Node/Playwright or @react-pdf)
```

## Quick Start

1. **Environment Setup**
   ```bash
   cp .env.sample .env
   # Fill in your secrets (see .env.sample for required variables)
   ```

2. **Database Setup**
   ```bash
   supabase db reset
   supabase db push
   ```

3. **Deploy Functions**
   ```bash
   supabase functions deploy --no-verify-jwt
   ```

4. **Start Local Development**
   ```bash
   supabase start
   npm run dev
   ```

## Core Services

### 1. Data Connectors
- **BridgeFT/ByAllAccounts**: Portfolio aggregation
- **Plaid/Akoya**: Account linking and transactions
- **Canoe/iCapital**: Alternative investments

### 2. Notarization Orchestrator
- **DocuSign Notary**: Digital notarization
- **NotaryCam**: Video notarization
- State-aware policy routing

### 3. Report Publisher
- PDF generation with audit trails
- Multi-format export (PDF, CSV, JSON)
- Template-based reporting

### 4. Exception Management
- Ingestion error handling
- Reconciliation jobs
- Alert system

### 5. Billing & Usage
- Per-account ASA counting
- Usage analytics
- Billing event generation

## Environment Variables

See `.env.sample` for complete list. Key variables:

```env
# Core
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Connectors
BRIDGEFT_API_KEY=bridge_ft_key
PLAID_CLIENT_ID=plaid_client_id
PLAID_SECRET=plaid_secret
CANOE_API_KEY=canoe_key

# Notarization
DOCUSIGN_API_KEY=docusign_key
NOTARYCAM_API_KEY=notarycam_key

# Infrastructure
WEBHOOK_SECRET=webhook_signing_secret
ENCRYPTION_KEY=data_encryption_key
```

## Deployment

### Local Development
```bash
supabase start
npm run dev
```

### Production Deployment
```bash
supabase db push --linked
supabase functions deploy
npm run build
npm run deploy
```

## API Documentation

OpenAPI specs available at:
- `/api/openapi.yaml` - Full API specification
- `/api/client.ts` - Generated TypeScript client

## Security

- **RLS Policies**: Tenant isolation and role-based access
- **Audit Trails**: All data access and modifications logged
- **Encryption**: PII encrypted at rest and in transit
- **TEE Support**: Optional confidential compute for sensitive operations

## Testing

```bash
npm run test
npm run test:integration
npm run test:security
```

## Monitoring

- Function logs: Supabase Dashboard → Functions
- Database logs: Supabase Dashboard → Logs
- Metrics: `/metrics` endpoint (Prometheus format)

## Support

- Documentation: `/docs`
- Issues: GitHub Issues
- Security: security@yourcompany.com