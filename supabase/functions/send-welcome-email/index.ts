import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  firstName: string;
  email: string;
  profileType?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { firstName, email, profileType = "Professional" }: WelcomeEmailRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: "Family Office Marketplace <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to the Family Office Marketplace™ – Your New Dashboard is Ready!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1a365d; font-size: 28px; margin-bottom: 10px;">
              Welcome to the Family Office Marketplace™
            </h1>
            <div style="width: 60px; height: 4px; background: linear-gradient(to right, #3b82f6, #8b5cf6); margin: 0 auto;"></div>
          </div>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h2 style="color: #1e293b; font-size: 22px; margin-bottom: 15px;">
              Hi ${firstName},
            </h2>
            <p style="color: #475569; line-height: 1.6; margin-bottom: 15px;">
              Your new Family Office Marketplace™ profile is live! 🎉
            </p>
            <p style="color: #475569; line-height: 1.6;">
              Log in anytime to:
            </p>
            <ul style="color: #475569; line-height: 1.8; margin: 15px 0;">
              <li>Update your experience and credentials</li>
              <li>Access exclusive resources and networking tools</li>
              <li>Manage your privacy and notifications</li>
              <li>Connect with high-net-worth families</li>
              <li>Explore premium marketplace features</li>
            </ul>
          </div>

          <div style="text-align: center; margin-bottom: 30px;">
            <a href="${Deno.env.get('SITE_URL') || 'https://app.familyofficemarketplace.com'}/professional-dashboard" 
               style="background: linear-gradient(to right, #3b82f6, #8b5cf6); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Access My Dashboard
            </a>
          </div>

          <div style="background: #e0f2fe; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #0277bd; margin-bottom: 10px;">Need Help Getting Started?</h3>
            <p style="color: #0277bd; margin: 0;">
              Our onboarding concierge is here to help. Reply to this email or contact our support team.
            </p>
          </div>

          <div style="text-align: center; padding: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; margin-bottom: 10px;">
              Let's build the future of wealth together!
            </p>
            <p style="color: #1e293b; font-weight: bold;">
              — The Family Office Marketplace Team
            </p>
          </div>
          
          <div style="text-align: center; font-size: 12px; color: #94a3b8; margin-top: 20px;">
            <p>
              Family Office Marketplace™ | Elite Professional Network
            </p>
          </div>
        </div>
      `,
    });

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
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