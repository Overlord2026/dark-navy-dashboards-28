import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InvitationEmailRequest {
  inviteLink: string;
  clientName: string;
  clientEmail: string;
  advisorName?: string;
  customMessage?: string;
  firmName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    
    const { 
      inviteLink, 
      clientName, 
      clientEmail, 
      advisorName,
      customMessage,
      firmName 
    }: InvitationEmailRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: `${firmName || 'DarkNavy Advisors'} <onboarding@resend.dev>`,
      to: [clientEmail],
      subject: `Welcome to ${firmName || 'our firm'} - Begin Your Onboarding`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1a365d; margin-bottom: 10px;">Welcome, ${clientName}!</h1>
            <p style="color: #4a5568; font-size: 16px;">
              You've been invited to begin your onboarding process with ${firmName || 'our firm'}.
            </p>
          </div>

          ${customMessage ? `
            <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3182ce;">
              <p style="color: #2d3748; font-style: italic; margin: 0;">"${customMessage}"</p>
              ${advisorName ? `<p style="color: #4a5568; margin: 10px 0 0 0; font-size: 14px;">- ${advisorName}</p>` : ''}
            </div>
          ` : ''}

          <div style="margin: 30px 0;">
            <h2 style="color: #1a365d; font-size: 18px; margin-bottom: 15px;">What to Expect</h2>
            <ul style="color: #4a5568; line-height: 1.6;">
              <li>Secure identity verification</li>
              <li>Complete your client profile</li>
              <li>Upload required documents securely</li>
              <li>Review and sign service agreements</li>
              <li>Set up payment methods</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${inviteLink}" 
               style="background: #3182ce; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Begin Onboarding Process
            </a>
          </div>

          <div style="background: #edf2f7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #4a5568; margin: 0; font-size: 14px;">
              <strong>Secure & Private:</strong> Your information is protected with bank-level security. 
              We never sell your data to third parties.
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #718096; font-size: 12px; margin: 0;">
              This invitation link will expire in 7 days. If you have any questions, 
              please contact ${advisorName || 'your advisor'} directly.
            </p>
          </div>
        </div>
      `,
    });

    console.log("Client invitation email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-client-invitation function:", error);
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