import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, recipient_type, recipient_id, notification_type, data } = await req.json();
    
    console.log(`CRM notification: ${action} - ${notification_type} for ${recipient_type}: ${recipient_id}`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    switch (action) {
      case 'send_notification':
        return await sendNotification(supabase, { recipient_type, recipient_id, notification_type, data });
      case 'sync_to_crm':
        return await syncToCRM(supabase, data);
      case 'schedule_followup':
        return await scheduleFollowup(supabase, data);
      default:
        throw new Error(`Unknown action: ${action}`);
    }

  } catch (error) {
    console.error('Error in crm-notification-system:', error);
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

async function sendNotification(supabase: any, params: any) {
  const { recipient_type, recipient_id, notification_type, data } = params;
  
  // Get recipient details
  let recipient;
  if (recipient_type === 'client') {
    const { data: clientData } = await supabase
      .from('profiles')
      .select('email, first_name, last_name')
      .eq('id', recipient_id)
      .single();
    recipient = clientData;
  } else if (recipient_type === 'partner') {
    const { data: partnerData } = await supabase
      .from('partner_applications')
      .select('email, partner_name')
      .eq('id', recipient_id)
      .single();
    recipient = partnerData;
  }

  if (!recipient) {
    throw new Error(`Recipient not found: ${recipient_type} ${recipient_id}`);
  }

  // Generate email content based on notification type
  const emailContent = generateEmailContent(notification_type, recipient, data);
  
  // Send email via Resend
  const emailResponse = await resend.emails.send({
    from: "Lending Platform <loans@lovable.dev>",
    to: [recipient.email],
    subject: emailContent.subject,
    html: emailContent.html
  });

  // Log notification
  const { error: logError } = await supabase
    .from('analytics_events')
    .insert({
      event_type: 'notification_sent',
      event_category: 'crm',
      event_data: {
        recipient_type,
        recipient_id,
        notification_type,
        email_id: emailResponse.data?.id,
        timestamp: new Date().toISOString()
      }
    });

  if (logError) {
    console.error('Error logging notification:', logError);
  }

  // Sync to external CRM if configured
  await syncNotificationToCRM({ recipient_type, recipient_id, notification_type, data });

  return new Response(
    JSON.stringify({
      success: true,
      email_id: emailResponse.data?.id,
      recipient: recipient.email,
      notification_type
    }),
    { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
  );
}

async function syncToCRM(supabase: any, data: any) {
  const hubspotApiKey = Deno.env.get('HUBSPOT_API_KEY');
  const salesforceApiKey = Deno.env.get('SALESFORCE_API_KEY');
  
  let syncResults = [];
  
  // HubSpot integration
  if (hubspotApiKey) {
    try {
      const hubspotResult = await syncToHubSpot(hubspotApiKey, data);
      syncResults.push({ platform: 'hubspot', success: true, result: hubspotResult });
    } catch (error) {
      console.error('HubSpot sync error:', error);
      syncResults.push({ platform: 'hubspot', success: false, error: error.message });
    }
  }
  
  // Salesforce integration
  if (salesforceApiKey) {
    try {
      const salesforceResult = await syncToSalesforce(salesforceApiKey, data);
      syncResults.push({ platform: 'salesforce', success: true, result: salesforceResult });
    } catch (error) {
      console.error('Salesforce sync error:', error);
      syncResults.push({ platform: 'salesforce', success: false, error: error.message });
    }
  }

  // Log sync results
  await supabase
    .from('analytics_events')
    .insert({
      event_type: 'crm_sync',
      event_category: 'integration',
      event_data: {
        sync_results: syncResults,
        data_synced: data,
        timestamp: new Date().toISOString()
      }
    });

  return new Response(
    JSON.stringify({
      success: true,
      sync_results: syncResults
    }),
    { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
  );
}

async function scheduleFollowup(supabase: any, data: any) {
  const { recipient_id, followup_type, schedule_date, message } = data;
  
  // Create scheduled followup record
  const { data: followupData, error } = await supabase
    .from('analytics_events')
    .insert({
      event_type: 'followup_scheduled',
      event_category: 'crm',
      event_data: {
        recipient_id,
        followup_type,
        schedule_date,
        message,
        status: 'scheduled',
        created_at: new Date().toISOString()
      }
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to schedule followup: ${error.message}`);
  }

  return new Response(
    JSON.stringify({
      success: true,
      followup_id: followupData.id,
      scheduled_for: schedule_date
    }),
    { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
  );
}

function generateEmailContent(notification_type: string, recipient: any, data: any) {
  const templates = {
    loan_status_update: {
      subject: `Loan Application Update - ${data.status}`,
      html: `
        <h2>Hello ${recipient.first_name || recipient.partner_name},</h2>
        <p>Your loan application status has been updated to: <strong>${data.status}</strong></p>
        <p>Loan Amount: $${data.amount?.toLocaleString()}</p>
        <p>Next Steps: ${data.next_steps || 'We will contact you shortly.'}</p>
        <p>Best regards,<br>The Lending Team</p>
      `
    },
    document_signed: {
      subject: 'Document Successfully Signed',
      html: `
        <h2>Hello ${recipient.first_name || recipient.partner_name},</h2>
        <p>Thank you for signing the required documents for your loan application.</p>
        <p>Document: ${data.document_name}</p>
        <p>Signed Date: ${new Date(data.signed_date).toLocaleDateString()}</p>
        <p>Your application is now being processed.</p>
        <p>Best regards,<br>The Lending Team</p>
      `
    },
    compliance_alert: {
      subject: 'Compliance Alert - Action Required',
      html: `
        <h2>Hello ${recipient.first_name || recipient.partner_name},</h2>
        <p>A compliance alert has been triggered for your account.</p>
        <p>Alert Type: ${data.alert_type}</p>
        <p>Description: ${data.description}</p>
        <p>Please contact us immediately to resolve this issue.</p>
        <p>Best regards,<br>Compliance Team</p>
      `
    },
    partner_reminder: {
      subject: 'Partner Portal Reminder',
      html: `
        <h2>Hello ${recipient.partner_name || recipient.first_name},</h2>
        <p>This is a reminder about pending items in your partner portal:</p>
        <ul>
          ${(data.pending_items || []).map((item: string) => `<li>${item}</li>`).join('')}
        </ul>
        <p>Please log in to your portal to complete these items.</p>
        <p>Best regards,<br>Partner Relations</p>
      `
    }
  };

  return templates[notification_type as keyof typeof templates] || {
    subject: 'Notification from Lending Platform',
    html: `
      <h2>Hello ${recipient.first_name || recipient.partner_name},</h2>
      <p>You have a new notification from the lending platform.</p>
      <p>Best regards,<br>The Team</p>
    `
  };
}

async function syncToHubSpot(apiKey: string, data: any) {
  // Mock HubSpot integration
  console.log('Syncing to HubSpot:', data);
  return { contact_id: 'hubspot_' + Date.now(), status: 'synced' };
}

async function syncToSalesforce(apiKey: string, data: any) {
  // Mock Salesforce integration
  console.log('Syncing to Salesforce:', data);
  return { contact_id: 'sf_' + Date.now(), status: 'synced' };
}

async function syncNotificationToCRM(params: any) {
  // Sync notification activity to CRM platforms
  console.log('Syncing notification to CRM:', params);
}