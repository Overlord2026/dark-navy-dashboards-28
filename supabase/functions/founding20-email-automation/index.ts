import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const resend = new Resend(Deno.env.get('RESEND_API_KEY') ?? '');

interface EmailRequest {
  template_id: string;
  recipient_email: string;
  recipient_name: string;
  org_name: string;
  personalization?: Record<string, string>;
  utm_params?: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const emailRequest: EmailRequest = await req.json();
    
    console.log('Processing email request:', emailRequest);

    // Get email template
    const { data: template, error: templateError } = await supabase
      .from('f20_email_campaigns')
      .select('*')
      .eq('id', emailRequest.template_id)
      .eq('is_active', true)
      .single();

    if (templateError || !template) {
      throw new Error(`Template not found: ${templateError?.message}`);
    }

    // Personalize email content
    const personalizationData = {
      contact_name: emailRequest.recipient_name,
      org_name: emailRequest.org_name,
      sender_name: template.sender_name,
      ...emailRequest.personalization
    };

    const personalizedSubject = personalizeContent(template.subject_line, personalizationData);
    const personalizedContent = personalizeContent(template.template_content, personalizationData);

    // Add UTM tracking if provided
    let trackingContent = personalizedContent;
    if (emailRequest.utm_params) {
      const utmString = new URLSearchParams(emailRequest.utm_params).toString();
      trackingContent = trackingContent.replace(
        /https:\/\/my\.bfocfo\.com(\/[^\s]*)?/g,
        `https://my.bfocfo.com$1?${utmString}`
      );
    }

    // Send email via Resend
    const emailResponse = await resend.emails.send({
      from: `${template.sender_name} <${template.sender_email}>`,
      to: [emailRequest.recipient_email],
      subject: personalizedSubject,
      text: trackingContent,
      html: convertToHTML(trackingContent)
    });

    if (emailResponse.error) {
      throw new Error(`Failed to send email: ${emailResponse.error.message}`);
    }

    // Log email activity
    await supabase.from('f20_analytics').insert({
      event_type: 'email_sent',
      segment: template.segment,
      target_name: emailRequest.org_name,
      utm_source: emailRequest.utm_params?.utm_source,
      utm_medium: emailRequest.utm_params?.utm_medium,
      utm_campaign: emailRequest.utm_params?.utm_campaign,
      utm_content: emailRequest.utm_params?.utm_content,
      event_data: {
        template_id: emailRequest.template_id,
        template_type: template.template_type,
        recipient_email: emailRequest.recipient_email,
        resend_id: emailResponse.data?.id
      }
    });

    console.log('Email sent successfully:', emailResponse.data);

    return new Response(JSON.stringify({
      success: true,
      email_id: emailResponse.data?.id,
      message: 'Email sent successfully'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Error in founding20-email-automation:', error);
    
    return new Response(JSON.stringify({
      error: error.message || 'Failed to send email'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
};

function personalizeContent(content: string, data: Record<string, string>): string {
  return content.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key] || match;
  });
}

function convertToHTML(textContent: string): string {
  // Convert plain text to basic HTML
  return textContent
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^\*\* (.+) \*\*$/gm, '<strong>$1</strong>')
    .replace(/^• (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>')
    .replace(/<p><\/p>/g, '')
    .replace(/https?:\/\/[^\s]+/g, '<a href="$&" style="color: #FFD700;">$&</a>');
}

serve(handler);