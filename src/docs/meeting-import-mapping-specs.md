# Meeting Import Adapter Mapping Specifications

This document defines unambiguous mapping rules for normalizing meeting data from different platforms into a standardized format.

## Normalized Output Format

All adapters must produce this exact structure:

```typescript
interface NormalizedMeeting {
  summary: string;           // Human-readable summary (max 500 chars)
  bullets: string[];         // Key discussion points (max 5 items)
  actions: string[];         // Action items/next steps (max 3 items)
  risks: string[];           // Identified risks/concerns (max 3 items)
  speakers: string[];        // Participant names
  inputs_hash: string;       // SHA-256 hash of original input
  transcriptText: string;    // Full transcript text
  originalData: any;         // Original platform data (null for plain text)
}
```

## Zocks Format → Normalized Mapping

### Input Schema (Zocks)
```typescript
interface ZocksTranscriptJSON {
  meetingId: string;
  startedAt?: string;
  participants?: { name: string; role?: string }[];
  transcript: { ts?: number; speaker?: string; text: string }[];
  meta?: Record<string, any>;
}
```

### Mapping Rules

#### Summary Generation
1. **Primary**: Concatenate all transcript text entries
2. **Fallback**: Generate from metadata: `"Meeting discussion with {transcript.length} exchanges ({wordCount} words). Key topics covered based on transcript content."`
3. **Length**: Truncate to 500 characters with "..." if needed

#### Bullets Extraction
1. **Source**: Full transcript text combined
2. **Patterns**: Look for lines containing:
   - "discussed", "talked about", "mentioned", "covered"
   - Natural conversation indicators
3. **Limit**: Maximum 5 bullets
4. **Format**: Clean text without prefixes

#### Actions Extraction  
1. **Source**: Combined transcript text
2. **Patterns**: Extract lines matching:
   - `/will\s+\w+/gi`
   - `/need\s+to\s+\w+/gi` 
   - `/should\s+\w+/gi`
   - `/action\s+item/gi`
   - `/follow\s+up/gi`
   - `/next\s+step/gi`
3. **Limit**: Maximum 3 unique actions
4. **Deduplication**: Remove duplicates with `[...new Set(actions)]`

#### Risks Extraction
1. **Source**: Combined transcript text  
2. **Patterns**: Extract lines matching:
   - `/risk/gi`, `/concern/gi`, `/issue/gi`
   - `/problem/gi`, `/challenge/gi`, `/warning/gi`
3. **Limit**: Maximum 3 unique risks
4. **Format**: Original line text, cleaned

#### Speakers Extraction
1. **Primary**: `participants?.map(p => p.name)` 
2. **Fallback**: Extract unique speakers from `transcript.map(t => t.speaker).filter(Boolean)`
3. **Default**: `['Unknown Speaker']` if no speakers found

#### Inputs Hash
```typescript
const inputs_hash = await hashContent({
  meetingId: parsed.meetingId,
  transcript: transcriptText,
  participants: speakers,
  startedAt: parsed.startedAt
});
```

## Jump Format → Normalized Mapping

### Input Schema (Jump)
```typescript
interface JumpSummaryJSON {
  callId?: string;
  startedAt?: string;
  speakers?: string[];
  summary?: string;
  bullets?: string[];
  nextSteps?: string[];
  risks?: string[];
  meta?: Record<string, any>;
}
```

### Mapping Rules

#### Summary Generation
1. **Primary**: Use `summary` field directly
2. **Fallback**: Generate from metadata:
   ```typescript
   const parts = [];
   if (data.callId) parts.push(`Call ID: ${data.callId}`);
   if (data.speakers?.length) parts.push(`Participants: ${data.speakers.join(', ')}`);
   if (data.bullets?.length) parts.push(`${data.bullets.length} key points discussed`);
   if (data.nextSteps?.length) parts.push(`${data.nextSteps.length} action items identified`);
   if (data.risks?.length) parts.push(`${data.risks.length} risks noted`);
   return parts.join('. ') + '.';
   ```
3. **Default**: `'Meeting summary imported from Jump platform.'`

#### Bullets Extraction
1. **Primary**: Use `bullets` array directly
2. **Limit**: Maximum 5 items
3. **Format**: Preserve original text

#### Actions Extraction
1. **Primary**: Use `nextSteps` array directly  
2. **Mapping**: `nextSteps` → `actions`
3. **Limit**: Maximum 3 items

#### Risks Extraction
1. **Primary**: Use `risks` array directly
2. **Limit**: Maximum 3 items

#### Speakers Extraction
1. **Primary**: Use `speakers` array directly
2. **Default**: `['Unknown Speaker']` if empty

#### Inputs Hash
```typescript
const inputs_hash = await hashContent({
  callId: parsed.callId,
  summary: parsed.summary,
  bullets: parsed.bullets,
  nextSteps: parsed.nextSteps, 
  speakers: parsed.speakers,
  startedAt: parsed.startedAt
});
```

## Plain Text → Normalized Mapping

### Input: Raw text string

### Mapping Rules

#### Summary Generation
1. **Length Check**: If text > 200 chars, truncate to 200 + "..."
2. **Otherwise**: Use full text as summary

#### Bullets Extraction
1. **Patterns**: Extract lines matching:
   - `^[\s]*[-*•]\s+` (bullet markers)
   - `^\d+\.\s+` (numbered lists)
   - Lines containing `•`
   - Lines 20-200 characters long
2. **Cleanup**: Remove prefixes like `-`, `*`, `•`, `1.`
3. **Limit**: Maximum 5 bullets

#### Actions Extraction
1. **Patterns**: Same as Zocks format
2. **Limit**: Maximum 3 unique actions

#### Risks Extraction  
1. **Patterns**: Same as Zocks format
2. **Limit**: Maximum 3 unique risks

#### Speakers Extraction
1. **Pattern**: Extract from `^([^:]+):` format
2. **Default**: `['Unknown Speaker']`

#### Inputs Hash
```typescript
const inputs_hash = await hashContent({
  content: textContent,
  type: 'plain_text'
});
```

## Validation Rules

### Required Fields
- All normalized outputs MUST include all 7 fields
- `summary` must be non-empty string
- Arrays can be empty but must be defined
- `inputs_hash` must be valid SHA-256 hex string

### Content Limits
- Summary: 500 characters max
- Bullets: 5 items max, 200 chars each
- Actions: 3 items max, 200 chars each  
- Risks: 3 items max, 200 chars each
- Speakers: No limit but reasonable (< 20)

### Hash Generation
```typescript
async function hashContent(content: any): Promise<string> {
  const textContent = typeof content === 'string' ? content : JSON.stringify(content);
  const encoder = new TextEncoder();
  const data = encoder.encode(textContent);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
```

## Error Handling

### Malformed JSON
- Catch `JSON.parse()` errors
- Fall back to plain text processing
- Set `originalData: null`

### Missing Required Fields
- Provide sensible defaults
- Never throw errors during normalization
- Log warnings for debugging

### Empty Content
- Return valid structure with empty arrays
- Use default values for required strings
- Ensure `inputs_hash` is still generated