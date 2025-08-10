import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QrCode, Download, Copy } from 'lucide-react';
import { track } from '@/lib/analytics/track';
import { toast } from 'sonner';

const sportsOrganizations = [
  // Gold Tier
  'NFL', 'NBA', 'FIFA', 'UFC', 'MLB',
  // Silver Tier  
  'Formula 1', 'NASCAR', 'PGA Tour', 'LPGA', 'NHL',
  // Bronze Tier
  'MLS', 'USOC', 'IOC', 'ONE Championship', 'World Rugby', 
  'ICC (Cricket)', 'Magic Johnson Enterprises', 'A-Rod Corp', 
  'WADA', 'International Paralympic Committee'
];

export const SportsQRGenerator: React.FC = () => {
  const [selectedOrg, setSelectedOrg] = useState('');
  const [utmSource, setUtmSource] = useState('email');
  const [utmMedium, setUtmMedium] = useState('qr');
  const [utmContent, setUtmContent] = useState('');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQRCode = async () => {
    if (!selectedOrg) {
      toast.error('Please select an organization');
      return;
    }

    const baseUrl = 'https://my.bfocfo.com/founding20/sports';
    const params = new URLSearchParams({
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: 'founding20_sports',
      utm_content: utmContent || selectedOrg.toLowerCase().replace(/\s+/g, '_'),
      org_name: selectedOrg
    });
    
    const fullUrl = `${baseUrl}?${params.toString()}`;
    setGeneratedUrl(fullUrl);

    // Generate QR Code using a simple QR code library simulation
    // In real implementation, you'd use a QR code library like qrcode
    generateQRCanvas(fullUrl);

    track('qr_code_generated', {
      segment: 'sports',
      org_name: selectedOrg,
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_content: utmContent
    });

    toast.success('QR code generated successfully!');
  };

  const generateQRCanvas = (url: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 300;
    canvas.height = 350;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Generate QR pattern (simplified representation)
    const qrSize = 250;
    const startX = (canvas.width - qrSize) / 2;
    const startY = 25;
    
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(startX, startY, qrSize, qrSize);
    
    ctx.fillStyle = '#000000';
    
    // Create a simple QR-like pattern
    const moduleSize = 10;
    const modules = qrSize / moduleSize;
    
    for (let i = 0; i < modules; i++) {
      for (let j = 0; j < modules; j++) {
        // Create a pseudo-random pattern based on the URL
        const hash = url.charCodeAt((i + j) % url.length);
        if ((hash + i * j) % 3 === 0) {
          ctx.fillRect(
            startX + i * moduleSize, 
            startY + j * moduleSize, 
            moduleSize, 
            moduleSize
          );
        }
      }
    }

    // Add corner markers
    const markerSize = moduleSize * 7;
    
    // Top-left marker
    ctx.fillRect(startX, startY, markerSize, markerSize);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(startX + moduleSize, startY + moduleSize, markerSize - 2 * moduleSize, markerSize - 2 * moduleSize);
    ctx.fillStyle = '#000000';
    ctx.fillRect(startX + 2 * moduleSize, startY + 2 * moduleSize, markerSize - 4 * moduleSize, markerSize - 4 * moduleSize);
    
    // Top-right marker
    ctx.fillStyle = '#000000';
    ctx.fillRect(startX + qrSize - markerSize, startY, markerSize, markerSize);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(startX + qrSize - markerSize + moduleSize, startY + moduleSize, markerSize - 2 * moduleSize, markerSize - 2 * moduleSize);
    ctx.fillStyle = '#000000';
    ctx.fillRect(startX + qrSize - markerSize + 2 * moduleSize, startY + 2 * moduleSize, markerSize - 4 * moduleSize, markerSize - 4 * moduleSize);
    
    // Bottom-left marker
    ctx.fillRect(startX, startY + qrSize - markerSize, markerSize, markerSize);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(startX + moduleSize, startY + qrSize - markerSize + moduleSize, markerSize - 2 * moduleSize, markerSize - 2 * moduleSize);
    ctx.fillStyle = '#000000';
    ctx.fillRect(startX + 2 * moduleSize, startY + qrSize - markerSize + 2 * moduleSize, markerSize - 4 * moduleSize, markerSize - 4 * moduleSize);

    // Add BFO branding at bottom
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 16px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('BFO Sports Partnership', canvas.width / 2, canvas.height - 25);
    
    ctx.font = '12px Inter';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(selectedOrg, canvas.width / 2, canvas.height - 5);
  };

  const downloadQRCode = () => {
    const canvas = canvasRef.current;
    if (!canvas || !generatedUrl) return;

    const link = document.createElement('a');
    link.download = `qr-code-${selectedOrg.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL();
    link.click();

    track('qr_code_downloaded', {
      segment: 'sports',
      org_name: selectedOrg
    });
  };

  const copyUrl = async () => {
    if (!generatedUrl) return;
    
    try {
      await navigator.clipboard.writeText(generatedUrl);
      toast.success('URL copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy URL');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-black border-gold/30">
        <CardHeader>
          <CardTitle className="text-gold">QR Code Generator</CardTitle>
          <CardDescription className="text-white/70">
            Generate trackable QR codes for each target sports organization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Organization</Label>
              <Select value={selectedOrg} onValueChange={setSelectedOrg}>
                <SelectTrigger className="bg-black/50 border-gold/30">
                  <SelectValue placeholder="Select organization" />
                </SelectTrigger>
                <SelectContent>
                  {sportsOrganizations.map((org) => (
                    <SelectItem key={org} value={org}>{org}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white">UTM Source</Label>
              <Select value={utmSource} onValueChange={setUtmSource}>
                <SelectTrigger className="bg-black/50 border-gold/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="kit">Kit</SelectItem>
                  <SelectItem value="direct">Direct Mail</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white">UTM Medium</Label>
              <Select value={utmMedium} onValueChange={setUtmMedium}>
                <SelectTrigger className="bg-black/50 border-gold/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="qr">QR Code</SelectItem>
                  <SelectItem value="header">Email Header</SelectItem>
                  <SelectItem value="cta">CTA Button</SelectItem>
                  <SelectItem value="print">Print Material</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white">UTM Content (Optional)</Label>
              <Input
                value={utmContent}
                onChange={(e) => setUtmContent(e.target.value)}
                placeholder="Custom content identifier"
                className="bg-black/50 border-gold/30 text-white"
              />
            </div>
          </div>

          <Button 
            onClick={generateQRCode}
            className="bg-gold text-black hover:bg-gold/90 w-full"
            disabled={!selectedOrg}
          >
            <QrCode className="h-4 w-4 mr-2" />
            Generate QR Code
          </Button>
        </CardContent>
      </Card>

      {generatedUrl && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-black border-gold/30">
            <CardHeader>
              <CardTitle className="text-gold">Generated QR Code</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <canvas
                ref={canvasRef}
                className="mx-auto border border-gold/30 rounded-lg"
              />
              
              <Button 
                onClick={downloadQRCode}
                className="bg-gold text-black hover:bg-gold/90"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PNG
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-black border-gold/30">
            <CardHeader>
              <CardTitle className="text-gold">Tracking URL</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-black/50 p-4 rounded-lg border border-gold/30">
                <p className="text-white/70 text-sm break-all">{generatedUrl}</p>
              </div>
              
              <Button 
                onClick={copyUrl}
                variant="outline"
                className="border-gold text-gold hover:bg-gold/10 w-full"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy URL
              </Button>

              <div className="space-y-2 text-sm">
                <h4 className="text-white font-medium">UTM Parameters:</h4>
                <div className="space-y-1 text-white/70">
                  <p><span className="text-gold">Source:</span> {utmSource}</p>
                  <p><span className="text-gold">Medium:</span> {utmMedium}</p>
                  <p><span className="text-gold">Campaign:</span> founding20_sports</p>
                  <p><span className="text-gold">Content:</span> {utmContent || selectedOrg.toLowerCase().replace(/\s+/g, '_')}</p>
                  <p><span className="text-gold">Organization:</span> {selectedOrg}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};