import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Users,
  Shield,
  BarChart3,
  MessageSquare,
  Target,
  Crown,
  CheckCircle,
  Calendar,
  Stethoscope,
  Brain,
  Settings,
  Play,
  HelpCircle,
  FileText,
  Lock
} from 'lucide-react';

const healthcareSlides = [
  {
    id: 1,
    title: "Welcome to the Family Office Health Hub™",
    subtitle: "Transforming Healthcare Management for Elite Providers",
    content: [
      "Centralize patient and practice management",
      "HIPAA-compliant communication and documentation",
      "Exclusive health marketplace access",
      "Legacy health vault for families"
    ],
    icon: <Stethoscope className="h-8 w-8 text-primary" />,
    highlight: "World's Only Boutique Health & Wealth Platform"
  },
  {
    id: 2,
    title: "Digital Front Desk Enhancement",
    content: [
      "Manage patient/household onboarding in one secure hub",
      "Invite clients/patients with a single click—track status in real time",
      "Secure, HIPAA-compliant communication and document exchange",
      "Automated appointment scheduling and reminders"
    ],
    icon: <Users className="h-8 w-8 text-primary" />,
    features: ["Secure onboarding", "Real-time tracking", "HIPAA compliance", "Auto scheduling"]
  },
  {
    id: 3,
    title: "Healthspan & Longevity Tools",
    content: [
      "Add wellness services (cancer screening, epigenetics, preventive testing)",
      "Schedule screenings and integrate results into each patient portal",
      "Enable families to share key results with trusted advisors and doctors",
      "Advanced biomarker tracking and trend analysis"
    ],
    icon: <Brain className="h-8 w-8 text-primary" />,
    features: ["Wellness services", "Screening integration", "Family sharing", "Biomarker tracking"]
  },
  {
    id: 4,
    title: "Practice Management Suite",
    content: [
      "Automated scheduling & reminders (SMS, phone, email)",
      "Custom intake forms and medical histories",
      "Role-based dashboards for doctors, staff, and admin",
      "Secure billing and payment management"
    ],
    icon: <Calendar className="h-8 w-8 text-primary" />,
    features: ["Auto scheduling", "Custom forms", "Role-based access", "Secure billing"]
  },
  {
    id: 5,
    title: "Marketplace & Collaboration",
    content: [
      "List your services in the exclusive Health Marketplace",
      "Offer telehealth, longevity consults, and specialty testing",
      "Network with trusted wealth/family office professionals",
      "Collaborative care coordination platform"
    ],
    icon: <Target className="h-8 w-8 text-primary" />,
    isPremium: true,
    features: ["Health marketplace", "Telehealth platform", "Professional network", "Care coordination"]
  },
  {
    id: 6,
    title: "Patient-Centric Legacy Vault",
    content: [
      "Each family receives a secure digital vault",
      "Store and share test results, advance directives, health records",
      "Event-driven access for caregivers and next-of-kin",
      "Generational health data preservation"
    ],
    icon: <Shield className="h-8 w-8 text-primary" />,
    features: ["Digital vault", "Secure sharing", "Caregiver access", "Legacy preservation"]
  },
  {
    id: 7,
    title: "Automated Communication Suite",
    content: [
      "Integrated SMS, Voice, and secure chat with patients",
      "Customizable campaign engine for recalls, education, and feedback",
      "Twilio-powered for global reach, compliant messaging",
      "Patient engagement scoring and analytics"
    ],
    icon: <MessageSquare className="h-8 w-8 text-primary" />,
    isPremium: true,
    features: ["Multi-channel messaging", "Campaign engine", "Global reach", "Engagement analytics"]
  },
  {
    id: 8,
    title: "Privacy, Compliance & Control",
    content: [
      "HIPAA, GDPR, and US state-level compliance built-in",
      "Secure user permissions and audit trails for every action",
      "Patient data never sold—your practice and patient relationships remain protected",
      "Advanced encryption and data security protocols"
    ],
    icon: <Lock className="h-8 w-8 text-primary" />,
    features: ["Multi-level compliance", "Audit trails", "Data protection", "Advanced encryption"]
  },
  {
    id: 9,
    title: "Analytics & Growth",
    content: [
      "Real-time dashboard for appointment volumes, no-shows, ROI",
      "Track referral sources and patient satisfaction",
      "See which services are most in-demand",
      "Practice optimization recommendations"
    ],
    icon: <BarChart3 className="h-8 w-8 text-primary" />,
    features: ["Real-time dashboards", "Referral tracking", "Service analytics", "Optimization insights"]
  },
  {
    id: 10,
    title: "Launch Your Health Hub",
    content: [
      "Set up your practice portal and invite patients",
      "Configure your first wellness service offerings",
      "Join the exclusive Health Marketplace",
      "Connect with our network of elite providers"
    ],
    icon: <CheckCircle className="h-8 w-8 text-primary" />,
    features: ["Portal setup", "Service configuration", "Marketplace access", "Network connection"]
  }
];

interface HealthcareOnboardingSlidesProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HealthcareOnboardingSlides: React.FC<HealthcareOnboardingSlidesProps> = ({
  isOpen,
  onClose
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showDemoVideo, setShowDemoVideo] = useState(false);

  const nextSlide = () => {
    if (currentSlide < healthcareSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const currentSlideData = healthcareSlides[currentSlide];
  const progress = ((currentSlide + 1) / healthcareSlides.length) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Healthcare Practice Management Tutorial</span>
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
              <Badge variant="outline">{currentSlide + 1} of {healthcareSlides.length}</Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-full">
          <div className="mb-6">
            <Progress value={progress} className="w-full" />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Welcome</span>
              <span>Core Features</span>
              <span>Ready to Heal!</span>
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

                {currentSlide === healthcareSlides.length - 1 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <Settings className="h-6 w-6" />
                      Setup Portal
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <Stethoscope className="h-6 w-6" />
                      Add Services
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <Target className="h-6 w-6" />
                      Join Marketplace
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <Users className="h-6 w-6" />
                      Invite Patients
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
              {healthcareSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            {currentSlide === healthcareSlides.length - 1 ? (
              <Button onClick={onClose} className="gap-2">
                Start Healing
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
                <DialogTitle>Healthcare Practice Management Demo</DialogTitle>
              </DialogHeader>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Play className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Healthcare Demo Video</h3>
                  <p className="text-muted-foreground mb-4">
                    Discover the Family Office Health Hub™
                  </p>
                  <div className="mt-4 text-sm text-muted-foreground max-w-2xl">
                    <p><strong>Script:</strong> "Welcome to the Family Office Health Hub™—where elite healthcare meets world-class technology. Designed for clinics, wellness providers, and healthspan innovators, our platform is your gateway to the future of patient management."</p>
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