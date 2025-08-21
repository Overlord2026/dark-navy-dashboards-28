import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { track } from '@/lib/analytics/track';

interface Tier {
  name: string;
  organizations: string[];
  color: string;
}

interface PDFGeneratorProps {
  theme: 'print' | 'digital';
  segment: string;
}

const sportsOrganizations: Tier[] = [
  {
    name: 'Gold',
    organizations: ['NFL', 'NBA', 'FIFA', 'UFC', 'MLB'],
    color: '#FFD700'
  },
  {
    name: 'Silver', 
    organizations: ['Formula 1', 'NASCAR', 'PGA Tour', 'LPGA', 'NHL'],
    color: '#C0C0C0'
  },
  {
    name: 'Bronze',
    organizations: [
      'MLS', 'USOC', 'IOC', 'ONE Championship', 'World Rugby',
      'ICC (Cricket)', 'Magic Johnson Enterprises', 'A-Rod Corp', 
      'WADA', 'International Paralympic Committee'
    ],
    color: '#CD7F32'
  }
];

export const PDFGenerator: React.FC<PDFGeneratorProps> = ({ theme, segment }) => {
  const generatePDF = async (pdfTheme: 'print' | 'digital') => {
    track('pdf_generation_started', { 
      segment, 
      theme: pdfTheme,
      source: 'pdf_generator_component' 
    });

    // Generate PDF content
    const pdfContent = generatePDFContent(pdfTheme);
    
    // Create blob and download
    const blob = new Blob([pdfContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `founding-20-sports-${pdfTheme}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    track('pdf_download_completed', { 
      segment, 
      theme: pdfTheme,
      filename: `founding-20-sports-${pdfTheme}.html`
    });
  };

  const generatePDFContent = (pdfTheme: 'print' | 'digital') => {
    const isDigital = pdfTheme === 'digital';
    const bgColor = isDigital ? '#FFFFFF' : '#000000';
    const textColor = isDigital ? '#000000' : '#FFFFFF';
    const accentColor = '#FFD700';

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Founding 20 — Sports Leagues & Associations (ROI Ranked)</title>
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
      border-bottom: 2px solid ${accentColor};
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
      margin: 0 0 20px 0;
    }
    
    .subtitle {
      font-size: 18px;
      color: ${textColor};
      opacity: 0.8;
    }
    
    .intro {
      font-size: 16px;
      margin-bottom: 50px;
      max-width: 800px;
      margin-left: auto;
      margin-right: auto;
      text-align: center;
    }
    
    .tier {
      margin-bottom: 50px;
    }
    
    .tier-header {
      display: flex;
      align-items: center;
      margin-bottom: 25px;
    }
    
    .tier-indicator {
      width: 8px;
      height: 40px;
      margin-right: 20px;
      border-radius: 4px;
    }
    
    .tier-name {
      font-family: 'Playfair Display', serif;
      font-size: 24px;
      font-weight: 600;
      color: ${textColor};
    }
    
    .tier-gold .tier-indicator { background-color: #FFD700; }
    .tier-silver .tier-indicator { background-color: rgba(192,192,192,0.7); }
    .tier-bronze .tier-indicator { background-color: rgba(205,127,50,0.7); }
    
    .organizations {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-left: 28px;
    }
    
    .org-card {
      background: ${isDigital ? '#F8F9FA' : 'rgba(255,255,255,0.05)'};
      border: 1px solid ${isDigital ? '#E9ECEF' : 'rgba(255,215,0,0.2)'};
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      transition: all 0.3s ease;
    }
    
    .org-card:hover {
      border-color: ${accentColor};
      box-shadow: 0 4px 12px rgba(255,215,0,0.15);
    }
    
    .org-name {
      font-weight: 600;
      font-size: 16px;
      margin-bottom: 8px;
    }
    
    .org-type {
      font-size: 12px;
      opacity: 0.7;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .footer {
      margin-top: 80px;
      text-align: center;
      border-top: 2px solid ${accentColor};
      padding-top: 30px;
    }
    
    .cta {
      font-size: 18px;
      font-weight: 600;
      color: ${accentColor};
      margin-bottom: 20px;
    }
    
    .tagline {
      font-family: 'Playfair Display', serif;
      font-size: 16px;
      color: ${accentColor};
      font-style: italic;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">Boutique Family Office™</div>
    <h1>Founding 20 — Sports Leagues & Associations</h1>
    <div class="subtitle">(ROI Ranked)</div>
  </div>
  
  <div class="intro">
    A prioritized list of partnerships to accelerate athlete education, player care, and long-term financial outcomes.
  </div>
  
  ${sportsOrganizations.map(tier => `
    <div class="tier tier-${tier.name.toLowerCase()}">
      <div class="tier-header">
        <div class="tier-indicator"></div>
        <div class="tier-name">${tier.name} Tier</div>
      </div>
      <div class="organizations">
        ${tier.organizations.map(org => `
          <div class="org-card">
            <div class="org-name">${org}</div>
            <div class="org-type">Sports Organization</div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('')}
  
  <div class="footer">
    <div class="cta">Schedule your preview to see BFO for your athletes.</div>
    <div class="tagline">Healthspan + Wealthspan. One Platform.</div>
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
        Print version optimized for physical materials, digital version for email/web sharing.
      </p>
    </div>
  );
};