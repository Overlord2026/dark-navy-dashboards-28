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
  CheckCircle
} from 'lucide-react';

interface InsuranceOnboardingSlidesProps {
  isOpen: boolean;
  onClose: () => void;
}

const slides = [
  {
    id: 1,
    title: "Welcome to the BFO Insurance Hub™",
    subtitle: "A Modern Home for Elite Insurance Professionals",
    description: "Deliver outstanding value to families and business clients—all within the Boutique Family Office Marketplace.",
    icon: <Shield className="h-8 w-8 text-primary" />,
    features: [],
    isPremium: false
  },
  {
    id: 2,
    title: "Smart Insurance Dashboard",
    subtitle: "Complete Practice Overview",
    description: "Manage your entire insurance practice from one powerful dashboard.",
    icon: <BarChart3 className="h-8 w-8 text-primary" />,
    features: [
      "Track all clients, policies, quotes, renewals, and commission status in one place",
      "Automated reminders for renewals, CE credits, and regulatory updates",
      "Analytics: production, persistency, cross-sell rates"
    ],
    isPremium: false
  },
  {
    id: 3,
    title: "Multi-Product Quoting & Onboarding",
    subtitle: "Streamlined Sales Process",
    description: "Generate quotes and onboard clients with lightning speed.",
    icon: <FileText className="h-8 w-8 text-primary" />,
    features: [
      "Instantly generate quotes for life, annuity, LTC, disability, and health",
      "Submit applications via e-signature; automated status tracking",
      "Pre-built onboarding templates for clients and households"
    ],
    isPremium: false
  },
  {
    id: 4,
    title: "Compliance & Continuing Education",
    subtitle: "Stay Compliant Automatically",
    description: "Never miss a deadline or requirement again.",
    icon: <CheckCircle className="h-8 w-8 text-primary" />,
    features: [
      "Track CE credits and state licensing renewals automatically",
      "Automated compliance alerts for each agent and state",
      "Store E&O, license docs, and compliance manuals in secure vault"
    ],
    isPremium: true
  },
  {
    id: 5,
    title: "Client Engagement & Communication",
    subtitle: "Seamless Client Connections",
    description: "Keep clients engaged with automated, compliant communications.",
    icon: <MessageCircle className="h-8 w-8 text-primary" />,
    features: [
      "SMS, email, and voice reminders for clients—powered by Twilio",
      "Secure document sharing for policies and claims",
      "Personalized video messaging for key milestones"
    ],
    isPremium: false
  },
  {
    id: 6,
    title: "Agency, IMO, and FMO Tools",
    subtitle: "Team Management Made Simple",
    description: "Recruit, train, and manage your entire organization.",
    icon: <Users className="h-8 w-8 text-primary" />,
    features: [
      "Recruit, onboard, and manage downline agents",
      "Track agent production, compliance, and CE status",
      "Co-op marketing campaign management and lead distribution"
    ],
    isPremium: true
  },
  {
    id: 7,
    title: "Integrated Marketplace & Referral Engine",
    subtitle: "Expand Your Revenue Streams",
    description: "Connect with other professionals and grow through referrals.",
    icon: <TrendingUp className="h-8 w-8 text-primary" />,
    features: [
      "Refer clients for wealth, tax, and legal planning within the platform",
      "Receive leads from CPAs, attorneys, and family office advisors",
      "Earn referral credits and track revenue sharing"
    ],
    isPremium: true
  },
  {
    id: 8,
    title: "Growth & Education Center",
    subtitle: "Continuous Professional Development",
    description: "Access training, resources, and marketing tools.",
    icon: <GraduationCap className="h-8 w-8 text-primary" />,
    features: [
      "Access ongoing training, product updates, and compliance webinars",
      "Marketplace for advanced products (e.g., LTC hybrids, premium finance)",
      "Marketing resources and prebuilt social/email campaigns"
    ],
    isPremium: false
  },
  {
    id: 9,
    title: "Security, Privacy, & Audit Trails",
    subtitle: "Enterprise-Grade Protection",
    description: "Protect your clients and practice with advanced security.",
    icon: <Shield className="h-8 w-8 text-primary" />,
    features: [
      "Role-based access controls for agents, managers, and staff",
      "Full audit logs on all client and agent actions",
      "SOC2, HIPAA, and GDPR-ready data architecture"
    ],
    isPremium: false
  },
  {
    id: 10,
    title: "Get Started",
    subtitle: "Your Insurance Hub Awaits",
    description: "Begin transforming your insurance practice today.",
    icon: <Star className="h-8 w-8 text-primary" />,
    features: [
      "Set Up My Insurance Portal",
      "Add My First Client",
      "Connect with IMO/FMO Concierge"
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
                    <span>This 3-minute tour will show you how to transform your insurance practice</span>
                  </div>
                </div>
              )}

              {currentSlide === slides.length - 1 && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="w-full gap-2">
                    <Shield className="h-4 w-4" />
                    Set Up Portal
                  </Button>
                  <Button variant="outline" className="w-full gap-2">
                    <Users className="h-4 w-4" />
                    Add First Client
                  </Button>
                  <Button variant="outline" className="w-full gap-2">
                    <MessageCircle className="h-4 w-4" />
                    IMO Concierge
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