import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mail,
  Share2,
  FileText,
  Download,
  Copy,
  Crown,
  Users,
  TrendingUp,
  Shield,
  Star
} from 'lucide-react';

export const EliteFamilyOfficeMarketingKit: React.FC = () => {
  const emailTemplates = [
    {
      title: 'Launch Invite to Elite Executives',
      subject: 'Invitation: Join Our Elite Family Office Platform',
      preview: 'Dear [Name], We\'re excited to invite you to experience our premium family office management platform...',
      category: 'Invitation'
    },
    {
      title: 'Upgrade to Premium Campaign',
      subject: 'Unlock Premium Features for Your Family Office',
      preview: 'Take your family office management to the next level with our Premium tier features...',
      category: 'Upsell'
    },
    {
      title: 'Quarterly Feature Update',
      subject: 'New Premium Features Available in Your Elite Platform',
      preview: 'We\'re thrilled to announce exciting new features that will enhance your family office operations...',
      category: 'Newsletter'
    }
  ];

  const socialBanners = [
    {
      platform: 'LinkedIn',
      dimensions: '1584 x 396px',
      description: 'Professional header with gold/emerald gradient and elite branding',
      downloadUrl: '#'
    },
    {
      platform: 'Twitter/X',
      dimensions: '1500 x 500px',
      description: 'Premium branding with headline and CTA',
      downloadUrl: '#'
    },
    {
      platform: 'Instagram',
      dimensions: '1080 x 1080px',
      description: 'Square format with elegant family office theme',
      downloadUrl: '#'
    }
  ];

  const adCopy = [
    {
      title: 'LinkedIn Premium Ad',
      headline: 'Extend Your Reach. Extend Their Wealth.',
      body: 'Elite family office executives trust our platform for comprehensive wealth management. Join the exclusive network.',
      cta: 'Request Demo'
    },
    {
      title: 'Retargeting Campaign',
      headline: 'Your clients trust you with their wealth — trust us with the tools.',
      body: 'Sophisticated technology meets exceptional service. Discover why elite family offices choose our platform.',
      cta: 'Start Free Trial'
    }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Crown className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Elite Family Office Marketing Kit</h1>
                <p className="text-sm text-muted-foreground">Premium marketing assets for family office executives</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
              <Crown className="h-3 w-3 mr-1 text-amber-600" />
              <span className="text-amber-800 font-medium">Elite Resources</span>
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="emails" className="space-y-8">
          <TabsList className="grid grid-cols-4 w-full max-w-md mx-auto">
            <TabsTrigger value="emails">Emails</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="slides">Slides</TabsTrigger>
            <TabsTrigger value="ads">Ad Copy</TabsTrigger>
          </TabsList>

          {/* Email Templates */}
          <TabsContent value="emails" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Email Templates</h2>
              <p className="text-lg text-muted-foreground">
                Professional email templates for elite family office communication
              </p>
            </div>

            <div className="grid gap-6">
              {emailTemplates.map((template, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-primary" />
                        <div>
                          <CardTitle>{template.title}</CardTitle>
                          <CardDescription>Subject: {template.subject}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="secondary">{template.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted rounded-lg p-4 mb-4">
                      <p className="text-sm text-muted-foreground">{template.preview}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download Template
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(template.preview)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Content
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Social Media Banners */}
          <TabsContent value="social" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Social Media Banners</h2>
              <p className="text-lg text-muted-foreground">
                Premium branded assets for your social media presence
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {socialBanners.map((banner, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <Share2 className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle>{banner.platform}</CardTitle>
                        <CardDescription>{banner.dimensions}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{banner.description}</p>
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download Banner
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Explainer Slides */}
          <TabsContent value="slides" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Explainer Slide Deck</h2>
              <p className="text-lg text-muted-foreground">
                6-slide presentation deck for elite family office prospects
              </p>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>Elite Family Office Presentation</CardTitle>
                    <CardDescription>PowerPoint and Canva-ready slide deck</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <h4 className="font-medium">Slide Contents:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Problem: Complex wealth management challenges</li>
                      <li>• Solution: Integrated family office platform</li>
                      <li>• Features: Multi-client oversight & compliance</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Additional Slides:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Benefits: ROI and efficiency gains</li>
                      <li>• Pricing: Basic vs Premium comparison</li>
                      <li>• Next Steps: Contact and demo process</li>
                    </ul>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download PowerPoint
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Canva Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ad Copy */}
          <TabsContent value="ads" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Advertisement Copy</h2>
              <p className="text-lg text-muted-foreground">
                Premium ad copy for elite family office marketing campaigns
              </p>
            </div>

            <div className="grid gap-6">
              {adCopy.map((ad, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <CardTitle>{ad.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Headline:</Label>
                        <p className="text-lg font-semibold">{ad.headline}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Body Copy:</Label>
                        <p className="text-muted-foreground">{ad.body}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Call-to-Action:</Label>
                        <Badge variant="outline">{ad.cta}</Badge>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard(`${ad.headline}\n\n${ad.body}\n\nCTA: ${ad.cta}`)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy All
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const Label: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <span className={`text-sm font-medium ${className}`}>{children}</span>
);