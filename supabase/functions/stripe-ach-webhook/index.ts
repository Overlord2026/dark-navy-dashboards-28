import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('ACH webhook received');

    // Initialize Stripe
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    
    if (!stripeSecretKey) {
      throw new Error('Stripe secret key not configured');
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Get raw body and signature
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    let event: Stripe.Event;

    if (webhookSecret && signature) {
      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      } catch (err) {
        console.error('Webhook signature verification failed:', err);
        return new Response('Webhook signature verification failed', { status: 400 });
      }
    } else {
      // For development - parse the event directly
      event = JSON.parse(body) as Stripe.Event;
    }

    console.log('Processing webhook event:', event.type);

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent, supabase, stripe);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent, supabase);
        break;
        
      case 'payment_intent.processing':
        await handlePaymentIntentProcessing(event.data.object as Stripe.PaymentIntent, supabase);
        break;

      default:
        console.log('Unhandled event type:', event.type);
    }

    // Log the event
    await supabase
      .from('ach_events')
      .insert({
        stripe_event_id: event.id,
        event_type: event.type,
        event_data: event.data,
        transfer_id: getTransferIdFromEvent(event)
      });

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response('Webhook processing failed', { status: 500 });
  }
});

async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent, 
  supabase: any, 
  stripe: Stripe
) {
  console.log('Payment intent succeeded:', paymentIntent.id);
  
  const transferId = paymentIntent.metadata.transfer_id;
  if (!transferId) {
    console.error('No transfer_id in payment intent metadata');
    return;
  }

  // Get the transfer record
  const { data: transfer, error: transferError } = await supabase
    .from('transfers')
    .select('*')
    .eq('id', transferId)
    .single();

  if (transferError || !transfer) {
    console.error('Transfer not found:', transferError);
    return;
  }

  // Update transfer status - ACH debit successful, funds are held
  await supabase
    .from('transfers')
    .update({
      status: 'funds_held',
      ach_debit_status: 'succeeded',
      funds_held_at: new Date().toISOString()
    })
    .eq('id', transferId);

  console.log('Transfer updated to funds_held status');

  // Now initiate ACH credit to destination account
  try {
    // Get destination account details
    const { data: toAccount } = await supabase
      .from('bank_accounts')
      .select('*')
      .eq('id', transfer.to_account_id)
      .single();

    if (!toAccount) {
      throw new Error('Destination account not found');
    }

    // Create credit payment intent
    const creditPaymentIntent = await stripe.paymentIntents.create({
      amount: transfer.amount * 100, // Convert to cents
      currency: 'usd',
      payment_method_types: ['us_bank_account'],
      transfer_data: {
        destination: toAccount.stripe_account_id
      },
      metadata: {
        transfer_id: transferId,
        original_payment_intent: paymentIntent.id,
        type: 'ach_credit'
      },
      description: `ACH credit for transfer ${transferId}`
    });

    // Update transfer with credit payment intent
    await supabase
      .from('transfers')
      .update({
        stripe_credit_payment_intent_id: creditPaymentIntent.id,
        ach_credit_status: creditPaymentIntent.status,
        status: 'ach_credit_pending'
      })
      .eq('id', transferId);

    // Confirm the credit payment intent
    await stripe.paymentIntents.confirm(creditPaymentIntent.id);

    console.log('ACH credit initiated:', creditPaymentIntent.id);

  } catch (creditError) {
    console.error('Error initiating ACH credit:', creditError);
    
    // Update transfer with failure
    await supabase
      .from('transfers')
      .update({
        status: 'ach_credit_failed',
        failure_reason: creditError instanceof Error ? creditError.message : 'ACH credit failed'
      })
      .eq('id', transferId);
  }
}

async function handlePaymentIntentFailed(
  paymentIntent: Stripe.PaymentIntent, 
  supabase: any
) {
  console.log('Payment intent failed:', paymentIntent.id);
  
  const transferId = paymentIntent.metadata.transfer_id;
  if (!transferId) {
    console.error('No transfer_id in payment intent metadata');
    return;
  }

  // Update transfer status to failed
  await supabase
    .from('transfers')
    .update({
      status: 'failed',
      ach_debit_status: 'failed',
      failure_reason: paymentIntent.last_payment_error?.message || 'Payment failed'
    })
    .eq('id', transferId);

  console.log('Transfer marked as failed');
}

async function handlePaymentIntentProcessing(
  paymentIntent: Stripe.PaymentIntent, 
  supabase: any
) {
  console.log('Payment intent processing:', paymentIntent.id);
  
  const transferId = paymentIntent.metadata.transfer_id;
  if (!transferId) {
    return;
  }

  // Update ACH status
  await supabase
    .from('transfers')
    .update({
      ach_debit_status: 'processing'
    })
    .eq('id', transferId);
}

function getTransferIdFromEvent(event: Stripe.Event): string | null {
  try {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    return paymentIntent.metadata?.transfer_id || null;
  } catch {
    return null;
  }
}