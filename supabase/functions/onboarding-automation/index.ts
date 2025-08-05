import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

interface OnboardingTrigger {
  userId: string;
  persona: string;
  sequenceType: 'welcome' | 'day2' | 'day3' | 'day7';
  userEmail: string;
  userName: string;
  vipStatus?: boolean;
}

const getPersonaEmailContent = (persona: string, sequenceType: string, userName: string, vipStatus = false) => {
  const personaData = {
    advisor: {
      welcome: {
        subject: "🚀 Welcome to the Future of Family Office Advisory",
        content: `
          <h2>Welcome to the Elite Advisory Network, ${userName}!</h2>
          <p>You're now part of an exclusive community of top-tier advisors revolutionizing family office services.</p>
          
          ${vipStatus ? '<div style="background: linear-gradient(135deg, #ffd700, #ffed4a); padding: 20px; border-radius: 8px; margin: 20px 0;"><h3>🌟 VIP Early Adopter Status</h3><p>You have exclusive access to premium features and direct founder support.</p></div>' : ''}
          
          <h3>🎯 What to do next:</h3>
          <ul>
            <li>Complete your advisor profile to attract high-net-worth clients</li>
            <li>Explore our AI-powered client matching system</li>
            <li>Access exclusive market research and compliance tools</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${Deno.env.get('SUPABASE_URL')}/dashboard" style="background: #3182ce; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Access Your Dashboard</a>
          </div>
        `
      },
      day2: {
        subject: "🎯 Pro Tips: Maximize Your Advisory Impact",
        content: `
          <h2>Day 2: Accelerate Your Success, ${userName}</h2>
          <p>Here are insider strategies from our top-performing advisors:</p>
          
          <h3>💡 Pro Tips:</h3>
          <ul>
            <li>Complete your specialization tags to improve client matching by 300%</li>
            <li>Upload a professional headshot - profiles with photos get 5x more engagement</li>
            <li>Set your availability calendar for seamless client booking</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${Deno.env.get('SUPABASE_URL')}/profile" style="background: #059669; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Complete Your Profile</a>
          </div>
        `
      }
    },
    cpa: {
      welcome: {
        subject: "🧮 Welcome to Next-Gen CPA Practice Management",
        content: `
          <h2>Welcome to the CPA Elite Network, ${userName}!</h2>
          <p>Transform your practice with cutting-edge family office integration tools.</p>
          
          ${vipStatus ? '<div style="background: linear-gradient(135deg, #ffd700, #ffed4a); padding: 20px; border-radius: 8px; margin: 20px 0;"><h3>🌟 VIP Early Adopter Status</h3><p>Exclusive access to advanced compliance tools and priority support.</p></div>' : ''}
          
          <h3>🎯 Start Here:</h3>
          <ul>
            <li>Set up automated client onboarding workflows</li>
            <li>Access real-time compliance monitoring</li>
            <li>Connect with family office advisory partners</li>
          </ul>
        `
      }
    },
    attorney: {
      welcome: {
        subject: "⚖️ Welcome to Elite Estate Planning Network",
        content: `
          <h2>Welcome to the Legal Excellence Hub, ${userName}!</h2>
          <p>Join the premier network for estate planning and family office legal services.</p>
          
          ${vipStatus ? '<div style="background: linear-gradient(135deg, #ffd700, #ffed4a); padding: 20px; border-radius: 8px; margin: 20px 0;"><h3>🌟 VIP Early Adopter Status</h3><p>Priority access to high-value referrals and exclusive legal resources.</p></div>' : ''}
          
          <h3>🎯 Next Steps:</h3>
          <ul>
            <li>Complete your legal specialization profile</li>
            <li>Access our document automation library</li>
            <li>Connect with family office teams needing legal expertise</li>
          </ul>
        `
      }
    }
  };

  const defaultContent = {
    welcome: {
      subject: "🌟 Welcome to Your Family Office Hub",
      content: `
        <h2>Welcome ${userName}!</h2>
        <p>You're now part of an exclusive family office community.</p>
        
        ${vipStatus ? '<div style="background: linear-gradient(135deg, #ffd700, #ffed4a); padding: 20px; border-radius: 8px; margin: 20px 0;"><h3>🌟 VIP Status</h3><p>You have exclusive early adopter access.</p></div>' : ''}
        
        <h3>Get Started:</h3>
        <ul>
          <li>Complete your profile setup</li>
          <li>Explore available services</li>
          <li>Connect with professionals in your network</li>
        </ul>
      `
    }
  };

  return personaData[persona]?.[sequenceType] || defaultContent[sequenceType] || defaultContent.welcome;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, persona, sequenceType, userEmail, userName, vipStatus }: OnboardingTrigger = await req.json();

    // Get email content for persona and sequence
    const emailContent = getPersonaEmailContent(persona, sequenceType, userName, vipStatus);

    // Send email
    const emailResult = await resend.emails.send({
      from: "Family Office Hub <onboarding@resend.dev>",
      to: [userEmail],
      subject: emailContent.subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          ${emailContent.content}
          
          <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #718096; font-size: 12px;">
              Family Office Hub - Connecting Excellence in Wealth Management
            </p>
          </div>
        </div>
      `,
    });

    // Log the email sequence event
    await supabase.from('onboarding_email_log').insert({
      user_id: userId,
      persona,
      sequence_type: sequenceType,
      email_sent_at: new Date().toISOString(),
      email_id: emailResult.data?.id,
      status: emailResult.error ? 'failed' : 'sent'
    });

    // Schedule next email in sequence
    if (sequenceType === 'welcome') {
      // Schedule day 2 email
      await supabase.from('email_schedule').insert({
        user_id: userId,
        sequence_type: 'day2',
        scheduled_for: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        persona
      });
    } else if (sequenceType === 'day2') {
      // Schedule day 3 email
      await supabase.from('email_schedule').insert({
        user_id: userId,
        sequence_type: 'day3',
        scheduled_for: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        persona
      });
    } else if (sequenceType === 'day3') {
      // Schedule day 7 email
      await supabase.from('email_schedule').insert({
        user_id: userId,
        sequence_type: 'day7',
        scheduled_for: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
        persona
      });
    }

    console.log('Onboarding email sent:', emailResult);

    return new Response(
      JSON.stringify({ 
        success: true, 
        emailId: emailResult.data?.id,
        message: 'Onboarding email sent successfully' 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Error in onboarding automation:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);