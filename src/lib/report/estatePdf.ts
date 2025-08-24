import { EstateRule } from '@/features/estate/states/estateRules';

export async function renderEstatePdf(
  form: 'Will' | 'RLT' | 'PourOver' | 'POA',
  tokens: Record<string, string>,
  rule: EstateRule
): Promise<Uint8Array> {
  // Load template content based on form type
  const templateContent = await loadTemplate(form);
  
  // Replace tokens with actual values
  const processedContent = replaceTokens(templateContent, tokens, rule);
  
  // Convert to PDF (mock implementation)
  const encoder = new TextEncoder();
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${form} - ${tokens.client_full_name || 'Estate Document'}</title>
      <style>
        body { font-family: 'Times New Roman', serif; margin: 1in; line-height: 1.6; }
        h1 { text-align: center; font-size: 18pt; }
        h2 { font-size: 14pt; margin-top: 20px; }
        h3 { font-size: 12pt; margin-top: 15px; }
        .signature-line { border-bottom: 1px solid #000; width: 300px; display: inline-block; }
        .execution-section { margin-top: 40px; }
        .state-notice { background: #f5f5f5; padding: 10px; margin: 20px 0; }
      </style>
    </head>
    <body>
      ${markdownToHtml(processedContent)}
    </body>
    </html>
  `;
  
  return encoder.encode(htmlContent);
}

async function loadTemplate(form: string): Promise<string> {
  // Mock template loading - in production, load from templates directory
  switch (form) {
    case 'Will':
      return `# Last Will and Testament of {{client_full_name}}
      
I, {{client_full_name}}, being of sound mind, make this my Last Will and Testament.

## Article I - Family
{{spouse_clause}}
{{children_clause}}

## Article II - Bequests
I give all my property to {{primary_beneficiary}}.

## Article III - Executor
I appoint {{executor_name}} as Executor.

**Execution:** This will requires {{witnesses}} witnesses {{notary_clause}} under {{state_code}} law.`;

    case 'RLT':
      return `# {{trust_name}} Revocable Living Trust

I, {{grantor_name}}, establish this trust.

## Distributions
Upon my death, distribute to {{beneficiaries}}.

## Trustee Powers
Full discretionary powers.

{{spousal_consent_clause}}

**Execution:** {{notary_requirement}} under {{state_code}} law.`;

    case 'POA':
      return `# Financial Power of Attorney

I, {{principal_name}}, appoint {{agent_name}} as my agent.

**Powers:** Complete financial authority.
**Effective:** {{effective_clause}}
**Durability:** Survives incapacity.

**Execution:** {{execution_requirements}} under {{state_code}} law.`;

    default:
      return `# ${form} Document\n\nContent for {{client_full_name}}.`;
  }
}

function replaceTokens(content: string, tokens: Record<string, string>, rule: EstateRule): string {
  let processed = content;
  
  // Replace basic tokens
  Object.entries(tokens).forEach(([key, value]) => {
    processed = processed.replace(new RegExp(`{{${key}}}`, 'g'), value);
  });
  
  // Add state-specific execution requirements
  processed = processed.replace(/{{witnesses}}/g, String(rule.will.witnesses));
  processed = processed.replace(/{{notary_clause}}/g, rule.will.notary ? 'and notarization' : '');
  processed = processed.replace(/{{notary_requirement}}/g, rule.rlt.notary ? 'Notarization required' : 'No notarization required');
  processed = processed.replace(/{{execution_requirements}}/g, 
    rule.poa.notary ? 'Notarization required' : `${rule.will.witnesses} witnesses required`);
  
  // Add community property notices
  if (rule.communityProperty) {
    processed += '\n\n**Community Property Notice:** This document affects community property rights.';
  }
  
  return processed;
}

function markdownToHtml(markdown: string): string {
  return markdown
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>');
}