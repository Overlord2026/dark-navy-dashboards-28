import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AutomationTrigger {
  event_type: string;
  user_id: string;
  retirement_plan_id?: string;
  client_data?: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const trigger: AutomationTrigger = await req.json();

    if (trigger.event_type === 'retirement_roadmap_generated') {
      await processRetirementRoadmapAutomation(supabaseClient, trigger);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Error in automation-trigger function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
});

async function processRetirementRoadmapAutomation(supabaseClient: any, trigger: AutomationTrigger) {
  const { user_id, retirement_plan_id, client_data } = trigger;

  // Get user profile and preferences
  const { data: user, error: userError } = await supabaseClient
    .from('profiles')
    .select('*, user_settings')
    .eq('id', user_id)
    .single();

  if (userError || !user) {
    console.error('User not found:', user_id);
    return;
  }

  // Get retirement plan data
  const { data: retirementPlan } = await supabaseClient
    .from('retirement_plans')
    .select('*')
    .eq('id', retirement_plan_id)
    .single();

  // Get advisor information if available
  const { data: advisorProfile } = await supabaseClient
    .from('advisor_profiles')
    .select('*')
    .eq('user_id', user.advisor_id)
    .single();

  const emailData = {
    user_id,
    client_name: user.full_name || `${user.first_name} ${user.last_name}`,
    client_email: user.email,
    retirement_plan_id,
    confidence_score: retirementPlan?.confidence_score || 85,
    monte_carlo_success: retirementPlan?.monte_carlo_success || 87,
    advisor_name: advisorProfile?.name,
    advisor_firm: advisorProfile?.firm_name,
    advisor_calendly_link: advisorProfile?.calendly_url,
    portal_link: `${Deno.env.get('SITE_URL')}/retirement-roadmap/${retirement_plan_id}`,
    persona_type: user.persona_type || 'client'
  };

  const smsData = {
    user_id,
    client_name: emailData.client_name,
    phone_number: user.phone,
    retirement_plan_id,
    confidence_score: emailData.confidence_score,
    persona_type: emailData.persona_type,
    portal_link: emailData.portal_link,
    booking_link: emailData.advisor_calendly_link,
    advisor_name: emailData.advisor_name
  };

  // Schedule email sequence
  await scheduleEmailSequence(supabaseClient, emailData);

  // Schedule SMS sequence (if user opted in)
  if (user.sms_opt_in && user.phone) {
    await scheduleSMSSequence(supabaseClient, smsData);
  }

  // Log automation start
  await supabaseClient
    .from('automation_logs')
    .insert([{
      user_id,
      automation_type: 'retirement_roadmap_sequence',
      trigger_event: 'retirement_roadmap_generated',
      status: 'started',
      metadata: {
        retirement_plan_id,
        email_enabled: true,
        sms_enabled: user.sms_opt_in && !!user.phone,
        persona_type: emailData.persona_type
      }
    }]);
}

async function scheduleEmailSequence(supabaseClient: any, emailData: any) {
  const sequences = [
    { step: 1, delay_hours: 0 },      // Immediate
    { step: 2, delay_hours: 48 },     // Day 2
    { step: 3, delay_hours: 120 }     // Day 5
  ];

  for (const sequence of sequences) {
    const scheduledFor = new Date(Date.now() + (sequence.delay_hours * 60 * 60 * 1000));

    // Schedule email via edge function call
    if (sequence.delay_hours === 0) {
      // Send immediately
      await triggerEmailSend({ ...emailData, sequence_step: sequence.step });
    } else {
      // Schedule for later (in production, use a job queue like pg_cron or external scheduler)
      await supabaseClient
        .from('scheduled_emails')
        .insert([{
          user_id: emailData.user_id,
          email_type: 'retirement_roadmap_sequence',
          sequence_step: sequence.step,
          scheduled_for: scheduledFor.toISOString(),
          status: 'scheduled',
          email_data: emailData
        }]);
    }
  }
}

async function scheduleSMSSequence(supabaseClient: any, smsData: any) {
  const sequences = [
    { step: 1, delay_hours: 0 },      // Immediate
    { step: 2, delay_hours: 48 },     // Day 2  
    { step: 3, delay_hours: 120 }     // Day 5
  ];

  for (const sequence of sequences) {
    const scheduledFor = new Date(Date.now() + (sequence.delay_hours * 60 * 60 * 1000));

    if (sequence.delay_hours === 0) {
      // Send immediately
      await triggerSMSSend({ ...smsData, sequence_step: sequence.step });
    } else {
      // Schedule for later
      await supabaseClient
        .from('scheduled_sms')
        .insert([{
          user_id: smsData.user_id,
          sms_type: 'retirement_roadmap_sequence',
          sequence_step: sequence.step,
          scheduled_for: scheduledFor.toISOString(),
          status: 'scheduled',
          sms_data: smsData
        }]);
    }
  }
}

async function triggerEmailSend(emailData: any) {
  try {
    const response = await fetch(
      `${Deno.env.get('SUPABASE_URL')}/functions/v1/retirement-roadmap-email`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
        },
        body: JSON.stringify(emailData)
      }
    );

    const result = await response.json();
    console.log('Email triggered:', result);
  } catch (error) {
    console.error('Error triggering email:', error);
  }
}

async function triggerSMSSend(smsData: any) {
  try {
    const response = await fetch(
      `${Deno.env.get('SUPABASE_URL')}/functions/v1/retirement-roadmap-sms`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
        },
        body: JSON.stringify(smsData)
      }
    );

    const result = await response.json();
    console.log('SMS triggered:', result);
  } catch (error) {
    console.error('Error triggering SMS:', error);
  }
}