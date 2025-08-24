import { buildDigestUrls } from '@/features/compliance/supervisor/links';
import { sparkline } from '@/features/compliance/supervisor/spark';

export interface MonthlyMetrics {
  month_label: string;
  exceptions_open: number;
  exceptions_delta: number;
  guardrails_count: number;
  beneficiary_open: number;
  beneficiary_delta: number;
  evidence_count: number;
  anchor_coverage: number;
  byPersona: Record<string, number>;
  spark_exceptions: string;
  spark_evidence: string;
  links: {
    exceptions_link: string;
    evidence_link: string;
    anchors_link: string;
    audits_link: string;
  };
}

export async function makeMonthlyMetrics(
  firmId: string, 
  personas: string[], 
  month: Date
): Promise<MonthlyMetrics> {
  // Compute last calendar month window [mStart..mEnd), also prior month for deltas
  const currentMonth = new Date(month);
  currentMonth.setUTCDate(1);
  currentMonth.setUTCHours(0, 0, 0, 0);
  
  const lastMonth = new Date(currentMonth);
  lastMonth.setUTCMonth(lastMonth.getUTCMonth() - 1);
  
  const priorMonth = new Date(lastMonth);
  priorMonth.setUTCMonth(priorMonth.getUTCMonth() - 1);
  
  // Mock data for demo (in real implementation, would query actual data)
  const exceptions_open = Math.floor(Math.random() * 10);
  const exceptions_delta = Math.floor(Math.random() * 6) - 3; // -3 to +3
  const guardrails_count = Math.floor(Math.random() * 5);
  const beneficiary_open = Math.floor(Math.random() * 4);
  const beneficiary_delta = Math.floor(Math.random() * 4) - 2; // -2 to +2
  const evidence_count = Math.floor(Math.random() * 8);
  const anchor_coverage = Math.floor(Math.random() * 20) + 80; // 80-100%
  
  // Generate persona breakdown
  const byPersona: Record<string, number> = {};
  for (const persona of personas) {
    byPersona[persona] = Math.floor(Math.random() * 3);
  }
  
  // Generate sparklines (last 6 months)
  const exceptionsTrend = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10));
  const evidenceTrend = Array.from({ length: 6 }, () => Math.floor(Math.random() * 8));
  
  const spark_exceptions = sparkline(exceptionsTrend);
  const spark_evidence = sparkline(evidenceTrend);
  
  // Build links
  const links = buildDigestUrls(firmId, personas);
  
  // Format month label
  const month_label = lastMonth.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long' 
  });
  
  return {
    month_label,
    exceptions_open,
    exceptions_delta,
    guardrails_count,
    beneficiary_open,
    beneficiary_delta,
    evidence_count,
    anchor_coverage,
    byPersona,
    spark_exceptions,
    spark_evidence,
    links
  };
}