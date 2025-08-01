import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TransactionData {
  id: string;
  description: string;
  amount: number;
  date: string;
  account_id: string;
  merchant_name?: string;
}

interface ClassificationRequest {
  transaction: TransactionData;
  user_id: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { transaction, user_id }: ClassificationRequest = await req.json();
    
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user's transaction history and learning data
    const { data: vendorHistory } = await supabase
      .from('vendor_learning')
      .select('*')
      .eq('user_id', user_id)
      .limit(50);

    const { data: recentClassifications } = await supabase
      .from('transaction_classifications')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(20);

    // Extract vendor name from description
    const cleanDescription = transaction.description
      .replace(/\d{4,}/g, '') // Remove long numbers
      .replace(/\*/g, '') // Remove asterisks
      .trim();

    const vendorName = extractVendorName(cleanDescription, transaction.merchant_name);

    // Check for anomalies
    const { data: anomalyResult } = await supabase
      .rpc('detect_transaction_anomalies', {
        p_user_id: user_id,
        p_vendor_name: vendorName,
        p_amount: transaction.amount,
        p_description: transaction.description
      });

    // Build context for AI classification
    const contextData = {
      transaction,
      vendorHistory,
      recentClassifications: recentClassifications?.slice(0, 10),
      cleanDescription,
      vendorName
    };

    // Call OpenAI for classification
    const classification = await classifyTransaction(contextData, OPENAI_API_KEY);

    // Save classification to database
    const classificationData = {
      transaction_id: transaction.id,
      user_id,
      original_description: transaction.description,
      cleaned_description: cleanDescription,
      suggested_category: classification.category,
      final_category: classification.category,
      confidence_score: classification.confidence,
      vendor_name: vendorName,
      is_recurring: classification.isRecurring,
      is_anomaly: anomalyResult?.is_anomaly || false,
      anomaly_reasons: anomalyResult?.anomaly_reasons || [],
      ai_model_used: 'gpt-4o-mini',
      learning_data: {
        amount: transaction.amount,
        date: transaction.date,
        reasoning: classification.reasoning
      }
    };

    const { data: savedClassification, error: classError } = await supabase
      .from('transaction_classifications')
      .insert(classificationData)
      .select()
      .single();

    if (classError) throw classError;

    // Update vendor learning
    await updateVendorLearning(supabase, user_id, vendorName, classification.category, transaction.amount);

    return new Response(JSON.stringify({
      classification: savedClassification,
      anomaly: anomalyResult,
      suggestions: classification.suggestions
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-bookkeeping function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function extractVendorName(description: string, merchantName?: string): string {
  if (merchantName) return merchantName;
  
  // Common patterns for vendor extraction
  const cleaned = description
    .replace(/^(DEBIT CARD|CREDIT CARD|ACH|CHECK)\s*/i, '')
    .replace(/\s+\d{2}\/\d{2}\s*$/, '') // Remove dates
    .replace(/\s+#\d+.*$/, '') // Remove reference numbers
    .split(/\s{2,}/)[0] // Take first part before double spaces
    .trim();
  
  return cleaned || description;
}

async function classifyTransaction(context: any, apiKey: string) {
  const { transaction, vendorHistory, recentClassifications, vendorName } = context;
  
  // Build learning context
  const learningContext = {
    vendorHistory: vendorHistory?.map((v: any) => ({
      vendor: v.vendor_name,
      category: v.default_category,
      frequency: v.frequency_pattern
    })) || [],
    recentClassifications: recentClassifications?.map((c: any) => ({
      description: c.cleaned_description,
      category: c.final_category,
      vendor: c.vendor_name
    })) || []
  };

  const prompt = `You are an AI bookkeeping assistant. Classify this transaction based on the context provided.

Transaction:
- Description: ${transaction.description}
- Amount: $${transaction.amount}
- Vendor: ${vendorName}
- Date: ${transaction.date}

User's Learning Context:
${JSON.stringify(learningContext, null, 2)}

Common Categories:
- Office Supplies
- Travel & Meals
- Professional Services
- Utilities
- Banking Fees
- Marketing & Advertising
- Software & Subscriptions
- Insurance
- Equipment & Maintenance
- Rent & Facilities
- Business Income
- Interest Income
- Transfers (Between Accounts)
- Personal Withdrawal

Respond with JSON only:
{
  "category": "specific category name",
  "confidence": 0.95,
  "isRecurring": true/false,
  "reasoning": "brief explanation",
  "suggestions": ["alternative category if unsure"]
}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1
    }),
  });

  const data = await response.json();
  const content = data.choices[0].message.content;
  
  try {
    return JSON.parse(content);
  } catch {
    // Fallback classification
    return {
      category: 'Other Expenses',
      confidence: 0.3,
      isRecurring: false,
      reasoning: 'AI classification failed, defaulted to Other Expenses',
      suggestions: []
    };
  }
}

async function updateVendorLearning(supabase: any, userId: string, vendorName: string, category: string, amount: number) {
  const { data: existing } = await supabase
    .from('vendor_learning')
    .select('*')
    .eq('user_id', userId)
    .eq('vendor_name', vendorName)
    .single();

  if (existing) {
    // Update existing vendor learning
    const currentAmounts = existing.typical_amounts || {};
    const transactionCount = existing.transaction_count + 1;
    const currentTotal = (currentAmounts.avg || 0) * (transactionCount - 1);
    const newAvg = (currentTotal + amount) / transactionCount;
    
    await supabase
      .from('vendor_learning')
      .update({
        default_category: category,
        transaction_count: transactionCount,
        typical_amounts: {
          avg: newAvg,
          min: Math.min(currentAmounts.min || amount, amount),
          max: Math.max(currentAmounts.max || amount, amount),
          std_dev: calculateStdDev(currentAmounts, amount, transactionCount)
        },
        last_seen_at: new Date().toISOString(),
        confidence_level: Math.min(0.95, existing.confidence_level + 0.1)
      })
      .eq('id', existing.id);
  } else {
    // Create new vendor learning record
    await supabase
      .from('vendor_learning')
      .insert({
        user_id: userId,
        vendor_name: vendorName,
        default_category: category,
        typical_amounts: {
          avg: amount,
          min: amount,
          max: amount,
          std_dev: 0
        },
        frequency_pattern: 'new',
        last_seen_at: new Date().toISOString(),
        transaction_count: 1,
        confidence_level: 0.6
      });
  }
}

function calculateStdDev(currentAmounts: any, newAmount: number, count: number): number {
  if (count <= 1) return 0;
  
  // Simplified standard deviation calculation
  const avg = currentAmounts.avg || newAmount;
  const variance = Math.pow(newAmount - avg, 2) / count;
  return Math.sqrt(variance);
}