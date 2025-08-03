import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { meeting_id } = await req.json();
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Get meeting details
    const { data: meeting, error: meetingError } = await supabase
      .from('meetings')
      .select('*')
      .eq('id', meeting_id)
      .single();

    if (meetingError) {
      throw new Error(`Failed to fetch meeting: ${meetingError.message}`);
    }

    // For demo purposes, we'll generate a summary based on meeting type and client info
    // In a real implementation, you would transcribe the recording and then summarize
    let transcriptText = '';
    
    if (meeting.recording_url) {
      // TODO: Implement actual transcription from recording
      // For now, we'll use a mock transcript based on meeting details
      transcriptText = `Meeting discussion covered portfolio review, investment goals, and risk tolerance. Client expressed interest in growth-oriented investments and discussed timeline for financial goals.`;
    }

    // Generate AI summary using OpenAI
    const summaryPrompt = `
      You are a financial advisor's AI assistant. Generate a concise meeting summary based on the following information:
      
      Meeting Title: ${meeting.title}
      Client: ${meeting.client_name}
      Duration: ${meeting.duration_minutes} minutes
      Meeting Type: ${meeting.meeting_type}
      
      Discussion Content: ${transcriptText || 'Standard financial planning consultation discussing investment objectives, risk tolerance, and portfolio strategies.'}
      
      Please provide:
      1. A brief summary of what was discussed
      2. Key decisions or agreements made
      3. Next steps or action items
      4. Any concerns or questions raised by the client
      
      Format as a professional meeting summary.
    `;

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a professional AI assistant that creates concise, accurate meeting summaries for financial advisors.'
          },
          {
            role: 'user',
            content: summaryPrompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.3
      }),
    });

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.status}`);
    }

    const aiResult = await openaiResponse.json();
    const generatedSummary = aiResult.choices[0].message.content;

    // Extract action items from the summary
    const actionItemsPrompt = `
      Based on this meeting summary, extract specific action items as a JSON array of strings:
      
      ${generatedSummary}
      
      Return only a JSON array of action items, like: ["Send portfolio proposals", "Schedule follow-up meeting", "Research tax implications"]
    `;

    const actionItemsResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You extract action items from meeting summaries and return them as JSON arrays.'
          },
          {
            role: 'user',
            content: actionItemsPrompt
          }
        ],
        max_tokens: 200,
        temperature: 0.1
      }),
    });

    let actionItems: string[] = [];
    if (actionItemsResponse.ok) {
      const actionResult = await actionItemsResponse.json();
      try {
        actionItems = JSON.parse(actionResult.choices[0].message.content);
      } catch (parseError) {
        console.error('Failed to parse action items:', parseError);
        actionItems = ['Follow up with client', 'Prepare recommendations'];
      }
    }

    // Update meeting with summary and action items
    const { error: updateError } = await supabase
      .from('meetings')
      .update({
        summary: generatedSummary,
        action_items: actionItems,
        status: 'completed'
      })
      .eq('id', meeting_id);

    if (updateError) {
      throw new Error(`Failed to update meeting: ${updateError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        summary: generatedSummary,
        action_items: actionItems
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error generating meeting summary:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to generate meeting summary'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});