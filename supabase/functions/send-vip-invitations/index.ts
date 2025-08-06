import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { Resend } from 'npm:resend@4.0.0';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import React from 'npm:react@18.3.1';
import { VIPInvitationEmail } from './_templates/vip-invitation.tsx';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VIPInvitationRequest {
  organization_ids?: string[];
  single_organization_id?: string;
  custom_message?: string;
  send_method?: 'email' | 'sms' | 'both';
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string);

    const { 
      organization_ids, 
      single_organization_id, 
      custom_message,
      send_method = 'email'
    }: VIPInvitationRequest = await req.json();

    let targetOrgIds: string[] = [];
    
    if (single_organization_id) {
      targetOrgIds = [single_organization_id];
    } else if (organization_ids && organization_ids.length > 0) {
      targetOrgIds = organization_ids;
    } else {
      throw new Error('No organization IDs provided');
    }

    console.log(`Processing VIP invitations for ${targetOrgIds.length} organizations`);

    const results = [];
    
    for (const orgId of targetOrgIds) {
      try {
        // Get organization details
        const { data: org, error: orgError } = await supabaseClient
          .from('vip_organizations')
          .select('*')
          .eq('id', orgId)
          .single();

        if (orgError || !org) {
          console.error(`Organization not found: ${orgId}`, orgError);
          results.push({ organization_id: orgId, success: false, error: 'Organization not found' });
          continue;
        }

        // Generate magic link if not exists
        let magicToken = org.magic_link_token;
        if (!magicToken) {
          const { data: tokenData, error: tokenError } = await supabaseClient
            .rpc('generate_vip_magic_link', { p_organization_id: orgId });
          
          if (tokenError || !tokenData) {
            console.error(`Failed to generate magic link for ${orgId}:`, tokenError);
            results.push({ organization_id: orgId, success: false, error: 'Failed to generate magic link' });
            continue;
          }
          magicToken = tokenData;
        }

        const magicLink = `${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '')}.lovableapp.com/vip-onboard/${magicToken}`;

        // Send email invitation
        if (send_method === 'email' || send_method === 'both') {
          const emailHtml = await renderAsync(
            React.createElement(VIPInvitationEmail, {
              recipientName: org.contact_name,
              organizationName: org.organization_name,
              personaType: org.organization_type,
              magicLink,
              vipTier: org.vip_tier,
              customMessage
            })
          );

          const emailResult = await resend.emails.send({
            from: 'Tony Gomes <tony@boutiquefamilyoffice.com>',
            to: [org.contact_email],
            subject: `🎖️ VIP Founding Member: ${org.organization_name} Portal Ready`,
            html: emailHtml,
            replyTo: 'tony@boutiquefamilyoffice.com'
          });

          if (emailResult.error) {
            console.error(`Email failed for ${orgId}:`, emailResult.error);
            results.push({ organization_id: orgId, success: false, error: emailResult.error.message });
            continue;
          }

          // Log outreach
          await supabaseClient
            .from('vip_outreach_log')
            .insert({
              organization_id: orgId,
              outreach_type: 'email',
              outreach_method: 'bulk',
              template_used: 'vip_invitation',
              subject_line: `🎖️ VIP Founding Member: ${org.organization_name} Portal Ready`,
              message_content: emailHtml,
              status: 'sent',
              tracking_data: { email_id: emailResult.data?.id }
            });
        }

        // Send SMS if phone number available
        if ((send_method === 'sms' || send_method === 'both') && org.contact_phone) {
          // TODO: Implement SMS sending via Twilio
          console.log(`SMS would be sent to ${org.contact_phone} for ${org.organization_name}`);
        }

        // Update organization status
        await supabaseClient
          .from('vip_organizations')
          .update({ 
            status: 'invited',
            updated_at: new Date().toISOString()
          })
          .eq('id', orgId);

        results.push({ 
          organization_id: orgId, 
          organization_name: org.organization_name,
          success: true, 
          magic_link: magicLink 
        });

        console.log(`VIP invitation sent successfully to ${org.organization_name}`);

      } catch (error: any) {
        console.error(`Error processing organization ${orgId}:`, error);
        results.push({ organization_id: orgId, success: false, error: error.message });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    return new Response(
      JSON.stringify({
        success: true,
        message: `Processed ${targetOrgIds.length} VIP invitations: ${successCount} sent, ${failureCount} failed`,
        results,
        summary: {
          total: targetOrgIds.length,
          successful: successCount,
          failed: failureCount
        }
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error('Error in VIP invitation function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        details: 'Check function logs for more information'
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);