import { Template, ProPersona } from '../types';

// Template repository with persona-specific templates
export const TEMPLATE_REPOSITORY: Record<ProPersona, Template[]> = {
  advisor: [
    {
      id: 'advisor_welcome',
      persona: 'advisor',
      name: 'Welcome New Client',
      subject: 'Welcome to {{firm_name}} - Your Financial Journey Begins',
      content: `# Welcome to {{firm_name}}!

Dear {{client_name}},

Thank you for choosing us as your financial advisory partner. We're excited to help you achieve your financial goals.

## What's Next?
- Schedule your initial consultation
- Complete your financial assessment
- Review our recommended strategies

## Your Advisor Team
{{advisor_name}} will be your primary contact, with {{years_experience}} years of experience in financial planning.

Best regards,
{{firm_name}} Team

*This communication contains important financial information. Please review all materials carefully.*`,
      category: 'onboarding',
      tokens: ['client_name', 'firm_name', 'advisor_name', 'years_experience'],
      compliance_reviewed: true,
      policy_version: 'v1.0'
    },
    {
      id: 'advisor_portfolio_review',
      persona: 'advisor',
      name: 'Quarterly Portfolio Review',
      subject: 'Q{{quarter}} Portfolio Performance Review',
      content: `# Quarterly Portfolio Review - Q{{quarter}}

Hello {{client_name}},

Your portfolio performance for Q{{quarter}} is ready for review.

## Key Highlights
- Portfolio return: {{portfolio_return}}%
- Benchmark comparison: {{benchmark_comparison}}
- Risk assessment: {{risk_level}}

## Recommended Actions
{{recommendations}}

Let's schedule a meeting to discuss these results in detail.

Best regards,
{{advisor_name}}

*Past performance does not guarantee future results. All investments carry risk.*`,
      category: 'follow-up',
      tokens: ['client_name', 'quarter', 'portfolio_return', 'benchmark_comparison', 'risk_level', 'recommendations', 'advisor_name'],
      compliance_reviewed: true,
      policy_version: 'v1.0'
    }
  ],
  cpa: [
    {
      id: 'cpa_tax_season_prep',
      persona: 'cpa',
      name: 'Tax Season Preparation',
      subject: 'Tax Season 2024 - Document Checklist for {{client_name}}',
      content: `# Tax Season 2024 Preparation

Dear {{client_name}},

Tax season is approaching! Here's your personalized document checklist:

## Required Documents
- W-2 forms from all employers
- 1099 forms (interest, dividends, retirement distributions)
- Receipts for deductible expenses
- {{additional_documents}}

## Important Dates
- Tax filing deadline: April 15, 2024
- Extension deadline: October 15, 2024

## Schedule Your Appointment
Contact us at {{phone}} to schedule your tax preparation appointment.

Sincerely,
{{cpa_name}}, CPA
{{firm_name}}

*This communication is from a licensed CPA. Tax advice should be tailored to your specific situation.*`,
      category: 'newsletter',
      tokens: ['client_name', 'additional_documents', 'phone', 'cpa_name', 'firm_name'],
      compliance_reviewed: true,
      policy_version: 'v1.0'
    }
  ],
  attorney: [
    {
      id: 'attorney_case_update',
      persona: 'attorney',
      name: 'Case Status Update',
      subject: 'Case Update: {{case_name}} - {{status}}',
      content: `# Case Status Update

Dear {{client_name}},

This is to update you on the status of your case: {{case_name}}.

## Current Status
{{case_status}}

## Recent Developments
{{recent_developments}}

## Next Steps
{{next_steps}}

## Questions?
Please don't hesitate to contact our office if you have any questions.

Sincerely,
{{attorney_name}}, Esq.
{{law_firm}}

*ATTORNEY-CLIENT PRIVILEGED AND CONFIDENTIAL*
*This communication is protected by attorney-client privilege.*`,
      category: 'follow-up',
      tokens: ['client_name', 'case_name', 'status', 'case_status', 'recent_developments', 'next_steps', 'attorney_name', 'law_firm'],
      compliance_reviewed: true,
      policy_version: 'v1.0'
    }
  ],
  insurance: [
    {
      id: 'insurance_policy_renewal',
      persona: 'insurance',
      name: 'Policy Renewal Notice',
      subject: 'Policy Renewal: {{policy_number}} - Action Required',
      content: `# Policy Renewal Notice

Dear {{client_name}},

Your {{policy_type}} policy ({{policy_number}}) is up for renewal on {{renewal_date}}.

## Current Coverage
- Policy Type: {{policy_type}}
- Coverage Amount: {{coverage_amount}}
- Current Premium: {{current_premium}}

## Renewal Options
{{renewal_options}}

## Action Required
Please review the renewal terms and contact us by {{response_deadline}} to confirm your renewal preferences.

Best regards,
{{agent_name}}
Licensed Insurance Agent
{{agency_name}}

*This is an important notice regarding your insurance coverage.*`,
      category: 'follow-up',
      tokens: ['client_name', 'policy_number', 'policy_type', 'renewal_date', 'coverage_amount', 'current_premium', 'renewal_options', 'response_deadline', 'agent_name', 'agency_name'],
      compliance_reviewed: true,
      policy_version: 'v1.0'
    }
  ],
  healthcare: [
    {
      id: 'healthcare_appointment_reminder',
      persona: 'healthcare',
      name: 'Appointment Reminder',
      subject: 'Appointment Reminder: {{appointment_date}} at {{appointment_time}}',
      content: `# Appointment Reminder

Dear {{patient_name}},

This is a reminder of your upcoming appointment:

## Appointment Details
- Date: {{appointment_date}}
- Time: {{appointment_time}}
- Provider: {{provider_name}}
- Location: {{clinic_location}}

## Before Your Visit
{{preparation_instructions}}

## Contact Information
If you need to reschedule, please call {{clinic_phone}} at least 24 hours in advance.

Thank you,
{{clinic_name}}

*CONFIDENTIAL HEALTHCARE COMMUNICATION*
*This message contains confidential healthcare information.*`,
      category: 'follow-up',
      tokens: ['patient_name', 'appointment_date', 'appointment_time', 'provider_name', 'clinic_location', 'preparation_instructions', 'clinic_phone', 'clinic_name'],
      compliance_reviewed: true,
      policy_version: 'v1.0'
    }
  ],
  realtor: [
    {
      id: 'realtor_market_update',
      persona: 'realtor',
      name: 'Monthly Market Update',
      subject: '{{area_name}} Real Estate Market Update - {{month}} {{year}}',
      content: `# {{area_name}} Market Update - {{month}} {{year}}

Hello {{client_name}},

Here's your monthly real estate market summary for {{area_name}}:

## Market Statistics
- Median Home Price: {{median_price}}
- Days on Market: {{avg_days_on_market}}
- Inventory Level: {{inventory_level}}
- Price Change: {{price_change}} from last month

## Market Trends
{{market_trends}}

## For Buyers/Sellers
{{market_advice}}

Questions about your real estate goals? Let's connect!

Best regards,
{{realtor_name}}
Licensed Real Estate Professional
{{brokerage_name}}

*Market data sourced from local MLS. Individual results may vary.*`,
      category: 'newsletter',
      tokens: ['client_name', 'area_name', 'month', 'year', 'median_price', 'avg_days_on_market', 'inventory_level', 'price_change', 'market_trends', 'market_advice', 'realtor_name', 'brokerage_name'],
      compliance_reviewed: true,
      policy_version: 'v1.0'
    }
  ]
};

