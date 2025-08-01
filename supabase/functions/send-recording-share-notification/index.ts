import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ShareNotificationRequest {
  to: string;
  recordingTitle: string;
  recordingUrl: string;
  sharedBy: string;
  message?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      to, 
      recordingTitle, 
      recordingUrl, 
      sharedBy,
      message 
    }: ShareNotificationRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: "MyBFOCFO <noreply@mybfocfo.com>",
      to: [to],
      subject: `Meeting Recording Shared: ${recordingTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Meeting Recording Shared With You</h1>
          
          <p>Hi there,</p>
          
          <p>${sharedBy} has shared a meeting recording with you.</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1e40af;">Recording Details</h3>
            <p><strong>Title:</strong> ${recordingTitle}</p>
            <p><strong>Shared by:</strong> ${sharedBy}</p>
          </div>
          
          ${message ? `
          <div style="background-color: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #92400e;">Personal Message:</h4>
            <p style="margin-bottom: 0; color: #92400e; font-style: italic;">"${message}"</p>
          </div>
          ` : ''}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${recordingUrl}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 6px; display: inline-block;">
              View Recording
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px;">
            This recording is securely stored and shared through MyBFOCFO. 
            Access is limited to authorized users only.
          </p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="color: #6b7280; font-size: 12px;">
            This is an automated notification from MyBFOCFO. 
            If you believe you received this in error, please contact the sender directly.
          </p>
        </div>
      `,
    });

    console.log("Recording share notification sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-recording-share-notification function:", error);
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