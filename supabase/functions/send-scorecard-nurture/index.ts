import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NurtureEmailRequest {
  email: string;
  firstName?: string;
  sequence: 'day3' | 'day7';
  score?: number;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, firstName, sequence, score }: NurtureEmailRequest = await req.json();

    let subject = "";
    let html = "";

    if (sequence === 'day3') {
      subject = "Only a few complimentary consultations left this month!";
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1e40af; font-size: 28px; margin-bottom: 10px;">
              ${firstName ? `Hi ${firstName},` : 'Hello,'} Don't miss your opportunity!
            </h1>
            <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <div style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">Limited Availability</div>
              <div style="font-size: 16px;">Only a few complimentary Family Office reviews remaining this month</div>
            </div>
          </div>

          <div style="background-color: #f8fafc; padding: 25px; border-radius: 10px; margin: 25px 0;">
            <h2 style="color: #1e40af; font-size: 20px; margin-bottom: 15px;">
              Your Retirement Confidence Score™ is waiting
            </h2>
            <p style="color: #64748b; line-height: 1.6; margin-bottom: 20px;">
              You completed our scorecard but haven't yet accessed your personalized results and roadmap. 
              This month, we have limited availability for complimentary Family Office reviews.
            </p>
            
            <div style="text-align: center; margin: 25px 0;">
              <a href="https://calendly.com/tonygomes/talk-with-tony" 
                 style="background-color: #1e40af; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; margin: 10px;">
                Secure My Complimentary Review
              </a>
            </div>
            
            <p style="color: #64748b; font-size: 14px; text-align: center; margin-top: 20px;">
              ⏰ Limited spots available - book today to secure your consultation
            </p>
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
            <p style="color: #64748b; font-size: 12px;">
              © 2024 BFO. We respect your privacy and will never share your information.
            </p>
          </div>
        </div>
      `;
    } else if (sequence === 'day7') {
      subject = "Why your personalized roadmap is the key to lasting retirement confidence";
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1e40af; font-size: 28px; margin-bottom: 10px;">
              ${firstName ? `${firstName},` : 'Hello,'} The difference between hoping and knowing
            </h1>
            <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <div style="font-size: 20px; font-weight: bold; margin-bottom: 10px;">Retirement Confidence vs. Retirement Hope</div>
              <div style="font-size: 16px;">Your personalized roadmap bridges the gap</div>
            </div>
          </div>

          <div style="background-color: #f8fafc; padding: 25px; border-radius: 10px; margin: 25px 0;">
            <h2 style="color: #1e40af; font-size: 20px; margin-bottom: 15px;">
              Most retirees have a plan. Few have a roadmap.
            </h2>
            <p style="color: #64748b; line-height: 1.6; margin-bottom: 20px;">
              Your Retirement Confidence Scorecard™ revealed where you stand today. But confidence comes from 
              knowing exactly what steps to take next—and having a fiduciary guide to help you navigate.
            </p>
            
            <div style="margin: 20px 0;">
              <h3 style="color: #1e40af; font-size: 16px; margin-bottom: 10px;">Your Customized Roadmap includes:</h3>
              <ul style="color: #64748b; line-height: 1.8; margin: 0; padding-left: 20px;">
                <li>Tax-efficient withdrawal strategy (could save $50,000+ annually)</li>
                <li>Social Security optimization timing (average $120,000 lifetime benefit)</li>
                <li>Healthcare & long-term care planning</li>
                <li>Estate & legacy optimization</li>
                <li>90-day implementation plan with CFP® guidance</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 25px 0;">
              <a href="https://calendly.com/tonygomes/talk-with-tony" 
                 style="background-color: #1e40af; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; margin: 10px;">
                Get My Personalized Roadmap
              </a>
            </div>
          </div>

          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 25px 0;">
            <h3 style="color: #92400e; font-size: 16px; margin-bottom: 10px;">The cost of waiting</h3>
            <p style="color: #92400e; margin: 0; font-size: 14px;">
              Every year without optimization costs the average pre-retiree $15,000-$30,000 in missed opportunities. 
              Your roadmap pays for itself in the first month.
            </p>
          </div>

          <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 12px;">
              © 2024 BFO. Advertising-free environment. Your data is never sold.
            </p>
          </div>
        </div>
      `;
    }

    const emailResponse = await resend.emails.send({
      from: "BFO Family Office <noreply@bfo.com>",
      to: [email],
      subject,
      html,
    });

    console.log(`Nurture sequence ${sequence} sent successfully:`, emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-scorecard-nurture function:", error);
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