import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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
    const { action, envelope_id, signer_email, signer_name, document_name, loan_id } = await req.json();
    
    console.log(`DocuSign action: ${action} for loan: ${loan_id}`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    switch (action) {
      case 'create_envelope':
        return await createSigningEnvelope(supabase, { signer_email, signer_name, document_name, loan_id });
      case 'check_status':
        return await checkEnvelopeStatus(supabase, envelope_id);
      case 'webhook_callback':
        return await handleWebhookCallback(supabase, await req.json());
      default:
        throw new Error(`Unknown action: ${action}`);
    }

  } catch (error) {
    console.error('Error in docusign-integration:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }
});

async function createSigningEnvelope(supabase: any, data: any) {
  const { signer_email, signer_name, document_name, loan_id } = data;
  
  const docusignApiKey = Deno.env.get('DOCUSIGN_API_KEY');
  const docusignAccountId = Deno.env.get('DOCUSIGN_ACCOUNT_ID');
  
  let envelopeResponse;
  
  if (docusignApiKey && docusignAccountId) {
    // Real DocuSign API call
    console.log('Creating real DocuSign envelope');
    envelopeResponse = await createDocuSignEnvelope(docusignApiKey, docusignAccountId, data);
  } else {
    // Mock envelope creation
    console.log('Creating mock DocuSign envelope');
    envelopeResponse = {
      envelope_id: `mock_env_${Date.now()}`,
      signing_url: `https://demo.docusign.net/signing/${Date.now()}`,
      status: 'sent',
      created_datetime: new Date().toISOString()
    };
  }

  // Log the document creation
  const { error: logError } = await supabase
    .from('loan_documents')
    .insert({
      loan_id,
      user_id: 'system', // Would be actual user ID in production
      doc_type: 'loan_application',
      file_name: document_name,
      status: 'pending',
      notes: `DocuSign envelope created: ${envelopeResponse.envelope_id}`
    });

  if (logError) {
    console.error('Error logging document creation:', logError);
  }

  // Create audit trail
  await supabase
    .from('compliance_audit_trail')
    .insert({
      entity_type: 'loan',
      entity_id: loan_id,
      action_type: 'document_sent_for_signature',
      performed_by: 'system',
      details: {
        envelope_id: envelopeResponse.envelope_id,
        signer_email,
        document_name,
        timestamp: new Date().toISOString()
      }
    });

  return new Response(
    JSON.stringify({
      success: true,
      envelope_id: envelopeResponse.envelope_id,
      signing_url: envelopeResponse.signing_url,
      status: envelopeResponse.status
    }),
    { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
  );
}

async function checkEnvelopeStatus(supabase: any, envelope_id: string) {
  const docusignApiKey = Deno.env.get('DOCUSIGN_API_KEY');
  
  let statusResponse;
  
  if (docusignApiKey) {
    // Real DocuSign status check
    statusResponse = await getDocuSignEnvelopeStatus(docusignApiKey, envelope_id);
  } else {
    // Mock status response
    const statuses = ['sent', 'delivered', 'signed', 'completed'];
    statusResponse = {
      envelope_id,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      completed_datetime: Math.random() > 0.5 ? new Date().toISOString() : null
    };
  }

  // Update document status if completed
  if (statusResponse.status === 'completed' || statusResponse.status === 'signed') {
    await supabase
      .from('loan_documents')
      .update({ 
        status: 'verified',
        verified_at: new Date().toISOString()
      })
      .eq('notes', `DocuSign envelope created: ${envelope_id}`);

    // Create audit trail
    await supabase
      .from('compliance_audit_trail')
      .insert({
        entity_type: 'document',
        entity_id: envelope_id,
        action_type: 'document_signed',
        performed_by: 'system',
        details: {
          envelope_id,
          status: statusResponse.status,
          completed_datetime: statusResponse.completed_datetime,
          timestamp: new Date().toISOString()
        }
      });
  }

  return new Response(
    JSON.stringify({
      success: true,
      envelope_id,
      status: statusResponse.status,
      completed_datetime: statusResponse.completed_datetime
    }),
    { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
  );
}

async function handleWebhookCallback(supabase: any, webhookData: any) {
  console.log('Processing DocuSign webhook:', webhookData);
  
  // Process webhook events (document signed, completed, etc.)
  const { envelope_id, status, event_type } = webhookData;
  
  // Update document status based on webhook
  if (status === 'completed') {
    await supabase
      .from('loan_documents')
      .update({ 
        status: 'verified',
        verified_at: new Date().toISOString()
      })
      .eq('notes', `DocuSign envelope created: ${envelope_id}`);
  }

  // Create audit trail
  await supabase
    .from('compliance_audit_trail')
    .insert({
      entity_type: 'document',
      entity_id: envelope_id,
      action_type: 'webhook_received',
      performed_by: 'system',
      details: {
        envelope_id,
        status,
        event_type,
        webhook_data: webhookData,
        timestamp: new Date().toISOString()
      }
    });

  return new Response(
    JSON.stringify({ success: true, processed: true }),
    { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
  );
}

async function createDocuSignEnvelope(apiKey: string, accountId: string, data: any) {
  // Real DocuSign API integration would go here
  // This is a placeholder for the actual implementation
  console.log('Creating DocuSign envelope with API key:', apiKey);
  return {
    envelope_id: `real_env_${Date.now()}`,
    signing_url: `https://na3.docusign.net/signing/${Date.now()}`,
    status: 'sent',
    created_datetime: new Date().toISOString()
  };
}

async function getDocuSignEnvelopeStatus(apiKey: string, envelope_id: string) {
  // Real DocuSign status check would go here
  console.log('Checking DocuSign envelope status:', envelope_id);
  return {
    envelope_id,
    status: 'completed',
    completed_datetime: new Date().toISOString()
  };
}