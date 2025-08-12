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
    const { consent_id, reason } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the consent token to revoke
    const { data: consent, error: fetchError } = await supabase
      .from('consent_tokens')
      .select('*')
      .eq('id', consent_id)
      .single();

    if (fetchError || !consent) {
      throw new Error('Consent token not found');
    }

    if (consent.status === 'revoked') {
      throw new Error('Consent already revoked');
    }

    // Mark consent as revoked
    const { error: updateError } = await supabase
      .from('consent_tokens')
      .update({ status: 'revoked' })
      .eq('id', consent_id);

    if (updateError) {
      throw updateError;
    }

    // Create revocation record
    const { data: revocation, error: revocationError } = await supabase
      .from('revocations')
      .insert({
        consent_id,
        reason: reason || 'User requested revocation'
      })
      .select()
      .single();

    if (revocationError) {
      throw revocationError;
    }

    // Find related consents and actions to propagate revocation
    const affectedItems = await findAffectedItems(supabase, consent);
    
    // Create takedown receipts for each affected item
    const takedownReceipts = [];
    
    for (const item of affectedItems) {
      const { data: receipt } = await supabase
        .from('reason_receipts')
        .insert({
          user_id: consent.subject_user,
          persona_id: item.persona_id,
          action_key: 'TAKEDOWN_PROPAGATION',
          reason_code: 'TAKEDOWN_DUE_TO_REVOCATION',
          explanation: `Takedown required due to consent revocation: ${consent_id}`,
          hash: generateTakedownHash(consent_id, item)
        })
        .select()
        .single();
        
      if (receipt) {
        takedownReceipts.push(receipt);
      }
    }

    // Mark revocation as propagated
    await supabase
      .from('revocations')
      .update({ propagated: true })
      .eq('id', revocation.id);

    // Trigger downstream systems (webhooks, notifications, etc.)
    await triggerDownstreamSystems(supabase, consent, revocation, takedownReceipts);

    return new Response(
      JSON.stringify({
        revocation_id: revocation.id,
        consent_id,
        affected_items: affectedItems.length,
        takedown_receipts: takedownReceipts.map(r => r.id),
        propagated: true,
        status: 'completed'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Propagate revocation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function findAffectedItems(supabase: any, consent: any) {
  const scopes = consent.scopes as any;
  const affectedItems = [];

  // Find reason receipts that were created under this consent
  const { data: receipts } = await supabase
    .from('reason_receipts')
    .select('*')
    .eq('user_id', consent.subject_user)
    .in('reason_code', ['OK_POLICY', 'CONDITIONAL_APPROVAL'])
    .gte('created_at', consent.created_at);

  if (receipts) {
    affectedItems.push(...receipts.map(r => ({
      type: 'reason_receipt',
      id: r.id,
      persona_id: r.persona_id,
      action_key: r.action_key
    })));
  }

  // Find XR attestations that reference this consent
  const { data: attestations } = await supabase
    .from('xr_attestations')
    .select('*')
    .eq('consent_id', consent.id);

  if (attestations) {
    affectedItems.push(...attestations.map(a => ({
      type: 'xr_attestation',
      id: a.id,
      persona_id: null,
      event: a.event
    })));
  }

  return affectedItems;
}

function generateTakedownHash(consentId: string, item: any): string {
  const data = {
    consent_id: consentId,
    item_type: item.type,
    item_id: item.id,
    timestamp: Date.now(),
    action: 'TAKEDOWN_PROPAGATION'
  };
  
  const normalized = JSON.stringify(data, Object.keys(data).sort());
  return btoa(normalized).slice(0, 32);
}

async function triggerDownstreamSystems(supabase: any, consent: any, revocation: any, receipts: any[]) {
  // Log the revocation event
  console.log('Consent revocation propagated:', {
    consent_id: consent.id,
    subject_user: consent.subject_user,
    revocation_id: revocation.id,
    affected_receipts: receipts.length
  });

  // In production, this would trigger:
  // - Webhook notifications to integrated systems
  // - Cache invalidation
  // - Content takedown in CDNs
  // - Email notifications to stakeholders
  // - Compliance system updates

  // Mock webhook call
  try {
    const webhookPayload = {
      event: 'consent.revoked',
      consent_id: consent.id,
      subject_user: consent.subject_user,
      revocation_id: revocation.id,
      affected_items: receipts.length,
      timestamp: new Date().toISOString()
    };

    // In production, replace with actual webhook URLs
    const webhookUrl = Deno.env.get('REVOCATION_WEBHOOK_URL');
    
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhookPayload)
      });
    }
  } catch (webhookError) {
    console.error('Webhook notification failed:', webhookError);
    // Don't fail the revocation if webhooks fail
  }
}