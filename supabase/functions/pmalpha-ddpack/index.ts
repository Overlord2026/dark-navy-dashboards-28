import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const b = await req.json().catch(() => ({}));
    const items = (b.items ?? []).map((it: any, i: number) => 
      typeof it === "string" ? { id: it, seq: i + 1 } : { ...it, seq: i + 1 }
    );
    
    return new Response(JSON.stringify({
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      items
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error('PMAlpha DD Pack error:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
};

export default serve(handler);