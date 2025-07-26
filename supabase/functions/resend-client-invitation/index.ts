import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { invitationId } = await req.json();

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get invitation details
    const { data: invitation, error: invitationError } = await supabaseClient
      .from('client_invitations')
      .select(`
        *,
        profiles!advisor_id (
          display_name,
          first_name,
          last_name
        )
      `)
      .eq('id', invitationId)
      .single();

    if (invitationError || !invitation) {
      throw new Error('Invitation not found');
    }

    // Update invitation expiry date
    const newExpiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    await supabaseClient
      .from('client_invitations')
      .update({ expires_at: newExpiryDate })
      .eq('id', invitationId);

    // Send email
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    const inviteLink = `${req.headers.get("origin")}/onboard/${invitation.invite_token}`;
    const advisorName = invitation.profiles?.display_name || 
                       `${invitation.profiles?.first_name} ${invitation.profiles?.last_name}`;

    const emailResponse = await resend.emails.send({
      from: "DarkNavy Advisors <onboarding@resend.dev>",
      to: [invitation.email],
      subject: "Reminder: Complete Your Onboarding Process",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1a365d; margin-bottom: 10px;">Reminder: Complete Your Onboarding</h1>
            <p style="color: #4a5568; font-size: 16px;">
              Hi ${invitation.first_name}, you haven't completed your onboarding process yet.
            </p>
          </div>

          <div style="background: #fef5e7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ed8936;">
            <p style="color: #2d3748; margin: 0;">
              Your onboarding process is still pending. Please complete it as soon as possible 
              to begin working with ${advisorName}.
            </p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${inviteLink}" 
               style="background: #3182ce; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Continue Onboarding
            </a>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #718096; font-size: 12px; margin: 0;">
              This invitation link will expire in 7 days from today. 
              If you have any questions, please contact ${advisorName} directly.
            </p>
          </div>
        </div>
      `,
    });

    console.log("Reminder email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in resend-client-invitation function:", error);
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