import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { track } from '@/lib/analytics/track';

interface LaunchChecklistPDFGeneratorProps {
  segment?: string;
}

export const LaunchChecklistPDFGenerator: React.FC<LaunchChecklistPDFGeneratorProps> = ({ 
  segment = 'all' 
}) => {
  const generatePDF = async (theme: 'print' | 'digital') => {
    track('launch_checklist_pdf_generation_started', { 
      segment, 
      theme,
      source: 'pdf_generator_component' 
    });

    // Generate PDF content
    const pdfContent = generatePDFContent(theme);
    
    // Create blob and download
    const blob = new Blob([pdfContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `founding-20-launch-checklist-${theme}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    track('launch_checklist_pdf_download_completed', { 
      segment, 
      theme,
      filename: `founding-20-launch-checklist-${theme}.html`
    });
  };

  const generatePDFContent = (theme: 'print' | 'digital') => {
    const isDigital = theme === 'digital';
    const bgColor = isDigital ? '#FFFFFF' : '#000000';
    const textColor = isDigital ? '#000000' : '#FFFFFF';
    const accentColor = '#FFD700';

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Founding 20 Launch Sequencing Checklist</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Playfair+Display:wght@400;600;700&display=swap');
    
    body {
      font-family: 'Inter', sans-serif;
      background-color: ${bgColor};
      color: ${textColor};
      margin: 0;
      padding: 40px;
      line-height: 1.6;
    }
    
    .header {
      text-align: center;
      margin-bottom: 60px;
      border-bottom: 3px solid ${accentColor};
      padding-bottom: 30px;
    }
    
    .logo {
      font-family: 'Playfair Display', serif;
      font-size: 24px;
      font-weight: 700;
      color: ${accentColor};
      margin-bottom: 20px;
    }
    
    h1 {
      font-family: 'Playfair Display', serif;
      font-size: 32px;
      font-weight: 700;
      color: ${accentColor};
      margin: 0 0 10px 0;
    }
    
    .subtitle {
      font-size: 18px;
      color: ${textColor};
      opacity: 0.8;
      margin-bottom: 20px;
    }
    
    .intro {
      font-size: 16px;
      margin-bottom: 50px;
      max-width: 800px;
      margin-left: auto;
      margin-right: auto;
      text-align: center;
      line-height: 1.8;
    }
    
    .week-section {
      margin-bottom: 60px;
      page-break-inside: avoid;
    }
    
    .week-header {
      background: ${isDigital ? '#F8F9FA' : 'rgba(255,215,0,0.1)'};
      padding: 20px;
      border-radius: 12px;
      border-left: 6px solid ${accentColor};
      margin-bottom: 30px;
    }
    
    .week-title {
      font-family: 'Playfair Display', serif;
      font-size: 24px;
      font-weight: 600;
      color: ${accentColor};
      margin: 0 0 5px 0;
    }
    
    .week-focus {
      font-size: 16px;
      color: ${textColor};
      opacity: 0.9;
      margin: 0;
    }
    
    .segments {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
      margin-top: 20px;
    }
    
    .segment {
      background: ${isDigital ? '#FAFAFA' : 'rgba(255,255,255,0.03)'};
      border: 1px solid ${isDigital ? '#E9ECEF' : 'rgba(255,215,0,0.2)'};
      border-radius: 12px;
      padding: 25px;
    }
    
    .segment-sports { border-left-color: #046B4D; border-left-width: 4px; }
    .segment-longevity { border-left-color: #0A152E; border-left-width: 4px; }
    .segment-ria { border-left-color: #A6192E; border-left-width: 4px; }
    
    .segment-title {
      font-weight: 600;
      font-size: 18px;
      margin: 0 0 15px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .segment-sports .segment-title { color: #046B4D; }
    .segment-longevity .segment-title { color: #0A152E; }
    .segment-ria .segment-title { color: #A6192E; }
    
    .targets {
      margin-bottom: 20px;
    }
    
    .targets h4 {
      font-size: 14px;
      font-weight: 600;
      color: ${textColor};
      opacity: 0.8;
      margin: 0 0 10px 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .target-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 8px;
    }
    
    .target-item {
      background: ${isDigital ? '#E9ECEF' : 'rgba(255,255,255,0.1)'};
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 12px;
      text-align: center;
      font-weight: 500;
    }
    
    .actions {
      margin-top: 20px;
    }
    
    .actions h4 {
      font-size: 14px;
      font-weight: 600;
      color: ${textColor};
      opacity: 0.8;
      margin: 0 0 10px 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .action-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .action-item {
      padding: 8px 0;
      border-bottom: 1px solid ${isDigital ? '#E9ECEF' : 'rgba(255,255,255,0.1)'};
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .action-item:last-child {
      border-bottom: none;
    }
    
    .action-bullet {
      width: 6px;
      height: 6px;
      background: ${accentColor};
      border-radius: 50%;
      flex-shrink: 0;
    }
    
    .footer {
      margin-top: 80px;
      text-align: center;
      border-top: 2px solid ${accentColor};
      padding-top: 30px;
    }
    
    .footer-tagline {
      font-family: 'Playfair Display', serif;
      font-size: 16px;
      color: ${accentColor};
      font-style: italic;
      margin: 0;
    }
    
    @media print {
      body { padding: 20px; }
      .week-section { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">Boutique Family Office™</div>
    <h1>Founding 20 Launch Sequencing Checklist</h1>
    <div class="subtitle">8-Week Execution Roadmap</div>
  </div>
  
  <div class="intro">
    An 8-week execution roadmap for launching the Founding 20 outreach across Sports, Longevity, and RIA segments. 
    This comprehensive checklist ensures systematic engagement with top-tier prospects while maintaining momentum 
    across all three strategic verticals.
  </div>
  
  <div class="week-section">
    <div class="week-header">
      <h2 class="week-title">Week 1-2: Gold Tier Blitz</h2>
      <p class="week-focus">Premium targets with highest conversion potential</p>
    </div>
    
    <div class="segments">
      <div class="segment segment-sports">
        <h3 class="segment-title">🏃 Sports</h3>
        <div class="targets">
          <h4>Targets (5 organizations)</h4>
          <div class="target-list">
            <div class="target-item">NFL</div>
            <div class="target-item">NBA</div>
            <div class="target-item">FIFA</div>
            <div class="target-item">UFC</div>
            <div class="target-item">MLB</div>
          </div>
        </div>
        <div class="actions">
          <h4>Key Actions</h4>
          <ul class="action-list">
            <li class="action-item"><div class="action-bullet"></div>Ship premium kits within 48h</li>
            <li class="action-item"><div class="action-bullet"></div>Send 60s HeyGen video email to Exec contacts</li>
            <li class="action-item"><div class="action-bullet"></div>Book 15-min previews</li>
          </ul>
        </div>
      </div>
      
      <div class="segment segment-longevity">
        <h3 class="segment-title">🧬 Longevity</h3>
        <div class="targets">
          <h4>Targets (5 individuals)</h4>
          <div class="target-list">
            <div class="target-item">Tony Robbins</div>
            <div class="target-item">Peter Diamandis</div>
            <div class="target-item">David Sinclair</div>
            <div class="target-item">Andrew Huberman</div>
            <div class="target-item">Dr. Mark Hyman</div>
          </div>
        </div>
        <div class="actions">
          <h4>Key Actions</h4>
          <ul class="action-list">
            <li class="action-item"><div class="action-bullet"></div>Ship premium kits within 48h</li>
            <li class="action-item"><div class="action-bullet"></div>Send 60s HeyGen video email to Exec contacts</li>
            <li class="action-item"><div class="action-bullet"></div>Book 15-min previews</li>
          </ul>
        </div>
      </div>
      
      <div class="segment segment-ria">
        <h3 class="segment-title">💼 RIA</h3>
        <div class="targets">
          <h4>Targets (5 companies)</h4>
          <div class="target-list">
            <div class="target-item">Crescent Wealth</div>
            <div class="target-item">Mission Wealth</div>
            <div class="target-item">Mercer Advisors</div>
            <div class="target-item">Creative Planning</div>
            <div class="target-item">Edelman Financial</div>
          </div>
        </div>
        <div class="actions">
          <h4>Key Actions</h4>
          <ul class="action-list">
            <li class="action-item"><div class="action-bullet"></div>Ship premium kits within 48h</li>
            <li class="action-item"><div class="action-bullet"></div>Send 60s HeyGen video email to Exec contacts</li>
            <li class="action-item"><div class="action-bullet"></div>Book 15-min previews</li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <!-- Additional weeks would be generated similarly -->
  
  <div class="footer">
    <p class="footer-tagline">Healthspan + Wealthspan. One Platform.</p>
  </div>
</body>
</html>`;
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Button 
          onClick={() => generatePDF('print')}
          variant="gold"
        >
          <FileText className="mr-2 h-4 w-4" />
          Generate Print PDF
        </Button>
        
        <Button 
          onClick={() => generatePDF('digital')}
          variant="outline"
          className="border-gold text-gold hover:bg-gold/10"
        >
          <Download className="mr-2 h-4 w-4" />
          Generate Digital PDF
        </Button>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Print version optimized for physical checklists, digital version for email/web sharing.
      </p>
    </div>
  );
};