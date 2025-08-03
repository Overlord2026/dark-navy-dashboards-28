import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { meeting_id, client_email, meeting_details } = await req.json();
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get meeting details from database
    const { data: meeting, error } = await supabase
      .from('meetings')
      .select('*')
      .eq('id', meeting_id)
      .single();

    if (error) {
      throw new Error(`Failed to fetch meeting: ${error.message}`);
    }

    // Format date and time
    const meetingDate = new Date(meeting.scheduled_at);
    const formattedDate = meetingDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const formattedTime = meetingDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });

    // Create calendar invite content
    let joinInfo = '';
    if (meeting.zoom_join_url) {
      joinInfo = `
        <p><strong>Join Zoom Meeting:</strong><br>
        <a href="${meeting.zoom_join_url}" style="color: #007bff;">${meeting.zoom_join_url}</a></p>
        ${meeting.zoom_meeting_id ? `<p><strong>Meeting ID:</strong> ${meeting.zoom_meeting_id}</p>` : ''}
      `;
    } else if (meeting.google_meet_link) {
      joinInfo = `
        <p><strong>Join Google Meet:</strong><br>
        <a href="${meeting.google_meet_link}" style="color: #007bff;">${meeting.google_meet_link}</a></p>
      `;
    } else if (meeting.meeting_type === 'phone') {
      joinInfo = `<p><strong>This is a phone meeting.</strong> We will call you at the scheduled time.</p>`;
    } else if (meeting.meeting_type === 'in_office') {
      joinInfo = `<p><strong>This is an in-office meeting.</strong> Please visit our office at the scheduled time.</p>`;
    }

    // Send email invitation
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Meeting Invitation</h2>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #007bff;">${meeting.title}</h3>
          
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Time:</strong> ${formattedTime}</p>
          <p><strong>Duration:</strong> ${meeting.duration_minutes} minutes</p>
          
          ${joinInfo}
        </div>
        
        <p>Hi ${meeting.client_name},</p>
        
        <p>I'm looking forward to our upcoming meeting. Please let me know if you need to reschedule or have any questions.</p>
        
        <p>Best regards,<br>
        Your Financial Advisor</p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #666;">
          This meeting invitation was sent automatically. If you need to make changes, please contact your advisor directly.
        </p>
      </div>
    `;

    const { data: emailResult, error: emailError } = await resend.emails.send({
      from: 'meetings@yourdomain.com',
      to: [client_email],
      subject: `Meeting Invitation: ${meeting.title}`,
      html: emailHtml
    });

    if (emailError) {
      throw new Error(`Failed to send email: ${emailError.message}`);
    }

    // Log the invitation
    await supabase.from('meeting_invitations').insert({
      meeting_id: meeting_id,
      client_email: client_email,
      sent_at: new Date().toISOString(),
      email_id: emailResult?.id,
      status: 'sent'
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Meeting invitation sent successfully',
        email_id: emailResult?.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error sending meeting invitation:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to send meeting invitation'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});