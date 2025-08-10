import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, QrCode } from 'lucide-react';
import { track } from '@/lib/analytics/track';
import { toast } from 'sonner';

const segmentData = {
  sports: {
    color: '#046B4D',
    tier_1: ["NFL", "NBA", "FIFA", "UFC", "MLB"],
    tier_2: ["Formula 1", "NASCAR", "PGA Tour", "LPGA", "NHL"],
    tier_3: ["MLS", "USOC", "IOC", "ONE Championship", "World Rugby"],
    description: "Partner with sports leagues for athlete financial wellness and NIL education"
  },
  longevity: {
    color: '#0A152E',
    tier_1: ["Tony Robbins", "Peter Diamandis", "David Sinclair", "Andrew Huberman", "Dr. Mark Hyman"],
    tier_2: ["Ben Greenfield", "Dr. Rhonda Patrick", "Peter Attia", "Fountain Life", "Human Longevity"],
    tier_3: ["Thorne", "Levels", "Lifespan.io", "Bryan Johnson", "Precision Health Alliance"],
    description: "Integrate healthspan research with wealth management for longevity optimization"
  },
  ria: {
    color: '#A6192E',
    tier_1: ["Crescent Wealth", "Mission Wealth", "Mercer Advisors", "Creative Planning", "Edelman Financial Engines"],
    tier_2: ["Carson Group", "Fisher Investments", "Mariner Wealth", "Buckingham", "Wealth Enhancement Group"],
    tier_3: ["Savant Wealth", "Plancorp", "Brighton Jones", "Rebalance", "Facet"],
    description: "Enhance RIA practices with integrated healthspan + wealthspan solutions"
  }
};

export const OnepageOverviewGenerator: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewMode, setPreviewMode] = useState<'pdf' | 'png' | null>(null);

  const generatePDF = async (format: 'print' | 'digital') => {
    setIsGenerating(true);
    try {
      track('onepage_overview_pdf_generated', { format });
      
      // Generate the one-page overview PDF
      // This would typically call a service to generate the PDF
      toast.success(`${format} PDF generated successfully`);
      
      // Simulate file download
      const link = document.createElement('a');
      link.href = `#onepage_overview_${format}.pdf`;
      link.download = `founding20_overview_${format}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  const generatePNG = async () => {
    setIsGenerating(true);
    try {
      track('onepage_overview_png_generated');
      
      // Generate PNG preview
      toast.success('PNG preview generated successfully');
      
      // Simulate file download
      const link = document.createElement('a');
      link.href = '#onepage_overview_digital.png';
      link.download = 'founding20_overview_preview.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Error generating PNG:', error);
      toast.error('Failed to generate PNG');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateQRCodes = async () => {
    track('onepage_overview_qr_generated');
    toast.info('QR code generation functionality coming soon');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gold">One-Page Overview Generator</h2>
          <p className="text-white/70">Generate the Founding 20 overview with all segments and QR codes</p>
        </div>
      </div>

      {/* Preview Section */}
      <Card className="bg-black border-gold/30">
        <CardHeader>
          <CardTitle className="text-gold">Preview: Founding 20 Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-white text-black p-8 rounded-lg">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2" style={{ color: '#FFD700' }}>
                Founding 20 Overview
              </h1>
              <p className="text-lg text-gray-700">
                Sports | Longevity | RIA
              </p>
              <p className="text-sm text-gray-600 mt-2">
                ROI-ranked targets for Boutique Family Office™ partnership strategy
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {Object.entries(segmentData).map(([segment, data]) => (
                <div key={segment} className="space-y-4">
                  <div className="text-center">
                    <div 
                      className="w-full h-2 rounded-full mb-3"
                      style={{ backgroundColor: data.color }}
                    />
                    <h2 className="text-xl font-bold mb-2 capitalize" style={{ color: data.color }}>
                      {segment}
                    </h2>
                    <p className="text-xs text-gray-600 mb-4">
                      {data.description}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-sm mb-1" style={{ color: '#FFD700' }}>
                        TIER 1 (Gold)
                      </h3>
                      <div className="space-y-1">
                        {data.tier_1.map((item, idx) => (
                          <div key={idx} className="text-xs p-1 bg-yellow-50 rounded border-l-2 border-yellow-500">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-sm mb-1 text-gray-600">
                        TIER 2 (Silver)
                      </h3>
                      <div className="space-y-1">
                        {data.tier_2.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="text-xs p-1 bg-gray-50 rounded border-l-2 border-gray-400">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-sm mb-1 text-orange-600">
                        TIER 3 (Bronze)
                      </h3>
                      <div className="space-y-1">
                        {data.tier_3.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="text-xs p-1 bg-orange-50 rounded border-l-2 border-orange-500">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-center pt-2">
                      <div className="w-16 h-16 bg-black mx-auto rounded flex items-center justify-center">
                        <QrCode className="h-8 w-8 text-white" />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Scan for full {segment} PDF
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-sm font-bold" style={{ color: '#FFD700' }}>
                  Boutique Family Office™
                </span>
              </div>
              <p className="text-xs text-gray-600">
                Healthspan + Wealthspan. One Platform.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Visit my.bfocfo.com/founding20 for live resources
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generation Controls */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-black border-gold/30">
          <CardContent className="p-6 text-center">
            <Button
              onClick={() => generatePDF('print')}
              disabled={isGenerating}
              className="w-full bg-gold text-black hover:bg-gold/90 mb-2"
            >
              <Download className="mr-2 h-4 w-4" />
              Print PDF
            </Button>
            <p className="text-xs text-white/70">
              High-res for printing
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black border-gold/30">
          <CardContent className="p-6 text-center">
            <Button
              onClick={() => generatePDF('digital')}
              disabled={isGenerating}
              className="w-full bg-gold text-black hover:bg-gold/90 mb-2"
            >
              <Download className="mr-2 h-4 w-4" />
              Digital PDF
            </Button>
            <p className="text-xs text-white/70">
              Optimized for email/web
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black border-gold/30">
          <CardContent className="p-6 text-center">
            <Button
              onClick={generatePNG}
              disabled={isGenerating}
              variant="outline"
              className="w-full border-gold text-gold hover:bg-gold/10 mb-2"
            >
              <Eye className="mr-2 h-4 w-4" />
              PNG Preview
            </Button>
            <p className="text-xs text-white/70">
              Social media image
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black border-gold/30">
          <CardContent className="p-6 text-center">
            <Button
              onClick={generateQRCodes}
              disabled={isGenerating}
              variant="outline"
              className="w-full border-gold text-gold hover:bg-gold/10 mb-2"
            >
              <QrCode className="mr-2 h-4 w-4" />
              QR Codes
            </Button>
            <p className="text-xs text-white/70">
              Individual segment codes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Asset Landing Page Info */}
      <Card className="bg-black border-gold/30">
        <CardHeader>
          <CardTitle className="text-gold">Asset Landing Page</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-white/70">
            <p><strong>URL:</strong> /founding20/overview</p>
            <p><strong>SEO Title:</strong> Founding 20 Overview — Sports | Longevity | RIA | Boutique Family Office™</p>
            <p><strong>Description:</strong> Strategic overview of top 20 targets in each segment, ROI-ranked and ready for partnership outreach.</p>
            <div className="flex gap-2 mt-4">
              <Badge className="bg-emerald-500/20 text-emerald-400">Sports QR</Badge>
              <Badge className="bg-blue-500/20 text-blue-400">Longevity QR</Badge>
              <Badge className="bg-red-500/20 text-red-400">RIA QR</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};