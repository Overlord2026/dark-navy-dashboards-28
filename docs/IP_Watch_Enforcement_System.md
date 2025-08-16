# IP Watch & Enforcement System

## Overview

The IP Watch & Enforcement system monitors intellectual property usage, creates verifiable receipts, and manages enforcement actions through a queue-based system with Merkle tree anchoring.

## Database Schema

### Core Tables

#### `public.ip_hits`
Monitors CPC clusters/keywords and IP-related activities:
- `hit_id` (UUID, Primary Key) - Unique identifier for each hit
- `source` (TEXT, NOT NULL) - Source of the hit (e.g., Google Alerts, social media)
- `ref` (TEXT) - Reference URL or identifier
- `title` (TEXT) - Title of the content
- `abstract` (TEXT) - Summary or excerpt
- `cpcs` (JSONB, Default: '[]') - Cost-per-click clusters/keywords
- `ts` (TIMESTAMP, Default: now()) - Timestamp of the hit
- `entity_id` (UUID) - Associated entity (tenant-scoped)
- `created_at` (TIMESTAMP, Default: now())
- `updated_at` (TIMESTAMP, Default: now())

**Indexes:**
- `idx_ip_hits_ts` - Optimized for time-based queries
- `idx_ip_hits_entity_id` - Tenant scoping performance

#### `public.receipts`
Canonical receipts with dual-anchor support:
- `receipt_id` (UUID, Primary Key) - Unique receipt identifier
- `entity_id` (UUID) - Associated entity
- `inputs_hash` (TEXT, NOT NULL) - SHA256 hash of input data
- `policy_hash` (TEXT, NOT NULL) - SHA256 hash of policy used
- `model_hash` (TEXT) - Hash of AI model version (if applicable)
- `reason_codes` (JSONB, Default: '[]') - Justification codes
- `outcome` (TEXT, NOT NULL) - Decision outcome
- `leaf` (TEXT, NOT NULL) - Merkle tree leaf hash
- `root` (TEXT, NOT NULL) - Merkle tree root hash
- `worm_uri` (TEXT) - Write-Once-Read-Many URI for immutable storage
- `txid` (TEXT) - Blockchain transaction ID placeholder
- `created_at` (TIMESTAMP, Default: now())

**Indexes:**
- `idx_receipts_root` - Merkle root lookups
- `idx_receipts_entity_id` - Tenant scoping
- `idx_receipts_created_at` - Time-based queries

#### `public.enforcement_queue`
Queue for actions requiring approval:
- `item_id` (UUID, Primary Key) - Unique queue item identifier
- `entity_id` (UUID) - Associated entity
- `action` (TEXT, NOT NULL) - Action to be taken
- `status` (TEXT, Default: 'pending') - Current status
- `priority` (INTEGER, Default: 3) - Priority level (1=highest, 5=lowest)
- `ref_hit_id` (UUID) - References `ip_hits.hit_id`
- `created_at` (TIMESTAMP, Default: now())
- `updated_at` (TIMESTAMP, Default: now())

**Indexes:**
- `idx_enforcement_queue_status` - Status-based filtering
- `idx_enforcement_queue_entity_id` - Tenant scoping
- `idx_enforcement_queue_priority` - Priority ordering

#### `public.policies` (Existing)
Policy definitions with versioning support for the enforcement system.

## SQL Functions

### Core Functions

#### `public.sha256_hex(input_text TEXT) RETURNS TEXT`
Pure SQL SHA256 hash function using pgcrypto:
```sql
SELECT public.sha256_hex('Hello World');
-- Returns: a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e
```

#### `public.merkle_root(leaves TEXT[]) RETURNS TEXT`
Simple pairwise Merkle root calculation:
```sql
SELECT public.merkle_root(ARRAY['hash1', 'hash2', 'hash3']);
-- Returns: computed merkle root hash
```
**⚠️ Warning:** Demo implementation only. Production systems should use proper Merkle tree libraries.

#### `public.receipt_emit(inputs_json JSONB, policy_json JSONB, outcome TEXT, reasons JSONB DEFAULT '[]'::jsonb, entity_id UUID DEFAULT NULL, model_hash TEXT DEFAULT NULL) RETURNS UUID`
Creates canonical receipts with Merkle anchoring:
```sql
SELECT public.receipt_emit(
    '{"action": "content_scan", "url": "https://example.com"}'::jsonb,
    '{"policy": "ip_protection_v1", "rules": ["no_copy", "trademark_check"]}'::jsonb,
    'approved',
    '["clean_content", "no_violations"]'::jsonb,
    'user-uuid-here'::uuid,
    'model-v1.2.3'
);
-- Returns: receipt UUID
```

## Row-Level Security (RLS)

### Tenant Scoping
All tables implement tenant-based RLS using the `get_current_user_tenant_id()` function:

#### IP Hits
- **SELECT**: Users can view hits for their tenant or global hits (entity_id IS NULL)
- **ALL**: Service role has full access

