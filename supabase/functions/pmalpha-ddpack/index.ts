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

    // Process the DDPack data - handle both strings and objects
    const processedItems = payload.items.map((item, index) => {
      const baseItem = typeof item === 'string' ? { id: item } : item;
      return {
        ...baseItem,
        processed_at: new Date().toISOString(),
        sequence: index + 1,
        pack_title: payload.title
      };
    });

    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 100));

    const result = {
      id: `ddpack_${Date.now()}`,
      title: payload.title,
      items: processedItems,
      item_count: processedItems.length,
      created_at: new Date().toISOString(),
      success: true
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