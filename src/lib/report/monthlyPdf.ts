import type { MonthlyMetrics } from '@/features/compliance/supervisor/monthly';

export async function makeMonthlyPdf(input: MonthlyMetrics): Promise<Uint8Array> {
  // Build a clean, brand-styled PDF with headings, counts, sparkline text, and footer disclosures
  const content = `
SUPERVISOR MONTHLY REPORT
${input.month_label}

FIRM OVERVIEW (LAST MONTH)
Exceptions (open at month end): ${input.exceptions_open} (Δ ${input.exceptions_delta} vs prior month)
Guardrails alerts (count in month): ${input.guardrails_count}
Beneficiary mismatches (open at month end): ${input.beneficiary_open} (Δ ${input.beneficiary_delta})
Evidence packs built: ${input.evidence_count}
Anchor coverage: ${input.anchor_coverage}%

BY PERSONA (OPEN EXCEPTIONS @ MONTH END)
${Object.entries(input.byPersona)
  .map(([persona, count]) => `${persona.toUpperCase()}: ${count}`)
  .join('\n')}

TRENDS (MONTHLY)
Exceptions: ${input.spark_exceptions}
Evidence: ${input.spark_evidence}

LINKS
Exceptions: ${input.links.exceptions_link}
Evidence Builder: ${input.links.evidence_link}
Anchors Verify: ${input.links.anchors_link}
Audits: ${input.links.audits_link}

---
No client data included. For details, open the console to view exceptions and export an Evidence Pack.
Generated: ${new Date().toISOString()}
  `;
  
  // Convert to bytes (mock implementation - in real app would use PDF library)
  const encoder = new TextEncoder();
  return encoder.encode(content);
}