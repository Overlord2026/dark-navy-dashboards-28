import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    if (req.method === 'GET') {
      const url = new URL(req.url);
      const userId = url.searchParams.get('user_id');
      const productId = url.searchParams.get('product_id');
      const interestType = url.searchParams.get('interest_type');

      let query = supabaseClient
        .from('user_product_interests_marketplace')
        .select(`
          *,
          investment_products:product_id (
            id,
            name,
            description,
            ria_firm,
            minimum_investment,
            status
          )
        `)
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }
      if (productId) {
        query = query.eq('product_id', productId);
      }
      if (interestType) {
        query = query.eq('interest_type', interestType);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching user interests:', error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ interests: data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'POST') {
      const body = await req.json();
      const {
        product_id,
        interest_type = 'watchlist',
        notes,
        investment_amount,
        contact_preferences
      } = body;

      // Validate required fields
      if (!product_id) {
        return new Response(JSON.stringify({ 
          error: 'Missing required field: product_id' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Get user ID from auth
      const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
      if (userError || !user) {
        return new Response(JSON.stringify({ error: 'User not authenticated' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Check if interest already exists
      const { data: existingInterest } = await supabaseClient
        .from('user_product_interests_marketplace')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', product_id)
        .eq('interest_type', interest_type)
        .single();

      if (existingInterest) {
        return new Response(JSON.stringify({ 
          error: 'Interest already exists for this product and type' 
        }), {
          status: 409,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { data, error } = await supabaseClient
        .from('user_product_interests_marketplace')
        .insert({
          user_id: user.id,
          product_id,
          interest_type,
          notes,
          investment_amount,
          contact_preferences
        })
        .select(`
          *,
          investment_products:product_id (
            id,
            name,
            description,
            ria_firm,
            minimum_investment,
            status
          )
        `)
        .single();

      if (error) {
        console.error('Error saving user interest:', error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ interest: data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'DELETE') {
      const url = new URL(req.url);
      const id = url.searchParams.get('id');
      const productId = url.searchParams.get('product_id');
      const interestType = url.searchParams.get('interest_type');

      // Get user ID from auth
      const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
      if (userError || !user) {
        return new Response(JSON.stringify({ error: 'User not authenticated' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      let query = supabaseClient
        .from('user_product_interests_marketplace')
        .delete()
        .eq('user_id', user.id);

      if (id) {
        query = query.eq('id', id);
      } else if (productId && interestType) {
        query = query.eq('product_id', productId).eq('interest_type', interestType);
      } else {
        return new Response(JSON.stringify({ 
          error: 'Either id or (product_id and interest_type) must be provided' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { error } = await query;

      if (error) {
        console.error('Error deleting user interest:', error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in user-interests function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});