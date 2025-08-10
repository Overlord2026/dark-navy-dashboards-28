import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { user_id, course_id, price, source } = await req.json();

    if (!user_id || !course_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: user_id, course_id' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Record the CE sale
    const { data: sale, error: saleError } = await supabase
      .from('ce_sales')
      .insert({
        user_id,
        course_id,
        price: price || 0,
        source: source || 'unknown'
      })
      .select()
      .single();

    if (saleError) {
      console.error('Error recording CE sale:', saleError);
      return new Response(
        JSON.stringify({ error: 'Failed to record sale' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Create user progress entry
    const { error: progressError } = await supabase
      .from('user_ce_progress')
      .insert({
        user_id,
        course_id,
        status: 'enrolled'
      });

    if (progressError) {
      console.error('Error creating progress entry:', progressError);
      // Don't fail the request for this
    }

    console.log('CE sale recorded:', { sale_id: sale.id, user_id, course_id, price, source });

    return new Response(
      JSON.stringify({ 
        success: true, 
        sale_id: sale.id,
        message: 'CE sale recorded successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in record-ce-sale function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});