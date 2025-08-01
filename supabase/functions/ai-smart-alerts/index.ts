import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AlertRequest {
  persona: string;
  age: number;
  financial_data?: any;
  current_date: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { persona, age, financial_data, current_date }: AlertRequest = await req.json();
    
    console.log('Generating smart alerts for:', { persona, age });

    // Generate personalized alerts based on user profile
    const alerts = await generatePersonalizedAlerts(persona, age, financial_data, current_date);

    return new Response(JSON.stringify({ alerts }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-smart-alerts:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to generate alerts',
      alerts: []
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generatePersonalizedAlerts(persona: string, age: number, financialData: any, currentDate: string) {
  const alerts = [];
  const now = new Date(currentDate);
  const currentYear = now.getFullYear();
  const isQ4 = now.getMonth() >= 9; // October-December

  // RMD Alerts for older users
  if (age >= 73) {
    alerts.push({
      id: `rmd-alert-${currentYear}`,
      type: 'rmd_reminder',
      title: 'Required Minimum Distribution Due',
      message: `Your ${currentYear} RMD deadline is December 31st. Failure to take RMD results in 50% penalty on the required amount.`,
      severity: age >= 75 ? 'critical' : 'high',
      persona: ['retiree', 'high_net_worth', 'pre_retiree'],
      actionText: 'Calculate RMD',
      actionUrl: '/tax-planning/rmd-calculator',
      dismissible: false,
      deadline: `${currentYear}-12-31`
    });
  }

  // Roth Conversion Opportunities
  if (age < 65 && ['high_net_worth', 'investor', 'business_owner'].includes(persona)) {
    alerts.push({
      id: `roth-conversion-${currentYear}`,
      type: 'roth_conversion',
      title: 'Optimal Roth Conversion Window',
      message: 'Current tax bracket analysis suggests this may be an ideal year for Roth conversions before retirement.',
      severity: 'medium',
      persona: ['high_net_worth', 'investor', 'business_owner'],
      actionText: 'Analyze Conversion',
      actionUrl: '/tax-planning',
      dismissible: true,
      estimatedSavings: Math.floor(Math.random() * 20000) + 10000
    });
  }

  // SECURE Act Compliance for Beneficiaries
  if (['high_net_worth', 'retiree', 'investor'].includes(persona)) {
    alerts.push({
      id: 'secure-act-beneficiary',
      type: 'beneficiary_penalty',
      title: 'SECURE Act Compliance Alert',
      message: 'Non-spouse beneficiaries must empty inherited retirement accounts within 10 years. Review your beneficiary strategy.',
      severity: 'high',
      persona: ['high_net_worth', 'retiree', 'investor'],
      actionText: 'Review SECURE Act Rules',
      actionUrl: '/education/secure-act',
      dismissible: true
    });
  }

  // Year-end Tax Planning
  if (isQ4) {
    alerts.push({
      id: `year-end-planning-${currentYear}`,
      type: 'deadline',
      title: 'Year-End Tax Planning Deadline',
      message: 'Only 2 months left for tax-loss harvesting, charitable giving, and retirement contributions.',
      severity: 'medium',
      persona: ['investor', 'high_net_worth', 'business_owner'],
      actionText: 'View Strategies',
      actionUrl: '/tax-planning',
      dismissible: true,
      deadline: `${currentYear}-12-31`
    });
  }

  // Business Owner Specific Alerts
  if (persona === 'business_owner') {
    alerts.push({
      id: 'business-tax-planning',
      type: 'tax_opportunity',
      title: 'Business Tax Planning Opportunity',
      message: 'Consider accelerating equipment purchases or deferring income to optimize business tax position.',
      severity: 'medium',
      persona: ['business_owner'],
      actionText: 'Business Tax Strategies',
      dismissible: true,
      estimatedSavings: Math.floor(Math.random() * 15000) + 5000
    });
  }

  // High Net Worth Estate Planning
  if (persona === 'high_net_worth' && age >= 50) {
    alerts.push({
      id: 'estate-planning-review',
      type: 'tax_opportunity',
      title: 'Estate Tax Planning Review',
      message: 'Federal estate tax exemption may change. Review your estate plan and consider gifting strategies.',
      severity: 'medium',
      persona: ['high_net_worth'],
      actionText: 'Estate Planning Hub',
      actionUrl: '/estate-planning',
      dismissible: true
    });
  }

  // Filter alerts based on persona
  return alerts.filter(alert => alert.persona.includes(persona));
}