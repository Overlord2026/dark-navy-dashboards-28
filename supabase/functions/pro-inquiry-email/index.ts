import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ProInquiryEmailRequest {
  pro_slug: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pro_slug, name, email, phone, message }: ProInquiryEmailRequest = await req.json();

    console.log('Processing pro inquiry email for:', { pro_slug, name, email });

    const emailResponse = await resend.emails.send({
      from: "BFO Marketplace <onboarding@resend.dev>",
      to: ["contact@boutiquefamilyoffice.com"],
      subject: `New Advisor Inquiry - ${name}`,
      html: `
        <h2>New Advisor Marketplace Inquiry</h2>
        <p><strong>Advisor:</strong> ${pro_slug}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
        <p><em>Inquiry submitted at: ${new Date().toISOString()}</em></p>
      `,
    });

    console.log("Pro inquiry email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailId: emailResponse.data?.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in pro-inquiry-email function:", error);
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