#### Receipts  
- **SELECT**: Users can view receipts for their tenant or global receipts
- **ALL**: Service role has full access

#### Enforcement Queue
- **SELECT**: Users can view queue items for their tenant or global items
- **ALL**: Service role has full access for management

### Security Model
- **Authenticated users**: Can view data within their tenant scope
- **Service role**: Full access for system operations
- **Anonymous users**: No access (all tables require authentication)

## Usage Examples

### 1. Record IP Hit
```sql
INSERT INTO public.ip_hits (source, ref, title, abstract, cpcs, entity_id)
VALUES (
    'Google Alerts',
    'https://competitor.com/similar-content',
    'Similar Family Office Software Launch',
    'A new family office platform with similar features...',
    '["family office", "wealth management", "portfolio"]'::jsonb,
    'tenant-entity-uuid'::uuid
);
```

### 2. Create Verification Receipt
```sql
SELECT public.receipt_emit(
    jsonb_build_object(
        'hit_id', 'hit-uuid-here',
        'content_hash', public.sha256_hex('content to verify'),
        'timestamp', extract(epoch from now())
    ),
    jsonb_build_object(
        'policy_name', 'ip_protection_policy_v2',
        'ai_model', 'content-similarity-detector-v1.0',
        'thresholds', jsonb_build_object('similarity', 0.8, 'trademark_match', 0.9)
    ),
    'violation_detected',
    '["high_similarity", "trademark_match", "requires_review"]'::jsonb,
    'tenant-entity-uuid'::uuid
);
```

### 3. Queue Enforcement Action
```sql
INSERT INTO public.enforcement_queue (entity_id, action, priority, ref_hit_id)
VALUES (
    'tenant-entity-uuid'::uuid,
    'send_cease_desist',
    1, -- High priority
    'related-hit-uuid'::uuid
);
```

### 4. Batch Query Recent Activity
```sql
-- Get recent IP hits with their enforcement status
SELECT 
    h.hit_id,
    h.source,
    h.title,
    h.ts,
    eq.action as enforcement_action,
    eq.status as enforcement_status,
    r.outcome as verification_outcome
FROM public.ip_hits h
LEFT JOIN public.enforcement_queue eq ON eq.ref_hit_id = h.hit_id
LEFT JOIN public.receipts r ON r.entity_id = h.entity_id 
    AND r.created_at >= h.created_at 
    AND r.created_at < h.created_at + INTERVAL '1 hour'
WHERE h.ts >= now() - INTERVAL '7 days'
ORDER BY h.ts DESC;
```

## Integration Points

### With Existing Edge Functions
The system integrates with existing edge functions:
- `ip-watch-scan` - Processes monitoring data
- `content-fingerprint-scan` - Analyzes content similarity

### With RDS (Receipt Data Structure)
- Uses `HashAnchorService` for client-side Merkle operations
- Implements `RDSSignVerifyService` for receipt validation
- Provides `CanonicalService` integration for data normalization

## Compliance & Audit Trail

### Immutable Receipts
- Each receipt contains cryptographic hashes of inputs and policies
- Merkle tree structure provides batch verification
- WORM URIs ensure tamper-evident storage
- Blockchain transaction IDs provide external anchoring

### Audit Queries
```sql
-- Verify receipt integrity
SELECT 
    receipt_id,
    inputs_hash,
    policy_hash,
    outcome,
    created_at,
    -- Verify leaf hash
    public.sha256_hex(
        receipt_id::text || 
        COALESCE(entity_id::text, '') ||
        inputs_hash || 
        policy_hash || 
        outcome ||
        COALESCE(model_hash, '') ||
        reason_codes::text ||
        extract(epoch from created_at)::text
    ) = leaf as leaf_verified
FROM public.receipts
WHERE created_at >= now() - INTERVAL '30 days';
```

## Monitoring & Alerts

### Key Metrics
- IP hits per day/week
- Receipt generation rate
- Enforcement queue backlog
- Policy compliance rates

### Alert Conditions
- High-priority enforcement items > 24 hours old
- Suspicious IP activity patterns
- Receipt verification failures
- Policy hash mismatches

## Future Enhancements

### Planned Features
1. **Real Blockchain Anchoring**: Replace placeholder txid with actual blockchain transactions
2. **Advanced Merkle Batching**: Implement periodic batching of multiple receipts
3. **AI-Powered Detection**: Enhanced content similarity and trademark detection
4. **Automated Enforcement**: Smart contract integration for certain enforcement actions
5. **API Rate Limiting**: Integrate with existing API monitoring systems

### Performance Optimizations
1. **Partitioning**: Time-based partitioning for large tables
2. **Archiving**: Automated archival of old IP hits and receipts
3. **Caching**: Redis integration for frequently accessed policies
4. **Bulk Operations**: Batch processing for high-volume monitoring