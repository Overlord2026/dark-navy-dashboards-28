# Twilio Webhooks Documentation

## Overview
This document details all Twilio webhook implementations, their security measures, and testing procedures.

## Voice Webhooks

### twilio-voice-webhook
**URL**: `https://xcmqjkvyvuhoslbzmlgi.functions.supabase.co/twilio-voice-webhook`
**Method**: POST
**Content-Type**: application/x-www-form-urlencoded

#### Authentication/Verification
- Uses Supabase service role key authentication
- No Twilio signature verification currently implemented ⚠️
- **Recommendation**: Implement Twilio signature verification

#### Expected Payload
```
CallSid=CAxxxxx
From=+15551234567
To=+15557654321
CallStatus=ringing|answered|completed|failed|busy|no-answer
Direction=inbound|outbound
CallDuration=123
RecordingUrl=https://api.twilio.com/recordings/RExxxxx.mp3
RecordingSid=RExxxxx
TranscriptionText=Meeting transcript text
TranscriptionStatus=completed|failed
```

#### Response Shape
- **Success**: 200 OK with "OK" body
- **Error**: 500 Internal Server Error with JSON error details
- **TwiML Response**: 200 OK with XML TwiML for call flow control

#### Error Handling
- Logs errors to console
- Returns 500 status on exceptions
- No retry logic implemented ⚠️

#### Idempotency
- No idempotency key handling currently ⚠️
- **Risk**: Duplicate webhook processing possible

#### Retry Policy
- Relies on Twilio's default retry behavior
- **Recommendation**: Implement custom retry tracking

#### Local Testing
```bash
curl -X POST http://localhost:54321/functions/v1/twilio-voice-webhook \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "CallSid=CA123456789&From=%2B15551234567&To=%2B15557654321&CallStatus=ringing&Direction=inbound"
```

## SMS Webhooks

### twilio-sms-webhook
**URL**: `https://xcmqjkvyvuhoslbzmlgi.functions.supabase.co/twilio-sms-webhook`
**Method**: POST
**Content-Type**: application/x-www-form-urlencoded

#### Authentication/Verification
- Uses Supabase service role key authentication
- No Twilio signature verification implemented ⚠️

#### Expected Payload
```
MessageSid=SMxxxxx
From=+15551234567
To=+15557654321
Body=Message content
MessageStatus=sent|delivered|failed|undelivered
NumMedia=0
ErrorCode=30008
ErrorMessage=Unknown error
SmsStatus=received|sent|delivered|failed
```

#### Response Shape
- **Success**: 200 OK
- **Error**: 500 Internal Server Error
- **TwiML Response**: Optional XML for auto-responses

#### Error Handling
- Console logging
- 500 status on errors
- No DLQ (Dead Letter Queue) ⚠️

#### Local Testing
```bash
curl -X POST http://localhost:54321/functions/v1/twilio-sms-webhook \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "MessageSid=SM123&From=%2B15551234567&To=%2B15557654321&Body=Hello&MessageStatus=delivered"
```

## Zoom Recording Webhooks

### webhook-recording-zoom
**URL**: `https://xcmqjkvyvuhoslbzmlgi.functions.supabase.co/webhook-recording-zoom`
**Method**: POST
**Content-Type**: application/json

#### Authentication/Verification
- Checks for `x-zm-signature` header
- No signature verification implemented ⚠️
- **Security Risk**: Webhook endpoint accessible without validation

#### Expected Payload
```json
{
  "event": "recording.completed",
  "object": {
    "id": "meeting_id",
    "topic": "Meeting Topic",
    "start_time": "2024-01-01T10:00:00Z",
    "recording_files": [
      {
        "id": "file_id",
        "file_type": "MP4",
        "file_size": 12345678,
        "download_url": "https://zoom.us/rec/download/...",
        "recording_start": "2024-01-01T10:00:00Z",
        "recording_end": "2024-01-01T11:00:00Z"
      }
    ]
  }
}
```

#### Response Shape
- **Success**: 200 OK with `{"success": true}`
- **Error**: 500 Internal Server Error with error details

