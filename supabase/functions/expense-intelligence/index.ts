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

    const { data: expenses } = await supabase
      .from("practice_expenses")
      .select("*")
      .eq("is_recurring", true);

    const { data: benchmarks } = await supabase
      .from("vendor_benchmarks")
      .select("*");

    // Analyze recurring expenses against benchmarks
    const expenseAnalysis = expenses?.map(expense => {
      const benchmark = benchmarks?.find(b => 
        b.vendor_name.toLowerCase() === expense.vendor?.toLowerCase() ||
        b.category.toLowerCase() === expense.category?.toLowerCase()
      );

      const isOverBenchmark = benchmark && expense.amount > benchmark.avg_cost;
      const savings = benchmark ? Math.max(0, expense.amount - benchmark.avg_cost) : 0;

      return {
        ...expense,
        benchmark_cost: benchmark?.avg_cost || null,
        over_benchmark: isOverBenchmark,
        potential_savings: savings,
        recommendation: isOverBenchmark ? 'Consider renegotiating or switching vendors' : 'Cost within benchmark'
      };
    });

    const totalPotentialSavings = expenseAnalysis?.reduce((sum, e) => sum + (e.potential_savings || 0), 0) || 0;
    const overBenchmarkCount = expenseAnalysis?.filter(e => e.over_benchmark).length || 0;

    return new Response(JSON.stringify({ 
      ok: true, 
      recurring_expenses: expenses?.length || 0,
      expense_analysis: expenseAnalysis,
      total_potential_savings: totalPotentialSavings,
      over_benchmark_count: overBenchmarkCount
    }), {
      headers: { ...corsHeaders, "content-type": "application/json" }
    });
  } catch (error) {
    console.error('Error analyzing expenses:', error);
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "content-type": "application/json" }
    });
  }
});