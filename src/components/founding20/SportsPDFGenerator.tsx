import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download } from 'lucide-react';
import { track } from '@/lib/analytics/track';

interface SportsPDFGeneratorProps {
  theme: 'print' | 'digital';
}

const sportsOrganizations = {
  gold: ['NFL', 'NBA', 'FIFA', 'UFC', 'MLB'],
  silver: ['Formula 1', 'NASCAR', 'PGA Tour', 'LPGA', 'NHL'],
  bronze: [
    'MLS', 'USOC', 'IOC', 'ONE Championship', 'World Rugby', 
    'ICC (Cricket)', 'Magic Johnson Enterprises', 'A-Rod Corp', 
    'WADA', 'International Paralympic Committee'
  ]
};

export const SportsPDFGenerator: React.FC<SportsPDFGeneratorProps> = ({ theme }) => {
  const generatePDF = async (pdfTheme: 'print' | 'digital') => {
    track('pdf_generation_started', { 
      segment: 'sports', 
      theme: pdfTheme 
    });

    const content = generatePDFContent(pdfTheme);
    
    // Create blob and download
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `founding20-sports-${pdfTheme}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    track('pdf_generation_completed', { 
      segment: 'sports', 
      theme: pdfTheme 
    });
  };

  const generatePDFContent = (pdfTheme: 'print' | 'digital'): string => {
    const isDigital = pdfTheme === 'digital';
    const bgColor = isDigital ? '#FFFFFF' : '#000000';
    const textColor = isDigital ? '#000000' : '#FFFFFF';
    const goldColor = '#FFD700';
    const emeraldColor = '#046B4D';

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Founding 20 — Sports Leagues & Associations (ROI Ranked)</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: ${bgColor};
            color: ${textColor};
            line-height: 1.6;
            padding: 40px;
        }
        
        .header {
            text-align: center;
            margin-bottom: 50px;
            border-bottom: 2px solid ${goldColor};
            padding-bottom: 30px;
        }
        
        .logo {
            color: ${goldColor};
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        .tagline {
            color: ${isDigital ? '#666' : '#CCC'};
            font-size: 14px;
            margin-bottom: 30px;
        }
        
        .title {
            color: ${goldColor};
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 15px;
        }
        
        .subtitle {
            color: ${isDigital ? '#555' : '#AAA'};
            font-size: 16px;
            max-width: 600px;
            margin: 0 auto;
        }
        
        .intro {
            background: ${isDigital ? '#F8F9FA' : '#1A1A1A'};
            padding: 30px;
            margin: 40px 0;
            border-left: 4px solid ${goldColor};
            border-radius: 8px;
        }
        
        .tier-section {
            margin: 50px 0;
            page-break-inside: avoid;
        }
        
        .tier-header {
            display: flex;
            align-items: center;
            margin-bottom: 25px;
            padding: 20px;
            background: ${isDigital ? '#F1F3F4' : '#222'};
            border-radius: 12px;
            border: 2px solid ${goldColor};
        }
        
        .tier-icon {
            font-size: 32px;
            margin-right: 15px;
        }
        
        .tier-title {
            color: ${goldColor};
            font-size: 24px;
            font-weight: bold;
        }
        
        .tier-description {
            color: ${isDigital ? '#666' : '#AAA'};
            font-size: 14px;
            margin-top: 5px;
        }
        
        .organizations-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 20px;
        }
        
        .org-card {
            background: ${isDigital ? '#FFFFFF' : '#1A1A1A'};
            border: 1px solid ${isDigital ? '#E5E7EB' : '#444'};
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            transition: all 0.3s ease;
        }
        
        .org-card:hover {
            border-color: ${emeraldColor};
            box-shadow: 0 4px 12px rgba(4, 107, 77, 0.2);
        }
        
        .org-name {
            font-weight: 600;
            color: ${textColor};
            font-size: 16px;
        }
        
        .value-props {
            margin: 50px 0;
            padding: 40px;
            background: ${isDigital ? '#F8F9FA' : '#111'};
            border-radius: 12px;
            border: 1px solid ${goldColor};
        }
        
        .value-props h3 {
            color: ${goldColor};
            font-size: 22px;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .value-list {
            list-style: none;
            padding: 0;
        }
        
        .value-list li {
            padding: 12px 0;
            border-bottom: 1px solid ${isDigital ? '#E5E7EB' : '#333'};
            display: flex;
            align-items: center;
        }
        
        .value-list li:before {
            content: "✓";
            color: ${emeraldColor};
            font-weight: bold;
            margin-right: 12px;
            font-size: 16px;
        }
        
        .cta-section {
            text-align: center;
            margin: 60px 0;
            padding: 40px;
            background: linear-gradient(135deg, ${goldColor}20, ${emeraldColor}20);
            border-radius: 16px;
            border: 2px solid ${goldColor};
        }
        
        .cta-title {
            color: ${goldColor};
            font-size: 26px;
            font-weight: bold;
            margin-bottom: 15px;
        }
        
        .cta-text {
            color: ${textColor};
            font-size: 16px;
            margin-bottom: 25px;
        }
        
        .contact-info {
            background: ${goldColor};
            color: #000;
            padding: 15px 30px;
            border-radius: 8px;
            display: inline-block;
            font-weight: 600;
        }
        
        .footer {
            margin-top: 60px;
            text-align: center;
            padding-top: 30px;
            border-top: 1px solid ${isDigital ? '#E5E7EB' : '#444'};
            color: ${isDigital ? '#666' : '#888'};
            font-size: 12px;
        }
        
        @media print {
            body { font-size: 12px; }
            .tier-section { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">Boutique Family Office™</div>
        <div class="tagline">Healthspan + Wealthspan. One Platform.</div>
        <h1 class="title">Founding 20 — Sports Leagues & Associations</h1>
        <p class="subtitle">A prioritized list of partnerships to accelerate athlete education, player care, and long-term financial outcomes.</p>
    </div>

    <div class="intro">
        <p><strong>Partnership Vision:</strong> BFO unifies healthspan + wealthspan for athlete programs, NIL education, and sustainable financial wellness. Our Founding 20 initiative targets the most influential sports organizations globally, offering co-created modules, enterprise security, and measurable outcomes.</p>
    </div>

    <div class="tier-section">
        <div class="tier-header">
            <span class="tier-icon">🥇</span>
            <div>
                <div class="tier-title">Gold Tier</div>
                <div class="tier-description">Premier partnerships with global reach and maximum impact</div>
            </div>
        </div>
        <div class="organizations-grid">
            ${sportsOrganizations.gold.map(org => `
                <div class="org-card">
                    <div class="org-name">${org}</div>
                </div>
            `).join('')}
        </div>
    </div>

    <div class="tier-section">
        <div class="tier-header">
            <span class="tier-icon">🥈</span>
            <div>
                <div class="tier-title">Silver Tier</div>
                <div class="tier-description">Established leagues and professional tours</div>
            </div>
        </div>
        <div class="organizations-grid">
            ${sportsOrganizations.silver.map(org => `
                <div class="org-card">
                    <div class="org-name">${org}</div>
                </div>
            `).join('')}
        </div>
    </div>

    <div class="tier-section">
        <div class="tier-header">
            <span class="tier-icon">🥉</span>
            <div>
                <div class="tier-title">Bronze Tier</div>
                <div class="tier-description">Growing organizations and strategic enterprises</div>
            </div>
        </div>
        <div class="organizations-grid">
            ${sportsOrganizations.bronze.map(org => `
                <div class="org-card">
                    <div class="org-name">${org}</div>
                </div>
            `).join('')}
        </div>
    </div>

    <div class="value-props">
        <h3>Why Sports Leagues Choose BFO</h3>
        <ul class="value-list">
            <li>NIL & Financial Education: athlete-friendly modules, built with compliance in mind</li>
            <li>Secure Legacy Vault™: documents, permissions, audit trail — enterprise-grade</li>
            <li>SWAG™ Retirement Roadmap: science-based planning for short, mid, and long horizons</li>
            <li>Player engagement + measurable literacy outcomes</li>
            <li>Co-created modules and private program spaces</li>
            <li>National brand, local delivery via licensed advisors</li>
            <li>Multi-tenant RBAC • Audit logging • PII-sanitized analytics</li>
            <li>White-label ready for leagues & player programs</li>
        </ul>
    </div>

    <div class="cta-section">
        <h2 class="cta-title">Schedule Your Preview</h2>
        <p class="cta-text">Be one of the Founding 20. Get concierge onboarding, priority roadmap input, and preferred partnership tier.</p>
        <div class="contact-info">
            📅 Book at: calendly.com/boutique-family-office
        </div>
    </div>

    <div class="footer">
        <p>© 2024 Boutique Family Office™ • Founding 20 Initiative • ${pdfTheme.charAt(0).toUpperCase() + pdfTheme.slice(1)} Version</p>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
    </div>
</body>
</html>`;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={() => generatePDF('print')}
          className="bg-gold text-black hover:bg-gold/90 flex-1"
        >
          <FileText className="h-4 w-4 mr-2" />
          Generate Print PDF
        </Button>
        
        <Button
          onClick={() => generatePDF('digital')}
          variant="outline"
          className="border-gold text-gold hover:bg-gold/10 flex-1"
        >
          <Download className="h-4 w-4 mr-2" />
          Generate Digital PDF
        </Button>
      </div>
      
      <div className="text-sm text-muted-foreground">
        <p><strong>Print PDF:</strong> Black background, optimized for premium printing</p>
        <p><strong>Digital PDF:</strong> White background, optimized for email and digital sharing</p>
      </div>
    </div>
  );
};