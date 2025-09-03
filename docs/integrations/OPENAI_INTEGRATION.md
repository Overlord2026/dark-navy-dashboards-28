# OpenAI Integration Guide

## Overview
Comprehensive OpenAI integration for AI-powered features across all BFO personas, including document analysis, client communication assistance, and automated insights.

## Architecture

### Core Functions
```typescript
supabase/functions/
├── openai-chat/            # GPT conversations
├── openai-analysis/        # Document & data analysis
├── openai-assistant/       # Persona-specific assistants
├── openai-embeddings/      # Vector search & semantic matching
└── openai-moderation/      # Content safety & compliance
```

### Database Schema
```sql
-- AI interaction tracking
CREATE TABLE public.ai_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  persona_type TEXT NOT NULL,
  interaction_type TEXT CHECK (interaction_type IN ('chat', 'analysis', 'generation', 'moderation')),
  prompt TEXT NOT NULL,
  response TEXT,
  model_used TEXT NOT NULL,
  tokens_used INTEGER,
  cost_cents INTEGER,
  status TEXT CHECK (status IN ('pending', 'completed', 'failed', 'moderated')),
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'
);

-- AI-generated content
CREATE TABLE public.ai_generated_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  content_type TEXT NOT NULL, -- 'email', 'document', 'summary', 'recommendation'
  title TEXT,
  content TEXT NOT NULL,
  source_data JSONB,
  ai_model TEXT NOT NULL,
  confidence_score DECIMAL(3,2),
  reviewed_by UUID REFERENCES auth.users(id),
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## Persona-Specific AI Features

### 1. Financial Advisor AI Assistant
```typescript
const advisorAI = {
  features: {
    portfolioAnalysis: 'Analyze client portfolios and suggest optimizations',
    marketInsights: 'Generate market commentary and client communications',
    meetingPrep: 'Prepare personalized talking points for client meetings',
    riskAssessment: 'Evaluate client risk tolerance and investment suitability',
    complianceCheck: 'Review communications for regulatory compliance'
  },
  prompts: {
    portfolioAnalysis: `
      Analyze the following client portfolio data:
      {portfolio_data}
      
      Provide insights on:
      1. Asset allocation analysis
      2. Risk assessment
      3. Performance evaluation
      4. Rebalancing recommendations
      5. Tax optimization opportunities
      
      Consider the client's profile:
      - Age: {age}
      - Risk Tolerance: {risk_tolerance}
      - Investment Goals: {goals}
      - Time Horizon: {time_horizon}
    `,
    meetingPrep: `
      Prepare talking points for a client meeting with the following context:
      
      Client Profile: {client_profile}
      Recent Portfolio Performance: {performance_data}
      Market Conditions: {market_data}
      Client Concerns: {concerns}
      
      Generate:
      1. Key discussion topics
      2. Performance explanations
      3. Recommended actions
      4. Questions to ask the client
    `
  }
}
```

### 2. Legal AI Assistant
```typescript
const legalAI = {
  features: {
    documentDrafting: 'Generate legal document templates and clauses',
    caseResearch: 'Summarize relevant case law and statutes',
    contractReview: 'Analyze contracts for potential issues',
    clientCommunication: 'Draft client letters and status updates',
    complianceMonitoring: 'Check documents for regulatory compliance'
  },
  prompts: {
    documentDrafting: `
      Draft a {document_type} with the following parameters:
      
      Jurisdiction: {jurisdiction}
      Parties: {parties}
      Key Terms: {terms}
      Special Provisions: {provisions}
      
      Ensure compliance with:
      - Local regulations
      - Bar association guidelines
      - Best practices for {practice_area}
    `,
    contractReview: `
      Review the following contract for potential issues:
      
      {contract_text}
      
      Analyze for:
      1. Unfavorable terms
      2. Missing clauses
      3. Ambiguous language
      4. Compliance issues
      5. Risk factors
      
      Provide recommendations for improvements.
    `
  }
}
```

### 3. CPA/Accounting AI Assistant
```typescript
const cpaAI = {
  features: {
    taxOptimization: 'Identify tax-saving opportunities',
    documentAnalysis: 'Extract data from financial documents',
    auditPrep: 'Prepare audit documentation and explanations',
    clientAdvisory: 'Generate business advisory insights',
    complianceCheck: 'Verify tax compliance and regulations'
  },
  prompts: {
    taxOptimization: `
      Analyze the following client tax situation:
      
      Income: {income_data}
      Deductions: {deductions}
      Credits: {credits}
      Business Structure: {entity_type}
      Filing Status: {filing_status}
      
      Identify opportunities for:
      1. Tax reduction strategies
      2. Timing optimizations
      3. Deduction maximization
      4. Credit utilization
      5. Future year planning
    `,
    auditPrep: `
      Prepare audit documentation for:
      
      Account: {account_name}
      Balance: {balance}
      Transactions: {transaction_summary}
      Supporting Docs: {document_list}
      
      Generate:
      1. Account analysis
      2. Risk assessment
      3. Testing procedures
      4. Expected findings
      5. Documentation requirements
    `
  }
}
```

## Implementation

### 1. OpenAI Chat Function
```typescript
// supabase/functions/openai-chat/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { messages, persona, context, model = 'gpt-4o-mini' } = await req.json()
    
    // Get persona-specific system prompt
    const systemPrompt = getPersonaSystemPrompt(persona)
    
    // Prepare messages with context
    const chatMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ]
    
    // Add context if provided
    if (context) {
      chatMessages.splice(-1, 0, {
        role: 'system',
        content: `Additional context: ${JSON.stringify(context)}`
      })
    }
    
    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        messages: chatMessages,
        temperature: 0.7,
        max_tokens: 1500,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      })
    })
    
    const result = await openaiResponse.json()
    
    if (!openaiResponse.ok) {
      throw new Error(result.error?.message || 'OpenAI API error')
    }
    
    // Log interaction
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )
    
    await supabase.from('ai_interactions').insert({
      user_id: req.headers.get('user-id'),
      persona_type: persona,
      interaction_type: 'chat',
      prompt: messages[messages.length - 1].content,
      response: result.choices[0].message.content,
      model_used: model,
      tokens_used: result.usage.total_tokens,
      cost_cents: calculateCost(model, result.usage.total_tokens),
      status: 'completed',
      completed_at: new Date().toISOString(),
      metadata: { context, messageCount: messages.length }
    })
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    console.error('OpenAI Chat Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

function getPersonaSystemPrompt(persona: string): string {
  const prompts = {
    advisor: `You are an expert financial advisor with deep knowledge of investment strategies, portfolio management, and financial planning. You provide clear, actionable advice while maintaining regulatory compliance. Always consider the client's risk tolerance, time horizon, and financial goals. Be professional but approachable.`,
    
    attorney: `You are an experienced attorney with expertise in estate planning, business law, and legal document preparation. You provide accurate legal guidance while noting when formal legal advice is required. Always emphasize the importance of compliance with local laws and regulations. Be precise and thorough.`,
    
    accountant: `You are a certified public accountant with expertise in tax planning, financial analysis, and business advisory services. You provide clear explanations of complex financial concepts and identify optimization opportunities. Always consider tax implications and regulatory requirements. Be detail-oriented and practical.`,
    
    family: `You are a family office advisor helping high-net-worth families manage their wealth across generations. You understand complex family dynamics, trust structures, and multi-generational planning. Focus on comprehensive wealth management and family governance. Be discrete and sophisticated.`
  }
  
  return prompts[persona] || prompts.family
}

function calculateCost(model: string, tokens: number): number {
  // OpenAI pricing per 1K tokens (in cents)
  const pricing = {
    'gpt-4o': { input: 0.25, output: 1.25 },
    'gpt-4o-mini': { input: 0.015, output: 0.06 },
    'gpt-4-turbo': { input: 1.0, output: 3.0 },
    'gpt-3.5-turbo': { input: 0.05, output: 0.15 }
  }
  
  const rate = pricing[model] || pricing['gpt-4o-mini']
  return Math.ceil((tokens / 1000) * ((rate.input + rate.output) / 2))
}
```

### 2. Document Analysis Function
```typescript
// supabase/functions/openai-analysis/index.ts
serve(async (req) => {
  try {
    const { documentContent, analysisType, persona, parameters } = await req.json()
    
    const analysisPrompts = {
      portfolio_analysis: `Analyze this portfolio data and provide insights on asset allocation, risk, and recommendations: ${documentContent}`,
      contract_review: `Review this contract for potential issues, unfavorable terms, and recommendations: ${documentContent}`,
      tax_optimization: `Analyze this tax document for optimization opportunities and compliance issues: ${documentContent}`,
      estate_planning: `Review this estate planning document for completeness and recommendations: ${documentContent}`,
      financial_statement: `Analyze this financial statement for key insights and recommendations: ${documentContent}`
    }
    
    const prompt = analysisPrompts[analysisType] || `Analyze this document: ${documentContent}`
    
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: getPersonaSystemPrompt(persona) },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3, // Lower temperature for analysis
        max_tokens: 2000
      })
    })
    
    const result = await openaiResponse.json()
    
    // Store analysis result
    await supabase.from('ai_generated_content').insert({
      user_id: req.headers.get('user-id'),
      content_type: analysisType,
      title: `${analysisType.replace('_', ' ')} Analysis`,
      content: result.choices[0].message.content,
      source_data: { documentContent, parameters },
      ai_model: 'gpt-4o',
      confidence_score: 0.85 // Could be calculated based on response quality
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

### 3. Content Generation Function
```typescript
// supabase/functions/openai-generation/index.ts
serve(async (req) => {
  try {
    const { contentType, parameters, persona, template } = await req.json()
    
    const generationPrompts = {
      client_email: generateClientEmailPrompt(parameters),
      meeting_summary: generateMeetingSummaryPrompt(parameters),
      document_template: generateDocumentTemplatePrompt(parameters),
      market_commentary: generateMarketCommentaryPrompt(parameters),
      tax_memo: generateTaxMemoPrompt(parameters)
    }
    
    const prompt = generationPrompts[contentType] || template
    
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: getPersonaSystemPrompt(persona) },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1500
      })
    })
    
    const result = await openaiResponse.json()
    
    // Store generated content for review
    await supabase.from('ai_generated_content').insert({
      user_id: req.headers.get('user-id'),
      content_type: contentType,
      title: parameters.title || `Generated ${contentType}`,
      content: result.choices[0].message.content,
      source_data: parameters,
      ai_model: 'gpt-4o',
      confidence_score: 0.80,
      approved: false // Requires human review
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

function generateClientEmailPrompt(params: any): string {
  return `
    Write a professional email to a client with the following details:
    
    Client Name: ${params.clientName}
    Subject: ${params.subject}
    Context: ${params.context}
    Key Points: ${params.keyPoints.join(', ')}
    Tone: ${params.tone || 'professional and friendly'}
    
    The email should be clear, concise, and maintain appropriate professional boundaries.
  `
}
```

## Frontend Integration

### React Hook
```typescript
// src/hooks/useOpenAI.ts
export const useOpenAI = () => {
  const [isLoading, setIsLoading] = useState(false)
  
  const chatWithAI = async (messages: Message[], persona: string, context?: any) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke('openai-chat', {
        body: { messages, persona, context }
      })
      
      if (error) throw error
      return data.choices[0].message.content
    } finally {
      setIsLoading(false)
    }
  }
  
  const analyzeDocument = async (documentContent: string, analysisType: string, persona: string) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke('openai-analysis', {
        body: { documentContent, analysisType, persona }
      })
      
      if (error) throw error
      return data.choices[0].message.content
    } finally {
      setIsLoading(false)
    }
  }
  
  const generateContent = async (contentType: string, parameters: any, persona: string) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke('openai-generation', {
        body: { contentType, parameters, persona }
      })
      
      if (error) throw error
      return data.choices[0].message.content
    } finally {
      setIsLoading(false)
    }
  }
  
  return { chatWithAI, analyzeDocument, generateContent, isLoading }
}
```

### AI Chat Component
```typescript
// src/components/ai/AIChatPanel.tsx
export const AIChatPanel = ({ persona, context }) => {
  const { chatWithAI, isLoading } = useOpenAI()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  
  const handleSendMessage = async () => {
    if (!input.trim()) return
    
    const newMessages = [...messages, { role: 'user', content: input }]
    setMessages(newMessages)
    setInput('')
    
    try {
      const response = await chatWithAI(newMessages, persona, context)
      setMessages([...newMessages, { role: 'assistant', content: response }])
    } catch (error) {
      toast.error('Failed to get AI response')
    }
  }
  
  return (
    <Card className="h-96 flex flex-col">
      <CardHeader>
        <CardTitle>AI Assistant ({persona})</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 mb-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}>
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your AI assistant..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={isLoading}
          />
          <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
```

## Cost Management & Monitoring

### Usage Tracking
```typescript
// Track and limit AI usage
const checkUsageLimits = async (userId: string) => {
  const monthStart = new Date()
  monthStart.setDate(1)
  
  const { data: usage } = await supabase
    .from('ai_interactions')
    .select('cost_cents')
    .eq('user_id', userId)
    .gte('created_at', monthStart.toISOString())
  
  const totalCost = usage?.reduce((sum, record) => sum + (record.cost_cents || 0), 0) || 0
  const monthlyLimit = 10000 // $100 in cents
  
  return {
    used: totalCost,
    limit: monthlyLimit,
    remaining: monthlyLimit - totalCost,
    canProceed: totalCost < monthlyLimit
  }
}
```

### Performance Monitoring
```typescript
// Monitor AI performance and quality
const trackAIQuality = async (interactionId: string, userFeedback: 'positive' | 'negative', notes?: string) => {
  await supabase
    .from('ai_interactions')
    .update({
      metadata: supabase.raw('metadata || ?', [{ userFeedback, notes, ratedAt: new Date().toISOString() }])
    })
    .eq('id', interactionId)
}
```

## Security & Compliance

### Content Moderation
```typescript
// Moderate AI responses for compliance
const moderateContent = async (content: string) => {
  const moderationResponse = await fetch('https://api.openai.com/v1/moderations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ input: content })
  })
  
  const result = await moderationResponse.json()
  return result.results[0]
}
```

### Data Privacy
- Never send sensitive PII to OpenAI
- Anonymize data before analysis
- Implement data retention policies
- Regular compliance audits