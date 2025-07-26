import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ScorecardEmailRequest {
  email: string;
  firstName?: string;
  score: number;
  scoreLevel: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, firstName, score, scoreLevel }: ScorecardEmailRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: "BFO Family Office <noreply@bfo.com>",
      to: [email],
      subject: "Your Retirement Confidence Score™ is Ready!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1e40af; font-size: 28px; margin-bottom: 10px;">
              ${firstName ? `Hi ${firstName},` : 'Hello,'} Your Retirement Confidence Score™ is Ready!
            </h1>
            <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <div style="font-size: 48px; font-weight: bold; margin-bottom: 10px;">${score}/100</div>
              <div style="font-size: 24px; font-weight: semibold;">${scoreLevel}</div>
            </div>
          </div>

          <div style="background-color: #f8fafc; padding: 25px; border-radius: 10px; margin: 25px 0;">
            <h2 style="color: #1e40af; font-size: 20px; margin-bottom: 15px;">
              Ready for Your Personalized Retirement Roadmap?
            </h2>
            <p style="color: #64748b; line-height: 1.6; margin-bottom: 20px;">
              Your scorecard shows where you stand today. Now let's build your customized strategy to secure your retirement and protect your legacy.
            </p>
            
            <div style="text-align: center; margin: 25px 0;">
              <a href="https://calendly.com/tonygomes/talk-with-tony" 
                 style="background-color: #1e40af; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; margin: 10px;">
                Book Complimentary Review
              </a>
              <a href="#" 
                 style="background-color: transparent; color: #1e40af; padding: 15px 30px; text-decoration: none; border: 2px solid #1e40af; border-radius: 8px; font-weight: bold; display: inline-block; margin: 10px;">
                Get Roadmap ($497)
              </a>
            </div>
          </div>

          <div style="margin: 30px 0;">
            <h3 style="color: #1e40af; font-size: 18px; margin-bottom: 15px;">Your Roadmap Includes:</h3>
            <ul style="color: #64748b; line-height: 1.8;">
              <li>✓ Tax-efficient withdrawal strategy</li>
              <li>✓ Social Security optimization timing</li>
              <li>✓ Healthcare & long-term care planning</li>
              <li>✓ Estate & legacy considerations</li>
              <li>✓ 90-day implementation plan</li>
              <li>✓ CFP® professional guidance</li>
            </ul>
          </div>

          <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin: 25px 0;">
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <span style="color: #059669; font-weight: bold;">🛡️ Boutique Family Office™ Promise</span>
            </div>
            <p style="color: #065f46; margin: 0; font-size: 14px;">
              Fiduciary duty. No commissions. No conflicts. Always acting in your best interest.
            </p>
          </div>

          <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 12px; margin: 5px 0;">
              © 2024 BFO. Investment advisory services offered through registered investment advisors.
            </p>
            <p style="color: #64748b; font-size: 12px; margin: 5px 0;">
              Have questions? <a href="mailto:support@bfo.com" style="color: #1e40af;">Contact our support team</a>
            </p>
          </div>
        </div>
      `,
    });

    console.log("Scorecard email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-scorecard-email function:", error);
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