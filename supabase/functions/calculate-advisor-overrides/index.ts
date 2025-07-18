import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CalculateOverridesRequest {
  periodStart: string;
  periodEnd: string;
  advisorId?: string; // Optional: calculate for specific advisor
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

    const { periodStart, periodEnd, advisorId }: CalculateOverridesRequest = await req.json();

    if (!periodStart || !periodEnd) {
      return new Response(
        JSON.stringify({ error: 'Period start and end dates are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Calculating overrides for period ${periodStart} to ${periodEnd}`);

    // Call the database function to calculate overrides
    const { data: calculations, error: calcError } = await supabase
      .rpc('calculate_advisor_overrides', {
        p_period_start: periodStart,
        p_period_end: periodEnd
      });

    if (calcError) {
      console.error('Error calculating overrides:', calcError);
      return new Response(
        JSON.stringify({ error: 'Failed to calculate overrides' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Filter by specific advisor if provided
    const filteredCalculations = advisorId 
      ? calculations.filter((calc: any) => calc.referring_advisor_id === advisorId)
      : calculations;

    // Update override statuses where production exists
    for (const calc of filteredCalculations) {
      if (calc.production_amount > 0 && calc.override_amount > 0) {
        await supabase
          .from('advisor_overrides')
          .update({ status: 'active' })
          .eq('id', calc.override_id)
          .eq('status', 'pending');
      }
    }

    // Create payout records for active overrides
    const payoutPromises = filteredCalculations
      .filter((calc: any) => calc.override_amount > 0)
      .map(async (calc: any) => {
        // Check if payout already exists for this period
        const { data: existingPayout } = await supabase
          .from('referral_rewards')
          .select('id')
          .eq('user_id', calc.referring_advisor_id)
          .eq('reward_type', 'override')
          .gte('created_at', periodStart)
          .lte('created_at', periodEnd + 'T23:59:59')
          .single();

        if (!existingPayout) {
          // Create new payout record
          return supabase
            .from('referral_rewards')
            .insert({
              referral_id: null, // Override payouts don't need referral linkage
              user_id: calc.referring_advisor_id,
              reward_type: 'override',
              amount: calc.override_amount,
              status: 'pending',
              notes: `Override payout for period ${periodStart} to ${periodEnd}`
            });
        }
      });

    await Promise.all(payoutPromises.filter(Boolean));

    // Log the calculation event
    await supabase
      .from('audit_logs')
      .insert({
        event_type: 'advisor_overrides_calculated',
        status: 'success',
        details: {
          period_start: periodStart,
          period_end: periodEnd,
          calculations_count: filteredCalculations.length,
          total_override_amount: filteredCalculations.reduce((sum: number, calc: any) => sum + calc.override_amount, 0),
          advisor_id: advisorId
        },
        user_id: null
      });

    return new Response(
      JSON.stringify({
        success: true,
        period: { start: periodStart, end: periodEnd },
        calculations: filteredCalculations,
        summary: {
          total_overrides: filteredCalculations.length,
          total_production: filteredCalculations.reduce((sum: number, calc: any) => sum + calc.production_amount, 0),
          total_override_amount: filteredCalculations.reduce((sum: number, calc: any) => sum + calc.override_amount, 0)
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in calculate-advisor-overrides function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

serve(handler);