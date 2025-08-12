import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PlanDraftRequest {
  title: string;
  description?: string;
  role: 'cmo' | 'cfo' | 'coo' | 'clo' | 'ceo';
  content: any;
  estimatedBudget?: number;
  estimatedDurationDays?: number;
  targetStartDate?: string;
  targetEndDate?: string;
  priority?: number;
  steps?: any[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Invalid authentication');
    }

    // Get user profile and tenant
    const { data: profile } = await supabase
      .from('profiles')
      .select('tenant_id, role')
      .eq('id', user.id)
      .single();

    if (!profile) {
      throw new Error('User profile not found');
    }

    const body: PlanDraftRequest = await req.json();

    // Validate agent capability
    const { data: capabilities } = await supabase
      .from('agent_capabilities')
      .select('*')
      .eq('tenant_id', profile.tenant_id)
      .eq('executive_role', body.role)
      .eq('capability_name', 'create_plan')
      .eq('is_enabled', true)
      .maybeSingle();

    if (!capabilities) {
      return new Response(
        JSON.stringify({ 
          error: 'Agent capability not found or disabled',
          code: 'CAPABILITY_DENIED' 
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check budget limits
    if (capabilities.max_budget_per_action && 
        body.estimatedBudget && 
        body.estimatedBudget > capabilities.max_budget_per_action) {
      return new Response(
        JSON.stringify({ 
          error: `Budget ${body.estimatedBudget} exceeds limit ${capabilities.max_budget_per_action}`,
          code: 'BUDGET_EXCEEDED'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate artifact hash
    const encoder = new TextEncoder();
    const contentData = encoder.encode(JSON.stringify(body.content));
    const hashBuffer = await crypto.subtle.digest('SHA-256', contentData);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const artifactHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Create execution plan
    const { data: plan, error: planError } = await supabase
      .from('execution_plans')
      .insert({
        tenant_id: profile.tenant_id,
        created_by: user.id,
        plan_title: body.title,
        plan_description: body.description,
        executive_role: body.role,
        status: 'draft',
        priority: body.priority || 3,
        estimated_budget: body.estimatedBudget,
        estimated_duration_days: body.estimatedDurationDays,
        target_start_date: body.targetStartDate,
        target_end_date: body.targetEndDate,
        plan_content: body.content,
        artifact_hash: artifactHash,
        model_version: 'executive-ai-v1.0'
      })
      .select('id')
      .single();

    if (planError) {
      console.error('Plan creation error:', planError);
      throw planError;
    }

    // Add plan steps if provided
    if (body.steps && body.steps.length > 0) {
      const stepsWithPlanId = body.steps.map((step, index) => ({
        plan_id: plan.id,
        step_order: index + 1,
        step_title: step.title || `Step ${index + 1}`,
        step_description: step.description,
        responsible_role: step.responsible_role || body.role,
        assigned_to: step.assigned_to,
        estimated_duration_hours: step.estimated_duration_hours,
        estimated_cost: step.estimated_cost,
        dependencies: step.dependencies || [],
        deliverables: step.deliverables || [],
        approval_required: step.approval_required || false,
        step_data: step.data || {}
      }));

      const { error: stepsError } = await supabase
        .from('plan_steps')
        .insert(stepsWithPlanId);

      if (stepsError) {
        console.error('Steps creation error:', stepsError);
        // Don't fail the whole operation, just log the error
      }
    }

    // Calculate inputs hash for future RDS generation
    const inputsData = JSON.stringify({
      title: body.title,
      role: body.role,
      content: body.content,
      budget: body.estimatedBudget,
      duration: body.estimatedDurationDays,
      timestamp: new Date().toISOString()
    });
    const inputsHashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(inputsData));
    const inputsHashArray = Array.from(new Uint8Array(inputsHashBuffer));
    const inputsHash = inputsHashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const response = {
      plan_id: plan.id,
      status: 'draft',
      artifact_hash: artifactHash,
      inputs_hash: inputsHash,
      requires_approval: capabilities.requires_approval,
      next_steps: capabilities.requires_approval 
        ? ['Submit for approval', 'Await CLO review']
        : ['Review plan', 'Submit for approval'],
      capabilities_used: {
        role: body.role,
        capability: 'create_plan',
        budget_limit: capabilities.max_budget_per_action,
        approval_required: capabilities.requires_approval
      }
    };

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in exec-plan-draft:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        code: 'INTERNAL_ERROR'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});