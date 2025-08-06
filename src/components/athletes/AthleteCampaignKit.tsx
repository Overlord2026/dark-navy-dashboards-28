import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Mail, MessageSquare, Target, Copy, Download, Calendar } from 'lucide-react';

const campaignContent = {
  agents: {
    title: "Sports Agent Partnership Campaign",
    audience: "Sports Agents & Agencies",
    campaigns: [
      {
        type: "Email Outreach",
        subject: "Unlock VIP Athlete Wealth & Wellness—Your Founders Invitation",
        content: `Hi [Agent Name],

You're invited to join our Athlete & Entertainer Wealth & Wellbeing Center as a VIP founding partner.

**The Challenge:**
• 78% of NFL players go broke within 2 years of retirement
• 60% of NBA players face financial distress within 5 years
• Your clients need more than contract negotiation—they need life-long financial education

**The Solution:**
Empower your clients with our comprehensive platform:

✓ **Real fiduciary guidance** (not commission-based sales)
✓ **Mental health support** for career transitions and post-sport depression
✓ **Post-career planning** including second act careers and business ventures
✓ **24/7 AI Copilot** for confidential guidance and crisis support

**Partnership Benefits:**
🏆 **Your Own Branded Dashboard** - Track client progress and engagement
📊 **Co-host Educational Sessions** - Position your agency as thought leaders
🎯 **Early Ambassador Program Access** - Grow your practice through referrals
💰 **Revenue Sharing Opportunities** - Additional income stream
🔧 **White-Label Customization** - Full platform branding with your agency

**What Makes This Different:**
Unlike traditional financial products, we focus on education first, sales never. Your clients learn to identify trustworthy advisors and avoid predatory relationships.

Your educated clients:
• Make better financial decisions
• Stay engaged with your services longer
• Refer more business to your agency
• Successfully transition to post-sport careers

[Schedule a VIP Partnership Demo]

Ready to differentiate your practice and truly protect your clients' futures?

Best regards,
Tony Gomes
Founder, Boutique Family Office™

P.S. We're limiting founding partnerships to 50 agencies. Several NFL and NBA player associations have already expressed interest.`,
        cta: "Schedule Partnership Demo",
        timing: "Send Tuesday-Thursday, 10 AM - 2 PM EST"
      },
      {
        type: "LinkedIn DM",
        subject: "VIP Athlete Center Partnership",
        content: `Hi [First Name],

We're launching a VIP center for athlete wealth & wellness education—would love to feature your agency as a founding partner.

Key benefits:
• White-label platform with your branding
• Client education that reduces your liability
• New revenue stream + referral opportunities
• Mental health support for career transitions

Interested in early access for your clients?

Best,
Tony`,
        cta: "Yes, tell me more",
        timing: "Business hours, avoid Mondays"
      },
      {
        type: "Cold Call Script",
        subject: "Agent Partnership Phone Script",
        content: `"Hi [Agent Name], this is Tony from Boutique Family Office. Do you have 30 seconds?

I'm calling because I know you work hard to protect your athletes during their careers, but what happens after they retire?

We've created the first comprehensive wealth and wellbeing education platform specifically for athletes, and we're looking for forward-thinking agents like you to be founding partners.

Here's what caught my attention about your practice: [Specific research point about their agency]

The platform helps your clients:
• Avoid the 78% bankruptcy rate that plagues retired NFL players
• Access mental health support during career transitions
• Build second-act careers and business ventures
• Connect only with vetted fiduciary advisors

For agencies like yours, we offer white-label branding, revenue sharing, and tools that actually help retain clients long-term.

Would you be interested in a 15-minute demo to see how this could benefit [Specific client or situation]?"

**Objection Handlers:**
• "We already have financial partners" → "This isn't about replacing anyone—it's about educating your clients to make better choices about who they work with."
• "My clients don't need this" → "I thought the same thing until I learned that [relevant statistic]. Would you like to see the research?"
• "Not interested" → "I understand. Can I ask—what's your biggest concern about your clients' financial futures after they retire?"`,
        cta: "Schedule Demo",
        timing: "Tuesday-Thursday, 9-11 AM or 2-4 PM"
      }
    ]
  },
  athletes: {
    title: "Direct Athlete Outreach Campaign",
    audience: "Professional Athletes & NIL Students",
    campaigns: [
      {
        type: "VIP Invitation Email",
        subject: "Founding Invitation: Athlete Wealth Education—Boutique Family Office™",
        content: `Hi [Athlete Name],

As a champion on and off the field, you've been chosen as a founding member of our Athlete Wealth Education Center.

**Why This Matters:**
You've worked incredibly hard to get where you are, but here's a sobering reality:
• 78% of NFL players go broke within 2 years of retirement
• 60% of NBA players face financial distress within 5 years
• Poor advice and predatory relationships are the leading causes

**You Can Be Different:**
Our team—trusted by families, advisors, and sports professionals—has developed a world-class curriculum and self-assessment tools to help protect your legacy and empower your journey.

**What You'll Get:**
🏆 **12 Interactive Learning Modules**
• NIL and endorsement deal analysis
• Tax planning for variable income
• Mental health support for career transitions
• Building your second act career

🛡️ **24/7 Wellbeing Copilot**
• Confidential AI support for any question
• Crisis resources and peer mentor connections
• No judgment, just guidance

🎯 **Fiduciary Advisor Network**
• Pre-vetted professionals with athlete experience
• No commission salespeople or predatory relationships
• Transparent fees and legal obligations to serve your interests

**Founding Member Benefits:**
• Lifetime VIP access and special badge
• Early access to new features and content
• Invite teammates and earn referral credits
• Shape the future of athlete financial education

[Activate My Athlete Portal] (magic link)

Your privacy is our priority—no SSN required, no pressure, just education and support when you need it.

Ready to join the movement of financially smart athletes?

—Tony Gomes
Founder, Boutique Family Office™

P.S. We're limiting founding memberships to 1,000 athletes. Join champions like [testimonial names if available] who are already building their financial futures.`,
        cta: "Activate My Portal",
        timing: "Off-season preferred, avoid game days"
      },
      {
        type: "Social Media Campaign",
        subject: "Instagram/TikTok Content Series",
        content: `**Post 1: The Reality Check**
Caption: "78% of NFL players go broke within 2 years of retirement. Don't be a statistic. 💪 #AthleteWealth #SmartMoney #BuildYourLegacy"
Visual: Split screen - celebration vs financial struggle

**Post 2: The Education Drop**
Caption: "What they don't teach you in the locker room: How to evaluate NIL deals like a pro 🧠📚 Link in bio for free athlete education. #NILDeals #AthleteEducation"
Visual: Contract analysis graphics

**Post 3: Mental Health Awareness**
Caption: "Retiring from sports hits different. 60% struggle with depression. You're not alone. We're here for life after the game. 🤝❤️ #MentalHealthMatters #LifeAfterSports"
Visual: Support network imagery

**Post 4: Success Stories**
Caption: "From rookie mistakes to financial champion. Every athlete's journey starts with education. What's your next move? 🚀 #AthleteSuccess #FinancialFreedom"
Visual: Transformation timeline

**Post 5: Call to Action**
Caption: "Ready to join 1,000+ athletes building generational wealth? Founding member spots still available. 🏆 #FoundingMember #AthleteCenter"
Visual: Community/team imagery`,
        cta: "Link in Bio",
        timing: "Peak engagement hours by platform"
      }
    ]
  },
  teams: {
    title: "Team & Organization Outreach",
    audience: "Team Management & Player Development",
    campaigns: [
      {
        type: "Partnership Proposal",
        subject: "Partnership Opportunity: Protecting [Team Name] Athletes' Financial Future",
        content: `Dear [Title] [Last Name],

I hope this message finds you well. I'm reaching out regarding an exciting opportunity to support [Team Name] athletes beyond their playing careers.

**The Challenge We're Addressing:**
The statistics are sobering—60% of professional athletes face financial distress within five years of retirement. At [Team Name], you've invested millions in developing these athletes' on-field potential. We'd like to help you protect that investment off the field too.

**Our Solution:**
We've developed the first comprehensive Athlete Wealth & Wellbeing Education Center, addressing the unique challenges your players face:

**🎯 Athlete-Specific Education**
• NIL and endorsement deal analysis
• Tax planning for variable income and multi-state obligations
• Asset protection strategies for high-profile individuals
• Mental health support during career transitions

**🛡️ Fiduciary-Only Network**
• Pre-vetted advisors with legal obligations to serve athlete interests
• No commission-based salespeople or predatory relationships
• Transparent fee structures and ongoing oversight

**❤️ Mental Health & Wellbeing Support**
• Post-career depression awareness and resources
• Peer mentor connections with successful transitions
• 24/7 confidential AI Copilot for guidance
• Licensed counselor network for crisis intervention

**Partnership Benefits for [Team Name]:**
✓ **Complimentary access for all current and former players**
✓ **Custom team-branded portal and resources**
✓ **On-site financial literacy workshops and seminars**
✓ **Progress tracking and reporting for team management**
✓ **Family education resources for spouses and dependents**
✓ **Alumni network engagement and support tools**

**Testimonials from Similar Programs:**
[Include testimonials from other teams or leagues if available]

**Investment in Long-Term Success:**
This partnership demonstrates [Team Name]'s commitment to player wellbeing beyond their playing careers. It's an investment that:
• Reduces player stress and distractions during active careers
• Builds positive relationships with alumni
• Enhances your organization's reputation as player-focused
• Creates long-term goodwill and referral opportunities

**Next Steps:**
I'd love to schedule a brief call to discuss how we can customize this program specifically for [Team Name]. Several NFL, NBA, and MLB organizations have already expressed interest, and I believe [Team Name] would be an ideal founding partner.

[Schedule a Partnership Discussion]

Thank you for your time and consideration. I look forward to the opportunity to support your players' long-term success.

Best regards,
Tony Gomes
Founder, Boutique Family Office™

P.S. We can also arrange for a pilot program with a small group of interested players to demonstrate value before a full team commitment.`,
        cta: "Schedule Partnership Discussion",
        timing: "During off-season planning periods"
      }
    ]
  }
};

