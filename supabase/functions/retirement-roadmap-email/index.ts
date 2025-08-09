import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { Resend } from "npm:resend@4.0.0"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RetirementRoadmapEmailData {
  user_id: string;
  client_name: string;
  client_email: string;
  retirement_plan_id: string;
  confidence_score: number;
  monte_carlo_success: number;
  advisor_name?: string;
  advisor_firm?: string;
  advisor_calendly_link?: string;
  portal_link?: string;
  sequence_step: number;
  persona_type?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const emailData: RetirementRoadmapEmailData = await req.json();

    // Generate email content based on sequence step and persona
    const emailContent = generateEmailContent(emailData);

    // Send email via Resend
    const emailResponse = await resend.emails.send({
      from: `${emailData.advisor_firm || 'DarkNavy Advisors'} <roadmap@resend.dev>`,
      to: [emailData.client_email],
      subject: emailContent.subject,
      html: emailContent.html,
      attachments: emailData.sequence_step === 1 ? [
        {
          filename: 'SWAG-Retirement-Roadmap.pdf',
          path: emailContent.deckAttachmentUrl || '',
        }
      ] : undefined
    });

    // Log email automation event
    await supabaseClient
      .from('email_automation_logs')
      .insert([{
        user_id: emailData.user_id,
        email_type: 'retirement_roadmap_sequence',
        sequence_step: emailData.sequence_step,
        recipient_email: emailData.client_email,
        subject: emailContent.subject,
        status: emailResponse.error ? 'failed' : 'sent',
        resend_id: emailResponse.data?.id,
        metadata: {
          retirement_plan_id: emailData.retirement_plan_id,
          persona_type: emailData.persona_type,
          confidence_score: emailData.confidence_score
        }
      }]);

    // Track analytics event
    await supabaseClient
      .from('analytics_events')
      .insert([{
        user_id: emailData.user_id,
        event_type: 'email_sent',
        event_category: 'retirement_roadmap_automation',
        event_data: {
          sequence_step: emailData.sequence_step,
          persona_type: emailData.persona_type,
          email_type: 'retirement_roadmap_sequence'
        }
      }]);

    console.log('Retirement roadmap email sent successfully:', emailResponse);

    return new Response(JSON.stringify({
      success: true,
      email_id: emailResponse.data?.id,
      sequence_step: emailData.sequence_step
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Error in retirement-roadmap-email function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
});

function generateEmailContent(data: RetirementRoadmapEmailData) {
  const { sequence_step, persona_type, client_name, confidence_score, monte_carlo_success, advisor_name, advisor_firm, advisor_calendly_link, portal_link } = data;

  // Persona-specific messaging
  const personaConfig = getPersonaConfig(persona_type || 'client');

  switch (sequence_step) {
    case 1:
      return {
        subject: "Your SWAG™ Retirement Roadmap is Ready",
        html: generateEmail1HTML(data, personaConfig),
        deckAttachmentUrl: generateDeckPDFUrl(data.retirement_plan_id)
      };
    case 2:
      return {
        subject: "Unlock Your Retirement Confidence Score",
        html: generateEmail2HTML(data, personaConfig)
      };
    case 3:
      return {
        subject: "Turn Your Roadmap into Action",
        html: generateEmail3HTML(data, personaConfig)
      };
    default:
      throw new Error(`Invalid sequence step: ${sequence_step}`);
  }
}

function getPersonaConfig(persona_type: string) {
  switch (persona_type) {
    case 'advisor':
      return {
        tone: 'professional',
        focus: 'client engagement and conversion',
        cta_emphasis: 'Book strategy sessions'
      };
    case 'cpa':
    case 'attorney':
      return {
        tone: 'compliance-focused',
        focus: 'tax and estate integration',
        cta_emphasis: 'Professional collaboration'
      };
    default:
      return {
        tone: 'supportive',
        focus: 'financial security and peace of mind',
        cta_emphasis: 'Take action on your plan'
      };
  }
}

function generateEmail1HTML(data: RetirementRoadmapEmailData, config: any): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your SWAG™ Retirement Roadmap</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      
      <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0; color: white;">
        <h1 style="margin: 0 0 10px 0; font-size: 28px; font-weight: bold;">
          🎯 Your SWAG™ Retirement Roadmap is Ready!
        </h1>
        <p style="margin: 0; font-size: 18px; opacity: 0.9;">
          GPS for Your Financial Future
        </p>
      </div>

      <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
        
        <h2 style="color: #1e3a8a; margin: 0 0 20px 0;">Hello ${data.client_name},</h2>
        
        <p style="margin-bottom: 25px; font-size: 16px;">
          Your personalized retirement analysis is complete! Your <strong>Retirement Confidence Score is ${data.confidence_score}%</strong> 
          based on our comprehensive 4-phase SWAG GPS analysis.
        </p>

        <div style="background: #f8fafc; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #3b82f6;">
          <h3 style="color: #1e3a8a; margin: 0 0 15px 0; font-size: 18px;">What's Inside Your Roadmap:</h3>
          <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
            <li><strong>4-Phase SWAG GPS Strategy:</strong> Income Now, Income Later, Growth, Legacy</li>
            <li><strong>Monte Carlo Analysis:</strong> ${data.monte_carlo_success}% success probability across 10,000 scenarios</li>
            <li><strong>Stress Test Results:</strong> Market downturns, LTC events, inflation impacts</li>
            <li><strong>Tax Optimization:</strong> Roth conversion and withdrawal sequencing strategies</li>
            <li><strong>Estate Integration:</strong> Wealth transfer and legacy planning coordination</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 35px 0;">
          <a href="${data.portal_link || '#'}" 
             style="background: #3b82f6; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(59, 130, 246, 0.1);">
            📊 View Your Complete Roadmap
          </a>
        </div>

        <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #a7f3d0;">
          <h4 style="color: #065f46; margin: 0 0 10px 0; font-size: 16px;">📎 Attached: Your SWAG™ Retirement Deck</h4>
          <p style="margin: 0; color: #047857; font-size: 14px;">
            A comprehensive presentation of your retirement strategy, perfect for sharing with family or reviewing offline.
          </p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <p style="margin-bottom: 15px; font-size: 16px; font-weight: 600;">Ready to discuss your roadmap?</p>
          <a href="${data.advisor_calendly_link || '#'}" 
             style="background: #059669; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            📅 Book Your Follow-Up Call
          </a>
        </div>

        <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0 0 10px 0; font-weight: 600;">${data.advisor_name || 'Your Advisory Team'}</p>
          <p style="margin: 0; color: #6b7280; font-size: 14px;">${data.advisor_firm || 'Premier Wealth Management'}</p>
        </div>

      </div>

      <div style="text-align: center; margin-top: 20px; padding: 20px; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0;">
          Investment advisory services provided by registered investment adviser. 
          This analysis is for informational purposes only and does not constitute investment advice.
        </p>
      </div>

    </body>
    </html>
  `;
}

function generateEmail2HTML(data: RetirementRoadmapEmailData, config: any): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Retirement Confidence Score</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      
      <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 35px 30px; text-align: center; border-radius: 12px 12px 0 0; color: white;">
        <h1 style="margin: 0 0 10px 0; font-size: 26px; font-weight: bold;">
          🎯 Your Retirement Confidence Score: ${data.confidence_score}%
        </h1>
        <p style="margin: 0; font-size: 16px; opacity: 0.9;">
          Understanding what this means for your future
        </p>
      </div>

      <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
        
        <h2 style="color: #059669; margin: 0 0 20px 0;">Hi ${data.client_name},</h2>
        
        <p style="margin-bottom: 25px; font-size: 16px;">
          I wanted to highlight a key insight from your SWAG™ Retirement Roadmap that deserves special attention.
        </p>

        <div style="background: #f0fdfa; padding: 30px; border-radius: 12px; margin: 25px 0; text-align: center; border: 2px solid #5eead4;">
          <div style="font-size: 48px; font-weight: bold; color: #059669; margin-bottom: 10px;">
            ${data.confidence_score}%
          </div>
          <h3 style="color: #047857; margin: 0 0 15px 0;">Retirement Confidence Score</h3>
          <p style="margin: 0; color: #065f46; font-size: 14px;">
            Based on Monte Carlo analysis of 10,000 market scenarios
          </p>
        </div>

        <div style="margin: 30px 0;">
          <h3 style="color: #1e3a8a; margin: 0 0 15px 0;">What This Score Means:</h3>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;">
            ${getConfidenceScoreExplanation(data.confidence_score)}
          </div>
        </div>

        <div style="background: #fffbeb; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #fbbf24;">
          <h4 style="color: #92400e; margin: 0 0 15px 0; font-size: 16px;">🧪 Want to Test Different Scenarios?</h4>
          <p style="margin: 0 0 15px 0; color: #78350f; font-size: 14px;">
            See how your confidence score changes with different market conditions, spending levels, or retirement dates.
          </p>
          <ul style="margin: 0; padding-left: 20px; color: #78350f; font-size: 14px;">
            <li>Market downturn in early retirement</li>
            <li>Higher or lower spending scenarios</li>
            <li>Earlier or later retirement dates</li>
            <li>Long-term care event impacts</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 35px 0;">
          <a href="${data.portal_link || '#'}?tab=scenarios" 
             style="background: #f59e0b; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
            🔬 Try a "What-If" Scenario
          </a>
        </div>

        <div style="text-align: center; margin: 30px 0; padding: 20px; background: #f9fafb; border-radius: 8px;">
          <p style="margin-bottom: 15px; font-size: 16px; font-weight: 600;">Questions about your score?</p>
          <a href="${data.advisor_calendly_link || '#'}" 
             style="background: #6b7280; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            💬 Ask ${data.advisor_name?.split(' ')[0] || 'Your Advisor'}
          </a>
        </div>

      </div>

      <div style="text-align: center; margin-top: 20px; padding: 20px; color: #6b7280; font-size: 12px;">
        <p style="margin: 0;">
          Confidence scores are based on historical market data and Monte Carlo analysis. 
          Past performance does not guarantee future results.
        </p>
      </div>

    </body>
    </html>
  `;
}

function generateEmail3HTML(data: RetirementRoadmapEmailData, config: any): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Turn Your Roadmap into Action</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      
      <div style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); padding: 35px 30px; text-align: center; border-radius: 12px 12px 0 0; color: white;">
        <h1 style="margin: 0 0 10px 0; font-size: 26px; font-weight: bold;">
          🚀 Turn Your Roadmap into Action
        </h1>
        <p style="margin: 0; font-size: 16px; opacity: 0.9;">
          Success stories and your next steps
        </p>
      </div>

      <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
        
        <h2 style="color: #7c3aed; margin: 0 0 20px 0;">Hi ${data.client_name},</h2>
        
        <p style="margin-bottom: 25px; font-size: 16px;">
          You've got a solid roadmap with a ${data.confidence_score}% confidence score. Now let's put it into action! 
          Here's how clients like you have succeeded with similar plans.
        </p>

        <div style="background: #faf5ff; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #a855f7;">
          <h3 style="color: #7c3aed; margin: 0 0 15px 0; font-size: 18px;">📈 Success Story: Similar Confidence Score</h3>
          <p style="margin-bottom: 15px; font-style: italic; color: #6b46c1;">
            "We had an 89% confidence score and were nervous about market volatility. 
            After implementing the SWAG GPS strategy, we sleep better knowing we have 
            a plan for any scenario."
          </p>
          <p style="margin: 0; font-size: 14px; color: #8b5cf6;">
            — Tom & Linda, Retired 2023
          </p>
        </div>

        <div style="margin: 30px 0;">
          <h3 style="color: #1e3a8a; margin: 0 0 20px 0;">🎯 Your Priority Action Steps:</h3>
          
          <div style="space-y: 15px;">
            <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
              <div style="background: #3b82f6; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; margin-right: 15px; flex-shrink: 0;">1</div>
              <div>
                <p style="margin: 0 0 5px 0; font-weight: 600;">Optimize Your Asset Allocation</p>
                <p style="margin: 0; font-size: 14px; color: #6b7280;">Phase-specific allocation adjustments identified in your roadmap</p>
              </div>
            </div>
            
            <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
              <div style="background: #059669; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; margin-right: 15px; flex-shrink: 0;">2</div>
              <div>
                <p style="margin: 0 0 5px 0; font-weight: 600;">Begin Roth Conversion Strategy</p>
                <p style="margin: 0; font-size: 14px; color: #6b7280;">Tax-efficient conversion plan to optimize long-term withdrawals</p>
              </div>
            </div>
            
            <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
              <div style="background: #dc2626; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; margin-right: 15px; flex-shrink: 0;">3</div>
              <div>
                <p style="margin: 0 0 5px 0; font-weight: 600;">Review Estate Planning Documents</p>
                <p style="margin: 0; font-size: 14px; color: #6b7280;">Ensure beneficiaries and estate strategy align with retirement plan</p>
              </div>
            </div>
          </div>
        </div>

        <div style="background: #dc2626; color: white; padding: 20px; border-radius: 8px; margin: 30px 0; text-align: center;">
          <h4 style="margin: 0 0 15px 0; font-size: 18px;">⏰ Limited Time: Strategy Session</h4>
          <p style="margin: 0 0 20px 0; font-size: 14px; opacity: 0.9;">
            Book your implementation call this week and receive a complimentary estate planning review ($500 value).
          </p>
          <a href="${data.advisor_calendly_link || '#'}" 
             style="background: white; color: #dc2626; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            📅 Schedule Your Strategy Call
          </a>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <p style="margin-bottom: 15px; font-size: 16px;">Other ways to get started:</p>
          <div style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;">
            <a href="${data.portal_link || '#'}" 
               style="background: #f3f4f6; color: #374151; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-size: 14px; display: inline-block;">
              📊 Review Full Analysis
            </a>
            <a href="#" 
               style="background: #f3f4f6; color: #374151; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-size: 14px; display: inline-block;">
              💬 Chat with Linda AI
            </a>
          </div>
        </div>

      </div>

      <div style="text-align: center; margin-top: 20px; padding: 20px; color: #6b7280; font-size: 12px;">
        <p style="margin: 0;">
          Ready to make your retirement roadmap a reality? We're here to help every step of the way.
        </p>
      </div>

    </body>
    </html>
  `;
}

function getConfidenceScoreExplanation(score: number): string {
  if (score >= 90) {
    return `
      <p style="margin: 0; color: #065f46;">
        <strong>Excellent:</strong> Your retirement plan shows strong resilience across market scenarios. 
        You're well-positioned to maintain your lifestyle through various economic conditions.
      </p>
    `;
  } else if (score >= 80) {
    return `
      <p style="margin: 0; color: #065f46;">
        <strong>Very Good:</strong> Your plan demonstrates solid preparation for retirement. 
        A few optimizations could further strengthen your position against market volatility.
      </p>
    `;
  } else if (score >= 70) {
    return `
      <p style="margin: 0; color: #92400e;">
        <strong>Good:</strong> Your foundation is solid, but there are opportunities to improve your 
        confidence score through strategic adjustments to your savings or investment approach.
      </p>
    `;
  } else {
    return `
      <p style="margin: 0; color: #92400e;">
        <strong>Needs Attention:</strong> Your plan would benefit from significant adjustments to 
        improve your retirement security. Let's discuss strategies to strengthen your position.
      </p>
    `;
  }
}

function generateDeckPDFUrl(retirementPlanId: string): string {
  // This would generate the actual PDF URL for the SWAG deck
  return `${Deno.env.get('SITE_URL') || 'http://localhost:5173'}/api/generate-deck-pdf/${retirementPlanId}`;
}