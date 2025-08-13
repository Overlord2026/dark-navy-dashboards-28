import React from "react";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { SwagRetirementAnalysisInput, SwagRetirementAnalysisResults } from "@/types/swag-retirement";

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface SwagRetirementPDFExportProps {
  inputs: SwagRetirementAnalysisInput;
  results: SwagRetirementAnalysisResults;
  loading?: boolean;
}

const fmtCurrency = (n?: number) =>
  typeof n === "number" && !Number.isNaN(n) ? `$${n.toLocaleString()}` : "—";
const fmtPct = (n?: number, d: number = 0) =>
  typeof n === "number" && !Number.isNaN(n) ? `${n.toFixed(d)}%` : "—";

export const SwagRetirementPDFExport: React.FC<SwagRetirementPDFExportProps> = ({
  inputs,
  results,
  loading = false,
}) => {
  const exportToPDF = async () => {
    try {
      const doc = new jsPDF();

      // Cover
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("SWAG™ Retirement Roadmap", 20, 30);
      doc.text("Strategic Wealth Allocation & Growth", 20, 45);
      doc.setFontSize(14);
      doc.setFont("helvetica", "normal");
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, 60);

      // Client Profile
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Client Profile", 20, 80);

      const p = inputs.profile;
      const profileData: (string | number)[][] = [
        ["Client Name", p.primaryClient?.name ?? "Not provided"],
        ["Current Age", String(p.primaryClient?.age ?? "—")],
        ["Retirement Age", String(p.primaryClient?.retirementAge ?? "—")],
        ["State of Residence", p.primaryClient?.stateOfResidence ?? "Not specified"],
        ["Tax Bracket", p.primaryClient?.taxBracket ?? "Not specified"],
      ];
      if (p.spouse) {
        profileData.push(["Spouse Name", p.spouse.name ?? "—"]);
        profileData.push(["Spouse Age", String(p.spouse.age ?? "—")]);
      }

      doc.autoTable({
        startY: 90,
        head: [["Profile Item", "Value"]],
        body: profileData,
        theme: "grid",
        headStyles: { fillColor: [37, 99, 235] },
        margin: { left: 20, right: 20 },
      });

      // Scores & Results
      const afterProfileY = (doc as any).lastAutoTable.finalY + 20;
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("SWAG Score™ Analysis", 20, afterProfileY);

      const mc = results.monteCarlo;
      const resultsData: (string | number)[][] = [
        ["SWAG Score", `${Math.round(mc?.swagScore ?? 0)}/100`],
        ["Retirement Readiness", fmtPct(results.readinessScore, 0)],
        ["Success Probability", fmtPct(mc?.successProbability, 1)],
        ["Monthly Income Gap", fmtCurrency(results.monthlyIncomeGap)],
        ["Median Portfolio Value", fmtCurrency(mc?.medianPortfolioValue)],
      ];

      doc.autoTable({
        startY: afterProfileY + 10,
        head: [["Metric", "Value"]],
        body: resultsData,
        theme: "grid",
        headStyles: { fillColor: [37, 99, 235] },
        margin: { left: 20, right: 20 },
      });

      // Phase Allocations
      if ((results.phaseAllocations?.length ?? 0) > 0) {
        doc.addPage();
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("SWAG Phase Allocations", 20, 30);

        const phaseData = results.phaseAllocations!.map((a) => {
          const phase = inputs.phases?.find((ph) => ph.id === a.phaseId);
          return [
            phase?.name || a.phaseId,
            fmtCurrency(a.allocatedAmount),
            fmtCurrency(a.projectedIncome),
            a.fundingStatus?.replace?.("_", " ") ?? "—",
            (a.recommendedActions || []).join("; "),
          ];
        });

        doc.autoTable({
          startY: 40,
          head: [["Phase", "Allocated Amount", "Projected Income", "Status", "Recommendations"]],
          body: phaseData,
          theme: "grid",
          headStyles: { fillColor: [37, 99, 235] },
          margin: { left: 20, right: 20 },
          columnStyles: { 4: { cellWidth: 60 } },
        });
      }

      // Phase Projections
      if ((results.phaseProjections?.length ?? 0) > 0) {
        const startY =
          (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 20 : 40;
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Phase Projections", 20, startY);

        const projectionData = results.phaseProjections!.map((pr) => {
          const phase = inputs.phases?.find((ph) => ph.id === pr.phaseId);
          return [
            phase?.name || pr.phaseId,
            fmtCurrency(pr.projectedBalance),
            fmtCurrency(pr.projectedIncome),
            pr.shortfall && pr.shortfall > 0 ? fmtCurrency(pr.shortfall) : "None",
            fmtPct(pr.confidenceLevel, 0),
            (pr.riskFactors || []).join(", "),
          ];
        });

        doc.autoTable({
          startY: startY + 10,
          head: [["Phase", "Projected Balance", "Annual Income", "Shortfall", "Confidence", "Risk Factors"]],
          body: projectionData,
          theme: "grid",
          headStyles: { fillColor: [37, 99, 235] },
          margin: { left: 20, right: 20 },
          columnStyles: { 5: { cellWidth: 50 } },
        });
      }

      // Allocation Summary
      if (results.investmentAllocationSummary) {
        doc.addPage();
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Investment Allocation Summary", 20, 30);

        const alloc = results.investmentAllocationSummary;
        const allocationData = alloc.allocationByPhase.map((a) => {
          const phase = inputs.phases?.find((ph) => ph.id === a.phaseId);
          return [phase?.name || a.phaseId, fmtCurrency(a.allocation), fmtPct(a.percentage, 1)];
        });

        doc.autoTable({
          startY: 40,
          head: [["Phase", "Allocation", "Percentage"]],
          body: allocationData,
          theme: "grid",
          headStyles: { fillColor: [37, 99, 235] },
          margin: { left: 20, right: 20 },
        });

        if ((alloc.recommendations?.length ?? 0) > 0) {
          const y = (doc as any).lastAutoTable.finalY + 20;
          doc.setFontSize(14);
          doc.setFont("helvetica", "bold");
          doc.text("Allocation Recommendations:", 20, y);

          let currentY = y + 10;
          alloc.recommendations!.forEach((rec, idx) => {
            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            doc.text(`${idx + 1}. ${rec}`, 25, currentY);
            currentY += 7;
          });
        }
      }

      // Estate Planning Status
      if (inputs.profile.estateDocuments) {
        const y = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 30 : 100;
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Estate Planning Status", 20, y);

        const estateData = Object.entries(inputs.profile.estateDocuments || {}).map(
          ([docType, docInfo]) => [
            docType.replace(/([A-Z])/g, " $1").trim(),
            (docInfo as any)?.hasDocument ? "Complete" : "Missing",
            (docInfo as any)?.lastUpdated
              ? new Date((docInfo as any).lastUpdated).toLocaleDateString()
              : "N/A",
          ]
        );

        doc.autoTable({
          startY: y + 10,
          head: [["Document Type", "Status", "Last Updated"]],
          body: estateData,
          theme: "grid",
          headStyles: { fillColor: [37, 99, 235] },
          margin: { left: 20, right: 20 },
        });
      }

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        const h = doc.internal.pageSize.height;
        doc.text(`Page ${i} of ${pageCount} - SWAG™ Retirement Roadmap`, 20, h - 20);
        doc.text("Strategic Wealth Allocation & Growth Framework", 20, h - 10);
      }

      const filename = `swag-retirement-roadmap-${new Date().toISOString().split("T")[0]}.pdf`;
      doc.save(filename);
      toast.success("SWAG Retirement Roadmap PDF exported successfully!");
    } catch (error) {
      console.error("PDF export failed:", error);
      toast.error("Failed to export PDF. Please try again.");
    }
  };

  return (
    <Button onClick={exportToPDF} disabled={loading} className="gap-2" variant="outline">
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
      Export SWAG Report
    </Button>
  );
};