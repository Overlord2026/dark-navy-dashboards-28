import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailAutomationRequest {
  action: 'enroll_in_sequence' | 'send_scheduled_emails' | 'process_engagement';
  email?: string;
  sequenceName?: string;
  submissionId?: string;
  engagementData?: any;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { action, email, sequenceName, submissionId, engagementData }: EmailAutomationRequest = await req.json();
    
    console.log('Email automation request:', { action, email, sequenceName });

    if (action === 'enroll_in_sequence' && email && sequenceName && submissionId) {
      // Find the email sequence
      const { data: sequence, error: sequenceError } = await supabase
        .from('email_sequences')
        .select('*')
        .eq('name', sequenceName)
        .eq('is_active', true)
        .single();

      if (sequenceError || !sequence) {
        console.error('Email sequence not found:', sequenceError);
        return new Response(
          JSON.stringify({ error: 'Email sequence not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check if user is already enrolled
      const { data: existingEnrollment } = await supabase
        .from('email_sequence_enrollments')
        .select('id')
        .eq('sequence_id', sequence.id)
        .eq('submission_id', submissionId)
        .single();

      if (!existingEnrollment) {
        // Enroll user in sequence
        const { error: enrollmentError } = await supabase
          .from('email_sequence_enrollments')
          .insert({
            sequence_id: sequence.id,
            submission_id: submissionId,
            email: email,
            current_step: 1,
            status: 'active'
          });

        if (enrollmentError) {
          console.error('Error enrolling in sequence:', enrollmentError);
          return new Response(
            JSON.stringify({ error: 'Failed to enroll in sequence' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log('User enrolled in email sequence:', sequenceName);
      }
    }

    if (action === 'send_scheduled_emails') {
      // This would be called by a cron job to send scheduled emails
      console.log('Processing scheduled emails...');
      
      // Get all pending email deliveries that are due
      const { data: pendingDeliveries, error: deliveriesError } = await supabase
        .from('email_sequence_deliveries')
        .select(`
          *,
          email_sequence_steps (subject, content),
          email_sequence_enrollments (email)
        `)
        .eq('status', 'pending')
        .lte('scheduled_for', new Date().toISOString());

      if (deliveriesError) {
        console.error('Error fetching pending deliveries:', deliveriesError);
        return new Response(
          JSON.stringify({ error: 'Failed to fetch deliveries' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Send each email
      if (resendApiKey && pendingDeliveries) {
        const resend = new Resend(resendApiKey);
        
        for (const delivery of pendingDeliveries) {
          try {
            // Replace template variables
            let emailContent = delivery.content;
            let emailSubject = delivery.subject;
            
            // Basic template variable replacement
            emailContent = emailContent.replace(/\{\{dashboard_url\}\}/g, `${supabaseUrl.replace('/supabase', '')}/cpa/dashboard`);
            emailContent = emailContent.replace(/\{\{video_url\}\}/g, 'https://youtu.be/demo-video');
            emailContent = emailContent.replace(/\{\{trial_url\}\}/g, `${supabaseUrl.replace('/supabase', '')}/cpa/upgrade?trial=true`);
            emailContent = emailContent.replace(/\{\{upgrade_url\}\}/g, `${supabaseUrl.replace('/supabase', '')}/cpa/upgrade`);
            emailContent = emailContent.replace(/\{\{calendar_url\}\}/g, 'https://calendly.com/bfo-team/strategy-call');

            await resend.emails.send({
              from: 'BFO CPA Team <onboarding@resend.dev>',
              to: [delivery.email_sequence_enrollments.email],
              subject: emailSubject,
              text: emailContent,
            });

            // Mark as sent
            await supabase
              .from('email_sequence_deliveries')
              .update({
                status: 'sent',
                sent_at: new Date().toISOString()
              })
              .eq('id', delivery.id);

            console.log('Email sent successfully:', delivery.id);
            
          } catch (emailError) {
            console.error('Error sending email:', emailError);
            
            // Mark as failed
            await supabase
              .from('email_sequence_deliveries')
              .update({
                status: 'failed',
                failed_reason: emailError.message
              })
              .eq('id', delivery.id);
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email automation processed successfully'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error: any) {
    console.error('Error in email-automation function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);