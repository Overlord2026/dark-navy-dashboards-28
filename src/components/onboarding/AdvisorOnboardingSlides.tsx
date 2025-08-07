import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  ChevronLeft,
  ChevronRight,
  Users,
  BarChart3,
  DollarSign,
  Star,
  Zap,
  FileText,
  MessageSquare,
  Filter,
  Smartphone,
  Crown,
  HelpCircle,
  Play,
  Target,
  TrendingUp,
  Brain,
  Scale,
  Calculator,
  Phone,
  Mail,
  Search,
  CheckCircle
} from 'lucide-react';

interface SlideData {
  id: number;
  title: string;
  subtitle?: string;
  content: string[];
  icon: React.ReactNode;
  features?: string[];
  highlight?: string;
  isPremium?: boolean;
}

const slides: SlideData[] = [
  {
    id: 1,
    title: "Welcome to Your Lead-to-Sales Engine",
    subtitle: "Track, manage, and convert prospects into loyal clients—all in one place.",
    content: [
      "Your complete prospecting solution",
      "Everything you need to grow your practice",
      "Let's take a quick tour of your new superpower"
    ],
    icon: <Target className="h-8 w-8 text-primary" />,
    highlight: "Welcome to the BFO Advisor Platform"
  },
  {
    id: 2,
    title: "Effortless Prospect Management",
    content: [
      "Add and track new prospects in seconds",
      "Filter by source, status, and stage",
      "Export lists for marketing or follow-up",
      "Visual pipeline shows every prospect's journey"
    ],
    icon: <Users className="h-8 w-8 text-primary" />,
    features: ["Quick prospect entry", "Smart filtering", "Pipeline visualization", "Export capabilities"]
  },
  {
    id: 3,
    title: "Pipeline Analytics & Conversion Tracking",
    content: [
      "Real-time stats: Total prospects, meetings, conversions",
      "Visual journey: Initial contact to onboarding",
      "Spot drop-offs and opportunities instantly",
      "See what's working and where to optimize"
    ],
    icon: <BarChart3 className="h-8 w-8 text-primary" />,
    features: ["Real-time analytics", "Conversion tracking", "Drop-off analysis", "Performance insights"]
  },
  {
    id: 4,
    title: "Advanced ROI Dashboard",
    content: [
      "Monitor ad spend by channel (Facebook, LinkedIn, Google, Seminars, Referrals, Webinars)",
      "Track conversion rates and campaign performance",
      "Visualize your marketing ROI and client growth",
      "Make data-driven decisions with confidence"
    ],
    icon: <DollarSign className="h-8 w-8 text-primary" />,
    features: ["Multi-channel tracking", "ROI visualization", "Campaign analytics", "Data-driven insights"]
  },
  {
    id: 5,
    title: "SWAG Lead Score™—Premium Feature",
    content: [
      "Instantly score prospects with our proprietary SWAG algorithm",
      "Prioritize high-value leads",
      "Focus on clients with the most potential",
      "Unlock with Premium subscription"
    ],
    icon: <Star className="h-8 w-8 text-primary" />,
    isPremium: true,
    features: ["Proprietary scoring", "Lead prioritization", "Value assessment", "Premium exclusive"]
  },
  {
    id: 6,
    title: "Campaign Automation Library",
    content: [
      "Launch proven campaigns in one click",
      "Access templates: Retirement Webinars, Estate Planning, Tax Pushes, Business Owner Playbooks",
      "Track campaign ROI and conversions automatically",
      "Edit, duplicate, or create new campaigns"
    ],
    icon: <Zap className="h-8 w-8 text-primary" />,
    features: ["One-click campaigns", "Proven templates", "Auto tracking", "Campaign editor"]
  },
  {
    id: 7,
    title: "Instant Tax Scan & Estate Plan Tools",
    content: [
      "Premium Advisors can instantly:",
      "Scan a client's tax return for planning opportunities",
      "Launch estate planning workflows or refer to in-network attorneys",
      "Provide more value and win trust fast"
    ],
    icon: <FileText className="h-8 w-8 text-primary" />,
    isPremium: true,
    features: ["AI tax scanning", "Estate planning tools", "Opportunity identification", "Trust building"]
  },
  {
    id: 8,
    title: "Prospect & Client Journey Analysis",
    content: [
      "Visualize every step: Contact → Meeting → Questionnaire → Proposal → Decision → Onboarding",
      "Analyze conversion rates at each stage",
      "Identify where to nurture leads or follow up"
    ],
    icon: <TrendingUp className="h-8 w-8 text-primary" />,
    features: ["Journey mapping", "Stage analysis", "Conversion tracking", "Optimization insights"]
  },
  {
    id: 9,
    title: "Multi-Channel Communication Suite",
    content: [
      "Integrated SMS, email, voice (Twilio)",
      "Automated reminders and follow-ups",
      "Seamless communication with prospects and clients",
      "All touchpoints tracked for compliance and optimization"
    ],
    icon: <MessageSquare className="h-8 w-8 text-primary" />,
    features: ["SMS & Email", "Voice integration", "Automated follow-ups", "Compliance tracking"]
  },
  {
    id: 10,
    title: "Powerful Filters & Reporting",
    content: [
      "Search, filter, and sort leads by any field",
      "Generate reports for management and compliance",
      "Bulk actions: assign, export, or update status in seconds"
    ],
    icon: <Filter className="h-8 w-8 text-primary" />,
    features: ["Advanced filtering", "Custom reports", "Bulk operations", "Management tools"]
  },
  {
    id: 11,
    title: "Mobile-Optimized Experience",
    content: [
      "All dashboards and workflows are mobile-ready",
      "Manage your pipeline from your phone or tablet",
      "Instant notifications and updates wherever you are"
    ],
    icon: <Smartphone className="h-8 w-8 text-primary" />,
    features: ["Mobile responsive", "On-the-go access", "Push notifications", "Cross-platform"]
  },
  {
    id: 12,
    title: "Premium Features & Upgrade Path",
    content: [
      "Basic: Prospect tracking, simple analytics, communication tools",
      "Premium: Campaign engine, SWAG scoring, Tax & estate tools, Deep analytics, Team management",
      "Upgrade anytime—unlock your growth!"
    ],
    icon: <Crown className="h-8 w-8 text-primary" />,
    features: ["Tiered access", "Flexible upgrades", "Growth-focused", "Premium benefits"]
  },
  {
    id: 13,
    title: "Get Support—Live Help When You Need It",
    content: [
      "In-app help, knowledgebase, and live chat",
      "FAQ and onboarding videos",
      "Dedicated support for Premium advisors"
    ],
    icon: <HelpCircle className="h-8 w-8 text-primary" />,
    features: ["Live support", "Knowledge base", "Video tutorials", "Premium priority"]
  },
  {
    id: 14,
    title: "Get Started Now!",
    content: [
      "Add your first prospect",
      "Try the campaign library",
      "Explore your ROI dashboard",
      "Reach out if you need help—your success is our mission!"
    ],
    icon: <CheckCircle className="h-8 w-8 text-primary" />,
    features: ["Quick start", "Guided setup", "Immediate value", "Success support"]
  }
];

interface AdvisorOnboardingSlidesProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdvisorOnboardingSlides: React.FC<AdvisorOnboardingSlidesProps> = ({
  isOpen,
  onClose
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showDemoVideo, setShowDemoVideo] = useState(false);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Advisor Lead-to-Sales Engine Tutorial</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDemoVideo(true)}
                className="gap-2"
              >
                <Play className="h-4 w-4" />
                Watch Demo
              </Button>
              <Badge variant="outline">{currentSlide + 1} of {slides.length}</Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-full">
          {/* Progress Bar */}
          <div className="mb-6">
            <Progress value={progress} className="w-full" />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Getting Started</span>
              <span>Features</span>
              <span>Ready to Go!</span>
            </div>
          </div>

          {/* Slide Content */}
          <div className="flex-1 overflow-auto">
            <Card className={`h-full ${currentSlideData.isPremium ? 'border-primary bg-primary/5' : ''}`}>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  {currentSlideData.icon}
                  {currentSlideData.isPremium && (
                    <Crown className="h-5 w-5 text-primary ml-2" />
                  )}
                </div>
                <CardTitle className="text-2xl font-bold">
                  {currentSlideData.title}
                  {currentSlideData.isPremium && (
                    <Badge className="ml-2" variant="default">Premium</Badge>
                  )}
                </CardTitle>
                {currentSlideData.subtitle && (
                  <p className="text-lg text-muted-foreground mt-2">
                    {currentSlideData.subtitle}
                  </p>
                )}
                {currentSlideData.highlight && (
                  <div className="bg-gradient-primary text-white rounded-lg p-4 mt-4">
                    <h3 className="text-xl font-semibold">{currentSlideData.highlight}</h3>
                  </div>
                )}
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-lg mb-3">Key Benefits:</h4>
                    <ul className="space-y-2">
                      {currentSlideData.content.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {currentSlideData.features && (
                    <div>
                      <h4 className="font-semibold text-lg mb-3">Features:</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {currentSlideData.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="justify-start p-2">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Special content for specific slides */}
                {currentSlide === 0 && (
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      This 5-minute tour will show you how to turn prospects into clients and grow your practice with confidence.
                    </p>
                  </div>
                )}

                {currentSlide === slides.length - 1 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <Users className="h-6 w-6" />
                      Add Prospect
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <Zap className="h-6 w-6" />
                      Try Campaigns
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <BarChart3 className="h-6 w-6" />
                      View Analytics
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <HelpCircle className="h-6 w-6" />
                      Get Help
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <Button
              variant="outline"
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            {/* Slide Dots */}
            <div className="flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            {currentSlide === slides.length - 1 ? (
              <Button onClick={onClose} className="gap-2">
                Get Started
                <CheckCircle className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={nextSlide} className="gap-2">
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Demo Video Modal */}
        {showDemoVideo && (
          <Dialog open={showDemoVideo} onOpenChange={setShowDemoVideo}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Lead-to-Sales Engine Demo Video</DialogTitle>
              </DialogHeader>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Play className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Demo Video Coming Soon</h3>
                  <p className="text-muted-foreground">
                    Watch Tony Gomes guide you through the complete Lead-to-Sales Engine
                  </p>
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p>Script: "Welcome to the BFO Advisor Lead-to-Sales Engine—the most powerful, intuitive platform for turning prospects into clients and growing your practice at scale."</p>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
};