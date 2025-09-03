# 🔌 Integration Guides - Family Office Marketplace

## Overview
This document provides comprehensive integration guides for all external services, APIs, and partner systems used in the Family Office Marketplace.

## 🏦 Supabase Integration

### Database Configuration
```sql
-- Core tables with RLS policies
-- User management
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'client',
  tenant_id UUID REFERENCES public.tenants(id)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Example policy
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);
```

### Edge Functions Setup
```typescript
// supabase/functions/leads-invite/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { email, advisorId } = await req.json()
  
  // Generate magic link token
  const token = crypto.randomUUID()
  
  // Store invitation
  const { error } = await supabase
    .from('prospect_invitations')
    .insert({
      email,
      advisor_id: advisorId,
      token,
      expires_at: new Date(Date.now() + 24*60*60*1000) // 24 hours
    })
  
  if (error) throw error
  
  // Send email via Resend
  await sendInviteEmail(email, token)
  
  return new Response(JSON.stringify({ success: true }))
})
```

### Authentication Flow
```typescript
// Client-side authentication
import { supabase } from '@/integrations/supabase/client'

// Magic link invite handling
export async function handleInviteLink(token: string) {
  const { data, error } = await supabase
    .from('prospect_invitations')
    .select('*')
    .eq('token', token)
    .single()
  
  if (error || !data) {
    throw new Error('Invalid or expired invitation')
  }
  
  // Proceed with signup flow
  return data
}
```

---

## 💳 Stripe Integration

### Webhook Configuration
```typescript
// supabase/functions/stripe-webhook/index.ts
import Stripe from 'https://esm.sh/stripe@13.11.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!)

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')!
  const body = await req.text()
  
  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    Deno.env.get('STRIPE_WEBHOOK_SECRET')!
  )
  
  switch (event.type) {
    case 'customer.subscription.created':
      await handleSubscriptionCreated(event.data.object)
      break
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object)
      break
    case 'invoice.payment_succeeded':
      await handlePaymentSucceeded(event.data.object)
      break
  }
  
  return new Response('OK')
})
```

### Client Integration
```typescript
// hooks/useStripePortal.ts
import { loadStripe } from '@stripe/stripe-js'

export function useStripePortal() {
  const openPortal = async () => {
    const { data } = await supabase.functions.invoke('create-portal-session', {
      body: { return_url: window.location.origin }
    })
    
    if (data?.url) {
      window.location.href = data.url
    }
  }
  
  return { openPortal }
}
```

---

## 🏛️ Plaid Integration

### Account Linking
```typescript
// components/PlaidLink.tsx
import { usePlaidLink } from 'react-plaid-link'

export function PlaidLinkComponent() {
  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (public_token, metadata) => {
      // Exchange public token for access token
      const { data } = await supabase.functions.invoke('plaid-exchange', {
        body: { 
          public_token, 
          institution: metadata.institution,
          accounts: metadata.accounts 
        }
      })
      
      // Store account information
      await saveAccountData(data)
    }
  })
  
  return (
    <Button onClick={() => open()} disabled={!ready}>
      Connect Bank Account
    </Button>
  )
}
```

### Transaction Sync
```typescript
// supabase/functions/plaid-sync/index.ts
serve(async (req) => {
  const { access_token, cursor } = await req.json()
  
  // Fetch transactions from Plaid
  const response = await plaidClient.transactionsSync({
    access_token,
    cursor,
    count: 100
  })
  
  // Store transactions in database
  for (const transaction of response.added) {
    await supabase.from('transactions').insert({
      account_id: transaction.account_id,
      amount: transaction.amount,
      date: transaction.date,
      merchant_name: transaction.merchant_name,
      category: transaction.category
    })
  }
  
  return new Response(JSON.stringify({ 
    next_cursor: response.next_cursor 
  }))
})
```

---

## 📧 Resend Email Integration

