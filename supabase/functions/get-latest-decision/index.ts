import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { subjectId, action } = await req.json();
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    let query = supabase
      .from('accounting_receipts')
      .select('*')
      .eq('subject_id', subjectId)
      .eq('subject_type', 'decision');

    if (action) {
      query = query.eq('event_type', action);
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return new Response(JSON.stringify(null), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Convert to Decision-RDS format
    const metadata = data.metadata as any;
    const decisionRDS = {
      id: data.id,
      type: 'Decision-RDS',
      subject_id: data.subject_id,
      action: data.event_type,
      reasons: data.reason_code?.split(',') || [],
      result: metadata.result || 'approve',
      inputs_hash: metadata.inputs_hash || '',
      policy_hash: metadata.policy_hash || '',
      model_id: metadata.model_id,
      receipt_hash: data.content_hash,
      policy_version: metadata.policy_version || 'DEFAULT-2024.09',
      anchor_ref: metadata.anchor_ref,
      created_at: data.created_at,
      metadata: metadata.metadata
    };

    return new Response(JSON.stringify(decisionRDS), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Get latest decision error:', error);
    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});