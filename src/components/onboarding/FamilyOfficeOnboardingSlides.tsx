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
  TreePine, 
  DollarSign, 
  Users, 
  MessageCircle, 
  GraduationCap,
  Crown,
  PlayCircle,
  FileText,
  Calendar,
  Star
} from 'lucide-react';

interface FamilyOfficeOnboardingSlidesProps {
  isOpen: boolean;
  onClose: () => void;
}

const slides = [
  {
    id: 1,
    title: "Welcome to the Boutique Family Office Platform™",
    subtitle: "All Your Family's Wealth. One Private Platform.",
    description: "A secure, premium portal for managing your family's assets, legacy, and wellbeing—trusted by top families worldwide.",
    icon: <Crown className="h-8 w-8 text-primary" />,
    features: [],
    isPremium: false
  },
  {
    id: 2,
    title: "Private Family Dashboard",
    subtitle: "Complete Financial Overview",
    description: "Your family's complete financial world at a glance.",
    icon: <DollarSign className="h-8 w-8 text-primary" />,
    features: [
      "View all assets, accounts, entities, and real estate in one place",
      "Personalized family KPIs: Net worth, investments, family milestones",
      "Manage access for each family member and trusted advisor"
    ],
    isPremium: false
  },
  {
    id: 3,
    title: "Secure Family Legacy Vault™",
    subtitle: "Preserve Your Family's Heritage",
    description: "Store, protect, and share your family's most precious assets.",
    icon: <Shield className="h-8 w-8 text-primary" />,
    features: [
      "Store wills, trusts, insurance, videos, digital heirlooms, and more",
      "Leave legacy messages (audio/video/text) for future generations",
      "Set custom access rules: Time-locked, event-triggered, or trusted delegate"
    ],
    isPremium: true
  },
  {
    id: 4,
    title: "Bill Pay & Cash Management",
    subtitle: "Streamlined Financial Operations",
    description: "Automate and manage all your family's financial obligations.",
    icon: <Calendar className="h-8 w-8 text-primary" />,
    features: [
      "Track and schedule all household and family bills (utilities, taxes, tuition, staff)",
      "Automated payments and reminders for complete peace of mind",
      "Link accounts via Plaid, or add them manually for full control"
    ],
    isPremium: false
  },
  {
    id: 5,
    title: "Family Communication Suite",
    subtitle: "Secure Private Communications",
    description: "Connect with family and advisors through encrypted channels.",
    icon: <MessageCircle className="h-8 w-8 text-primary" />,
    features: [
      "Private, encrypted chat with advisors and family",
      "Secure sharing of documents, photos, and important messages",
      "Integrated SMS, email, and in-app notifications"
    ],
    isPremium: false
  },
  {
    id: 6,
    title: "Marketplace & Trusted Professionals",
    subtitle: "Vetted Professional Network",
    description: "Access elite professionals for all your family's needs.",
    icon: <Users className="h-8 w-8 text-primary" />,
    features: [
      "Access pre-vetted advisors, CPAs, attorneys, healthcare providers, and coaches",
      "Book consultations or services—everything is compliance-checked and private",
      "Invite your own family professionals to collaborate securely"
    ],
    isPremium: true
  },
  {
    id: 7,
    title: "Family Learning & Wellness Center",
    subtitle: "Multi-Generational Education",
    description: "Curated content for every family member's growth.",
    icon: <GraduationCap className="h-8 w-8 text-primary" />,
    features: [
      "Curated education for family members on wealth, health, investing, legacy",
      "Video courses, e-books, and premium guides included",
      "Dedicated portals for teens, spouses, and elders"
    ],
    isPremium: true
  },
  {
    id: 8,
    title: "Proactive Compliance & Security",
    subtitle: "Bank-Level Security & Privacy",
    description: "Your family's privacy and security are our top priority.",
    icon: <Shield className="h-8 w-8 text-primary" />,
    features: [
      "Advanced user controls and audit logs",
      "GDPR/CCPA/US privacy compliance",
      "All data encrypted—your information never sold, never shared"
    ],
    isPremium: false
  },
  {
    id: 9,
    title: "Family Council & Decision-Making",
    subtitle: "Collaborative Family Governance",
    description: "Facilitate family meetings and preserve decisions.",
    icon: <Users className="h-8 w-8 text-primary" />,
    features: [
      "Host family meetings with secure video/SMS scheduling",
      "Create voting polls, action trackers, and minutes logs",
      "Archive council decisions for future reference"
    ],
    isPremium: true
  },
  {
    id: 10,
    title: "Get Started",
    subtitle: "Your Family Office Awaits",
    description: "Begin your journey to complete family wealth and legacy management.",
    icon: <Star className="h-8 w-8 text-primary" />,
    features: [
      "Set Up My Family Office",
      "Invite Family Members",
      "Connect with a Concierge"
    ],
    isPremium: false
  }
];

export const FamilyOfficeOnboardingSlides: React.FC<FamilyOfficeOnboardingSlidesProps> = ({ 
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
                <TreePine className="h-6 w-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl">Family Office Platform Walkthrough</DialogTitle>
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
                    <span>This 3-minute tour will show you everything you need to know about your Family Office Platform</span>
                  </div>
                </div>
              )}

              {currentSlide === slides.length - 1 && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="w-full gap-2">
                    <TreePine className="h-4 w-4" />
                    Set Up Family Office
                  </Button>
                  <Button variant="outline" className="w-full gap-2">
                    <Users className="h-4 w-4" />
                    Invite Family
                  </Button>
                  <Button variant="outline" className="w-full gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Contact Concierge
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