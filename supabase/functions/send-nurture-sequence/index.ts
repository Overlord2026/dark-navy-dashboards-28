import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

    // This function would typically be called by a cron job
    // Get leads who need nurture emails based on signup date
    const now = new Date();
    const twoDaysAgo = new Date(now.getTime() - (2 * 24 * 60 * 60 * 1000));
    const fiveDaysAgo = new Date(now.getTime() - (5 * 24 * 60 * 60 * 1000));
    const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));

    // Email 2: Day 2 - Video walkthrough
    const { data: day2Leads } = await supabase
      .from('leads')
      .select('*')
      .eq('source', 'lead_magnet_download')
      .gte('created_at', twoDaysAgo.toISOString())
      .lt('created_at', new Date(twoDaysAgo.getTime() - (24 * 60 * 60 * 1000)).toISOString())
      .is('nurture_email_2_sent', null);

    if (day2Leads) {
      for (const lead of day2Leads) {
        await sendNurtureEmail2(resend, lead);
        await supabase
          .from('leads')
          .update({ nurture_email_2_sent: now.toISOString() })
          .eq('id', lead.id);
      }
    }

    // Email 3: Day 5 - Case study
    const { data: day5Leads } = await supabase
      .from('leads')
      .select('*')
      .eq('source', 'lead_magnet_download')
      .gte('created_at', fiveDaysAgo.toISOString())
      .lt('created_at', new Date(fiveDaysAgo.getTime() - (24 * 60 * 60 * 1000)).toISOString())
      .is('nurture_email_3_sent', null);

    if (day5Leads) {
      for (const lead of day5Leads) {
        await sendNurtureEmail3(resend, lead);
        await supabase
          .from('leads')
          .update({ nurture_email_3_sent: now.toISOString() })
          .eq('id', lead.id);
      }
    }

    // Email 4: Day 7 - Premium upgrade
    const { data: day7Leads } = await supabase
      .from('leads')
      .select('*')
      .eq('source', 'lead_magnet_download')
      .gte('created_at', sevenDaysAgo.toISOString())
      .lt('created_at', new Date(sevenDaysAgo.getTime() - (24 * 60 * 60 * 1000)).toISOString())
      .is('nurture_email_4_sent', null);

    if (day7Leads) {
      for (const lead of day7Leads) {
        await sendNurtureEmail4(resend, lead);
        await supabase
          .from('leads')
          .update({ nurture_email_4_sent: now.toISOString() })
          .eq('id', lead.id);
      }
    }

    return new Response(JSON.stringify({ 
      success: true,
      processed: {
        day2: day2Leads?.length || 0,
        day5: day5Leads?.length || 0,
        day7: day7Leads?.length || 0
      }
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in send-nurture-sequence function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

async function sendNurtureEmail2(resend: any, lead: any) {
  const personaVideos: Record<string, string> = {
    client: "https://example.com/client-walkthrough",
    advisor: "https://example.com/advisor-walkthrough",
    cpa: "https://example.com/cpa-walkthrough",
    attorney: "https://example.com/attorney-walkthrough",
    insurance_agent: "https://example.com/insurance-walkthrough",
    healthcare_consultant: "https://example.com/healthcare-walkthrough",
    realtor: "https://example.com/realtor-walkthrough",
    enterprise_admin: "https://example.com/admin-walkthrough",
    coach: "https://example.com/coach-walkthrough"
  };

  const videoUrl = personaVideos[lead.persona_type] || personaVideos.client;

  return await resend.emails.send({
    from: "Boutique Family Office™ <onboarding@resend.dev>",
    to: [lead.email],
    subject: "Your Personalized Platform Tour (Video)",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #1a365d;">See Your Tools in Action, ${lead.name}</h1>
        <p>Ready to see how other ${lead.persona_type.replace('_', ' ')}s are using the BFO Marketplace?</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${videoUrl}" style="background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
            Watch Your Walkthrough Video
          </a>
        </div>
        <p>This 10-minute tour shows exactly how to get the most value from your complimentary access.</p>
      </div>
    `
  });
}

async function sendNurtureEmail3(resend: any, lead: any) {
  return await resend.emails.send({
    from: "Boutique Family Office™ <onboarding@resend.dev>",
    to: [lead.email],
    subject: "Real Results: How the Miller Family Saved $2.3M",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #1a365d;">See What's Possible, ${lead.name}</h1>
        <p>The Miller family used our platform to identify tax savings opportunities that saved them $2.3 million over 3 years.</p>
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Their Results:</h3>
          <ul>
            <li>$2.3M in tax savings through strategic planning</li>
            <li>Estate plan optimized for 3 generations</li>
            <li>Investment allocation improved by 23%</li>
            <li>Healthcare costs reduced by 40%</li>
          </ul>
        </div>
        <p>Ready to discover your family's opportunities?</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://app.boutiquefamilyoffice.com/case-studies" style="background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
            Read Full Case Study
          </a>
        </div>
      </div>
    `
  });
}

async function sendNurtureEmail4(resend: any, lead: any) {
  return await resend.emails.send({
    from: "Boutique Family Office™ <onboarding@resend.dev>",
    to: [lead.email],
    subject: "Upgrade to Premium: Unlock Advanced Tools",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #1a365d;">Ready for the Full Experience, ${lead.name}?</h1>
        <p>You've been exploring our free tools. Here's what Premium unlocks:</p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Premium Features:</h3>
          <ul>
            <li>Advanced tax optimization calculators</li>
            <li>Multi-year financial projections</li>
            <li>Direct access to verified professionals</li>
            <li>Custom family office setup guidance</li>
            <li>Priority support and consultation</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://app.boutiquefamilyoffice.com/upgrade" style="background: linear-gradient(to right, #3b82f6, #8b5cf6); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
            Upgrade to Premium
          </a>
        </div>

        <p style="text-align: center; color: #666;">
          <small>Special launch pricing: $99/month (normally $299)</small>
        </p>
      </div>
    `
  });
}

serve(handler);