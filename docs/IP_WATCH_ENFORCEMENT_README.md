# IP Watch & Enforcement System

## Overview

The IP Watch & Enforcement system provides comprehensive monitoring, receipt generation, and enforcement capabilities for intellectual property protection. The system follows a structured workflow:

1. **Monitor** CPC clusters/keywords for potential IP violations
2. **Normalize** hits and extract relevant data
3. **Emit** canonical receipts with cryptographic proof
4. **Batch** receipts into Merkle trees for integrity verification
5. **Dual-anchor** with WORM URI and ledger transaction placeholders
6. **Verify** before executing any gated actions
7. **Queue** enforcement actions for review and execution

## Database Schema

### Tables

#### `public.ip_hits`
Stores monitoring hits from CPC clusters and keyword scanning.

```sql
- hit_id: UUID (Primary Key)
- source: TEXT (Required) - Source platform/service
- ref: TEXT - Reference URL or identifier  
- title: TEXT - Title of content
- abstract: TEXT - Summary/description
- cpcs: JSONB - CPC cluster data
- ts: TIMESTAMP - When hit was detected
- entity_id: UUID - Associated entity
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

**Indexes:**
- `idx_ip_hits_ts` on `ts DESC`
- `idx_ip_hits_entity_id` on `entity_id`

#### `public.receipts`
Canonical receipts with dual-anchor support for IP verification.

```sql
- receipt_id: UUID (Primary Key)
- entity_id: UUID - Associated entity
- inputs_hash: TEXT (Required) - SHA256 of input data
- policy_hash: TEXT (Required) - SHA256 of policy
- model_hash: TEXT - SHA256 of model/algorithm used
- reason_codes: JSONB - Structured reason codes
- outcome: TEXT (Required) - Decision outcome
- leaf: TEXT (Required) - Merkle leaf hash
- root: TEXT (Required) - Merkle root hash
- worm_uri: TEXT - Write-Once-Read-Many URI
- txid: TEXT - Ledger transaction ID
- created_at: TIMESTAMP
```

**Indexes:**
- `idx_receipts_root` on `root`
- `idx_receipts_entity_id` on `entity_id`
- `idx_receipts_created_at` on `created_at DESC`

#### `public.enforcement_queue`
Queue for enforcement actions requiring approval.

```sql
- item_id: UUID (Primary Key)
- entity_id: UUID - Associated entity
- action: TEXT (Required) - Type of enforcement action
- status: TEXT - Status (default: 'pending')
- priority: INTEGER - Priority level (default: 3)
- ref_hit_id: UUID - References ip_hits(hit_id)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

**Indexes:**
- `idx_enforcement_queue_status` on `status`
- `idx_enforcement_queue_entity_id` on `entity_id`
- `idx_enforcement_queue_priority` on `priority DESC`

#### `public.policies`
Versioned policy definitions (existing table - leveraged by IP Watch system).

## SQL Functions

### `public.sha256_hex(input_text TEXT) RETURNS TEXT`
Pure SQL function for SHA-256 hashing.

```sql
SELECT public.sha256_hex('test input');
-- Returns: c29f52b9b518e5b485e2c96e3c2ad6d4b40a3d1d9ea636e87aad0c0d5c7d9a61
```

### `public.merkle_root(leaves TEXT[]) RETURNS TEXT`
Computes Merkle root from array of leaf hashes using pairwise hashing.

⚠️ **Demo Implementation Only** - Production systems should use proper Merkle tree libraries.

```sql
SELECT public.merkle_root(ARRAY['hash1', 'hash2', 'hash3']);
-- Returns: computed_merkle_root_hash
```

### `public.receipt_emit(inputs_json JSONB, policy_json JSONB, outcome TEXT, reasons JSONB DEFAULT '[]', entity_id UUID DEFAULT NULL, model_hash TEXT DEFAULT NULL) RETURNS UUID`
Creates a new receipt with computed hashes and Merkle proof.

```sql
SELECT public.receipt_emit(
  '{"source": "google", "keywords": ["patent", "ai"]}'::jsonb,
  '{"version": "1.0", "rules": []}'::jsonb,
  'flagged',
  '["potential_infringement"]'::jsonb,
  'entity-uuid-here'::uuid
);
-- Returns: receipt_id UUID
```

## Row-Level Security (RLS)

All tables have RLS enabled with tenant-scoped policies:

### IP Hits
- **Users**: Can view hits for their tenant entities
- **Service Role**: Full access for system operations

### Receipts  
- **Users**: Can view receipts for their tenant entities
- **Service Role**: Full access for system operations

### Enforcement Queue
- **Users**: Can view enforcement items for their tenant entities
- **Service Role**: Full access for system operations

### Policies
- **All Users**: Can view all policies
- **Admins/Service Role**: Can manage policies

## Workflow Examples

### 1. Recording an IP Hit
```sql
INSERT INTO public.ip_hits (source, ref, title, abstract, cpcs, entity_id)
VALUES (
  'google_patents',
  'https://patents.google.com/patent/US123456',
  'AI-Based Portfolio Management',
  'Method and system for AI-driven investment portfolio optimization...',
  '["G06Q40/06", "G06N3/08"]'::jsonb,
  'entity-uuid'::uuid
);
```

### 2. Generating a Receipt
```sql
SELECT public.receipt_emit(
  jsonb_build_object(
    'hit_id', hit_id,
    'analysis_data', analysis_results
  ),
  jsonb_build_object(
    'policy_name', 'ip_protection_v1',
    'threshold', 0.85
  ),
  'potential_violation',
  '["similarity_threshold_exceeded", "same_domain"]'::jsonb,
  entity_id
) FROM public.ip_hits WHERE hit_id = 'specific-hit-id';
```

### 3. Queuing Enforcement Action
```sql
INSERT INTO public.enforcement_queue (entity_id, action, priority, ref_hit_id)
VALUES (
  'entity-uuid'::uuid,
  'cease_and_desist',
  1,
  'hit-uuid'::uuid
);
```

## Security Considerations

1. **Cryptographic Integrity**: All receipts include SHA-256 hashes for tamper detection
2. **Merkle Proofs**: Batch verification through Merkle tree structures
3. **Tenant Isolation**: RLS policies ensure proper data segregation
4. **Audit Trail**: Immutable receipt records with timestamps
5. **Dual Anchoring**: WORM URI + blockchain transaction placeholders

## Integration Points

- **Content Fingerprinting**: Works with existing `content-fingerprint-scan` edge function
- **IP Watch Scanning**: Integrates with `ip-watch-scan` edge function  
- **Receipt Storage**: Connects to `emit-receipt` and `store-receipt` edge functions
- **Hash & Anchor**: Utilizes `HashAnchorService` for integrity operations

## Usage Notes

- Receipt emission automatically computes all required hashes
- Merkle root calculation is performed in real-time (demo mode)
- Production deployments should implement proper batching for Merkle trees
- WORM URI and transaction ID fields support future blockchain anchoring
- All timestamps are in UTC with timezone awareness

Educational planning only; not investment, tax, or legal advice. Example data shown.