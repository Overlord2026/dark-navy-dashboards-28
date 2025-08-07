import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, Image, Video, Globe, Copy, Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface PressAsset {
  id: string;
  title: string;
  type: 'release' | 'image' | 'video' | 'doc' | 'template';
  language: string;
  size?: string;
  format?: string;
  url?: string;
  description?: string;
}

const PressKitManager: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [customMessage, setCustomMessage] = useState('');

  const pressAssets: PressAsset[] = [
    {
      id: '1',
      title: 'Global Launch Press Release',
      type: 'release',
      language: 'en',
      description: 'Official announcement of BFOCFO global marketplace launch'
    },
    {
      id: '2',
      title: 'BFOCFO Logo Package',
      type: 'image',
      language: 'all',
      size: '2.4 MB',
      format: 'PNG, SVG',
      description: 'High-resolution logos in various formats'
    },
    {
      id: '3',
      title: 'Founder Interview - Tony Gomes',
      type: 'video',
      language: 'en',
      size: '45 MB',
      format: 'MP4',
      description: 'Executive interview discussing vision and market opportunity'
    },
    {
      id: '4',
      title: 'Platform Demo Video',
      type: 'video',
      language: 'en',
      size: '128 MB',
      format: 'MP4',
      description: 'Full platform walkthrough and feature demonstration'
    },
    {
      id: '5',
      title: 'Company Fact Sheet',
      type: 'doc',
      language: 'en',
      size: '1.2 MB',
      format: 'PDF',
      description: 'Key statistics, milestones, and company information'
    },
    {
      id: '6',
      title: 'Email Template - Editorial Invite',
      type: 'template',
      language: 'en',
      description: 'Customizable email template for media outreach'
    }
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' }
  ];

  const getAssetIcon = (type: PressAsset['type']) => {
    switch (type) {
      case 'release': return <FileText className="h-5 w-5" />;
      case 'image': return <Image className="h-5 w-5" />;
      case 'video': return <Video className="h-5 w-5" />;
      case 'doc': return <FileText className="h-5 w-5" />;
      case 'template': return <Copy className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const handleDownload = (asset: PressAsset) => {
    toast.success(`Downloading ${asset.title}...`);
    // Implement download logic
  };

  const handleCopyTemplate = (asset: PressAsset) => {
    const template = getEmailTemplate();
    navigator.clipboard.writeText(template);
    toast.success('Template copied to clipboard');
  };

  const getEmailTemplate = () => {
    return `Subject: [VIP Preview] The Next Generation Family Office Marketplace—Global Launch Invitation

Hi [Editor's Name],

You've been selected as one of the first 100 global leaders in financial and family office journalism to receive VIP access to the new **Boutique Family Office Marketplace™**—the world's first AI-enabled platform uniting wealth, health, compliance, and legacy under one roof.

Why cover us?
- *First-of-its-kind*: Integrates real financial planning, healthspan, compliance, and AI tools for families and professionals
- *Global impact*: Launching simultaneously in U.S., Canada, U.K., and select international markets
- *VIP experience*: Custom invite with a pre-built profile for you and your publication
- *No sales pitch*: Just world-class technology built for real families and professionals
- *Access to Founders*: Schedule an interview with Tony Gomes and CTO Pedro (AI)

🎉 **Secure your VIP profile now**: [Magic Link]  
📞 **Schedule an interview**: [Booking Link]  
💬 **Access global press kit**: [Press Kit Link]

We look forward to your coverage and to building the future of wealth, health, and legacy—together.

Warm regards,  
Tony Gomes & Pedro (AI CTO)  
Boutique Family Office Marketplace™`;
  };

  const filteredAssets = selectedLanguage === 'all' 
    ? pressAssets 
    : pressAssets.filter(asset => asset.language === selectedLanguage || asset.language === 'all');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Global Press Kit</h1>
          <p className="text-muted-foreground">Media assets and templates for global launch campaign</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share Kit
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Download All
          </Button>
        </div>
      </div>

      <Tabs defaultValue="assets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="assets">Media Assets</TabsTrigger>
          <TabsTrigger value="templates">Email Templates</TabsTrigger>
          <TabsTrigger value="release">Press Release</TabsTrigger>
          <TabsTrigger value="guidelines">Brand Guidelines</TabsTrigger>
        </TabsList>

        <TabsContent value="assets" className="space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <Label>Filter by Language:</Label>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                {languages.map(lang => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAssets.map((asset) => (
              <Card key={asset.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getAssetIcon(asset.type)}
                      <CardTitle className="text-sm">{asset.title}</CardTitle>
                    </div>
                    <Badge variant="outline">
                      {languages.find(l => l.code === asset.language)?.flag || '🌍'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-3">
                    {asset.description}
                  </p>
                  
                  {(asset.size || asset.format) && (
                    <div className="flex gap-2 mb-3">
                      {asset.size && (
                        <Badge variant="secondary" className="text-xs">
                          {asset.size}
                        </Badge>
                      )}
                      {asset.format && (
                        <Badge variant="secondary" className="text-xs">
                          {asset.format}
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleDownload(asset)}
                      className="flex-1"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                    
                    {asset.type === 'template' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleCopyTemplate(asset)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Editorial Outreach Template</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Customize Message</Label>
                <Textarea
                  placeholder="Add personalized content here..."
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Email Template Preview:</h4>
                <pre className="text-sm whitespace-pre-wrap font-sans">
                  {getEmailTemplate()}
                </pre>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => handleCopyTemplate({ id: 'template', type: 'template' } as PressAsset)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Template
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download as HTML
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="release" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Global Launch Press Release</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p><strong>FOR IMMEDIATE RELEASE</strong></p>
                
                <h3>Boutique Family Office Marketplace™ Launches Globally—Uniting Wealth, Health, and Legacy for Families and Professionals</h3>
                
                <p><em>[City, Date]</em> — The Boutique Family Office Marketplace™ ("BFOCFO"), the world's first integrated digital family office platform, today announces its global launch in the U.S., Canada, U.K., and across major international markets.</p>
                
                <p>BFOCFO delivers:</p>
                <ul>
                  <li><strong>Personalized Dashboards:</strong> For clients, advisors, accountants, attorneys, and more.</li>
                  <li><strong>AI Copilots & Compliance Tools:</strong> Automating tasks, tracking CE/CLE, and managing risk in real-time.</li>
                  <li><strong>Health & Longevity Solutions:</strong> Curated by leaders in wellness and medicine.</li>
                  <li><strong>Legacy Vault & SWAG Lead Score™:</strong> Empowering generational wealth and smarter client engagement.</li>
                  <li><strong>Multi-language, Multi-currency Support:</strong> Designed for families and professionals worldwide.</li>
                </ul>
                
                <p>"We believe every family deserves a world-class family office experience," said Tony Gomes, founder. "Our platform is designed for global scale, with privacy, security, and innovation at its core."</p>
                
                <p><strong>For press inquiries or interviews, contact:</strong><br />
                press@bfocfo.com</p>
                
                <p>For more information and to request VIP access: [Platform Link]</p>
                
                <p>-END-</p>
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Download as PDF
                </Button>
                <Button variant="outline">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Text
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guidelines" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Brand Colors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded"></div>
                    <div>
                      <p className="font-medium">Primary Blue</p>
                      <p className="text-sm text-muted-foreground">#0066CC</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-accent rounded"></div>
                    <div>
                      <p className="font-medium">Accent Gold</p>
                      <p className="text-sm text-muted-foreground">#FFD700</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-secondary rounded"></div>
                    <div>
                      <p className="font-medium">Secondary</p>
                      <p className="text-sm text-muted-foreground">#6B7280</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Logo Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Minimum size: 120px width</li>
                  <li>• Clear space: 0.5x logo height on all sides</li>
                  <li>• Use on light backgrounds preferably</li>
                  <li>• Do not stretch or distort</li>
                  <li>• Do not add effects or shadows</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PressKitManager;