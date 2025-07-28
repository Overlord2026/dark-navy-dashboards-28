import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SYNC-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Starting subscription sync");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    // Use service role for secure database access
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { user_id } = await req.json();
    if (!user_id) throw new Error("user_id is required");

    logStep("Processing user", { user_id });

    // Get user profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user_id)
      .single();

    if (profileError) throw new Error(`Profile not found: ${profileError.message}`);
    if (!profile.stripe_customer_id) throw new Error("No Stripe customer ID found");

    logStep("Found profile", { 
      stripe_customer_id: profile.stripe_customer_id,
      current_tier: profile.subscription_tier 
    });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Get active subscriptions from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: profile.stripe_customer_id,
      status: 'active',
      limit: 10,
    });

    logStep("Fetched Stripe subscriptions", { count: subscriptions.data.length });

    let subscriptionTier = 'basic';
    let isActive = false;
    let stripeSubscriptionId = null;
    let addOnAccess = {
      lending_access: false,
      tax_access: false,
      ai_features_access: false,
      premium_analytics_access: false,
    };
    let usageLimits = {
      lending_applications_limit: 3,
      tax_analyses_limit: 5,
      ai_queries_limit: 20,
      document_uploads_limit: 10,
    };

    if (subscriptions.data.length > 0) {
      const subscription = subscriptions.data[0];
      isActive = subscription.status === 'active';
      stripeSubscriptionId = subscription.id;

      logStep("Processing subscription", { 
        subscription_id: subscription.id, 
        status: subscription.status 
      });

      // Analyze subscription items to determine tier and add-ons
      for (const item of subscription.items.data) {
        const priceId = item.price.id;
        const price = item.price;
        
        logStep("Processing subscription item", { 
          price_id: priceId, 
          amount: price.unit_amount 
        });

        // Determine tier based on price amount (in cents)
        if (price.unit_amount && price.unit_amount >= 9900) { // $99+
          subscriptionTier = 'elite';
          usageLimits = {
            lending_applications_limit: -1, // unlimited
            tax_analyses_limit: -1,
            ai_queries_limit: -1,
            document_uploads_limit: -1,
          };
          // Elite includes all add-ons
          addOnAccess = {
            lending_access: true,
            tax_access: true,
            ai_features_access: true,
            premium_analytics_access: true,
          };
        } else if (price.unit_amount && price.unit_amount >= 4900) { // $49+
          subscriptionTier = 'premium';
          usageLimits = {
            lending_applications_limit: 10,
            tax_analyses_limit: 20,
            ai_queries_limit: 100,
            document_uploads_limit: 50,
          };
          // Premium includes most add-ons
          addOnAccess = {
            lending_access: true,
            tax_access: true,
            ai_features_access: true,
            premium_analytics_access: false,
          };
        } else if (price.unit_amount && price.unit_amount >= 2900) { // $29+
          subscriptionTier = 'basic';
          usageLimits = {
            lending_applications_limit: 3,
            tax_analyses_limit: 5,
            ai_queries_limit: 20,
            document_uploads_limit: 10,
          };
        }

        // Check for specific add-on products (you can customize these based on your Stripe setup)
        if (price.nickname?.toLowerCase().includes('lending')) {
          addOnAccess.lending_access = true;
        }
        if (price.nickname?.toLowerCase().includes('tax')) {
          addOnAccess.tax_access = true;
        }
        if (price.nickname?.toLowerCase().includes('ai')) {
          addOnAccess.ai_features_access = true;
        }
        if (price.nickname?.toLowerCase().includes('analytics')) {
          addOnAccess.premium_analytics_access = true;
        }
      }
    }

    logStep("Determined subscription details", {
      tier: subscriptionTier,
      is_active: isActive,
      add_ons: addOnAccess,
      limits: usageLimits
    });

    // Update profile with synced data
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        subscription_tier: subscriptionTier,
        subscription_active: isActive,
        stripe_subscription_id: stripeSubscriptionId,
        ...addOnAccess,
        ...usageLimits,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user_id);

    if (updateError) throw new Error(`Update failed: ${updateError.message}`);

    // Track the sync event
    await supabaseAdmin.rpc('track_subscription_event', {
      p_user_id: user_id,
      p_event_type: 'subscription_synced',
      p_subscription_tier: subscriptionTier,
      p_metadata: {
        synced_at: new Date().toISOString(),
        stripe_subscription_id: stripeSubscriptionId,
        add_ons_enabled: addOnAccess,
      }
    });

    logStep("Successfully synced subscription");

    return new Response(JSON.stringify({
      success: true,
      subscription_tier: subscriptionTier,
      is_active: isActive,
      add_ons: addOnAccess,
      usage_limits: usageLimits,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in sync-subscription-stripe", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});