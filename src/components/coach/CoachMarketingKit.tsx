import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  Mail, 
  Linkedin, 
  FileText, 
  Video,
  Copy,
  Download,
  Edit,
  Target,
  Users,
  BookOpen,
  TrendingUp,
  Star,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';

export const CoachMarketingKit: React.FC = () => {
  const [activeTab, setActiveTab] = useState('email');

  const emailTemplate = {
    subject: "Your New Digital Coaching & Consulting Hub",
    body: `Hi [NAME],

I'm excited to share something that's transforming how I work with clients like you.

I've just joined the Boutique Family Office™ Marketplace - an exclusive platform where elite coaches and consultants serve high-net-worth individuals and families.

Here's what this means for you:

✅ **Streamlined Experience**: Everything in one secure platform - sessions, resources, progress tracking
✅ **Enhanced Privacy**: Bank-level security used by family offices
✅ **Better Outcomes**: AI-powered tools to accelerate your success
✅ **Exclusive Network**: Connect with top advisors, attorneys, and specialists

**Your Next Steps:**
1. I'll send you a secure invitation to our private client portal
2. We'll schedule a brief orientation call (15 minutes)
3. You'll have access to all our premium coaching resources

This upgrade comes at no additional cost to you - it's my investment in delivering even better results.

Ready to experience the future of executive coaching?

Best regards,
[YOUR NAME]
[YOUR TITLE]
[YOUR CONTACT INFO]

P.S. The platform includes a complimentary wealth assessment tool valued at $2,500. I'll show you how to access it during our call.`
  };

  const linkedinBanner = {
    headline: "Executive Coach | Boutique Family Office™ Marketplace",
    description: "Helping High-Net-Worth Leaders Scale & Succeed",
    elements: [
      "Professional headshot on left third",
      "Elegant BFO™ logo integration",
      "Key metrics: '500+ Executives Coached'",
      "Tagline: 'Elite Coaching. Exceptional Results.'",
      "Subtle luxury color palette (navy, gold, white)"
    ]
  };

  const explainerSlides = [
    {
      title: "Your Digital Practice. Elevated.",
      content: "Introduction to the Boutique Family Office™ coaching experience"
    },
    {
      title: "Who We Serve",
      content: "C-suite executives, entrepreneurs, family business owners, and high-net-worth individuals"
    },
    {
      title: "Our Methodology",
      content: "Structured programs combining executive coaching with wealth psychology"
    },
    {
      title: "Technology Advantage",
      content: "AI-powered progress tracking, secure communications, and outcome analytics"
    },
    {
      title: "Exclusive Network",
      content: "Access to attorneys, CPAs, advisors, and specialists within the BFO marketplace"
    },
    {
      title: "Success Stories",
      content: "Case studies and testimonials from transformed leaders"
    },
    {
      title: "Getting Started",
      content: "Simple onboarding process and next steps"
    }
  ];

  const heygenScript = `[Scene: Professional office or coaching environment]

[Coach speaking directly to camera, confident and approachable]

"Hi, I'm [YOUR NAME], and I've been coaching executives and entrepreneurs for [X] years.

[Pause, lean forward slightly]

But I want to share something that's completely transformed how I serve my clients.

[Gesture with hands]

I've joined the Boutique Family Office™ Marketplace - an exclusive platform where the world's top coaches work with high-net-worth individuals and families.

[Count on fingers]

This means three things for my clients:

First - Everything happens in one secure platform. No more juggling multiple tools or worrying about privacy.

Second - You get AI-powered insights that accelerate your results. We can track your progress in real-time and adjust our approach instantly.

Third - You gain access to an exclusive network of wealth advisors, attorneys, and specialists who serve ultra-high-net-worth families.

[Pause, direct eye contact]

If you're a C-suite executive, successful entrepreneur, or family business owner looking to elevate your leadership and align your success with your wealth...

[Point to camera]

This is exactly what you've been looking for.

[Confident smile]

Ready to experience executive coaching at the family office level?

Let's talk.

[End with contact information overlay]"

[Total duration: 60 seconds]`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8">
      <div className="container mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            Coach Marketing Kit
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Professional marketing assets to promote your elevated coaching practice
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Template
            </TabsTrigger>
            <TabsTrigger value="linkedin" className="flex items-center gap-2">
              <Linkedin className="w-4 h-4" />
              LinkedIn Banner
            </TabsTrigger>
            <TabsTrigger value="slides" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Presentation
            </TabsTrigger>
            <TabsTrigger value="video" className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              Video Script
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Client Invitation Email Template
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Subject Line</label>
                  <div className="mt-1 p-3 bg-muted/50 rounded-lg font-medium">
                    {emailTemplate.subject}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email Body</label>
                  <Textarea
                    value={emailTemplate.body}
                    readOnly
                    rows={20}
                    className="mt-1 font-mono text-sm"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => copyToClipboard(emailTemplate.body)}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Template
                  </Button>
                  <Button variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Customize
                  </Button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Personalization Tips:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Replace [NAME] with client's first name</li>
                    <li>• Add specific examples relevant to their industry</li>
                    <li>• Include your personal coaching philosophy</li>
                    <li>• Mention recent wins or transformations</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="linkedin" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Linkedin className="w-5 h-5" />
                  LinkedIn Banner Design Brief
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-2">{linkedinBanner.headline}</h3>
                  <p className="text-blue-100">{linkedinBanner.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Design Elements:</h4>
                  <div className="grid gap-2">
                    {linkedinBanner.elements.map((element, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        <span className="text-sm">{element}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="border-primary/20">
                    <CardContent className="p-4 text-center">
                      <Target className="w-8 h-8 text-primary mx-auto mb-2" />
                      <h4 className="font-semibold">Elite Positioning</h4>
                      <p className="text-xs text-muted-foreground">Premium family office branding</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-primary/20">
                    <CardContent className="p-4 text-center">
                      <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                      <h4 className="font-semibold">Professional Network</h4>
                      <p className="text-xs text-muted-foreground">Connect with HNW prospects</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-primary/20">
                    <CardContent className="p-4 text-center">
                      <Star className="w-8 h-8 text-primary mx-auto mb-2" />
                      <h4 className="font-semibold">Credibility Boost</h4>
                      <p className="text-xs text-muted-foreground">Marketplace association</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex gap-2">
                  <Button>
                    <Download className="w-4 h-4 mr-2" />
                    Download Template
                  </Button>
                  <Button variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Request Custom Design
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="slides" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Explainer Presentation Outline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {explainerSlides.map((slide, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="secondary" className="w-8 h-8 rounded-full p-0 flex items-center justify-center">
                          {index + 1}
                        </Badge>
                        <h3 className="font-semibold">{slide.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground ml-11">{slide.content}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Presentation Best Practices:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Use high-quality images and minimal text</li>
                    <li>• Include client success metrics and testimonials</li>
                    <li>• Emphasize exclusivity and premium positioning</li>
                    <li>• End with clear next steps and contact information</li>
                  </ul>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button>
                    <Download className="w-4 h-4 mr-2" />
                    Download Template
                  </Button>
                  <Button variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Customize Slides
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="video" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  60-Second HeyGen Video Script
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <Badge className="mb-3">60-Second Duration</Badge>
                  <Textarea
                    value={heygenScript}
                    readOnly
                    rows={25}
                    className="font-mono text-sm"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="border-primary/20">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">Video Tips:</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Speak confidently and maintain eye contact</li>
                        <li>• Use professional lighting and audio</li>
                        <li>• Wear business attire that reflects your brand</li>
                        <li>• Practice the script until it feels natural</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-primary/20">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">Distribution:</h4>
                      <ul className="text-sm space-y-1">
                        <li>• LinkedIn video posts</li>
                        <li>• Email signature inclusion</li>
                        <li>• Website homepage feature</li>
                        <li>• Social media campaigns</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => copyToClipboard(heygenScript)}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Script
                  </Button>
                  <Button variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Customize
                  </Button>
                  <Button variant="outline">
                    <Video className="w-4 h-4 mr-2" />
                    Record with HeyGen
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <Card className="mt-8 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold mb-2">Ready to Launch Your Elite Practice?</h3>
            <p className="text-muted-foreground mb-4">
              Use these marketing assets to attract high-value clients and establish your premium positioning.
            </p>
            <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
              View Full Marketing Suite
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};