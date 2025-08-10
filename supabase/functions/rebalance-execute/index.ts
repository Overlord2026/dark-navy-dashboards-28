import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RebalanceExecuteRequest {
  ticketId: string;
  executionMethod: 'manual' | 'automated';
  notes?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
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

    // Verify user authentication
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const body: RebalanceExecuteRequest = await req.json();
    const { ticketId, executionMethod = 'manual', notes } = body;

    if (!ticketId) {
      return new Response(
        JSON.stringify({ error: 'ticketId is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Processing rebalance execution for ticket: ${ticketId}`);

    // Fetch the rebalancing ticket
    const { data: ticket, error: ticketError } = await supabaseClient
      .from('rebalancing_events')
      .select('*')
      .eq('id', ticketId)
      .eq('user_id', user.id)
      .single();

    if (ticketError || !ticket) {
      return new Response(
        JSON.stringify({ error: 'Rebalancing ticket not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (ticket.execution_status === 'executed') {
      return new Response(
        JSON.stringify({ error: 'Ticket already executed' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate trades from the ticket
    const trades = ticket.trades as any[];
    if (!trades || trades.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No trades found in ticket' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // In production, this would:
    // 1. Validate trade feasibility
    // 2. Connect to brokerage APIs
    // 3. Execute trades sequentially or in batches
    // 4. Monitor execution status
    // 5. Handle partial fills and errors

    // For now, we'll simulate execution
    console.log(`Simulating execution of ${trades.length} trades:`, trades);

    // Update ticket status
    const { error: updateError } = await supabaseClient
      .from('rebalancing_events')
      .update({
        execution_status: 'executed',
        executed_at: new Date().toISOString(),
        trigger_data: {
          ...ticket.trigger_data,
          executionMethod,
          executedBy: user.id,
          executionNotes: notes,
          simulatedExecution: true
        }
      })
      .eq('id', ticketId);

    if (updateError) {
      throw new Error(`Failed to update ticket: ${updateError.message}`);
    }

    console.log(`Rebalance execution completed for ticket: ${ticketId}`);

    return new Response(
      JSON.stringify({
        success: true,
        ticketId,
        executionStatus: 'executed',
        executedAt: new Date().toISOString(),
        tradesExecuted: trades.length,
        executionMethod,
        metadata: {
          userId: user.id,
          trades: trades.map(trade => ({
            symbol: trade.symbol,
            action: trade.action,
            quantity: trade.quantity,
            estimatedPrice: trade.estimatedPrice
          })),
          notes
        }
      }),
      { 
        status: 202, // Accepted for processing
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Rebalance execution failed:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Rebalance execution failed', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});