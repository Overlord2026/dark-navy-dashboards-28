export type JumpSummaryJSON = {
  callId?: string;
  startedAt?: string;
  speakers?: string[];
  summary?: string;
  bullets?: string[];
  nextSteps?: string[];
  risks?: string[];
  meta?: Record<string, any>;
};

export async function parseJump(input: File | string) {
  let textContent: string;
  
  if (input instanceof File) {
    textContent = await input.text();
  } else {
    textContent = input;
  }

  // Try to parse as JSON first
  try {
    const parsed: JumpSummaryJSON = JSON.parse(textContent);
    
    const summary = parsed.summary || generateSummaryFromData(parsed);
    const bullets = parsed.bullets || [];
    const actions = parsed.nextSteps || [];
    const risks = parsed.risks || [];
    const speakers = parsed.speakers || ['Unknown Speaker'];
    
    // Create inputs hash
    const inputs_hash = await hashContent({
      callId: parsed.callId,
      summary: parsed.summary,
      bullets: parsed.bullets,
      nextSteps: parsed.nextSteps,
      speakers: parsed.speakers,
      startedAt: parsed.startedAt
    });

    return {
      summary,
      bullets,
      actions,
      risks,
      speakers,
      inputs_hash,
      originalData: parsed,
      transcriptText: parsed.summary || textContent
    };
  } catch (error) {
    // Fallback: treat as plain text
    const summary = textContent.length > 200 
      ? textContent.substring(0, 200) + '...' 
      : textContent;
    
    const bullets = extractBulletPoints(textContent);
    const actions = extractActionItems(textContent);
    const risks = extractRisks(textContent);
    const speakers = ['Unknown Speaker'];
    
    const inputs_hash = await hashContent({
      content: textContent,
      type: 'plain_text_jump'
    });

    return {
      summary,
      bullets,
      actions,
      risks,
      speakers,
      inputs_hash,
      originalData: null,
      transcriptText: textContent
    };
  }
}

export function toDecisionRdsFromJump(parsed: Awaited<ReturnType<typeof parseJump>>) {
  const reasons = [
    'meeting_import',
    ...(parsed.bullets.length > 0 ? ['meeting_summary'] : []),
    ...(parsed.actions.length > 0 ? ['action_items'] : []),
    ...(parsed.risks.length > 0 ? ['risk_flag'] : [])
  ];

  return {
    action: 'meeting_import',
    policy_version: 'v1.0',
    inputs_hash: parsed.inputs_hash,
    reasons,
    source: 'jump',
    summary_length: parsed.summary.length,
    participants_count: parsed.speakers.length,
    bullet_points_count: parsed.bullets.length,
    action_items_count: parsed.actions.length,
    risks_count: parsed.risks.length
  };
}

export async function vaultPackForJump(rawTextOrJson: string, summaryPdfBytes: Uint8Array) {
  const transcriptHash = await hashContent(rawTextOrJson);
  const pdfHash = await hashContent(summaryPdfBytes);
  
  const files = [
    `sha256:${transcriptHash}`,
    `sha256:${pdfHash}`
  ];

  // Grant duration from env or default 14 days
  const grantDays = parseInt(import.meta.env.VITE_VAULT_GRANT_DAYS || '14');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + grantDays);

  const grant = {
    type: 'PRE',
    files,
    expires_at: expiresAt.toISOString(),
    granted_to: 'meeting_import',
    access_level: 'read'
  };

  return { grant, files };
}

// Helper functions
function generateSummaryFromData(data: JumpSummaryJSON): string {
  const parts = [];
  
  if (data.callId) parts.push(`Call ID: ${data.callId}`);
  if (data.speakers?.length) parts.push(`Participants: ${data.speakers.join(', ')}`);
  if (data.bullets?.length) parts.push(`${data.bullets.length} key points discussed`);
  if (data.nextSteps?.length) parts.push(`${data.nextSteps.length} action items identified`);
  if (data.risks?.length) parts.push(`${data.risks.length} risks noted`);
  
  return parts.length > 0 
    ? parts.join('. ') + '.'
    : 'Meeting summary imported from Jump platform.';
}

function extractBulletPoints(text: string): string[] {
  const bullets: string[] = [];
  const lines = text.split('\n').filter(line => line.trim());
  
  // Look for bullet point patterns
  lines.forEach(line => {
    if (line.match(/^[\s]*[-*•]\s+/) || 
        line.match(/^\d+\.\s+/) ||
        line.includes('•') ||
        (line.length > 20 && line.length < 200)) {
      bullets.push(line.trim().replace(/^[\s]*[-*•]\s*/, '').replace(/^\d+\.\s*/, ''));
    }
  });
  
  return bullets.slice(0, 5); // Limit to 5 bullets
}

function extractActionItems(text: string): string[] {
  const actions: string[] = [];
  const actionPatterns = [
    /action:/gi,
    /todo:/gi,
    /follow.?up/gi,
    /next.?step/gi,
    /will\s+\w+/gi,
    /need\s+to/gi,
    /should\s+\w+/gi
  ];
  
  const lines = text.split('\n');
  lines.forEach(line => {
    actionPatterns.forEach(pattern => {
      if (pattern.test(line) && line.length > 10) {
        actions.push(line.trim());
      }
    });
  });
  
  return [...new Set(actions)].slice(0, 3);
}

function extractRisks(text: string): string[] {
  const risks: string[] = [];
  const riskPatterns = [
    /risk/gi,
    /concern/gi,
    /issue/gi,
    /problem/gi,
    /challenge/gi,
    /warning/gi,
    /blocker/gi
  ];
  
  const lines = text.split('\n');
  lines.forEach(line => {
    riskPatterns.forEach(pattern => {
      if (pattern.test(line) && line.length > 10) {
        risks.push(line.trim());
      }
    });
  });
  
  return [...new Set(risks)].slice(0, 3);
}

async function hashContent(content: any): Promise<string> {
  const textContent = typeof content === 'string' ? content : JSON.stringify(content);
  const encoder = new TextEncoder();
  const data = encoder.encode(textContent);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}