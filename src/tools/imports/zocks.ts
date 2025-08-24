export type ZocksTranscriptJSON = {
  meetingId: string;
  startedAt?: string;
  participants?: { name: string; role?: string }[];
  transcript: { ts?: number; speaker?: string; text: string }[];
  meta?: Record<string, any>;
};

export async function parseZocks(input: File | string) {
  let textContent: string;
  
  if (input instanceof File) {
    textContent = await input.text();
  } else {
    textContent = input;
  }

  // Try to parse as JSON first
  try {
    const parsed: ZocksTranscriptJSON = JSON.parse(textContent);
    
    // Extract transcript text
    const transcriptText = parsed.transcript
      .map(entry => `${entry.speaker || 'Speaker'}: ${entry.text}`)
      .join('\n');
    
    // Generate basic summary from transcript
    const summary = generateSummaryFromTranscript(transcriptText);
    const bullets = extractBulletPoints(transcriptText);
    const actions = extractActionItems(transcriptText);
    const risks = extractRisks(transcriptText);
    const speakers = parsed.participants?.map(p => p.name) || 
                    [...new Set(parsed.transcript.map(t => t.speaker).filter(Boolean))];
    
    // Create inputs hash
    const inputs_hash = await hashContent({
      meetingId: parsed.meetingId,
      transcript: transcriptText,
      participants: speakers,
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
      transcriptText
    };
  } catch (error) {
    // Fallback: treat as plain text transcript
    const lines = textContent.split('\n').filter(line => line.trim());
    const transcriptText = lines.join('\n');
    
    const summary = generateSummaryFromTranscript(transcriptText);
    const bullets = extractBulletPoints(transcriptText);
    const actions = extractActionItems(transcriptText);
    const risks = extractRisks(transcriptText);
    const speakers = extractSpeakersFromText(transcriptText);
    
    const inputs_hash = await hashContent({
      transcript: transcriptText,
      type: 'plain_text'
    });

    return {
      summary,
      bullets,
      actions,
      risks,
      speakers,
      inputs_hash,
      originalData: null,
      transcriptText
    };
  }
}

export function toDecisionRdsFromZocks(parsed: Awaited<ReturnType<typeof parseZocks>>) {
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
    source: 'zocks',
    summary_length: parsed.summary.length,
    participants_count: parsed.speakers.length,
    bullet_points_count: parsed.bullets.length,
    action_items_count: parsed.actions.length,
    risks_count: parsed.risks.length
  };
}

export async function vaultPackForZocks(rawTextOrJson: string, summaryPdfBytes: Uint8Array) {
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
function generateSummaryFromTranscript(transcript: string): string {
  // Simple summary generation - could be enhanced with AI
  const lines = transcript.split('\n').filter(line => line.trim());
  const wordCount = transcript.split(' ').length;
  
  if (lines.length === 0) return 'Empty transcript';
  
  return `Meeting discussion with ${lines.length} exchanges (${wordCount} words). ` +
         `Key topics covered based on transcript content.`;
}

function extractBulletPoints(transcript: string): string[] {
  const bullets: string[] = [];
  const lines = transcript.split('\n');
  
  // Look for patterns that suggest bullet points or key topics
  lines.forEach(line => {
    if (line.includes('discussed') || line.includes('talked about') || 
        line.includes('mentioned') || line.includes('covered')) {
      bullets.push(line.trim());
    }
  });
  
  return bullets.slice(0, 5); // Limit to 5 bullets
}

function extractActionItems(transcript: string): string[] {
  const actions: string[] = [];
  const actionPatterns = [
    /will\s+\w+/gi,
    /need\s+to\s+\w+/gi,
    /should\s+\w+/gi,
    /action\s+item/gi,
    /follow\s+up/gi,
    /next\s+step/gi
  ];
  
  const lines = transcript.split('\n');
  lines.forEach(line => {
    actionPatterns.forEach(pattern => {
      if (pattern.test(line)) {
        actions.push(line.trim());
      }
    });
  });
  
  return [...new Set(actions)].slice(0, 3); // Limit to 3 unique actions
}

function extractRisks(transcript: string): string[] {
  const risks: string[] = [];
  const riskPatterns = [
    /risk/gi,
    /concern/gi,
    /issue/gi,
    /problem/gi,
    /challenge/gi,
    /warning/gi
  ];
  
  const lines = transcript.split('\n');
  lines.forEach(line => {
    riskPatterns.forEach(pattern => {
      if (pattern.test(line)) {
        risks.push(line.trim());
      }
    });
  });
  
  return [...new Set(risks)].slice(0, 3); // Limit to 3 unique risks
}

function extractSpeakersFromText(transcript: string): string[] {
  const speakers = new Set<string>();
  const lines = transcript.split('\n');
  
  lines.forEach(line => {
    const match = line.match(/^([^:]+):/);
    if (match) {
      speakers.add(match[1].trim());
    }
  });
  
  return Array.from(speakers);
}

async function hashContent(content: any): Promise<string> {
  const textContent = typeof content === 'string' ? content : JSON.stringify(content);
  const encoder = new TextEncoder();
  const data = encoder.encode(textContent);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}