import React from 'react';
import { Button } from '@/components/ui/button';
import { FileDown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { RetirementAnalysisInput, RetirementAnalysisResults } from '@/types/retirement';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface RetirementPDFExportProps {
  inputs: RetirementAnalysisInput;
  results: RetirementAnalysisResults;
  loading?: boolean;
}

export const RetirementPDFExport: React.FC<RetirementPDFExportProps> = ({
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
      doc.text('SWAG™ Personalized Retirement Roadmap', 20, 30);
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, 45);
      
      // Client Information
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Retirement Profile', 20, 70);
      
      const profileData = [
        ['Current Age', inputs.goals.currentAge.toString()],
        ['Retirement Age', inputs.goals.retirementAge.toString()],
        ['Desired Annual Income', `$${inputs.goals.annualRetirementIncome.toLocaleString()}`],
        ['Life Expectancy', inputs.goals.lifeExpectancy.toString()],
        ['Inflation Rate', `${inputs.goals.inflationRate}%`]
      ];
      
      doc.autoTable({
        startY: 80,
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
      
      // Investment Accounts
      if (inputs.accounts.length > 0) {
        doc.addPage();
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Investment Accounts', 20, 30);
        
        const accountsData = inputs.accounts.map(account => [
          account.type.replace('_', ' ').toUpperCase(),
          `$${account.balance.toLocaleString()}`,
          `$${account.annualContribution.toLocaleString()}`,
          `${account.expectedReturn}%`,
          account.taxStatus.replace('_', ' ')
        ]);
        
        doc.autoTable({
          startY: 40,
          head: [['Account Type', 'Balance', 'Annual Contribution', 'Expected Return', 'Tax Status']],
          body: accountsData,
          theme: 'grid',
          headStyles: { fillColor: [37, 99, 235] },
          margin: { left: 20, right: 20 }
        });
      }
      
      // Recommendations
      if (results.recommendations.length > 0) {
        const recommendationsY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 20 : 40;
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Recommendations', 20, recommendationsY);
        
        const recommendationsData = results.recommendations.map(rec => [
          rec.title,
          rec.priority.toUpperCase(),
          `$${rec.impactAmount.toLocaleString()}`,
          rec.description
        ]);
        
        doc.autoTable({
          startY: recommendationsY + 10,
          head: [['Recommendation', 'Priority', 'Impact', 'Description']],
          body: recommendationsData,
          theme: 'grid',
          headStyles: { fillColor: [37, 99, 235] },
          margin: { left: 20, right: 20 },
          columnStyles: {
            3: { cellWidth: 60 }
          }
        });
      }
      
      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(
          `Page ${i} of ${pageCount} - SWAG™ Retirement Analysis`,
          20,
          doc.internal.pageSize.height - 20
        );
      }
      
      // Save the PDF
      const filename = `swag-retirement-roadmap-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);
      
      toast.success('PDF exported successfully!');
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
      Export PDF Report
    </Button>
  );
};