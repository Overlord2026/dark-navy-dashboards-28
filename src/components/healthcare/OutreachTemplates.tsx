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
    // Personalized Professional Templates
    'longevity-doctor': {
      title: 'Longevity/Preventive Medicine Doctors',
      platform: 'Email',
      icon: Brain,
      color: 'text-emerald-600',
      subject: 'Invitation to Lead the Family Office Longevity Movement',
      message: `Dear Dr. {{recipientName}},

Your pioneering work in longevity and proactive health is transforming lives. We'd be honored to feature you as a Founding Medical Partner in the Family Office Marketplace—our secure, invitation-only platform for HNW families, advisors, and elite health experts.

Set up your free professional profile to:
• Share your research and programs
• Host webinars or Q&As
• Connect directly with proactive families

Let's elevate the industry together.

Best,  
Tony Gomes, CEO & Co-Founder

{{personalNote}}`
    },
    'wellness-coach': {
      title: 'Health & Wellness Coaches/Consultants',
      platform: 'Email',
      icon: Heart,
      color: 'text-rose-600',
      subject: 'Become a Founding Wellness Coach in the Family Office Marketplace',
      message: `Hi {{recipientName}},

We're inviting select top coaches to launch their practice in our new Family Office Marketplace. You'll have:
• A branded profile for your expertise
• Direct access to high-impact clients
• Opportunities to publish guides, lead challenges, and more

Reply to activate your spot!

{{personalNote}}

Cheers,  
Tony Gomes

P.S. Your work in {{recipientSpecialty}} is exactly what families are seeking for their wellness journey.`
    },
    'insurance-agent': {
      title: 'Healthcare Insurance Agents',
      platform: 'Email',
      icon: Shield,
      color: 'text-blue-600',
      subject: 'Join the BFO Health & Insurance Advisory Network',
      message: `Dear {{recipientName}},

We're building the nation's most trusted platform for families to manage wealth, health, and insurance—together. As a Founding Insurance Professional, you can:
• Offer premium Medicare, LTC, and hybrid solutions
• Receive qualified referrals (with permission)
• Build long-term trust with HNW families

Activate your profile or schedule a discovery call today.

{{personalNote}}

Best regards,
Tony Gomes & the BFO Team`
    },
    'thought-leader': {
      title: 'Influencers/Thought Leaders',
      platform: 'Email',
      icon: Award,
      color: 'text-amber-600',
      subject: 'Exclusive Invite: Be a Founding Thought Leader at BFO',
      message: `Hi {{recipientName}},

You've inspired a movement in health and longevity. We'd love to honor your work with a verified profile, plus invite-only access to our BFO Family Office Community.

Let's help families live longer, healthier, and more connected lives—together.

Ready to join us?

{{personalNote}}

Best,
Tony Gomes, CEO & Co-Founder
BFO Healthcare & Longevity Center`
    },
    // LinkedIn Templates
    'linkedin-influencer': {
      title: 'LinkedIn - Healthcare Influencer',
      platform: 'LinkedIn',
      icon: Linkedin,
      color: 'text-blue-600',
      subject: 'Invitation to Join BFO Healthcare & Longevity Network',
      message: `Hi {{recipientName}},

I've been following your work in {{recipientSpecialty}} and truly admire your impact on the health community.

I'm building the BFO Healthcare & Longevity Center - a secure platform where families connect with verified health experts like yourself. Would you be interested in exploring a founding partnership?

{{personalNote}}

Best regards,
[Your Name]
BFO Healthcare & Longevity Center`
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

{{personalNote}}

Best,
[Your Name]
BFO Healthcare & Longevity Center`
    },
    // Email Templates
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
The BFO Healthcare & Longevity Center serves as a comprehensive resource hub for high-net-worth families seeking world-class health resources and expert guidance.

What We're Offering:
• Verified expert profile with professional credentialing
• Platform to share knowledge and best practices
• Direct access to families seeking specialized guidance
• Collaborative network of peer professionals

{{personalNote}}

Warm regards,

[Your Full Name]
[Your Title]
BFO Healthcare & Longevity Center`
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

Some quick details:
• Professional profile setup
• Connect with motivated families
• Share your expertise through our platform
• Grow your practice with qualified leads

{{personalNote}}

Would you be up for a quick 10-minute call to learn more?

Best,
[Your Name]
[Your Phone Number]`
    },
    // SMS Templates
    'sms-initial': {
      title: 'SMS - Initial Outreach',
      platform: 'SMS',
      icon: MessageSquare,
      color: 'text-purple-600',
      subject: 'SMS Template',
      message: `Hi {{recipientName}}! I'm reaching out from BFO Healthcare & Longevity Center. Your work in {{recipientSpecialty}} caught our attention. We're building a network of healthcare experts to help families with longevity planning. Would you be interested in a quick 5-min call? [Your Name] - [Phone]`
    },
    'sms-followup': {
      title: 'SMS - Follow-up',
      platform: 'SMS',
      icon: MessageSquare,
      color: 'text-purple-600',
      subject: 'SMS Follow-up Template',
      message: `Hi {{recipientName}}, following up on my message about the BFO Healthcare network opportunity. We're specifically looking for {{recipientSpecialty}} experts to help families with health planning. Quick call this week? [Your Name]`
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