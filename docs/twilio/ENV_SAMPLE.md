# Twilio Environment Variables

## Complete .env.example for Twilio Integration

```bash
# ==============================================
# TWILIO CORE CONFIGURATION
# ==============================================

# Required for all Twilio operations
# Get from: https://console.twilio.com/ > Account Info
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ==============================================
# TWILIO MESSAGING CONFIGURATION  
# ==============================================

# Required for SMS/MMS messaging
# Get from: https://console.twilio.com/ > Messaging > Services
TWILIO_MESSAGING_SERVICE_SID=MGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Optional: Default sender number for SMS
# Format: E.164 (+1234567890)
TWILIO_CALLER_ID=+1xxxxxxxxxx

# ==============================================
# TWILIO VOICE CONFIGURATION
# ==============================================

# Optional: API Keys for enhanced voice features
# Get from: https://console.twilio.com/ > API Keys & Tokens
TWILIO_API_KEY_SID=SKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_API_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ==============================================
# TWILIO VERIFICATION SERVICE (OPTIONAL)
# ==============================================

# Required only if using Twilio Verify for 2FA
# Get from: https://console.twilio.com/ > Verify > Services
TWILIO_VERIFY_SERVICE_SID=VAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ==============================================
# WEBHOOK CONFIGURATION
# ==============================================

# Automatically configured - used by Twilio to send status updates
# Production URLs (auto-configured in deployment)
TWILIO_VOICE_WEBHOOK_URL=https://xcmqjkvyvuhoslbzmlgi.functions.supabase.co/twilio-voice-webhook
TWILIO_SMS_WEBHOOK_URL=https://xcmqjkvyvuhoslbzmlgi.functions.supabase.co/twilio-sms-webhook

# Local development URLs (for testing)
# TWILIO_VOICE_WEBHOOK_URL=http://localhost:54321/functions/v1/twilio-voice-webhook
# TWILIO_SMS_WEBHOOK_URL=http://localhost:54321/functions/v1/twilio-sms-webhook

# ==============================================
# ENVIRONMENT-SPECIFIC CONFIGURATION
# ==============================================

# STAGING ENVIRONMENT
# Use Twilio test credentials for staging
# Test Account SID starts with 'AC...' but uses test mode
# TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  # Test account
# TWILIO_AUTH_TOKEN=test_auth_token_here

# PRODUCTION ENVIRONMENT  
# Use live Twilio credentials
# Ensure proper webhook URLs are configured
# TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  # Live account
# TWILIO_AUTH_TOKEN=live_auth_token_here

# ==============================================
# OPTIONAL ADVANCED CONFIGURATION
# ==============================================

# TwiML Application SID (for advanced call flows)
# TWILIO_TWIML_APP_SID=APxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Twilio Connect Application (for marketplace scenarios)
# TWILIO_CONNECT_APP_SID=APxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Custom webhook authentication token
# TWILIO_WEBHOOK_AUTH_TOKEN=your_custom_webhook_secret

# Twilio Studio Flow SID (for complex IVR flows)
# TWILIO_STUDIO_FLOW_SID=FWxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ==============================================
# USAGE NOTES
# ==============================================

# REQUIRED vs OPTIONAL:
# - TWILIO_ACCOUNT_SID: REQUIRED (all environments)
# - TWILIO_AUTH_TOKEN: REQUIRED (all environments)  
# - TWILIO_MESSAGING_SERVICE_SID: REQUIRED (for SMS features)
# - TWILIO_CALLER_ID: OPTIONAL (can use purchased numbers instead)
# - TWILIO_API_KEY_*: OPTIONAL (enhanced features only)
# - TWILIO_VERIFY_SERVICE_SID: OPTIONAL (2FA features only)

# STAGING vs PRODUCTION:
# - Staging: Can use test credentials, limited functionality
# - Production: Requires live credentials, full billing applies

# WEBHOOK URLS:
# - Automatically configured during deployment
# - Must be publicly accessible HTTPS URLs
# - Local development requires ngrok or similar tunneling

# SECURITY CONSIDERATIONS:
# - Never commit these values to version control
# - Use Supabase secrets management in production
# - Rotate credentials regularly
# - Monitor usage for unusual activity

# COST IMPLICATIONS:
# - SMS: ~$0.0075 per message in US
# - Voice: ~$0.013 per minute in US  
# - Phone numbers: $1/month per number
# - Recording: $0.05 per recorded minute
# - Transcription: $0.05 per transcribed minute

# GETTING STARTED:
# 1. Create Twilio account at https://twilio.com
# 2. Get Account SID and Auth Token from console
# 3. Create Messaging Service for SMS
# 4. Purchase phone number(s) as needed
# 5. Configure webhook URLs in phone number settings
# 6. Test with staging environment first
```

