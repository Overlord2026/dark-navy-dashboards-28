import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText, Presentation, Image } from 'lucide-react';
import { track } from '@/lib/analytics/track';

interface LeadershipDeckGeneratorProps {
  theme?: 'digital' | 'print' | 'editable';
}

export const LeadershipDeckGenerator: React.FC<LeadershipDeckGeneratorProps> = ({ 
  theme = 'digital' 
}) => {
  
  const generateDeck = async (deckTheme: 'digital' | 'print' | 'editable') => {
    track('deck_generation_started', { 
      theme: deckTheme,
      source: 'leadership_deck_generator' 
    });

    // Generate deck content
    const deckContent = generateDeckContent(deckTheme);
    
    let fileExtension = 'html';
    let mimeType = 'text/html';
    
    if (deckTheme === 'editable') {
      fileExtension = 'pptx';
      mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
    }
    
    // Create blob and download
    const blob = new Blob([deckContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leadership-briefing-deck-${deckTheme}.${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    track('deck_download_completed', { 
      theme: deckTheme,
      filename: `leadership-briefing-deck-${deckTheme}.${fileExtension}`
    });
  };

  const generatePreviewImage = () => {
    track('deck_preview_generated');
    
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 675; // 16:9 aspect ratio
    const ctx = canvas.getContext('2d')!;
    
    // Background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Gold accent
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(0, 0, canvas.width, 8);
    ctx.fillRect(0, canvas.height - 8, canvas.width, 8);
    
    // Title
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 48px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('Leadership Briefing Deck', canvas.width / 2, 150);
    
    // Subtitle
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '32px Inter';
    ctx.fillText('Founding 20 Launch', canvas.width / 2, 200);
    
    // Content sections
    const sections = [
      'Founding 20 Overview',
      'Launch Sequencing Checklist', 
      'Visual Identity Showcase',
      'Brand Guide & Usage',
      'Campaign Mockups'
    ];
    
    ctx.font = '24px Inter';
    ctx.textAlign = 'left';
    sections.forEach((section, index) => {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(`• ${section}`, 100, 300 + (index * 40));
    });
    
    // Footer
    ctx.fillStyle = '#FFD700';
    ctx.font = 'italic 20px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('Boutique Family Office™ • Healthspan + Wealthspan. One Platform.', canvas.width / 2, canvas.height - 50);
    
    // Download
    const link = document.createElement('a');
    link.download = 'leadership-briefing-deck-preview.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const generateDeckContent = (deckTheme: 'digital' | 'print' | 'editable') => {
    const isDigital = deckTheme === 'digital';
    const bgColor = isDigital ? '#FFFFFF' : '#000000';
    const textColor = isDigital ? '#000000' : '#FFFFFF';
    const accentColor = '#FFD700';

    if (deckTheme === 'editable') {
      // For PPTX, we'd return PowerPoint XML structure
      // This is a simplified version - in production you'd use a proper PPTX library
      return `
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <!-- PowerPoint XML structure would go here -->
  <!-- This is a placeholder for the actual PPTX format -->
</p:presentation>`;
    }

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Leadership Briefing Deck — Founding 20 Launch</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
    
    body {
      font-family: 'Inter', sans-serif;
      background-color: ${bgColor};
      color: ${textColor};
      margin: 0;
      padding: 0;
      line-height: 1.6;
    }
    
    .slide {
      width: 100vw;
      height: 100vh;
      padding: 60px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: center;
      page-break-after: always;
    }
    
    .slide-cover {
      background: linear-gradient(135deg, #000000 0%, #046B4D 50%, #000000 100%);
      color: white;
      text-align: center;
    }
    
    .slide-section {
      background-color: ${accentColor};
      color: #000000;
      text-align: center;
    }
    
    .slide-content {
      background-color: ${bgColor};
      color: ${textColor};
    }
    
    h1 {
      font-size: 4rem;
      font-weight: 700;
      margin-bottom: 2rem;
      line-height: 1.2;
    }
    
    h2 {
      font-size: 3rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
      color: ${accentColor};
    }
    
    h3 {
      font-size: 2rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }
    
    .subtitle {
      font-size: 1.5rem;
      opacity: 0.8;
      margin-bottom: 3rem;
    }
    
    .tagline {
      font-size: 1.2rem;
      font-style: italic;
      color: ${accentColor};
      margin-top: 3rem;
    }
    
    .content-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin: 2rem 0;
    }
    
    .content-box {
      background: ${isDigital ? '#F8F9FA' : 'rgba(255,215,0,0.1)'};
      border: 2px solid ${accentColor};
      border-radius: 12px;
      padding: 1.5rem;
    }
    
    .brand-colors {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin: 2rem 0;
    }
    
    .color-swatch {
      width: 100px;
      height: 100px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
    }
    
    @media print {
      .slide {
        page-break-after: always;
        height: 297mm;
        width: 210mm;
      }
    }
  </style>
</head>
<body>
  <!-- Cover Slide -->
  <div class="slide slide-cover">
    <h1>Leadership Briefing Deck</h1>
    <div class="subtitle">Founding 20 Launch</div>
    <div class="tagline">Boutique Family Office™<br>Healthspan + Wealthspan. One Platform.</div>
  </div>

  <!-- Section: Overview -->
  <div class="slide slide-section">
    <h2>Founding 20 Overview</h2>
    <div class="subtitle">Strategic target prioritization across Sports, Longevity, and RIA segments</div>
  </div>

  <!-- Founding 20 Overview Content -->
  <div class="slide slide-content">
    <h2>Founding 20 Strategy</h2>
    <div class="content-grid">
      <div class="content-box">
        <h3>Sports Segment</h3>
        <p>5 Gold Tier: NFL, NBA, FIFA, UFC, MLB</p>
        <p>5 Silver Tier: Formula 1, NASCAR, PGA Tour, LPGA, NHL</p>
        <p>10 Bronze Tier: MLS, USOC, IOC, and others</p>
      </div>
      <div class="content-box">
        <h3>Longevity Segment</h3>
        <p>5 Gold Tier: Tony Robbins, Peter Diamandis, David Sinclair, Andrew Huberman, Dr. Mark Hyman</p>
        <p>5 Silver Tier: Ben Greenfield, Dr. Rhonda Patrick, Peter Attia, Fountain Life, Human Longevity</p>
        <p>10 Bronze Tier: Thorne, Levels, Lifespan.io, and others</p>
      </div>
      <div class="content-box">
        <h3>RIA Segment</h3>
        <p>5 Gold Tier: Crescent Wealth, Mission Wealth, Mercer Advisors, Creative Planning, Edelman Financial Engines</p>
        <p>5 Silver Tier: Carson Group, Fisher Investments, Mariner Wealth, Buckingham, Wealth Enhancement Group</p>
        <p>10 Bronze Tier: Savant Wealth, Plancorp, Brighton Jones, and others</p>
      </div>
    </div>
  </div>

  <!-- Section: Sequencing -->
  <div class="slide slide-section">
    <h2>Launch Sequencing Checklist</h2>
    <div class="subtitle">8-week execution roadmap with clear ownership and milestones</div>
  </div>

  <!-- Sequencing Content -->
  <div class="slide slide-content">
    <h2>Execution Framework</h2>
    <div class="content-grid">
      <div class="content-box">
        <h3>Weeks 1-2: Foundation</h3>
        <p>• Asset creation and approval</p>
        <p>• Email templates and campaigns</p>
        <p>• QR code generation</p>
        <p>• Initial contact research</p>
      </div>
      <div class="content-box">
        <h3>Weeks 3-4: Gold Tier Launch</h3>
        <p>• High-priority target outreach</p>
        <p>• Executive briefing materials</p>
        <p>• Calendly integration</p>
        <p>• Follow-up sequences</p>
      </div>
      <div class="content-box">
        <h3>Weeks 5-8: Scale & Optimize</h3>
        <p>• Silver and Bronze tier rollout</p>
        <p>• Analytics and optimization</p>
        <p>• Partner feedback integration</p>
        <p>• Success story documentation</p>
      </div>
    </div>
  </div>

  <!-- Section: Visual Identity -->
  <div class="slide slide-section">
    <h2>Visual Identity Showcase</h2>
    <div class="subtitle">Brand application across touchpoints and materials</div>
  </div>

  <!-- Visual Identity Content -->
  <div class="slide slide-content">
    <h2>Brand Applications</h2>
    <div class="content-grid">
      <div class="content-box">
        <h3>Digital Touchpoints</h3>
        <p>• App dashboard and UI cards</p>
        <p>• Email headers and templates</p>
        <p>• Landing page hero sections</p>
        <p>• Social media assets</p>
      </div>
      <div class="content-box">
        <h3>Print Materials</h3>
        <p>• PDF cover and section pages</p>
        <p>• Business card integration</p>
        <p>• Kit inserts with QR codes</p>
        <p>• Advisor marketing materials</p>
      </div>
      <div class="content-box">
        <h3>Digital Assets</h3>
        <p>• LinkedIn header graphics</p>
        <p>• Website badge integration</p>
        <p>• Email signature blocks</p>
        <p>• Presentation templates</p>
      </div>
    </div>
  </div>

  <!-- Section: Brand Guide -->
  <div class="slide slide-section">
    <h2>Brand Color & Usage Guide</h2>
    <div class="subtitle">Consistent application of visual identity elements</div>
  </div>

  <!-- Brand Guide Content -->
  <div class="slide slide-content">
    <h2>Brand System</h2>
    
    <h3>Primary Palette</h3>
    <div class="brand-colors">
      <div class="color-swatch" style="background: #000000;">#000000<br>Black</div>
      <div class="color-swatch" style="background: #FFD700; color: #000000;">#FFD700<br>Gold</div>
      <div class="color-swatch" style="background: #FFFFFF; color: #000000; border: 2px solid #000000;">#FFFFFF<br>White</div>
    </div>
    
    <h3>Secondary Palette</h3>
    <div class="brand-colors">
      <div class="color-swatch" style="background: #0A152E;">#0A152E<br>Dark Navy<br>(Longevity)</div>
      <div class="color-swatch" style="background: #046B4D;">#046B4D<br>Emerald<br>(Sports)</div>
      <div class="color-swatch" style="background: #A6192E;">#A6192E<br>Red<br>(RIA)</div>
    </div>
    
    <div class="content-box" style="margin-top: 2rem;">
      <h3>Typography & Iconography</h3>
      <p>• Headings: Inter Serif (formal documents) / Inter Sans (digital)</p>
      <p>• Body text: Inter Sans for all applications</p>
      <p>• Icons: Lucide React icon library for consistency</p>
      <p>• Logo: Boutique Family Office™ with registered trademark</p>
    </div>
  </div>

  <!-- Section: Mockups -->
  <div class="slide slide-section">
    <h2>Campaign Mockups</h2>
    <div class="subtitle">Real-world application examples across all segments</div>
  </div>

  <!-- Mockups Content -->
  <div class="slide slide-content">
    <h2>Campaign Materials</h2>
    <div class="content-grid">
      <div class="content-box">
        <h3>Sports Campaign</h3>
        <p>• ROI-ranked league targeting</p>
        <p>• NIL education positioning</p>
        <p>• Player care messaging</p>
        <p>• Partnership value props</p>
      </div>
      <div class="content-box">
        <h3>Longevity Campaign</h3>
        <p>• Healthspan experts focus</p>
        <p>• Scientific credibility</p>
        <p>• Innovation partnerships</p>
        <p>• Research collaboration</p>
      </div>
      <div class="content-box">
        <h3>RIA Campaign</h3>
        <p>• Wealth management focus</p>
        <p>• Advisor enablement</p>
        <p>• Client family solutions</p>
        <p>• Technology integration</p>
      </div>
    </div>
  </div>

  <!-- Closing Slide -->
  <div class="slide slide-cover">
    <h2>Ready to Launch</h2>
    <div class="subtitle">Visit my.bfocfo.com/founding20 for live resources</div>
    <div class="tagline">Boutique Family Office™<br>Healthspan + Wealthspan. One Platform.</div>
  </div>
</body>
</html>`;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-black border-gold/30">
        <CardHeader>
          <CardTitle className="text-gold flex items-center gap-2">
            <Presentation className="h-5 w-5" />
            Leadership Briefing Deck Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-white/70">
            Generate executive-level presentation covering the complete Founding 20 strategy, 
            sequencing checklist, brand guidelines, and campaign mockups.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              onClick={() => generateDeck('digital')}
              className="bg-black text-white border border-gold hover:bg-gray-900 h-auto p-4 flex flex-col items-center gap-2"
            >
              <FileText className="h-6 w-6" />
              <div className="text-center">
                <div className="font-semibold">Digital PDF</div>
                <div className="text-xs opacity-70">Web & email sharing</div>
              </div>
            </Button>
            
            <Button 
              onClick={() => generateDeck('print')}
              variant="outline"
              className="border-gold text-gold hover:bg-gold/10 h-auto p-4 flex flex-col items-center gap-2"
            >
              <Download className="h-6 w-6" />
              <div className="text-center">
                <div className="font-semibold">Print PDF</div>
                <div className="text-xs opacity-70">Physical materials</div>
              </div>
            </Button>
            
            <Button 
              onClick={() => generateDeck('editable')}
              variant="outline"
              className="border-gold text-gold hover:bg-gold/10 h-auto p-4 flex flex-col items-center gap-2"
            >
              <Presentation className="h-6 w-6" />
              <div className="text-center">
                <div className="font-semibold">PowerPoint</div>
                <div className="text-xs opacity-70">Editable format</div>
              </div>
            </Button>
            
            <Button 
              onClick={generatePreviewImage}
              variant="outline"
              className="border-gold text-gold hover:bg-gold/10 h-auto p-4 flex flex-col items-center gap-2"
            >
              <Image className="h-6 w-6" />
              <div className="text-center">
                <div className="font-semibold">Preview PNG</div>
                <div className="text-xs opacity-70">Cover image</div>
              </div>
            </Button>
          </div>
          
          <div className="bg-gold/10 border border-gold/30 rounded-lg p-4">
            <h4 className="font-semibold text-gold mb-2">Deck Contents</h4>
            <ul className="text-sm text-white/70 space-y-1">
              <li>• Founding 20 Overview (ROI-ranked targets)</li>
              <li>• Launch Sequencing Checklist (8-week roadmap)</li>
              <li>• Visual Identity Showcase (brand applications)</li>
              <li>• Brand Color & Usage Guide (design system)</li>
              <li>• Campaign Mockups (all segments)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};