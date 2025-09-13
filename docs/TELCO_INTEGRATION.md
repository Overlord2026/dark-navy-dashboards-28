# Telco Integration Environment Variables

This document outlines the required environment variables for Twilio/Vonage integration. **DO NOT COMMIT THESE VALUES TO VERSION CONTROL.**

## Required Environment Variables

### Twilio Configuration
```bash
# Twilio Account Credentials
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_API_KEY=SKxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_API_SECRET=your_api_secret_here

# Twilio Phone Numbers
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_BACKUP_NUMBER=+1234567891

# Webhook URLs (automatically set by Supabase)
TWILIO_WEBHOOK_BASE_URL=https://your-project.supabase.co/functions/v1
```

### Vonage (Alternative Provider)
```bash
# Vonage API Credentials
VONAGE_API_KEY=your_vonage_api_key
VONAGE_API_SECRET=your_vonage_api_secret
VONAGE_APPLICATION_ID=your_app_id

# Vonage Phone Numbers
VONAGE_PHONE_NUMBER=+1234567890
```

### AIES Legal Signing
```bash
# KMS/HSM Configuration for Legal Signatures
AIES_LEGAL_KEY=your_kms_key_reference
AIES_LEGAL_ALGORITHM=ES256
AIES_LEGAL_PROVIDER=aws-kms|azure-keyvault|gcp-kms
```

### OpenAI Realtime (for Voice Processing)
```bash
# OpenAI API for voice-to-text and realtime processing
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_REALTIME_MODEL=gpt-4o-realtime-preview-2024-12-17
```

## Webhook Configuration

### Twilio Console Setup

1. **Voice URLs** (in Phone Number configuration):
   - Webhook URL: `https://your-project.supabase.co/functions/v1/tel-answer`
   - HTTP Method: `POST`
   - Fallback URL: `https://your-project.supabase.co/functions/v1/tel-handoff`

2. **TwiML App** (for media streaming):
   - Voice Request URL: `https://your-project.supabase.co/functions/v1/tel-stream`
   - Voice Fallback URL: `https://your-project.supabase.co/functions/v1/tel-handoff`

3. **Status Callbacks**:
   - Call Status Changes: `https://your-project.supabase.co/functions/v1/tel-handoff/status`

### Vonage Application Setup

1. **Answer URL**: `https://your-project.supabase.co/functions/v1/tel-answer`
2. **Event URL**: `https://your-project.supabase.co/functions/v1/tel-stream`
3. **Fallback URL**: `https://your-project.supabase.co/functions/v1/tel-handoff`

## Security Notes

### Environment Variable Management

1. **Supabase Secrets**: Use Supabase's secret management:
   ```bash
   # Add secrets via Supabase CLI or Dashboard
   supabase secrets set TWILIO_AUTH_TOKEN=your_token_here
   ```

2. **Local Development**: Use `.env.local` (gitignored):
   ```bash
   # .env.local (never commit this file)
   TWILIO_ACCOUNT_SID=ACxxxxx
   TWILIO_AUTH_TOKEN=xxxxx
   ```

3. **Production**: Set via Supabase Dashboard > Settings > Edge Functions

### Webhook Security

1. **Verify Webhook Signatures**: All endpoints should validate Twilio/Vonage signatures
2. **IP Allowlisting**: Configure firewall rules for Twilio/Vonage IPs
3. **HTTPS Only**: All webhook URLs must use HTTPS

## API Endpoints

### Voice Call Flow

1. **Incoming Call** → `/tel/answer`
   - Returns TwiML with consent prompts
   - Creates call record in `aies_voice_calls`

2. **User Input** → `/tel/stream`
   - Handles DTMF and speech input
   - WebSocket for real-time media streaming
   - Records consent and basic information

3. **Human Transfer** → `/tel/handoff`
   - Attempts to connect to available agents
   - Falls back to voicemail if no agents available
   - Logs all handoff events

### Testing Webhooks

Use ngrok for local testing:
```bash
# Install ngrok
npm install -g ngrok

# Expose local Supabase functions
ngrok http 54321

# Use the ngrok URL in Twilio console:
# https://xxxxx.ngrok.io/functions/v1/tel-answer
```

## Compliance Requirements

### Data Retention
- Audio recordings: 7 years (configurable)
- Call logs: 10 years
- Consent records: Permanent

### Geographic Restrictions
- Different consent requirements by state/country
- Configured in `aies_voice_calls.geo` field
- Automatic geo-detection from caller ID

### Legal Disclaimers
- Not attorney-client privilege until explicit agreement
- Recording consent required in two-party states
- HIPAA compliance for health-related matters

## Monitoring & Alerts

### Key Metrics
- Call volume by hour/day
- Consent completion rates
- Agent availability
- Technical error rates

### Alert Conditions
- Failed webhook deliveries
- High call abandonment rates
- Agent unavailability > 30 minutes
- Legal signature failures

## Troubleshooting

### Common Issues

1. **Webhook Timeouts**: Edge functions have 60s timeout
2. **WebSocket Drops**: Implement reconnection logic
3. **Media Quality**: Use G.711 µ-law for best compatibility
4. **Consent Tracking**: Ensure proper geo-location detection

### Debug Logs

Enable detailed logging in Edge Functions:
```typescript
console.log('Call details:', { CallSid, From, To });
console.log('WebSocket message:', JSON.stringify(message, null, 2));
```

## Rate Limits

### Twilio Limits
- API: 1000 requests/second
- Concurrent calls: Based on account limits
- WebSocket connections: 100 per account

### Supabase Limits
- Edge Function invocations: Based on plan
- Database connections: Shared pool
- Storage: Based on plan

## Cost Optimization

### Twilio Costs
- Inbound calls: ~$0.005/minute
- Outbound calls: ~$0.010/minute
- SMS: ~$0.0075/message
- Phone numbers: ~$1/month

### Optimization Strategies
- Use shortest possible hold music
- Implement efficient call routing
- Monitor and optimize agent utilization
- Cache frequently accessed data