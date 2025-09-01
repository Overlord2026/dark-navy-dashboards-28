import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PolicyEvalPayload {
  subject: string;
  action: string;
  reasons: string[];
  created_at: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Policy evaluation request received');
    
    const payload: PolicyEvalPayload = await req.json();
    console.log('Payload:', payload);

    // Validate required fields
    if (!payload.subject || !payload.action) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: subject, action' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Generate a mock receipt hash for now (in production, this would involve crypto operations)
    const receiptData = {
      subject: payload.subject,
      action: payload.action,
      reasons: payload.reasons,
      timestamp: payload.created_at,
      policy_version: 'v1.0'
    };

    // Create deterministic hash from the data
    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(receiptData));
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const receipt_hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    console.log('Generated receipt hash:', receipt_hash);

    // Store the decision in domain_events for audit trail
    try {
      const { error: insertError } = await supabase
        .from('domain_events')
        .insert({
          event_type: 'policy_decision',
          event_data: {
            subject: payload.subject,
            action: payload.action,
            reasons: payload.reasons,
            receipt_hash: receipt_hash,
            policy_version: 'v1.0'
          },
          aggregate_id: `decision_${Date.now()}`,
          aggregate_type: 'policy_decision',
          event_hash: receipt_hash,
          sequence_number: 1,
          metadata: {
            binding_rds: true,
            policy_eval: true
          }
        });

      if (insertError) {
        console.error('Failed to store decision event:', insertError);
        // Continue anyway - don't fail the whole operation
      } else {
        console.log('Decision event stored successfully');
      }
    } catch (storageError) {
      console.error('Storage error:', storageError);
      // Continue anyway
    }

    // Return the receipt hash
    return new Response(
      JSON.stringify({ 
        success: true,
        receipt_hash: receipt_hash,
        policy_version: 'v1.0',
        timestamp: payload.created_at
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in policy-eval function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});