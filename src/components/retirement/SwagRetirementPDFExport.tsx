import React from 'react';
import { Button } from '@/components/ui/button';
import { FileDown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { SwagRetirementAnalysisInput, SwagRetirementAnalysisResults } from '@/types/swag-retirement';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface SwagRetirementPDFExportProps {
  inputs: SwagRetirementAnalysisInput;
  results: SwagRetirementAnalysisResults;
  loading?: boolean;
}

export const SwagRetirementPDFExport: React.FC<SwagRetirementPDFExportProps> = ({
  inputs,
  results,
  loading = false
}) => {
  const exportToPDF = async () => {
    try {
      const doc = new jsPDF();
      
      // Cover Page
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('SWAG™ Retirement Roadmap', 20, 30);
      doc.text('Strategic Wealth Allocation & Growth', 20, 45);
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, 60);
      
      // Client Information
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Client Profile', 20, 80);
      
      const profileData = [
        ['Client Name', inputs.profile.primaryClient.name || 'Not provided'],
        ['Current Age', inputs.profile.primaryClient.age.toString()],
        ['Retirement Age', inputs.profile.primaryClient.retirementAge.toString()],
        ['State of Residence', inputs.profile.stateOfResidence || 'Not specified'],
        ['Tax Bracket', `${inputs.profile.taxBracket}%`]
      ];
      
      if (inputs.profile.spouse) {
        profileData.push(['Spouse Name', inputs.profile.spouse.name]);
        profileData.push(['Spouse Age', inputs.profile.spouse.age.toString()]);
      }
      
      doc.autoTable({
        startY: 90,
        head: [['Profile Item', 'Value']],
        body: profileData,
        theme: 'grid',
        headStyles: { fillColor: [37, 99, 235] },
        margin: { left: 20, right: 20 }
      });
      
      // SWAG Score and Results
      const resultsY = (doc as any).lastAutoTable.finalY + 20;
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('SWAG Score™ Analysis', 20, resultsY);
      
      const resultsData = [
        ['SWAG Score', `${results.monteCarlo.swagScore.toFixed(0)}/100`],
        ['Retirement Readiness', `${results.readinessScore.toFixed(0)}%`],
        ['Success Probability', `${results.monteCarlo.successProbability.toFixed(1)}%`],
        ['Monthly Income Gap', `$${results.monthlyIncomeGap.toLocaleString()}`],
        ['Median Portfolio Value', `$${results.monteCarlo.medianPortfolioValue.toLocaleString()}`]
      ];
      
      doc.autoTable({
        startY: resultsY + 10,
        head: [['Metric', 'Value']],
        body: resultsData,
        theme: 'grid',
        headStyles: { fillColor: [37, 99, 235] },
        margin: { left: 20, right: 20 }
      });
      
      // Phase Allocations
      if (results.phaseAllocations.length > 0) {
        doc.addPage();
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('SWAG Phase Allocations', 20, 30);
        
        const phaseData = results.phaseAllocations.map(allocation => {
          const phase = inputs.phases.find(p => p.id === allocation.phaseId);
          return [
            phase?.name || allocation.phaseId,
            `$${allocation.allocatedAmount.toLocaleString()}`,
            `$${allocation.projectedIncome.toLocaleString()}`,
            allocation.fundingStatus.replace('_', ' '),
            allocation.recommendedActions.join('; ')
          ];
        });
        
        doc.autoTable({
          startY: 40,
          head: [['Phase', 'Allocated Amount', 'Projected Income', 'Status', 'Recommendations']],
          body: phaseData,
          theme: 'grid',
          headStyles: { fillColor: [37, 99, 235] },
          margin: { left: 20, right: 20 },
          columnStyles: {
            4: { cellWidth: 60 }
          }
        });
      }
      
      // Phase Projections
      if (results.phaseProjections.length > 0) {
        const projectionsY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 20 : 40;
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Phase Projections', 20, projectionsY);
        
        const projectionData = results.phaseProjections.map(projection => {
          const phase = inputs.phases.find(p => p.id === projection.phaseId);
          return [
            phase?.name || projection.phaseId,
            `$${projection.projectedBalance.toLocaleString()}`,
            `$${projection.projectedIncome.toLocaleString()}`,
            projection.shortfall > 0 ? `$${projection.shortfall.toLocaleString()}` : 'None',
            `${projection.confidenceLevel.toFixed(0)}%`,
            projection.riskFactors.join(', ')
          ];
        });
        
        doc.autoTable({
          startY: projectionsY + 10,
          head: [['Phase', 'Projected Balance', 'Annual Income', 'Shortfall', 'Confidence', 'Risk Factors']],
          body: projectionData,
          theme: 'grid',
          headStyles: { fillColor: [37, 99, 235] },
          margin: { left: 20, right: 20 },
          columnStyles: {
            5: { cellWidth: 50 }
          }
        });
      }
      
      // Investment Allocation Summary
      if (results.investmentAllocationSummary) {
        doc.addPage();
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Investment Allocation Summary', 20, 30);
        
        const allocationData = results.investmentAllocationSummary.allocationByPhase.map(allocation => {
          const phase = inputs.phases.find(p => p.id === allocation.phaseId);
          return [
            phase?.name || allocation.phaseId,
            `$${allocation.allocation.toLocaleString()}`,
            `${allocation.percentage.toFixed(1)}%`
          ];
        });
        
        doc.autoTable({
          startY: 40,
          head: [['Phase', 'Allocation', 'Percentage']],
          body: allocationData,
          theme: 'grid',
          headStyles: { fillColor: [37, 99, 235] },
          margin: { left: 20, right: 20 }
        });
        
        // Add recommendations
        if (results.investmentAllocationSummary.recommendations.length > 0) {
          const recommendationsY = (doc as any).lastAutoTable.finalY + 20;
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.text('Allocation Recommendations:', 20, recommendationsY);
          
          let currentY = recommendationsY + 10;
          results.investmentAllocationSummary.recommendations.forEach((rec, index) => {
            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            doc.text(`${index + 1}. ${rec}`, 25, currentY);
            currentY += 7;
          });
        }
      }
      
      // Estate Planning Status
      if (inputs.profile.estateDocuments) {
        const estateY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 30 : 100;
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Estate Planning Status', 20, estateY);
        
        const estateData = Object.entries(inputs.profile.estateDocuments).map(([docType, docInfo]) => [
          docType.replace(/([A-Z])/g, ' $1').trim(),
          docInfo.hasDocument ? 'Complete' : 'Missing',
          docInfo.lastUpdated ? new Date(docInfo.lastUpdated).toLocaleDateString() : 'N/A'
        ]);
        
        doc.autoTable({
          startY: estateY + 10,
          head: [['Document Type', 'Status', 'Last Updated']],
          body: estateData,
          theme: 'grid',
          headStyles: { fillColor: [37, 99, 235] },
          margin: { left: 20, right: 20 }
        });
      }
      
      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(
          `Page ${i} of ${pageCount} - SWAG™ Retirement Roadmap`,
          20,
          doc.internal.pageSize.height - 20
        );
        doc.text(
          'Strategic Wealth Allocation & Growth Framework',
          20,
          doc.internal.pageSize.height - 10
        );
      }
      
      // Save the PDF
      const filename = `swag-retirement-roadmap-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);
      
      toast.success('SWAG Retirement Roadmap PDF exported successfully!');
    } catch (error) {
      console.error('PDF export failed:', error);
      toast.error('Failed to export PDF. Please try again.');
    }
  };

  return (
    <Button 
      onClick={exportToPDF} 
      disabled={loading}
      className="gap-2"
      variant="outline"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <FileDown className="h-4 w-4" />
      )}
      Export SWAG Report
    </Button>
  );
};