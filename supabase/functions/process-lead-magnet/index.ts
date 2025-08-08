import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LeadMagnetRequest {
  name: string;
  email: string;
  phone?: string;
  persona: string;
  source: string;
}

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

    const { name, email, phone, persona, source }: LeadMagnetRequest = await req.json();

    console.log("Processing lead magnet signup:", { name, email, persona, source });

    // Create lead record
    const { data: leadData, error: leadError } = await supabase
      .from('leads')
      .insert({
        name,
        email,
        phone,
        source,
        persona_type: persona,
        lead_status: 'new',
        lead_score: 25, // Initial score for lead magnet downloads
        notes: `Downloaded BFO Wealth & Health Playbook as ${persona}`
      })
      .select()
      .single();

    if (leadError) {
      console.error("Error creating lead:", leadError);
      throw leadError;
    }

    // Create basic user account for dashboard access
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: Math.random().toString(36).slice(-12), // Temporary password
      email_confirm: true,
      user_metadata: {
        name,
        role: persona,
        phone,
        source: 'lead_magnet',
        lead_id: leadData.id
      }
    });

    if (authError) {
      console.error("Error creating user:", authError);
      // Continue even if user creation fails
    }

    // Send welcome email with download link
    const downloadUrl = "https://example.com/bfo-wealth-health-playbook.pdf"; // Replace with actual PDF URL
    
    const emailResponse = await resend.emails.send({
      from: "Boutique Family Office™ <onboarding@resend.dev>",
      to: [email],
      subject: "Your BFO Wealth & Health Playbook is Ready!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1a365d; font-size: 28px; margin-bottom: 10px;">
              Welcome to the Boutique Family Office™ Marketplace
            </h1>
            <div style="width: 60px; height: 4px; background: linear-gradient(to right, #3b82f6, #8b5cf6); margin: 0 auto;"></div>
          </div>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h2 style="color: #1e293b; font-size: 22px; margin-bottom: 15px;">
              Hi ${name},
            </h2>
            <p style="color: #475569; line-height: 1.6; margin-bottom: 15px;">
              Thank you for downloading our Wealth & Health Playbook! Your guide to ultra-wealthy family strategies is ready.
            </p>
          </div>

          <div style="text-align: center; margin-bottom: 30px;">
            <a href="${downloadUrl}" 
               style="background: linear-gradient(to right, #3b82f6, #8b5cf6); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Download Your Guide
            </a>
          </div>

          <div style="background: #e0f2fe; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #0277bd; margin-bottom: 10px;">Your Complimentary Platform Access</h3>
            <p style="color: #0277bd; margin-bottom: 15px;">
              We've also set up your free BFO Marketplace account with tools designed specifically for ${persona.replace('_', ' ')}s.
            </p>
            <a href="https://app.boutiquefamilyoffice.com/login" 
               style="background: #0277bd; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Access My Dashboard
            </a>
          </div>

          <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #334155; margin-bottom: 15px;">What's Coming Next:</h3>
            <ul style="color: #64748b; line-height: 1.8; margin: 0; padding-left: 20px;">
              <li>Day 2: Personalized video walkthrough of your tools</li>
              <li>Day 5: Case study showing real results from families like yours</li>
              <li>Day 7: Exclusive invitation to upgrade to Premium features</li>
            </ul>
          </div>

          <div style="text-align: center; padding: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; margin-bottom: 10px;">
              Questions? We're here to help!
            </p>
            <p style="color: #1e293b;">
              Email: <a href="mailto:support@boutiquefamilyoffice.com" style="color: #3b82f6;">support@boutiquefamilyoffice.com</a> | 
              Phone: <a href="tel:+15551234567" style="color: #3b82f6;">(555) 123-4567</a>
            </p>
          </div>
        </div>
      `,
    });

    console.log("Welcome email sent successfully:", emailResponse);

    // Schedule follow-up emails (you could use a separate cron job or queue system)
    // For now, we'll just log the intent
    console.log("Scheduling follow-up sequence for lead:", leadData.id);

    return new Response(JSON.stringify({ 
      success: true, 
      leadId: leadData.id,
      userId: authUser?.user?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in process-lead-magnet function:", error);
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