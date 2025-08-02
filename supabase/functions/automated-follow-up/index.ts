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

interface FollowUpRequest {
  leadId?: string;
  followUpId?: string;
  type?: 'email' | 'sms' | 'all';
}

// Simple template engine for variable replacement
function renderTemplate(template: string, data: any): string {
  let result = template;
  
  // Replace simple variables {{variable}}
  result = result.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key] || match;
  });
  
  return result;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { leadId, followUpId, type = 'all' }: FollowUpRequest = await req.json();

    console.log("Processing follow-up request:", { leadId, followUpId, type });

    let followUpsToProcess;

    if (followUpId) {
      // Process specific follow-up
      const { data, error } = await supabase
        .from('automated_follow_ups')
        .select(`
          *,
          leads (first_name, last_name, email, phone, lead_value)
        `)
        .eq('id', followUpId)
        .eq('status', 'pending')
        .single();

      if (error || !data) {
        throw new Error(`Follow-up not found: ${error?.message}`);
      }

      followUpsToProcess = [data];
    } else if (leadId) {
      // Process all pending follow-ups for a lead
      const { data, error } = await supabase
        .from('automated_follow_ups')
        .select(`
          *,
          leads (first_name, last_name, email, phone, lead_value)
        `)
        .eq('lead_id', leadId)
        .eq('status', 'pending')
        .lte('scheduled_for', new Date().toISOString());

      if (error) {
        throw new Error(`Failed to fetch follow-ups: ${error.message}`);
      }

      followUpsToProcess = data || [];
    } else {
      // Process all due follow-ups
      const { data, error } = await supabase
        .from('automated_follow_ups')
        .select(`
          *,
          leads (first_name, last_name, email, phone, lead_value)
        `)
        .eq('status', 'pending')
        .lte('scheduled_for', new Date().toISOString())
        .limit(50); // Process up to 50 at a time

      if (error) {
        throw new Error(`Failed to fetch follow-ups: ${error.message}`);
      }

      followUpsToProcess = data || [];
    }

    let sentCount = 0;
    let failedCount = 0;
    const results = [];

    for (const followUp of followUpsToProcess) {
      try {
        // Skip if type filter doesn't match
        if (type !== 'all' && followUp.follow_up_type !== type) {
          continue;
        }

        const lead = followUp.leads;
        if (!lead) {
          console.error(`Lead not found for follow-up ${followUp.id}`);
          failedCount++;
          continue;
        }

        // Prepare template data
        const templateData = {
          name: `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || 'Valued Client',
          first_name: lead.first_name || 'Valued Client',
          last_name: lead.last_name || '',
          email: lead.email || '',
          phone: lead.phone || '',
          value: lead.lead_value ? new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            notation: 'compact'
          }).format(lead.lead_value) : '$0',
          stage: followUp.stage.replace('_', ' ')
        };

        let success = false;

        if (followUp.follow_up_type === 'email' && lead.email) {
          // Send email
          const subject = `Follow-up: ${templateData.stage}`;
          const htmlContent = renderTemplate(followUp.content || '', templateData);

          const emailResponse = await resend.emails.send({
            from: "MyBFOCFO <noreply@mybfocfo.com>",
            to: [lead.email],
            subject: subject,
            html: htmlContent,
          });

          if (emailResponse.data?.id) {
            console.log("Email sent successfully:", emailResponse.data.id);
            success = true;
          } else {
            console.error("Email failed:", emailResponse.error);
          }
        } else if (followUp.follow_up_type === 'sms' && lead.phone) {
          // SMS sending would require Twilio or similar service
          // For now, we'll log it as sent (placeholder implementation)
          console.log("SMS would be sent to:", lead.phone);
          console.log("SMS content:", renderTemplate(followUp.content || '', templateData));
          success = true; // Placeholder - implement actual SMS sending
        } else if (followUp.follow_up_type === 'call_reminder') {
          // Call reminder - just mark as sent (this would trigger a notification)
          console.log("Call reminder scheduled for:", templateData.name);
          success = true;
        }

        // Update follow-up status
        const { error: updateError } = await supabase
          .from('automated_follow_ups')
          .update({
            status: success ? 'sent' : 'failed',
            sent_at: success ? new Date().toISOString() : null
          })
          .eq('id', followUp.id);

        if (updateError) {
          console.error("Failed to update follow-up status:", updateError);
        }

        // Update lead's follow-up count
        if (success) {
          const { error: leadUpdateError } = await supabase
            .from('leads')
            .update({
              follow_up_count: (lead.follow_up_count || 0) + 1,
              last_contact_attempt: new Date().toISOString()
            })
            .eq('id', followUp.lead_id);

          if (leadUpdateError) {
            console.error("Failed to update lead follow-up count:", leadUpdateError);
          }
        }

        if (success) {
          sentCount++;
        } else {
          failedCount++;
        }

        results.push({
          followUpId: followUp.id,
          leadName: templateData.name,
          type: followUp.follow_up_type,
          status: success ? 'sent' : 'failed'
        });

      } catch (error) {
        console.error(`Error processing follow-up ${followUp.id}:`, error);
        failedCount++;
        results.push({
          followUpId: followUp.id,
          type: followUp.follow_up_type,
          status: 'failed',
          error: error.message
        });
      }
    }

    console.log(`Follow-up processing complete: ${sentCount} sent, ${failedCount} failed`);

    return new Response(JSON.stringify({ 
      success: true, 
      processed: followUpsToProcess.length,
      sent: sentCount,
      failed: failedCount,
      results
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in automated-follow-up function:", error);
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