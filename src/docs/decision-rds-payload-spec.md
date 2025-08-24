# Decision-RDS Payload Specification

## Reasons Array Build Rules

All adapters follow this standardized rule for building the `reasons[]` array:

```typescript
const reasons = [
  'meeting_import',                                    // Always present
  ...(parsed.bullets.length > 0 ? ['meeting_summary'] : []),
  ...(parsed.actions.length > 0 ? ['action_items'] : []),
  ...(parsed.risks.length > 0 ? ['risk_flag'] : []),
  'ai_summary'                                         // Always present
];
```

## Decision-RDS Payload Structure

### Standard Output Format
```typescript
interface DecisionRDSPayload {
  action: 'meeting_import';
  policy_version: 'v1.0';
  inputs_hash: string;                    // SHA-256 of original input
  reasons: string[];                      // Built using rules above
  source: 'zocks' | 'jump' | 'plain_text';
  summary_length: number;
  participants_count: number;
  bullet_points_count: number;
  action_items_count: number;
  risks_count: number;
}
```

## Example Outputs

### Zocks Adapter Output
```json
{
  "action": "meeting_import",
  "policy_version": "v1.0", 
  "inputs_hash": "sha256:a1b2c3d4e5f6789...",
  "reasons": [
    "meeting_import",
    "meeting_summary", 
    "action_items",
    "risk_flag",
    "ai_summary"
  ],
  "source": "zocks",
  "summary_length": 187,
  "participants_count": 2,
  "bullet_points_count": 3,
  "action_items_count": 2,
  "risks_count": 1
}
```

### Jump Adapter Output  
```json
{
  "action": "meeting_import",
  "policy_version": "v1.0",
  "inputs_hash": "sha256:f6e5d4c3b2a1098...",
  "reasons": [
    "meeting_import",
    "meeting_summary",
    "action_items", 
    "risk_flag",
    "ai_summary"
  ],
  "source": "jump",
  "summary_length": 142,
  "participants_count": 3,
  "bullet_points_count": 4,
  "action_items_count": 3,
  "risks_count": 2
}
```

### Plain Text Adapter Output
```json
{
  "action": "meeting_import",
  "policy_version": "v1.0",
  "inputs_hash": "sha256:9876543210abcdef...",
  "reasons": [
    "meeting_import",
    "ai_summary"
  ],
  "source": "plain_text", 
  "summary_length": 89,
  "participants_count": 1,
  "bullet_points_count": 0,
  "action_items_count": 0,
  "risks_count": 0
}
```

## Input Format Examples

### Zocks JSON Input
```json
{
  "meetingId": "abc123",
  "startedAt": "2024-01-15T10:00:00Z",
  "participants": [
    {"name": "Coach", "role": "advisor"},
    {"name": "Client", "role": "client"}
  ],
  "transcript": [
    {"ts": 12.3, "speaker": "Coach", "text": "Let's cover Roth IRA conversion strategies."},
    {"ts": 45.0, "speaker": "Client", "text": "I'm concerned about required minimum distributions."},
    {"ts": 78.5, "speaker": "Coach", "text": "We should send you an RMD calendar and review your HSA rollover options."},
    {"ts": 102.1, "speaker": "Client", "text": "I'm worried about missing the QCD tracking requirements."}
  ],
  "meta": {"platform": "zocks", "version": "1.2"}
}
```

**Normalized Output:**
```json
{
  "summary": "Meeting discussion covering Roth IRA conversion strategies and required minimum distribution concerns with actionable next steps.",
  "bullets": [
    "Discussed Roth IRA conversion strategies", 
    "Reviewed required minimum distribution requirements",
    "Covered HSA rollover options"
  ],
  "actions": [
    "Send RMD calendar",
    "Review HSA rollover options"
  ],
  "risks": [
    "Missing QCD tracking requirements"
  ],
  "speakers": ["Coach", "Client"],
  "inputs_hash": "sha256:a1b2c3d4e5f6789..."
}
```

