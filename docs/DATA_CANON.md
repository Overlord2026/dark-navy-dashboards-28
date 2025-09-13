# Data Canon Documentation

## Supabase Database Access Patterns

### Core Tables Referenced in Code

#### User & Profile Management
- **profiles** - Core user profile data with RLS by auth.uid()
- **user_events** - Analytics and tracking events
- **user_onboarding** - Onboarding flow state
- **user_tenants** - Multi-tenancy relationships
- **personas** - User persona switching
- **persona_sessions** - Active persona state

#### Financial & Investment Data
- **portfolio_positions** - Investment positions with user_id RLS
- **portfolio_targets** - Investment allocation targets
- **rebalancing_events** - Portfolio rebalancing history
- **fund_returns_unsmoothed** - Private market performance data
- **fund_returns_raw** - Raw performance data before processing
- **risk_metrics** - Risk analysis results
- **rdi_scores** - Risk-Drawdown Index calculations
- **rac_scores** - Risk-Adjusted Capital scores
- **pmqi_receipts** - Private Market Quality Index receipts

#### Accounting & Tax
- **ar_invoices** - Accounts receivable
- **ap_bills** - Accounts payable
- **tax_brackets** - Tax rate configurations
- **tax_deductions** - Tax deduction rules
- **tax_rules** - General tax compliance rules
- **accounting_clients** - Client management
- **accounting_entities** - Business entities
- **accounting_engagements** - Service engagements
- **accounting_tasks** - Work tasks
- **accounting_time_entries** - Time tracking
- **accounting_documents** - Document management
- **accounting_receipts** - Receipt tracking
- **accounting_invoices** - Invoice management
- **accounting_payments** - Payment processing

#### Professional Services
- **accountant_ce_records** - Continuing education tracking
- **accountant_ce_providers** - CE provider directory
- **accountant_ce_requirements** - State CE requirements
- **accountant_license_status** - License tracking
- **attorney_documents** - Legal document management
- **attorney_onboarding** - Attorney onboarding flow
- **cpa_staff** - CPA team management

#### Compliance & Receipts
- **receipts** - Main receipt table with RLS policies
- **anchors** - Blockchain/CT-Log anchoring
- **aies_receipts** - AIES compliance receipts
- **domain_events** - Event sourcing
- **evidence_packages** - Evidence collection
- **audit_logs** - System audit trail
- **admin_audit_logs** - Administrative actions

#### Leads & CRM
- **leads** - Lead management with RLS
- **lead_routing_decisions** - Lead routing logic
- **lead_routing_rules** - Lead routing configuration
- **vip_invites** - VIP invitation system
- **prospect_invitations** - Prospect onboarding

#### Analytics & Tracking
- **analytics_events** - Event tracking
- **analytics_scorecard_events** - Scorecard interactions
- **strategy_comparisons** - Investment strategy comparisons
- **strategy_engagement_tracking** - Strategy interaction tracking
- **overview_analytics** - Overview page analytics
- **meeting_notes** - Meeting documentation
- **insurance_submissions** - Insurance application tracking

### Authentication Flows Referenced

#### Core Auth Patterns
```typescript
// Session management
supabase.auth.getSession()
supabase.auth.getUser()

// OAuth flows
supabase.auth.signInWithOAuth({ provider: 'google' })

// Email/password flows  
supabase.auth.signUp({ email, password })
supabase.auth.signIn({ email, password })
supabase.auth.signOut()

// Magic links
supabase.auth.signInWithOtp({ email })
```

#### Usage Locations
- **src/App.tsx** - Main session initialization and OAuth flows
- **src/components/auth/AuthPage.tsx** - Complete auth interface
- **src/components/auth/DynamicLandingController.tsx** - Landing page auth
- **src/lib/receiptsEmitter.ts** - Auth context for receipts

### RPC (Remote Procedure Call) Functions

#### Core RPCs
- **ensure_user_tenant()** - Tenant initialization
- **calculate_lead_score(p_lead_id)** - Lead scoring algorithm
- **calculate_loan_scenario()** - Loan calculation engine
- **calculate_project_analytics(p_project_id)** - Project metrics
- **run_database_review_tests()** - Database diagnostics
- **test_transfer_validation()** - Transfer validation
- **test_hsa_compliance()** - HSA compliance checks
- **test_audit_logging()** - Audit system tests

#### Compliance & Analytics RPCs
- **consent_accept()** - HIPAA consent processing
- **log_admin_action()** - Administrative action logging
- **log_attorney_document_access()** - Document access logging
- **log_recording_access()** - Recording access tracking
- **log_vault_activity()** - Vault activity logging

