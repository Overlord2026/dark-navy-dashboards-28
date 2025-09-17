import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface InviteRequest {
  firstName: string;
  lastName: string;
  email: string;
  clientSegment: string;
  personalNote?: string;
  paymentResponsibility?: 'advisor_paid' | 'client_paid';
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Get the authenticated user (advisor)
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    const {
      firstName,
      lastName,
      email,
      clientSegment,
      personalNote,
      paymentResponsibility,
      utmSource,
      utmMedium,
      utmCampaign,
    }: InviteRequest = await req.json();

    // Validate input
    if (!firstName || !lastName || !email || !clientSegment) {
      throw new Error("Missing required fields");
    }

    // Generate magic token
    const magicToken = crypto.randomUUID() + "-" + Date.now();

    // Create invitation record
    const { data: invitation, error: inviteError } = await supabaseClient
      .from("prospect_invitations")
      .insert({
        email,
        advisor_id: user.id,
        magic_token: magicToken,
        client_segment: clientSegment,
        personal_note: personalNote,
        payment_responsibility: paymentResponsibility || 'client_paid',
        utm_source: utmSource,
        utm_medium: utmMedium || "advisor_invite",
        utm_campaign: utmCampaign,
      })
      .select()
      .single();

    if (inviteError) {
      throw new Error(`Failed to create invitation: ${inviteError.message}`);
    }

    // Get advisor profile for email personalization
    const { data: advisorProfile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("display_name, first_name, last_name, email")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.warn("Could not fetch advisor profile:", profileError);
    }

    const advisorName = advisorProfile?.display_name || 
                       `${advisorProfile?.first_name} ${advisorProfile?.last_name}` || 
                       advisorProfile?.email || "Your Advisor";

    // Send invitation email
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    const magicLink = `${req.headers.get("origin") || "https://your-domain.com"}/invite/${magicToken}`;

    const emailResponse = await resend.emails.send({
      from: "Boutique Family Office <noreply@bfocfo.com>",
      to: [email],
      subject: `${advisorName} has invited you to join Boutique Family Office`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1B1B32; text-align: center;">You're Invited!</h1>
          
          <p>Hello ${firstName},</p>
          
          <p>${advisorName} has invited you to join Boutique Family Office, where high-net-worth families access conflict-free financial advice and comprehensive wealth management.</p>
          
          ${personalNote ? `<div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #333;">Personal Message from ${advisorName}:</h3>
            <p style="margin: 0; font-style: italic;">"${personalNote}"</p>
          </div>` : ''}
          
          ${paymentResponsibility === 'advisor_paid' ? `
            <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
              <p style="margin: 0; color: #155724;"><strong>Complimentary Access:</strong> Your advisor has provided you with complimentary access to our platform.</p>
            </div>` : ''}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${magicLink}" 
               style="background: #3B82F6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Accept Invitation & Get Started
            </a>
          </div>
          
          <p style="font-size: 14px; color: #666;">
            This invitation will expire in 7 days. If you have any questions, feel free to reach out to ${advisorName} directly.
          </p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          
          <p style="font-size: 12px; color: #888; text-align: center;">
            This invitation was sent by ${advisorName} through Boutique Family Office.<br>
            If you didn't expect this invitation, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    console.log("Invitation sent successfully:", {
      invitationId: invitation.id,
      email,
      advisorId: user.id,
      emailResponse: emailResponse.id,
    });

    return new Response(
      JSON.stringify({
        success: true,
        invitationId: invitation.id,
        message: "Invitation sent successfully",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in leads-invite function:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);