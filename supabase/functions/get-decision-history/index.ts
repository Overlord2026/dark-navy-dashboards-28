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
    const { subjectId, limit = 10 } = await req.json();
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data, error } = await supabase
      .from('accounting_receipts')
      .select('*')
      .eq('subject_id', subjectId)
      .eq('subject_type', 'decision')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    const decisions = (data || []).map(record => {
      const metadata = record.metadata as any;
      return {
        id: record.id,
        type: 'Decision-RDS' as const,
        subject_id: record.subject_id,
        action: record.event_type,
        reasons: record.reason_code?.split(',') || [],
        result: metadata.result || 'approve',
        inputs_hash: metadata.inputs_hash || '',
        policy_hash: metadata.policy_hash || '',
        model_id: metadata.model_id,
        receipt_hash: record.content_hash,
        policy_version: metadata.policy_version || 'DEFAULT-2024.09',
        anchor_ref: metadata.anchor_ref,
        created_at: record.created_at,
        metadata: metadata.metadata
      };
    });

    return new Response(JSON.stringify(decisions), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Get decision history error:', error);
    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});