import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  payout_id?: string;
  notification_type?: 'payout_ready' | 'payout_approved' | 'payout_paid';
  send_all_pending?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { payout_id, notification_type, send_all_pending }: NotificationRequest = 
      await req.json();

    let notifications = [];

    if (send_all_pending) {
      // Send all pending notifications
      const { data: pendingNotifications, error } = await supabase
        .from('payout_notifications')
        .select(`
          *,
          payout:referral_payouts(
            amount,
            payout_type,
            referral:referrals(referral_code),
            advisor_override:advisor_overrides(override_percent)
          )
        `)
        .is('sent_at', null)
        .eq('email_sent', false);

      if (error) throw error;
      notifications = pendingNotifications || [];
    } else if (payout_id && notification_type) {
      // Send specific notification
      const { data: notification, error } = await supabase
        .from('payout_notifications')
        .select(`
          *,
          payout:referral_payouts(
            amount,
            payout_type,
            referral:referrals(referral_code),
            advisor_override:advisor_overrides(override_percent)
          )
        `)
        .eq('payout_id', payout_id)
        .eq('notification_type', notification_type)
        .single();

      if (error) throw error;
      if (notification) notifications = [notification];
    }

    const results = [];

    for (const notification of notifications) {
      try {
        // Get user profile for email
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('email, display_name')
          .eq('id', notification.user_id)
          .single();

        if (profileError || !profile?.email) {
          console.error('User profile not found:', notification.user_id);
          continue;
        }

        // Create email content based on notification type
        let subject = '';
        let content = '';

        switch (notification.notification_type) {
          case 'payout_ready':
            subject = 'Payout Ready for Processing';
            content = `Hi ${profile.display_name || 'there'},\n\nYour ${notification.payout.payout_type === 'referral_reward' ? 'referral reward' : 'advisor override'} payout of $${notification.payout.amount.toLocaleString()} is ready for processing.\n\nOur team will review and approve it shortly.\n\nBest regards,\nThe Team`;
            break;
          case 'payout_approved':
            subject = 'Payout Approved!';
            content = `Hi ${profile.display_name || 'there'},\n\nGreat news! Your payout of $${notification.payout.amount.toLocaleString()} has been approved and will be processed soon.\n\nYou'll receive another notification once the payment is sent.\n\nBest regards,\nThe Team`;
            break;
          case 'payout_paid':
            subject = 'Payment Sent!';
            content = `Hi ${profile.display_name || 'there'},\n\nYour payout of $${notification.payout.amount.toLocaleString()} has been sent!\n\nPlease allow 1-3 business days for the payment to appear in your account.\n\nThank you for your partnership!\n\nBest regards,\nThe Team`;
            break;
        }

        // In a real implementation, you would send an actual email here
        // For now, we'll simulate it by logging and marking as sent
        console.log(`Sending email to ${profile.email}:`);
        console.log(`Subject: ${subject}`);
        console.log(`Content: ${content}`);

        // Mark notification as sent
        const { error: updateError } = await supabase
          .from('payout_notifications')
          .update({
            sent_at: new Date().toISOString(),
            email_sent: true,
          })
          .eq('id', notification.id);

        if (updateError) throw updateError;

        results.push({
          notification_id: notification.id,
          user_email: profile.email,
          status: 'sent',
          type: notification.notification_type,
        });

      } catch (error) {
        console.error('Error sending notification:', error);
        results.push({
          notification_id: notification.id,
          status: 'failed',
          error: error.message,
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        notifications_sent: results.filter(r => r.status === 'sent').length,
        notifications_failed: results.filter(r => r.status === 'failed').length,
        results,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in send-payout-notifications function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});