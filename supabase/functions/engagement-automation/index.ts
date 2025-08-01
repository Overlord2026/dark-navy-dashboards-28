import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
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

interface EngagementTrigger {
  type: 'tax_completion' | 'upsell_prompt' | 'guide_recommendation';
  clientId: string;
  cpaPartnerId: string;
  content: any;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, clientId, cpaPartnerId, content }: EngagementTrigger = await req.json();

    // Get client and CPA info
    const { data: client } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', clientId)
      .single();

    const { data: cpaPartner } = await supabase
      .from('cpa_partners')
      .select('*')
      .eq('id', cpaPartnerId)
      .single();

    if (!client || !cpaPartner) {
      throw new Error('Client or CPA partner not found');
    }

    let emailContent = '';
    let subject = '';

    switch (type) {
      case 'tax_completion':
        subject = `🎉 Your Tax Return is Complete - Next Steps Inside`;
        emailContent = `
          <h2>Congratulations ${client.first_name || 'valued client'}!</h2>
          <p>Your tax return has been successfully completed and filed. Here's what you can do next:</p>
          
          <div style="background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <h3>📚 Free Planning Guides</h3>
            <p>Access our library of tax planning guides to optimize next year's returns:</p>
            <ul>
              <li>Year-End Tax Planning Strategies</li>
              <li>Business Deduction Maximization</li>
              <li>Retirement Contribution Planning</li>
            </ul>
            <a href="${content.guidesUrl}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Planning Guides</a>
          </div>

          <div style="background: #e8f5e8; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <h3>💼 Family Office Dashboard</h3>
            <p>Ready to take your financial planning to the next level? Get access to our comprehensive Family Office platform:</p>
            <ul>
              <li>Wealth management tools</li>
              <li>Estate planning resources</li>
              <li>Investment tracking</li>
              <li>Multi-generational planning</li>
            </ul>
            <a href="${content.familyOfficeUrl}" style="background: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Explore Family Office</a>
          </div>

          <p>Questions? Reply to this email or schedule a consultation.</p>
          <p>Best regards,<br>${cpaPartner.firm_name}</p>
        `;
        break;

      case 'upsell_prompt':
        subject = `Exclusive: Upgrade to Our Family Office Platform`;
        emailContent = `
          <h2>Hello ${client.first_name || 'valued client'},</h2>
          <p>Based on your profile, you may benefit from our comprehensive Family Office services.</p>
          
          <div style="background: #fff3cd; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #ffc107;">
            <h3>🚀 What You'll Get:</h3>
            <ul>
              <li>Advanced wealth management tools</li>
              <li>Estate and succession planning</li>
              <li>Investment performance tracking</li>
              <li>Tax-efficient strategies</li>
              <li>Dedicated family office advisor</li>
            </ul>
          </div>

          <p><strong>Limited Time:</strong> 50% off setup fees for existing clients.</p>
          <a href="${content.upgradeUrl}" style="background: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Learn More</a>

          <p>Best regards,<br>${cpaPartner.firm_name}</p>
        `;
        break;

      case 'guide_recommendation':
        subject = `Personalized Planning Guide Recommendation`;
        emailContent = `
          <h2>Hi ${client.first_name || 'valued client'},</h2>
          <p>Based on your recent tax filing, we've identified some planning opportunities for you:</p>
          
          <div style="background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <h3>${content.guide.title}</h3>
            <p>${content.guide.description}</p>
            <a href="${content.guide.downloadUrl}" style="background: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Download Guide</a>
          </div>

          <p>Need help implementing these strategies? Schedule a consultation with our team.</p>
          <p>Best regards,<br>${cpaPartner.firm_name}</p>
        `;
        break;
    }

    // Send email
    const emailResult = await resend.emails.send({
      from: `${cpaPartner.firm_name} <noreply@${Deno.env.get('RESEND_DOMAIN', 'resend.dev')}>`,
      to: [client.email],
      subject,
      html: emailContent,
    });

    // Track engagement
    await supabase.from('client_engagement_history').insert({
      client_user_id: clientId,
      cpa_partner_id: cpaPartnerId,
      engagement_type: type,
      content_delivered: content,
      delivery_method: 'email',
      status: emailResult.error ? 'failed' : 'sent'
    });

    console.log('Engagement automation sent:', emailResult);

    return new Response(
      JSON.stringify({ 
        success: true, 
        emailId: emailResult.data?.id,
        message: 'Engagement automation sent successfully' 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Error in engagement automation:", error);
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