import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Crown, Users, TrendingUp, Gift, Star, CheckCircle, ArrowRight, Download, MessageSquare } from 'lucide-react';

interface SlideData {
  id: number;
  title: string;
  content: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const AdvisorOnboardingSlides: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [completedSlides, setCompletedSlides] = useState<Set<number>>(new Set());

  const slides: SlideData[] = [
    {
      id: 1,
      title: "Welcome to Your Founding Advisor Dashboard",
      content: (
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Crown className="h-12 w-12 text-gold" />
            <Badge variant="outline" className="text-lg px-4 py-2 border-gold text-gold">
              Founding Member
            </Badge>
          </div>
          <h2 className="text-3xl font-bold mb-4">Welcome, [Advisor Name]!</h2>
          <p className="text-xl text-muted-foreground mb-6">
            You're a Founding Member of the Boutique Family Office Platform™
          </p>
          <div className="bg-gradient-to-r from-gold/10 to-primary/10 p-6 rounded-lg">
            <h3 className="font-semibold mb-3">Quick-Start Checklist:</h3>
            <div className="space-y-2 text-left">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Invite your clients</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Set up your digital practice</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Customize your dashboard</span>
              </div>
            </div>
          </div>
        </div>
      ),
      action: {
        label: "Let's Get Started",
        onClick: () => setCurrentSlide(1)
      }
    },
    {
      id: 2,
      title: "How It Works for Advisors",
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Onboard Your Book</h3>
              <p className="text-sm text-muted-foreground">
                Import your clients in one click (CSV import or magic link)
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Custom Branding</h3>
              <p className="text-sm text-muted-foreground">
                Your clients see you, not a faceless tech stack
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Automated Compliance</h3>
              <p className="text-sm text-muted-foreground">
                Digital vault for client docs and automated workflows
              </p>
            </div>
          </div>
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Key Features:</h4>
            <ul className="space-y-1 text-sm">
              <li>• Branded client portal with your logo and colors</li>
              <li>• Automated onboarding workflows</li>
              <li>• Secure document management and e-signatures</li>
              <li>• Compliance tracking and reporting</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "What Clients Experience",
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold mb-4">Your Clients Get Premium Experience</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium">Secure Digital Vault</h4>
                  <p className="text-sm text-muted-foreground">
                    All assets, docs, and investments in one place
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Star className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium">Premium Education</h4>
                  <p className="text-sm text-muted-foreground">
                    Family office services and financial education
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium">Elite Network Access</h4>
                  <p className="text-sm text-muted-foreground">
                    Connect with top advisors and exclusive opportunities
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gold/10 rounded-lg">
                <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium">Investment Opportunities</h4>
                  <p className="text-sm text-muted-foreground">
                    Access to exclusive investment products and deals
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Rewards & Referral Credits",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <Gift className="h-16 w-16 text-gold mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Earn While You Grow</h3>
            <p className="text-muted-foreground">
              Get rewarded for building the community
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-gold/10 to-gold/20 p-4 rounded-lg border border-gold/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-gold mb-1">50</div>
                <div className="text-sm text-muted-foreground">Credits per client</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">25</div>
                <div className="text-sm text-muted-foreground">Credits per referral</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">2x</div>
                <div className="text-sm text-muted-foreground">Founder multiplier</div>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-3">Reward Tiers:</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">100 Credits</span>
                <Badge variant="outline">3 Months Free</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">250 Credits</span>
                <Badge variant="outline">6 Months Free</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">500 Credits</span>
                <Badge variant="outline">1 Year Free</Badge>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Badge variant="outline" className="text-lg px-4 py-2">
              🏆 VIP Leaderboard Recognition
            </Badge>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Support & Community",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <MessageSquare className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">You're Never Alone</h3>
            <p className="text-muted-foreground">
              Premium support and community access
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Crown className="h-4 w-4 text-gold" />
                  Founders Chat
                </h4>
                <p className="text-sm text-muted-foreground">
                  Exclusive support channel for founding members
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  Fast-Track Feedback
                </h4>
                <p className="text-sm text-muted-foreground">
                  Direct line to development team for feature requests
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Star className="h-4 w-4 text-purple-600" />
                  Training Hub
                </h4>
                <p className="text-sm text-muted-foreground">
                  Short videos, demo scripts, and help center
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-600" />
                  Community Events
                </h4>
                <p className="text-sm text-muted-foreground">
                  Monthly founder calls and networking events
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
            <div className="text-center">
              <h4 className="font-semibold mb-2">24/7 AI Assistant</h4>
              <p className="text-sm text-muted-foreground mb-4">
                "Hi! I'm Linda, your AI assistant. I'm here to help you navigate the platform, 
                answer questions about features, and provide support whenever you need it."
              </p>
              <Badge variant="outline" className="bg-white">
                Always Available • Never Sleeps • Always Learning
              </Badge>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "Start Now",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <ArrowRight className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Ready to Launch?</h3>
            <p className="text-muted-foreground">
              Take these next steps to activate your VIP practice
            </p>
          </div>

          <div className="grid gap-4">
            <Button size="lg" className="flex items-center justify-between p-6 h-auto">
              <div className="text-left">
                <div className="font-semibold">Invite Clients</div>
                <div className="text-sm opacity-80">Send magic links to your book of business</div>
              </div>
              <ArrowRight className="h-5 w-5" />
            </Button>
            
            <Button size="lg" variant="outline" className="flex items-center justify-between p-6 h-auto">
              <div className="text-left">
                <div className="font-semibold">Import Book</div>
                <div className="text-sm opacity-80">Upload CSV of your existing clients</div>
              </div>
              <ArrowRight className="h-5 w-5" />
            </Button>
            
            <Button size="lg" variant="outline" className="flex items-center justify-between p-6 h-auto">
              <div className="text-left">
                <div className="font-semibold">Customize Dashboard</div>
                <div className="text-sm opacity-80">Brand your portal with logo and colors</div>
              </div>
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>

          <div className="bg-gradient-to-r from-gold/10 to-primary/10 p-6 rounded-lg text-center">
            <h4 className="font-semibold mb-2">Need Help Getting Started?</h4>
            <p className="text-sm text-muted-foreground mb-4">
              "Questions? Linda, our AI assistant, is here for you 24/7."
            </p>
            <Button variant="outline" size="sm">
              Chat with Linda
            </Button>
          </div>

          <div className="text-center">
            <Badge variant="outline" className="text-lg px-6 py-2">
              🎉 Welcome to the Founding Family!
            </Badge>
          </div>
        </div>
      ),
      action: {
        label: "Complete Onboarding",
        onClick: () => {
          setCompletedSlides(new Set([...completedSlides, currentSlide]));
          // Navigate to dashboard or next step
        }
      }
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCompletedSlides(new Set([...completedSlides, currentSlide]));
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const currentSlideData = slides[currentSlide];
  const progress = ((currentSlide + 1) / slides.length) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="min-h-[600px]">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-gold" />
                Advisor Onboarding
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Slide {currentSlide + 1} of {slides.length}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="h-3 w-3" />
                Export to Canva
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="h-3 w-3" />
                Export to Figma
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex gap-1">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 flex-1 rounded ${
                    index === currentSlide
                      ? 'bg-primary'
                      : index <= currentSlide || completedSlides.has(index)
                      ? 'bg-green-500'
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <div className="min-h-[400px]">
            <h2 className="text-2xl font-bold mb-6 text-center">
              {currentSlideData.title}
            </h2>
            {currentSlideData.content}
          </div>
        </CardContent>

        <div className="flex items-center justify-between p-6 border-t">
          <Button
            variant="outline"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full ${
                  index === currentSlide
                    ? 'bg-primary'
                    : 'bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>

          {currentSlideData.action ? (
            <Button
              onClick={currentSlideData.action.onClick}
              className="flex items-center gap-2"
            >
              {currentSlideData.action.label}
              <CheckCircle className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};