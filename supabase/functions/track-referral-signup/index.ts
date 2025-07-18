import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ReferralSignupRequest {
  referralCode: string;
  userEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { referralCode, userEmail }: ReferralSignupRequest = await req.json();

    if (!referralCode || !userEmail) {
      return new Response(
        JSON.stringify({ error: 'Missing referral code or user email' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Find the referral record
    const { data: referral, error: referralError } = await supabase
      .from('referrals')
      .select('*')
      .eq('referral_code', referralCode)
      .eq('status', 'pending')
      .single();

    if (referralError || !referral) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired referral code' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if referral has expired
    if (referral.expires_at && new Date(referral.expires_at) < new Date()) {
      await supabase
        .from('referrals')
        .update({ status: 'expired' })
        .eq('id', referral.id);

      return new Response(
        JSON.stringify({ error: 'Referral code has expired' }),
        { status: 410, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Find the user by email
    const { data: users, error: userError } = await supabase.auth.admin.listUsers();
    
    if (userError) {
      console.error('Error fetching users:', userError);
      return new Response(
        JSON.stringify({ error: 'Failed to process referral' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const user = users.users.find(u => u.email === userEmail);
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update the referral with the referee ID
    const { error: updateError } = await supabase
      .from('referrals')
      .update({ 
        referee_id: user.id,
        status: 'active',
        activated_at: new Date().toISOString()
      })
      .eq('id', referral.id);

    if (updateError) {
      console.error('Error updating referral:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to process referral' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create a referral reward
    const { error: rewardError } = await supabase
      .from('referral_rewards')
      .insert({
        referral_id: referral.id,
        user_id: referral.referrer_id,
        reward_type: referral.reward_type,
        amount: referral.reward_amount,
        status: 'pending'
      });

    if (rewardError) {
      console.error('Error creating reward:', rewardError);
    }

    // If this is an advisor referral, create override record
    if (referral.referral_type === 'advisor') {
      const overridePercent = 0.05; // 5% default override
      const periodStart = new Date();
      const periodEnd = new Date();
      periodEnd.setFullYear(periodEnd.getFullYear() + 2); // 2 years

      const { error: overrideError } = await supabase
        .from('advisor_overrides')
        .insert({
          tenant_id: referral.tenant_id,
          referring_advisor_id: referral.referrer_id,
          recruited_advisor_id: user.id,
          override_percent: overridePercent,
          production_period_start: periodStart.toISOString().split('T')[0],
          production_period_end: periodEnd.toISOString().split('T')[0],
          status: 'active'
        });

      if (overrideError) {
        console.error('Error creating advisor override:', overrideError);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Referral processed successfully',
        referralType: referral.referral_type
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in track-referral-signup function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

serve(handler);