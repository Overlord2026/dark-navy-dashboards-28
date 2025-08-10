import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, Image, Share2 } from 'lucide-react';
import { track } from '@/lib/analytics/track';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface OnePageOverviewProps {
  format: 'pdf' | 'png';
  theme: 'print' | 'digital';
}

const segmentData = {
  sports: {
    color: '#046B4D',
    goldTier: ['NFL', 'NBA', 'FIFA', 'UFC', 'MLB'],
    silverTier: ['Formula 1', 'NASCAR', 'PGA Tour', 'LPGA', 'NHL'],
    bronzeTier: ['MLS', 'USOC', 'IOC', 'ONE Championship', 'World Rugby', 'ICC (Cricket)', 'Magic Johnson Enterprises', 'A-Rod Corp', 'WADA', 'International Paralympic Committee']
  },
  longevity: {
    color: '#0A152E',
    goldTier: ['Tony Robbins', 'Peter Diamandis', 'David Sinclair', 'Andrew Huberman', 'Dr. Mark Hyman'],
    silverTier: ['Ben Greenfield', 'Dr. Rhonda Patrick', 'Peter Attia', 'Fountain Life', 'Human Longevity'],
    bronzeTier: ['Thorne', 'Levels', 'Lifespan.io', 'Bryan Johnson', 'Precision Health Alliance', 'Chris Hemsworth', 'WHO Healthy Ageing', 'Blue Zones', 'Bupa', 'Mayo Clinic']
  },
  ria: {
    color: '#A6192E',
    goldTier: ['Crescent Wealth', 'Mission Wealth', 'Mercer Advisors', 'Creative Planning', 'Edelman Financial Engines'],
    silverTier: ['Carson Group', 'Fisher Investments', 'Mariner Wealth', 'Buckingham', 'Wealth Enhancement Group'],
    bronzeTier: ['Savant Wealth', 'Plancorp', 'Brighton Jones', 'Rebalance', 'Facet', 'Colony', 'EP Wealth', 'Summitry', 'Beacon Pointe', 'Laird Norton']
  }
};

