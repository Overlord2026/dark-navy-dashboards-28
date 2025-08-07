import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Shield, 
  FileText, 
  BarChart3, 
  Users, 
  MessageCircle, 
  GraduationCap,
  Crown,
  PlayCircle,
  Calendar,
  Star,
  TrendingUp,
  CheckCircle,
  DollarSign,
  Vault,
  Target,
  Award
} from 'lucide-react';

interface InsuranceOnboardingSlidesProps {
  isOpen: boolean;
  onClose: () => void;
}

const slides = [
  {
    id: 1,
    title: "Welcome to Your Insurance Practice Hub™",
    subtitle: "Power Up Your Insurance Business—The Family Office Way",
    description: "A premium platform for agents, IMOs, and FMOs to scale, automate, and serve families and business owners with trust and compliance.",
    icon: <Shield className="h-8 w-8 text-primary" />,
    features: [],
    isPremium: false
  },
  {
    id: 2,
    title: "Centralized Client Management",
    subtitle: "All Your Clients in One Place",
    description: "Unified dashboard for managing your entire book of business.",
    icon: <Users className="h-8 w-8 text-primary" />,
    features: [
      "Unified dashboard for all clients, prospects, and policyholders",
      "Quick access to case notes, insurance documents, communications, and reminders",
      "Client segmentation (by product, risk, renewal date, or custom tags)"
    ],
    isPremium: false
  },
  {
    id: 3,
    title: "Digital Policy Vault & Secure Sharing",
    subtitle: "Secure Document Management",
    description: "Store, organize, and share policies with bank-level security.",
    icon: <Vault className="h-8 w-8 text-primary" />,
    features: [
      "Store and retrieve life, health, annuity, LTC, disability, and business policies",
      "Secure document vault with client and advisor permission controls",
      "Instant policy sharing and e-signature requests for quick action"
    ],
    isPremium: false
  },
  {
    id: 4,
    title: "Automated Lead-to-Sale Engine",
    subtitle: "AI-Powered Prospecting",
    description: "Transform prospects into clients with intelligent automation.",
    icon: <Target className="h-8 w-8 text-primary" />,
    features: [
      "Run campaigns, track leads, and monitor your entire sales funnel",
      "AI-powered SWAG Lead Score™ for high-value prospecting",
      "Automated reminders, meeting scheduling, and lead source analytics"
    ],
    isPremium: true
  },
  {
    id: 5,
    title: "Compliance & Licensing Automation",
    subtitle: "Stay Compliant Effortlessly",
    description: "Never miss a deadline or requirement with automated tracking.",
    icon: <CheckCircle className="h-8 w-8 text-primary" />,
    features: [
      "Real-time CE tracking, multi-state licensing alerts, and renewal reminders",
      "Automated compliance documentation and audit logs",
      "Mock audit center for regulatory readiness (SOC2, DOL, NAIC, etc.)"
    ],
    isPremium: true
  },
  {
    id: 6,
    title: "Commission, Revenue & Growth Analytics",
    subtitle: "Real-Time Performance Insights",
    description: "Track commissions, production, and downline performance.",
    icon: <DollarSign className="h-8 w-8 text-primary" />,
    features: [
      "View real-time commission reports and production dashboards",
      "Track downline performance for IMOs/FMOs",
      "Exportable analytics for payroll, override, and bonus calculations"
    ],
    isPremium: false
  },
  {
    id: 7,
    title: "Marketplace & Concierge Services",
    subtitle: "Premium Professional Network",
    description: "Access elite partners and white-glove support services.",
    icon: <Award className="h-8 w-8 text-primary" />,
    features: [
      "Access curated partners for health, annuity, and wealth solutions",
      "Connect with top CPAs, attorneys, and family offices for joint cases",
      "Request custom illustrations, case design, or premium finance support"
    ],
    isPremium: true
  },
  {
    id: 8,
    title: "Integrated Communication Suite",
    subtitle: "Seamless Client Connections",
    description: "Multi-channel communications with AI assistance.",
    icon: <MessageCircle className="h-8 w-8 text-primary" />,
    features: [
      "Send SMS, email, or VOIP calls to clients in one click",
      "Automated meeting confirmations and reminders via \"Linda\" AI assistant",
      "Click-to-call, click-to-text, and compliance-logged communications"
    ],
    isPremium: false
  },
  {
    id: 9,
    title: "White-Label and VIP Growth Opportunities",
    subtitle: "Scale Your Practice",
    description: "Brand your portal and grow your organization.",
    icon: <Crown className="h-8 w-8 text-primary" />,
    features: [
      "Offer your own branded portal to agents or clients",
      "Early-adopter \"VIP Wall\" recognition and referral credits",
      "Tiered access for downline agents and partner firms"
    ],
    isPremium: true
  },
  {
    id: 10,
    title: "Get Started",
    subtitle: "Launch Your Insurance Hub Today",
    description: "Begin transforming your insurance practice in minutes.",
    icon: <Star className="h-8 w-8 text-primary" />,
    features: [
      "Add Your Book of Business",
      "Set Up Policy Vault",
      "Invite Downline / Team",
      "Schedule Concierge Onboarding"
    ],
    isPremium: false
  }
];

export const InsuranceOnboardingSlides: React.FC<InsuranceOnboardingSlidesProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const progress = ((currentSlide + 1) / slides.length) * 100;

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl">Insurance Hub Walkthrough</DialogTitle>
                <p className="text-sm text-muted-foreground">Slide {currentSlide + 1} of {slides.length}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Progress value={progress} className="mt-4" />
        </DialogHeader>

        <div className="p-6 pt-0">
          <Card className="border-0 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                {currentSlideData.icon}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold">{currentSlideData.title}</h2>
                    {currentSlideData.isPremium && (
                      <Badge variant="default" className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
                        <Crown className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-primary">{currentSlideData.subtitle}</h3>
                  <p className="text-muted-foreground">{currentSlideData.description}</p>
                </div>
              </div>

              {currentSlideData.features.length > 0 && (
                <div className="space-y-3">
                  {currentSlideData.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="mt-1">
                        <div className="h-2 w-2 bg-primary rounded-full" />
                      </div>
                      <span className="text-sm leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              )}

              {currentSlide === 0 && (
                <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <PlayCircle className="h-4 w-4 text-primary" />
                    <span>This 3-minute tour will show you how to power up your insurance business the family office way</span>
                  </div>
                </div>
              )}

              {currentSlide === slides.length - 1 && (
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button className="w-full gap-2 text-xs">
                    <FileText className="h-4 w-4" />
                    Add Book of Business
                  </Button>
                  <Button variant="outline" className="w-full gap-2 text-xs">
                    <Vault className="h-4 w-4" />
                    Set Up Vault
                  </Button>
                  <Button variant="outline" className="w-full gap-2 text-xs">
                    <Users className="h-4 w-4" />
                    Invite Team
                  </Button>
                  <Button variant="outline" className="w-full gap-2 text-xs">
                    <Calendar className="h-4 w-4" />
                    Schedule Onboarding
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Navigation */}
        <div className="p-6 pt-0">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
              className="gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};