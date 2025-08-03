import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  campaign_id?: string;
  lead_id?: string;
  email?: string;
  type: 'campaign' | 'followup' | 'test';
  trigger_data?: any;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { campaign_id, lead_id, email, type, trigger_data }: EmailRequest = await req.json();

    if (type === 'campaign') {
      return await sendCampaignEmail(campaign_id!, lead_id, trigger_data);
    } else if (type === 'followup') {
      return await sendFollowUpEmail(lead_id!, trigger_data);
    } else if (type === 'test') {
      return await sendTestEmail(campaign_id!, email!);
    }

    return new Response(JSON.stringify({ error: 'Invalid request type' }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Error in email-automation:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

const sendCampaignEmail = async (campaignId: string, leadId?: string, triggerData?: any) => {
  try {
    // Get campaign details
    const { data: campaign, error: campaignError } = await supabase
      .from('email_campaigns')
      .select('*')
      .eq('id', campaignId)
      .single();

    if (campaignError || !campaign) {
      throw new Error('Campaign not found');
    }

    if (campaign.status !== 'active') {
      return new Response(JSON.stringify({ message: 'Campaign not active' }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let recipients = [];

    if (leadId) {
      // Send to specific lead
      const { data: lead } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single();

      if (lead) {
        recipients = [lead];
      }
    } else {
      // Send to leads matching trigger criteria
      const { data: leads } = await supabase
        .from('leads')
        .select('*')
        .eq('advisor_id', campaign.advisor_id);

      recipients = leads?.filter(lead => matchesTriggerCriteria(lead, campaign.trigger_config)) || [];
    }

    const results = [];
    for (const lead of recipients) {
      try {
        const personalizedContent = personalizeSendEmail(campaign.content, lead);
        const personalizedSubject = personalizeSendEmail(campaign.subject, lead);

        const emailResponse = await resend.emails.send({
          from: "Financial Advisor <onboarding@resend.dev>",
          to: [lead.email],
          subject: personalizedSubject,
          html: personalizedContent,
        });

        // Log email send
        await supabase
          .from('email_sends')
          .insert([{
            campaign_id: campaignId,
            lead_id: lead.id,
            email: lead.email,
            subject: personalizedSubject,
            content: personalizedContent,
            resend_id: emailResponse.data?.id,
            status: 'sent'
          }]);

        results.push({ lead_id: lead.id, status: 'sent', resend_id: emailResponse.data?.id });
      } catch (error) {
        console.error(`Error sending to ${lead.email}:`, error);
        results.push({ lead_id: lead.id, status: 'error', error: error.message });
      }
    }

    // Update campaign stats
    await supabase
      .from('email_campaigns')
      .update({ 
        send_count: campaign.send_count + results.filter(r => r.status === 'sent').length 
      })
      .eq('id', campaignId);

    return new Response(JSON.stringify({ 
      message: 'Campaign emails sent',
      results: results,
      sent_count: results.filter(r => r.status === 'sent').length
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error('Error sending campaign email:', error);
    throw error;
  }
};

const sendFollowUpEmail = async (leadId: string, triggerData: any) => {
  try {
    // Get lead details
    const { data: lead } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single();

    if (!lead) {
      throw new Error('Lead not found');
    }

    // Get advisor's follow-up template
    const { data: template } = await supabase
      .from('advisor_email_templates')
      .select('*')
      .eq('advisor_id', lead.advisor_id)
      .eq('template_type', 'follow_up')
      .eq('is_active', true)
      .single();

    if (!template) {
      // Use default follow-up template
      const defaultSubject = 'Following up on our conversation';
      const defaultContent = `
        <p>Hi {{first_name}},</p>
        <p>I wanted to follow up on our recent conversation about your financial planning needs.</p>
        <p>I'm here to help answer any questions you might have and discuss how we can work together to achieve your financial goals.</p>
        <p>Please feel free to reply to this email or give me a call at your convenience.</p>
        <p>Best regards,<br>Your Financial Advisor</p>
      `;

      const personalizedSubject = personalizeSendEmail(defaultSubject, lead);
      const personalizedContent = personalizeSendEmail(defaultContent, lead);

      const emailResponse = await resend.emails.send({
        from: "Financial Advisor <onboarding@resend.dev>",
        to: [lead.email],
        subject: personalizedSubject,
        html: personalizedContent,
      });

      return new Response(JSON.stringify({ 
        message: 'Follow-up email sent',
        resend_id: emailResponse.data?.id
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const personalizedSubject = personalizeSendEmail(template.subject_template, lead);
    const personalizedContent = personalizeSendEmail(template.body_template, lead);

    const emailResponse = await resend.emails.send({
      from: "Financial Advisor <onboarding@resend.dev>",
      to: [lead.email],
      subject: personalizedSubject,
      html: personalizedContent,
    });

    // Log follow-up email
    await supabase
      .from('followup_emails')
      .insert([{
        lead_id: leadId,
        template_id: template.id,
        email: lead.email,
        subject: personalizedSubject,
        content: personalizedContent,
        resend_id: emailResponse.data?.id,
        trigger_data: triggerData
      }]);

    return new Response(JSON.stringify({ 
      message: 'Follow-up email sent',
      resend_id: emailResponse.data?.id
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error('Error sending follow-up email:', error);
    throw error;
  }
};

const sendTestEmail = async (campaignId: string, testEmail: string) => {
  try {
    const { data: campaign } = await supabase
      .from('email_campaigns')
      .select('*')
      .eq('id', campaignId)
      .single();

    if (!campaign) {
      throw new Error('Campaign not found');
    }

    // Use placeholder data for test
    const testLead = {
      first_name: 'John',
      last_name: 'Doe',
      email: testEmail,
      company: 'Test Company'
    };

    const personalizedSubject = personalizeSendEmail(campaign.subject, testLead);
    const personalizedContent = personalizeSendEmail(campaign.content, testLead);

    const emailResponse = await resend.emails.send({
      from: "Financial Advisor <onboarding@resend.dev>",
      to: [testEmail],
      subject: `[TEST] ${personalizedSubject}`,
      html: personalizedContent,
    });

    return new Response(JSON.stringify({ 
      message: 'Test email sent',
      resend_id: emailResponse.data?.id
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error('Error sending test email:', error);
    throw error;
  }
};

const personalizeSendEmail = (content: string, lead: any): string => {
  return content
    .replace(/\{\{first_name\}\}/g, lead.first_name || '')
    .replace(/\{\{last_name\}\}/g, lead.last_name || '')
    .replace(/\{\{name\}\}/g, `${lead.first_name || ''} ${lead.last_name || ''}`.trim())
    .replace(/\{\{email\}\}/g, lead.email || '')
    .replace(/\{\{company\}\}/g, lead.company || '')
    .replace(/\{\{lead_value\}\}/g, lead.lead_value ? `$${lead.lead_value.toLocaleString()}` : '');
};

const matchesTriggerCriteria = (lead: any, triggerConfig: any): boolean => {
  if (!triggerConfig) return false;

  // Lead status change trigger
  if (triggerConfig.from_status && triggerConfig.to_status) {
    return lead.lead_status === triggerConfig.to_status;
  }

  // Time-based trigger
  if (triggerConfig.days_since_created) {
    const createdDate = new Date(lead.created_at);
    const daysSince = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysSince >= triggerConfig.days_since_created;
  }

  // Engagement-based trigger
  if (triggerConfig.min_score) {
    return lead.lead_score >= triggerConfig.min_score;
  }

  return false;
};

serve(handler);