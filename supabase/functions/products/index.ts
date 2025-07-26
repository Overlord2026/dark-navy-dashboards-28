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
      const category = url.searchParams.get('category');
      const status = url.searchParams.get('status');
      const search = url.searchParams.get('search');
      const ria = url.searchParams.get('ria');
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '20');
      const offset = (page - 1) * limit;

      let query = supabaseClient
        .from('investment_products')
        .select(`
          *,
          investment_categories:category_id (
            id,
            name,
            description
          )
        `)
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });

      if (category) {
        query = query.eq('category_id', category);
      }
      if (status) {
        query = query.eq('status', status);
      }
      if (ria) {
        query = query.eq('ria_firm', ria);
      }
      if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
      }

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching products:', error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ 
        products: data, 
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit)
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'POST') {
      const body = await req.json();
      const {
        id,
        name,
        description,
        category_id,
        ria_firm,
        minimum_investment,
        maximum_investment,
        risk_level,
        fee_structure,
        asset_allocation,
        eligibility_requirements,
        status = 'pending_approval',
        ...otherFields
      } = body;

      // Validate required fields
      if (!name || !description || !category_id) {
        return new Response(JSON.stringify({ 
          error: 'Missing required fields: name, description, category_id' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      let result;
      if (id) {
        // Update existing product
        const { data, error } = await supabaseClient
          .from('investment_products')
          .update({
            name,
            description,
            category_id,
            ria_firm,
            minimum_investment,
            maximum_investment,
            risk_level,
            fee_structure,
            asset_allocation,
            eligibility_requirements,
            status,
            updated_at: new Date().toISOString(),
            ...otherFields
          })
          .eq('id', id)
          .select()
          .single();

        result = { data, error };
      } else {
        // Create new product
        const { data, error } = await supabaseClient
          .from('investment_products')
          .insert({
            name,
            description,
            category_id,
            ria_firm,
            minimum_investment,
            maximum_investment,
            risk_level,
            fee_structure,
            asset_allocation,
            eligibility_requirements,
            status,
            ...otherFields
          })
          .select()
          .single();

        result = { data, error };
      }

      if (result.error) {
        console.error('Error saving product:', result.error);
        return new Response(JSON.stringify({ error: result.error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ product: result.data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in products function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});