import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TransferRequest {
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
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Transfer request received');
    
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header provided');
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Get user from JWT token
    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(jwt);
    
    if (userError || !user) {
      console.error('Authentication error:', userError);
      throw new Error('Invalid authentication token');
    }

    console.log('User authenticated:', user.id);

    // Parse request body
    const { from_account_id, to_account_id, amount, description }: TransferRequest = await req.json();

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

    console.log('Accounts verified:', {
      fromAccount: { id: fromAccount.id, balance: fromAccount.balance },
      toAccount: { id: toAccount.id, balance: toAccount.balance }
    });

    // Check sufficient balance
    if (fromAccount.balance < amount) {
      throw new Error(`Insufficient funds. Available balance: $${fromAccount.balance.toFixed(2)}`);
    }

    // Create transfer record first
    const { data: transfer, error: transferError } = await supabase
      .from('transfers')
      .insert({
        user_id: user.id,
        from_account_id,
        to_account_id,
        amount,
        description: description || `Transfer from ${fromAccount.name} to ${toAccount.name}`,
        status: 'processing'
      })
      .select()
      .single();

    if (transferError) {
      console.error('Error creating transfer record:', transferError);
      throw new Error('Failed to create transfer record');
    }

    console.log('Transfer record created:', transfer.id);

    try {
      // Perform the actual transfer (update both account balances)
      const newFromBalance = fromAccount.balance - amount;
      const newToBalance = toAccount.balance + amount;

      // Update from account
      const { error: fromUpdateError } = await supabase
        .from('bank_accounts')
        .update({ balance: newFromBalance })
        .eq('id', from_account_id);

      if (fromUpdateError) {
        console.error('Error updating from account:', fromUpdateError);
        throw new Error('Failed to debit from account');
      }

      // Update to account
      const { error: toUpdateError } = await supabase
        .from('bank_accounts')
        .update({ balance: newToBalance })
        .eq('id', to_account_id);

      if (toUpdateError) {
        console.error('Error updating to account:', toUpdateError);
        // Rollback from account update
        await supabase
          .from('bank_accounts')
          .update({ balance: fromAccount.balance })
          .eq('id', from_account_id);
        throw new Error('Failed to credit to account');
      }

      // Mark transfer as completed
      const { error: statusUpdateError } = await supabase
        .from('transfers')
        .update({ 
          status: 'completed',
          processed_at: new Date().toISOString()
        })
        .eq('id', transfer.id);

      if (statusUpdateError) {
        console.error('Error updating transfer status:', statusUpdateError);
        // Transfer already happened, just log the error
      }

      console.log('Transfer completed successfully:', {
        transferId: transfer.id,
        fromBalance: newFromBalance,
        toBalance: newToBalance
      });

      return new Response(
        JSON.stringify({
          success: true,
          transfer: {
            ...transfer,
            status: 'completed',
            processed_at: new Date().toISOString()
          },
          message: 'Transfer completed successfully'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );

    } catch (error) {
      console.error('Error during transfer execution:', error);
      
      // Mark transfer as failed
      await supabase
        .from('transfers')
        .update({ status: 'failed' })
        .eq('id', transfer.id);

      throw error;
    }

  } catch (error) {
    console.error('Transfer function error:', error);
    
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