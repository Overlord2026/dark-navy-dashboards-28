import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { Resend } from "npm:resend@2.0.0";

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface FollowUpEmailRequest {
  meeting_summary_id: string;
  advisor_id: string;
  client_email: string;
}

// Simple template engine for Handlebars-like syntax
function renderTemplate(template: string, data: any): string {
  let result = template;
  
  // Replace simple variables {{variable}}
  result = result.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key] || '';
  });
  
  // Handle conditional blocks {{#if condition}}...{{/if}}
  result = result.replace(/\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, condition, content) => {
    return data[condition] ? content : '';
  });
  
  // Handle each loops {{#each array}}...{{/each}}
  result = result.replace(/\{\{#each\s+(\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, arrayName, content) => {
    const array = data[arrayName];
    if (!Array.isArray(array)) return '';
    
    return array.map(item => {
      let itemContent = content;
      // Replace {{this.property}} with item properties
      itemContent = itemContent.replace(/\{\{this\.(\w+)\}\}/g, (match, prop) => {
        return item[prop] || '';
      });
      return itemContent;
    }).join('');
  });
  
  return result;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      meeting_summary_id, 
      advisor_id, 
      client_email 
    }: FollowUpEmailRequest = await req.json();

    console.log("Processing follow-up email for:", { meeting_summary_id, advisor_id, client_email });

    // Get meeting summary data
    const { data: summaryData, error: summaryError } = await supabase
      .from('meeting_summaries')
      .select('*')
      .eq('id', meeting_summary_id)
      .single();

    if (summaryError || !summaryData) {
      throw new Error(`Failed to fetch meeting summary: ${summaryError?.message}`);
    }

    // Get advisor information
    const { data: advisorData, error: advisorError } = await supabase
      .from('advisor_profiles')
      .select('name, user_id')
      .eq('user_id', advisor_id)
      .single();

    if (advisorError || !advisorData) {
      throw new Error(`Failed to fetch advisor data: ${advisorError?.message}`);
    }

    // Get recording link if available
    let recordingLink = null;
    if (summaryData.recording_id) {
      const { data: recordingData } = await supabase
        .from('meeting_recordings')
        .select('secure_url')
        .eq('id', summaryData.recording_id)
        .single();
      
      recordingLink = recordingData?.secure_url;
    }

    // Get advisor's active email template and workflow
    const { data: workflowData, error: workflowError } = await supabase
      .from('follow_up_workflows')
      .select(`
        *,
        advisor_email_templates (*)
      `)
      .eq('advisor_id', advisor_id)
      .eq('is_active', true)
      .limit(1)
      .single();

    let emailTemplate, workflow;
    
    if (workflowError || !workflowData) {
      console.log("No custom workflow found, creating default template");
      
      // Create default template if none exists
      const { data: newTemplate, error: createError } = await supabase.rpc(
        'create_default_email_template',
        { p_advisor_id: advisor_id }
      );

      if (createError) {
        throw new Error(`Failed to create default template: ${createError.message}`);
      }

      // Get the created template
      const { data: defaultTemplate } = await supabase
        .from('advisor_email_templates')
        .select('*')
        .eq('id', newTemplate)
        .single();

      emailTemplate = defaultTemplate;
      workflow = {
        include_recording: true,
        include_summary: true,
        include_action_items: true
      };
    } else {
      emailTemplate = workflowData.advisor_email_templates;
      workflow = workflowData;
    }

    // Prepare template data
    const templateData = {
      client_name: summaryData.client_name || 'Valued Client',
      advisor_name: advisorData.name,
      meeting_title: summaryData.meeting_title || 'Our Recent Meeting',
      summary: workflow.include_summary ? summaryData.summary : null,
      action_items: workflow.include_action_items ? summaryData.action_items : null,
      next_steps: summaryData.next_steps,
      recording_link: workflow.include_recording ? recordingLink : null,
      meeting_date: new Date(summaryData.created_at).toLocaleDateString()
    };

    // Render email content
    const subject = renderTemplate(emailTemplate.subject_template, templateData);
    const htmlContent = renderTemplate(emailTemplate.body_template, templateData);

    // Send email
    const emailResponse = await resend.emails.send({
      from: `${advisorData.name} <noreply@mybfocfo.com>`,
      to: [client_email],
      subject: subject,
      html: htmlContent,
    });

    console.log("Follow-up email sent successfully:", emailResponse);

    // Log email in history
    const { error: historyError } = await supabase
      .from('follow_up_email_history')
      .insert({
        meeting_summary_id: meeting_summary_id,
        advisor_id: advisor_id,
        client_email: client_email,
        workflow_id: workflow.id || null,
        email_template_id: emailTemplate.id,
        subject: subject,
        content: htmlContent,
        status: 'sent',
        metadata: {
          resend_id: emailResponse.data?.id,
          recording_included: !!recordingLink,
          summary_included: !!workflow.include_summary
        }
      });

    if (historyError) {
      console.error("Failed to log email history:", historyError);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      email_id: emailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-follow-up-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);