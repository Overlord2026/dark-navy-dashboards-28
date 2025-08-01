import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

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
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Set the user session
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Authentication failed');
    }

    const { action, ...payload } = await req.json();

    switch (action) {
      case 'create_firm':
        return await createFirm(supabase, payload);
      case 'update_firm':
        return await updateFirm(supabase, payload);
      case 'add_user_to_firm':
        return await addUserToFirm(supabase, payload);
      case 'remove_user_from_firm':
        return await removeUserFromFirm(supabase, payload);
      case 'initiate_handoff':
        return await initiateHandoff(supabase, payload);
      case 'approve_handoff':
        return await approveHandoff(supabase, payload);
      case 'calculate_analytics':
        return await calculateAnalytics(supabase, payload);
      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('Error in firm-management function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function createFirm(supabase: any, payload: any) {
  const { name, contact_email, parent_tenant_id, settings = {} } = payload;
  
  // Generate slug from name
  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  
  const { data: firm, error } = await supabase
    .from('firms')
    .insert({
      name,
      slug: `${slug}-${Date.now()}`, // Ensure uniqueness
      contact_email,
      parent_tenant_id,
      settings,
      status: 'active'
    })
    .select()
    .single();

  if (error) throw error;

  // Log the action
  await supabase.rpc('log_firm_action', {
    p_action_type: 'firm_created',
    p_firm_id: firm.id,
    p_details: { name, contact_email }
  });

  return new Response(
    JSON.stringify({ firm }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function updateFirm(supabase: any, payload: any) {
  const { firm_id, updates } = payload;
  
  const { data: firm, error } = await supabase
    .from('firms')
    .update(updates)
    .eq('id', firm_id)
    .select()
    .single();

  if (error) throw error;

  // Log the action
  await supabase.rpc('log_firm_action', {
    p_action_type: 'firm_updated',
    p_firm_id: firm.id,
    p_details: { updates }
  });

  return new Response(
    JSON.stringify({ firm }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function addUserToFirm(supabase: any, payload: any) {
  const { firm_id, user_email, role, permissions = {} } = payload;
  
  // Find user by email
  const { data: userProfile, error: userError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', user_email)
    .single();

  if (userError || !userProfile) {
    throw new Error('User not found');
  }

  const { data: assignment, error } = await supabase
    .from('firm_users')
    .upsert({
      firm_id,
      user_id: userProfile.id,
      role,
      permissions,
      is_active: true
    })
    .select()
    .single();

  if (error) throw error;

  // Log the action
  await supabase.rpc('log_firm_action', {
    p_action_type: 'user_added_to_firm',
    p_firm_id: firm_id,
    p_resource_type: 'user',
    p_resource_id: userProfile.id,
    p_details: { user_email, role }
  });

  return new Response(
    JSON.stringify({ assignment }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function removeUserFromFirm(supabase: any, payload: any) {
  const { firm_id, user_id } = payload;
  
  const { error } = await supabase
    .from('firm_users')
    .update({ is_active: false })
    .eq('firm_id', firm_id)
    .eq('user_id', user_id);

  if (error) throw error;

  // Log the action
  await supabase.rpc('log_firm_action', {
    p_action_type: 'user_removed_from_firm',
    p_firm_id: firm_id,
    p_resource_type: 'user',
    p_resource_id: user_id
  });

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function initiateHandoff(supabase: any, payload: any) {
  const { 
    firm_id, 
    new_owner_email, 
    reason, 
    client_notification_template,
    transfer_items 
  } = payload;
  
  // Get current owner
  const { data: currentOwner, error: ownerError } = await supabase
    .from('firm_users')
    .select('user_id')
    .eq('firm_id', firm_id)
    .eq('role', 'owner')
    .eq('is_active', true)
    .single();

  if (ownerError) throw ownerError;

  const { data: handoff, error } = await supabase
    .from('firm_handoffs')
    .insert({
      firm_id,
      current_owner_id: currentOwner.user_id,
      new_owner_email,
      reason,
      client_notification_template,
      transfer_items: transfer_items || {},
      initiated_by: currentOwner.user_id,
      status: 'pending'
    })
    .select()
    .single();

  if (error) throw error;

  // Log the action
  await supabase.rpc('log_firm_action', {
    p_action_type: 'handoff_initiated',
    p_firm_id: firm_id,
    p_resource_type: 'handoff',
    p_resource_id: handoff.id,
    p_details: { new_owner_email, reason }
  });

  return new Response(
    JSON.stringify({ handoff }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function approveHandoff(supabase: any, payload: any) {
  const { handoff_id, approved } = payload;
  
  const updates = approved ? {
    master_admin_approval: true,
    master_admin_approved_at: new Date().toISOString(),
    status: 'approved'
  } : {
    status: 'cancelled'
  };

  const { data: handoff, error } = await supabase
    .from('firm_handoffs')
    .update(updates)
    .eq('id', handoff_id)
    .select()
    .single();

  if (error) throw error;

  // Log the action
  await supabase.rpc('log_firm_action', {
    p_action_type: approved ? 'handoff_approved' : 'handoff_rejected',
    p_firm_id: handoff.firm_id,
    p_resource_type: 'handoff',
    p_resource_id: handoff_id
  });

  return new Response(
    JSON.stringify({ handoff }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function calculateAnalytics(supabase: any, payload: any) {
  const { parent_tenant_id, period_start, period_end } = payload;
  
  const { data: analyticsId, error } = await supabase
    .rpc('calculate_rollup_analytics', {
      p_parent_tenant_id: parent_tenant_id,
      p_period_start: period_start,
      p_period_end: period_end
    });

  if (error) throw error;

  // Fetch the calculated analytics
  const { data: analytics, error: fetchError } = await supabase
    .from('rollup_analytics')
    .select('*')
    .eq('id', analyticsId)
    .single();

  if (fetchError) throw fetchError;

  return new Response(
    JSON.stringify({ analytics }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}