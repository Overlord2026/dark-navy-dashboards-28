import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface MatchingRequest {
  questionnaireId: string;
  responses: any;
}

interface AdvisorProfile {
  id: string;
  name: string;
  firm_name: string;
  email: string;
  license_states: string[];
  specializations: string[];
  expertise_areas: string[];
  years_experience: number;
  hourly_rate: number;
  availability_status: string;
  average_rating: number;
  total_reviews: number;
  bio: string;
  certifications: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { questionnaireId, responses }: MatchingRequest = await req.json();
    
    console.log('Processing advisor matching for questionnaire:', questionnaireId);

    // Get all active advisors
    const { data: advisors, error: advisorsError } = await supabase
      .from('advisor_profiles')
      .select('*')
      .eq('is_active', true)
      .eq('is_verified', true);

    if (advisorsError) {
      throw new Error(`Failed to fetch advisors: ${advisorsError.message}`);
    }

    // Calculate complexity score
    const complexityScore = calculateComplexityScore(responses);
    
    // Get AI-powered matching analysis
    const matches = await analyzeMatches(advisors, responses, complexityScore);
    
    // Store matches in database
    const matchResults = [];
    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      const { data: matchRecord, error: matchError } = await supabase
        .from('advisor_matches')
        .insert({
          questionnaire_id: questionnaireId,
          advisor_id: match.advisor_id,
          match_score: match.score,
          ai_reasoning: match.reasoning,
          expertise_match_details: match.expertise_details,
          availability_match: match.availability_match,
          license_match: match.license_match,
          budget_match: match.budget_match,
          recommended_order: i + 1
        })
        .select()
        .single();

      if (matchError) {
        console.error('Error storing match:', matchError);
        continue;
      }

