import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting onboarding reminder job...');

    // Find abandoned onboarding sessions (inactive for 24+ hours)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    const { data: abandonedProgress, error: progressError } = await supabase
      .from('onboarding_flow_progress')
      .select(`
        *,
        user:user_id (
          email,
          raw_user_meta_data
        )
      `)
      .eq('status', 'in_progress')
      .lt('last_active_at', twentyFourHoursAgo)
      .is('abandonment_reminder_sent_at', null)
      .limit(50); // Process in batches

    if (progressError) {
      console.error('Error fetching abandoned progress:', progressError);
      throw progressError;
    }

    console.log(`Found ${abandonedProgress?.length || 0} abandoned onboarding sessions`);

    for (const progress of abandonedProgress || []) {
      try {
        const userEmail = progress.user?.email;
        const userName = progress.user?.raw_user_meta_data?.first_name || 'there';
        
        if (!userEmail) {
          console.log(`Skipping progress ${progress.id} - no email found`);
          continue;
        }

        // Send reminder email
        const emailResponse = await resend.emails.send({
          from: "Family Office Platform <onboarding@yourdomain.com>",
          to: [userEmail],
          subject: "Complete Your Onboarding - Your Progress is Saved",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #1a365d; text-align: center;">Continue Your Onboarding</h1>
              
              <p>Hi ${userName},</p>
              
              <p>We noticed you started setting up your account but haven't finished yet. Good news - your progress has been saved!</p>
              
              <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin: 0 0 10px 0; color: #2d3748;">Your Progress:</h3>
                <div style="background: #e2e8f0; border-radius: 4px; padding: 4px;">
                  <div style="background: #4299e1; height: 8px; border-radius: 4px; width: ${progress.progress_percentage}%;"></div>
                </div>
                <p style="margin: 10px 0 0 0; font-size: 14px; color: #4a5568;">
                  ${Math.round(progress.progress_percentage)}% complete - Step ${progress.current_step} of ${progress.total_steps}
                </p>
              </div>
              
              <p>It only takes a few more minutes to complete your setup and unlock access to our platform.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${Deno.env.get('SITE_URL') || 'https://yoursite.com'}/onboarding" 
                   style="background: #4299e1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
                  Continue Onboarding
                </a>
              </div>
              
              <p style="font-size: 14px; color: #718096;">
                Need help? Simply reply to this email or contact our support team.
              </p>
              
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
              
              <p style="font-size: 12px; color: #a0aec0; text-align: center;">
                You're receiving this because you started onboarding with us. If you'd prefer not to receive these reminders, 
                you can <a href="${Deno.env.get('SITE_URL') || 'https://yoursite.com'}/unsubscribe" style="color: #4299e1;">unsubscribe here</a>.
              </p>
            </div>
          `,
        });

        console.log(`Reminder email sent to ${userEmail}:`, emailResponse);

        // Mark reminder as sent
        const { error: updateError } = await supabase
          .from('onboarding_flow_progress')
          .update({
            abandonment_reminder_sent_at: new Date().toISOString()
          })
          .eq('id', progress.id);

        if (updateError) {
          console.error(`Error updating reminder status for ${progress.id}:`, updateError);
        }

        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`Error processing reminder for progress ${progress.id}:`, error);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed: abandonedProgress?.length || 0,
        message: `Sent ${abandonedProgress?.length || 0} onboarding reminder emails`
      }),
      { 
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );

  } catch (error) {
    console.error('Error in onboarding reminder function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }
});