import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Gavel, Shield, FileText, Clock, TrendingUp, CheckCircle, ArrowRight, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    id: 1,
    title: "Elevate Your Litigation Practice",
    subtitle: "Secure Case Management & Post-Settlement Planning in One Portal",
    type: "cover",
    content: {
      backgroundGradient: "from-slate-900 via-blue-900 to-slate-900",
      icon: <Gavel className="h-16 w-16 text-primary" />
    }
  },
  {
    id: 2,
    title: "The Challenge",
    type: "challenge",
    content: {
      points: [
        "Case documents scattered across multiple systems",
        "Clients lack visibility into case progress",
        "No structured settlement planning for clients after verdicts or settlements"
      ]
    }
  },
  {
    id: 3,
    title: "The Solution",
    type: "solution",
    content: {
      points: [
        {
          title: "Case Vault",
          description: "Organize pleadings, exhibits, and evidence in one secure platform"
        },
        {
          title: "Evidence Tracker",
          description: "Maintain chain-of-custody with version history"
        },
        {
          title: "Settlement Planning Tools",
          description: "SWAG Retirement Roadmap™ for structured settlement modeling"
        }
      ]
    }
  },
  {
    id: 4,
    title: "Key Features",
    type: "features",
    content: {
      features: [
        {
          icon: <Shield className="h-8 w-8" />,
          title: "Secure Document Storage",
          description: "Encrypted, organized, and searchable case files"
        },
        {
          icon: <Clock className="h-8 w-8" />,
          title: "Deadline Tracker",
          description: "Alerts for key litigation dates and milestones"
        },
        {
          icon: <FileText className="h-8 w-8" />,
          title: "Collaborative Access",
          description: "Role-based permissions for co-counsel, experts, and clients"
        },
        {
          icon: <TrendingUp className="h-8 w-8" />,
          title: "White-Label Branding",
          description: "Maintain your firm's visual identity"
        }
      ]
    }
  },
  {
    id: 5,
    title: "Client Benefits",
    type: "benefits",
    content: {
      audience: "client",
      benefits: [
        "Real-time case updates in a secure portal",
        "Structured settlement analysis to make informed decisions",
        "24/7 access to legal and financial documents",
        "Transparent communication throughout the litigation process"
      ]
    }
  },
  {
    id: 6,
    title: "Attorney Benefits",
    type: "benefits",
    content: {
      audience: "attorney",
      benefits: [
        "Centralized case data for greater efficiency",
        "Increased client satisfaction and trust",
        "Ability to provide holistic service, enhancing referrals and reputation",
        "Streamlined evidence management and compliance"
      ]
    }
  },
  {
    id: 7,
    title: "Case Study",
    type: "case-study",
    content: {
      story: "Personal injury case resulting in $1.2M settlement",
      outcome: "Structured settlement modeled with SWAG Retirement Roadmap™, ensuring 25 years of income for the client",
      metrics: ["$1.2M", "25 years", "100%"]
    }
  },
  {
    id: 8,
    title: "Ready to Streamline Your Practice?",
    subtitle: "Streamline litigation. Protect your clients beyond the verdict.",
    type: "cta",
    content: {
      ctaText: "Book a platform demo today",
      features: ["Case management", "Evidence tracking", "Settlement planning"]
    }
  }
];

export default function LitigationAttorneyMarketingDeck() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const renderSlide = (slide: any) => {
    switch (slide.type) {
      case 'cover':
        return (
          <div className={`min-h-[600px] bg-gradient-to-br ${slide.content.backgroundGradient} text-white flex items-center justify-center`}>
            <div className="text-center space-y-8">
              <div className="flex justify-center mb-8">
                {slide.content.icon}
              </div>
              <h1 className="text-6xl font-bold leading-tight">{slide.title}</h1>
              <p className="text-2xl text-white/80 max-w-3xl">{slide.subtitle}</p>
              <Badge className="bg-white/20 text-white border-white/30 text-lg px-6 py-2">
                Litigation Excellence
              </Badge>
            </div>
          </div>
        );

      case 'challenge':
        return (
          <div className="min-h-[600px] p-16 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-5xl font-bold mb-12 text-center">{slide.title}</h2>
              <div className="space-y-8">
                {slide.content.points.map((point: string, index: number) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold">
                      !
                    </div>
                    <p className="text-xl leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'solution':
        return (
          <div className="min-h-[600px] p-16 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-5xl font-bold mb-12 text-center">{slide.title}</h2>
              <div className="grid gap-8">
                {slide.content.points.map((point: any, index: number) => (
                  <Card key={index} className="p-8 border-0 bg-white/80 backdrop-blur">
                    <div className="flex items-start space-x-6">
                      <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-xl">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-3">{point.title}</h3>
                        <p className="text-lg text-muted-foreground">{point.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 'case-study':
        return (
          <div className="min-h-[600px] p-16 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-5xl font-bold mb-12">{slide.title}</h2>
              <Card className="p-12 border-0 bg-white/90 backdrop-blur">
                <div className="space-y-8">
                  <div className="text-2xl leading-relaxed">{slide.content.story}</div>
                  <div className="grid grid-cols-3 gap-8 py-8">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary">$1.2M</div>
                      <div className="text-muted-foreground">Settlement amount</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary">25 years</div>
                      <div className="text-muted-foreground">Income security</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary">100%</div>
                      <div className="text-muted-foreground">Client satisfaction</div>
                    </div>
                  </div>
                  <div className="text-xl font-semibold text-green-600">{slide.content.outcome}</div>
                </div>
              </Card>
            </div>
          </div>
        );

      default:
        // Reuse similar patterns from estate attorney deck for other slide types
        return <div>Slide content</div>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Slide Content */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderSlide(slides[currentSlide])}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur rounded-full px-6 py-4 flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="text-white hover:bg-white/20"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className="text-white hover:bg-white/20"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Slide Counter */}
      <div className="fixed top-8 right-8 bg-black/80 backdrop-blur rounded-full px-4 py-2 text-white">
        {currentSlide + 1} / {slides.length}
      </div>
    </div>
  );
}