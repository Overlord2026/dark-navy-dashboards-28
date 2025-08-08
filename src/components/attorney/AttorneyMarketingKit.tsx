import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Mail, 
  Linkedin, 
  FileText, 
  Video, 
  Copy, 
  Download, 
  Edit,
  Eye,
  Share,
  Megaphone,
  Users,
  Calendar,
  CheckCircle
} from 'lucide-react';

export const AttorneyMarketingKit: React.FC = () => {
  const [activeTemplate, setActiveTemplate] = useState('email');
  const [customizations, setCustomizations] = useState({
    firmName: 'Smith & Associates LLP',
    attorneyName: 'John Smith',
    phone: '(555) 123-4567',
    email: 'john@smithlaw.com',
    website: 'www.smithlaw.com'
  });

  const emailTemplate = `Subject: Your New Legal Practice Hub is Here

Dear [Recipient Name],

I'm excited to introduce you to my new digital legal practice hub, powered by the Boutique Family Office™ Marketplace.

As your trusted legal advisor, I now have access to cutting-edge tools that will enhance our collaboration:

✅ Secure Document Vault - All your legal documents in one protected space
✅ Real-time Case Updates - Stay informed on your matter's progress  
✅ Compliance Monitoring - Automated alerts for important deadlines
✅ Professional Network Access - Connect with vetted financial advisors, CPAs, and other professionals

This integrated platform allows me to provide you with more comprehensive legal services while maintaining the highest standards of security and confidentiality.

I'd love to show you how this will streamline our work together. 

Schedule a brief walkthrough: [Calendar Link]

Best regards,
${customizations.attorneyName}
${customizations.firmName}
${customizations.phone}
${customizations.email}

P.S. Your secure client portal is ready whenever you'd like to explore it.`;

  const linkedInPost = `🏛️ Excited to announce that ${customizations.firmName} has joined the Boutique Family Office™ Marketplace!

This innovative platform allows me to:
• Provide enhanced legal services through integrated technology
• Collaborate seamlessly with other trusted professionals  
• Offer clients a comprehensive family office experience
• Maintain the highest standards of security and compliance

For estate planning, business law, and litigation support, our clients now have access to a complete ecosystem of professional services.

Ready to experience the future of legal practice management?

#LegalTech #EstatePlanning #FamilyOffice #LegalServices #Innovation`;

  const explainerSlides = [
    {
      title: "Welcome to Your Legal Hub",
      content: "Comprehensive legal practice management in a secure, professional environment"
    },
    {
      title: "Secure Document Vault",
      content: "All client documents organized, encrypted, and easily accessible with proper permissions"
    },
    {
      title: "Case Management System",
      content: "Track deadlines, manage discovery, and stay compliant across all jurisdictions"
    },
    {
      title: "Professional Network",
      content: "Collaborate with vetted CPAs, financial advisors, and other professionals"
    },
    {
      title: "Client Collaboration",
      content: "Secure messaging, document sharing, and real-time updates for clients"
    },
    {
      title: "Compliance Monitoring",
      content: "Automated alerts for bar requirements, filing deadlines, and regulatory changes"
    }
  ];

  const heyGenScript = `[SCENE: Professional attorney in office setting]

"Hi, I'm ${customizations.attorneyName} from ${customizations.firmName}.

I wanted to personally tell you about an exciting development in how I serve my clients.

I've joined the Boutique Family Office™ Marketplace - a secure, comprehensive platform that revolutionizes legal practice management.

What does this mean for you?

First, all your legal documents are now stored in a military-grade secure vault, organized and accessible whenever you need them.

Second, I can now collaborate seamlessly with your financial advisor, CPA, and other professionals - all within one secure ecosystem.

Third, you'll receive real-time updates on your legal matters, automated compliance monitoring, and access to a network of vetted professionals.

Whether we're working on estate planning, business matters, or litigation support, this platform ensures you receive comprehensive, coordinated service.

Your secure client portal is ready, and I'd love to show you how it will enhance our work together.

Schedule a brief walkthrough at ${customizations.website} or call me at ${customizations.phone}.

Welcome to the future of legal practice."

[END SCENE - Contact information displayed]`;

  const renderEmailTemplate = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Client Introduction Email
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firmName">Firm Name</Label>
                <Input
                  id="firmName"
                  value={customizations.firmName}
                  onChange={(e) => setCustomizations(prev => ({ ...prev, firmName: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="attorneyName">Attorney Name</Label>
                <Input
                  id="attorneyName"
                  value={customizations.attorneyName}
                  onChange={(e) => setCustomizations(prev => ({ ...prev, attorneyName: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={customizations.phone}
                  onChange={(e) => setCustomizations(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={customizations.email}
                  onChange={(e) => setCustomizations(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
            </div>
            
            <div>
              <Label>Email Template</Label>
              <Textarea
                value={emailTemplate}
                rows={20}
                className="font-mono text-sm"
                readOnly
              />
            </div>
            
            <div className="flex gap-2">
              <Button>
                <Copy className="w-4 h-4 mr-2" />
                Copy Template
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderLinkedInBanner = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Linkedin className="w-5 h-5" />
            LinkedIn Announcement Post
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>LinkedIn Post</Label>
              <Textarea
                value={linkedInPost}
                rows={15}
                className="font-mono text-sm"
                readOnly
              />
            </div>
            
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Suggested Hashtags:</h4>
              <div className="flex flex-wrap gap-2">
                {['#LegalTech', '#EstatePlanning', '#FamilyOffice', '#LegalServices', '#Innovation', '#Attorney', '#Law'].map(tag => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button>
                <Copy className="w-4 h-4 mr-2" />
                Copy Post
              </Button>
              <Button variant="outline">
                <Share className="w-4 h-4 mr-2" />
                Open LinkedIn
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderExplainerSlides = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Explainer Slide Deck Outline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {explainerSlides.map((slide, index) => (
              <Card key={index} className="border-l-4 border-l-primary">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Slide {index + 1}: {slide.title}</h3>
                  <p className="text-sm text-muted-foreground">{slide.content}</p>
                </CardContent>
              </Card>
            ))}
            
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Design Suggestions:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Use firm's brand colors</li>
                    <li>• Include professional imagery</li>
                    <li>• Maintain clean, legal aesthetic</li>
                    <li>• Add firm logo on each slide</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Call-to-Action Ideas:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Schedule a platform demo</li>
                    <li>• Access your client portal</li>
                    <li>• Download getting started guide</li>
                    <li>• Book a consultation</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex gap-2">
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Download Template
              </Button>
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                PowerPoint Template
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderHeyGenScript = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="w-5 h-5" />
            60-Second HeyGen Video Script
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Video Script</Label>
              <Textarea
                value={heyGenScript}
                rows={25}
                className="font-mono text-sm"
                readOnly
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Production Notes:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Professional attire recommended</li>
                    <li>• Office/law library setting</li>
                    <li>• Confident, approachable tone</li>
                    <li>• Maintain eye contact with camera</li>
                    <li>• Keep gestures minimal and professional</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Technical Specs:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Duration: 60 seconds</li>
                    <li>• Format: 16:9 landscape</li>
                    <li>• Resolution: 1080p minimum</li>
                    <li>• Include subtitles</li>
                    <li>• End with contact information overlay</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex gap-2">
              <Button>
                <Copy className="w-4 h-4 mr-2" />
                Copy Script
              </Button>
              <Button variant="outline">
                <Video className="w-4 h-4 mr-2" />
                Create Video
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Megaphone className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Attorney Marketing Kit</h1>
              <p className="text-muted-foreground">Professional templates and assets for client communication</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Mail className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="font-medium">Email Templates</p>
                <p className="text-sm text-muted-foreground">Client announcements</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Linkedin className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="font-medium">Social Media</p>
                <p className="text-sm text-muted-foreground">LinkedIn content</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <FileText className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="font-medium">Presentations</p>
                <p className="text-sm text-muted-foreground">Slide deck outlines</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Video className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="font-medium">Video Scripts</p>
                <p className="text-sm text-muted-foreground">HeyGen templates</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTemplate} onValueChange={setActiveTemplate}>
          <TabsList className="mb-6">
            <TabsTrigger value="email">Email Template</TabsTrigger>
            <TabsTrigger value="linkedin">LinkedIn Banner</TabsTrigger>
            <TabsTrigger value="slides">Explainer Slides</TabsTrigger>
            <TabsTrigger value="video">HeyGen Script</TabsTrigger>
          </TabsList>

          <TabsContent value="email">
            {renderEmailTemplate()}
          </TabsContent>
          
          <TabsContent value="linkedin">
            {renderLinkedInBanner()}
          </TabsContent>
          
          <TabsContent value="slides">
            {renderExplainerSlides()}
          </TabsContent>
          
          <TabsContent value="video">
            {renderHeyGenScript()}
          </TabsContent>
        </Tabs>

        {/* Collaboration Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Collaboration Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Shared File Access</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Client document sharing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">CPA tax document access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Advisor financial plan integration</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Team Integration</h3>
                <Button className="w-full">
                  <Users className="w-4 h-4 mr-2" />
                  Add to Client's Family Office Team
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Connect with other professionals serving the same client
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};