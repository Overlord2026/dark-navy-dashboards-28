import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { LOGOS } from '@/assets/logos';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

const stateDeadlines = [
  { state: 'CA', deadline: 'May 31', period: '2-year cycle', ethics: '3 hrs', total: '24 hrs' },
  { state: 'TX', deadline: 'Dec 31', period: '2-year cycle', ethics: '2 hrs', total: '20 hrs' },
  { state: 'FL', deadline: 'Jul 31', period: '2-year cycle', ethics: '5 hrs', total: '20 hrs' },
  { state: 'NY', deadline: 'Sep 30', period: '2-year cycle', ethics: '3 hrs', total: '15 hrs' },
  { state: 'IL', deadline: 'May 31', period: '2-year cycle', ethics: '3 hrs', total: '15 hrs' },
  { state: 'PA', deadline: 'May 31', period: '2-year cycle', ethics: '3 hrs', total: '24 hrs' },
  { state: 'OH', deadline: 'Sep 30', period: '2-year cycle', ethics: '3 hrs', total: '24 hrs' },
  { state: 'GA', deadline: 'May 31', period: '2-year cycle', ethics: '3 hrs', total: '20 hrs' },
  { state: 'NC', deadline: 'Jun 30', period: '2-year cycle', ethics: '3 hrs', total: '24 hrs' },
  { state: 'MI', deadline: 'Jul 31', period: '2-year cycle', ethics: '3 hrs', total: '20 hrs' },
];

const dashboardSteps = [
  { title: '1. Check Status Overview', description: 'View license status, expiry dates, and CE progress' },
  { title: '2. Monitor CE Progress', description: 'Track continuing education credits with progress bars' },
  { title: '3. Upload Certificates', description: 'Use "Add CE Course" to upload completion certificates' },
  { title: '4. Review Alerts', description: 'Check alerts panel for upcoming deadlines' },
  { title: '5. Plan Renewals', description: 'Use countdown to plan CE completion timeline' },
  { title: '6. Update Profile', description: 'Keep license information current' }
];

const faqs = [
  {
    question: 'What if I miss a CE deadline?',
    answer: 'Contact your state insurance department immediately. Most states offer a grace period (30-90 days) with late fees.'
  },
  {
    question: 'How do I upload certificates?',
    answer: 'Click "Add CE Course", drag and drop your PDF certificate, and our AI will auto-extract course details.'
  },
  {
    question: 'What courses count toward requirements?',
    answer: 'Check state-specific requirements: Ethics (required), Annuity Training, LTC Training, and General CE credits.'
  },
  {
    question: 'How long does verification take?',
    answer: 'Most certificates are verified within 2-3 business days with email notification.'
  }
];

export const exportComplianceGuideToPDF = async () => {
  const doc = new jsPDF();
  
  // BFO Header with branding
  doc.setFillColor(20, 33, 61); // Navy background
  doc.rect(0, 0, 210, 25, 'F');
  
  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('How to Stay Compliant', 20, 16);
  
  // Subtitle
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Boutique Family Office™ Insurance CE Management Guide', 20, 22);
  
  // Reset colors for content
  doc.setTextColor(0, 0, 0);
  
  // Shield icon representation (text)
  doc.setFontSize(16);
  doc.text('🛡️', 175, 16);
  
  let yPosition = 40;
  
  // Dashboard Steps Section
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(22, 163, 74); // Emerald
  doc.text('📊 Dashboard Overview - 6 Simple Steps', 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  dashboardSteps.forEach((step, index) => {
    doc.setFont('helvetica', 'bold');
    doc.text(step.title, 20, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(step.description, 25, yPosition + 4);
    yPosition += 12;
  });
  
  yPosition += 5;
  
  // State Deadlines Table
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(37, 99, 235); // Blue
  doc.text('📅 Common Renewal Deadlines by State', 20, yPosition);
  yPosition += 10;
  
  const stateTableData = stateDeadlines.map(item => [
    item.state,
    item.deadline,
    item.period,
    item.ethics,
    item.total
  ]);
  
  doc.autoTable({
    startY: yPosition,
    head: [['State', 'Deadline', 'Period', 'Ethics', 'Total CE']],
    body: stateTableData,
    theme: 'grid',
    headStyles: { 
      fillColor: [37, 99, 235],
      textColor: [255, 255, 255],
      fontSize: 10
    },
    bodyStyles: { fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 30 },
      2: { cellWidth: 35 },
      3: { cellWidth: 25 },
      4: { cellWidth: 25 }
    }
  });
  
  // FAQ Section
  const finalY = (doc as any).lastAutoTable.finalY || yPosition + 60;
  yPosition = finalY + 15;
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(147, 51, 234); // Purple
  doc.text('❓ Frequently Asked Questions', 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  faqs.forEach((faq, index) => {
    doc.setFont('helvetica', 'bold');
    const questionLines = doc.splitTextToSize(`Q: ${faq.question}`, 170);
    questionLines.forEach((line: string) => {
      doc.text(line, 20, yPosition);
      yPosition += 5;
    });
    
    doc.setFont('helvetica', 'normal');
    const answerLines = doc.splitTextToSize(`A: ${faq.answer}`, 170);
    answerLines.forEach((line: string) => {
      doc.text(line, 20, yPosition);
      yPosition += 5;
    });
    yPosition += 3;
  });
  
  // Support Contact Section with working links
  yPosition += 10;
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(220, 38, 38); // Red
  doc.text('📞 Need Help? Contact Support', 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text('Emergency Line: 1-800-CE-HELP (24/7)', 20, yPosition);
  yPosition += 8;
  doc.text('Email: compliance@bfocfo.com', 20, yPosition);
  yPosition += 8;
  doc.text('Live Chat: Available in Dashboard (Mon-Fri 8AM-6PM)', 20, yPosition);
  yPosition += 8;
  doc.text('Support Portal: https://app.bfocfo.com/support', 20, yPosition);
  
  // Footer with BFO branding
  doc.setFillColor(22, 163, 74); // Emerald background
  doc.rect(0, 270, 210, 27, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('🛡️ Stay Compliant, Stay Confident', 20, 283);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Boutique Family Office™ - Your Trusted Compliance Partner', 20, 290);
  doc.text(`Generated: ${new Date().toLocaleDateString()} | Version 2.1`, 120, 290);
  
  // Save the PDF
  doc.save(`compliance-guide-${new Date().toISOString().split('T')[0]}.pdf`);
};