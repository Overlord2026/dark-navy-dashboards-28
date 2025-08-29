import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!OPENAI_API_KEY) {
      console.log('OPENAI_API_KEY not found');
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const { notes } = await req.json();

    if (!notes || typeof notes !== 'string') {
      throw new Error('Meeting notes are required and must be a string');
    }

    console.log('Processing meeting notes for summary...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a professional meeting summarizer. Create concise, well-structured summaries that include:
            - Key discussion points
            - Decisions made
            - Action items with owners (if mentioned)
            - Next steps
            
            Format the response as a clear, professional summary that can be easily shared with stakeholders.`
          },
          {
            role: 'user',
            content: `Please summarize these meeting notes:\n\n${notes}`
          }
        ],
        max_tokens: 1000,
        temperature: 0.3
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const summary = data.choices[0].message.content;

    console.log('Meeting summary generated successfully');

    return new Response(JSON.stringify({ 
      success: true,
      summary,
      word_count: summary.split(' ').length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in meeting-summary function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});