### Email Templates
```typescript
// lib/emailTemplates.ts
export const INVITE_TEMPLATE = {
  subject: 'You\'re invited to join the Family Office Marketplace',
  html: `
    <h1>Welcome to the Family Office Marketplace</h1>
    <p>You've been invited by your advisor to join our platform.</p>
    <a href="{{invite_link}}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
      Accept Invitation
    </a>
    <p>This invitation expires in 24 hours.</p>
  `
}
```

### Sending Function
```typescript
// supabase/functions/send-email/index.ts
import { Resend } from 'https://esm.sh/resend@2.0.0'

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

serve(async (req) => {
  const { to, template, variables } = await req.json()
  
  const emailContent = INVITE_TEMPLATE.html.replace(
    /\{\{(\w+)\}\}/g, 
    (match, key) => variables[key] || match
  )
  
  const { data, error } = await resend.emails.send({
    from: 'noreply@mybfocfo.com',
    to,
    subject: INVITE_TEMPLATE.subject,
    html: emailContent
  })
  
  if (error) throw error
  
  return new Response(JSON.stringify(data))
})
```

---

## 📊 PostHog Analytics Integration

### Event Tracking
```typescript
// lib/analytics.ts
import posthog from 'posthog-js'

class Analytics {
  init() {
    posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
      api_host: import.meta.env.VITE_POSTHOG_HOST,
      capture_pageview: true,
      capture_pageleave: true
    })
  }
  
  track(event: string, properties?: Record<string, any>) {
    posthog.capture(event, {
      ...properties,
      timestamp: new Date().toISOString(),
      user_role: getCurrentUserRole(),
      tenant_id: getCurrentTenantId()
    })
  }
  
  identify(userId: string, traits?: Record<string, any>) {
    posthog.identify(userId, traits)
  }
}

export const analytics = new Analytics()
```

### Custom Events
```typescript
// Track specific business events
export const ANALYTICS_EVENTS = {
  // User onboarding
  ONBOARDING_STARTED: 'onboarding_started',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  
  // Document management
  DOCUMENT_UPLOADED: 'document_uploaded',
  DOCUMENT_SHARED: 'document_shared',
  
  // Financial tools
  CALCULATOR_USED: 'calculator_used',
  PORTFOLIO_ANALYZED: 'portfolio_analyzed',
  
  // Advisor actions
  CLIENT_INVITED: 'client_invited',
  MEETING_SCHEDULED: 'meeting_scheduled'
}
```

---

## 🔗 Partner API Integrations

### Advyzon CRM Sync
```typescript
// lib/advyzonIntegration.ts
export class AdvyzonIntegration {
  private apiKey: string
  private baseUrl = 'https://api.advyzon.com/v1'
  
  async syncClient(clientData: ClientData) {
    const response = await fetch(`${this.baseUrl}/clients`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        first_name: clientData.firstName,
        last_name: clientData.lastName,
        email: clientData.email,
        phone: clientData.phone,
        custom_fields: {
          fom_client_id: clientData.id,
          onboarding_status: clientData.onboardingStatus
        }
      })
    })
    
    return response.json()
  }
  
  async getPortfolioData(clientId: string) {
    const response = await fetch(`${this.baseUrl}/clients/${clientId}/portfolios`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    })
    
    return response.json()
  }
}
```

### Charles Schwab Integration (Framework)
```typescript
// lib/schwabIntegration.ts
export class SchwabIntegration {
  private accessToken: string
  private baseUrl = 'https://api.schwabapi.com/marketdata/v1'
  
  async getAccountPositions(accountNumber: string) {
    // OAuth 2.0 authentication flow
    const response = await fetch(`${this.baseUrl}/accounts/${accountNumber}/positions`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Accept': 'application/json'
      }
    })
    
    return response.json()
  }
  
  async getAccountBalances(accountNumber: string) {
    const response = await fetch(`${this.baseUrl}/accounts/${accountNumber}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`
      }
    })
    
    return response.json()
  }
}
```

