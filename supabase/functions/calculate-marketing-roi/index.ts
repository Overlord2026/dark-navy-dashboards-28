import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: marketingExpenses } = await supabase
      .from("practice_expenses")
      .select("*")
      .eq("category", "marketing");

    const { data: marketingRevenue } = await supabase
      .from("practice_revenue")
      .select("*")
      .not("campaign_id", "is", null);

    const totalMarketingSpend = marketingExpenses?.reduce((sum, e) => sum + Number(e.amount), 0) || 0;
    const totalMarketingRevenue = marketingRevenue?.reduce((sum, r) => sum + Number(r.amount), 0) || 0;
    
    const roi = totalMarketingSpend > 0 ? (totalMarketingRevenue - totalMarketingSpend) / totalMarketingSpend : 0;
    const roas = totalMarketingSpend > 0 ? totalMarketingRevenue / totalMarketingSpend : 0;

    const result = {
      marketing_spend: totalMarketingSpend,
      marketing_revenue: totalMarketingRevenue,
      roi: roi,
      roi_percentage: roi * 100,
      roas: roas,
      expense_count: marketingExpenses?.length || 0,
      revenue_count: marketingRevenue?.length || 0
    };

    return new Response(JSON.stringify({ ok: true, ...result }), {
      headers: { ...corsHeaders, "content-type": "application/json" }
    });
  } catch (error) {
    console.error('Error calculating marketing ROI:', error);
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "content-type": "application/json" }
    });
  }
});