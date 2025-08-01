import jsPDF from 'jspdf';
import 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const exportDashboardToPDF = async (metrics: any, dateRange: any) => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.text('Advisor Leads & ROI Dashboard', 20, 20);
  
  // Date range
  doc.setFontSize(12);
  const dateText = dateRange?.from && dateRange?.to 
    ? `Report Period: ${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
    : 'Report Period: All Time';
  doc.text(dateText, 20, 35);
  
  // KPI Summary
  doc.setFontSize(16);
  doc.text('Key Performance Indicators', 20, 55);
  
  const kpiData = [
    ['Metric', 'Value'],
    ['Total Leads', metrics.totalLeads.toString()],
    ['Closed Deals', metrics.closedLeads.toString()],
    ['Conversion Rate', `${metrics.conversionRate.toFixed(1)}%`],
    ['Total Spend', `$${metrics.totalSpend.toLocaleString()}`],
    ['Total Revenue', `$${metrics.totalRevenue.toLocaleString()}`],
    ['ROI', `${metrics.roi.toFixed(0)}%`],
  ];
  
  doc.autoTable({
    startY: 65,
    head: [kpiData[0]],
    body: kpiData.slice(1),
    theme: 'grid',
    headStyles: { fillColor: [37, 99, 235] },
  });
  
  // Campaign Summary
  const finalY = (doc as any).lastAutoTable.finalY || 65;
  doc.setFontSize(16);
  doc.text('Campaign Performance', 20, finalY + 20);
  
  const campaignData = [
    ['Campaign', 'Source', 'Spend', 'Leads', 'ROI'],
    ...metrics.campaigns.map((campaign: any) => [
      campaign.name,
      campaign.source,
      `$${campaign.spend.toLocaleString()}`,
      '0', // Mock leads for now
      '0%', // Mock ROI for now
    ]),
  ];
  
  if (campaignData.length > 1) {
    doc.autoTable({
      startY: finalY + 30,
      head: [campaignData[0]],
      body: campaignData.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] },
    });
  }
  
  // Footer
  doc.setFontSize(10);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, doc.internal.pageSize.height - 20);
  
  // Save the PDF
  doc.save(`advisor-roi-dashboard-${new Date().toISOString().split('T')[0]}.pdf`);
};