#### Specialized Functions
- **replay_verify(receipt_id)** - Receipt verification
- **replay_verify_voice(receipt_id)** - Voice receipt verification
- **replay_verify_401k(receipt_id)** - 401k receipt verification
- **replay_verify_trading(receipt_id)** - Trading receipt verification
- **get_health_receipts()** - Health data receipts
- **count_clients()**, **count_advisors()** - KPI counters

### Data Helper Functions & Canonical Processing

#### Receipt System (`src/features/receipts/record.ts`)
```typescript
// Simple localStorage-based receipt recording for demos
recordReceipt(receipt: any) - Records receipt to localStorage
listReceipts() - Retrieves all receipts
getReceiptsByType(type: string) - Filters by receipt type
clearReceipts() - Clears receipt storage
```

#### Canonical Hashing (`src/lib/canonical.ts`)
```typescript
// Deterministic canonicalization and hashing
canonicalize(obj, arraySortKeys?) - Normalizes object structure
sha256Hex(input: string) - Browser-safe SHA-256
inputsHash(obj) - Primary hash function for inputs
hash(obj) - Legacy hash wrapper
inputs_hash(obj) - Prefixed hash (sha256:...)
```

#### Receipt Emitter (`src/lib/receiptsEmitter.ts`)
```typescript
// Supabase-backed receipt emission system
initReceiptsEmitterAuto(supabase) - Auto-configured emitter
emitPre(input) - Pre-action receipts
emitPost(input) - Post-action receipts  
recordAnchorLocalMock(receipt_id) - Mock anchoring
hashActionRequest(action) - Action hash generation
```

#### Migrate Helper (`src/features/migrate/receipts.ts`)
```typescript
// Migration receipt logging
logUpload(adapterKey, fileName) - Upload receipts
logDryRun(adapterKey, rows, ok, errs) - Dry run receipts
logCommit(adapterKey, count) - Commit receipts
```

### RLS (Row Level Security) Patterns

#### Standard User Access Patterns
```sql
-- User owns data pattern
auth.uid() = user_id

-- Tenant-based access  
tenant_id = get_current_user_tenant_id()

-- Admin override pattern
auth.uid() = user_id OR has_role(auth.uid(), 'admin')

-- Service role bypass
auth.role() = 'service_role'
```

#### Complex Relationship Patterns
```sql
-- Multi-level relationship access (accounting system)
entity_id IN (
  SELECT accounting_entities.id FROM accounting_entities 
  WHERE client_id IN (
    SELECT id FROM accounting_clients 
    WHERE user_id = auth.uid()
  )
)

-- Assignment-based access
assigned_to = auth.uid() OR 
engagement_id IN (SELECT id FROM engagements WHERE owner = auth.uid())
```

#### Notable RLS Comments Found
- Tables use `auth.uid()` for user-scoped access
- Service role has bypass access with `auth.role() = 'service_role'`
- Multi-tenant isolation via tenant_id columns
- Complex join patterns for hierarchical access control
- Admin roles get elevated permissions via role checks

### Tool Data Reading Patterns

#### Calculator Tools
- **RetirementRoadmapTool** - Reads from localStorage cache, writes receipts
- **TaxHubDIYTool** - Uses tax_brackets, tax_deductions tables
- **WealthVaultTool** - Integrates with document storage and receipts
- **LoanScenarioCalculator** - Uses calculate_loan_scenario RPC

#### Analytics Tools  
- **LeadAnalyticsDashboard** - Queries leads table with filtering
- **PersonaAnalyticsDashboard** - Reads persona session data
- **NILAnalyticsDashboard** - School signup and engagement metrics
- **ConversionOptimizer** - Funnel analysis from analytics events

#### Professional Tools
- **ComplianceCECenter** - CE records, requirements, providers tables
- **AttorneyDocumentManager** - Attorney documents with access logging
- **ClientEngagementCenter** - Client relationship and upsell tracking

### Idempotent Data Operations

#### Hash-Based Deduplication
- All receipts include `inputs_hash` for deduplication
- Canonical processing ensures consistent hashing
- Merkle tree construction for receipt batching
- Deterministic ID generation from content hashes

#### Safe Upsert Patterns
```typescript
// Conflict-safe operations
.upsert(data, { onConflict: 'user_id,period_date' })
.insert(data).onConflict('user_id').merge()
```

#### Cache Invalidation
- localStorage receipt cache with versioning
- Persona session state with active flag management
- Time-based cache expiration patterns

### Edge Function Integration

#### Available Edge Functions
- **aies-receipts** - AIES compliance receipt processing
- **anchor** - Blockchain anchoring service
- **compute-unsmoothed** - Performance data processing  
- **compute-rdi** - Risk-Drawdown Index calculation
- **compute-rac** - Risk-Adjusted Capital scoring
- **emit-receipt** - Receipt emission service

#### Data Flow Patterns
- Edge functions use service role for direct DB access
- CORS enabled for web client integration
- Input validation and hash verification
- Result caching and deduplication