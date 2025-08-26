import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface MigrationEmailRequest {
  to: string;
  subject: string;
  text: string;
  html?: string;
  template_id?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, text, html, template_id }: MigrationEmailRequest = await req.json();

    // Validate required fields
    if (!to || !subject || !text) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: to, subject, text" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const emailResponse = await resend.emails.send({
      from: "BFO Migration <onboarding@resend.dev>", // Replace with your verified domain
      to: [to],
      subject: subject,
      text: text,
      html: html || text.replace(/\n/g, '<br>'),
    });

    console.log("Migration email sent successfully:", {
      to,
      template_id,
      emailId: emailResponse.data?.id,
    });

    return new Response(JSON.stringify({
      success: true,
      emailId: emailResponse.data?.id,
      template_id,
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-migration-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: "Failed to send migration email"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);