### Jump JSON Input
```json
{
  "callId": "xyz789",
  "startedAt": "2024-01-15T14:30:00Z",
  "speakers": ["Financial Advisor", "Client", "Spouse"],
  "summary": "Comprehensive financial planning session covering investment strategies and retirement planning.",
  "bullets": [
    "Reviewed current portfolio allocation",
    "Discussed risk tolerance assessment", 
    "Analyzed tax-loss harvesting opportunities",
    "Evaluated estate planning needs"
  ],
  "nextSteps": [
    "Schedule follow-up in 2 weeks",
    "Research ESG investment options",
    "Update beneficiary designations"
  ],
  "risks": [
    "Concentration risk in technology sector",
    "Potential tax implications of rebalancing"
  ],
  "meta": {"platform": "jump", "version": "2.1"}
}
```

**Normalized Output:**
```json
{
  "summary": "Comprehensive financial planning session covering investment strategies and retirement planning.",
  "bullets": [
    "Reviewed current portfolio allocation",
    "Discussed risk tolerance assessment",
    "Analyzed tax-loss harvesting opportunities", 
    "Evaluated estate planning needs"
  ],
  "actions": [
    "Schedule follow-up in 2 weeks",
    "Research ESG investment options",
    "Update beneficiary designations"
  ],
  "risks": [
    "Concentration risk in technology sector",
    "Potential tax implications of rebalancing"
  ],
  "speakers": ["Financial Advisor", "Client", "Spouse"],
  "inputs_hash": "sha256:f6e5d4c3b2a1098..."
}
```

### Plain Text Input
```
Coach: Let's review your retirement planning strategy.
Client: I'm worried about having enough saved for retirement.
Coach: We should schedule a follow-up to create a detailed savings plan.
Client: There's a risk I won't meet my retirement goals.
```

**Normalized Output:**
```json
{
  "summary": "Basic meeting discussion about retirement planning strategy and savings concerns.",
  "bullets": [],
  "actions": [
    "We should schedule a follow-up to create a detailed savings plan"
  ],
  "risks": [
    "There's a risk I won't meet my retirement goals"
  ],
  "speakers": ["Coach", "Client"],
  "inputs_hash": "sha256:9876543210abcdef..."
}
```

## Adapter Implementation Examples

### Zocks Adapter
```typescript
export function toDecisionRdsFromZocks(parsed: ParsedZocksData) {
  const reasons = [
    'meeting_import',
    ...(parsed.bullets.length > 0 ? ['meeting_summary'] : []),
    ...(parsed.actions.length > 0 ? ['action_items'] : []),
    ...(parsed.risks.length > 0 ? ['risk_flag'] : []),
    'ai_summary'
  ];

  return {
    action: 'meeting_import',
    policy_version: 'v1.0',
    inputs_hash: parsed.inputs_hash,
    reasons,
    source: 'zocks',
    summary_length: parsed.summary.length,
    participants_count: parsed.speakers.length,
    bullet_points_count: parsed.bullets.length,
    action_items_count: parsed.actions.length,
    risks_count: parsed.risks.length
  };
}
```

### Jump Adapter
```typescript
export function toDecisionRdsFromJump(parsed: ParsedJumpData) {
  const reasons = [
    'meeting_import',
    ...(parsed.bullets.length > 0 ? ['meeting_summary'] : []),
    ...(parsed.actions.length > 0 ? ['action_items'] : []),
    ...(parsed.risks.length > 0 ? ['risk_flag'] : []),
    'ai_summary'
  ];

  return {
    action: 'meeting_import',
    policy_version: 'v1.0',
    inputs_hash: parsed.inputs_hash,
    reasons,
    source: 'jump',
    summary_length: parsed.summary.length,
    participants_count: parsed.speakers.length,
    bullet_points_count: parsed.bullets.length,
    action_items_count: parsed.actions.length,
    risks_count: parsed.risks.length
  };
}
```

## Validation Requirements

### Mandatory Fields
- `action` must be `'meeting_import'`
- `policy_version` must be `'v1.0'`
- `inputs_hash` must be valid SHA-256 hex string (64 chars)
- `reasons` must be non-empty array
- `source` must be `'zocks'`, `'jump'`, or `'plain_text'`

### Reason Code Rules
- Always starts with `'meeting_import'`
- Always ends with `'ai_summary'`
- Includes `'meeting_summary'` if bullets exist
- Includes `'action_items'` if actions exist  
- Includes `'risk_flag'` if risks exist

### Count Validation
- All `*_count` fields must be non-negative integers
- Must match actual array lengths in normalized data
- `summary_length` must match actual summary character count