import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Shield, Trophy, Target, AlertTriangle, Users, DollarSign, Brain, Heart, Star, MessageCircle } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: "Welcome to the Athlete & Entertainer Wealth & Wellbeing Center",
    subtitle: "Your career is just the beginning. Build your legacy for generations.",
    content: (
      <div className="text-center space-y-6">
        <div className="flex justify-center items-center gap-4 mb-6">
          <Shield className="w-12 h-12 text-primary" />
          <Trophy className="w-12 h-12 text-accent" />
          <Target className="w-12 h-12 text-secondary" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Badge variant="outline" className="p-4 h-auto">
            <div className="text-center">
              <Shield className="w-6 h-6 mx-auto mb-2" />
              <div className="font-semibold">Privacy First</div>
            </div>
          </Badge>
          <Badge variant="outline" className="p-4 h-auto">
            <div className="text-center">
              <Trophy className="w-6 h-6 mx-auto mb-2" />
              <div className="font-semibold">World-Class Support</div>
            </div>
          </Badge>
          <Badge variant="outline" className="p-4 h-auto">
            <div className="text-center">
              <Target className="w-6 h-6 mx-auto mb-2" />
              <div className="font-semibold">Real Fiduciary Advice</div>
            </div>
          </Badge>
        </div>
      </div>
    ),
    icon: Shield
  },
  {
    id: 2,
    title: "Your Wealth & Wellness Playbook",
    subtitle: "Unlock each stage—earn badges, build your personal playbook.",
    content: (
      <div className="space-y-6">
        <div className="flex justify-center">
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((level) => (
              <div key={level} className="text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${level <= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  {level <= 2 ? '✓' : level}
                </div>
                <div className="text-xs mt-1">Level {level}</div>
              </div>
            ))}
          </div>
        </div>
        <Progress value={33} className="w-full" />
        <p className="text-center text-muted-foreground">Complete modules to unlock your personalized playbook</p>
      </div>
    ),
    icon: Trophy
  },
  {
    id: 3,
    title: "The Real Stats",
    subtitle: "Why do 60%+ of athletes face financial distress after retiring?",
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-4 bg-destructive/10">
            <div className="text-center">
              <div className="text-3xl font-bold text-destructive">60%</div>
              <div className="text-sm">Athletes face financial distress within 5 years</div>
            </div>
          </Card>
          <Card className="p-4 bg-destructive/10">
            <div className="text-center">
              <div className="text-3xl font-bold text-destructive">78%</div>
              <div className="text-sm">NFL players go broke within 2 years of retirement</div>
            </div>
          </Card>
        </div>
        <div className="text-center p-4 bg-primary/10 rounded-lg">
          <blockquote className="text-lg font-semibold">"Don't become a statistic—take control now."</blockquote>
        </div>
      </div>
    ),
    icon: AlertTriangle
  },
  {
    id: 4,
    title: "Top 10 Wealth Risks for Athletes",
    subtitle: "Self-assess—what are your top 3 risks?",
    content: (
      <div className="space-y-4">
        {[
          "Overspending on lifestyle inflation",
          "Predatory 'friends' and hangers-on",
          "Bad investment advice from unqualified sources",
          "Lack of retirement planning",
          "No emergency fund for career-ending injuries",
          "Excessive family financial support",
          "Poor contract negotiation",
          "Tax planning failures",
          "No asset protection strategies",
          "Mental health neglect affecting decisions"
        ].map((risk, index) => (
          <div key={index} className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <span className="text-sm">{risk}</span>
          </div>
        ))}
      </div>
    ),
    icon: AlertTriangle
  },
  {
    id: 5,
    title: "Building Your Team—Who's On Your Side?",
    subtitle: "Ask these 3 questions before you trust anyone with your money",
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <Users className="w-8 h-8 text-primary mb-2" />
            <h4 className="font-semibold">Fiduciary Advisor</h4>
            <p className="text-sm text-muted-foreground">Legally bound to act in your best interest</p>
          </Card>
          <Card className="p-4">
            <DollarSign className="w-8 h-8 text-accent mb-2" />
            <h4 className="font-semibold">CPA</h4>
            <p className="text-sm text-muted-foreground">Tax planning and preparation</p>
          </Card>
          <Card className="p-4">
            <Shield className="w-8 h-8 text-secondary mb-2" />
            <h4 className="font-semibold">Attorney</h4>
            <p className="text-sm text-muted-foreground">Asset protection and legal structure</p>
          </Card>
        </div>
        <div className="bg-primary/10 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">3 Essential Questions:</h4>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Are you a fiduciary?</li>
            <li>How do you get paid?</li>
            <li>Can I see your credentials and references?</li>
          </ol>
        </div>
      </div>
    ),
    icon: Users
  },
  {
    id: 6,
    title: "Understanding NIL & Endorsements",
    subtitle: "How to evaluate deals and avoid predatory contracts",
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4 bg-accent/10">
            <h4 className="font-semibold text-accent mb-2">✓ Good Deal Signs</h4>
            <ul className="text-sm space-y-1">
              <li>• Clear payment terms</li>
              <li>• Reasonable exclusivity clauses</li>
              <li>• Exit clauses included</li>
              <li>• Brand alignment</li>
            </ul>
          </Card>
          <Card className="p-4 bg-destructive/10">
            <h4 className="font-semibold text-destructive mb-2">⚠ Red Flags</h4>
            <ul className="text-sm space-y-1">
              <li>• Lifetime exclusivity</li>
              <li>• No guaranteed minimums</li>
              <li>• Unclear termination rights</li>
              <li>• Pressure to sign quickly</li>
            </ul>
          </Card>
        </div>
        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-semibold mb-2">Case Study: NIL Gone Wrong</h4>
          <p className="text-sm">Student athlete signs 10-year exclusive deal for $5K upfront, loses $2M in future opportunities...</p>
        </div>
      </div>
    ),
    icon: DollarSign
  },
  {
    id: 7,
    title: "Taxes & Smart Structuring",
    subtitle: "Pay yourself first, plan for taxes always",
    content: (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-destructive">37%</div>
          <div className="text-sm text-muted-foreground">Top tax rate can crush your take-home</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <h4 className="font-semibold mb-2">Income Structuring</h4>
            <p className="text-sm">Salary vs. bonuses vs. deferred compensation</p>
          </Card>
          <Card className="p-4">
            <h4 className="font-semibold mb-2">State Planning</h4>
            <p className="text-sm">Residency strategies to minimize state taxes</p>
          </Card>
          <Card className="p-4">
            <h4 className="font-semibold mb-2">Entity Structuring</h4>
            <p className="text-sm">LLCs, S-Corps for endorsement income</p>
          </Card>
        </div>
        <div className="bg-primary/10 p-4 rounded-lg">
          <div className="font-semibold">Pro Tip:</div>
          <div className="text-sm">Set aside 35-40% of each paycheck for taxes before you spend anything else.</div>
        </div>
      </div>
    ),
    icon: DollarSign
  },
  {
    id: 8,
    title: "Life After the Game—Second Act Success",
    subtitle: "Real athlete stories of successful career transitions",
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <h4 className="font-semibold">Business & Entrepreneurship</h4>
            <p className="text-sm text-muted-foreground">LeBron's media empire, Serena's venture capital</p>
          </Card>
          <Card className="p-4">
            <h4 className="font-semibold">Broadcasting & Media</h4>
            <p className="text-sm text-muted-foreground">Peyton Manning, Charles Barkley, Tony Romo</p>
          </Card>
          <Card className="p-4">
            <h4 className="font-semibold">Coaching & Development</h4>
            <p className="text-sm text-muted-foreground">Steve Kerr, Doc Rivers, coaching trees</p>
          </Card>
          <Card className="p-4">
            <h4 className="font-semibold">Philanthropy & Impact</h4>
            <p className="text-sm text-muted-foreground">JJ Watt's foundation, charitable leadership</p>
          </Card>
        </div>
        <Button className="w-full">Start "Find Your Second Act Purpose" Course</Button>
      </div>
    ),
    icon: Star
  },
  {
    id: 9,
    title: "Mental Health & Wellness After the Game",
    subtitle: "Warning signs and support resources",
    content: (
      <div className="space-y-6">
        <div className="bg-destructive/10 p-4 rounded-lg">
          <h4 className="font-semibold text-destructive mb-2">Warning Signs of Post-Career Depression:</h4>
          <ul className="text-sm space-y-1">
            <li>• Loss of identity and purpose</li>
            <li>• Social isolation from former teammates</li>
            <li>• Financial stress and anxiety</li>
            <li>• Substance abuse as coping mechanism</li>
            <li>• Difficulty finding new passions</li>
          </ul>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4 bg-accent/10">
            <Heart className="w-8 h-8 text-accent mb-2" />
            <h4 className="font-semibold">Peer Mentors</h4>
            <p className="text-sm">Connect with retired athletes who've been there</p>
          </Card>
          <Card className="p-4 bg-secondary/10">
            <MessageCircle className="w-8 h-8 text-secondary mb-2" />
            <h4 className="font-semibold">24/7 Support</h4>
            <p className="text-sm">Confidential AI Copilot for guidance and resources</p>
          </Card>
        </div>
      </div>
    ),
    icon: Brain
  },
  {
    id: 10,
    title: "Family Legacy & Giving Back",
    subtitle: "Your impact is bigger than the game",
    content: (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <Heart className="w-16 h-16 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-semibold">Build Your Family Vault™</h3>
          <p className="text-muted-foreground">Leave video messages and wisdom for future generations</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <h4 className="font-semibold mb-2">Charitable Strategies</h4>
            <ul className="text-sm space-y-1">
              <li>• Donor-advised funds</li>
              <li>• Private foundations</li>
              <li>• Charitable trusts</li>
              <li>• Community impact</li>
            </ul>
          </Card>
          <Card className="p-4">
            <h4 className="font-semibold mb-2">Legacy Building</h4>
            <ul className="text-sm space-y-1">
              <li>• Personal brand development</li>
              <li>• Community involvement</li>
              <li>• Mentorship programs</li>
              <li>• Educational initiatives</li>
            </ul>
          </Card>
        </div>
      </div>
    ),
    icon: Heart
  },
  {
    id: 11,
    title: "Your Confidential Athlete Copilot",
    subtitle: "Available 24/7 for guidance, support, and next steps",
    content: (
      <div className="space-y-6 text-center">
        <MessageCircle className="w-20 h-20 text-primary mx-auto" />
        <div className="space-y-4">
          <p className="text-lg">Get instant support and guidance whenever you need it</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Badge variant="outline" className="p-3 h-auto">
              <div>
                <div className="font-semibold">No Judgment</div>
                <div className="text-xs">Safe space for any question</div>
              </div>
            </Badge>
            <Badge variant="outline" className="p-3 h-auto">
              <div>
                <div className="font-semibold">24/7 Available</div>
                <div className="text-xs">Anytime, anywhere support</div>
              </div>
            </Badge>
            <Badge variant="outline" className="p-3 h-auto">
              <div>
                <div className="font-semibold">Expert Connections</div>
                <div className="text-xs">Link to real advisors when needed</div>
              </div>
            </Badge>
          </div>
        </div>
        <Button size="lg" className="w-full md:w-auto px-8">
          <MessageCircle className="w-4 h-4 mr-2" />
          Chat Now with Copilot
        </Button>
      </div>
    ),
    icon: MessageCircle
  },
  {
    id: 12,
    title: "Next Steps—VIP Ambassador Program",
    subtitle: "Change your future—and your team's",
    content: (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Trophy className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold">VIP Ambassador</span>
            <Trophy className="w-8 h-8 text-primary" />
          </div>
          <p className="text-muted-foreground">Invite your teammates, friends, or family to join the movement</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <Trophy className="w-8 h-8 text-accent mx-auto mb-2" />
            <h4 className="font-semibold">Earn Badges</h4>
            <p className="text-xs text-muted-foreground">Complete challenges and unlock achievements</p>
          </Card>
          <Card className="p-4 text-center">
            <Star className="w-8 h-8 text-primary mx-auto mb-2" />
            <h4 className="font-semibold">Referral Credits</h4>
            <p className="text-xs text-muted-foreground">Rewards for each successful referral</p>
          </Card>
          <Card className="p-4 text-center">
            <Users className="w-8 h-8 text-secondary mx-auto mb-2" />
            <h4 className="font-semibold">Exclusive Events</h4>
            <p className="text-xs text-muted-foreground">VIP access to seminars and networking</p>
          </Card>
        </div>
        <div className="space-y-3">
          <Button className="w-full">Invite Teammates</Button>
          <Button variant="outline" className="w-full">Share on Social Media</Button>
        </div>
      </div>
    ),
    icon: Star
  }
];

export function AthleteOnboardingSlides() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlideData = slides[currentSlide];
  const Icon = currentSlideData.icon;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Icon className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">{currentSlideData.title}</h1>
              <p className="text-muted-foreground">{currentSlideData.subtitle}</p>
            </div>
          </div>
          <Badge variant="outline">
            {currentSlide + 1} of {slides.length}
          </Badge>
        </div>
        <Progress value={((currentSlide + 1) / slides.length) * 100} className="w-full" />
      </div>

      <Card className="mb-6">
        <CardContent className="p-8">
          {currentSlideData.content}
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={prevSlide}
          disabled={currentSlide === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        <Button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}