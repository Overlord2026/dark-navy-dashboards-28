import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AdvisorEmailRequest {
  to: string;
  advisorName: string;
  emailDay: number;
  personalizedData?: {
    currentAUM?: string;
    firmName?: string;
    leadSource?: string;
  };
}

const getEmailContent = (day: number, advisorName: string, personalizedData?: any) => {
  const emailTemplates = {
    0: {
      subject: "Here's how to close more clients without more hours",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #172042; font-size: 24px; margin-bottom: 20px;">
            Stop juggling tools, ${advisorName}
          </h1>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Advisors lose 30% of their opportunities to disconnected systems and missed follow-ups. 
            Our all-in-one platform fixes that and helps you grow your book of business.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #172042; margin-bottom: 15px;">See the complete solution:</h3>
            <a href="${Deno.env.get("SITE_URL")}/decks/advisor-persona" 
               style="display: inline-block; background: #FFC700; color: #172042; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              View Advisor Deck
            </a>
          </div>
          
          <p style="margin-top: 30px;">
            Ready to see how this works for your practice?
          </p>
          
          <a href="${Deno.env.get("SITE_URL")}/book-demo" 
             style="display: inline-block; background: #172042; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">
            Book Your Demo
          </a>
        </div>
      `
    },
    1: {
      subject: "See how Jane grew her book 2x in 6 months",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #172042; font-size: 24px; margin-bottom: 20px;">
            Real Results: Jane Thompson's Success Story
          </h1>
          
          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2d5a2d; margin-bottom: 15px;">The Numbers Don't Lie:</h3>
            <ul style="font-size: 16px; line-height: 1.6;">
              <li><strong>AUM Growth:</strong> $50M → $100M in 6 months</li>
              <li><strong>Lead Conversion:</strong> 15% → 32% with SWAG Lead Score™</li>
              <li><strong>Time Savings:</strong> 15 hours/week with Linda AI automation</li>
              <li><strong>Client Satisfaction:</strong> 94% retention rate</li>
            </ul>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Jane used our SWAG Lead Score™ to prioritize high-value prospects and Linda AI to automate follow-ups. 
            The result? She doubled her practice while working fewer hours.
          </p>
          
          <a href="${Deno.env.get("SITE_URL")}/case-studies/jane-thompson" 
             style="display: inline-block; background: #00D2FF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
            Read Full Case Study
          </a>
        </div>
      `
    },
    3: {
      subject: "What's your ROI potential?",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #172042; font-size: 24px; margin-bottom: 20px;">
            Calculate Your Growth Potential
          </h1>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            ${advisorName}, curious how much our platform could grow your practice? 
            Our ROI calculator shows personalized projections based on your current metrics.
          </p>
          
          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #FFC700;">
            <h3 style="color: #856404; margin-bottom: 15px;">Quick ROI Preview:</h3>
            <p style="margin-bottom: 10px;"><strong>Average advisor sees:</strong></p>
            <ul style="font-size: 16px; line-height: 1.6;">
              <li>35% increase in lead conversion</li>
              <li>12 hours/week time savings</li>
              <li>$180K additional AUM in first year</li>
              <li>ROI: 340% in 12 months</li>
            </ul>
          </div>
          
          <a href="${Deno.env.get("SITE_URL")}/roi-calculator" 
             style="display: inline-block; background: #FFC700; color: #172042; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Calculate Your ROI
          </a>
        </div>
      `
    },
    5: {
      subject: "Your compliance shield + client growth engine",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #172042; font-size: 24px; margin-bottom: 20px;">
            Stay Compliant While Growing Fast
          </h1>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            ${advisorName}, your license is your livelihood. That's why we built compliance into every feature, 
            not as an afterthought.
          </p>
          
          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1565c0; margin-bottom: 15px;">🛡️ Built-in Compliance Features:</h3>
            <ul style="font-size: 16px; line-height: 1.6;">
              <li><strong>FINRA + SEC:</strong> Investment Advisor Act compliance baked in</li>
              <li><strong>DOL Fiduciary:</strong> Standards met automatically</li>
              <li><strong>GDPR + CCPA:</strong> Data privacy compliance included</li>
              <li><strong>Audit-Ready:</strong> All communications & documents logged</li>
            </ul>
          </div>
          
          <div style="background: #f3e5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #7b1fa2; margin-bottom: 15px;">🚀 AI Automation Features:</h3>
            <ul style="font-size: 16px; line-height: 1.6;">
              <li><strong>Linda AI:</strong> Smart follow-ups with compliance checks</li>
              <li><strong>Smart Cadences:</strong> Automated sequences that follow regulations</li>
              <li><strong>Keyword Flagging:</strong> FINRA/DOL compliance monitoring</li>
              <li><strong>Activity Logs:</strong> Complete audit trail for regulators</li>
            </ul>
          </div>
          
          <p style="font-style: italic; text-align: center; margin: 20px 0; color: #666;">
            "Your tech stack should protect your license, not risk it."
          </p>
          
          <a href="${Deno.env.get("SITE_URL")}/compliance-overview" 
             style="display: inline-block; background: #172042; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
            See Compliance Features
          </a>
        </div>
      `
    },
    7: {
      subject: "Last chance to claim your annual discount",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #ffeaa7; padding: 15px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
            <h2 style="color: #d63031; margin: 0; font-size: 20px;">⏰ Limited Time Offer</h2>
          </div>
          
          <h1 style="color: #172042; font-size: 24px; margin-bottom: 20px;">
            Don't Miss Out, ${advisorName}
          </h1>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Your annual discount expires soon. Lock in your savings and start growing your book of business today.
          </p>
          
          <div style="background: #dff0d8; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #5cb85c;">
            <h3 style="color: #3c763d; margin-bottom: 15px; text-align: center;">💰 Annual Savings</h3>
            <table style="width: 100%; text-align: center;">
              <tr style="background: #f5f5f5;">
                <th style="padding: 10px; border: 1px solid #ddd;">Plan</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Monthly</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Annual</th>
                <th style="padding: 10px; border: 1px solid #ddd; color: #5cb85c;">You Save</th>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;">Basic</td>
                <td style="padding: 10px; border: 1px solid #ddd;">$59/mo</td>
                <td style="padding: 10px; border: 1px solid #ddd;">$600/year</td>
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; color: #5cb85c;">$108</td>
              </tr>
              <tr style="background: #fff3cd;">
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Pro</strong> (Most Popular)</td>
                <td style="padding: 10px; border: 1px solid #ddd;">$119/mo</td>
                <td style="padding: 10px; border: 1px solid #ddd;">$1,200/year</td>
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; color: #5cb85c;">$228</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;">Premium</td>
                <td style="padding: 10px; border: 1px solid #ddd;">$199/mo</td>
                <td style="padding: 10px; border: 1px solid #ddd;">$2,000/year</td>
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; color: #5cb85c;">$388</td>
              </tr>
            </table>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${Deno.env.get("SITE_URL")}/pricing?discount=annual" 
               style="display: inline-block; background: #d63031; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-size: 18px; font-weight: bold;">
              Claim Your Discount Now
            </a>
          </div>
          
          <p style="text-align: center; color: #666; font-style: italic;">
            Offer expires in 48 hours. Start growing your practice today.
          </p>
        </div>
      `
    }
  };

  return emailTemplates[day as keyof typeof emailTemplates] || emailTemplates[0];
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, advisorName, emailDay, personalizedData }: AdvisorEmailRequest = await req.json();

    if (!to || !advisorName || emailDay === undefined) {
      throw new Error("Missing required fields: to, advisorName, emailDay");
    }

    const emailContent = getEmailContent(emailDay, advisorName, personalizedData);

    const emailResponse = await resend.emails.send({
      from: "Advanced Wealth Management <onboarding@resend.dev>",
      to: [to],
      subject: emailContent.subject,
      html: emailContent.html,
      tags: [
        { name: "campaign", value: "advisor-sequence" },
        { name: "day", value: emailDay.toString() },
        { name: "persona", value: "advisor" }
      ]
    });

    console.log(`Advisor email sent successfully (Day ${emailDay}):`, emailResponse);

    return new Response(JSON.stringify({
      success: true,
      emailId: emailResponse.id,
      emailDay,
      advisorName,
      sentTo: to
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in send-advisor-emails function:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);