---

## 🔒 Security Integration

### Vault Secret Management
```typescript
// lib/secretManager.ts
export async function getSecret(secretName: string): Promise<string> {
  const { data, error } = await supabase.rpc('secure_get_secret', {
    secret_name: secretName
  })
  
  if (error) throw new Error(`Failed to retrieve secret: ${error.message}`)
  
  return data
}

export async function setSecret(secretName: string, secretValue: string): Promise<void> {
  const { error } = await supabase.rpc('secure_create_secret', {
    new_secret: secretValue,
    new_name: secretName
  })
  
  if (error) throw new Error(`Failed to store secret: ${error.message}`)
}
```

### Audit Logging
```typescript
// lib/auditLogger.ts
export async function logSecurityEvent(
  eventType: string,
  severity: 'info' | 'warning' | 'critical',
  details: Record<string, any>
) {
  await supabase.from('security_audit_logs').insert({
    event_type: eventType,
    severity,
    details,
    user_id: auth.user()?.id,
    tenant_id: getCurrentTenantId(),
    created_at: new Date().toISOString()
  })
}
```

---

## 🧪 Testing Integration

### Demo Data Service
```typescript
// services/demoService.ts
export class DemoService {
  async loadAllFixtures() {
    const [familyData, advisorData, healthcareData, k401Data] = await Promise.all([
      this.getFamilyData(),
      this.getAdvisorData(),
      this.getHealthcareData(),
      this.getK401Data()
    ])
    
    return {
      families: familyData,
      advisors: advisorData,
      healthcare: healthcareData,
      k401: k401Data
    }
  }
  
  async mockNetworkCall<T>(endpoint: string, fallbackData?: T): Promise<T> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 800))
    
    // Route to appropriate demo data
    if (endpoint.includes('/families')) {
      return (await this.getFamilyData()) as T
    }
    
    return fallbackData || { success: true, data: null } as T
  }
}
```

---

## 📋 Integration Checklist

### Pre-Production Setup
- [ ] **Supabase**: All tables created with RLS policies
- [ ] **Stripe**: Webhook endpoints configured
- [ ] **Plaid**: Production credentials obtained
- [ ] **Resend**: Domain verification completed
- [ ] **PostHog**: Event tracking implemented
- [ ] **Security**: Vault secrets configured

### Production Deployment
- [ ] **Environment Variables**: All secrets configured
- [ ] **DNS Configuration**: Domain pointing to Lovable
- [ ] **SSL Certificates**: HTTPS enabled
- [ ] **Monitoring**: Error tracking active
- [ ] **Backup**: Data backup procedures in place

### Post-Launch Monitoring
- [ ] **API Health Checks**: All integrations responding
- [ ] **Error Rates**: Below 1% threshold
- [ ] **Performance**: Response times under 2 seconds
- [ ] **Analytics**: Event tracking functioning
- [ ] **User Feedback**: Support channels monitored

---

## 📞 Support & Troubleshooting

### Common Issues
1. **Stripe Webhook Failures**: Check endpoint URL and secret configuration
2. **Plaid Link Errors**: Verify client ID and environment settings
3. **Email Delivery Issues**: Check Resend domain verification
4. **Authentication Problems**: Verify Supabase URL and keys

### Monitoring Dashboards
- **Supabase**: [Dashboard Link](https://supabase.com/dashboard/project/xcmqjkvyvuhoslbzmlgi)
- **Stripe**: [Dashboard Link](https://dashboard.stripe.com)
- **PostHog**: [Analytics Dashboard](https://app.posthog.com)
- **Resend**: [Email Dashboard](https://resend.com/dashboard)

### Contact Information
- **Technical Support**: Monitor respective service dashboards
- **Integration Issues**: Check logs in Supabase Edge Functions
- **Emergency Escalation**: Use in-app support system