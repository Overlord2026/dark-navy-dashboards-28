import { recordReceipt } from '@/features/receipts/record';
import type { MergeCtx } from './types';

// Naive tag replacement for demo; replace with your PDF engine
export function mergeTags(text: string, ctx: MergeCtx): string {
  return text
    .replace(/\{\{client\.name\}\}/g, ctx.client.name || '')
    .replace(/\{\{client\.id\}\}/g, ctx.client.id)
    .replace(/\{\{client\.email\}\}/g, ctx.client.email || '')
    .replace(/\{\{client\.phone\}\}/g, ctx.client.phone || '')
    .replace(/\{\{client\.address\}\}/g, ctx.client.address || '')
    .replace(/\{\{client\.ssnLast4\}\}/g, ctx.client.ssnLast4 || '')
    .replace(/\{\{account\.id\}\}/g, ctx.account.id)
    .replace(/\{\{account\.provider\}\}/g, ctx.account.provider)
    .replace(/\{\{account\.planId\}\}/g, ctx.account.planId || '')
    .replace(/\{\{account\.balance\}\}/g, ctx.account.balance?.toString() || '')
    .replace(/\{\{advisor\.name\}\}/g, ctx.advisor.name || '')
    .replace(/\{\{advisor\.firm\}\}/g, ctx.advisor.firm || '')
    .replace(/\{\{advisor\.email\}\}/g, ctx.advisor.email || '')
    .replace(/\{\{advisor\.phone\}\}/g, ctx.advisor.phone || '')
    .replace(/\{\{provider\.name\}\}/g, ctx.provider.name || '')
    .replace(/\{\{provider\.phone\}\}/g, ctx.provider.phone || '')
    .replace(/\{\{rollover\.type\}\}/g, ctx.rollover.type)
    .replace(/\{\{rollover\.reason\}\}/g, ctx.rollover.reason || '');
}

