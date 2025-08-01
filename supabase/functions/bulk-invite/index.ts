import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BulkInviteRequest {
  invitations: {
    email: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    companyName?: string;
    clientType: string;
    businessStructure?: string;
    customMessage?: string;
  }[];
  welcomeVideoUrl?: string;
  cpaPartnerId: string;
  invitedBy?: string;
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
    const { invitations, welcomeVideoUrl, cpaPartnerId, invitedBy }: BulkInviteRequest = await req.json();

    console.log(`Processing bulk invite for ${invitations.length} clients`);

    // Get CPA partner details for branding
    const { data: cpaPartner, error: partnerError } = await supabaseClient
      .from('cpa_partners')
      .select('firm_name, contact_email, branding_config')
      .eq('id', cpaPartnerId)
      .single();

    if (partnerError) {
      throw new Error(`Failed to get CPA partner: ${partnerError.message}`);
    }

    const results = [];

    for (const invitation of invitations) {
      try {
        // Create invitation record
        const { data: inviteRecord, error: inviteError } = await supabaseClient
          .from('cpa_client_invitations')
          .insert({
            cpa_partner_id: cpaPartnerId,
            email: invitation.email,
            phone: invitation.phone,
            first_name: invitation.firstName,
            last_name: invitation.lastName,
            company_name: invitation.companyName,
            client_type: invitation.clientType,
            business_structure: invitation.businessStructure,
            custom_message: invitation.customMessage,
            welcome_video_url: welcomeVideoUrl,
            invited_by: invitedBy,
            status: 'pending'
          })
          .select()
          .single();

        if (inviteError) {
          console.error('Failed to create invitation:', inviteError);
          results.push({
            email: invitation.email,
            success: false,
            error: inviteError.message
          });
          continue;
        }

        // Generate invitation URL
        const inviteUrl = `${Deno.env.get('SUPABASE_URL')?.replace('/rest/v1', '')}/client/onboard/${inviteRecord.invitation_token}`;
        
        // Prepare email content
        const clientName = invitation.firstName && invitation.lastName 
          ? `${invitation.firstName} ${invitation.lastName}`
          : invitation.companyName || invitation.email;

        const brandingConfig = cpaPartner.branding_config || {};
        const primaryColor = brandingConfig.primaryColor || '#1B1B32';
        
        const emailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to ${cpaPartner.firm_name}</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, ${primaryColor}, ${brandingConfig.secondaryColor || '#2D2D4A'}); padding: 40px 30px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">
                  Welcome to ${cpaPartner.firm_name}
                </h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">
                  Your trusted tax and accounting partner
                </p>
              </div>
              
              <!-- Content -->
              <div style="padding: 40px 30px;">
                <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">
                  Hello ${clientName}!
                </h2>
                
                <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                  You've been invited to join our secure client portal. This will be your central hub for:
                </p>
                
                <ul style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 30px 20px;">
                  <li>Uploading tax documents securely</li>
                  <li>Completing your tax organizer</li>
                  <li>Tracking your return status</li>
                  <li>Communicating with your tax professional</li>
                  <li>E-signing documents</li>
                </ul>

                ${invitation.customMessage ? `
                  <div style="background-color: #f3f4f6; border-left: 4px solid ${primaryColor}; padding: 16px 20px; margin: 20px 0; border-radius: 0 4px 4px 0;">
                    <p style="color: #374151; margin: 0; font-style: italic;">
                      "${invitation.customMessage}"
                    </p>
                  </div>
                ` : ''}

                ${welcomeVideoUrl ? `
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${welcomeVideoUrl}" style="display: inline-block; background-color: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
                      📹 Watch Welcome Video
                    </a>
                  </div>
                ` : ''}
                
                <!-- CTA Button -->
                <div style="text-align: center; margin: 40px 0;">
                  <a href="${inviteUrl}" style="display: inline-block; background-color: ${primaryColor}; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                    Get Started Now
                  </a>
                </div>
                
                <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 30px 0 0 0; text-align: center;">
                  This invitation will expire in 30 days. If you have any questions, please contact us at 
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

        // Send invitation email
        const emailResponse = await resend.emails.send({
          from: `${cpaPartner.firm_name} <onboarding@resend.dev>`,
          to: [invitation.email],
          subject: `Welcome to ${cpaPartner.firm_name} - Complete Your Onboarding`,
          html: emailHtml,
        });

        if (emailResponse.error) {
          throw new Error(`Email send failed: ${emailResponse.error.message}`);
        }

        // Update invitation status
        await supabaseClient
          .from('cpa_client_invitations')
          .update({ 
            status: 'sent', 
            sent_at: new Date().toISOString() 
          })
          .eq('id', inviteRecord.id);

        console.log(`Invitation sent successfully to ${invitation.email}`);
        
        results.push({
          email: invitation.email,
          success: true,
          invitationId: inviteRecord.id,
          inviteUrl: inviteUrl
        });

      } catch (error) {
        console.error(`Failed to process invitation for ${invitation.email}:`, error);
        results.push({
          email: invitation.email,
          success: false,
          error: error.message
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    console.log(`Bulk invite completed: ${successCount} successful, ${failureCount} failed`);

    return new Response(
      JSON.stringify({ 
        success: true,
        summary: {
          total: invitations.length,
          successful: successCount,
          failed: failureCount
        },
        results 
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
    console.error("Error in bulk-invite function:", error);
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