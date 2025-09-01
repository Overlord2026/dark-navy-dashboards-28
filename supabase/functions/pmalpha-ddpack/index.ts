import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DDPackPayload {
  title: string;
  items: Array<{ id: string; [key: string]: any }>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('PMAlpha DDPack request received');
    
    const payload: DDPackPayload = await req.json();
    console.log('Payload:', payload);

    // Validate required fields
    if (!payload.title || !Array.isArray(payload.items)) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: title, items (array)' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Process the DDPack data
    const processedItems = payload.items.map((item, index) => ({
      ...item,
      processed_at: new Date().toISOString(),
      sequence: index + 1,
      pack_title: payload.title
    }));

    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 100));

    const result = {
      success: true,
      title: payload.title,
      processed_items: processedItems,
      item_count: processedItems.length,
      processed_at: new Date().toISOString(),
      pack_id: `ddpack_${Date.now()}`
    };

    console.log('DDPack processing completed:', result.pack_id);

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in pmalpha-ddpack function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});