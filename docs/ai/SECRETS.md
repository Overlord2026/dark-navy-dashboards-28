# AI Secrets Configuration

## OpenAI API Key Management

Use only `OPENAI_API_KEY` in Supabase Secrets. No client-side VITE key. Ephemeral tokens are issued by `/functions/v1/realtime-ephemeral`.

### Setup Instructions

1. In Supabase Dashboard → Settings → Edge Functions → Secrets
2. Add a new secret: `OPENAI_API_KEY`
3. Enter your OpenAI API key as the value
4. All Edge Functions will use this standardized name

### Security Guidelines

- Never use client-side environment variables for OpenAI keys
- Always check for key existence in Edge Functions before making API calls
- Return helpful error messages without exposing secrets
- Use ephemeral tokens for real-time features

### Edge Function Pattern

```typescript
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
if (!OPENAI_API_KEY) {
  return new Response(
    JSON.stringify({ error: 'OpenAI API key not configured' }),
    { status: 500, headers: corsHeaders }
  );
}
```