import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Share2, 
  Download, 
  Copy, 
  FileText, 
  Image, 
  Presentation,
  Megaphone
} from 'lucide-react';

export const MedicareMarketingKit = () => {
  const [activeTab, setActiveTab] = useState('email');
  const [copiedText, setCopiedText] = useState('');

  const emailTemplates = [
    {
      id: 'prospect-intro',
      title: 'Prospect Introduction Email',
      subject: 'Join My Compliance-Ready Client Portal',
      body: `Hi [First Name],

I hope this email finds you well. As your Medicare specialist, I'm excited to share a new way we can work together more effectively.

I've set up a secure client portal where you can:
✓ Access educational resources about Medicare options
✓ Securely share and store important documents
✓ Communicate with me directly through a HIPAA-compliant platform
✓ Stay updated on Medicare changes and deadlines

This portal ensures we stay compliant with all CMS requirements while providing you with the best possible service.

Ready to get started? Simply click the link below to access your portal:
[Portal Link]

If you have any questions, don't hesitate to reach out.

Best regards,
[Your Name]
[Your Title]
[Contact Information]`
    },
    {
      id: 'annual-enrollment',
      title: 'Annual Enrollment Reminder',
      subject: 'Your Medicare Annual Enrollment Period is Here',
      body: `Dear [First Name],

The Medicare Annual Enrollment Period (October 15 - December 7) is here, and it's time to review your Medicare coverage for 2024.

During this period, you can:
• Switch from Original Medicare to Medicare Advantage (or vice versa)
• Change your Medicare Advantage plan
• Add, drop, or change your Medicare prescription drug coverage
• Review and compare costs and benefits

I'm here to help you navigate these options and ensure you have the best coverage for your needs and budget.

Let's schedule a complimentary review to discuss:
✓ Your current plan's performance
✓ New options for 2024
✓ Potential cost savings
✓ Coverage improvements

Click here to schedule your review: [Calendar Link]

Best regards,
[Your Name]`
    },
    {
      id: 'cross-referral',
      title: 'Cross-Referral to Advisor/CPA',
      subject: 'Connecting You with a Trusted Financial Professional',
      body: `Hello [Advisor/CPA Name],

I hope you're doing well. I have a client who could benefit from your expertise, and I believe you'd be a great fit for their needs.

Client Profile:
• [Brief description of client needs]
• Looking for [specific services]
• Values compliance and professional service

I've been working with them on their Medicare planning, and they've expressed interest in [financial planning/tax planning]. Given your reputation and expertise, I thought this could be a great match.

Would you be interested in a brief introduction call? I'm happy to facilitate the connection and provide any background information that would be helpful.

Let me know your thoughts.

Best regards,
[Your Name]`
    }
  ];

  const adCopy = [
    {
      platform: 'LinkedIn',
      type: 'Headline',
      content: 'Compliance Made Simple. Growth Made Inevitable.',
      description: 'Short, powerful headline for LinkedIn ads'
    },
    {
      platform: 'Facebook',
      type: 'Retargeting Ad',
      content: 'Stop juggling tools. Start closing more Medicare clients — safely.',
      description: 'Retargeting ad for warm leads'
    },
    {
      platform: 'Google Ads',
      type: 'Search Ad',
      content: 'CMS-Compliant Medicare Tools | Record, Store, Grow Your Business | Free Trial',
      description: 'Search ad targeting Medicare agents'
    }
  ];

  const socialBanners = [
    {
      title: 'LinkedIn Header - Compliance & Trust',
      description: 'Professional header emphasizing compliance and trust',
      dimensions: '1584 x 396 px',
      downloadUrl: '/api/download/linkedin-header-compliance.png'
    },
    {
      title: 'Facebook Cover - Annual Enrollment',
      description: 'Facebook cover photo for Annual Enrollment Period',
      dimensions: '820 x 312 px',
      downloadUrl: '/api/download/facebook-cover-enrollment.png'
    },
    {
      title: 'Instagram Post - Medicare Education',
      description: 'Square post template for Medicare education content',
      dimensions: '1080 x 1080 px',
      downloadUrl: '/api/download/instagram-medicare-education.png'
    }
  ];

  const explainerSlides = [
    'Why Medicare compliance matters in 2024',
    'How BFO makes compliance effortless',
    'Basic vs Premium tools comparison',
    'Client onboarding in 3 simple steps',
    'ROI and growth metrics you can expect'
  ];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(''), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Medicare Marketing Kit</h1>
        <p className="text-lg text-muted-foreground">
          Ready-to-use marketing materials to grow your Medicare business
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="email">Email Templates</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="slides">Explainer Slides</TabsTrigger>
          <TabsTrigger value="ads">Ad Copy</TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="space-y-6">
          <div className="text-center mb-6">
            <Mail className="h-12 w-12 mx-auto text-blue-600 mb-4" />
            <h2 className="text-2xl font-semibold">Email Templates</h2>
            <p className="text-muted-foreground">
              Professional email templates for client outreach and referrals
            </p>
          </div>

          <div className="space-y-6">
            {emailTemplates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{template.title}</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(template.body, template.id)}
                    >
                      {copiedText === template.id ? (
                        'Copied!'
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <Badge variant="outline">Subject: {template.subject}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm font-mono">
                      {template.body}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <div className="text-center mb-6">
            <Share2 className="h-12 w-12 mx-auto text-emerald-600 mb-4" />
            <h2 className="text-2xl font-semibold">Social Media Assets</h2>
            <p className="text-muted-foreground">
              Professional banners and post templates for social platforms
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {socialBanners.map((banner, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Image className="h-5 w-5 mr-2" />
                    {banner.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {banner.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{banner.dimensions}</Badge>
                    <Button size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="slides" className="space-y-6">
          <div className="text-center mb-6">
            <Presentation className="h-12 w-12 mx-auto text-purple-600 mb-4" />
            <h2 className="text-2xl font-semibold">Explainer Slides</h2>
            <p className="text-muted-foreground">
              PowerPoint presentation templates for client education
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Medicare Compliance & BFO Presentation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                A comprehensive slide deck covering Medicare compliance requirements 
                and how BFO simplifies the process for agents and clients.
              </p>
              
              <div className="space-y-3">
                <h4 className="font-semibold">Slide Topics:</h4>
                <div className="grid gap-2 md:grid-cols-2">
                  {explainerSlides.map((slide, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      <span className="text-sm">{slide}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Download PowerPoint
                </Button>
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  View Online
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ads" className="space-y-6">
          <div className="text-center mb-6">
            <Megaphone className="h-12 w-12 mx-auto text-amber-600 mb-4" />
            <h2 className="text-2xl font-semibold">Ad Copy</h2>
            <p className="text-muted-foreground">
              Proven ad copy for LinkedIn, Facebook, and Google campaigns
            </p>
          </div>

          <div className="space-y-6">
            {adCopy.map((ad, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {ad.platform} - {ad.type}
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(ad.content, `ad-${index}`)}
                    >
                      {copiedText === `ad-${index}` ? (
                        'Copied!'
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <p className="font-semibold text-lg">{ad.content}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{ad.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};