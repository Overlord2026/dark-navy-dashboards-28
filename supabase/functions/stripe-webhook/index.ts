import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Webhook received");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    if (!webhookSecret) throw new Error("STRIPE_WEBHOOK_SECRET is not set");

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");
    
    if (!signature) {
      throw new Error("No Stripe signature found");
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      logStep("Webhook signature verified", { eventType: event.type });
    } catch (err) {
      logStep("Webhook signature verification failed", { error: err.message });
      return new Response(`Webhook signature verification failed: ${err.message}`, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        logStep("Processing checkout.session.completed", { sessionId: session.id });
        
        if (session.metadata?.userId) {
          // Trigger subscription sync for this user
          await supabaseClient.functions.invoke('check-subscription', {
            headers: {
              Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`
            }
          });
          logStep("Triggered subscription sync for user", { userId: session.metadata.userId });
        }
        break;
      }
      
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        logStep(`Processing ${event.type}`, { subscriptionId: subscription.id });
        
        // Find user by customer ID and update their subscription
        const { data: profiles, error } = await supabaseClient
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', subscription.customer);
          
        if (error) {
          logStep("Error finding user profile", { error });
        } else if (profiles && profiles.length > 0) {
          for (const profile of profiles) {
            // Update subscription status
            const subscriptionTier = event.type === 'customer.subscription.deleted' ? 'free' : 
              subscription.items.data[0]?.price.id === 'price_1QdnJSARf5O8Fz6JN2yVQH3M' ? 'basic' :
              subscription.items.data[0]?.price.id === 'price_1QdnJtARf5O8Fz6JxL7VqD9K' ? 'premium' : 
              subscription.items.data[0]?.price.id === 'price_1QdnKLARf5O8Fz6JmN8VwE5P' ? 'elite' : 'free';
              
            await supabaseClient
              .from('profiles')
              .update({
                subscription_tier: subscriptionTier,
                subscription_status: subscription.status === 'active' ? 'active' : 'inactive',
                subscription_end_date: subscription.current_period_end ? 
                  new Date(subscription.current_period_end * 1000).toISOString() : null,
                stripe_subscription_id: event.type === 'customer.subscription.deleted' ? null : subscription.id,
                updated_at: new Date().toISOString()
              })
              .eq('id', profile.id);
              
            logStep("Updated user subscription", { 
              userId: profile.id, 
              tier: subscriptionTier, 
              status: subscription.status 
            });
          }
        }
        break;
      }
      
      case 'invoice.payment_succeeded':
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        logStep(`Processing ${event.type}`, { invoiceId: invoice.id });
        
        // You could add additional logic here for payment notifications
        break;
      }
      
      default:
        logStep("Unhandled event type", { eventType: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in stripe-webhook", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});