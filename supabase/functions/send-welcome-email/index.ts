import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  clientUserId: string;
  onboardingId: string;
  templateId?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    const { clientUserId, onboardingId, templateId }: WelcomeEmailRequest = await req.json();

    console.log(`Sending welcome email for onboarding: ${onboardingId}`);

    // Get onboarding details
    const { data: onboarding, error: onboardingError } = await supabaseClient
      .from('cpa_client_onboarding')
      .select(`
        *,
        cpa_partners (firm_name, contact_email, branding_config),
        cpa_client_invitations (first_name, last_name, company_name, welcome_video_url)
      `)
      .eq('id', onboardingId)
      .single();

    if (onboardingError) {
      throw new Error(`Failed to get onboarding details: ${onboardingError.message}`);
    }

    // Get client profile
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('email, first_name, last_name')
      .eq('id', clientUserId)
      .single();

    if (profileError) {
      throw new Error(`Failed to get client profile: ${profileError.message}`);
    }

    // Get welcome template or use default
    let template;
    if (templateId) {
      const { data: templateData } = await supabaseClient
        .from('cpa_welcome_templates')
        .select('*')
        .eq('id', templateId)
        .single();
      template = templateData;
    } else {
      const { data: defaultTemplate } = await supabaseClient
        .from('cpa_welcome_templates')
        .select('*')
        .eq('cpa_partner_id', onboarding.cpa_partner_id)
        .eq('is_default', true)
        .eq('client_type', onboarding.client_type)
        .single();
      template = defaultTemplate;
    }

    const cpaPartner = onboarding.cpa_partners;
    const invitation = onboarding.cpa_client_invitations;
    const brandingConfig = cpaPartner.branding_config || {};
    const primaryColor = brandingConfig.primaryColor || '#1B1B32';

    const clientName = profile.first_name && profile.last_name 
      ? `${profile.first_name} ${profile.last_name}`
      : invitation?.company_name || profile.email;

    // Generate portal URL
    const portalUrl = `${Deno.env.get('SUPABASE_URL')?.replace('/rest/v1', '')}/client/portal`;

    const welcomeEmailHtml = template ? template.email_content.replace(/\{clientName\}/g, clientName).replace(/\{portalUrl\}/g, portalUrl) : `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Your Client Portal</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, ${primaryColor}, ${brandingConfig.secondaryColor || '#2D2D4A'}); padding: 40px 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">
              Welcome to Your Client Portal
            </h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">
              ${cpaPartner.firm_name}
            </p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">
              Hello ${clientName}!
            </h2>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              Welcome to your secure client portal! Your account has been set up and you can now:
            </p>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px;">Your Next Steps:</h3>
              <ol style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;">Complete your tax organizer questionnaire</li>
                <li style="margin-bottom: 8px;">Upload required tax documents</li>
                <li style="margin-bottom: 8px;">Review and sign your engagement letter</li>
                <li style="margin-bottom: 8px;">Track your return progress in real-time</li>
              </ol>
            </div>

            ${invitation?.welcome_video_url ? `
              <div style="text-align: center; margin: 30px 0;">
                <h3 style="color: #1f2937; margin: 0 0 15px 0;">📹 Watch Our Getting Started Video</h3>
                <a href="${invitation.welcome_video_url}" style="display: inline-block; background-color: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
                  Watch Video Tutorial
                </a>
              </div>
            ` : ''}
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 40px 0;">
              <a href="${portalUrl}" style="display: inline-block; background-color: ${primaryColor}; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Access Your Portal
              </a>
            </div>
            
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px 20px; margin: 20px 0; border-radius: 0 4px 4px 0;">
              <h4 style="color: #92400e; margin: 0 0 8px 0; font-size: 16px;">Security & Privacy</h4>
              <p style="color: #92400e; margin: 0; font-size: 14px;">
                Your portal uses bank-level encryption to keep your financial information secure. All documents are stored safely and only accessible by you and your assigned tax professional.
              </p>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 30px 0 0 0; text-align: center;">
              Questions? Contact us at 
              <a href="mailto:${cpaPartner.contact_email}" style="color: ${primaryColor};">${cpaPartner.contact_email}</a>
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              © 2024 ${cpaPartner.firm_name}. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send welcome email
    const emailResponse = await resend.emails.send({
      from: `${cpaPartner.firm_name} <onboarding@resend.dev>`,
      to: [profile.email],
      subject: template?.subject_line || `Welcome to ${cpaPartner.firm_name} - Your Portal is Ready!`,
      html: welcomeEmailHtml,
    });

    if (emailResponse.error) {
      throw new Error(`Email send failed: ${emailResponse.error.message}`);
    }

    // Update onboarding record
    await supabaseClient
      .from('cpa_client_onboarding')
      .update({ 
        welcome_email_sent: true,
        onboarding_stage: 'organizer_pending'
      })
      .eq('id', onboardingId);

    // Log status change
    await supabaseClient
      .from('cpa_onboarding_status_log')
      .insert({
        onboarding_id: onboardingId,
        previous_stage: 'invited',
        new_stage: 'organizer_pending',
        status_message: 'Welcome email sent successfully',
        automated: true,
        client_visible: true
      });

    console.log(`Welcome email sent successfully to ${profile.email}`);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Welcome email sent successfully',
        emailId: emailResponse.data?.id 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
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