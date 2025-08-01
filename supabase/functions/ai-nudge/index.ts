import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
      status: 405, headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const resend = new Resend(Deno.env.get('RESEND_API_KEY') ?? '');

    // Check for nudge triggers
    await supabase.rpc('check_nudge_triggers');

    // Get pending nudges that need to be sent
    const { data: pendingNudges, error: nudgeError } = await supabase
      .from('nudge_history')
      .select(`
        *,
        ai_nudge_rules(
          *,
          communication_templates(*)
        ),
        profiles(email, display_name)
      `)
      .is('response_received_at', null)
      .gte('nudge_sent_at', new Date(Date.now() - 5 * 60 * 1000).toISOString()) // Last 5 minutes
      .join('profiles', 'client_user_id', 'id');

    if (nudgeError) {
      throw new Error('Failed to fetch pending nudges');
    }

    let sentCount = 0;
    let failedCount = 0;

    for (const nudge of pendingNudges || []) {
      try {
        const rule = nudge.ai_nudge_rules;
        const template = rule.communication_templates;
        
        if (!template) continue;

        // Generate personalized nudge content
        let content = template.content;
        let subject = template.subject || 'Important: Action Required';

        // Replace variables
        content = content.replace('{{client_name}}', nudge.profiles?.display_name || 'Client');
        content = content.replace('{{trigger_reason}}', nudge.trigger_reason);
        content = content.replace('{{days_overdue}}', rule.days_threshold.toString());
        
        subject = subject.replace('{{client_name}}', nudge.profiles?.display_name || 'Client');

        // Add AI-generated urgency based on trigger
        const urgencyMap = {
          'missing_docs': 'We notice you haven\'t uploaded the required documents yet.',
          'overdue_response': 'Your tax organizer is still pending completion.',
          'incomplete_organizer': 'Please complete your tax organizer to avoid delays.',
          'pending_signature': 'Your signature is needed to proceed with filing.'
        };

        const urgencyText = urgencyMap[rule.trigger_condition] || 'Action required for your tax preparation.';
        content = content.replace('{{urgency_text}}', urgencyText);

        // Send nudge email
        await resend.emails.send({
          from: 'CPA Portal <onboarding@resend.dev>',
          to: [nudge.profiles?.email],
          subject: subject,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">Friendly Reminder</h2>
              <div style="background: #fef3c7; padding: 16px; border-left: 4px solid #f59e0b; margin: 16px 0;">
                <strong>${urgencyText}</strong>
              </div>
              <div style="margin: 20px 0;">
                ${content}
              </div>
              <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; font-size: 14px; color: #6b7280;">
                  Need help? Reply to this email or call our office. We're here to make this process as smooth as possible.
                </p>
              </div>
            </div>
          `
        });

        sentCount++;
        console.log(`Nudge sent to ${nudge.profiles?.email} for ${rule.trigger_condition}`);

      } catch (error) {
        console.error('Failed to send nudge:', error);
        failedCount++;
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      nudges_sent: sentCount,
      nudges_failed: failedCount 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });

  } catch (error: any) {
    console.error('AI nudge error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
};

serve(handler);