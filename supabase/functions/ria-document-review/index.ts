import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DocumentReviewRequest {
  documentType: string;
  documentContent: string;
  state: string;
  fileName?: string;
}

interface ComplianceIssue {
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  issue: string;
  suggestion: string;
  section?: string;
}

interface DocumentReviewResponse {
  overallScore: number;
  complianceIssues: ComplianceIssue[];
  summary: string;
  recommendations: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentType, documentContent, state, fileName }: DocumentReviewRequest = await req.json();

    if (!OPENAI_API_KEY) {
      console.log('OPENAI_API_KEY set ✅: false');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create state-specific compliance prompt
    const stateRequirements = getStateSpecificRequirements(state, documentType);
    
    const systemPrompt = `You are a regulatory compliance expert specializing in RIA (Registered Investment Advisor) state licensing requirements. 

Your task is to review the provided document for compliance with ${state} state regulations for ${documentType}.

Key areas to evaluate:
${stateRequirements}

Provide your analysis in the following JSON format:
{
  "overallScore": <number 0-100>,
  "complianceIssues": [
    {
      "category": "<category>",
      "severity": "<low|medium|high|critical>",
      "issue": "<description>",
      "suggestion": "<specific fix>",
      "section": "<document section if applicable>"
    }
  ],
  "summary": "<brief overall assessment>",
  "recommendations": ["<actionable recommendations>"]
}

Focus on practical, actionable feedback that helps ensure regulatory compliance.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: `Please review this ${documentType} document for ${state} compliance:\n\n${documentContent}` 
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const reviewResult = JSON.parse(data.choices[0].message.content);

    // Log the review for audit purposes
    console.log(`Document review completed for ${fileName || 'document'} - ${state} ${documentType}`);
    console.log(`Overall score: ${reviewResult.overallScore}`);
    console.log(`Issues found: ${reviewResult.complianceIssues.length}`);

    return new Response(JSON.stringify(reviewResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in document-review function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Document review failed', 
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function getStateSpecificRequirements(state: string, documentType: string): string {
  const requirements = {
    'TX': {
      'form_adv_part2a': `
- Investment strategy and philosophy disclosure
- Fee structure transparency and calculation methods
- Conflicts of interest identification and mitigation
- Client communication and reporting procedures
- Disciplinary history disclosure
- Privacy policy compliance
- Required language for arbitration clauses
`,
      'advisory_agreement': `
- Clear fee disclosure and calculation methods
- Termination procedures and notice requirements
- Arbitration clause requirements (must be optional in Texas)
- Investment authority and limitations
- Conflicts of interest disclosure
- Client information confidentiality provisions
- Regulatory disclosures and disclaimer language
`,
      'code_of_ethics': `
- Personal securities transactions policies
- Gift and entertainment limitations
- Insider trading prevention procedures
- Client confidentiality requirements
- Compliance monitoring and reporting
- Whistleblower protection policies
- Documentation and record-keeping requirements
`
    },
    'CA': {
      'form_adv_part2a': `
- Detailed investment strategy disclosure
- Comprehensive fee structure with examples
- Enhanced conflicts of interest disclosure
- California-specific custody requirements
- Privacy policy alignment with CCPA
- Client complaint procedures
- Regulatory examination cooperation
`,
      'advisory_agreement': `
- Detailed fee disclosure with specific examples
- California consumer protection language
- Optional arbitration clauses (cannot be mandatory)
- Enhanced termination and withdrawal procedures
- CCPA privacy rights disclosure
- Fiduciary duty acknowledgment
- State-specific regulatory disclaimers
`
    }
  };

  const stateReqs = requirements[state as keyof typeof requirements];
  const docReqs = stateReqs?.[documentType as keyof typeof stateReqs];
  
  return docReqs || `
- Standard RIA compliance requirements
- Fee disclosure and transparency
- Conflicts of interest identification
- Client communication procedures
- Regulatory compliance acknowledgment
`;
}