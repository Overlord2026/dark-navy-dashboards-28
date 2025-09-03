# DocuSign Integration Guide

## Overview
Complete DocuSign integration for e-signature workflows across all personas in the BFO platform.

## Architecture

### Core Components
```typescript
// Edge Function Structure
supabase/functions/
├── docusign-auth/          # OAuth authentication
├── docusign-envelope/      # Create & send envelopes
├── docusign-webhook/       # Status callbacks
└── docusign-status/        # Envelope tracking
```

### Database Schema
```sql
-- Document signing tracking
CREATE TABLE public.document_signatures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  document_id UUID REFERENCES public.documents(id),
  envelope_id TEXT UNIQUE, -- DocuSign envelope ID
  status TEXT CHECK (status IN ('sent', 'delivered', 'signed', 'completed', 'declined', 'voided')),
  signer_email TEXT NOT NULL,
  signer_name TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT now(),
  signed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  webhook_events JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}'
);
```

## Persona-Specific Workflows

### 1. Estate Planning Attorney
**Use Case**: Trust documents, wills, power of attorney
```typescript
const estateDocumentFlow = {
  triggers: ['trust_created', 'will_drafted', 'poa_prepared'],
  recipients: ['client', 'spouse', 'witnesses'],
  workflow: 'sequential_signing',
  notifications: 'attorney_cc'
};
```

### 2. Financial Advisor
**Use Case**: Investment agreements, fee schedules
```typescript
const advisorDocumentFlow = {
  triggers: ['client_onboarding', 'agreement_update'],
  recipients: ['client', 'advisor'],
  workflow: 'parallel_signing',
  notifications: 'compliance_cc'
};
```

### 3. CPA/Accountant
**Use Case**: Engagement letters, tax representation
```typescript
const cpaDocumentFlow = {
  triggers: ['engagement_start', 'representation_auth'],
  recipients: ['client', 'preparer'],
  workflow: 'sequential_signing',
  notifications: 'manager_review'
};
```

## Implementation

### 1. Environment Configuration
```env
# DocuSign API Configuration
DOCUSIGN_INTEGRATION_KEY=your_integration_key
DOCUSIGN_CLIENT_SECRET=your_client_secret
DOCUSIGN_ACCOUNT_ID=your_account_id
DOCUSIGN_BASE_URL=https://demo.docusign.net # or https://www.docusign.net for production
DOCUSIGN_OAUTH_BASE_URL=https://account-d.docusign.com # or https://account.docusign.com

# Webhook Configuration
DOCUSIGN_WEBHOOK_URL=https://xcmqjkvyvuhoslbzmlgi.functions.supabase.co/docusign-webhook
DOCUSIGN_WEBHOOK_SECRET=your_webhook_secret
```

