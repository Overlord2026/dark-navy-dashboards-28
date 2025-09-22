import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const resend = new Resend(Deno.env.get('RESEND_API_KEY') ?? '');

interface AdvancedEmailRequest {
  action: 'execute_trigger' | 'send_campaign' | 'optimize_timing' | 'ab_test';
  trigger_id?: string;
  campaign_id?: string;
  user_event?: any;
  personalization_data?: any;
  execute_at?: string;
  ab_variant?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      action,
      trigger_id,
      campaign_id,
      user_event,
      personalization_data,
      execute_at,
      ab_variant
    }: AdvancedEmailRequest = await req.json();
    
    console.log('Advanced email automation request:', { action, trigger_id, campaign_id });

    if (action === 'execute_trigger' && trigger_id && user_event && personalization_data) {
      // Get trigger configuration (in production this would be from database)
      const triggerConfig = await getTriggerConfig(trigger_id);
      
      if (!triggerConfig) {
        throw new Error('Trigger configuration not found');
      }

      // Get email template for this trigger
      const emailTemplate = await getEmailTemplate(triggerConfig.template_id || 'default');
      
      // Apply dynamic personalization
      const personalizedEmail = await personalizeEmail(emailTemplate, personalization_data);
      
      // Optimize send timing if requested
      const sendTime = triggerConfig.optimal_timing 
        ? await optimizeSendTime(user_event.user_id, personalization_data)
        : new Date(execute_at || Date.now());

      // Schedule or send immediately
      if (sendTime.getTime() > Date.now()) {
        await scheduleEmail(personalizedEmail, sendTime, user_event.user_id);
      } else {
        await sendEmailNow(personalizedEmail, user_event.user_id, personalization_data);
      }

      // Log trigger execution
      await logTriggerExecution(trigger_id, user_event, personalizedEmail);

      return new Response(JSON.stringify({
        success: true,
        message: 'Trigger executed successfully',
        send_time: sendTime.toISOString()
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    if (action === 'send_campaign' && campaign_id) {
      // Get campaign configuration
      const campaign = await getCampaignConfig(campaign_id);
      
      if (!campaign) {
        throw new Error('Campaign not found');
      }

      // Process A/B testing if enabled
      if (campaign.ab_test_enabled && campaign.subject_variants.length > 1) {
        const variant = ab_variant || selectABVariant(campaign.subject_variants);
        await sendCampaignWithABTest(campaign, variant, personalization_data);
      } else {
        await sendCampaign(campaign, personalization_data);
      }

      return new Response(JSON.stringify({
        success: true,
        message: 'Campaign sent successfully'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    if (action === 'optimize_timing') {
      // Analyze user behavior to determine optimal send times
      const optimalTimes = await analyzeOptimalTiming(personalization_data);
      
      return new Response(JSON.stringify({
        success: true,
        optimal_times: optimalTimes
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    return new Response(JSON.stringify({
      error: 'Invalid action or missing parameters'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });

  } catch (error: any) {
    console.error('Error in advanced-email-automation:', error);
    
    return new Response(JSON.stringify({
      error: error.message || 'Failed to process advanced email automation'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
};

async function getTriggerConfig(triggerId: string) {
  // In production, this would fetch from database
  // For now, return a default configuration
  return {
    id: triggerId,
    template_id: 'behavioral_trigger',
    optimal_timing: true,
    personalization_enabled: true,
    ab_test_enabled: false
  };
}

async function getEmailTemplate(templateId: string) {
  // Template library for different trigger types
  const templates: Record<string, any> = {
    'default': {
      subject: "Welcome back, {{first_name}}!",
      html_content: `
        <h1>Hi {{first_name}},</h1>
        <p>We noticed you've been exploring our {{persona}} tools. Here's something that might interest you:</p>
        
        {{#if engagement_level}}
        {{#eq engagement_level 'high'}}
        <p>As one of our most engaged users, you might be interested in our premium features:</p>
        <ul>
          {{#each relevant_tools}}
          <li>{{this}}</li>
          {{/each}}
        </ul>
        {{/eq}}
        
        {{#eq engagement_level 'medium'}}
        <p>We've seen you're making good progress! Here are some tools that can help you take it to the next level:</p>
        {{/eq}}
        
        {{#eq engagement_level 'low'}}
        <p>Let's get you started with some quick wins. Here are the most popular tools for {{persona}}s:</p>
        {{/eq}}
        {{/if}}
        
        <p>Last time you used our platform: {{last_activity}}</p>
        <p>Your profile completion: {{profile_completion}}%</p>
        
        <a href="{{dashboard_url}}" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
          Continue Your Journey
        </a>
        
        <p>Best regards,<br>The Family Office Team</p>
      `
    },
    'behavioral_trigger': {
      subject: "{{first_name}}, let's build on your progress",
      html_content: `
        <h1>Great to see you exploring, {{first_name}}!</h1>
        
        <p>We noticed you've been using {{#if favorite_tools}}{{favorite_tools.[0]}}{{else}}our platform{{/if}} - that's exactly what successful {{persona}}s do.</p>
        
        {{#if company}}
        <p>For {{company}}, we recommend:</p>
        {{else}}
        <p>Based on your {{persona}} profile, we recommend:</p>
        {{/if}}
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Personalized Recommendations:</h3>
          <ul style="list-style: none; padding: 0;">
            {{#each relevant_tools}}
            <li style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
              ✓ {{this}}
            </li>
            {{/each}}
          </ul>
        </div>
        
        {{#gt profile_completion 80}}
        <p>Your profile is looking great at {{profile_completion}}% complete! You're ready for advanced features.</p>
        {{else}}
        <p>Complete your profile ({{profile_completion}}% done) to unlock personalized recommendations.</p>
        {{/gt}}
        
        <p style="color: #64748b; font-size: 14px;">
          Optimal time for you: {{optimal_send_time}} | Engagement level: {{engagement_level}}
        </p>
      `
    }
  };

  return templates[templateId] || templates['default'];
}

async function personalizeEmail(template: any, data: any) {
  // Advanced personalization using Handlebars-like templating
  let subject = template.subject;
  let content = template.html_content;
  
  // Simple variable replacement
  Object.entries(data).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    subject = subject.replace(regex, String(value || ''));
    content = content.replace(regex, String(value || ''));
  });

  // Handle conditional blocks (simplified)
  content = processConditionals(content, data);
  
  // Handle loops (simplified)
  content = processLoops(content, data);

  return {
    subject,
    html_content: content,
    personalization_data: data
  };
}

function processConditionals(content: string, data: any): string {
  // Handle {{#if variable}} blocks
  const ifRegex = /{{#if\s+([^}]+)}}([\s\S]*?){{\/if}}/g;
  content = content.replace(ifRegex, (match, condition, block) => {
    const value = data[condition.trim()];
    return value ? block : '';
  });

  // Handle {{#eq variable value}} blocks
  const eqRegex = /{{#eq\s+([^}]+)\s+['"](.*?)['"]}}([\s\S]*?){{\/eq}}/g;
  content = content.replace(eqRegex, (match, variable, value, block) => {
    const varValue = data[variable.trim()];
    return varValue === value ? block : '';
  });

  // Handle {{#gt variable number}} blocks
  const gtRegex = /{{#gt\s+([^}]+)\s+(\d+)}}([\s\S]*?){{\/gt}}/g;
  content = content.replace(gtRegex, (match, variable, threshold, block) => {
    const varValue = Number(data[variable.trim()]);
    return varValue > Number(threshold) ? block : '';
  });

  return content;
}

function processLoops(content: string, data: any): string {
  // Handle {{#each array}} blocks
  const eachRegex = /{{#each\s+([^}]+)}}([\s\S]*?){{\/each}}/g;
  content = content.replace(eachRegex, (match, arrayName, block) => {
    const array = data[arrayName.trim()];
    if (!Array.isArray(array)) return '';
    
    return array.map((item: any) => 
      block.replace(/{{this}}/g, String(item))
    ).join('');
  });

  return content;
}

async function optimizeSendTime(userId: string, personalizationData: any): Promise<Date> {
  // Use personalization data to determine optimal send time
  const optimalHour = personalizationData.optimal_send_time || '10:00';
  const [hour, minute] = optimalHour.split(':').map(Number);
  
  const sendTime = new Date();
  sendTime.setHours(hour, minute || 0, 0, 0);
  
  // If time has passed today, schedule for tomorrow
  if (sendTime.getTime() <= Date.now()) {
    sendTime.setDate(sendTime.getDate() + 1);
  }
  
  return sendTime;
}

async function scheduleEmail(email: any, sendTime: Date, userId: string) {
  // In production, this would store in database for scheduled sending
  console.log(`Email scheduled for ${sendTime.toISOString()} for user ${userId}`);
  
  // For demo, we'll just log the scheduling
  return {
    scheduled: true,
    send_time: sendTime.toISOString(),
    user_id: userId
  };
}

async function sendEmailNow(email: any, userId: string, personalizationData: any) {
  const recipientEmail = personalizationData.email || 'demo@example.com';
  
  try {
    const emailResponse = await resend.emails.send({
      from: `${personalizationData.persona} Team <onboarding@resend.dev>`,
      to: [recipientEmail],
      subject: email.subject,
      html: email.html_content
    });

    console.log('Advanced email sent successfully:', emailResponse);
    
    // Log to analytics
    await logEmailSent(userId, email, emailResponse);
    
    return emailResponse;
  } catch (error) {
    console.error('Error sending advanced email:', error);
    throw error;
  }
}

async function getCampaignConfig(campaignId: string) {
  // In production, fetch from database
  return {
    id: campaignId,
    name: 'Advanced Campaign',
    subject_variants: ['Subject A', 'Subject B'],
    content_template: 'Welcome to advanced automation!',
    ab_test_enabled: true,
    personalization_enabled: true
  };
}

function selectABVariant(variants: string[]): string {
  return variants[Math.floor(Math.random() * variants.length)];
}

async function sendCampaignWithABTest(campaign: any, variant: string, personalizationData: any) {
  // Implement A/B testing logic
  console.log(`Sending A/B test variant: ${variant}`);
  
  // Send email with selected variant
  const email = {
    subject: variant,
    html_content: campaign.content_template,
    personalization_data: personalizationData
  };
  
  await sendEmailNow(email, personalizationData.user_id, personalizationData);
}

async function sendCampaign(campaign: any, personalizationData: any) {
  // Send regular campaign without A/B testing
  const email = {
    subject: campaign.subject_variants[0],
    html_content: campaign.content_template,
    personalization_data: personalizationData
  };
  
  await sendEmailNow(email, personalizationData.user_id, personalizationData);
}

async function analyzeOptimalTiming(personalizationData: any) {
  // Analyze user behavior patterns to suggest optimal send times
  return {
    best_day: 'Tuesday',
    best_time: personalizationData.optimal_send_time || '10:00',
    timezone: personalizationData.timezone || 'UTC',
    engagement_pattern: 'Morning high activity'
  };
}

async function logTriggerExecution(triggerId: string, userEvent: any, email: any) {
  console.log('Trigger executed:', {
    trigger_id: triggerId,
    user_id: userEvent.user_id,
    event_type: userEvent.event_type,
    email_subject: email.subject,
    timestamp: new Date().toISOString()
  });
}

async function logEmailSent(userId: string, email: any, response: any) {
  console.log('Email sent:', {
    user_id: userId,
    subject: email.subject,
    resend_id: response.data?.id,
    timestamp: new Date().toISOString()
  });
}

serve(handler);