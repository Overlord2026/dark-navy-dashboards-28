import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  template: 'welcome' | 'onboarding' | 'reminder' | 'compliance' | 'support';
  data: Record<string, any>;
  persona?: 'advisor' | 'attorney' | 'cpa' | 'client';
}

const templates = {
  welcome: {
    subject: "Welcome to Boutique Family Office™",
    html: (data: any) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1f2937; margin-bottom: 10px;">Welcome to Boutique Family Office™</h1>
          <p style="color: #6b7280; font-size: 16px;">Your elite financial services platform is ready</p>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #1f2937; margin-bottom: 15px;">Hello ${data.name || 'there'}!</h2>
          <p style="color: #374151; line-height: 1.6;">
            Your account has been successfully activated. You now have access to:
          </p>
          <ul style="color: #374151; line-height: 1.8;">
            <li>Professional SMS & VoIP communications</li>
            <li>Secure document vault</li>
            <li>AI-powered client management</li>
            <li>Compliance-ready workflows</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.loginUrl || '#'}" 
             style="background: #3b82f6; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; font-weight: 500;">
            Access Your Dashboard
          </a>
        </div>
        
        <div style="text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px;">
          <p>Need help? Contact our support team or use the in-app chat.</p>
          <p>Boutique Family Office™ • Elite Financial Services Platform</p>
        </div>
      </div>
    `
  },
  
  onboarding: {
    subject: "Complete Your BFO Setup",
    html: (data: any) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #1f2937; text-align: center; margin-bottom: 30px;">
          Complete Your Setup
        </h1>
        
        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin-bottom: 20px;">
          <h2 style="color: #92400e; margin-top: 0;">Action Required</h2>
          <p style="color: #78350f; margin-bottom: 0;">
            Your ${data.persona || 'professional'} account setup is ${data.progress || '75%'} complete. 
            Finish your setup to unlock all features.
          </p>
        </div>
        
        <div style="margin: 20px 0;">
          <h3 style="color: #1f2937;">Remaining Steps:</h3>
          <div style="margin: 15px 0;">
            ${data.steps?.map((step: string) => `
              <div style="padding: 10px; border: 1px solid #e5e7eb; border-radius: 4px; margin: 8px 0;">
                ${step}
              </div>
            `).join('') || ''}
          </div>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.setupUrl || '#'}" 
             style="background: #3b82f6; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; font-weight: 500;">
            Continue Setup
          </a>
        </div>
      </div>
    `
  },
  
  reminder: {
    subject: "BFO Reminder",
    html: (data: any) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #1f2937; text-align: center; margin-bottom: 30px;">
          ${data.title || 'Reminder'}
        </h1>
        
        <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 20px; margin-bottom: 20px;">
          <p style="color: #0c4a6e; margin: 0; line-height: 1.6;">
            ${data.message || 'You have a pending item that requires your attention.'}
          </p>
        </div>
        
        ${data.actionUrl ? `
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.actionUrl}" 
               style="background: #3b82f6; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 6px; font-weight: 500;">
              ${data.actionText || 'Take Action'}
            </a>
          </div>
        ` : ''}
      </div>
    `
  },
  
  compliance: {
    subject: "BFO Compliance Update",
    html: (data: any) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #1f2937; text-align: center; margin-bottom: 30px;">
          Compliance Update
        </h1>
        
        <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin-bottom: 20px;">
          <h2 style="color: #065f46; margin-top: 0;">Compliance Status</h2>
          <p style="color: #047857;">
            ${data.message || 'Your account remains in full compliance with all regulatory requirements.'}
          </p>
        </div>
        
        <div style="margin: 20px 0;">
          <h3 style="color: #1f2937;">Recent Activity:</h3>
          <ul style="color: #374151; line-height: 1.8;">
            ${data.activities?.map((activity: string) => `<li>${activity}</li>`).join('') || ''}
          </ul>
        </div>
      </div>
    `
  },
  
  support: {
    subject: "BFO Support Response",
    html: (data: any) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #1f2937; text-align: center; margin-bottom: 30px;">
          Support Response
        </h1>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #1f2937; margin-bottom: 15px;">Hello ${data.name || 'there'}!</h2>
          <p style="color: #374151; line-height: 1.6;">
            ${data.message || 'Thank you for contacting Boutique Family Office support.'}
          </p>
        </div>
        
        ${data.ticketId ? `
          <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e;">
              <strong>Ticket ID:</strong> ${data.ticketId}
            </p>
          </div>
        ` : ''}
      </div>
    `
  }
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { to, subject, template, data, persona }: EmailRequest = await req.json();

    if (!to || !template) {
      throw new Error('Missing required fields: to, template');
    }

    const templateConfig = templates[template];
    if (!templateConfig) {
      throw new Error(`Unknown template: ${template}`);
    }

    const emailSubject = subject || templateConfig.subject;
    const emailHtml = templateConfig.html(data);

    // Determine sender based on persona or use default
    const fromEmail = persona === 'advisor' ? "advisors@boutiquefamilyoffice.com" :
                     persona === 'attorney' ? "legal@boutiquefamilyoffice.com" :
                     persona === 'cpa' ? "accounting@boutiquefamilyoffice.com" :
                     "onboarding@boutiquefamilyoffice.com";

    const emailResponse = await resend.emails.send({
      from: `Boutique Family Office <${fromEmail}>`,
      to: [to],
      subject: emailSubject,
      html: emailHtml,
    });

    // Log email in database
    await supabase.from('email_logs').insert({
      to_email: to,
      subject: emailSubject,
      template_used: template,
      persona: persona,
      email_data: data,
      resend_id: emailResponse.data?.id,
      status: 'sent'
    });

    console.log("Email sent successfully:", emailResponse.data?.id);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-email function:", error);
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