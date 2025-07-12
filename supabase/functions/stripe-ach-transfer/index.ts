import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ACHTransferRequest {
  from_account_id: string;
  to_account_id: string;
  amount: number;
  description?: string;
}

interface BankAccount {
  id: string;
  user_id: string;
  name: string;
  balance: number;
  account_type: string;
  stripe_account_id?: string;
  ach_enabled: boolean;
  routing_number?: string;
  account_number_last4?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('ACH Transfer request received');
    
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header provided');
    }

    // Initialize Stripe
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
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

    // Authenticate user
    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(jwt);
    
    if (userError || !user) {
      console.error('Authentication error:', userError);
      throw new Error('Invalid authentication token');
    }

    console.log('User authenticated:', user.id);

    // Parse request body
    const { from_account_id, to_account_id, amount, description }: ACHTransferRequest = await req.json();

    // Validate input
    if (!from_account_id || !to_account_id || !amount) {
      throw new Error('Missing required fields: from_account_id, to_account_id, amount');
    }

    if (amount <= 0) {
      throw new Error('Transfer amount must be greater than 0');
    }

    if (from_account_id === to_account_id) {
      throw new Error('Cannot transfer to the same account');
    }

    // Minimum transfer amount for ACH (typically $0.50)
    if (amount < 0.50) {
      throw new Error('Minimum transfer amount is $0.50 for ACH transfers');
    }

    console.log('Transfer validation passed:', { from_account_id, to_account_id, amount });

    // Get both accounts and verify ownership
    const { data: accounts, error: accountsError } = await supabase
      .from('bank_accounts')
      .select('*')
      .in('id', [from_account_id, to_account_id])
      .eq('user_id', user.id);

    if (accountsError) {
      console.error('Error fetching accounts:', accountsError);
      throw new Error('Failed to fetch account information');
    }

    if (!accounts || accounts.length !== 2) {
      throw new Error('Invalid account IDs or accounts not found');
    }

    const fromAccount = accounts.find((acc: BankAccount) => acc.id === from_account_id);
    const toAccount = accounts.find((acc: BankAccount) => acc.id === to_account_id);

    if (!fromAccount || !toAccount) {
      throw new Error('One or both accounts not found');
    }

    // Verify ACH is enabled for both accounts
    if (!fromAccount.ach_enabled || !toAccount.ach_enabled) {
      throw new Error('Both accounts must be ACH enabled for external transfers');
    }

    if (!fromAccount.stripe_account_id || !toAccount.stripe_account_id) {
      throw new Error('Both accounts must be linked to Stripe for ACH transfers');
    }

    console.log('ACH accounts verified:', {
      fromAccount: { id: fromAccount.id, stripe_id: fromAccount.stripe_account_id },
      toAccount: { id: toAccount.id, stripe_id: toAccount.stripe_account_id }
    });

    // Create transfer record
    const { data: transfer, error: transferError } = await supabase
      .from('transfers')
      .insert({
        user_id: user.id,
        from_account_id,
        to_account_id,
        amount,
        description: description || `ACH transfer from ${fromAccount.name} to ${toAccount.name}`,
        status: 'ach_debit_pending',
        transfer_type: 'ach',
        estimated_completion_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 3 business days
      })
      .select()
      .single();

    if (transferError) {
      console.error('Error creating transfer record:', transferError);
      throw new Error('Failed to create transfer record');
    }

    console.log('Transfer record created:', transfer.id);

    try {
      // Create ACH debit payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
        payment_method_types: ['us_bank_account'],
        payment_method_data: {
          type: 'us_bank_account',
          us_bank_account: {
            account_type: fromAccount.account_type.toLowerCase() as 'checking' | 'savings',
            routing_number: fromAccount.routing_number!,
            account_number: fromAccount.stripe_account_id!,
          }
        },
        metadata: {
          transfer_id: transfer.id,
          from_account_id: fromAccount.id,
          to_account_id: toAccount.id,
          user_id: user.id
        },
        description: `ACH debit for transfer ${transfer.id}`
      });

      console.log('Stripe payment intent created:', paymentIntent.id);

      // Update transfer with Stripe payment intent ID
      const { error: updateError } = await supabase
        .from('transfers')
        .update({ 
          stripe_debit_payment_intent_id: paymentIntent.id,
          ach_debit_status: paymentIntent.status
        })
        .eq('id', transfer.id);

      if (updateError) {
        console.error('Error updating transfer with payment intent:', updateError);
      }

      // Log ACH event
      await supabase
        .from('ach_events')
        .insert({
          transfer_id: transfer.id,
          event_type: 'ach_debit_initiated',
          event_data: {
            payment_intent_id: paymentIntent.id,
            status: paymentIntent.status,
            amount: amount
          }
        });

      // Confirm the payment intent to initiate ACH debit
      const confirmedPaymentIntent = await stripe.paymentIntents.confirm(paymentIntent.id);
      
      console.log('Payment intent confirmed:', confirmedPaymentIntent.status);

      // Update ACH status
      await supabase
        .from('transfers')
        .update({ 
          ach_debit_status: confirmedPaymentIntent.status 
        })
        .eq('id', transfer.id);

      return new Response(
        JSON.stringify({
          success: true,
          transfer: {
            ...transfer,
            stripe_debit_payment_intent_id: paymentIntent.id,
            ach_debit_status: confirmedPaymentIntent.status
          },
          message: 'ACH transfer initiated. Funds will be available in 1-3 business days.',
          estimated_completion: transfer.estimated_completion_date
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );

    } catch (stripeError) {
      console.error('Stripe error during ACH transfer:', stripeError);
      
      // Mark transfer as failed
      await supabase
        .from('transfers')
        .update({ 
          status: 'failed',
          failure_reason: stripeError instanceof Error ? stripeError.message : 'Stripe payment failed'
        })
        .eq('id', transfer.id);

      throw new Error(`ACH transfer failed: ${stripeError instanceof Error ? stripeError.message : 'Unknown Stripe error'}`);
    }

  } catch (error) {
    console.error('ACH transfer function error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});