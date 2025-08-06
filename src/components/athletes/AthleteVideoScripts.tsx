import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Video, Download, Copy, Play, MessageCircle, Users } from 'lucide-react';

const videoScripts = {
  welcome: {
    title: "Athlete Welcome & Copilot Tour",
    duration: "60 seconds",
    talent: "Linda AI Copilot",
    script: `Welcome, champion! I'm Linda, your Athlete Copilot, and this is your private Wealth & Wellbeing Center.

[Visual: Platform dashboard with athlete avatars and progress tracking]

Here's what makes this special:

• Start your Playbook—learn how to protect and grow what you've earned
[Visual: Interactive modules and progress badges]

• Book time with mentors, ask anything in our confidential chat
[Visual: Mentor profiles and chat interface]

• Explore smart tax, legacy, and investment strategies
[Visual: Educational modules and planning tools]

• We're here for your whole journey—on and off the field
[Visual: Career timeline from rookie to retirement and beyond]

Invite your teammates, unlock badges, and let's build your legacy together. 

[Visual: Ambassador program and team invitation features]

Ready to win? Let's go!

[CTA: "Start My Journey" button with gold accent]`,
    notes: [
      "Warm, confident tone with athletic energy",
      "Include diverse athlete representation",
      "Emphasize privacy and confidentiality",
      "Show real platform features, not mockups",
      "End with clear call-to-action"
    ]
  },
  demo: {
    title: "Platform Demo Walkthrough",
    duration: "90 seconds",
    talent: "Professional Presenter",
    script: `Professional athletes face unique financial challenges that traditional advisors don't understand.

[Visual: Statistics - 78% of NFL players broke in 2 years]

That's why we created the first comprehensive Athlete Wealth & Wellbeing Center.

[Visual: Platform overview with navigation]

Watch how it works:

STEP 1: Complete your financial readiness assessment
[Visual: Interactive quiz interface]

STEP 2: Access your personalized curriculum
[Visual: Module library with NIL, taxes, career transition]

STEP 3: Connect with your AI Copilot for 24/7 support
[Visual: Chat interface with Linda AI]

STEP 4: Find vetted fiduciary advisors in your area
[Visual: Advisor directory with credentials]

STEP 5: Track progress and earn achievement badges
[Visual: Progress dashboard and badge collection]

This isn't just financial education—it's comprehensive life support for champions.

[Visual: Mental health resources, career transition tools]

Join thousands of athletes who are taking control of their financial future.

[CTA: "Get VIP Access" with urgency element]`,
    notes: [
      "Professional, authoritative tone",
      "Lead with problem, follow with solution",
      "Show actual platform functionality",
      "Include social proof and testimonials",
      "Create urgency without pressure"
    ]
  },
  testimonial: {
    title: "Athlete Success Story",
    duration: "45 seconds",
    talent: "Former Professional Athlete",
    script: `"I wish I had this when I started my career."

[Athlete on camera in casual setting]

"Like most rookies, I thought the money would last forever. Poor advice and bad investments cost me millions.

[Visual: Transition from rookie photos to financial struggles]

The Athlete Wealth Center taught me what I should have known from day one:

• How to evaluate endorsement deals
• The importance of fiduciary advisors
• Planning for life after sports

[Visual: Platform modules and planning tools]

But what I love most is the mental health support. Retiring from sports is harder than people think.

[Visual: Wellbeing resources and peer mentor network]

Now I help other athletes avoid the mistakes I made. This platform is a game-changer.

[Visual: Ambassador program features]

Don't wait until it's too late. Your future self will thank you."

[CTA: Text overlay "Start Your Journey Today"]`,
    notes: [
      "Authentic, personal storytelling",
      "Vulnerability builds trust",
      "Specific examples over generalities",
      "Connect financial and emotional support",
      "Peer-to-peer recommendation power"
    ]
  },
  agent: {
    title: "Sports Agent Partnership Video",
    duration: "75 seconds",
    talent: "Platform Founder/Executive",
    script: `Sports agents: Your clients' success doesn't end when they sign the contract.

[Visual: Agent working with athlete client]

The sobering reality? 60% of professional athletes face financial distress within five years of retirement.

[Visual: Statistics and financial failure stories]

As their agent, you can change that trajectory.

[Visual: Platform partnership dashboard]

Our Athlete Wealth & Wellbeing Center offers:

✓ Comprehensive financial education your clients actually need
[Visual: Curriculum modules and progress tracking]

✓ Mental health support for career transitions
[Visual: Wellbeing resources and counselor network]

✓ White-label customization with your agency branding
[Visual: Custom branded platform example]

✓ Progress tracking and client retention tools
[Visual: Analytics dashboard for agents]

Partnership benefits include:
• Co-branded educational content
• Exclusive agent resources and training
• Revenue sharing opportunities
• Enhanced client value proposition

[Visual: Partnership agreement and benefits]

Your educated clients make better decisions, stay engaged longer, and refer more business.

[Visual: Client success metrics and testimonials]

Ready to differentiate your practice?

[CTA: "Schedule Partnership Demo"]`,
    notes: [
      "Business-focused, ROI-driven messaging",
      "Address agent pain points directly",
      "Show partnership value, not just product features",
      "Include white-label customization options",
      "Emphasize client retention and referral benefits"
    ]
  }
};

