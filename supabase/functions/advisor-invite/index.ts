import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, advisorRole, segments, notes, tenantId, invitedBy } = await req.json();

    console.log('Processing advisor invitation:', { email, advisorRole, tenantId });

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Generate a secure invitation token
    const invitationToken = crypto.randomUUID() + '-' + crypto.randomUUID();

    // Store the invitation in the database
    const { data: invitation, error: dbError } = await supabaseClient
      .from('tenant_invitations')
      .insert({
        tenant_id: tenantId,
        email: email,
        invited_by: invitedBy,
        role: 'advisor',
        advisor_role: advisorRole,
        segments: segments,
        notes: notes,
        invitation_token: invitationToken,
        status: 'pending'
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error(`Failed to save invitation: ${dbError.message}`);
    }

    console.log('Invitation saved:', invitation.id);

    // Get tenant information for email branding
    const { data: tenant, error: tenantError } = await supabaseClient
      .from('tenants')
      .select('name, domain')
      .eq('id', tenantId)
      .single();

    if (tenantError) {
      console.error('Tenant lookup error:', tenantError);
    }

    const tenantName = tenant?.name || 'Your RIA Firm';
    const invitationUrl = `${Deno.env.get('SUPABASE_URL')?.replace('/v1', '')}/advisor-invite/${invitationToken}`;

    // Send invitation email using Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY not configured');
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'invitations@yourfirm.com',
        to: [email],
        subject: `Join ${tenantName} as an Advisor`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <title>Advisor Invitation</title>
            </head>
            <body style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #374151; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
                <h1 style="margin: 0; font-size: 28px; font-weight: 700;">You're Invited!</h1>
                <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Join ${tenantName} as an Advisor</p>
              </div>
              
              <div style="background: #f9fafb; padding: 25px; border-radius: 8px; border-left: 4px solid #667eea; margin-bottom: 25px;">
                <h2 style="margin: 0 0 15px 0; color: #1f2937; font-size: 20px;">Welcome to the Team!</h2>
                <p style="margin: 0; color: #6b7280;">You've been invited to join ${tenantName} as a <strong>${advisorRole}</strong>. Complete your onboarding to get started with your new role.</p>
              </div>

              ${segments && segments.length > 0 ? `
                <div style="margin-bottom: 25px;">
                  <h3 style="color: #1f2937; margin: 0 0 10px 0;">Your Client Segments:</h3>
                  <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                    ${segments.map((segment: string) => `
                      <span style="background: #e5e7eb; color: #374151; padding: 6px 12px; border-radius: 20px; font-size: 14px; font-weight: 500;">${segment}</span>
                    `).join('')}
                  </div>
                </div>
              ` : ''}

              ${notes ? `
                <div style="background: #fef3c7; border: 1px solid #fbbf24; padding: 15px; border-radius: 6px; margin-bottom: 25px;">
                  <h4 style="margin: 0 0 8px 0; color: #92400e;">Additional Notes:</h4>
                  <p style="margin: 0; color: #92400e;">${notes}</p>
                </div>
              ` : ''}

              <div style="text-align: center; margin: 35px 0;">
                <a href="${invitationUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">
                  Complete Your Onboarding
                </a>
              </div>

              <div style="background: #f3f4f6; padding: 20px; border-radius: 6px; margin-top: 25px;">
                <h4 style="margin: 0 0 10px 0; color: #374151;">What's Next?</h4>
                <ul style="margin: 0; padding-left: 20px; color: #6b7280;">
                  <li>Click the button above to access your invitation</li>
                  <li>Set up your secure password</li>
                  <li>Complete your advisor profile</li>
                  <li>Review and accept compliance requirements</li>
                  <li>Access your advisor dashboard</li>
                </ul>
              </div>

              <div style="border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 20px; text-align: center; color: #9ca3af; font-size: 14px;">
                <p style="margin: 0;">This invitation expires in 7 days.</p>
                <p style="margin: 5px 0 0 0;">If you have any questions, please contact your administrator.</p>
              </div>
            </body>
          </html>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error('Email sending failed:', errorText);
      throw new Error(`Failed to send email: ${errorText}`);
    }

    const emailResult = await emailResponse.json();
    console.log('Email sent successfully:', emailResult.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        invitationId: invitation.id,
        emailId: emailResult.id 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error processing advisor invitation:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to process invitation' 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});