export function AthleteCampaignKit() {
  const [selectedCampaign, setSelectedCampaign] = useState('agents');
  const [customizations, setCustomizations] = useState({
    agentName: '',
    teamName: '',
    athleteName: '',
    sport: '',
    customMessage: ''
  });

  const currentCampaign = campaignContent[selectedCampaign as keyof typeof campaignContent];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const applyCustomizations = (text: string) => {
    let customized = text;
    Object.entries(customizations).forEach(([key, value]) => {
      if (value) {
        const placeholder = `[${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}]`;
        customized = customized.replace(new RegExp(placeholder, 'g'), value);
      }
    });
    return customized;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-6 h-6 text-primary" />
            Athlete Campaign & Outreach Kit
          </CardTitle>
          <p className="text-muted-foreground">
            Complete campaign materials for agents, athletes, and team partnerships
          </p>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedCampaign} onValueChange={setSelectedCampaign} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="agents" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Sports Agents
              </TabsTrigger>
              <TabsTrigger value="athletes" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Athletes
              </TabsTrigger>
              <TabsTrigger value="teams" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Teams/Orgs
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedCampaign} className="space-y-6">
              {/* Customization Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Campaign Customization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="agentName">Agent/Contact Name</Label>
                      <Input
                        id="agentName"
                        value={customizations.agentName}
                        onChange={(e) => setCustomizations(prev => ({...prev, agentName: e.target.value}))}
                        placeholder="John Smith"
                      />
                    </div>
                    <div>
                      <Label htmlFor="teamName">Team/Organization</Label>
                      <Input
                        id="teamName"
                        value={customizations.teamName}
                        onChange={(e) => setCustomizations(prev => ({...prev, teamName: e.target.value}))}
                        placeholder="Dallas Cowboys"
                      />
                    </div>
                    <div>
                      <Label htmlFor="athleteName">Athlete Name</Label>
                      <Input
                        id="athleteName"
                        value={customizations.athleteName}
                        onChange={(e) => setCustomizations(prev => ({...prev, athleteName: e.target.value}))}
                        placeholder="Mike Johnson"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Campaign Content */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">{currentCampaign.title}</h3>
                  <Badge variant="outline">Target: {currentCampaign.audience}</Badge>
                </div>

                {currentCampaign.campaigns.map((campaign, index) => (
                  <Card key={index} className="border-l-4 border-l-primary">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            {campaign.type === 'Email Outreach' && <Mail className="w-5 h-5" />}
                            {campaign.type === 'LinkedIn DM' && <MessageSquare className="w-5 h-5" />}
                            {campaign.type === 'Cold Call Script' && <Users className="w-5 h-5" />}
                            {campaign.type === 'VIP Invitation Email' && <Mail className="w-5 h-5" />}
                            {campaign.type === 'Social Media Campaign' && <MessageSquare className="w-5 h-5" />}
                            {campaign.type === 'Partnership Proposal' && <Users className="w-5 h-5" />}
                            {campaign.type}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            <strong>Subject:</strong> {campaign.subject}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy(applyCustomizations(campaign.content))}
                        >
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm font-semibold">Content:</Label>
                        <Textarea
                          value={applyCustomizations(campaign.content)}
                          readOnly
                          className="mt-2 min-h-[300px] font-mono text-sm"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-4">
                          <Badge variant="secondary" className="text-xs">
                            CTA: {campaign.cta}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Timing: {campaign.timing}
                          </Badge>
                        </div>
                        <Button size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          Export Campaign
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Campaign Performance Tracking */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <div className="text-2xl font-bold text-primary">1,247</div>
              <div className="text-sm text-muted-foreground">Emails Sent</div>
            </div>
            <div className="text-center p-4 bg-accent/10 rounded-lg">
              <div className="text-2xl font-bold text-accent">28.3%</div>
              <div className="text-sm text-muted-foreground">Open Rate</div>
            </div>
            <div className="text-center p-4 bg-secondary/10 rounded-lg">
              <div className="text-2xl font-bold text-secondary">12.1%</div>
              <div className="text-sm text-muted-foreground">Response Rate</div>
            </div>
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <div className="text-2xl font-bold text-primary">89</div>
              <div className="text-sm text-muted-foreground">Partnerships</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Launch Timeline */}
      <Card className="bg-accent/10">
        <CardHeader>
          <CardTitle>Campaign Launch Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-background rounded-lg">
              <Badge variant="outline">Week 1</Badge>
              <div>
                <div className="font-semibold">Sports Agent Outreach</div>
                <div className="text-sm text-muted-foreground">Target top 50 agencies with partnership proposals</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-background rounded-lg">
              <Badge variant="outline">Week 2</Badge>
              <div>
                <div className="font-semibold">Team Partnership Pitches</div>
                <div className="text-sm text-muted-foreground">Present to player development departments</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-background rounded-lg">
              <Badge variant="outline">Week 3</Badge>
              <div>
                <div className="font-semibold">Direct Athlete Invitations</div>
                <div className="text-sm text-muted-foreground">VIP founding member campaign launch</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-background rounded-lg">
              <Badge variant="outline">Week 4</Badge>
              <div>
                <div className="font-semibold">Social Media & PR Blitz</div>
                <div className="text-sm text-muted-foreground">Public launch and media coverage</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}