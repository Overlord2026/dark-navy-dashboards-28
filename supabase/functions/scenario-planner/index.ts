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

interface ScenarioRequest {
  scenarioType: 'roth_conversion' | 'nua' | 'charitable' | 'loss_harvesting';
  scenarioName: string;
  inputParameters: any;
  userId: string;
  advisorId?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { scenarioType, scenarioName, inputParameters, userId, advisorId }: ScenarioRequest = await req.json();
    
    console.log(`Processing ${scenarioType} scenario for user ${userId}`);

    let analysis, simulationResults, recommendations;

    switch (scenarioType) {
      case 'roth_conversion':
        ({ analysis, simulationResults, recommendations } = await analyzeRothConversion(inputParameters));
        break;
      case 'nua':
        ({ analysis, simulationResults, recommendations } = await analyzeNUA(inputParameters));
        break;
      case 'charitable':
        ({ analysis, simulationResults, recommendations } = await analyzeCharitableGiving(inputParameters));
        break;
      case 'loss_harvesting':
        ({ analysis, simulationResults, recommendations } = await analyzeLossHarvesting(inputParameters));
        break;
      default:
        throw new Error(`Unsupported scenario type: ${scenarioType}`);
    }

    // Store scenario in database
    const { data: scenario, error: scenarioError } = await supabase
      .from('planning_scenarios')
      .insert({
        user_id: userId,
        scenario_type: scenarioType,
        scenario_name: scenarioName,
        input_parameters: inputParameters,
        ai_analysis: analysis,
        simulation_results: simulationResults,
        recommendations,
        advisor_id: advisorId,
        status: 'completed'
      })
      .select()
      .single();

    if (scenarioError) {
      throw new Error(`Failed to save scenario: ${scenarioError.message}`);
    }

