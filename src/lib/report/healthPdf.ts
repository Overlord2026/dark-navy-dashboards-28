import { HealthcareRule } from '@/features/estate/states/estateRules';

export async function renderHealthcarePdf(
  form: 'AdvanceDirective' | 'LivingWill' | 'HealthcarePOA' | 'HIPAA' | 'Surrogate',
  tokens: Record<string, string>,
  rule: HealthcareRule
): Promise<Uint8Array> {
  // Load template content based on form type
  const templateContent = await loadHealthcareTemplate(form);
  
  // Replace tokens with actual values and inject state-specific rules
  const processedContent = replaceHealthcareTokens(templateContent, tokens, rule);
  
  // Convert to PDF (mock implementation)
  const encoder = new TextEncoder();
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${form} - ${tokens.client_full_name || 'Healthcare Document'}</title>
      <style>
        body { 
          font-family: 'Times New Roman', serif; 
          margin: 1in; 
          line-height: 1.6; 
          color: #000;
        }
        h1 { 
          text-align: center; 
          font-size: 18pt; 
          margin-bottom: 20px; 
          color: #2563eb;
        }
        h2 { 
          font-size: 14pt; 
          margin-top: 20px; 
          color: #1e40af;
        }
        h3 { 
          font-size: 12pt; 
          margin-top: 15px; 
        }
        .signature-section { 
          margin-top: 40px; 
          page-break-inside: avoid;
        }
        .signature-line { 
          border-bottom: 1px solid #000; 
          width: 300px; 
          display: inline-block; 
          margin-right: 10px;
        }
        .state-notice { 
          background: #f0f9ff; 
          border: 1px solid #0ea5e9;
          padding: 15px; 
          margin: 20px 0; 
          border-radius: 4px;
        }
        .legal-warning {
          background: #fef3c7;
          border: 1px solid #f59e0b;
          padding: 10px;
          margin: 15px 0;
          font-size: 11pt;
          border-radius: 4px;
        }
        .checkbox {
          display: inline-block;
          width: 12px;
          height: 12px;
          border: 1px solid #000;
          margin-right: 5px;
          vertical-align: middle;
        }
        ul { margin: 10px 0; }
        li { margin: 5px 0; }
        .witness-section {
          margin-top: 30px;
          page-break-inside: avoid;
        }
        .notary-section {
          margin-top: 30px;
          border: 2px solid #000;
          padding: 15px;
          page-break-inside: avoid;
        }
      </style>
    </head>
    <body>
      ${markdownToHealthcareHtml(processedContent)}
    </body>
    </html>
  `;
  
  return encoder.encode(htmlContent);
}

async function loadHealthcareTemplate(form: string): Promise<string> {
  // Mock template loading - in production, load from templates directory
  switch (form) {
    case 'AdvanceDirective':
      return `# Advance Directive for Health Care

I, {{client_full_name}}, being of sound mind, make this Advance Directive.

## Health Care Agent Appointment
I appoint {{agent_name}} as my health care agent.
- Address: {{agent_address}}
- Phone: {{agent_phone}}

{{#alt_agent_name}}
Alternate Agent: {{alt_agent_name}}
{{/alt_agent_name}}

## Treatment Preferences
{{treatment_preferences}}

## Pain Relief
I want adequate pain relief, even if it may hasten death.

**{{state_code}} Requirements:**
- Witnesses: {{witness_count}}
{{#if notary_required}}
- Notarization required
{{/if}}

{{#if witness_eligibility}}
Witness restrictions: {{witness_eligibility}}
{{/if}}`;

    case 'HealthcarePOA':
      return `# {{terminology}} for Health Care

I, {{client_full_name}}, appoint {{agent_name}} as my {{terminology}}.

## Authority Granted
My {{terminology}} may make all healthcare decisions for me, including:
- Consent to or refuse medical treatment
- Select healthcare providers and facilities  
- Access medical records
- Make end-of-life decisions

**{{state_code}} Requirements:**
- Witnesses: {{witness_count}}
{{#if notary_required}}
- Notarization required
{{/if}}`;

    case 'HIPAA':
      return `# HIPAA Authorization

I, {{client_full_name}}, authorize release of my health information to:
- {{agent_name}} ({{agent_relationship}})
{{#alt_agent_name}}
- {{alt_agent_name}} ({{alt_agent_relationship}})
{{/alt_agent_name}}

This authorization covers all medical records and health information.

Duration: {{duration}}`;

    case 'LivingWill':
      return `# Living Will

I, {{client_full_name}}, make this Living Will regarding end-of-life medical care.

## Conditions Covered
This applies if I am in a terminal condition, persistent vegetative state, or end-stage condition.

## Treatment Preferences
{{#life_support_choice}}
Life-sustaining treatment: {{life_support_choice}}
{{/life_support_choice}}

{{#nutrition_choice}}
Artificial nutrition/hydration: {{nutrition_choice}}
{{/nutrition_choice}}

**{{state_code}} Requirements:**
- Witnesses: {{witness_count}}
{{#if notary_required}}
- Notarization required
{{/if}}`;

    case 'Surrogate':
      return `# {{terminology}} Designation

I, {{client_full_name}}, designate {{agent_name}} as my {{terminology}}.

## Authority
My {{terminology}} may make healthcare decisions if I become incapacitated.

{{#guidance_provided}}
## Guidance
{{guidance_provided}}
{{/guidance_provided}}

**{{state_code}} Requirements:**
- Witnesses: {{witness_count}}
{{#if notary_required}}
- Notarization required
{{/if}}`;

    default:
      return `# ${form} Document\n\nContent for {{client_full_name}}.`;
  }
}

function replaceHealthcareTokens(content: string, tokens: Record<string, string>, rule: HealthcareRule): string {
  let processed = content;
  
  // Replace basic tokens
  Object.entries(tokens).forEach(([key, value]) => {
    processed = processed.replace(new RegExp(`{{${key}}}`, 'g'), value);
  });
  
  // Add state-specific requirements
  processed = processed.replace(/{{witness_count}}/g, String(rule.witnesses));
  processed = processed.replace(/{{notary_required}}/g, String(rule.notaryRequired));
  processed = processed.replace(/{{terminology}}/g, rule.surrogateTerminology || 'Health Care Agent');
  
  // Add state-specific text blocks
  if (rule.notarizationText) {
    processed = processed.replace(/{{jurat_block}}/g, rule.notarizationText);
  }
  
  if (rule.witnessEligibility) {
    processed = processed.replace(/{{witness_eligibility}}/g, rule.witnessEligibility);
  }
  
  if (rule.specialNotes) {
    processed = processed.replace(/{{special_notes}}/g, rule.specialNotes);
  }
  
  // Add RON availability notice
  if (rule.remoteNotaryAllowed) {
    processed += '\n\n**Remote Online Notary:** Available in this state for healthcare documents.';
  }
  
  return processed;
}

function markdownToHealthcareHtml(markdown: string): string {
  return markdown
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^- (.*$)/gim, '<ul><li>$1</li></ul>')
    .replace(/<\/ul>\n<ul>/g, '')
    .replace(/☐/g, '<span class="checkbox"></span>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hul])/gm, '<p>')
    .replace(/(?<!>)$/gm, '</p>')
    .replace(/<p><\/p>/g, '');
}