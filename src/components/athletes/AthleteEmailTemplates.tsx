import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Mail, Send, Users, Trophy, Star, MessageCircle } from 'lucide-react';

const emailTemplates = {
  invitation: {
    subject: "You're Invited: Athlete & Entertainer Wealth & Wellbeing Center—Founders VIP Access",
    body: `Hi [First Name],

You've been selected as a Founding Member of the Athlete & Entertainer Wealth & Wellbeing Center—built for champions, by champions.

🏆 Build your custom wealth & wellness playbook
🎯 Learn from pros who've been there
🔒 Access confidential support for life on and off the field
👥 Invite your teammates—change your team's future

This exclusive platform addresses the real challenges athletes face:
• 60% of athletes face financial distress within 5 years of retirement
• Most have never received proper financial education
• Predatory advisors target high earners in sports
• Mental health support during career transitions is critical

Join fellow champions who are taking control of their financial future and building generational wealth.

[Join Now - Your Private Invitation]

The Boutique Family Office Team

P.S. Your privacy is our priority. No SSN required, no pressure, just world-class education and support.`,
    variables: ["First Name", "Sport", "Team", "Career Stage"]
  },
  followUp: {
    subject: "Don't miss out - Your VIP Athlete Education Access expires soon",
    body: `Hi [First Name],

I wanted to follow up on your exclusive invitation to the Athlete & Entertainer Wealth & Wellbeing Center.

As a [Sport] [Position], you face unique financial challenges that traditional advisors don't understand:
✗ Career uncertainty and injury risks
✗ Short earning windows requiring smart planning
✗ Family and friends asking for financial support
✗ Complex endorsement and NIL deal negotiations

Our founding members are already:
🎯 Completing their financial education modules
🛡️ Building asset protection strategies
🤝 Connecting with vetted fiduciary advisors
💪 Preparing for life after sports

Your VIP access includes:
• 12 interactive learning modules
• 24/7 AI Copilot support
• Financial readiness assessments
• Direct connection to athlete-specialized advisors
• Founding member badge and perks

[Activate Your Access Now]

Questions? Reply to this email or chat with our Athlete Copilot anytime.

Best regards,
Tony Gomes
Founder, Boutique Family Office`,
    variables: ["First Name", "Sport", "Position", "Team"]
  },
  teamOutreach: {
    subject: "Partnership Opportunity: Protecting [Team Name] Athletes' Financial Future",
    body: `Dear [Title] [Last Name],

I hope this message finds you well. I'm reaching out regarding an exciting opportunity to support [Team Name] athletes beyond their playing careers.

We've developed the first comprehensive Athlete Wealth & Wellbeing Education Center, addressing the sobering reality that 60% of professional athletes face financial distress within five years of retirement.

Our platform offers:

🎯 **Athlete-Specific Education**
• NIL and endorsement deal analysis
• Tax planning for variable income
• Asset protection strategies
• Career transition support

🛡️ **Mental Health & Wellbeing**
• Post-career depression awareness
• Peer mentor connections
• 24/7 confidential AI support
• Licensed counselor referrals

🤝 **Fiduciary Advisor Network**
• Vetted professionals with athlete experience
• Fee transparency requirements
• No predatory commission structures
• Ongoing relationship monitoring

**Partnership Benefits for [Team Name]:**
• Complimentary access for all players
• Custom team-branded portal
• Financial literacy workshops
• Progress tracking and reporting
• Family education resources

This investment in your players' long-term wellbeing demonstrates [Team Name]'s commitment to their success beyond the game.

I'd love to schedule a brief call to discuss how we can customize this program for your organization.

[Schedule a Call] | [View Demo]

Best regards,
Tony Gomes
Founder, Boutique Family Office

P.S. Several NFL, NBA, and MLB teams have already expressed interest. I'd be happy to share (with permission) how other organizations are implementing this program.`,
    variables: ["Team Name", "Title", "Last Name", "League"]
  },
  agentAdvisor: {
    subject: "Empower Your Athlete Clients with Financial Education & Wellbeing Support",
    body: `Hi [First Name],

As an agent/advisor working with professional athletes, you understand the unique challenges they face:

❌ **The Sobering Statistics:**
• 78% of NFL players go broke within 2 years of retirement
• 60% of NBA players are broke within 5 years
• Poor financial advice and predatory relationships are the leading causes

✅ **The Solution: Athlete Education & Support**
Our Wealth & Wellbeing Center equips your clients with:

**Financial Education**
• 12 interactive modules covering NIL, taxes, contracts, and planning
• Real athlete case studies and lessons learned
• Self-paced learning with progress tracking

**Mental Health Support**
• Career transition guidance and peer mentoring
• 24/7 confidential AI Copilot for emotional support
• Licensed counselor network for crisis intervention

**Fiduciary Advisor Network**
• Vetted professionals with athletic client experience
• Transparent fee structures and fiduciary obligations
• Ongoing relationship monitoring and support

**Benefits for Your Practice:**
🎯 Educated clients make better decisions
🤝 Reduced financial stress improves performance
🛡️ Comprehensive support enhances your value proposition
📈 Client retention through life transitions

**White-Label Options Available**
• Custom branding for your agency
• Co-branded educational content
• Direct integration with your client services

[Schedule a Demo] | [Download Information Packet]

Your clients' financial education and wellbeing can set them—and your practice—apart.

Best regards,
Tony Gomes
Founder, Boutique Family Office`,
    variables: ["First Name", "Agency Name", "Client Types"]
  },
  pressRelease: {
    subject: "FOR IMMEDIATE RELEASE: First Fiduciary-Led Athlete Education Platform Launches",
    body: `FOR IMMEDIATE RELEASE

**Boutique Family Office™ Launches Groundbreaking Athlete & Entertainer Wealth & Wellbeing Center**
*First comprehensive platform addresses financial literacy crisis among professional athletes*

[City, Date] — Boutique Family Office™ today announced the launch of its innovative Athlete & Entertainer Wealth & Wellbeing Center, the first comprehensive educational platform specifically designed to address the financial literacy crisis facing professional athletes and entertainers.

**Addressing a Critical Need**
With 78% of NFL players facing financial distress within two years of retirement and 60% of NBA players going broke within five years, the need for specialized financial education has never been more urgent.

**Platform Features:**
• 12 interactive educational modules covering NIL deals, tax planning, and career transitions
• Mental health and wellbeing support including post-career depression resources
• 24/7 AI-powered Athlete Copilot for confidential guidance
• Vetted network of fiduciary financial advisors
• Privacy-first approach with no upfront personal information required

**Founding Members Program**
The platform launches with a VIP Founding Members program, extending exclusive invitations to athletes across NFL, NBA, MLB, MLS, Olympic sports, and NIL-eligible student-athletes.

"We're not just teaching financial concepts—we're providing a comprehensive support system for athletes' entire journey, from rookie year through retirement and beyond," said Tony Gomes, Founder of Boutique Family Office™.

**Industry Partnerships**
The company is actively seeking partnerships with professional leagues, teams, agents, and athletic departments to expand access to this critical education.

**About Boutique Family Office™**
Boutique Family Office™ specializes in comprehensive wealth management and education services for high-net-worth individuals, with particular expertise in serving professional athletes and entertainers.

For more information about the Athlete & Entertainer Wealth & Wellbeing Center, visit [website] or contact [contact information].

###

Media Contact:
[Name]
[Title]
[Phone]
[Email]`,
    variables: ["City", "Date", "Website", "Contact Information"]
  }
};

