import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Share, 
  Mail, 
  MessageSquare, 
  Linkedin, 
  Copy, 
  Send, 
  Users, 
  Heart,
  Award,
  Brain,
  Shield,
  CheckCircle
} from 'lucide-react';

const OutreachTemplates = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('linkedin-influencer');
  const [customization, setCustomization] = useState({
    recipientName: '',
    recipientSpecialty: '',
    personalNote: ''
  });

  const templates = {
    'linkedin-influencer': {
      title: 'LinkedIn - Healthcare Influencer/Thought Leader',
      platform: 'LinkedIn',
      icon: Linkedin,
      color: 'text-blue-600',
      subject: 'Invitation to Join BFO Healthcare & Longevity Network',
      message: `Hi {{recipientName}},

I hope this message finds you well. Your pioneering work in {{recipientSpecialty}} has truly inspired our mission at the Boutique Family Office Healthcare & Longevity Center.

We're building an exclusive network of healthcare thought leaders, and your expertise would be invaluable to families seeking trusted guidance on their wellness journey.

🌟 What we're offering:
• Verified Thought Leader status with exclusive badge
• Platform to share your expertise with high-net-worth families
• AMA hosting opportunities and content amplification
• Direct connection with families serious about longevity

We'd be honored to feature you as a Founding Healthcare Influencer in our network. Your insights on evidence-based wellness strategies could help shape the future of family health planning.

Would you be interested in a brief conversation about this opportunity?

Best regards,
[Your Name]
BFO Healthcare & Longevity Center

P.S. We're particularly excited about your work in {{recipientSpecialty}} and how it aligns with our mission to help families live healthier, longer lives.`
    },
    'linkedin-consultant': {
      title: 'LinkedIn - Healthcare Consultant/Coach',
      platform: 'LinkedIn',
      icon: Linkedin,
      color: 'text-blue-600',
      subject: 'Professional Opportunity - Healthcare Consultant Network',
      message: `Hello {{recipientName}},

I came across your profile and was impressed by your expertise in {{recipientSpecialty}}. I believe there's a valuable opportunity that aligns perfectly with your professional goals.

We're launching the BFO Healthcare & Longevity Center's consultant network, connecting qualified professionals with families seeking comprehensive health guidance.

🏥 Opportunity highlights:
• Set up your professional profile in our exclusive network
• Connect with families who value expert healthcare guidance
• Offer consultations and share resources with our community
• Join a curated network of healthcare professionals

Our platform serves families who are serious about proactive health planning and have the resources to invest in quality care.

Would you be interested in learning more about how you can help families live healthier, longer lives while growing your practice?

{{personalNote}}

Best,
[Your Name]
BFO Healthcare & Longevity Center`
    },
    'email-formal': {
      title: 'Email - Formal Professional Invitation',
      platform: 'Email',
      icon: Mail,
      color: 'text-green-600',
      subject: 'Invitation to Join BFO Healthcare & Longevity Network - {{recipientName}}',
      message: `Dear Dr. {{recipientName}},

I hope this email finds you in excellent health and spirits.

I am reaching out on behalf of the Boutique Family Office Healthcare & Longevity Center to extend an exclusive invitation for you to join our distinguished network of healthcare professionals.

Your renowned expertise in {{recipientSpecialty}} and commitment to advancing patient care makes you an ideal candidate for our thought leadership program.

About Our Network:
The BFO Healthcare & Longevity Center serves as a comprehensive resource hub for high-net-worth families seeking world-class health resources and expert guidance. We connect leading medical experts with families who prioritize proactive health planning and longevity strategies.

What We're Offering:
• Verified expert profile with professional credentialing
• Platform to share knowledge and best practices
• Direct access to families seeking specialized guidance
• Collaborative network of peer professionals
• Opportunity to influence family health planning strategies

Your contributions would help shape how families approach healthcare planning and longevity optimization. We believe your insights could significantly impact our community's health outcomes.

Would you be available for a brief 15-minute conversation this week to discuss this opportunity in more detail?

{{personalNote}}

I look forward to the possibility of collaborating with you.

Warm regards,

[Your Full Name]
[Your Title]
BFO Healthcare & Longevity Center
[Phone Number]
[Email Address]

P.S. We're particularly interested in your recent work on {{recipientSpecialty}} and how it could benefit our family-focused approach to healthcare planning.`
    },
    'email-warm': {
      title: 'Email - Warm Introduction',
      platform: 'Email',
      icon: Mail,
      color: 'text-green-600',
      subject: 'Quick question about healthcare consulting opportunities',
      message: `Hi {{recipientName}},

I hope you're doing well! I wanted to reach out because I've been following your work in {{recipientSpecialty}} and think there might be a great opportunity that would interest you.

We're building something special at the BFO Healthcare & Longevity Center - a network where healthcare professionals like yourself can connect with families who are serious about proactive health planning.

The idea is simple: families need trusted guidance, and professionals like you have the expertise they're looking for. We're creating the bridge between the two.

Some quick details:
• Professional profile setup (think LinkedIn for healthcare)
• Connect with motivated families
• Share your expertise through our platform
• Grow your practice with qualified leads

{{personalNote}}

The families in our network aren't just looking for any healthcare advice - they want guidance from professionals who truly understand longevity and optimal health strategies.

Would you be up for a quick 10-minute call to learn more? I think you'd find it interesting, and there's no pressure either way.

Let me know what works for your schedule!

Best,
[Your Name]
[Your Phone Number]

P.S. I'd love to hear your thoughts on the current state of {{recipientSpecialty}} and how you see the field evolving.`
    },
    'sms-initial': {
      title: 'SMS - Initial Outreach',
      platform: 'SMS',
      icon: MessageSquare,
      color: 'text-purple-600',
      subject: 'SMS Template',
      message: `Hi {{recipientName}}! I'm reaching out from BFO Healthcare & Longevity Center. Your work in {{recipientSpecialty}} caught our attention. We're building a network of healthcare experts to help families with longevity planning. Would you be interested in a quick 5-min call about an opportunity? No pressure! [Your Name] - [Phone]`
    },
    'sms-followup': {
      title: 'SMS - Follow-up',
      platform: 'SMS',
      icon: MessageSquare,
      color: 'text-purple-600',
      subject: 'SMS Follow-up Template',
      message: `Hi {{recipientName}}, following up on my message about the BFO Healthcare network opportunity. We're specifically looking for {{recipientSpecialty}} experts to help families with health planning. Quick call this week? Worth exploring! [Your Name]`
    }
  };

  const handleCopy = (text: string) => {
    const personalizedText = text
      .replace(/{{recipientName}}/g, customization.recipientName || '[Recipient Name]')
      .replace(/{{recipientSpecialty}}/g, customization.recipientSpecialty || '[Specialty/Expertise]')
      .replace(/{{personalNote}}/g, customization.personalNote || '');
    
    navigator.clipboard.writeText(personalizedText);
    // You could add a toast notification here
  };

  const currentTemplate = templates[selectedTemplate as keyof typeof templates];
  const Icon = currentTemplate.icon;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Healthcare Network Outreach Templates
        </h1>
        <p className="text-lg text-muted-foreground">
          Professional templates for recruiting healthcare experts to your network
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Select Template</h3>
          <div className="space-y-2">
            {Object.entries(templates).map(([key, template]) => {
              const TemplateIcon = template.icon;
              return (
                <Button
                  key={key}
                  variant={selectedTemplate === key ? "default" : "outline"}
                  className="w-full justify-start gap-2 h-auto py-3"
                  onClick={() => setSelectedTemplate(key)}
                >
                  <TemplateIcon className={`h-4 w-4 ${template.color}`} />
                  <div className="text-left">
                    <div className="font-medium">{template.title}</div>
                    <div className="text-xs text-muted-foreground">{template.platform}</div>
                  </div>
                </Button>
              );
            })}
          </div>

          {/* Customization Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Customize Template</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipientName">Recipient Name</Label>
                <Input
                  id="recipientName"
                  value={customization.recipientName}
                  onChange={(e) => setCustomization(prev => ({ ...prev, recipientName: e.target.value }))}
                  placeholder="Dr. Sarah Chen"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="recipientSpecialty">Specialty/Expertise</Label>
                <Input
                  id="recipientSpecialty"
                  value={customization.recipientSpecialty}
                  onChange={(e) => setCustomization(prev => ({ ...prev, recipientSpecialty: e.target.value }))}
                  placeholder="Longevity Medicine"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="personalNote">Personal Note (Optional)</Label>
                <Textarea
                  id="personalNote"
                  value={customization.personalNote}
                  onChange={(e) => setCustomization(prev => ({ ...prev, personalNote: e.target.value }))}
                  placeholder="Add a personal touch..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Template Preview */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className={`h-5 w-5 ${currentTemplate.color}`} />
                <CardTitle>{currentTemplate.title}</CardTitle>
              </div>
              <Badge variant="outline">{currentTemplate.platform}</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentTemplate.platform !== 'SMS' && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Subject Line:</Label>
                  <div className="p-3 bg-muted rounded-lg font-medium">
                    {currentTemplate.subject
                      .replace(/{{recipientName}}/g, customization.recipientName || '[Recipient Name]')
                      .replace(/{{recipientSpecialty}}/g, customization.recipientSpecialty || '[Specialty]')}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-sm font-medium">Message:</Label>
                <div className="p-4 bg-muted rounded-lg whitespace-pre-wrap text-sm leading-relaxed">
                  {currentTemplate.message
                    .replace(/{{recipientName}}/g, customization.recipientName || '[Recipient Name]')
                    .replace(/{{recipientSpecialty}}/g, customization.recipientSpecialty || '[Specialty/Expertise]')
                    .replace(/{{personalNote}}/g, customization.personalNote ? `\n${customization.personalNote}\n` : '')}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  className="gap-2" 
                  onClick={() => handleCopy(currentTemplate.subject + '\n\n' + currentTemplate.message)}
                >
                  <Copy className="h-4 w-4" />
                  Copy Template
                </Button>
                <Button variant="outline" className="gap-2">
                  <Send className="h-4 w-4" />
                  Send via Platform
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Best Practices */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">Outreach Best Practices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    Do's
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Research recipient's background</li>
                    <li>• Personalize each message</li>
                    <li>• Be specific about the opportunity</li>
                    <li>• Include clear value proposition</li>
                    <li>• Follow up professionally</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-500" />
                    Don'ts
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Send generic mass messages</li>
                    <li>• Be overly aggressive</li>
                    <li>• Ignore platform etiquette</li>
                    <li>• Follow up too frequently</li>
                    <li>• Make unrealistic promises</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Platform-Specific Guidelines */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Linkedin className="h-4 w-4 text-blue-600" />
              LinkedIn Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>• Connect first, then message</p>
            <p>• Keep initial messages under 300 characters</p>
            <p>• Reference mutual connections when possible</p>
            <p>• Use professional tone and language</p>
            <p>• Include relevant hashtags in posts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Mail className="h-4 w-4 text-green-600" />
              Email Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>• Craft compelling subject lines</p>
            <p>• Keep emails scannable with bullet points</p>
            <p>• Include clear call-to-action</p>
            <p>• Follow up 3-5 days later</p>
            <p>• Use professional email signature</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MessageSquare className="h-4 w-4 text-purple-600" />
              SMS Etiquette
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>• Keep messages under 160 characters</p>
            <p>• Always include your name</p>
            <p>• Be direct and clear</p>
            <p>• Don't send after business hours</p>
            <p>• Respect opt-out requests immediately</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OutreachTemplates;