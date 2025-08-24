# Sample Test Data for Meeting Import Adapters

This directory contains sample data files used for testing the Zocks and Jump meeting import adapters.

## Files

### Zocks Format
- **sampleZocks.json** - Complete Zocks meeting transcript with participant metadata
- **sampleZocks.txt** - Plain text transcript format for fallback testing

### Jump Format  
- **sampleJump.json** - Jump meeting summary with pre-processed bullets, actions, and risks
- **sampleJump.txt** - Formatted text summary for plain text import testing

## Usage in Tests

These files are referenced in:
- `src/tests/imports.zocks.test.ts` - Unit tests for Zocks adapter
- `src/tests/imports.jump.test.ts` - Unit tests for Jump adapter  
- `src/tests/meetings.import.e2e.ts` - E2E tests for full import workflow

## Data Structure

### Zocks JSON Schema
```typescript
{
  meetingId: string
  startedAt?: string
  participants?: { name: string; role?: string }[]
  transcript: { ts?: number; speaker?: string; text: string }[]
  meta?: Record<string, any>
}
```

### Jump JSON Schema
```typescript
{
  callId?: string
  startedAt?: string
  speakers?: string[]
  summary?: string
  bullets?: string[]
  nextSteps?: string[]
  risks?: string[]
  meta?: Record<string, any>
}
```

## Privacy and Security

- All sample data uses fictional names and scenarios
- No real PII or sensitive financial information
- Designed to test parsing logic without real data exposure
- Content includes patterns for testing bullet extraction, action items, and risk identification