export function AthleteEmailTemplates() {
  const [selectedTemplate, setSelectedTemplate] = useState('invitation');
  const [customizations, setCustomizations] = useState({});

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add toast notification here
  };

  const handleCustomizationChange = (variable: string, value: string) => {
    setCustomizations(prev => ({
      ...prev,
      [variable]: value
    }));
  };

  const applyCustomizations = (text: string) => {
    let customized = text;
    Object.entries(customizations).forEach(([variable, value]) => {
      const regex = new RegExp(`\\[${variable}\\]`, 'g');
      customized = customized.replace(regex, value as string);
    });
    return customized;
  };

  const templateTypes = [
    { id: 'invitation', label: 'VIP Invitation', icon: Mail },
    { id: 'followUp', label: 'Follow Up', icon: Send },
    { id: 'teamOutreach', label: 'Team Partnership', icon: Users },
    { id: 'agentAdvisor', label: 'Agent/Advisor', icon: Trophy },
    { id: 'pressRelease', label: 'Press Release', icon: Star }
  ];

  const currentTemplate = emailTemplates[selectedTemplate as keyof typeof emailTemplates];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-6 h-6 text-primary" />
            Athlete Email Templates & Launch Kit
          </CardTitle>
          <p className="text-muted-foreground">
            Customizable email templates for athlete outreach and marketing campaigns
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Template Selection */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Templates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {templateTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Button
                  key={type.id}
                  variant={selectedTemplate === type.id ? "default" : "outline"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setSelectedTemplate(type.id)}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {type.label}
                </Button>
              );
            })}
          </CardContent>
        </Card>

        {/* Template Content */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                {templateTypes.find(t => t.id === selectedTemplate)?.label} Template
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(applyCustomizations(currentTemplate.body))}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Subject Line */}
            <div>
              <Label className="text-sm font-semibold">Subject Line</Label>
              <div className="mt-1 p-3 bg-muted rounded-lg">
                <div className="font-medium">{applyCustomizations(currentTemplate.subject)}</div>
              </div>
            </div>

            {/* Variables Section */}
            {currentTemplate.variables && (
              <div>
                <Label className="text-sm font-semibold mb-3 block">Customization Variables</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentTemplate.variables.map((variable) => (
                    <div key={variable}>
                      <Label className="text-xs">{variable}</Label>
                      <Input
                        placeholder={`Enter ${variable.toLowerCase()}`}
                        value={customizations[variable as keyof typeof customizations] || ''}
                        onChange={(e) => handleCustomizationChange(variable, e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Email Body */}
            <div>
              <Label className="text-sm font-semibold">Email Body</Label>
              <Textarea
                value={applyCustomizations(currentTemplate.body)}
                readOnly
                className="mt-1 min-h-[400px] font-mono text-sm"
              />
            </div>

            {/* Usage Notes */}
            <div className="bg-accent/10 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Usage Notes:</h4>
              <div className="text-sm space-y-1">
                {selectedTemplate === 'invitation' && (
                  <>
                    <p>• Personalize with athlete's name, sport, and team</p>
                    <p>• Include magic link for instant platform access</p>
                    <p>• Best sent during off-season for maximum attention</p>
                  </>
                )}
                {selectedTemplate === 'followUp' && (
                  <>
                    <p>• Send 3-5 days after initial invitation</p>
                    <p>• Reference specific athlete challenges for their sport</p>
                    <p>• Include urgency with VIP access expiration</p>
                  </>
                )}
                {selectedTemplate === 'teamOutreach' && (
                  <>
                    <p>• Research team's current financial education initiatives</p>
                    <p>• Customize benefits to align with team values</p>
                    <p>• Offer pilot program for small group first</p>
                  </>
                )}
                {selectedTemplate === 'agentAdvisor' && (
                  <>
                    <p>• Emphasize client retention and satisfaction benefits</p>
                    <p>• Offer white-label customization options</p>
                    <p>• Include ROI metrics and case studies</p>
                  </>
                )}
                {selectedTemplate === 'pressRelease' && (
                  <>
                    <p>• Distribute to sports media and financial press</p>
                    <p>• Include spokesperson availability for interviews</p>
                    <p>• Time release with major athletic events or seasons</p>
                  </>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button className="flex-1">
                <Send className="w-4 h-4 mr-2" />
                Send Test Email
              </Button>
              <Button variant="outline" className="flex-1">
                <Copy className="w-4 h-4 mr-2" />
                Copy to Clipboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Campaign Performance (Mock Data)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <div className="text-2xl font-bold text-primary">2,847</div>
              <div className="text-sm text-muted-foreground">Emails Sent</div>
            </div>
            <div className="text-center p-4 bg-accent/10 rounded-lg">
              <div className="text-2xl font-bold text-accent">31.2%</div>
              <div className="text-sm text-muted-foreground">Open Rate</div>
            </div>
            <div className="text-center p-4 bg-secondary/10 rounded-lg">
              <div className="text-2xl font-bold text-secondary">8.7%</div>
              <div className="text-sm text-muted-foreground">Click Rate</div>
            </div>
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <div className="text-2xl font-bold text-primary">247</div>
              <div className="text-sm text-muted-foreground">Activations</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}