### 2. Authentication Flow
```typescript
// supabase/functions/docusign-auth/index.ts
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
    const { action } = await req.json()
    
    if (action === 'get_auth_url') {
      const authUrl = `${Deno.env.get('DOCUSIGN_OAUTH_BASE_URL')}/oauth/auth?` +
        `response_type=code&` +
        `scope=signature impersonation&` +
        `client_id=${Deno.env.get('DOCUSIGN_INTEGRATION_KEY')}&` +
        `redirect_uri=${encodeURIComponent('your_redirect_uri')}`
      
      return new Response(JSON.stringify({ authUrl }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
    if (action === 'exchange_code') {
      const { code } = await req.json()
      // Exchange authorization code for access token
      const tokenResponse = await fetch(`${Deno.env.get('DOCUSIGN_OAUTH_BASE_URL')}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${Deno.env.get('DOCUSIGN_INTEGRATION_KEY')}:${Deno.env.get('DOCUSIGN_CLIENT_SECRET')}`)}`
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code
        })
      })
      
      const tokens = await tokenResponse.json()
      return new Response(JSON.stringify(tokens), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
```

### 3. Envelope Creation
```typescript
// supabase/functions/docusign-envelope/index.ts
export const createEnvelope = async (documentData: {
  documentId: string,
  signers: Array<{email: string, name: string, recipientId: string}>,
  templateId?: string,
  customFields?: Record<string, any>
}) => {
  const envelopeDefinition = {
    emailSubject: 'Please sign this document',
    documents: [{
      documentId: '1',
      name: 'Document',
      documentBase64: documentData.documentBase64,
      fileExtension: 'pdf'
    }],
    recipients: {
      signers: documentData.signers.map((signer, index) => ({
        email: signer.email,
        name: signer.name,
        recipientId: signer.recipientId,
        tabs: {
          signHereTabs: [{
            documentId: '1',
            pageNumber: '1',
            xPosition: '100',
            yPosition: '100'
          }]
        }
      }))
    },
    status: 'sent'
  }
  
  const response = await fetch(`${Deno.env.get('DOCUSIGN_BASE_URL')}/restapi/v2.1/accounts/${Deno.env.get('DOCUSIGN_ACCOUNT_ID')}/envelopes`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(envelopeDefinition)
  })
  
  return await response.json()
}
```

### 4. Webhook Handler
```typescript
// supabase/functions/docusign-webhook/index.ts
serve(async (req) => {
  try {
    const webhook = await req.json()
    
    // Verify webhook signature
    const expectedSignature = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(JSON.stringify(webhook) + Deno.env.get('DOCUSIGN_WEBHOOK_SECRET'))
    )
    
    // Update signature status in database
    const { data, error } = await supabase
      .from('document_signatures')
      .update({
        status: webhook.status,
        signed_at: webhook.status === 'signed' ? new Date().toISOString() : null,
        completed_at: webhook.status === 'completed' ? new Date().toISOString() : null,
        webhook_events: supabase.raw('webhook_events || ?', [webhook])
      })
      .eq('envelope_id', webhook.envelopeId)
    
    // Trigger notifications based on status
    if (webhook.status === 'completed') {
      // Notify relevant parties
      await supabase.functions.invoke('send-notification', {
        body: {
          type: 'document_signed',
          envelopeId: webhook.envelopeId,
          recipients: ['attorney', 'client']
        }
      })
    }
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400
    })
  }
})
```

## Frontend Integration

### React Hook
```typescript
// src/hooks/useDocuSign.ts
export const useDocuSign = () => {
  const sendForSignature = async (documentId: string, signers: Signer[]) => {
    const { data, error } = await supabase.functions.invoke('docusign-envelope', {
      body: {
        documentId,
        signers,
        templateId: 'optional_template_id'
      }
    })
    
    if (error) throw error
    return data
  }
  
  const getSignatureStatus = async (envelopeId: string) => {
    const { data } = await supabase
      .from('document_signatures')
      .select('*')
      .eq('envelope_id', envelopeId)
      .single()
    
    return data
  }
  
  return { sendForSignature, getSignatureStatus }
}
```

### Component Example
```typescript
// src/components/legal/DocumentSigningModal.tsx
export const DocumentSigningModal = ({ document, isOpen, onClose }) => {
  const { sendForSignature } = useDocuSign()
  const [signers, setSigners] = useState([])
  
  const handleSendForSignature = async () => {
    try {
      const result = await sendForSignature(document.id, signers)
      toast.success('Document sent for signature!')
      onClose()
    } catch (error) {
      toast.error('Failed to send document')
    }
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Document for Signature</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Signer input fields */}
          {signers.map((signer, index) => (
            <div key={index} className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Signer Name"
                value={signer.name}
                onChange={(e) => updateSigner(index, 'name', e.target.value)}
              />
              <Input
                placeholder="Email Address"
                type="email"
                value={signer.email}
                onChange={(e) => updateSigner(index, 'email', e.target.value)}
              />
            </div>
          ))}
          
          <Button onClick={() => addSigner()}>Add Signer</Button>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSendForSignature}>Send for Signature</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

## Testing

### Demo Mode
```typescript
// Use DocuSign demo environment for testing
const DEMO_CONFIG = {
  baseUrl: 'https://demo.docusign.net',
  oauthUrl: 'https://account-d.docusign.com',
  testAccountId: 'demo_account_id'
}
```

### Test Scenarios
1. **Document Creation & Sending**
2. **Multiple Signer Workflows**
3. **Template-based Documents**
4. **Webhook Event Processing**
5. **Error Handling & Retries**

## Security Considerations

### Token Management
- Store access tokens securely in Supabase
- Implement token refresh logic
- Use least-privilege OAuth scopes

### Webhook Security
- Verify webhook signatures
- Implement replay attack protection
- Rate limit webhook endpoints

### Data Protection
- Encrypt sensitive document data
- Audit all signature activities
- Implement data retention policies

## Monitoring & Analytics

### Key Metrics
- Envelope creation success rate
- Signature completion time
- Error rates by persona type
- Webhook delivery reliability

### Logging
```typescript
// Log all DocuSign operations
const auditLog = {
  operation: 'envelope_created',
  envelopeId: envelope.envelopeId,
  userId: auth.uid(),
  persona: userPersona,
  timestamp: new Date().toISOString(),
  metadata: {
    documentType: document.type,
    signerCount: signers.length
  }
}
```

## Error Handling

### Common Error Scenarios
1. **Invalid recipient email**
2. **Document format issues**
3. **Template not found**
4. **Account limits exceeded**
5. **Network timeouts**

### Recovery Strategies
- Automatic retry with exponential backoff
- Fallback to manual document handling
- User notification with next steps
- Administrative alerts for system issues