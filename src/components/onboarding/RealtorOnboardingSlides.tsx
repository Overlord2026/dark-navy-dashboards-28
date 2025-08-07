import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  ChevronLeft,
  ChevronRight,
  Home,
  BarChart3,
  MessageSquare,
  FileText,
  Users,
  Target,
  Crown,
  CheckCircle,
  Calendar,
  TrendingUp,
  Settings,
  Play,
  HelpCircle,
  MapPin,
  Key
} from 'lucide-react';

const realtorSlides = [
  {
    id: 1,
    title: "Welcome to BFO Realty Practice Engine",
    subtitle: "All-in-one platform for modern real estate professionals.",
    content: [
      "Complete property and client management",
      "Visual deal pipeline and conversion tracking",
      "Automated communications and follow-up",
      "Team collaboration and commission tracking"
    ],
    icon: <Home className="h-8 w-8 text-primary" />,
    highlight: "Elevate Your Real Estate Practice"
  },
  {
    id: 2,
    title: "Property & Listing Dashboard",
    content: [
      "Track, manage, and update all properties and listings",
      "Assign properties to family offices or clients",
      "Real-time listing status and market data",
      "Photo management and virtual tour integration"
    ],
    icon: <MapPin className="h-8 w-8 text-primary" />,
    features: ["Property tracking", "Client assignment", "Market data", "Media management"]
  },
  {
    id: 3,
    title: "Deal & Lead Pipeline",
    content: [
      "Visual pipeline from lead to listing to closing",
      "Conversion tracking and deal-stage analytics",
      "Automated stage progression and notifications",
      "Customizable pipeline stages for your workflow"
    ],
    icon: <Target className="h-8 w-8 text-primary" />,
    features: ["Visual pipeline", "Conversion tracking", "Stage automation", "Custom workflows"]
  },
  {
    id: 4,
    title: "Client Communications Suite",
    content: [
      "Bulk SMS/email for showings, offers, status updates",
      "Automated follow-up for new leads and existing clients",
      "Integrated communication history and notes",
      "Multi-channel messaging with response tracking"
    ],
    icon: <MessageSquare className="h-8 w-8 text-primary" />,
    features: ["Bulk messaging", "Automated follow-up", "Communication history", "Multi-channel"]
  },
  {
    id: 5,
    title: "Contract & Compliance Center",
    content: [
      "Store, sign, and share all contracts and disclosures",
      "Calendar for critical dates, lease renewals, compliance deadlines",
      "E-signature integration for faster closings",
      "Compliance tracking and deadline management"
    ],
    icon: <FileText className="h-8 w-8 text-primary" />,
    features: ["Contract storage", "E-signature", "Compliance calendar", "Deadline tracking"]
  },
  {
    id: 6,
    title: "Team & Referral Management",
    content: [
      "Assign team roles, track agent performance, manage commissions",
      "Track referral sources and automate agent/partner payouts",
      "Performance dashboards for team oversight",
      "Referral network expansion and management"
    ],
    icon: <Users className="h-8 w-8 text-primary" />,
    isPremium: true,
    features: ["Team roles", "Performance tracking", "Commission management", "Referral network"]
  },
  {
    id: 7,
    title: "Analytics & Reporting",
    content: [
      "Visualize listings, closings, commissions, pipeline health",
      "Market trend analysis and competitive insights",
      "ROI tracking for marketing campaigns",
      "Custom reports for brokers and team leads"
    ],
    icon: <BarChart3 className="h-8 w-8 text-primary" />,
    features: ["Pipeline analytics", "Market insights", "ROI tracking", "Custom reports"]
  },
  {
    id: 8,
    title: "Premium Real Estate Tools",
    content: [
      "Automated campaign engine for lead generation",
      "Advanced analytics and predictive modeling",
      "Workflow automations for repetitive tasks",
      "Integration with MLS and CRM systems"
    ],
    icon: <Crown className="h-8 w-8 text-primary" />,
    isPremium: true,
    features: ["Campaign automation", "Predictive analytics", "Workflow automation", "MLS integration"]
  },
  {
    id: 9,
    title: "Start Growing Your Practice",
    content: [
      "Import your property listings and client database",
      "Connect with new clients and set up automated workflows",
      "Launch your first referral campaign",
      "Join our network of elite real estate professionals"
    ],
    icon: <CheckCircle className="h-8 w-8 text-primary" />,
    features: ["Data import", "Client connection", "Campaign launch", "Professional network"]
  }
];

interface RealtorOnboardingSlidesProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RealtorOnboardingSlides: React.FC<RealtorOnboardingSlidesProps> = ({
  isOpen,
  onClose
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showDemoVideo, setShowDemoVideo] = useState(false);

  const nextSlide = () => {
    if (currentSlide < realtorSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const currentSlideData = realtorSlides[currentSlide];
  const progress = ((currentSlide + 1) / realtorSlides.length) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Realtor Practice Management Tutorial</span>
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
              <Badge variant="outline">{currentSlide + 1} of {realtorSlides.length}</Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-full">
          <div className="mb-6">
            <Progress value={progress} className="w-full" />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Welcome</span>
              <span>Core Features</span>
              <span>Ready to Sell!</span>
            </div>
          </div>

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

                {currentSlide === realtorSlides.length - 1 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <Home className="h-6 w-6" />
                      Import Properties
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <Users className="h-6 w-6" />
                      Add Clients
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <Target className="h-6 w-6" />
                      Launch Campaign
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <Settings className="h-6 w-6" />
                      Setup Team
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

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

            <div className="flex gap-2">
              {realtorSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            {currentSlide === realtorSlides.length - 1 ? (
              <Button onClick={onClose} className="gap-2">
                Start Selling
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

        {showDemoVideo && (
          <Dialog open={showDemoVideo} onOpenChange={setShowDemoVideo}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Realtor Practice Management Demo</DialogTitle>
              </DialogHeader>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Play className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Realtor Demo Video</h3>
                  <p className="text-muted-foreground mb-4">
                    See how BFO transforms real estate practice management
                  </p>
                  <div className="mt-4 text-sm text-muted-foreground max-w-2xl">
                    <p><strong>Script:</strong> "Welcome to the BFO Realty Practice Engine—your comprehensive platform for property management, deal pipeline tracking, client communications, and team collaboration. Transform your real estate business with automated workflows and powerful analytics."</p>
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