## Environment-Specific Setup Guide

### Development Environment
```bash
# Use Twilio test credentials for development
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  # Test account
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx     # Test token

# Use ngrok for local webhook testing
# 1. Install ngrok: npm install -g ngrok
# 2. Start local dev server: npm run dev
# 3. Expose webhooks: ngrok http 54321
# 4. Update webhook URLs with ngrok URL
```

### Staging Environment
```bash
# Use test credentials or sandbox account
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  # Test/sandbox account
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx     # Test token
TWILIO_MESSAGING_SERVICE_SID=MGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  # Test messaging service

# Use staging webhook URLs
TWILIO_VOICE_WEBHOOK_URL=https://staging-project.functions.supabase.co/twilio-voice-webhook
TWILIO_SMS_WEBHOOK_URL=https://staging-project.functions.supabase.co/twilio-sms-webhook
```

### Production Environment
```bash
# Use live Twilio credentials
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  # Live account
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx     # Live token  
TWILIO_MESSAGING_SERVICE_SID=MGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  # Live messaging service
TWILIO_CALLER_ID=+1xxxxxxxxxx                          # Purchased phone number

# Production webhook URLs (automatically configured)
TWILIO_VOICE_WEBHOOK_URL=https://xcmqjkvyvuhoslbzmlgi.functions.supabase.co/twilio-voice-webhook
TWILIO_SMS_WEBHOOK_URL=https://xcmqjkvyvuhoslbzmlgi.functions.supabase.co/twilio-sms-webhook
```

## Configuration Checklist

### Pre-deployment Checklist
- [ ] Twilio account created and verified
- [ ] Account SID and Auth Token obtained
- [ ] Messaging Service created (for SMS)
- [ ] Phone number(s) purchased (if needed)
- [ ] Webhook URLs configured in Twilio console
- [ ] Test credentials working in staging
- [ ] Production credentials configured in Supabase secrets

### Post-deployment Verification
- [ ] SMS sending works from application
- [ ] Voice calls connect properly  
- [ ] Webhooks receive status updates
- [ ] Call recording and transcription function
- [ ] Number search and management work
- [ ] Error handling and logging operational

### Security Verification
- [ ] No credentials hardcoded in repository
- [ ] Webhook signature verification enabled
- [ ] Access logs monitoring configured
- [ ] Usage and cost monitoring set up
- [ ] Credential rotation schedule established

## Troubleshooting Common Issues

### Authentication Errors
```bash
# Test credentials manually
curl -X GET "https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID.json" \
  -u "$TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN"
```

### Webhook Not Receiving Events
1. Verify webhook URL is publicly accessible
2. Check Twilio console for webhook delivery logs  
3. Ensure webhook returns 200 status code
4. Verify Content-Type is application/x-www-form-urlencoded

### SMS Not Sending
1. Verify messaging service SID is correct
2. Check phone number capabilities in Twilio console
3. Ensure sender number is registered/verified
4. Check for opt-out status on recipient number

### Voice Calls Not Connecting
1. Verify phone number has voice capability
2. Check webhook URL configuration
3. Ensure TwiML response is valid XML
4. Verify geographic restrictions and permissions

This configuration guide ensures proper Twilio setup across all environments while maintaining security and functionality.