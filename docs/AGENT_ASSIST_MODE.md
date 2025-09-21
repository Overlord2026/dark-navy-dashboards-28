# Agent Assist Mode

## Overview

This platform is designed with **service professionals and families as the primary users**. Agent automations are optional accelerants that operate under strict human oversight and policy controls.

## Core Principles

### 1. Human-Led Operations
- Service professionals (CPAs, advisors, attorneys, real estate agents) maintain full control
- Families and individuals directly interact with their trusted professionals  
- All critical decisions require human approval and oversight

### 2. Compliance-First Architecture
- Every automated action is gated by CheckPack policy validation
- All assisted operations generate ProofSlips for audit trails
- ExplainPack exports provide complete policy + receipt documentation
- Receipts and audit logs are standard for all operations

### 3. Optional Agent Assistance
- Agent automations are **disabled by default** (`FLAGS.__ENABLE_AGENT_AUTOMATIONS__ = false`)
- When enabled, agents operate as accelerants, not replacements
- High-risk actions require explicit human approval regardless of automation status
- Assisted actions are clearly labeled with "Assisted" badges in the UI

## Implementation Details

### Feature Flags
```typescript
export const FLAGS = {
  __ENABLE_AGENT_AUTOMATIONS__: false,    // Off by default
  __REQUIRE_APPROVAL_HIGH_RISK__: true    // Always require human OK for high-risk
} as const;
```

### Policy Gating
Before any automated action:
```typescript
const { pass, risk } = await runCheckPack('content', 0, 'openai');
if (!pass) return toast.error('Policy check failed.');
if (FLAGS.__REQUIRE_APPROVAL_HIGH_RISK__ && risk >= 3) {
  // Show confirm modal; only proceed on human OK
}
```

### Audit Trail
Every assisted step logs a ProofSlip:
```typescript
await createProof(jobId, 'check_passed', 'CheckPack passed', { sandbox: 'content' });
```

### Documentation Export
Complete audit packages via ExplainPack:
```typescript
const pack = await buildExplainPack(jobId);
// Downloads JSON with policy version + all ProofSlips
```

## User Experience

- **Default Mode**: Pure human-driven workflow with full professional control
- **Assisted Mode** (when enabled): Human-supervised automation with clear labeling
- **Audit Mode**: Complete transparency through receipts and explain packs
- **Compliance Mode**: Policy validation gates all automated actions

This architecture ensures that service professionals retain authority while optionally benefiting from AI acceleration when appropriate and compliant.