      matchResults.push({
        ...matchRecord,
        advisor: advisors.find(a => a.id === match.advisor_id)
      });
    }

    // Update questionnaire with complexity score and needs
    await supabase
      .from('client_questionnaires')
      .update({
        complexity_score: complexityScore,
        specialization_needs: extractSpecializationNeeds(responses),
        preferred_meeting_type: responses.preferred_meeting_type,
        budget_range: responses.budget_range,
        timeline: responses.timeline
      })
      .eq('id', questionnaireId);

    return new Response(JSON.stringify({
      matches: matchResults,
      complexity_score: complexityScore,
      total_matches: matchResults.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in advisor-matching function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to process advisor matching request'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function calculateComplexityScore(responses: any): number {
  let score = 0;

  // Income complexity
  const income = parseInt(responses.annual_income) || 0;
  if (income > 500000) score += 3;
  else if (income > 250000) score += 2;
  else if (income > 100000) score += 1;

  // Equity compensation
  if (responses.has_equity_comp === 'true') score += 2;

  // Multiple states
  if (responses.states_with_income && responses.states_with_income.length > 1) score += 2;

  // Business ownership
  if (responses.owns_business === 'true') score += 3;

  // International income
  if (responses.international_income === 'true') score += 2;

  // Estate planning needs
  const netWorth = parseInt(responses.net_worth) || 0;
  if (netWorth > 1000000) score += 2;

  return Math.min(score, 10);
}

function extractSpecializationNeeds(responses: any): string[] {
  const needs = [];

  if (responses.has_equity_comp === 'true') needs.push('equity_compensation');
  if (responses.owns_business === 'true') needs.push('small_business');
  if (responses.international_income === 'true') needs.push('international_tax');
  if (responses.estate_planning === 'true') needs.push('estate_planning');
  if (responses.charitable_giving === 'true') needs.push('charitable_giving');
  if (responses.investment_planning === 'true') needs.push('investment_planning');

  return needs;
}

async function analyzeMatches(advisors: AdvisorProfile[], responses: any, complexityScore: number) {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openAIApiKey) {
    console.log('No OpenAI API key, using rule-based matching');
    return ruleBasedMatching(advisors, responses, complexityScore);
  }

  try {
    const prompt = `
    You are an expert at matching clients to tax advisors and CPAs. Analyze the client's needs and rank the top 3 advisors.

    Client Profile:
    - Annual Income: $${responses.annual_income}
    - States with income: ${responses.states_with_income?.join(', ') || 'Not specified'}
    - Has equity compensation: ${responses.has_equity_comp}
    - Owns business: ${responses.owns_business}
    - International income: ${responses.international_income}
    - Net worth: $${responses.net_worth}
    - Complexity score: ${complexityScore}/10
    - Budget range: ${responses.budget_range}
    - Preferred meeting type: ${responses.preferred_meeting_type}
    - Timeline: ${responses.timeline}

    Available Advisors:
    ${advisors.map((advisor, i) => `
    ${i + 1}. ${advisor.name} (${advisor.firm_name})
       - Licensed in: ${advisor.license_states.join(', ')}
       - Specializations: ${advisor.specializations.join(', ')}
       - Expertise: ${advisor.expertise_areas.join(', ')}
       - Experience: ${advisor.years_experience} years
       - Rate: $${advisor.hourly_rate}/hr
       - Rating: ${advisor.average_rating}/5 (${advisor.total_reviews} reviews)
       - Bio: ${advisor.bio}
    `).join('\n')}

    For each of the top 3 matches, provide:
    1. Match score (1-100)
    2. Detailed reasoning (2-3 sentences)
    3. Specific expertise alignment
    4. Any concerns or limitations

    Respond with valid JSON only:
    {
      "matches": [
        {
          "advisor_id": "uuid",
          "score": 95,
          "reasoning": "Detailed explanation...",
          "expertise_alignment": ["area1", "area2"],
          "concerns": "Any limitations..."
        }
      ]
    }
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
      }),
    });

    const aiResponse = await response.json();
    const analysis = JSON.parse(aiResponse.choices[0].message.content);

    return analysis.matches.map((match: any) => ({
      advisor_id: match.advisor_id,
      score: match.score,
      reasoning: match.reasoning,
      expertise_details: {
        alignment: match.expertise_alignment,
        concerns: match.concerns
      },
      availability_match: true,
      license_match: checkLicenseMatch(advisors.find(a => a.id === match.advisor_id), responses),
      budget_match: checkBudgetMatch(advisors.find(a => a.id === match.advisor_id), responses)
    }));

  } catch (error) {
    console.error('AI matching failed, falling back to rule-based:', error);
    return ruleBasedMatching(advisors, responses, complexityScore);
  }
}

function ruleBasedMatching(advisors: AdvisorProfile[], responses: any, complexityScore: number) {
  const scored = advisors.map(advisor => {
    let score = 50; // Base score

    // License match
    if (responses.states_with_income?.some((state: string) => advisor.license_states.includes(state))) {
      score += 20;
    }

    // Expertise match
    const clientNeeds = extractSpecializationNeeds(responses);
    const expertiseOverlap = advisor.expertise_areas.filter(area => 
      clientNeeds.some(need => area.includes(need))
    ).length;
    score += expertiseOverlap * 5;

    // Experience for complexity
    if (complexityScore > 7 && advisor.years_experience > 10) score += 15;
    if (complexityScore < 4 && advisor.years_experience > 5) score += 10;

    // Rating boost
    score += (advisor.average_rating - 3) * 5;

    return {
      advisor_id: advisor.id,
      score: Math.min(score, 100),
      reasoning: `Matched based on license states, expertise overlap, and experience level.`,
      expertise_details: { alignment: advisor.expertise_areas.slice(0, 3), concerns: null },
      availability_match: advisor.availability_status === 'available',
      license_match: checkLicenseMatch(advisor, responses),
      budget_match: checkBudgetMatch(advisor, responses)
    };
  }).sort((a, b) => b.score - a.score).slice(0, 3);

  return scored;
}

function checkLicenseMatch(advisor: AdvisorProfile | undefined, responses: any): boolean {
  if (!advisor || !responses.states_with_income) return true;
  return responses.states_with_income.some((state: string) => advisor.license_states.includes(state));
}

function checkBudgetMatch(advisor: AdvisorProfile | undefined, responses: any): boolean {
  if (!advisor || !responses.budget_range) return true;
  
  const budgetRanges = {
    'under_200': 200,
    '200_400': 400,
    '400_600': 600,
    'over_600': 1000
  };
  
  const maxBudget = budgetRanges[responses.budget_range as keyof typeof budgetRanges];
  return advisor.hourly_rate <= maxBudget;
}