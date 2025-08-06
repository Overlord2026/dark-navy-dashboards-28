import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Image, Presentation } from 'lucide-react';

const slideContent = [
  {
    id: 1,
    title: "Welcome to Your Athlete Wealth & Wellbeing Center",
    subtitle: "Your career is just the beginning. Build your legacy for generations.",
    bullets: [
      "Privacy-first platform designed for champions",
      "World-class financial education and support",
      "Connect with vetted fiduciary advisors",
      "24/7 wellbeing support and guidance"
    ],
    cta: "Start Your Journey",
    designNotes: "Hero image: Diverse athletes in action, gold shield badge overlay, navy gradient background"
  },
  {
    id: 2,
    title: "Unlock Your Playbook—Track Your Progress",
    subtitle: "Earn badges, complete modules, build your personalized financial game plan",
    bullets: [
      "Interactive progress tracking system",
      "Achievement badges for completed modules",
      "Personalized learning recommendations",
      "Gamified experience with team challenges"
    ],
    cta: "View My Progress",
    designNotes: "Progress bar graphic, badge collection display, playbook visual metaphor"
  },
  {
    id: 3,
    title: "Why Most Athletes Lose Out (And How to Win)",
    subtitle: "Don't become a statistic—take control of your financial future now",
    bullets: [
      "78% of NFL players go broke within 2 years",
      "60% of NBA players face financial distress in 5 years",
      "Poor advice and predatory relationships are leading causes",
      "You can break the cycle with proper education"
    ],
    cta: "Learn the Real Stats",
    designNotes: "Infographic with stark statistics, before/after scenarios, warning triangle icons"
  },
  {
    id: 4,
    title: "Top 10 Wealth Risks—Spot Yours Early",
    subtitle: "Self-assess your biggest financial threats and learn to avoid them",
    bullets: [
      "Lifestyle inflation and overspending",
      "Predatory 'friends' and hangers-on",
      "Bad investment advice from unqualified sources",
      "Poor contract negotiation and planning"
    ],
    cta: "Take Risk Assessment",
    designNotes: "Risk assessment checklist, warning icons, interactive self-evaluation tool"
  },
  {
    id: 5,
    title: "Build Your All-Star Team",
    subtitle: "Ask these 3 questions before trusting anyone with your money",
    bullets: [
      "Are you a fiduciary? (legally bound to your best interest)",
      "How do you get paid? (fee vs. commission transparency)",
      "Can I see credentials and references?",
      "Build your dream team: CPA, Attorney, Fiduciary Advisor"
    ],
    cta: "Find My Team",
    designNotes: "Team building visual, advisor profile cards, credential verification badges"
  },
  {
    id: 6,
    title: "Demystify NIL & Endorsements",
    subtitle: "Evaluate deals like a pro and avoid predatory contracts",
    bullets: [
      "Red flags: Lifetime exclusivity, no guaranteed minimums",
      "Green flags: Clear payment terms, reasonable clauses",
      "Contract analysis tools and checklists",
      "Real case studies of deals gone wrong and right"
    ],
    cta: "Analyze My Deal",
    designNotes: "Contract document graphics, red/green flag indicators, deal comparison charts"
  },
  {
    id: 7,
    title: "Avoid Tax Surprises—Plan Like a Pro",
    subtitle: "Pay yourself first, plan for taxes always",
    bullets: [
      "Set aside 35-40% of each paycheck for taxes",
      "Income structuring: Salary vs. bonuses vs. deferred",
      "State residency strategies to minimize taxes",
      "Entity structuring for endorsement income"
    ],
    cta: "Start Tax Planning",
    designNotes: "Tax calculator interface, percentage breakdowns, state comparison maps"
  },
  {
    id: 8,
    title: "Your Next Act—Beyond the Game",
    subtitle: "Real athlete success stories of career transitions",
    bullets: [
      "Business & Entrepreneurship: LeBron, Serena",
      "Broadcasting & Media: Peyton, Charles, Tony Romo",
      "Coaching & Development: Steve Kerr, Doc Rivers",
      "Philanthropy & Impact: JJ Watt's foundation leadership"
    ],
    cta: "Find My Second Act",
    designNotes: "Success story carousel, career pathway diagrams, inspiration quotes"
  },
  {
    id: 9,
    title: "Mental Health: Play Strong After You Play",
    subtitle: "Warning signs, support resources, and peer connections",
    bullets: [
      "Post-career depression affects 60% of retired athletes",
      "Warning signs: identity loss, isolation, financial stress",
      "Peer mentor network of successful transitions",
      "24/7 confidential AI support and crisis resources"
    ],
    cta: "Access Support",
    designNotes: "Mental health awareness graphics, support network visuals, crisis hotline info"
  },
  {
    id: 10,
    title: "Family Vault™: Protect Your Legacy",
    subtitle: "Your impact is bigger than the game",
    bullets: [
      "Record video messages for future generations",
      "Charitable giving strategies and impact",
      "Family education and financial literacy",
      "Generational wealth building principles"
    ],
    cta: "Build My Vault",
    designNotes: "Family tree graphics, legacy timeline, video recording interface mockup"
  },
  {
    id: 11,
    title: "Copilot—24/7 Support & Guidance",
    subtitle: "Available anytime for guidance, support, and expert connections",
    bullets: [
      "No judgment zone—safe space for any question",
      "Available 24/7, anywhere you need support",
      "Connects you to real advisors when needed",
      "Confidential, secure, and athlete-focused"
    ],
    cta: "Chat with Copilot",
    designNotes: "Chatbot interface, 24/7 availability badge, privacy/security icons"
  },
  {
    id: 12,
    title: "Share & Lead—Ambassador Program",
    subtitle: "Change your future—and your team's",
    bullets: [
      "Invite teammates and earn exclusive badges",
      "Referral credits and VIP event access",
      "Ambassador leaderboard and recognition",
      "Help build the next generation of smart athletes"
    ],
    cta: "Become an Ambassador",
    designNotes: "Ambassador badge collection, leaderboard display, team invitation interface"
  }
];