export function getTemplatesByPersona(persona: ProPersona): Template[] {
  return TEMPLATE_REPOSITORY[persona] || [];
}

export function getTemplate(persona: ProPersona, templateId: string): Template | null {
  const templates = getTemplatesByPersona(persona);
  return templates.find(t => t.id === templateId) || null;
}

export function renderTemplate(template: Template, tokens: Record<string, string>): string {
  let rendered = template.content;
  
  // Replace all tokens in the format {{token_name}}
  Object.entries(tokens).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    rendered = rendered.replace(regex, value);
  });
  
  return rendered;
}

export function renderSubject(template: Template, tokens: Record<string, string>): string {
  let rendered = template.subject;
  
  Object.entries(tokens).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    rendered = rendered.replace(regex, value);
  });
  
  return rendered;
}

export function validateTemplate(template: Template): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!template.name.trim()) {
    errors.push('Template name is required');
  }
  
  if (!template.subject.trim()) {
    errors.push('Subject line is required');
  }
  
  if (!template.content.trim()) {
    errors.push('Template content is required');
  }
  
  if (!template.compliance_reviewed) {
    errors.push('Template must be compliance reviewed');
  }
  
  // Check for orphaned tokens (tokens in content but not in tokens array)
  const contentTokens = extractTokensFromText(template.content + ' ' + template.subject);
  const orphanedTokens = contentTokens.filter(token => !template.tokens.includes(token));
  
  if (orphanedTokens.length > 0) {
    errors.push(`Orphaned tokens found: ${orphanedTokens.join(', ')}`);
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

function extractTokensFromText(text: string): string[] {
  const tokenRegex = /{{([^}]+)}}/g;
  const tokens: string[] = [];
  let match;
  
  while ((match = tokenRegex.exec(text)) !== null) {
    tokens.push(match[1]);
  }
  
  return [...new Set(tokens)]; // Remove duplicates
}