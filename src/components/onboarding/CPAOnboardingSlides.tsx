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
  FileText,
  Calculator,
  Shield,
  Target,
  BarChart3,
  Crown,
  CheckCircle,
  Upload,
  MessageSquare,
  Calendar,
  Zap,
  Brain,
  Play,
  HelpCircle
} from 'lucide-react';

const cpaSlides = [
  {
    id: 1,
    title: "Welcome to BFO CPA Practice Suite",
    subtitle: "Your all-in-one hub for client accounting, planning, and workflow automation.",
    content: [
      "Complete practice management solution",
      "Tax preparation and compliance tools",
      "Client communication and document management",
      "Automated workflows for efficiency"
    ],
    icon: <Calculator className="h-8 w-8 text-primary" />,
    highlight: "Transform Your Accounting Practice"
  },
  {
    id: 2,
    title: "Effortless Client Organization",
    content: [
      "Secure vault for tax docs, statements, and compliance files",
      "Bulk import and organize clients by type or status",
      "Advanced tagging and categorization system",
      "Quick search and retrieval functionality"
    ],
    icon: <Users className="h-8 w-8 text-primary" />,
    features: ["Secure document vault", "Bulk import tools", "Smart organization", "Quick access"]
  },
  {
    id: 3,
    title: "Tax Return Scan & Analyzer",
    content: [
      "Instantly scan, analyze, and annotate client tax returns",
      "Identify planning opportunities with built-in AI",
      "Automated data extraction and verification",
      "Flag potential issues and opportunities"
    ],
    icon: <Brain className="h-8 w-8 text-primary" />,
    features: ["AI-powered scanning", "Opportunity identification", "Data extraction", "Quality checks"]
  },
  {
    id: 4,
    title: "Automated Reminders & Client Portal",
    content: [
      "Client portal for document uploads, e-sign, and updates",
      "Automated reminders for quarterly filings and deadlines",
      "Estimated payment notifications and tracking",
      "Seamless client communication platform"
    ],
    icon: <Calendar className="h-8 w-8 text-primary" />,
    features: ["Client portal", "Automated reminders", "E-signature integration", "Communication tools"]
  },
  {
    id: 5,
    title: "Compliance Dashboard",
    content: [
      "CE credit automation for your team",
      "Audit trail for all tax and compliance workflows",
      "Regulatory deadline tracking",
      "Team certification management"
    ],
    icon: <Shield className="h-8 w-8 text-primary" />,
    isPremium: true,
    features: ["CE automation", "Audit trails", "Compliance tracking", "Team management"]
  },
  {
    id: 6,
    title: "Lead-to-Client Pipeline",
    content: [
      "Track prospects, referrals, and lead sources",
      "Convert tax return 'lookers' into long-term clients",
      "Bulk actions and custom filters for efficiency",
      "Pipeline analytics and conversion tracking"
    ],
    icon: <Target className="h-8 w-8 text-primary" />,
    features: ["Lead tracking", "Conversion tools", "Bulk operations", "Analytics dashboard"]
  },
  {
    id: 7,
    title: "Campaign Engine & Bulk Messaging",
    content: [
      "Launch seasonal outreach: tax time, planning, compliance",
      "Bulk SMS/email reminders to clients and prospects",
      "Automated drip campaigns for different client segments",
      "Template library for common communications"
    ],
    icon: <Zap className="h-8 w-8 text-primary" />,
    isPremium: true,
    features: ["Campaign automation", "Bulk messaging", "Template library", "Seasonal campaigns"]
  },
  {
    id: 8,
    title: "Analytics & Reporting",
    content: [
      "Real-time dashboards for workflow, filings, and revenue",
      "Export capabilities for management or compliance review",
      "Performance metrics and trend analysis",
      "Custom report generation"
    ],
    icon: <BarChart3 className="h-8 w-8 text-primary" />,
    features: ["Real-time dashboards", "Custom reports", "Performance metrics", "Export tools"]
  },
  {
    id: 9,
    title: "Premium Features & Support",
    content: [
      "Priority support with dedicated account management",
      "Advanced analytics and custom reporting",
      "Tax planning campaign templates",
      "Integration with popular accounting software"
    ],
    icon: <Crown className="h-8 w-8 text-primary" />,
    isPremium: true,
    features: ["Priority support", "Advanced analytics", "Campaign templates", "Software integrations"]
  },
  {
    id: 10,
    title: "Start Your Practice Transformation",
    content: [
      "Onboard your first client in seconds",
      "Import existing client data with bulk tools",
      "Set up automated workflows",
      "Launch your first campaign"
    ],
    icon: <CheckCircle className="h-8 w-8 text-primary" />,
    features: ["Quick onboarding", "Data import", "Workflow setup", "Campaign launch"]
  }
];

interface CPAOnboardingSlidesProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CPAOnboardingSlides: React.FC<CPAOnboardingSlidesProps> = ({
  isOpen,
  onClose
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showDemoVideo, setShowDemoVideo] = useState(false);

  const nextSlide = () => {
    if (currentSlide < cpaSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const currentSlideData = cpaSlides[currentSlide];
  const progress = ((currentSlide + 1) / cpaSlides.length) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>CPA Practice Management Tutorial</span>
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
              <Badge variant="outline">{currentSlide + 1} of {cpaSlides.length}</Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-full">
          <div className="mb-6">
            <Progress value={progress} className="w-full" />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Getting Started</span>
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

                {currentSlide === cpaSlides.length - 1 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <Users className="h-6 w-6" />
                      Add Client
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <Upload className="h-6 w-6" />
                      Import Data
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <Zap className="h-6 w-6" />
                      Launch Campaign
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <HelpCircle className="h-6 w-6" />
                      Get Support
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
              {cpaSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            {currentSlide === cpaSlides.length - 1 ? (
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
                <DialogTitle>CPA Practice Management Demo</DialogTitle>
              </DialogHeader>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Play className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">CPA Demo Video</h3>
                  <p className="text-muted-foreground mb-4">
                    Watch how the BFO CPA Practice Suite transforms your accounting workflow
                  </p>
                  <div className="mt-4 text-sm text-muted-foreground max-w-2xl">
                    <p><strong>Script:</strong> "Welcome to the BFO CPA Practice Suite—the most comprehensive platform for modern accounting professionals. Transform your practice with automated tax scanning, client portals, compliance tracking, and powerful campaign tools."</p>
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