import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface ProcessRewardRequest {
  userId: string;
  planType: string;
  planAmount: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, planType, planAmount }: ProcessRewardRequest = await req.json();
    
    console.log('Processing referral reward for user:', userId, 'Plan:', planType, 'Amount:', planAmount);

    // Process the referral reward using the database function
    const { error } = await supabase.rpc('process_referral_reward', {
      p_referred_user_id: userId,
      p_plan_type: planType,
      p_plan_amount: planAmount
    });

    if (error) {
      console.error('Error processing referral reward:', error);
      return new Response(JSON.stringify({ 
        error: error.message,
        success: false 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if any rewards were created
    const { data: rewards, error: rewardsError } = await supabase
      .from('referral_rewards')
      .select('*')
      .eq('referrer_user_id', userId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(1);

    if (rewardsError) {
      console.error('Error fetching reward data:', rewardsError);
    }

    console.log('Referral reward processed successfully for user:', userId);

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Referral reward processed successfully',
      reward: rewards?.[0] || null
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in process-referral-reward function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});