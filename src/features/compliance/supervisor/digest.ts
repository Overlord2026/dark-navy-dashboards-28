import { buildDigestUrls } from './links';

export type DigestCounts = {
  exceptions_total: number;
  guardrails_alerts: number;
  beneficiary_mismatches: number;
  unanchored_count: number;
  byPersona: Record<string, number>;
  links: {
    exceptions_link: string;
    evidence_link: string;
    anchors_link: string;
    audits_link: string;
  };
};

export async function makeSupervisorDigest(firmId: string, personas: string[]): Promise<DigestCounts> {
  // 1) Count exceptions by persona (mock data for demo)
  const byPersona: Record<string, number> = {};
  let exceptions_total = 0;
  
  for (const persona of personas) {
    const count = Math.floor(Math.random() * 5); // Mock random counts
    byPersona[persona] = count;
    exceptions_total += count;
  }
  
  // 2) Count recent guardrail alerts (last 24h)
  const guardrails_alerts = Math.floor(Math.random() * 3);
  
  // 3) Count beneficiary mismatches
  const beneficiary_mismatches = Math.floor(Math.random() * 2);
  
  // 4) Count unanchored receipts
  const unanchored_count = Math.floor(Math.random() * 10);
  
  // 5) Build digest URLs
  const links = buildDigestUrls(firmId, personas);
  
  return {
    exceptions_total,
    guardrails_alerts,
    beneficiary_mismatches,
    unanchored_count,
    byPersona,
    links
  };
}

export function renderDigestTemplate(counts: DigestCounts, date: string): string {
  const byPersonaText = Object.entries(counts.byPersona)
    .map(([persona, count]) => `${persona.charAt(0).toUpperCase() + persona.slice(1)}: **${count}**`)
    .join(' | ');

  return `# Supervisor Daily Digest — ${date}

**Overview (firm-wide):**  
- Exceptions (open): **${counts.exceptions_total}**  
- Guardrails alerts (last 24h): **${counts.guardrails_alerts}**  
- Beneficiary mismatches (open): **${counts.beneficiary_mismatches}**  
- Unanchored proofs (info): **${counts.unanchored_count}**

**By Persona (open exceptions):**  
${byPersonaText}

**Links:**  
- Exceptions: ${counts.links.exceptions_link}  
- Evidence Builder: ${counts.links.evidence_link}  
- Anchors Verify: ${counts.links.anchors_link}  
- Audits: ${counts.links.audits_link}  

> Tip: Evidence Pack ZIP includes receipts.json and manifest hash (tamper-evident).

(Email body ends; plain Markdown safe. No PII/PHI.)`;
}