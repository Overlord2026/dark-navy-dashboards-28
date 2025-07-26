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

    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get user from auth
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'User not authenticated' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if user has compliance officer role
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['admin', 'compliance_officer', 'system_administrator'].includes(profile.role)) {
      return new Response(JSON.stringify({ error: 'Insufficient permissions' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const {
      product_id,
      action, // 'approve', 'reject', 'request_changes'
      review_notes,
      compliance_status,
      requirements_met,
      next_review_date
    } = body;

    // Validate required fields
    if (!product_id || !action) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields: product_id, action' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Determine the new status based on action
    let newStatus;
    let complianceApproved = false;

    switch (action) {
      case 'approve':
        newStatus = 'approved';
        complianceApproved = true;
        break;
      case 'reject':
        newStatus = 'rejected';
        complianceApproved = false;
        break;
      case 'request_changes':
        newStatus = 'pending_changes';
        complianceApproved = false;
        break;
      default:
        return new Response(JSON.stringify({ 
          error: 'Invalid action. Must be: approve, reject, or request_changes' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    // Update the product status and compliance fields
    const { data: product, error: productError } = await supabaseClient
      .from('investment_products')
      .update({
        status: newStatus,
        compliance_approved: complianceApproved,
        last_compliance_check: new Date().toISOString(),
        compliance_notes: review_notes,
        next_review_date: next_review_date || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', product_id)
      .select()
      .single();

    if (productError) {
      console.error('Error updating product:', productError);
      return new Response(JSON.stringify({ error: productError.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create compliance tracking record
    const { data: tracking, error: trackingError } = await supabaseClient
      .from('product_compliance_tracking')
      .insert({
        product_id,
        review_type: 'manual_review',
        status: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'pending',
        reviewed_by: user.id,
        review_notes,
        compliance_status,
        requirements_met,
        next_review_date
      })
      .select()
      .single();

    if (trackingError) {
      console.error('Error creating tracking record:', trackingError);
      return new Response(JSON.stringify({ error: trackingError.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      product,
      tracking,
      message: `Product ${action}d successfully`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in compliance-action function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});