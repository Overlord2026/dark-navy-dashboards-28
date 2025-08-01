import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatRequest {
  message: string;
  conversation_id: string;
  user_persona: string;
  current_page: string;
  context_data?: any;
  message_history: any[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, user_persona, current_page, context_data }: ChatRequest = await req.json();
    
    console.log('AI Chat Request:', { message, user_persona, current_page });

    // Generate contextual response based on user persona and page
    const response = await generateAIResponse(message, user_persona, current_page, context_data);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-chat-assistant:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to generate response',
      response: 'I apologize for the technical difficulty. Please try rephrasing your question or contact support.',
      suggestions: ['Contact Support', 'Try Again', 'Browse Tax Resources']
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generateAIResponse(message: string, persona: string, currentPage: string, contextData: any) {
  // Simulated AI responses based on common tax questions and user persona
  const lowerMessage = message.toLowerCase();
  
  // Tax strategy questions
  if (lowerMessage.includes('tax strateg') || lowerMessage.includes('reduce tax')) {
    return {
      response: getPersonalizedTaxStrategy(persona),
      suggestions: [
        'Tell me about Roth conversions',
        'What about tax-loss harvesting?',
        'When should I meet with a CPA?',
        'Show me tax calculators'
      ]
    };
  }
  
  // Roth conversion questions
  if (lowerMessage.includes('roth') || lowerMessage.includes('conversion')) {
    return {
      response: `Roth conversions can be excellent for ${persona}s. You pay taxes now on converted amounts, but future withdrawals are tax-free. Key considerations for your situation:\n\n• Current vs. future tax rates\n• Income timing and tax brackets\n• Long-term growth potential\n• Estate planning benefits\n\nWould you like me to walk you through our Roth conversion calculator?`,
      suggestions: [
        'Open Roth calculator',
        'What are the risks?',
        'How much should I convert?',
        'Find a tax advisor'
      ]
    };
  }
  
  // RMD questions
  if (lowerMessage.includes('rmd') || lowerMessage.includes('required minimum')) {
    return {
      response: `Required Minimum Distributions (RMDs) start at age 73 for most retirement accounts. The penalty for missing an RMD is severe - 50% of the required amount! Key points:\n\n• Calculate based on account balance and life expectancy\n• Due by December 31st each year\n• First RMD can be delayed until April 1st of following year\n• Consider charitable distributions to satisfy RMDs\n\nI can help you calculate your RMD or find strategies to minimize the tax impact.`,
      suggestions: [
        'Calculate my RMD',
        'Charitable distribution options',
        'RMD planning strategies',
        'Find retirement planning help'
      ]
    };
  }
  
  // General tax questions
  if (lowerMessage.includes('tax') && (lowerMessage.includes('save') || lowerMessage.includes('reduce'))) {
    return {
      response: getGeneralTaxAdvice(persona),
      suggestions: [
        'Year-end tax strategies',
        'Retirement account optimization',
        'Business tax planning',
        'Schedule CPA consultation'
      ]
    };
  }
  
  // Default helpful response
  return {
    response: `I'm here to help with your tax planning questions! As a ${persona}, you have unique opportunities to optimize your tax situation. I can assist with:\n\n• Tax strategy recommendations\n• Retirement account planning\n• Year-end tax moves\n• Finding qualified tax professionals\n\nWhat specific tax topic would you like to explore?`,
    suggestions: [
      'Reduce my tax bill',
      'Roth conversion analysis',
      'Year-end planning',
      'Find a tax professional'
    ]
  };
}

function getPersonalizedTaxStrategy(persona: string): string {
  switch (persona) {
    case 'high_net_worth':
      return `For high net worth individuals, sophisticated tax strategies are essential:\n\n• **Advanced Estate Planning**: Consider grantor trusts, charitable remainder trusts\n• **Tax-Loss Harvesting**: Systematically realize losses to offset gains\n• **Municipal Bonds**: Tax-free income in high tax brackets\n• **Qualified Small Business Stock**: Potential for significant tax savings\n• **Charitable Planning**: Donor-advised funds and appreciated securities\n\nYour tax situation likely requires professional guidance. Should I help you find a qualified advisor?`;
      
    case 'business_owner':
      return `Business owners have unique tax optimization opportunities:\n\n• **Equipment & Asset Purchases**: Section 179 deductions and bonus depreciation\n• **Retirement Plans**: Higher contribution limits with SEP-IRAs and 401(k)s\n• **Income Timing**: Defer income or accelerate expenses strategically\n• **Entity Structure**: Optimize between LLC, S-Corp, or C-Corp\n• **Tax Credits**: R&D, Work Opportunity, and other business credits\n\nThe key is coordinating business and personal tax strategies. Would you like specific guidance on any of these areas?`;
      
    case 'retiree':
      return `Retirement tax planning focuses on preserving wealth and minimizing taxes:\n\n• **Withdrawal Sequencing**: Order of account withdrawals matters significantly\n• **RMD Management**: Strategies to minimize required distribution impact\n• **Tax Bracket Management**: Staying in lower brackets through careful planning\n• **Charitable Giving**: QCDs can reduce taxable income while supporting causes\n• **Healthcare Costs**: HSA strategies and medical expense deductions\n\nEvery dollar saved in taxes extends your retirement security. What's your biggest tax concern in retirement?`;
      
    default:
      return `Based on your profile, here are key tax strategies to consider:\n\n• **Maximize Retirement Contributions**: 401(k), IRA, and HSA contributions\n• **Tax-Loss Harvesting**: Offset investment gains with strategic losses\n• **Year-End Planning**: Time income and expenses for optimal tax impact\n• **Professional Guidance**: Complex situations benefit from expert advice\n\nTax planning is most effective when done proactively throughout the year. What aspect of tax planning is most important to you right now?`;
  }
}

function getGeneralTaxAdvice(persona: string): string {
  return `Here are proven tax reduction strategies for ${persona}s:\n\n• **Retirement Account Maximization**: Use all available tax-advantaged accounts\n• **Strategic Asset Location**: Place investments in tax-optimal accounts\n• **Year-End Tax Moves**: Harvest losses, bunch deductions, time income\n• **Professional Planning**: Work with qualified tax professionals for complex situations\n\nThe best tax strategy is one tailored to your specific situation. Would you like me to help you explore any of these strategies in detail?`;
}