export function AthleteVideoScripts() {
  const [selectedScript, setSelectedScript] = useState('welcome');
  const [customNotes, setCustomNotes] = useState('');

  const currentScript = videoScripts[selectedScript as keyof typeof videoScripts];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add toast notification
  };

  const handleExport = () => {
    const exportContent = `
# ${currentScript.title}
**Duration:** ${currentScript.duration}
**Talent:** ${currentScript.talent}

## Script
${currentScript.script}

## Production Notes
${currentScript.notes.map(note => `• ${note}`).join('\n')}

## Custom Notes
${customNotes}
    `;
    
    const blob = new Blob([exportContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentScript.title.replace(/\s+/g, '_')}_Script.md`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="w-6 h-6 text-primary" />
            HeyGen Video Scripts & Production Kit
          </CardTitle>
          <p className="text-muted-foreground">
            Ready-to-use video scripts for athlete onboarding and marketing campaigns
          </p>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedScript} onValueChange={setSelectedScript} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="welcome" className="flex items-center gap-1">
                <MessageCircle className="w-3 h-3" />
                Welcome
              </TabsTrigger>
              <TabsTrigger value="demo" className="flex items-center gap-1">
                <Play className="w-3 h-3" />
                Demo
              </TabsTrigger>
              <TabsTrigger value="testimonial" className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                Testimonial
              </TabsTrigger>
              <TabsTrigger value="agent" className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                Agent
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedScript} className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{currentScript.title}</CardTitle>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline">{currentScript.duration}</Badge>
                        <Badge variant="secondary">{currentScript.talent}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleCopy(currentScript.script)}
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </Button>
                      <Button size="sm" onClick={handleExport}>
                        <Download className="w-4 h-4 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Script:</h4>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <pre className="text-sm whitespace-pre-wrap font-mono">
                        {currentScript.script}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Production Notes:</h4>
                    <ul className="space-y-1">
                      {currentScript.notes.map((note, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="text-primary">•</span>
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Custom Notes:</h4>
                    <Textarea
                      placeholder="Add custom production notes, branding requirements, or specific instructions..."
                      value={customNotes}
                      onChange={(e) => setCustomNotes(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* HeyGen Production Specifications */}
      <Card>
        <CardHeader>
          <CardTitle>HeyGen Production Specifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Video Requirements</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                  1080p HD resolution minimum
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                  16:9 aspect ratio for web
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                  9:16 vertical for social media
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                  Clear audio with minimal background noise
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                  Consistent lighting and framing
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Branding Guidelines</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Dark navy primary background (#0F0F2D)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Gold accent elements and CTAs
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Emerald green for success indicators
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Logo placement in bottom right
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  ADA compliant contrast ratios
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deployment Checklist */}
      <Card className="bg-accent/10">
        <CardHeader>
          <CardTitle>Video Deployment Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Pre-Production</h4>
              <ul className="space-y-1 text-sm">
                <li>☐ Script approval from legal team</li>
                <li>☐ Talent booking and contracts</li>
                <li>☐ Location and equipment setup</li>
                <li>☐ Branding assets prepared</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Production</h4>
              <ul className="space-y-1 text-sm">
                <li>☐ Multiple takes for each section</li>
                <li>☐ B-roll footage captured</li>
                <li>☐ Audio levels monitored</li>
                <li>☐ Screen recordings completed</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Post-Production</h4>
              <ul className="space-y-1 text-sm">
                <li>☐ Final edit with graphics overlay</li>
                <li>☐ Closed captions added</li>
                <li>☐ Multiple format exports</li>
                <li>☐ Quality assurance review</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}