// PDF generator stub (replace with pdf-lib / server service)
export async function generatePdfFromTemplate(templateId: string, ctx: MergeCtx): Promise<Uint8Array> {
  const template = getFormTemplate(templateId);
  const filledContent = mergeTags(template, ctx);
  
  // Convert to PDF bytes (placeholder implementation)
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>401(k) Rollover Form - ${ctx.provider.name}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 2in; line-height: 1.4; }
        .header { text-align: center; margin-bottom: 30px; }
        .form-field { margin: 15px 0; }
        .signature-line { border-bottom: 1px solid #000; width: 300px; display: inline-block; }
      </style>
    </head>
    <body>
      ${markdownToHtml(filledContent)}
    </body>
    </html>
  `;
  
  const encoder = new TextEncoder();
  return encoder.encode(htmlContent);
}

function getFormTemplate(templateId: string): string {
  const templates: Record<string, string> = {
    "vanguard_rollover_req": `# Vanguard 401(k) Rollover Request

**Participant Information:**
- Name: {{client.name}}
- Account ID: {{account.id}}
- Plan ID: {{account.planId}}
- Phone: {{client.phone}}
- Email: {{client.email}}

**Rollover Details:**
- Type: {{rollover.type}}
- Current Balance: \${{account.balance}}
- Reason: {{rollover.reason}}

**New Financial Institution:**
- Advisor: {{advisor.name}}
- Firm: {{advisor.firm}}
- Contact: {{advisor.phone}}

I hereby request a direct rollover of my 401(k) account to the receiving institution listed above.

Signature: _________________________ Date: _____________`,

    "fidelity_rollover_init": `# Fidelity Workplace Services - Rollover Initiation

**Employee Information:**
- Full Name: {{client.name}}
- Employee ID: {{account.id}}
- SSN (Last 4): {{client.ssnLast4}}
- Address: {{client.address}}

**Distribution Request:**
- Account Balance: \${{account.balance}}
- Distribution Type: {{rollover.type}}
- Receiving Institution: {{advisor.firm}}

**Authorization:**
I authorize the distribution of my account as specified above.

Participant Signature: _________________________ Date: _____________`,

    "schwab_rollover_kit": `# Charles Schwab 401(k) Distribution Request

**Plan Participant:**
- Name: {{client.name}}
- Account Number: {{account.id}}
- Phone: {{client.phone}}

**Distribution Information:**
- Distribution Type: Direct Rollover to {{rollover.type}}
- Amount: Full Account Balance (\${{account.balance}})
- Receiving Firm: {{advisor.firm}}
- Advisor: {{advisor.name}} ({{advisor.phone}})

Signature: _________________________ Date: _____________`,

    "principal_distribution": `# Principal Financial Group - Distribution Request

**Plan Participant Information:**
- Name: {{client.name}}
- Account Number: {{account.id}}
- Plan ID: {{account.planId}}
- Address: {{client.address}}
- Phone: {{client.phone}}

**Distribution Details:**
- Distribution Type: {{rollover.type}}
- Current Balance: \${{account.balance}}
- Reason for Distribution: {{rollover.reason}}

**Receiving Institution:**
- Institution: {{advisor.firm}}
- Advisor: {{advisor.name}}
- Contact Phone: {{advisor.phone}}

I request a direct rollover of my account balance to the above institution.

Participant Signature: _________________________ Date: _____________`,

    "empower_rollover_eform": `# Empower Retirement - Electronic Rollover Form

**Participant Details:**
- Full Name: {{client.name}}
- Account ID: {{account.id}}
- Email: {{client.email}}
- Phone: {{client.phone}}

**Rollover Information:**
- Rollover Type: {{rollover.type}}
- Account Balance: \${{account.balance}}
- Distribution Reason: {{rollover.reason}}

**New Provider Information:**
- Firm Name: {{advisor.firm}}
- Advisor: {{advisor.name}}
- Advisor Email: {{advisor.email}}

Electronic Signature: {{client.name}} Date: _____________`,

    "trp_rollover_form": `# T. Rowe Price - 401(k) Rollover Distribution Form

**Employee Information:**
- Name: {{client.name}}
- Employee ID: {{account.id}}
- Plan ID: {{account.planId}}
- Address: {{client.address}}

**Distribution Request:**
- Type: Direct Rollover to {{rollover.type}}
- Amount: Full Account (\${{account.balance}})
- Reason: {{rollover.reason}}

**Receiving Institution:**
- Firm: {{advisor.firm}}
- Advisor: {{advisor.name}}
- Phone: {{advisor.phone}}

Signature: _________________________ Date: _____________`,

    "jh_distribution_pkg": `# John Hancock - Distribution Package

**Plan Participant:**
- Name: {{client.name}}
- Account Number: {{account.id}}
- SSN (Last 4): {{client.ssnLast4}}
- Mailing Address: {{client.address}}

**Distribution Election:**
- Distribution Type: {{rollover.type}}
- Current Account Value: \${{account.balance}}
- Distribution Reason: {{rollover.reason}}

**New Institution Details:**
- Receiving Firm: {{advisor.firm}}
- Financial Advisor: {{advisor.name}}
- Contact Information: {{advisor.phone}}

I hereby elect to roll over my account balance as specified above.

Participant Signature: _________________________ Date: _____________`,

    "merrill_rollover": `# Merrill (Bank of America) - 401(k) Rollover Request

**Plan Participant Information:**
- Name: {{client.name}}
- Account Number: {{account.id}}
- Plan ID: {{account.planId}}
- Contact Phone: {{client.phone}}

**Rollover Details:**
- Rollover Type: {{rollover.type}}
- Account Balance: \${{account.balance}}
- Distribution Reason: {{rollover.reason}}

**Receiving Institution:**
- Firm Name: {{advisor.firm}}
- Advisor Name: {{advisor.name}}
- Advisor Phone: {{advisor.phone}}

Authorization: I authorize the rollover of my 401(k) account as detailed above.

Signature: _________________________ Date: _____________`
  };
  
  return templates[templateId] || `# Generic 401(k) Form\n\nClient: {{client.name}}\nAccount: {{account.id}}\nProvider: {{provider.name}}`;
}

function markdownToHtml(markdown: string): string {
  return markdown
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/- (.*$)/gim, '<div class="form-field">$1</div>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>');
}

export async function saveFormToVault(path: string, bytes: Uint8Array): Promise<{ fileId: string }> {
  // TODO: real Vault save; return fileId
  const fileId = `vault://${path}`;
  console.log(`[Vault] Saving 401k form to ${fileId}, ${bytes.length} bytes`);
  
  await recordReceipt({ 
    type: 'Vault-RDS', 
    action: 'vault_grant',
    files: [fileId],
    grant_type: 'POST',
    reasons: ['k401_form_generated'],
    created_at: new Date().toISOString() 
  });
  
  return { fileId };
}

export async function logFormGenerated(templateId: string, fileId: string, provider: string): Promise<void> {
  await recordReceipt({ 
    type: 'Decision-RDS', 
    action: 'k401.form.generated', 
    reasons: [templateId, provider, fileId.split('/').pop()?.split('-')[0] || ''], 
    created_at: new Date().toISOString() 
  });
}

export async function anchorFormIfEnabled(fileId: string, sha256: string): Promise<any | undefined> {
  const enabled = import.meta.env.VITE_K401_FORMS_ANCHOR_ON_GENERATE === 'true';
  if (!enabled) return undefined;
  
  const anchorRef = {
    merkle_root: sha256,
    timestamp: new Date().toISOString(),
    chain_id: 'demo',
    batch_id: `k401_forms_${Date.now()}`
  };
  
  console.log(`[Anchor] 401k form ${fileId} anchored`);
  return anchorRef;
}