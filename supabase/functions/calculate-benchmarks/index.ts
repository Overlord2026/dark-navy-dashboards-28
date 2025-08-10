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

    const { data: revenue } = await supabase
      .from("practice_revenue")
      .select("*");

    const { data: expenses } = await supabase
      .from("practice_expenses")
      .select("*");

    // Calculate basic benchmarks
    const revenueSum = revenue?.reduce((sum, r) => sum + Number(r.amount), 0) || 0;
    const expenseSum = expenses?.reduce((sum, e) => sum + Number(e.amount), 0) || 0;
    const grossMargin = revenueSum > 0 ? (revenueSum - expenseSum) / revenueSum : 0;

    const benchmarks = {
      total_revenue: revenueSum,
      total_expenses: expenseSum,
      gross_margin: grossMargin,
      gross_margin_pct: grossMargin * 100,
      revenue_count: revenue?.length || 0,
      expense_count: expenses?.length || 0
    };

    return new Response(JSON.stringify({ ok: true, benchmarks }), {
      headers: { ...corsHeaders, "content-type": "application/json" }
    });
  } catch (error) {
    console.error('Error calculating benchmarks:', error);
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "content-type": "application/json" }
    });
  }
});