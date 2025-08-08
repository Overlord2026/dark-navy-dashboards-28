import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Account {
  name: string;
  value: number;
  asset_class?: string;
  tax_deferred?: boolean;
}

interface FeeTier {
  breakpoint: number;
  advisory_bps: number;
  platform_bps?: number;
  fund_bps?: number;
  trading_flat?: number;
}

interface FeeModel {
  name: string;
  tiers: FeeTier[];
}

interface CalcRequest {
  accounts: Account[];
  current_model: FeeModel;
  proposed_model: FeeModel;
  assumptions: {
    growth_pct?: number;
    horizon_years?: number;
    turnover_pct?: number;
  };
  demo?: boolean;
}

interface LineItem {
  category: string;
  current_annual: number;
  proposed_annual: number;
  difference: number;
}

interface CalcResponse {
  summary: {
    aum: number;
    current_total: number;
    proposed_total: number;
    annual_savings: number;
    ten_year_savings: number;
    cumulative_savings_with_growth: number;
  };
  line_items: LineItem[];
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Parse request body
    const body: CalcRequest = await req.json();
    const { accounts, current_model, proposed_model, assumptions, demo = false } = body;

    console.log('Fee calculation request:', { 
      accounts: accounts.length, 
      current_model: current_model.name, 
      proposed_model: proposed_model.name,
      demo 
    });

    // Validate required fields
    if (!accounts || !current_model || !proposed_model) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // If not demo mode and not authenticated, require auth
    if (!demo) {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        return new Response(JSON.stringify({ error: 'Authentication required for non-demo calculations' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Calculate total AUM
    const totalAUM = accounts.reduce((sum, account) => sum + account.value, 0);

    // Default assumptions
    const growthRate = (assumptions.growth_pct || 5) / 100;
    const horizonYears = assumptions.horizon_years || 10;
    const turnoverRate = (assumptions.turnover_pct || 10) / 100;

    // Helper function to calculate fees for a model
    const calculateModelFees = (model: FeeModel, aum: number) => {
      let remainingAUM = aum;
      let totalAdvisoryFee = 0;
      let totalPlatformFee = 0;
      let totalFundFee = 0;
      let totalTradingFee = 0;

      // Sort tiers by breakpoint
      const sortedTiers = [...model.tiers].sort((a, b) => a.breakpoint - b.breakpoint);

      for (let i = 0; i < sortedTiers.length; i++) {
        const tier = sortedTiers[i];
        const nextBreakpoint = i < sortedTiers.length - 1 ? sortedTiers[i + 1].breakpoint : Infinity;
        
        const tierAUM = Math.min(remainingAUM, nextBreakpoint - tier.breakpoint);
        if (tierAUM <= 0) break;

        // Calculate fees in basis points (divide by 10000 to convert to decimal)
        totalAdvisoryFee += tierAUM * (tier.advisory_bps / 10000);
        totalPlatformFee += tierAUM * ((tier.platform_bps || 0) / 10000);
        totalFundFee += tierAUM * ((tier.fund_bps || 0) / 10000);
        totalTradingFee += (tier.trading_flat || 0) * 12; // Assume monthly trading fees

        remainingAUM -= tierAUM;
        if (remainingAUM <= 0) break;
      }

      return {
        advisory: totalAdvisoryFee,
        platform: totalPlatformFee,
        fund: totalFundFee,
        trading: totalTradingFee,
        total: totalAdvisoryFee + totalPlatformFee + totalFundFee + totalTradingFee
      };
    };

    // Calculate fees for both models
    const currentFees = calculateModelFees(current_model, totalAUM);
    const proposedFees = calculateModelFees(proposed_model, totalAUM);

    // Create line items
    const lineItems: LineItem[] = [
      {
        category: 'Advisory Fees',
        current_annual: currentFees.advisory,
        proposed_annual: proposedFees.advisory,
        difference: currentFees.advisory - proposedFees.advisory
      },
      {
        category: 'Platform Fees',
        current_annual: currentFees.platform,
        proposed_annual: proposedFees.platform,
        difference: currentFees.platform - proposedFees.platform
      },
      {
        category: 'Fund Expenses',
        current_annual: currentFees.fund,
        proposed_annual: proposedFees.fund,
        difference: currentFees.fund - proposedFees.fund
      },
      {
        category: 'Trading Costs',
        current_annual: currentFees.trading,
        proposed_annual: proposedFees.trading,
        difference: currentFees.trading - proposedFees.trading
      }
    ];

    const annualSavings = currentFees.total - proposedFees.total;
    const tenYearSavings = annualSavings * horizonYears;
    
    // Calculate cumulative savings with growth (compound the annual savings)
    const cumulativeSavingsWithGrowth = annualSavings * (((1 + growthRate) ** horizonYears - 1) / growthRate);

    const response: CalcResponse = {
      summary: {
        aum: totalAUM,
        current_total: currentFees.total,
        proposed_total: proposedFees.total,
        annual_savings: annualSavings,
        ten_year_savings: tenYearSavings,
        cumulative_savings_with_growth: cumulativeSavingsWithGrowth
      },
      line_items: lineItems
    };

    // Log the event if not demo
    if (!demo) {
      try {
        const { data: user } = await supabase.auth.getUser();
        if (user.user) {
          await supabase.rpc('log_fee_event', {
            p_event_type: 'fee_calc_run',
            p_payload: {
              aum: totalAUM,
              current_model: current_model.name,
              proposed_model: proposed_model.name,
              annual_savings: annualSavings
            }
          });
        }
      } catch (logError) {
        console.error('Error logging event:', logError);
      }
    }

    console.log('Fee calculation completed:', response.summary);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Error in fees-calc function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
};

serve(handler);