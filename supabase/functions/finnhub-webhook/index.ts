import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const finnhubSecret = Deno.env.get('FINNHUB_WEBHOOK_SECRET');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-finnhub-secret',
};

interface FinnhubWebhookEvent {
  type: string;
  symbol: string;
  data: any;
  timestamp: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    // Verify Finnhub secret header
    const finnhubSecretHeader = req.headers.get('x-finnhub-secret');
    
    if (!finnhubSecret) {
      console.error('FINNHUB_WEBHOOK_SECRET not configured');
      return new Response('Webhook secret not configured', { 
        status: 500, 
        headers: corsHeaders 
      });
    }

    if (!finnhubSecretHeader || finnhubSecretHeader !== finnhubSecret) {
      console.error('Invalid Finnhub webhook secret');
      return new Response('Unauthorized', { 
        status: 401, 
        headers: corsHeaders 
      });
    }

    // Parse webhook payload
    const payload: FinnhubWebhookEvent = await req.json();
    
    console.log('Received Finnhub webhook:', {
      type: payload.type,
      symbol: payload.symbol,
      timestamp: payload.timestamp
    });

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Store webhook event in database
    const { error: insertError } = await supabase
      .from('finnhub_webhook_events')
      .insert({
        event_type: payload.type,
        symbol: payload.symbol,
        event_data: payload.data,
        event_timestamp: new Date(payload.timestamp * 1000).toISOString(),
        processed_at: new Date().toISOString()
      });

    if (insertError) {
      console.error('Error storing webhook event:', insertError);
    }

    // Process different event types
    switch (payload.type) {
      case 'trade':
        await handleTradeEvent(payload, supabase);
        break;
      case 'news':
        await handleNewsEvent(payload, supabase);
        break;
      case 'quote':
        await handleQuoteEvent(payload, supabase);
        break;
      default:
        console.log(`Unhandled webhook event type: ${payload.type}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Webhook processed successfully',
        timestamp: new Date().toISOString()
      }), 
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error processing Finnhub webhook:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function handleTradeEvent(payload: FinnhubWebhookEvent, supabase: any) {
  console.log(`Processing trade event for ${payload.symbol}`);
  
  // Update real-time market data
  const { error } = await supabase
    .from('market_data')
    .upsert({
      symbol: payload.symbol,
      last_price: payload.data.price,
      volume: payload.data.volume,
      timestamp: new Date(payload.timestamp * 1000).toISOString(),
      updated_at: new Date().toISOString()
    });

  if (error) {
    console.error('Error updating market data:', error);
  }
}

async function handleNewsEvent(payload: FinnhubWebhookEvent, supabase: any) {
  console.log(`Processing news event for ${payload.symbol}`);
  
  // Store news events
  const { error } = await supabase
    .from('market_news')
    .insert({
      symbol: payload.symbol,
      headline: payload.data.headline,
      summary: payload.data.summary,
      source: payload.data.source,
      url: payload.data.url,
      published_at: new Date(payload.data.datetime * 1000).toISOString(),
      created_at: new Date().toISOString()
    });

  if (error) {
    console.error('Error storing news event:', error);
  }
}

async function handleQuoteEvent(payload: FinnhubWebhookEvent, supabase: any) {
  console.log(`Processing quote event for ${payload.symbol}`);
  
  // Update real-time quotes
  const { error } = await supabase
    .from('market_quotes')
    .upsert({
      symbol: payload.symbol,
      bid: payload.data.bid,
      ask: payload.data.ask,
      last: payload.data.last,
      timestamp: new Date(payload.timestamp * 1000).toISOString(),
      updated_at: new Date().toISOString()
    });

  if (error) {
    console.error('Error updating quote data:', error);
  }
}