#### Error Handling
- Marks webhook events as failed in database
- Stores processing errors for debugging
- No automatic retry mechanism

#### Local Testing
```bash
curl -X POST http://localhost:54321/functions/v1/webhook-recording-zoom \
  -H "Content-Type: application/json" \
  -H "x-zm-signature: signature_here" \
  -d '{
    "event": "recording.completed",
    "object": {
      "id": "test_meeting",
      "topic": "Test Meeting",
      "recording_files": []
    }
  }'
```

## Security Recommendations

### High Priority
1. **Implement Twilio Signature Verification**
   ```typescript
   import crypto from 'crypto';
   
   function validateTwilioSignature(signature: string, url: string, params: any, authToken: string): boolean {
     const data = Object.keys(params).sort().map(key => `${key}${params[key]}`).join('');
     const expected = crypto.createHmac('sha1', authToken).update(url + data).digest('base64');
     return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(`sha1=${expected}`));
   }
   ```

2. **Add Idempotency Key Handling**
   ```typescript
   // Check for duplicate webhook processing
   const existingEvent = await supabase
     .from('webhook_events')
     .select('id')
     .eq('external_id', callSid)
     .single();
   
   if (existingEvent) {
     return new Response('Already processed', { status: 200 });
   }
   ```

3. **Implement Retry Logic with Exponential Backoff**
   ```typescript
   const retryAttempts = 3;
   for (let attempt = 1; attempt <= retryAttempts; attempt++) {
     try {
       await processWebhook(data);
       break;
     } catch (error) {
       if (attempt === retryAttempts) throw error;
       await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
     }
   }
   ```

### Medium Priority
1. **Add Rate Limiting**
2. **Implement Dead Letter Queue for Failed Webhooks**
3. **Add Webhook Event Deduplication**
4. **Create Webhook Health Monitoring**

## Webhook Configuration in Twilio

### Voice Webhook Configuration
```bash
# Using Twilio CLI
twilio phone-numbers:update +15551234567 \
  --voice-url=https://xcmqjkvyvuhoslbzmlgi.functions.supabase.co/twilio-voice-webhook \
  --voice-method=POST \
  --status-callback=https://xcmqjkvyvuhoslbzmlgi.functions.supabase.co/twilio-voice-webhook \
  --status-callback-method=POST \
  --status-callback-event="initiated,ringing,answered,completed"
```

### SMS Webhook Configuration
```bash
# Using Twilio CLI
twilio phone-numbers:update +15551234567 \
  --sms-url=https://xcmqjkvyvuhoslbzmlgi.functions.supabase.co/twilio-sms-webhook \
  --sms-method=POST
```

## Monitoring & Alerting

### Key Metrics to Monitor
- Webhook delivery success rate
- Response time latency
- Error rate by webhook type
- Failed webhook retry counts
- Payload size and processing time

### Recommended Alerts
- Webhook failure rate > 5%
- Response time > 5 seconds
- Missing webhooks for > 1 hour
- Signature verification failures

## Testing Checklist

### Pre-deployment Testing
- [ ] Webhook signature verification
- [ ] Idempotency key handling
- [ ] Error scenarios (malformed payload, network issues)
- [ ] Load testing with high webhook volume
- [ ] Security testing (invalid signatures, replay attacks)

### Post-deployment Monitoring
- [ ] Webhook delivery success rates
- [ ] Response time performance
- [ ] Error log analysis
- [ ] Integration testing with actual Twilio services

## Future Improvements

### Short-term (1-2 weeks)
1. Implement signature verification for all webhooks
2. Add idempotency key support
3. Create webhook monitoring dashboard
4. Add retry logic with exponential backoff

### Medium-term (1-2 months)
1. Implement webhook event replay capability
2. Add comprehensive webhook analytics
3. Create webhook debugging tools
4. Implement webhook rate limiting

### Long-term (3+ months)
1. Build webhook orchestration system
2. Add real-time webhook event streaming
3. Implement advanced webhook security features
4. Create webhook performance optimization tools

This documentation should be updated as webhook implementations evolve and new security measures are added.