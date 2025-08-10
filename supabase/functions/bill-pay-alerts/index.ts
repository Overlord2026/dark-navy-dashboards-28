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

    const today = new Date();
    const fiveDaysFromNow = new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000);

    const { data: bills } = await supabase
      .from("bill_pay")
      .select("*");

    const upcomingBills = bills?.filter(bill => {
      const dueDate = new Date(bill.due_date);
      return dueDate >= today && dueDate <= fiveDaysFromNow && !bill.autopay;
    });

    const overdueBills = bills?.filter(bill => {
      const dueDate = new Date(bill.due_date);
      return dueDate < today && !bill.last_paid;
    });

    const totalUpcomingAmount = upcomingBills?.reduce((sum, b) => sum + Number(b.amount), 0) || 0;
    const totalOverdueAmount = overdueBills?.reduce((sum, b) => sum + Number(b.amount), 0) || 0;

    return new Response(JSON.stringify({ 
      ok: true, 
      upcoming_bills: upcomingBills?.length || 0,
      overdue_bills: overdueBills?.length || 0,
      total_upcoming_amount: totalUpcomingAmount,
      total_overdue_amount: totalOverdueAmount,
      upcoming_details: upcomingBills,
      overdue_details: overdueBills
    }), {
      headers: { ...corsHeaders, "content-type": "application/json" }
    });
  } catch (error) {
    console.error('Error checking bill alerts:', error);
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "content-type": "application/json" }
    });
  }
});