    return new Response(JSON.stringify({
      scenario_id: scenario.id,
      analysis,
      simulation_results: simulationResults,
      recommendations,
      compliance_notes: generateComplianceNotes(scenarioType)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in scenario-planner function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to process scenario planning request'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function analyzeRothConversion(params: any) {
  const {
    currentAge,
    retirementAge,
    currentIncome,
    traditionalIRA,
    currentTaxRate,
    retirementTaxRate,
    conversionAmount,
    expectedReturn
  } = params;

  // Calculate traditional IRA growth
  const yearsToRetirement = retirementAge - currentAge;
  const traditionalGrowth = traditionalIRA * Math.pow(1 + expectedReturn/100, yearsToRetirement);
  const traditionalTaxes = traditionalGrowth * (retirementTaxRate/100);
  const traditionalNetValue = traditionalGrowth - traditionalTaxes;

  // Calculate Roth conversion scenario
  const conversionTax = conversionAmount * (currentTaxRate/100);
  const remainingTraditional = traditionalIRA - conversionAmount;
  const rothGrowth = conversionAmount * Math.pow(1 + expectedReturn/100, yearsToRetirement);
  const remainingTraditionalGrowth = remainingTraditional * Math.pow(1 + expectedReturn/100, yearsToRetirement);
  const remainingTraditionalTaxes = remainingTraditionalGrowth * (retirementTaxRate/100);
  const totalRothValue = rothGrowth + (remainingTraditionalGrowth - remainingTraditionalTaxes);

  const netBenefit = totalRothValue - traditionalNetValue;
  const breakEvenYears = calculateBreakEven(conversionTax, netBenefit, yearsToRetirement);

  const analysis = {
    conversion_tax: conversionTax,
    net_benefit: netBenefit,
    break_even_years: breakEvenYears,
    projected_savings: netBenefit > 0 ? netBenefit : 0
  };

  const simulationResults = {
    traditional_scenario: {
      final_value: traditionalGrowth,
      taxes_owed: traditionalTaxes,
      net_value: traditionalNetValue
    },
    roth_scenario: {
      conversion_tax: conversionTax,
      roth_value: rothGrowth,
      remaining_traditional_value: remainingTraditionalGrowth - remainingTraditionalTaxes,
      total_net_value: totalRothValue
    }
  };

  const recommendations = await getAIRecommendations('roth_conversion', params, analysis);

  return { analysis, simulationResults, recommendations };
}

async function analyzeNUA(params: any) {
  const {
    sharesOwned,
    costBasis,
    currentValue,
    currentTaxRate,
    ltcgRate,
    holdingPeriod
  } = params;

  const nuaAmount = currentValue - costBasis;
  const ordinaryIncomeTax = costBasis * (currentTaxRate/100);
  const nuaTax = nuaAmount * (ltcgRate/100);
  const totalNuaTax = ordinaryIncomeTax + nuaTax;

  // Compare to rollover scenario
  const rolloverTax = currentValue * (currentTaxRate/100);
  const taxSavings = rolloverTax - totalNuaTax;

  const analysis = {
    nua_amount: nuaAmount,
    ordinary_income_tax: ordinaryIncomeTax,
    nua_tax: nuaTax,
    total_tax: totalNuaTax,
    tax_savings: taxSavings,
    effective_rate: (totalNuaTax / currentValue) * 100
  };

  const simulationResults = {
    nua_strategy: {
      immediate_tax: totalNuaTax,
      future_ltcg_exposure: nuaAmount,
      net_proceeds: currentValue - totalNuaTax
    },
    rollover_strategy: {
      immediate_tax: 0,
      future_ordinary_income: currentValue,
      estimated_future_tax: rolloverTax
    }
  };

  const recommendations = await getAIRecommendations('nua', params, analysis);

  return { analysis, simulationResults, recommendations };
}

async function analyzeCharitableGiving(params: any) {
  const {
    donationAmount,
    assetType,
    costBasis,
    currentValue,
    taxRate,
    charitableDeduction,
    estateTaxRate
  } = params;

  const capitalGain = assetType === 'appreciated_stock' ? currentValue - costBasis : 0;
  const capitalGainsTax = capitalGain * 0.20; // Assuming 20% LTCG rate
  const charitableDeduction = Math.min(donationAmount, currentValue * 0.30); // 30% AGI limit
  const taxSavings = charitableDeduction * (taxRate/100);
  const netCost = donationAmount - taxSavings - capitalGainsTax;

  const analysis = {
    charitable_deduction: charitableDeduction,
    tax_savings: taxSavings,
    avoided_capital_gains: capitalGainsTax,
    net_cost: netCost,
    effective_cost_percentage: (netCost / donationAmount) * 100
  };

  const simulationResults = {
    direct_cash_donation: {
      donation_amount: donationAmount,
      tax_deduction: Math.min(donationAmount, currentValue * 0.50),
      net_cost: donationAmount - (Math.min(donationAmount, currentValue * 0.50) * (taxRate/100))
    },
    appreciated_asset_donation: {
      donation_amount: currentValue,
      tax_deduction: charitableDeduction,
      avoided_taxes: capitalGainsTax,
      net_cost: netCost
    }
  };

  const recommendations = await getAIRecommendations('charitable', params, analysis);

  return { analysis, simulationResults, recommendations };
}

async function analyzeLossHarvesting(params: any) {
  const {
    losseAvailable,
    capitalGains,
    ordinaryIncome,
    taxRate,
    ltcgRate,
    carryforwardLosses
  } = params;

  const gainsToOffset = Math.min(losseAvailable, capitalGains);
  const ltcgTaxSaved = gainsToOffset * (ltcgRate/100);
  
  const remainingLosses = losseAvailable - gainsToOffset;
  const ordinaryIncomeOffset = Math.min(remainingLosses, 3000); // IRS limit
  const ordinaryTaxSaved = ordinaryIncomeOffset * (taxRate/100);
  
  const totalTaxSavings = ltcgTaxSaved + ordinaryTaxSaved;
  const carryforward = remainingLosses - ordinaryIncomeOffset;

  const analysis = {
    gains_offset: gainsToOffset,
    ordinary_income_offset: ordinaryIncomeOffset,
    ltcg_tax_saved: ltcgTaxSaved,
    ordinary_tax_saved: ordinaryTaxSaved,
    total_tax_savings: totalTaxSavings,
    loss_carryforward: carryforward
  };

  const simulationResults = {
    current_year: {
      tax_savings: totalTaxSavings,
      losses_used: losseAvailable - carryforward
    },
    future_years: {
      carryforward_losses: carryforward,
      estimated_future_savings: Math.min(carryforward, 3000) * (taxRate/100)
    }
  };

  const recommendations = await getAIRecommendations('loss_harvesting', params, analysis);

  return { analysis, simulationResults, recommendations };
}

async function getAIRecommendations(scenarioType: string, params: any, analysis: any): Promise<string> {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openAIApiKey) {
    return getDefaultRecommendations(scenarioType, analysis);
  }

  try {
    const prompt = `
    As a tax planning expert, provide detailed recommendations for this ${scenarioType} scenario.
    
    Input Parameters: ${JSON.stringify(params, null, 2)}
    Analysis Results: ${JSON.stringify(analysis, null, 2)}
    
    Provide 3-5 specific, actionable recommendations considering:
    1. Tax implications and timing
    2. Risk factors and considerations
    3. Alternative strategies
    4. Implementation steps
    5. Compliance requirements
    
    Format as clear, numbered recommendations.
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
    return aiResponse.choices[0].message.content;

  } catch (error) {
    console.error('AI recommendations failed:', error);
    return getDefaultRecommendations(scenarioType, analysis);
  }
}

function getDefaultRecommendations(scenarioType: string, analysis: any): string {
  const recommendations = {
    roth_conversion: [
      '1. Consider the long-term tax savings potential',
      '2. Evaluate current vs. future tax rate assumptions',
      '3. Plan conversion timing to manage tax brackets',
      '4. Consider partial conversions over multiple years'
    ],
    nua: [
      '1. Verify holding period requirements',
      '2. Consider timing of distribution and sale',
      '3. Evaluate estate planning implications',
      '4. Consult on net unrealized appreciation calculations'
    ],
    charitable: [
      '1. Consider donating appreciated assets vs. cash',
      '2. Review AGI limitations for deductions',
      '3. Explore donor-advised funds for flexibility',
      '4. Evaluate estate tax benefits'
    ],
    loss_harvesting: [
      '1. Implement systematic harvesting throughout the year',
      '2. Avoid wash sale rules',
      '3. Consider asset location strategies',
      '4. Plan for loss carryforward utilization'
    ]
  };

  return recommendations[scenarioType as keyof typeof recommendations]?.join('\n') || 'Consult with a tax professional for personalized advice.';
}

function calculateBreakEven(conversionTax: number, netBenefit: number, years: number): number {
  if (netBenefit <= 0) return years;
  return Math.round(conversionTax / (netBenefit / years));
}

function generateComplianceNotes(scenarioType: string): string[] {
  const complianceNotes = {
    roth_conversion: [
      'Consider pro-rata rule for multiple IRA accounts',
      'Review income limits for Roth IRA contributions',
      'Ensure proper reporting on Form 8606'
    ],
    nua: [
      'Verify employer stock qualifies for NUA treatment',
      'Must take lump-sum distribution in one tax year',
      'Consider impact on Medicare premiums'
    ],
    charitable: [
      'Ensure charity qualifies under Section 501(c)(3)',
      'Obtain qualified appraisal for assets over $5,000',
      'Review AGI percentage limitations'
    ],
    loss_harvesting: [
      'Adhere to wash sale rules (30-day period)',
      'Track adjusted basis for future sales',
      'Consider state tax implications'
    ]
  };

  return complianceNotes[scenarioType as keyof typeof complianceNotes] || [];
}