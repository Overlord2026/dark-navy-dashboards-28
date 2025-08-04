import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { importId, fileUrl, userId } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Processing PDF parse request for import:', importId);

    // Update status to parsing
    await supabase
      .from('plan_imports')
      .update({ import_status: 'parsing' })
      .eq('id', importId);

    // Use OpenAI Vision to analyze the PDF content
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an expert retirement plan analyzer. Extract key retirement planning data from the uploaded document. Return a JSON object with the following structure:
            {
              "clientInfo": {
                "name": "string",
                "age": "number",
                "retirementAge": "number",
                "email": "string (if available)"
              },
              "goals": {
                "retirementAge": "number",
                "annualRetirementIncome": "number",
                "inflationRate": "number (as decimal, e.g., 0.025 for 2.5%)",
                "lifeExpectancy": "number"
              },
              "socialSecurity": {
                "enabled": "boolean",
                "currentEarnings": "number",
                "filingAge": "number",
                "spousalBenefit": "boolean"
              },
              "pension": {
                "enabled": "boolean", 
                "monthlyBenefit": "number",
                "startAge": "number"
              },
              "accounts": [
                {
                  "type": "string (401k, roth_ira, brokerage, etc.)",
                  "balance": "number",
                  "annualContribution": "number",
                  "expectedReturn": "number (as percentage, e.g., 8 for 8%)",
                  "taxStatus": "string (pre_tax, after_tax, tax_free)"
                }
              ],
              "expenses": [
                {
                  "name": "string",
                  "currentAmount": "number",
                  "retirementAmount": "number",
                  "essential": "boolean"
                }
              ],
              "healthcare": {
                "estimatedAnnualCost": "number",
                "longTermCareInsurance": "boolean"
              },
              "legacy": {
                "targetInheritance": "number",
                "charitableGiving": "number"
              },
              "confidence": "number between 0-1 indicating how confident you are in the extraction"
            }
            
            Focus on numerical values and convert percentages to appropriate formats. If information is missing, use reasonable defaults or null.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Please analyze this retirement planning document and extract the key financial data:'
              },
              {
                type: 'image_url',
                image_url: { url: fileUrl }
              }
            ]
          }
        ],
        max_tokens: 2000,
        temperature: 0.1
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const extractedContent = data.choices[0].message.content;
    
    console.log('OpenAI response:', extractedContent);

    let parsedData;
    try {
      // Try to parse JSON from the response
      const jsonMatch = extractedContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      parsedData = {
        error: 'Failed to parse structured data from PDF',
        rawContent: extractedContent,
        confidence: 0.1
      };
    }

    // Update the import record with parsed data
    const { error: updateError } = await supabase
      .from('plan_imports')
      .update({
        parsed_data: parsedData,
        import_status: parsedData.error ? 'failed' : 'review',
        error_log: parsedData.error || null,
        client_count: parsedData.clientInfo ? 1 : 0
      })
      .eq('id', importId);

    if (updateError) {
      throw updateError;
    }

    // Log the parsing action
    await supabase
      .from('plan_import_audit')
      .insert({
        advisor_id: userId,
        import_id: importId,
        action_type: 'pdf_parsed',
        action_details: {
          confidence: parsedData.confidence || 0,
          has_error: !!parsedData.error,
          extracted_accounts: parsedData.accounts?.length || 0
        }
      });

    return new Response(JSON.stringify({
      success: true,
      parsedData,
      status: parsedData.error ? 'failed' : 'ready_for_review'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('PDF parsing error:', error);
    
    // Update import status to failed
    if (req.body) {
      try {
        const { importId } = await req.json();
        await supabase
          .from('plan_imports')
          .update({
            import_status: 'failed',
            error_log: error.message
          })
          .eq('id', importId);
      } catch (e) {
        console.error('Failed to update import status:', e);
      }
    }

    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});