# Claim Map - Code Path to Evidence Mapping

This document maps regulatory claims to their corresponding code paths and evidence generation points in the Family Office Marketplace system.

## Executive Suite Claims (Family I)

### Claim: "All executive plans require proper approvals before activation"
- **Code Path**: `src/services/executive/ExecutivePlanService.ts::activatePlan()`
- **Evidence Generation**: 
  - `supabase/functions/exec-plan-activate/index.ts` - validates approvals before activation
  - `public.generate_plan_rds()` - generates Plan-RDS with approval hashes
- **RDS Type**: `plan_rds`
- **Verification**: Plan cannot activate without CLO policy pass + required approvals

### Claim: "Approval records are cryptographically bound to artifact and policy hashes"
- **Code Path**: `src/services/executive/ExecutivePlanService.ts::submitForApproval()`
- **Evidence Generation**:
  - `public.approvals` table - stores artifact_hash and policy_hash
  - `public.calculate_artifact_hash()` - computes deterministic artifact hash
- **RDS Type**: `plan_rds`
- **Verification**: Approval records include both artifact and policy hashes

### Claim: "Policy evaluations are deterministic and auditable"
- **Code Path**: `src/services/executive/CLOPolicyService.ts::evaluatePolicy()`
- **Evidence Generation**:
  - Policy DAG execution with structural hash
  - `public.clo_policy_nodes` and `public.clo_policy_edges` - define policy structure
- **RDS Type**: `plan_rds`
- **Verification**: Policy evaluation results are included in Plan-RDS

## Marketing Engine Claims (Family M)

### Claim: "No advertisement can be published without proper approval"
- **Code Path**: `supabase/functions/ads-publish/index.ts`
- **Evidence Generation**: 
  - Validates approval status before publishing
  - Creates Ad-RDS with approval trail
- **RDS Type**: `ad_rds`
- **Verification**: Publish operation blocked if creative not approved

### Claim: "Financial promotions require two-person approval"
- **Code Path**: `src/services/marketing/CreativeApprovalService.ts`
- **Evidence Generation**:
  - `public.creative_approvals` - tracks multiple approvals
  - Validates 2-person rule for financial promotions
- **RDS Type**: `ad_rds`
- **Verification**: Financial promotions cannot be approved with single approval

### Claim: "Budget allocations are tracked and cannot be exceeded"
- **Code Path**: `src/services/marketing/BudgetService.ts`
- **Evidence Generation**:
  - `public.io_allocations` - tracks budget allocations
  - Real-time spend tracking against allocations
- **RDS Type**: `io_rds`
- **Verification**: Spend operations blocked when budget exceeded

### Claim: "Creative authenticity is verified before publication"
- **Code Path**: `src/services/marketing/AuthenticityService.ts`
- **Evidence Generation**:
  - Deepfake detection and watermarking
  - `public.creatives.authenticity_score` - stores verification results
- **RDS Type**: `ad_rds`
- **Verification**: Low authenticity scores prevent publication

## Common Evidence Layer Claims

### Claim: "All data is canonicalized for deterministic hashing"
- **Code Path**: `src/services/common/CanonicalService.ts::canonicalize()`
- **Evidence Generation**:
  - Deterministic object serialization
  - Volatile field stripping
  - Timestamp rounding
- **RDS Type**: All RDS types
- **Verification**: Canonical format validation and hash verification

### Claim: "Digital signatures ensure data integrity"
- **Code Path**: `src/services/common/RDSSignVerifyService.ts`
- **Evidence Generation**:
  - SHA-256 hashing of canonical data
  - Digital signature creation and verification
- **RDS Type**: All RDS types
- **Verification**: Signature verification against known public keys

### Claim: "Merkle trees enable efficient batch verification"
- **Code Path**: `src/services/common/HashAnchorService.ts::buildMerkleTree()`
- **Evidence Generation**:
  - Merkle tree construction
  - Proof generation for individual items
- **RDS Type**: All RDS types (when batched)
- **Verification**: Merkle proof verification against root hash

## Database Schema Claims

### Claim: "Row Level Security ensures tenant isolation"
- **Code Path**: Database RLS policies on all tables
- **Evidence Generation**:
  - `tenant_id` filtering in all policies
  - Role-based access controls
- **Verification**: Users can only access their tenant's data

### Claim: "Audit trails capture all significant events"
- **Code Path**: Database triggers and audit functions
- **Evidence Generation**:
  - `public.security_audit_logs` - captures security events
  - Automatic trigger execution on data changes
- **Verification**: All operations generate audit entries

## API Endpoint Claims

### Executive Suite APIs
- `POST /exec/plan/draft` → Plan creation with artifact hash
- `POST /exec/plan/approve` → Approval binding to artifact+policy hash
- `POST /exec/plan/activate` → Activation with CLO gate validation
- `GET /exec/plan/{id}/rds` → Plan-RDS retrieval with full evidence

### Marketing Engine APIs  
- `POST /ads/creative/generate` → Creative generation with provenance
- `POST /ads/creative/approve` → Approval with two-person validation
- `POST /ads/publish` → Publication with authenticity verification
- `POST /metrics/ingest` → Metrics ingestion with validation

## Testing and Verification

### Unit Tests
- **Location**: `tests/` directory (to be created)
- **Coverage**: All service classes and utility functions
- **Focus**: Hash consistency, signature verification, policy evaluation

### Integration Tests
- **Location**: `tests/integration/` directory (to be created)  
- **Coverage**: End-to-end workflows
- **Focus**: Draft→Approve→Activate flows with RDS generation

### Property Tests
- **Location**: `tests/property/` directory (to be created)
- **Coverage**: Canonicalization consistency, hash determinism
- **Focus**: Mathematical properties of evidence generation

## Compliance Mapping

### SEC Compliance
- **Claim**: All investment advice is properly disclosed
- **Code Path**: Marketing Engine disclosure injection
- **Evidence**: Ad-RDS with disclosure metadata

### FCA Compliance  
- **Claim**: Financial promotions meet regulatory standards
- **Code Path**: Two-person approval workflow
- **Evidence**: Approval records in Ad-RDS

### SOX Compliance
- **Claim**: Financial controls are enforced
- **Code Path**: Budget allocation and approval systems
- **Evidence**: IO-RDS and Payment-RDS with control validation

## Evidence Retention

### Retention Policies
- **Plan-RDS**: 7 years (regulatory requirement)
- **Ad-RDS**: 5 years (advertising standards)
- **IO-RDS**: 7 years (financial records)
- **Payment-RDS**: 10 years (tax requirements)

### Storage Locations
- **Primary**: Supabase database tables
- **Backup**: Encrypted cloud storage
- **Archive**: Long-term retention system

## Chain of Custody

1. **Data Creation** → Canonical representation
2. **Canonicalization** → Deterministic hash
3. **Approval Process** → Binding to artifact+policy hash  
4. **RDS Generation** → Digital signature creation
5. **Storage** → Immutable record preservation
6. **Verification** → On-demand integrity checking

This claim map ensures full traceability from business operations to regulatory evidence, with cryptographic guarantees of integrity and authenticity.