export const OnePageOverviewGenerator: React.FC<OnePageOverviewProps> = ({ format, theme }) => {
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateAsset = async () => {
    setLoading(true);
    
    try {
      track('overview_generation_started', { format, theme });
      
      if (format === 'pdf') {
        await generatePDF();
      } else {
        await generatePNG();
      }

      // Track analytics
      await supabase.from('overview_analytics').insert({
        segment: 'all',
        action: `${format}_generated`,
        utm_source: 'admin',
        utm_medium: 'generator',
        utm_campaign: 'founding20_overview'
      });

      track('overview_generation_completed', { format, theme });
      toast.success(`${format.toUpperCase()} generated successfully!`);
    } catch (error) {
      console.error('Error generating asset:', error);
      toast.error('Failed to generate asset');
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    const content = generateOverviewHTML(theme);
    
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `founding20-overview-${theme}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generatePNG = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size for high-quality output
    canvas.width = 1200;
    canvas.height = 1600;

    const isDigital = theme === 'digital';
    const bgColor = isDigital ? '#FFFFFF' : '#000000';
    const textColor = isDigital ? '#000000' : '#FFFFFF';
    const goldColor = '#FFD700';

    // Clear canvas
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Header
    ctx.fillStyle = goldColor;
    ctx.font = 'bold 32px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('Boutique Family Office™', canvas.width / 2, 60);
    
    ctx.font = '16px Inter';
    ctx.fillStyle = isDigital ? '#666' : '#CCC';
    ctx.fillText('Healthspan + Wealthspan. One Platform.', canvas.width / 2, 90);

    ctx.fillStyle = goldColor;
    ctx.font = 'bold 28px Inter';
    ctx.fillText('Founding 20 Overview — Sports | Longevity | RIA', canvas.width / 2, 140);

    ctx.font = '14px Inter';
    ctx.fillStyle = textColor;
    ctx.fillText('A strategic snapshot of the top 20 targets in each segment, ROI-ranked and color-coded.', canvas.width / 2, 170);

    // Draw three columns
    const columnWidth = 360;
    const columnHeight = 1200;
    const startY = 200;
    const segments = ['sports', 'longevity', 'ria'] as const;
    const segmentTitles = ['🏆 Sports', '🧬 Longevity', '💼 RIA'];
    
    segments.forEach((segment, index) => {
      const x = 40 + (index * 380);
      const data = segmentData[segment];
      
      // Column background
      ctx.fillStyle = isDigital ? '#F8F9FA' : '#1A1A1A';
      ctx.fillRect(x, startY, columnWidth, columnHeight);
      
      // Column border
      ctx.strokeStyle = data.color;
      ctx.lineWidth = 3;
      ctx.strokeRect(x, startY, columnWidth, columnHeight);
      
      // Column header
      ctx.fillStyle = data.color;
      ctx.fillRect(x, startY, columnWidth, 60);
      
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 20px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(segmentTitles[index], x + columnWidth / 2, startY + 35);
      
      let currentY = startY + 80;
      
      // Gold tier
      ctx.fillStyle = goldColor;
      ctx.font = 'bold 16px Inter';
      ctx.fillText('🥇 Gold Tier', x + columnWidth / 2, currentY);
      currentY += 30;
      
      data.goldTier.forEach(org => {
        ctx.fillStyle = textColor;
        ctx.font = '12px Inter';
        ctx.fillText(org, x + columnWidth / 2, currentY);
        currentY += 20;
      });
      
      currentY += 20;
      
      // Silver tier
      ctx.fillStyle = '#C0C0C0';
      ctx.font = 'bold 16px Inter';
      ctx.fillText('🥈 Silver Tier', x + columnWidth / 2, currentY);
      currentY += 30;
      
      data.silverTier.forEach(org => {
        ctx.fillStyle = textColor;
        ctx.font = '12px Inter';
        ctx.fillText(org, x + columnWidth / 2, currentY);
        currentY += 20;
      });
      
      currentY += 20;
      
      // Bronze tier
      ctx.fillStyle = '#CD7F32';
      ctx.font = 'bold 16px Inter';
      ctx.fillText('🥉 Bronze Tier', x + columnWidth / 2, currentY);
      currentY += 30;
      
      data.bronzeTier.slice(0, 10).forEach(org => { // Limit for space
        ctx.fillStyle = textColor;
        ctx.font = '10px Inter';
        ctx.fillText(org.length > 25 ? org.substring(0, 22) + '...' : org, x + columnWidth / 2, currentY);
        currentY += 18;
      });
      
      // QR code placeholder
      const qrSize = 80;
      const qrX = x + (columnWidth - qrSize) / 2;
      const qrY = startY + columnHeight - 120;
      
      ctx.fillStyle = textColor;
      ctx.fillRect(qrX, qrY, qrSize, qrSize);
      
      ctx.fillStyle = bgColor;
      ctx.font = '10px Inter';
      ctx.fillText('QR CODE', qrX + qrSize / 2, qrY + qrSize / 2);
      
      ctx.fillStyle = textColor;
      ctx.font = '10px Inter';
      ctx.fillText('Scan for full PDF', x + columnWidth / 2, qrY + qrSize + 15);
    });

    // Footer
    ctx.fillStyle = goldColor;
    ctx.font = 'bold 16px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('Visit my.bfocfo.com/founding20 to explore all segments', canvas.width / 2, canvas.height - 40);

    // Download PNG
    const link = document.createElement('a');
    link.download = `founding20-overview-${theme}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const generateOverviewHTML = (pdfTheme: 'print' | 'digital'): string => {
    const isDigital = pdfTheme === 'digital';
    const bgColor = isDigital ? '#FFFFFF' : '#000000';
    const textColor = isDigital ? '#000000' : '#FFFFFF';
    const goldColor = '#FFD700';

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Founding 20 Overview — Sports | Longevity | RIA</title>
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
            line-height: 1.4;
            padding: 40px;
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
        }
        
        .logo {
            color: ${goldColor};
            font-size: 36px;
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
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 15px;
        }
        
        .subtitle {
            color: ${isDigital ? '#555' : '#AAA'};
            font-size: 16px;
        }
        
        .overview-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 30px;
            margin: 50px 0;
        }
        
        .segment-column {
            border: 3px solid;
            border-radius: 16px;
            overflow: hidden;
            background: ${isDigital ? '#F8F9FA' : '#1A1A1A'};
        }
        
        .sports { border-color: #046B4D; }
        .longevity { border-color: #0A152E; }
        .ria { border-color: #A6192E; }
        
        .segment-header {
            padding: 20px;
            color: white;
            text-align: center;
            font-size: 24px;
            font-weight: bold;
        }
        
        .sports .segment-header { background: #046B4D; }
        .longevity .segment-header { background: #0A152E; }
        .ria .segment-header { background: #A6192E; }
        
        .segment-content {
            padding: 30px 20px;
        }
        
        .tier {
            margin-bottom: 30px;
        }
        
        .tier-title {
            font-weight: bold;
            font-size: 18px;
            margin-bottom: 15px;
            text-align: center;
        }
        
        .gold { color: ${goldColor}; }
        .silver { color: #C0C0C0; }
        .bronze { color: #CD7F32; }
        
        .tier-list {
            list-style: none;
            padding: 0;
        }
        
        .tier-list li {
            padding: 5px 0;
            text-align: center;
            font-size: 14px;
            border-bottom: 1px solid ${isDigital ? '#E5E7EB' : '#333'};
        }
        
        .tier-list li:last-child {
            border-bottom: none;
        }
        
        .qr-section {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid ${isDigital ? '#E5E7EB' : '#444'};
        }
        
        .qr-placeholder {
            width: 80px;
            height: 80px;
            background: ${textColor};
            margin: 0 auto 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            color: ${bgColor};
            font-size: 10px;
            font-weight: bold;
        }
        
        .qr-text {
            font-size: 12px;
            color: ${isDigital ? '#666' : '#AAA'};
        }
        
        .footer {
            text-align: center;
            margin-top: 60px;
            padding-top: 30px;
            border-top: 2px solid ${goldColor};
        }
        
        .footer-cta {
            color: ${goldColor};
            font-size: 18px;
            font-weight: bold;
        }
        
        @media print {
            body { 
                font-size: 12px; 
                padding: 20px;
            }
            .overview-grid { gap: 20px; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">Boutique Family Office™</div>
        <div class="tagline">Healthspan + Wealthspan. One Platform.</div>
        <h1 class="title">Founding 20 Overview — Sports | Longevity | RIA</h1>
        <p class="subtitle">A strategic snapshot of the top 20 targets in each segment, ROI-ranked and color-coded.</p>
    </div>

    <div class="overview-grid">
        ${Object.entries(segmentData).map(([segment, data]) => `
        <div class="segment-column ${segment}">
            <div class="segment-header">
                ${segment === 'sports' ? '🏆' : segment === 'longevity' ? '🧬' : '💼'} ${segment.charAt(0).toUpperCase() + segment.slice(1)}
            </div>
            <div class="segment-content">
                <div class="tier">
                    <div class="tier-title gold">🥇 Gold Tier</div>
                    <ul class="tier-list">
                        ${data.goldTier.map(org => `<li>${org}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="tier">
                    <div class="tier-title silver">🥈 Silver Tier</div>
                    <ul class="tier-list">
                        ${data.silverTier.map(org => `<li>${org}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="tier">
                    <div class="tier-title bronze">🥉 Bronze Tier</div>
                    <ul class="tier-list">
                        ${data.bronzeTier.map(org => `<li>${org}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="qr-section">
                    <div class="qr-placeholder">QR CODE</div>
                    <div class="qr-text">Scan for full ${segment} PDF</div>
                </div>
            </div>
        </div>
        `).join('')}
    </div>

    <div class="footer">
        <div class="footer-cta">Visit my.bfocfo.com/founding20 to explore all segments</div>
    </div>
</body>
</html>`;
  };

  return (
    <Card className="bg-black border-gold/30">
      <CardHeader>
        <CardTitle className="text-gold flex items-center gap-2">
          {format === 'pdf' ? <FileText className="h-5 w-5" /> : <Image className="h-5 w-5" />}
          One-Page Overview Generator
        </CardTitle>
        <CardDescription className="text-white/70">
          Generate {format.toUpperCase()} overview of all Founding 20 segments ({theme} theme)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        
        <Button
          onClick={generateAsset}
          disabled={loading}
          className="bg-gold text-black hover:bg-gold/90 w-full"
        >
          {loading ? (
            'Generating...'
          ) : (
            <>
              {format === 'pdf' ? <Download className="h-4 w-4 mr-2" /> : <Image className="h-4 w-4 mr-2" />}
              Generate {format.toUpperCase()} ({theme})
            </>
          )}
        </Button>

        <div className="text-sm text-white/70 space-y-1">
          <p><strong>Includes:</strong> All 3 segments in side-by-side columns</p>
          <p><strong>Features:</strong> QR codes for full PDFs, tier-based color coding</p>
          <p><strong>Output:</strong> {format === 'pdf' ? 'HTML file (print to PDF)' : 'High-resolution PNG'}</p>
        </div>
      </CardContent>
    </Card>
  );
};