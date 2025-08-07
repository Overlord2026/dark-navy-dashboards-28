import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  ChevronLeft,
  ChevronRight,
  Scale,
  FileText,
  Shield,
  Users,
  Target,
  BarChart3,
  Crown,
  CheckCircle,
  Calendar,
  Briefcase,
  BookOpen,
  Smartphone,
  Play,
  HelpCircle
} from 'lucide-react';

const attorneySlides = [
  {
    id: 1,
    title: "Welcome to BFO Legal Practice Suite",
    subtitle: "Centralized practice management for modern legal professionals.",
    content: [
      "Complete case and client management",
      "Secure document vault and collaboration",
      "Estate planning and workflow automation",
      "Compliance and deadline tracking"
    ],
    icon: <Scale className="h-8 w-8 text-primary" />,
    highlight: "Modernize Your Legal Practice"
  },
  {
    id: 2,
    title: "Secure Legal Document Vault",
    content: [
      "Store, tag, and organize all client legal documents",
      "Invite clients to upload or sign documents securely",
      "Version control and audit trail for all changes",
      "Advanced search and categorization system"
    ],
    icon: <FileText className="h-8 w-8 text-primary" />,
    features: ["Secure storage", "Client collaboration", "Version control", "Smart organization"]
  },
  {
    id: 3,
    title: "Estate Plan Builder & Workflow",
    content: [
      "Build, customize, and e-sign estate planning documents",
      "Collaborate with CPAs/advisors for holistic planning",
      "Automated workflow templates for common documents",
      "Integration with financial planning tools"
    ],
    icon: <Briefcase className="h-8 w-8 text-primary" />,
    features: ["Document builder", "Professional collaboration", "Workflow automation", "Integration tools"]
  },
  {
    id: 4,
    title: "Compliance & Filing Calendar",
    content: [
      "Track court dates, filing deadlines, and statute reminders",
      "Automated alerts for key compliance events",
      "Bar association requirement tracking",
      "CLE credit management and reporting"
    ],
    icon: <Calendar className="h-8 w-8 text-primary" />,
    features: ["Deadline tracking", "Automated alerts", "Compliance monitoring", "CLE management"]
  },
  {
    id: 5,
    title: "Prospect Pipeline & Referrals",
    content: [
      "Track inbound leads, referrals, and conversion journey",
      "Move prospects from consultation to engagement",
      "Referral source tracking and management",
      "Case resolution and outcome analytics"
    ],
    icon: <Target className="h-8 w-8 text-primary" />,
    features: ["Lead tracking", "Conversion pipeline", "Referral management", "Outcome analytics"]
  },
  {
    id: 6,
    title: "Lead-to-Engagement Engine",
    content: [
      "Launch referral or estate planning campaigns",
      "Automated drip sequences for different practice areas",
      "Bulk reminder and follow-up capabilities",
      "Professional networking and collaboration tools"
    ],
    icon: <Users className="h-8 w-8 text-primary" />,
    isPremium: true,
    features: ["Campaign automation", "Drip sequences", "Bulk operations", "Professional networking"]
  },
  {
    id: 7,
    title: "Practice Analytics & Reporting",
    content: [
      "Dashboard of open/closed cases and conversion rates",
      "Fee tracking and revenue analytics",
      "Export capabilities for management or compliance",
      "Performance metrics and trend analysis"
    ],
    icon: <BarChart3 className="h-8 w-8 text-primary" />,
    features: ["Case analytics", "Revenue tracking", "Export tools", "Performance metrics"]
  },
  {
    id: 8,
    title: "Premium Legal Features",
    content: [
      "Advanced ADV/CE tracking and compliance",
      "Enhanced e-signature integration and workflows",
      "Document analytics and usage tracking",
      "Priority support and training resources"
    ],
    icon: <Crown className="h-8 w-8 text-primary" />,
    isPremium: true,
    features: ["Advanced compliance", "E-signature workflows", "Document analytics", "Priority support"]
  },
  {
    id: 9,
    title: "Mobile-Optimized Experience",
    content: [
      "Manage your practice from any device",
      "Access client files and case information on-the-go",
      "Mobile-friendly document review and approval",
      "Real-time notifications and updates"
    ],
    icon: <Smartphone className="h-8 w-8 text-primary" />,
    features: ["Mobile access", "Remote file management", "Mobile document review", "Real-time updates"]
  },
  {
    id: 10,
    title: "Get Started with Your Legal Practice",
    content: [
      "Import existing clients and case files",
      "Set up your first estate planning workflow",
      "Launch your referral campaign",
      "Book a training session with our legal experts"
    ],
    icon: <CheckCircle className="h-8 w-8 text-primary" />,
    features: ["Data import", "Workflow setup", "Campaign launch", "Expert training"]
  }
];

interface AttorneyOnboardingSlidesProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AttorneyOnboardingSlides: React.FC<AttorneyOnboardingSlidesProps> = ({
  isOpen,
  onClose
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showDemoVideo, setShowDemoVideo] = useState(false);

  const nextSlide = () => {
    if (currentSlide < attorneySlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const currentSlideData = attorneySlides[currentSlide];
  const progress = ((currentSlide + 1) / attorneySlides.length) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Legal Practice Management Tutorial</span>
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
              <Badge variant="outline">{currentSlide + 1} of {attorneySlides.length}</Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-full">
          <div className="mb-6">
            <Progress value={progress} className="w-full" />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Welcome</span>
              <span>Core Features</span>
              <span>Ready to Practice!</span>
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

                {currentSlide === attorneySlides.length - 1 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <Users className="h-6 w-6" />
                      Import Clients
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <Briefcase className="h-6 w-6" />
                      Setup Workflow
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <Target className="h-6 w-6" />
                      Launch Campaign
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <BookOpen className="h-6 w-6" />
                      Get Training
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
              {attorneySlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            {currentSlide === attorneySlides.length - 1 ? (
              <Button onClick={onClose} className="gap-2">
                Start Practicing
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
                <DialogTitle>Legal Practice Management Demo</DialogTitle>
              </DialogHeader>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Play className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Attorney Demo Video</h3>
                  <p className="text-muted-foreground mb-4">
                    See how BFO transforms legal practice management
                  </p>
                  <div className="mt-4 text-sm text-muted-foreground max-w-2xl">
                    <p><strong>Script:</strong> "Welcome to the BFO Legal Practice Suite—the comprehensive platform designed for modern attorneys. Streamline your practice with secure document management, estate planning tools, compliance tracking, and powerful client engagement features."</p>
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