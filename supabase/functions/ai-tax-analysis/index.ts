import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[AI-TAX-ANALYSIS] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Starting AI tax analysis");

    const openaiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiKey) throw new Error("OPENAI_API_KEY is not set");

    // Use service role for secure database access
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");

    logStep("User authenticated", { userId: user.id });

    // Check subscription access
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('subscription_tier, tax_access, tax_analyses_used, tax_analyses_limit')
      .eq('id', user.id)
      .single();

    if (profileError) throw new Error(`Profile error: ${profileError.message}`);

    // Check if user has tax access
    const hasBasicAccess = ['basic', 'premium', 'elite'].includes(profile.subscription_tier);
    const hasAIAccess = ['premium', 'elite'].includes(profile.subscription_tier) || profile.tax_access;

    if (!hasBasicAccess) {
      return new Response(JSON.stringify({ 
        error: "Tax analysis requires Basic subscription or higher",
        upgrade_required: true,
        required_tier: "basic"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 403,
      });
    }

    // Check usage limits for AI analysis
    const { document_text, analysis_type, tax_year } = await req.json();
    
    if (analysis_type === 'ai_powered' && !hasAIAccess) {
      return new Response(JSON.stringify({ 
        error: "AI-powered analysis requires Premium subscription",
        upgrade_required: true,
        required_tier: "premium"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 403,
      });
    }

    // Check usage limits
    const usageLimit = profile.tax_analyses_limit || 5;
    const currentUsage = profile.tax_analyses_used || 0;
    
    if (usageLimit !== -1 && currentUsage >= usageLimit) {
      return new Response(JSON.stringify({ 
        error: "Monthly tax analysis limit reached",
        usage_limit_reached: true,
        current_usage: currentUsage,
        limit: usageLimit
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 429,
      });
    }

    logStep("Access checks passed", { 
      tier: profile.subscription_tier, 
      usage: `${currentUsage}/${usageLimit}`,
      analysis_type 
    });

    let analysisResult;

    if (analysis_type === 'ai_powered') {
      // AI-powered analysis using OpenAI
      const systemPrompt = `You are a professional tax advisor AI assistant. Analyze the provided tax document and provide comprehensive insights.

Focus on:
1. Tax optimization opportunities
2. Potential deductions missed
3. Filing status optimization
4. Estimated tax liability
5. Planning recommendations for next year
6. Risk assessment and compliance notes

Provide structured, actionable advice in JSON format with the following structure:
{
  "summary": "Brief overview of tax situation",
  "optimization_opportunities": ["opportunity1", "opportunity2"],
  "missed_deductions": ["deduction1", "deduction2"],
  "estimated_liability": "amount or range",
  "next_year_planning": ["recommendation1", "recommendation2"],
  "risk_factors": ["risk1", "risk2"],
  "compliance_notes": ["note1", "note2"],
  "confidence_score": 0.85
}`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-2025-04-14',
          messages: [
            { role: 'system', content: systemPrompt },
            { 
              role: 'user', 
              content: `Please analyze this tax document for year ${tax_year}:\n\n${document_text}` 
            }
          ],
          temperature: 0.3,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const aiResponse = await response.json();
      const aiContent = aiResponse.choices[0].message.content;

      logStep("AI analysis completed", { tokens_used: aiResponse.usage?.total_tokens });

      try {
        analysisResult = JSON.parse(aiContent);
      } catch (parseError) {
        // Fallback if AI doesn't return valid JSON
        analysisResult = {
          summary: aiContent,
          optimization_opportunities: [],
          missed_deductions: [],
          estimated_liability: "Unable to calculate",
          next_year_planning: [],
          risk_factors: [],
          compliance_notes: [],
          confidence_score: 0.5
        };
      }
    } else {
      // Basic analysis (rule-based)
      logStep("Performing basic rule-based analysis");
      
      analysisResult = {
        summary: "Basic tax document analysis completed. Consider upgrading to Premium for AI-powered insights.",
        optimization_opportunities: [
          "Review itemized vs standard deduction",
          "Consider retirement account contributions",
          "Evaluate tax-loss harvesting opportunities"
        ],
        missed_deductions: [
          "Home office expenses (if applicable)",
          "Charitable contributions",
          "Educational expenses"
        ],
        estimated_liability: "Basic calculation not available - upgrade for detailed estimates",
        next_year_planning: [
          "Increase 401(k) contributions",
          "Consider Roth IRA conversion",
          "Plan quarterly estimated payments"
        ],
        risk_factors: [
          "Ensure all income sources are reported",
          "Keep detailed records for deductions"
        ],
        compliance_notes: [
          "File by April 15th deadline",
          "Consider professional review for complex situations"
        ],
        confidence_score: 0.6,
        upgrade_message: "Upgrade to Premium for AI-powered detailed analysis and personalized recommendations"
      };
    }

    // Increment usage counter
    await supabaseAdmin
      .from('profiles')
      .update({ tax_analyses_used: currentUsage + 1 })
      .eq('id', user.id);

    // Track analytics event
    await supabaseAdmin.rpc('track_subscription_event', {
      p_user_id: user.id,
      p_event_type: 'feature_accessed',
      p_feature_name: 'tax_analysis',
      p_subscription_tier: profile.subscription_tier,
      p_usage_count: currentUsage + 1,
      p_metadata: {
        analysis_type,
        tax_year,
        has_ai_access: hasAIAccess,
        timestamp: new Date().toISOString()
      }
    });

    logStep("Analysis completed successfully");

    return new Response(JSON.stringify({
      success: true,
      analysis: analysisResult,
      usage_info: {
        current_usage: currentUsage + 1,
        limit: usageLimit,
        remaining: usageLimit === -1 ? -1 : Math.max(0, usageLimit - currentUsage - 1)
      },
      subscription_info: {
        tier: profile.subscription_tier,
        has_ai_access: hasAIAccess,
        analysis_type_used: analysis_type
      }
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in ai-tax-analysis", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});