export function AthleteSlideContent() {
  const handleExport = (format: string) => {
    console.log(`Exporting slides as ${format}`);
    // Implementation would generate the requested format
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Presentation className="w-6 h-6 text-primary" />
            Athlete Onboarding Slide Content
          </CardTitle>
          <p className="text-muted-foreground">
            Complete copy for 12-slide onboarding experience with design specifications
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 mb-6">
            <Button onClick={() => handleExport('PDF')} className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Export PDF
            </Button>
            <Button onClick={() => handleExport('PNG')} variant="outline" className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              Export PNG
            </Button>
            <Button onClick={() => handleExport('PowerPoint')} variant="outline" className="flex items-center gap-2">
              <Presentation className="w-4 h-4" />
              Export PPT
            </Button>
          </div>

          <div className="space-y-6">
            {slideContent.map((slide) => (
              <Card key={slide.id} className="border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">Slide {slide.id}</Badge>
                    <Badge variant="secondary">ADA Compliant</Badge>
                  </div>
                  <CardTitle className="text-xl">{slide.title}</CardTitle>
                  <p className="text-lg text-muted-foreground font-medium">{slide.subtitle}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Key Points:</h4>
                    <ul className="space-y-1">
                      {slide.bullets.map((bullet, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          <span className="text-sm">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <Button size="sm" className="bg-primary text-primary-foreground">
                      {slide.cta}
                    </Button>
                    <Badge variant="outline" className="text-xs">
                      Dark Navy/Gold Theme
                    </Badge>
                  </div>

                  <div className="bg-muted/50 p-3 rounded-lg">
                    <h5 className="text-xs font-semibold text-muted-foreground mb-1">DESIGN NOTES:</h5>
                    <p className="text-xs text-muted-foreground">{slide.designNotes}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-6 bg-accent/10">
            <CardHeader>
              <CardTitle className="text-lg">Export Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">PDF Export</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• High resolution (300 DPI)</li>
                    <li>• ADA compliant contrast ratios</li>
                    <li>• Embedded fonts and graphics</li>
                    <li>• Print-ready format</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">PNG Export</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• 1920x1080 resolution</li>
                    <li>• Transparent backgrounds option</li>
                    <li>• Web-optimized compression</li>
                    <li>• Individual slide files</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">PowerPoint Export</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Editable text and graphics</li>
                    <li>• Animation transitions included</li>
                    <li>• Master slide template</li>
                    <li>• Speaker notes included</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}