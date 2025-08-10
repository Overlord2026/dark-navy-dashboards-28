import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { QrCode, Download, Copy, Link } from 'lucide-react';
import { track } from '@/lib/analytics/track';

interface QRCodeGeneratorProps {
  segment?: string;
  baseUrl?: string;
}

const utmSources = ['email', 'kit', 'print', 'direct'];
const utmMediums = ['header', 'qr', 'cta', 'footer'];
const sportsOrgs = [
  'NFL', 'NBA', 'FIFA', 'UFC', 'MLB', 'Formula1', 'NASCAR', 'PGATour', 'LPGA', 'NHL',
  'MLS', 'USOC', 'IOC', 'ONEChampionship', 'WorldRugby', 'ICC', 'MagicJohnson', 'ARod', 'WADA', 'Paralympic'
];

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ 
  segment = 'sports',
  baseUrl = 'https://my.bfocfo.com/founding20-sports'
}) => {
  const [utmParams, setUtmParams] = useState({
    source: 'email',
    medium: 'qr',
    campaign: 'founding20_sports',
    content: ''
  });

  const [selectedOrg, setSelectedOrg] = useState('NFL');

  const generateURL = (org?: string) => {
    const params = new URLSearchParams({
      utm_source: utmParams.source,
      utm_medium: utmParams.medium,
      utm_campaign: utmParams.campaign,
      utm_content: org || utmParams.content || selectedOrg
    });

    if (org) {
      params.set('org', org);
    }

    return `${baseUrl}?${params.toString()}`;
  };

  const generateQRCode = async (url: string) => {
    // In a real implementation, you would use a QR code library
    // For demo purposes, we'll use a free QR code API
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
    
    track('qr_code_generated', {
      segment,
      org: selectedOrg,
      utm_source: utmParams.source,
      utm_medium: utmParams.medium,
      utm_campaign: utmParams.campaign,
      utm_content: utmParams.content
    });

    return qrApiUrl;
  };

  const downloadQR = async (url: string, filename: string) => {
    const qrImageUrl = await generateQRCode(url);
    
    try {
      const response = await fetch(qrImageUrl);
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);

      track('qr_code_downloaded', {
        segment,
        filename,
        org: selectedOrg
      });
    } catch (error) {
      console.error('Error downloading QR code:', error);
    }
  };

  const copyUrl = async (url: string) => {
    await navigator.clipboard.writeText(url);
    track('url_copied', { segment, url, org: selectedOrg });
  };

  const generateBulkQRs = async () => {
    track('bulk_qr_generation_started', { segment, org_count: sportsOrgs.length });

    // Generate URLs for all organizations
    const qrData = sportsOrgs.map(org => ({
      org,
      url: generateURL(org),
      filename: `qr-${segment}-${org.toLowerCase().replace(/\s+/g, '-')}.png`
    }));

    // In a real implementation, you would create a ZIP file
    // For demo, we'll show the URLs
    console.log('Bulk QR Code Data:', qrData);
    
    // Download each QR code individually (in a real app, you'd bundle them)
    for (const item of qrData) {
      await downloadQR(item.url, item.filename);
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    track('bulk_qr_generation_completed', { segment, org_count: sportsOrgs.length });
  };

  const currentUrl = generateURL();

  return (
    <div className="space-y-6">
      {/* UTM Parameter Configuration */}
      <Card className="bg-black border-gold/30">
        <CardHeader>
          <CardTitle className="text-gold flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            QR Code & UTM Generator
          </CardTitle>
          <CardDescription className="text-white/70">
            Generate trackable QR codes for the Founding 20 Sports campaign
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-white/80">UTM Source</label>
              <Select value={utmParams.source} onValueChange={(value) => setUtmParams(prev => ({ ...prev, source: value }))}>
                <SelectTrigger className="bg-black/50 border-gold/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {utmSources.map(source => (
                    <SelectItem key={source} value={source}>{source}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-white/80">UTM Medium</label>
              <Select value={utmParams.medium} onValueChange={(value) => setUtmParams(prev => ({ ...prev, medium: value }))}>
                <SelectTrigger className="bg-black/50 border-gold/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {utmMediums.map(medium => (
                    <SelectItem key={medium} value={medium}>{medium}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-white/80">Campaign</label>
              <Input
                value={utmParams.campaign}
                onChange={(e) => setUtmParams(prev => ({ ...prev, campaign: e.target.value }))}
                className="bg-black/50 border-gold/30 text-white"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-white/80">UTM Content</label>
              <Input
                value={utmParams.content}
                onChange={(e) => setUtmParams(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Optional - defaults to org name"
                className="bg-black/50 border-gold/30 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Single QR Code Generator */}
      <Card className="bg-black border-gold/30">
        <CardHeader>
          <CardTitle className="text-gold">Single Organization QR Code</CardTitle>
          <CardDescription className="text-white/70">
            Generate a QR code for a specific sports organization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-white/80">Select Organization</label>
            <Select value={selectedOrg} onValueChange={setSelectedOrg}>
              <SelectTrigger className="bg-black/50 border-gold/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sportsOrgs.map(org => (
                  <SelectItem key={org} value={org}>{org}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-white/80">Generated URL</label>
            <div className="flex gap-2 mt-1">
              <Input
                value={currentUrl}
                readOnly
                className="bg-black/50 border-gold/30 text-white font-mono text-sm"
              />
              <Button
                size="sm"
                variant="outline"
                className="border-gold/50 text-gold"
                onClick={() => copyUrl(currentUrl)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => downloadQR(currentUrl, `qr-${segment}-${selectedOrg.toLowerCase()}.png`)}
              className="bg-gold text-black hover:bg-gold/90"
            >
              <Download className="h-4 w-4 mr-2" />
              Download QR Code
            </Button>
            <Button
              variant="outline"
              className="border-gold/50 text-gold"
              onClick={() => window.open(currentUrl, '_blank')}
            >
              <Link className="h-4 w-4 mr-2" />
              Test URL
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk QR Code Generator */}
      <Card className="bg-black border-gold/30">
        <CardHeader>
          <CardTitle className="text-gold">Bulk QR Code Generation</CardTitle>
          <CardDescription className="text-white/70">
            Generate QR codes for all {sportsOrgs.length} sports organizations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {sportsOrgs.map(org => (
              <Badge key={org} variant="outline" className="border-gold/50 text-gold text-xs">
                {org}
              </Badge>
            ))}
          </div>

          <div className="pt-4">
            <Button
              onClick={generateBulkQRs}
              className="bg-gold text-black hover:bg-gold/90 w-full"
              size="lg"
            >
              <Download className="h-5 w-5 mr-2" />
              Generate All {sportsOrgs.length} QR Codes
            </Button>
            <p className="text-xs text-white/60 mt-2">
              This will download individual QR codes for each organization. 
              In production, these would be bundled into a ZIP file.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      <Card className="bg-black border-gold/30">
        <CardHeader>
          <CardTitle className="text-gold">QR Code Preview</CardTitle>
          <CardDescription className="text-white/70">
            Live preview of the QR code for {selectedOrg}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="bg-white p-4 rounded-lg inline-block">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}`}
              alt={`QR Code for ${selectedOrg}`}
              className="w-48 h-48"
            />
          </div>
          <p className="text-sm text-white/60 mt-2">
            Scan this QR code to test the landing page experience
          </p>
        </CardContent>
      </Card>
    </div>
  );
};