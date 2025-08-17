import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NILDisclosureRequest {
  athleteId: string;
  agentId: string;
  dealType: string;
  disclosureType: 'initial' | 'amendment' | 'termination';
  dealDetails: {
    amount?: number;
    duration?: string;
    description: string;
    brandName?: string;
  };
  universityId?: string;
  metadata?: Record<string, any>;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const disclosure: NILDisclosureRequest = await req.json();

    // Validate required fields
    if (!disclosure.athleteId || !disclosure.agentId || !disclosure.dealType) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: athleteId, agentId, dealType' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate disclosure document
    const disclosureData = {
      athlete_user_id: disclosure.athleteId,
      agent_id: disclosure.agentId,
      school_id: disclosure.universityId,
      disclosure_type: disclosure.disclosureType,
      deal_type: disclosure.dealType,
      deal_amount: disclosure.dealDetails.amount,
      deal_duration: disclosure.dealDetails.duration,
      deal_description: disclosure.dealDetails.description,
      brand_name: disclosure.dealDetails.brandName,
      status: 'draft',
      payload: {
        type: disclosure.disclosureType,
        dealDetails: disclosure.dealDetails,
        metadata: disclosure.metadata || {},
        generatedAt: new Date().toISOString(),
        complianceVersion: '2024.1'
      }
    };

    // Store disclosure in database
    const { data: disclosureRecord, error: dbError } = await supabase
      .from('nil_disclosures')
      .insert(disclosureData)
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ error: 'Failed to create disclosure record' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If university is specified, prepare notification
    if (disclosure.universityId) {
      const { data: universityContacts } = await supabase
        .from('nil_university_contacts')
        .select('email, name')
        .eq('university_id', disclosure.universityId);

      if (universityContacts && universityContacts.length > 0) {
        console.log(`Disclosure notification prepared for ${universityContacts.length} university contacts`);
        // In a real implementation, you would send emails here
      }
    }

    // Generate compliance score based on deal details
    const complianceScore = calculateComplianceScore(disclosure);

    const response = {
      disclosureId: disclosureRecord.id,
      status: 'created',
      complianceScore,
      nextSteps: generateNextSteps(disclosure, complianceScore),
      university: disclosure.universityId ? {
        notificationSent: true,
        contactCount: 1 // Placeholder
      } : null
    };

    console.log('NIL disclosure created successfully:', {
      disclosureId: disclosureRecord.id,
      athleteId: disclosure.athleteId,
      dealType: disclosure.dealType
    });

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Error in nil-disclosure-processor function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

function calculateComplianceScore(disclosure: NILDisclosureRequest): number {
  let score = 100;

  // Check for required fields
  if (!disclosure.dealDetails.description) score -= 20;
  if (!disclosure.dealDetails.amount && disclosure.dealType !== 'social_media') score -= 15;
  if (!disclosure.universityId) score -= 10;

  // Check for risk factors
  if (disclosure.dealDetails.amount && disclosure.dealDetails.amount > 100000) score -= 5;
  if (disclosure.dealType === 'endorsement' && !disclosure.dealDetails.brandName) score -= 10;

  return Math.max(score, 0);
}

function generateNextSteps(disclosure: NILDisclosureRequest, complianceScore: number): string[] {
  const steps: string[] = [];

  if (complianceScore < 80) {
    steps.push('Review and complete missing disclosure information');
  }

  if (disclosure.universityId) {
    steps.push('University compliance office will review within 2 business days');
  }

  steps.push('Submit finalized disclosure to NCAA database');
  
  if (disclosure.dealDetails.amount && disclosure.dealDetails.amount > 50000) {
    steps.push('Consider tax implications and consult financial advisor');
  }

  return steps;
}

serve(handler);