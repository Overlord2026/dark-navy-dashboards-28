# Twilio Integration Guide

## Overview
Comprehensive Twilio integration for SMS, voice, and communication workflows across all BFO personas.

## Architecture

### Core Functions
```typescript
supabase/functions/
├── twilio-sms/             # SMS messaging
├── twilio-voice/           # Voice calls & IVR
├── twilio-webhook/         # Status callbacks
├── twilio-verify/          # 2FA verification
└── twilio-conference/      # Conference calling
```

### Database Schema
```sql
-- Communication tracking
CREATE TABLE public.communication_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  communication_type TEXT CHECK (communication_type IN ('sms', 'voice', 'conference')),
  direction TEXT CHECK (direction IN ('inbound', 'outbound')),
  from_number TEXT,
  to_number TEXT,
  message_sid TEXT UNIQUE, -- Twilio message SID
  call_sid TEXT UNIQUE,    -- Twilio call SID
  status TEXT,
  content TEXT,
  duration_seconds INTEGER,
  cost_cents INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'
);

-- SMS templates for personas
CREATE TABLE public.sms_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  persona_type TEXT NOT NULL,
  template_name TEXT NOT NULL,
  content TEXT NOT NULL,
  variables JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## Persona-Specific Workflows

### 1. Financial Advisor Communications
```typescript
const advisorCommunications = {
  sms: {
    appointment_reminders: "Hi {client_name}, this is a reminder of your meeting with {advisor_name} tomorrow at {time}. Reply CONFIRM to confirm or RESCHEDULE to change.",
    market_updates: "Market Alert: {update_text}. Your portfolio impact: {impact}. Call {advisor_phone} for questions.",
    document_ready: "Your {document_type} is ready for review. Access it securely at {portal_link}"
  },
  voice: {
    emergency_alerts: "portfolio_emergency_call.xml",
    appointment_confirmations: "appointment_confirm_ivr.xml",
    general_inquiries: "advisor_main_menu.xml"
  }
};
```

### 2. Legal Practice Communications
```typescript
const legalCommunications = {
  sms: {
    court_reminders: "Court reminder: {case_name} hearing on {date} at {time}. Arrive 30 minutes early. Court address: {address}",
    document_signing: "Document ready for signature: {document_name}. Sign at {docusign_link} by {deadline}",
    status_updates: "Case update: {case_name} - {status_update}. Next action: {next_action}"
  },
  voice: {
    intake_calls: "legal_intake_ivr.xml",
    emergency_legal: "after_hours_legal.xml",
    appointment_scheduling: "legal_scheduling.xml"
  }
};
```

### 3. CPA/Accounting Communications
```typescript
const cpaCommunications = {
  sms: {
    tax_deadlines: "Tax deadline reminder: {deadline_type} due {date}. Missing items: {missing_docs}. Upload at {portal_link}",
    document_requests: "Need documents for {tax_year} return: {document_list}. Upload deadline: {deadline}",
    appointment_scheduling: "Tax appointment available {date} at {time}. Reply YES to book, NO to see other times."
  },
  voice: {
    tax_season_support: "tax_support_ivr.xml",
    document_status: "document_status_check.xml",
    audit_support: "audit_support_hotline.xml"
  }
};
```

## Implementation

### 1. SMS Messaging Function
```typescript
// supabase/functions/twilio-sms/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { to, message, templateName, variables, persona } = await req.json()
    
    let finalMessage = message
    
    // Use template if specified
    if (templateName) {
      const { data: template } = await supabase
        .from('sms_templates')
        .select('content, variables')
        .eq('template_name', templateName)
        .eq('persona_type', persona)
        .single()
      
      if (template) {
        finalMessage = template.content
        // Replace variables
        for (const [key, value] of Object.entries(variables || {})) {
          finalMessage = finalMessage.replace(`{${key}}`, value)
        }
      }
    }
    
    // Send SMS via Twilio
    const twilioResponse = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${Deno.env.get('TWILIO_ACCOUNT_SID')}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${Deno.env.get('TWILIO_ACCOUNT_SID')}:${Deno.env.get('TWILIO_AUTH_TOKEN')}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          From: Deno.env.get('TWILIO_CALLER_ID'),
          To: to,
          Body: finalMessage,
          MessagingServiceSid: Deno.env.get('TWILIO_MESSAGING_SERVICE_SID')
        })
      }
    )
    
    const result = await twilioResponse.json()
    
    // Log communication
    await supabase.from('communication_logs').insert({
      user_id: req.headers.get('user-id'),
      communication_type: 'sms',
      direction: 'outbound',
      from_number: Deno.env.get('TWILIO_CALLER_ID'),
      to_number: to,
      message_sid: result.sid,
      status: result.status,
      content: finalMessage,
      metadata: { persona, templateName, variables }
    })
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    console.error('SMS Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
```

### 2. Voice Call Function
```typescript
// supabase/functions/twilio-voice/index.ts
serve(async (req) => {
  try {
    const { to, twimlUrl, persona, callType } = await req.json()
    
    // Initiate call
    const callResponse = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${Deno.env.get('TWILIO_ACCOUNT_SID')}/Calls.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${Deno.env.get('TWILIO_ACCOUNT_SID')}:${Deno.env.get('TWILIO_AUTH_TOKEN')}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          From: Deno.env.get('TWILIO_CALLER_ID'),
          To: to,
          Url: twimlUrl || `${Deno.env.get('SUPABASE_URL')}/functions/v1/twilio-twiml?persona=${persona}&type=${callType}`
        })
      }
    )
    
    const result = await callResponse.json()
    
    // Log call
    await supabase.from('communication_logs').insert({
      user_id: req.headers.get('user-id'),
      communication_type: 'voice',
      direction: 'outbound',
      from_number: Deno.env.get('TWILIO_CALLER_ID'),
      to_number: to,
      call_sid: result.sid,
      status: result.status,
      metadata: { persona, callType }
    })
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
```

### 3. TwiML Generation
```typescript
// supabase/functions/twilio-twiml/index.ts
serve(async (req) => {
  const url = new URL(req.url)
  const persona = url.searchParams.get('persona')
  const type = url.searchParams.get('type')
  
  let twiml = ''
  
  switch (persona) {
    case 'advisor':
      if (type === 'emergency') {
        twiml = `
          <Response>
            <Say voice="alice">This is an emergency portfolio alert. Please hold while we connect you to your advisor.</Say>
            <Dial timeout="30">
              <Number url="/functions/v1/twilio-call-screening">+1-555-ADVISOR</Number>
            </Dial>
            <Say>Your advisor is not available. You will receive a callback within 15 minutes.</Say>
          </Response>
        `
      } else {
        twiml = `
          <Response>
            <Gather action="/functions/v1/twilio-menu-handler" method="POST" numDigits="1">
              <Say voice="alice">Thank you for calling. Press 1 for appointments, 2 for account questions, 3 for emergencies.</Say>
            </Gather>
          </Response>
        `
      }
      break
      
    case 'attorney':
      twiml = `
        <Response>
          <Gather action="/functions/v1/twilio-legal-menu" method="POST" numDigits="1">
            <Say voice="alice">Thank you for calling our law office. Press 1 for case updates, 2 for new matters, 3 for document signing, 0 for operator.</Say>
          </Gather>
        </Response>
      `
      break
      
    case 'accountant':
      twiml = `
        <Response>
          <Gather action="/functions/v1/twilio-tax-menu" method="POST" numDigits="1">
            <Say voice="alice">Thank you for calling. Press 1 for tax questions, 2 for document status, 3 for appointments, 9 for emergencies.</Say>
          </Gather>
        </Response>
      `
      break
  }
  
  return new Response(twiml, {
    headers: { 'Content-Type': 'text/xml' }
  })
})
```

### 4. Webhook Handler
```typescript
// supabase/functions/twilio-webhook/index.ts
serve(async (req) => {
  try {
    const formData = await req.formData()
    const messageSid = formData.get('MessageSid')
    const callSid = formData.get('CallSid')
    const messageStatus = formData.get('MessageStatus')
    const callStatus = formData.get('CallStatus')
    const callDuration = formData.get('CallDuration')
    
    // Update communication log
    if (messageSid) {
      await supabase
        .from('communication_logs')
        .update({ 
          status: messageStatus,
          completed_at: ['delivered', 'sent', 'received'].includes(messageStatus) ? new Date().toISOString() : null
        })
        .eq('message_sid', messageSid)
    }
    
    if (callSid) {
      await supabase
        .from('communication_logs')
        .update({ 
          status: callStatus,
          duration_seconds: parseInt(callDuration) || 0,
          completed_at: ['completed', 'busy', 'no-answer', 'canceled', 'failed'].includes(callStatus) ? new Date().toISOString() : null
        })
        .eq('call_sid', callSid)
    }
    
    return new Response('OK', { status: 200 })
    
  } catch (error) {
    console.error('Webhook Error:', error)
    return new Response('Error', { status: 400 })
  }
})
```

## Frontend Integration

### React Hook
```typescript
// src/hooks/useTwilio.ts
export const useTwilio = () => {
  const sendSMS = async (to: string, message: string, templateName?: string, variables?: Record<string, string>) => {
    const { data, error } = await supabase.functions.invoke('twilio-sms', {
      body: { to, message, templateName, variables }
    })
    
    if (error) throw error
    return data
  }
  
  const makeCall = async (to: string, callType: string = 'general') => {
    const { data, error } = await supabase.functions.invoke('twilio-voice', {
      body: { to, callType }
    })
    
    if (error) throw error
    return data
  }
  
  const getCommunicationHistory = async (userId?: string) => {
    let query = supabase
      .from('communication_logs')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (userId) {
      query = query.eq('user_id', userId)
    }
    
    const { data } = await query
    return data
  }
  
  return { sendSMS, makeCall, getCommunicationHistory }
}
```

### Communication Panel Component
```typescript
// src/components/communications/CommunicationPanel.tsx
export const CommunicationPanel = ({ clientId, persona }) => {
  const { sendSMS, makeCall, getCommunicationHistory } = useTwilio()
  const [history, setHistory] = useState([])
  const [message, setMessage] = useState('')
  
  useEffect(() => {
    loadCommunicationHistory()
  }, [clientId])
  
  const loadCommunicationHistory = async () => {
    const data = await getCommunicationHistory(clientId)
    setHistory(data)
  }
  
  const handleSendSMS = async () => {
    try {
      await sendSMS(client.phone, message)
      toast.success('SMS sent successfully')
      setMessage('')
      loadCommunicationHistory()
    } catch (error) {
      toast.error('Failed to send SMS')
    }
  }
  
  const handleCall = async () => {
    try {
      await makeCall(client.phone, 'general')
      toast.success('Call initiated')
    } catch (error) {
      toast.error('Failed to initiate call')
    }
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Communications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Send SMS */}
        <div className="space-y-2">
          <Label>Send SMS</Label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message..."
          />
          <div className="flex space-x-2">
            <Button onClick={handleSendSMS}>Send SMS</Button>
            <Button variant="outline" onClick={handleCall}>Call</Button>
          </div>
        </div>
        
        {/* Communication History */}
        <div className="space-y-2">
          <Label>Recent Communications</Label>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {history.map((comm) => (
              <div key={comm.id} className="p-2 border rounded">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{comm.communication_type.toUpperCase()}</span>
                  <span className="text-muted-foreground">
                    {new Date(comm.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm mt-1">{comm.content}</p>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{comm.direction}</span>
                  <span className={`px-1 rounded ${
                    comm.status === 'delivered' ? 'bg-green-100' : 'bg-yellow-100'
                  }`}>
                    {comm.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

## Testing & Demo Mode

### Test Configuration
```typescript
// Use Twilio test credentials
const TEST_CONFIG = {
  accountSid: 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  authToken: 'test_auth_token',
  testPhoneNumbers: ['+15005550006'], // Magic numbers for testing
  messagingServiceSid: 'MGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
}
```

### Test Scenarios
1. **SMS delivery and status updates**
2. **Voice call connection and IVR navigation**
3. **Webhook event processing**
4. **Error handling and retries**
5. **Cost tracking and limits**

## Security & Compliance

### Security Measures
- Validate webhook signatures
- Rate limit API endpoints
- Encrypt stored communications
- Implement access controls

### Compliance Considerations
- TCPA compliance for automated calls/texts
- Opt-out mechanisms for SMS
- Call recording disclosures
- Data retention policies

## Monitoring & Analytics

### Key Metrics
- Message delivery rates
- Call completion rates
- Response times
- Cost per communication
- User engagement rates

### Cost Management
```typescript
// Track communication costs
const trackCommunicationCost = async (messageSid: string) => {
  const cost = await getTwilioCost(messageSid)
  await supabase
    .from('communication_logs')
    .update({ cost_cents: cost })
    .eq('message_sid', messageSid)
}
```