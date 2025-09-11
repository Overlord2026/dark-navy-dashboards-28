import { makeMonthlyMetrics, type MonthlyMetrics } from './monthly';
import { makeMonthlyPdf } from '@/lib/report/monthlyPdf';
import { buildBinderPack } from '@/features/estate/binder';
import { recordReceipt } from '@/features/receipts/record';
import { storeInVault, grantPre } from '@/features/vault/api';
import { sendEmail } from '@/features/comms/send';
import * as Canonical from '@/lib/canonical';

interface MonthlyReportOptions {
  firmId: string;
  personas: string[];
  attachEvidence: boolean;
  anchor: boolean;
  to: string[];
}

interface MonthlyReportResult {
  ok: boolean;
  sent: number;
  month: string;
  pdfRef?: string;
  evidenceRef?: string;
  anchorRef?: string;
}

export async function buildAndSendMonthlyReport(opts: MonthlyReportOptions): Promise<MonthlyReportResult> {
  const month = new Date();
  month.setUTCDate(1); // current month; builder will compute last full month
  
  try {
    // Build monthly metrics
    const metrics = await makeMonthlyMetrics(opts.firmId, opts.personas, month);
    
    // Generate PDF report
    const pdf = await makeMonthlyPdf(metrics);
    
    // Store PDF in Vault (Keep-Safe)
    const { hash: pdfHash, ref: pdfRef } = await storeInVault(
      pdf,
      `monthly-report-${metrics.month_label.replace(/\s+/g, '-').toLowerCase()}.pdf`,
      true // Keep-Safe
    );
    
    let evidenceRef: string | undefined;
    let anchorRef: string | undefined;
    
    // Optionally build evidence ZIP
    if (opts.attachEvidence) {
      const { zip: evidenceZip, manifest } = await buildBinderPack({
        clientId: `firm-${opts.firmId}`,
        start: new Date(month.getFullYear(), month.getMonth() - 1, 1).toISOString(),
        end: new Date(month.getFullYear(), month.getMonth(), 1).toISOString()
      });
      
      const { ref } = await storeInVault(
        evidenceZip,
        `evidence-pack-${metrics.month_label.replace(/\s+/g, '-').toLowerCase()}.zip`,
        true // Keep-Safe
      );
      evidenceRef = ref;
      
      // Record evidence export
      await recordReceipt({
        type: 'Decision-RDS',
        action: 'evidence.export',
        reasons: ['MONTHLY_REPORT'],
        created_at: new Date().toISOString()
      } as any);
    }
    
    // Optional anchoring
    if (opts.anchor) {
      const reportHash = await Canonical.hash({
        'monthly-report': true,
        month_label: metrics.month_label,
        pdf_hash: pdfHash
      });
      
      // In real implementation, would call anchor service
      anchorRef = `anchor-${Date.now()}`;
    }
    
    // Record report build
    await recordReceipt({
      type: 'Decision-RDS',
      action: 'compliance.report.monthly.built',
      reasons: [metrics.month_label],
      ...(anchorRef && { anchor_ref: anchorRef }),
      created_at: new Date().toISOString()
    } as any);
    
    // Render email content from template
    const subject = `Supervisor Monthly Report — ${metrics.month_label}`;
    const byPersonaMd = Object.entries(metrics.byPersona)
      .map(([persona, count]) => `- ${persona.charAt(0).toUpperCase() + persona.slice(1)}: **${count}**`)
      .join('\n');
    
    const emailBody = `# Supervisor Monthly Report — ${metrics.month_label}\n
**Firm overview (last month):**  \n- Exceptions (open at month end): **${metrics.exceptions_open}** (Δ ${metrics.exceptions_delta} vs prior month)  \n- Guardrails alerts (count in month): **${metrics.guardrails_count}**  \n- Beneficiary mismatches (open at month end): **${metrics.beneficiary_open}** (Δ ${metrics.beneficiary_delta})  \n- Evidence packs built: **${metrics.evidence_count}**  \n- Anchor coverage (info): **${metrics.anchor_coverage}%**\n
**By Persona (open exceptions @ month end):**  \n${byPersonaMd}\n
**Trends (monthly)**  \nExceptions: \`${metrics.spark_exceptions}\`  \nEvidence: \`${metrics.spark_evidence}\`\n
**Links**  \n- Exceptions: ${metrics.links.exceptions_link}  \n- Evidence Builder: ${metrics.links.evidence_link}  \n- Anchors Verify: ${metrics.links.anchors_link}  \n- Audits: ${metrics.links.audits_link}  \n
> No client data included. For details, open the console to view exceptions and export an Evidence Pack.`;
    
    // Send emails
    let sent = 0;
    for (const to of opts.to) {
      const res = await sendEmail({ 
        to, 
        subject, 
        markdown: emailBody 
      });
      
      await recordReceipt({
        type: 'Comms-RDS',
        channel: 'email',
        persona: 'supervisor',
        template_id: 'supervisor.report.monthly',
        result: res.ok ? 'sent' : 'error',
        policy_ok: true,
        created_at: new Date().toISOString()
      } as any);
      
      if (res.ok) sent++;
    }
    
    return {
      ok: true,
      sent,
      month: metrics.month_label,
      pdfRef,
      evidenceRef,
      anchorRef
    };
    
  } catch (error) {
    console.error('Failed to build and send monthly report:', error);
    return {
      ok: false,
      sent: 0,
      month: month.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    };
  }
}
