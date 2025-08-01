import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ClientData {
  id: string;
  name: string;
  email: string;
  taxSavingsOpportunities: TaxOpportunity[];
  currentTaxSituation: {
    agi: number;
    taxableIncome: number;
    currentTaxBracket: string;
    estimatedTaxLiability: number;
  };
  recommendations: Recommendation[];
}

interface TaxOpportunity {
  id: string;
  type: string;
  description: string;
  potentialSavings: number;
  priority: 'high' | 'medium' | 'low';
  timeframe: string;
  actionRequired: string;
}

interface Recommendation {
  category: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  timeline: string;
  nextSteps: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting client report generation...');
    
    const { clientId, reportType = 'comprehensive' } = await req.json();
    
    if (!clientId) {
      throw new Error('Client ID is required');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch client data (in production, this would come from your database)
    const clientData: ClientData = await generateMockClientData(clientId);
    
    // Generate the report based on type
    let reportData;
    switch (reportType) {
      case 'comprehensive':
        reportData = await generateComprehensiveReport(clientData);
        break;
      case 'tax-opportunities':
        reportData = await generateTaxOpportunitiesReport(clientData);
        break;
      case 'quarterly-summary':
        reportData = await generateQuarterlySummaryReport(clientData);
        break;
      default:
        reportData = await generateComprehensiveReport(clientData);
    }

    console.log('Report generated successfully for client:', clientId);

    return new Response(JSON.stringify(reportData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating client report:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to generate client report'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generateMockClientData(clientId: string): Promise<ClientData> {
  // In production, this would fetch real data from your database
  return {
    id: clientId,
    name: 'John Smith',
    email: 'john.smith@email.com',
    currentTaxSituation: {
      agi: 250000,
      taxableIncome: 230000,
      currentTaxBracket: '24%',
      estimatedTaxLiability: 55000
    },
    taxSavingsOpportunities: [
      {
        id: '1',
        type: 'Roth Conversion',
        description: 'Convert $50,000 from traditional 401(k) to Roth IRA during lower-income year',
        potentialSavings: 12000,
        priority: 'high',
        timeframe: 'Q1 2024',
        actionRequired: 'Coordinate with plan administrator and execute conversion'
      },
      {
        id: '2',
        type: 'Tax-Loss Harvesting',
        description: 'Realize capital losses to offset gains and reduce current tax liability',
        potentialSavings: 8500,
        priority: 'medium',
        timeframe: 'Before year-end',
        actionRequired: 'Review portfolio and execute tax-loss harvesting strategy'
      },
      {
        id: '3',
        type: 'Charitable Giving',
        description: 'Optimize charitable contributions using donor-advised fund',
        potentialSavings: 5000,
        priority: 'medium',
        timeframe: 'Q4 2024',
        actionRequired: 'Set up donor-advised fund and plan contribution strategy'
      }
    ],
    recommendations: [
      {
        category: 'Retirement Planning',
        title: 'Maximize 401(k) Contributions',
        description: 'Increase 401(k) contributions to maximum allowable limit to reduce taxable income',
        impact: 'high',
        timeline: 'Immediate',
        nextSteps: [
          'Contact HR to increase contribution percentage',
          'Consider catch-up contributions if age 50+',
          'Review investment allocations'
        ]
      },
      {
        category: 'Estate Planning',
        title: 'Update Estate Planning Documents',
        description: 'Review and update will, trusts, and beneficiary designations',
        impact: 'medium',
        timeline: '3-6 months',
        nextSteps: [
          'Schedule meeting with estate planning attorney',
          'Review current beneficiary designations',
          'Consider family trust structures'
        ]
      }
    ]
  };
}

async function generateComprehensiveReport(clientData: ClientData) {
  const totalPotentialSavings = clientData.taxSavingsOpportunities.reduce(
    (sum, opp) => sum + opp.potentialSavings, 0
  );

  return {
    reportType: 'comprehensive',
    clientName: clientData.name,
    generatedAt: new Date().toISOString(),
    executiveSummary: {
      totalPotentialSavings,
      highPriorityOpportunities: clientData.taxSavingsOpportunities.filter(o => o.priority === 'high').length,
      recommendationsCount: clientData.recommendations.length,
      currentEffectiveTaxRate: ((clientData.currentTaxSituation.estimatedTaxLiability / clientData.currentTaxSituation.agi) * 100).toFixed(2)
    },
    currentTaxSituation: clientData.currentTaxSituation,
    taxSavingsOpportunities: clientData.taxSavingsOpportunities,
    recommendations: clientData.recommendations,
    nextSteps: [
      'Schedule follow-up meeting to discuss high-priority opportunities',
      'Begin implementation of immediate action items',
      'Set calendar reminders for time-sensitive strategies',
      'Monitor progress quarterly'
    ],
    disclaimer: 'This report is for informational purposes only and does not constitute tax advice. Please consult with your tax professional before implementing any strategies.'
  };
}

async function generateTaxOpportunitiesReport(clientData: ClientData) {
  return {
    reportType: 'tax-opportunities',
    clientName: clientData.name,
    generatedAt: new Date().toISOString(),
    opportunities: clientData.taxSavingsOpportunities.map(opp => ({
      ...opp,
      implementationSteps: generateImplementationSteps(opp.type),
      risks: generateRiskAssessment(opp.type),
      timeline: generateDetailedTimeline(opp.timeframe)
    }))
  };
}

async function generateQuarterlySummaryReport(clientData: ClientData) {
  return {
    reportType: 'quarterly-summary',
    clientName: clientData.name,
    quarter: `Q${Math.ceil((new Date().getMonth() + 1) / 3)} ${new Date().getFullYear()}`,
    generatedAt: new Date().toISOString(),
    summary: {
      actionItemsCompleted: 3,
      newOpportunitiesIdentified: clientData.taxSavingsOpportunities.length,
      estimatedSavingsRealized: 15000,
      upcomingDeadlines: [
        'Q4 estimated tax payment due December 15',
        'Year-end retirement contribution deadline'
      ]
    },
    recommendations: clientData.recommendations
  };
}

function generateImplementationSteps(opportunityType: string): string[] {
  const steps: Record<string, string[]> = {
    'Roth Conversion': [
      'Determine optimal conversion amount',
      'Contact 401(k) plan administrator',
      'Open Roth IRA if needed',
      'Execute conversion transaction',
      'Track tax implications'
    ],
    'Tax-Loss Harvesting': [
      'Review current portfolio positions',
      'Identify securities with unrealized losses',
      'Execute sales to realize losses',
      'Reinvest proceeds avoiding wash sale rules',
      'Document transactions for tax reporting'
    ],
    'Charitable Giving': [
      'Research donor-advised fund providers',
      'Open donor-advised fund account',
      'Transfer appreciated securities',
      'Plan distribution strategy',
      'Maintain proper documentation'
    ]
  };
  
  return steps[opportunityType] || ['Consult with tax professional for implementation guidance'];
}

function generateRiskAssessment(opportunityType: string): string[] {
  const risks: Record<string, string[]> = {
    'Roth Conversion': [
      'Immediate tax liability on converted amount',
      'Potential to push into higher tax bracket',
      'Market volatility affecting converted assets'
    ],
    'Tax-Loss Harvesting': [
      'Wash sale rule violations',
      'Potential for future gains to be taxed at higher rates',
      'Market timing risks'
    ],
    'Charitable Giving': [
      'Irrevocable nature of charitable contributions',
      'Reduced liquid assets for other opportunities',
      'Market volatility affecting donated securities'
    ]
  };
  
  return risks[opportunityType] || ['General market and regulatory risks apply'];
}

function generateDetailedTimeline(timeframe: string): string {
  const timelines: Record<string, string> = {
    'Q1 2024': 'January 1 - March 31, 2024. Optimal timing for conversions due to early year market positioning.',
    'Before year-end': 'Complete by December 31, 2024 to capture current year tax benefits.',
    'Q4 2024': 'October 1 - December 31, 2024. Plan for year-end tax optimization strategies.'
  };
  
  return timelines[timeframe] || timeframe;
}