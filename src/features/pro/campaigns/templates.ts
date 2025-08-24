import { Template, ProPersona } from '../types';
import { PERSONA_TEMPLATE_REPOSITORY } from './templates/persona-templates';

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
  ...PERSONA_TEMPLATE_REPOSITORY,
  medicare: [] // Placeholder for medicare templates
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