import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
      status: 405, headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const resend = new Resend(Deno.env.get('RESEND_API_KEY') ?? '');
    
    const { batchId } = await req.json();

    // Get batch communication details
    const { data: batchComm, error: batchError } = await supabase
      .from('batch_communications')
      .select(`
        *,
        communication_templates(*)
      `)
      .eq('id', batchId)
      .single();

    if (batchError || !batchComm) {
      throw new Error('Batch communication not found');
    }

    // Get recipients based on criteria
    let recipients = [];
    const criteria = batchComm.recipient_criteria;

    // Build query based on criteria
    let query = supabase
      .from('cpa_client_onboarding')
      .select(`
        client_user_id,
        profiles(email, display_name),
        status,
        onboarding_stage,
        documents_uploaded,
        documents_required
      `)
      .eq('cpa_partner_id', batchComm.cpa_partner_id);

    // Apply filters
    if (criteria.status) {
      query = query.in('status', criteria.status);
    }
    if (criteria.onboarding_stage) {
      query = query.in('onboarding_stage', criteria.onboarding_stage);
    }
    if (criteria.missing_docs) {
      query = query.lt('documents_uploaded', supabase.rpc('documents_required'));
    }

    const { data: clientData, error: clientError } = await query;
    
    if (clientError) {
      throw new Error('Failed to fetch recipients');
    }

    recipients = clientData || [];

    // Update batch with recipient count
    await supabase
      .from('batch_communications')
      .update({ 
        total_recipients: recipients.length,
        status: 'sending'
      })
      .eq('id', batchId);

    let sentCount = 0;
    let failedCount = 0;

    // Send communications
    for (const recipient of recipients) {
      try {
        const deliveryId = crypto.randomUUID();
        
        if (batchComm.communication_type === 'email') {
          // Replace template variables
          let content = batchComm.communication_templates.content;
          let subject = batchComm.communication_templates.subject || '';
          
          content = content.replace('{{client_name}}', recipient.profiles?.display_name || 'Client');
          subject = subject.replace('{{client_name}}', recipient.profiles?.display_name || 'Client');

          await resend.emails.send({
            from: 'CPA Portal <onboarding@resend.dev>',
            to: [recipient.profiles?.email],
            subject: subject,
            html: content
          });

          // Log delivery
          await supabase
            .from('communication_deliveries')
            .insert({
              id: deliveryId,
              batch_id: batchId,
              client_user_id: recipient.client_user_id,
              communication_type: 'email',
              recipient_email: recipient.profiles?.email,
              status: 'sent',
              sent_at: new Date().toISOString()
            });

          sentCount++;
        } else if (batchComm.communication_type === 'in_app') {
          // Create in-app notification
          await supabase
            .from('communication_deliveries')
            .insert({
              id: deliveryId,
              batch_id: batchId,
              client_user_id: recipient.client_user_id,
              communication_type: 'in_app',
              status: 'delivered',
              sent_at: new Date().toISOString(),
              delivered_at: new Date().toISOString()
            });

          sentCount++;
        }
      } catch (error) {
        console.error('Failed to send to recipient:', error);
        failedCount++;
        
        // Log failed delivery
        await supabase
          .from('communication_deliveries')
          .insert({
            batch_id: batchId,
            client_user_id: recipient.client_user_id,
            communication_type: batchComm.communication_type,
            recipient_email: recipient.profiles?.email,
            status: 'failed',
            error_message: error.message
          });
      }
    }

    // Update batch status
    await supabase
      .from('batch_communications')
      .update({ 
        status: 'completed',
        sent_count: sentCount,
        failed_count: failedCount
      })
      .eq('id', batchId);

    return new Response(JSON.stringify({ 
      success: true, 
      sent: sentCount, 
      failed: failedCount 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });

  } catch (error: any) {
    console.error('Batch communication error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
};

serve(handler);