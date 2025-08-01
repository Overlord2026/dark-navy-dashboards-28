import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface RecordingNotificationRequest {
  to: string;
  userName: string;
  meetingTitle: string;
  recordingUrl: string;
  meetingDate: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      to, 
      userName, 
      meetingTitle, 
      recordingUrl, 
      meetingDate 
    }: RecordingNotificationRequest = await req.json();

    const formattedDate = new Date(meetingDate).toLocaleDateString();

    const emailResponse = await resend.emails.send({
      from: "MyBFOCFO <noreply@mybfocfo.com>",
      to: [to],
      subject: `Meeting Recording Available: ${meetingTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Meeting Recording Available</h1>
          
          <p>Hi ${userName},</p>
          
          <p>Your meeting recording is now available for viewing and download.</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1e40af;">Meeting Details</h3>
            <p><strong>Title:</strong> ${meetingTitle}</p>
            <p><strong>Date:</strong> ${formattedDate}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${recordingUrl}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 6px; display: inline-block;">
              View Recording
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px;">
            This recording is securely stored in your account vault. 
            You can access it anytime through your dashboard.
          </p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="color: #6b7280; font-size: 12px;">
            This is an automated notification from MyBFOCFO. 
            If you have any questions, please contact your advisor.
          </p>
        </div>
      `,
    });

    console.log("Recording notification sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-recording-notification function:", error);
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