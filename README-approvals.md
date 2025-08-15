# Core Primitives + Approvals System

This system provides enterprise-grade approval workflows with evidence packages, domain events, and Policy-Based Access Tokens (PBAT).

## Architecture

### Core Tables

1. **evidence_packages** - Tamper-evident evidence with cryptographic hashes
2. **domain_events** - Event sourcing with sequence numbers and hashing  
3. **pbat_tokens** - Policy-Based Access Tokens for fine-grained authorization
4. **approval_rules** - Configurable approval policies by resource/action
5. **approval_requests** - Individual approval workflows
6. **approval_signals** - Individual approvals/rejections with quorum logic

### Edge Functions

1. **emit-receipt** - Creates tamper-evident receipts for domain events
2. **check-approvals** - Evaluates if action requires approval and creates requests
3. **issue-pbat** - Issues and validates Policy-Based Access Tokens

## Environment Variables

```bash
# Required for emit-receipt function
ANCHOR_ENABLED=false  # Set to "true" to enable blockchain anchoring

# Standard Supabase variables (automatically available)
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## API Usage Examples

### 1. Check if Action Requires Approval

```bash
curl -X POST 'https://your-project.supabase.co/functions/v1/check-approvals' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "resource_type": "financial_plan",
    "action_type": "publish",
    "resource_id": "plan_123",
    "request_data": {
      "plan_value": 1000000,
      "client_id": "client_456"
    },
    "requester_id": "user_789"
  }'
```

**Response:**
```json
{
  "requires_approval": true,
  "approval_request_id": "req_abc123",
  "status": "pending",
  "current_approvals": 0,
  "required_approvals": 2,
  "approval_threshold": 1.0,
  "approver_roles": ["compliance_officer", "senior_advisor"],
  "can_proceed": false,
  "reason": "approval_required"
}
```

### 2. Issue a PBAT Token

```bash
curl -X POST 'https://your-project.supabase.co/functions/v1/issue-pbat/issue' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "policy_id": "policy_123",
    "subject_id": "user_456",
    "scope": ["read:plans", "write:comments"],
    "token_type": "access",
    "expires_in_hours": 24,
    "max_usage_count": 100
  }'
```

**Response:**
```json
{
  "ok": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "token_id": "token_abc123",
  "expires_at": "2024-08-16T12:00:00Z",
  "scope": ["read:plans", "write:comments"],
  "token_type": "access"
}
```

### 3. Validate a PBAT Token

```bash
curl -X POST 'https://your-project.supabase.co/functions/v1/issue-pbat/validate' \
  -H 'Content-Type: application/json' \
  -d '{
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "required_scope": "read:plans"
  }'
```

**Response:**
```json
{
  "valid": true,
  "subject_id": "user_456",
  "scope": ["read:plans", "write:comments"],
  "token_type": "access",
  "policy_id": "policy_123",
  "usage_count": 1,
  "max_usage_count": 100
}
```

### 4. Emit a Domain Event Receipt

```bash
curl -X POST 'https://your-project.supabase.co/functions/v1/emit-receipt' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "event_type": "plan_published",
    "aggregate_id": "plan_123",
    "aggregate_type": "financial_plan", 
    "event_data": {
      "plan_id": "plan_123",
      "published_by": "user_789",
      "approval_request_id": "req_abc123"
    },
    "evidence_package_id": "evidence_456"
  }'
```

**Response:**
```json
{
  "ok": true,
  "receipt": {
    "id": "event_xyz789",
    "event_hash": "a1b2c3d4e5f6...",
    "anchor_txid": "notary:a1b2c3d4",
    "sequence_number": 42,
    "aggregate_id": "plan_123",
    "aggregate_type": "financial_plan",
    "event_type": "plan_published",
    "occurred_at": "2024-08-15T10:30:00Z"
  }
}
```

## Database Schema Overview

### Approval Rules Configuration

```sql
-- Example: Require 2 compliance officers for high-value plan publishing
INSERT INTO approval_rules (
  rule_name,
  resource_type, 
  action_type,
  conditions,
  required_approvers,
  approver_roles,
  approval_threshold
) VALUES (
  'High Value Plan Publishing',
  'financial_plan',
  'publish', 
  '{"plan_value": {"$gt": 500000}}',
  2,
  '["compliance_officer", "senior_advisor"]',
  1.0
);
```

### Approval Workflow

1. **Request Creation** - `check-approvals` creates approval_requests
2. **Signal Collection** - Approvers create approval_signals  
3. **Automatic Resolution** - Trigger updates approval_requests when quorum reached
4. **Event Emission** - Domain events track all state changes

### Evidence Packages

Store cryptographically-secured evidence:
- Documents with integrity hashes
- Digital signatures and attestations  
- Biometric authentication data
- Workflow execution proofs

### PBAT Tokens

Fine-grained authorization with:
- Scoped permissions (read/write specific resources)
- Time-based expiration
- Usage count limits
- Device/location constraints
- Delegation capabilities

## Security Features

- **Row Level Security (RLS)** on all tables
- **Cryptographic hashing** for tamper evidence
- **Sequence numbers** prevent event reordering
- **Token-based authorization** with scope validation
- **Audit trails** for all approval activities

## Integration Examples

### Frontend Integration

```typescript
// Check if approval needed before action
const checkApproval = async (resourceType: string, actionType: string, resourceId: string) => {
  const { data } = await supabase.functions.invoke('check-approvals', {
    body: {
      resource_type: resourceType,
      action_type: actionType, 
      resource_id: resourceId,
      requester_id: user.id
    }
  });
  
  if (data.requires_approval) {
    // Show approval pending UI
    showApprovalPendingModal(data.approval_request_id);
  } else {
    // Proceed with action
    performAction();
  }
};

// Create approval signal
const submitApproval = async (requestId: string, signalType: 'approve' | 'reject') => {
  await supabase.from('approval_signals').insert({
    approval_request_id: requestId,
    signal_type: signalType,
    comments: approvalComments
  });
};
```

### Backend Integration

```typescript
// Validate PBAT token before sensitive operation
const validateAccess = async (token: string, requiredScope: string) => {
  const { data } = await supabase.functions.invoke('issue-pbat/validate', {
    body: { token, required_scope: requiredScope }
  });
  
  if (!data.valid) {
    throw new Error(`Access denied: ${data.reason}`);
  }
  
  return data;
};
```

## Development Setup

1. **Deploy Edge Functions:**
   ```bash
   supabase functions deploy emit-receipt
   supabase functions deploy check-approvals  
   supabase functions deploy issue-pbat
   ```

2. **Set Environment Variables:**
   ```bash
   supabase secrets set ANCHOR_ENABLED=false
   ```

3. **Test the API:**
   ```bash
   # Use the curl examples above with your project URL
   # Replace YOUR_JWT_TOKEN with a valid user session token
   ```

## Monitoring and Observability

- **Domain Events** provide complete audit trail
- **Evidence Packages** ensure tamper-evident records
- **Token Usage** tracked for compliance reporting
- **Approval Metrics** available through domain_events queries

All operations emit domain events that can be consumed by:
- Analytics systems
- Compliance reporting
- Real-time monitoring
- Event-driven integrations