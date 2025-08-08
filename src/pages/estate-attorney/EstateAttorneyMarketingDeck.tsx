import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Scale, Shield, FileText, Users, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    id: 1,
    title: "Transform Your Estate Planning Practice",
    subtitle: "Secure, Collaborative, and Client-Centric Planning",
    type: "cover",
    content: {
      backgroundGradient: "from-slate-900 via-slate-800 to-slate-900",
      icon: <Scale className="h-16 w-16 text-primary" />
    }
  },
  {
    id: 2,
    title: "The Challenge",
    type: "challenge",
    content: {
      points: [
        "Clients often delay estate planning because of complexity and lack of engagement",
        "Attorneys juggle multiple disconnected tools for documents, communication, and planning",
        "Trust-building is harder without modern client-facing tools"
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
          title: "One Secure Platform",
          description: "Draft, store, and collaborate on estate documents in a single place"
        },
        {
          title: "Integrated Client Portal",
          description: "Give clients visibility into their plan's progress"
        },
        {
          title: "Planning Tools",
          description: "Use the SWAG Retirement Roadmap™ to show how estate plans fit into lifetime wealth strategy"
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
          title: "Document Vault",
          description: "Secure, encrypted repository for wills, trusts, POAs, and directives"
        },
        {
          icon: <Users className="h-8 w-8" />,
          title: "Beneficiary Tracker",
          description: "Ensure plans are up to date"
        },
        {
          icon: <FileText className="h-8 w-8" />,
          title: "State-Specific Templates",
          description: "Compliant forms preloaded for faster drafting"
        },
        {
          icon: <TrendingUp className="h-8 w-8" />,
          title: "White-Label Branding",
          description: "Keep your firm's name and identity front and center"
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
        "Transparency and control over their estate plan",
        "Secure access to all important documents 24/7",
        "Financial confidence with integrated retirement and tax planning tools",
        "Privacy and compliance at every step"
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
        "Increased client engagement and satisfaction",
        "Reduced time on repetitive admin tasks",
        "Stronger client retention and referrals",
        "Ability to offer premium ongoing maintenance packages"
      ]
    }
  },
  {
    id: 7,
    title: "Case Study",
    type: "case-study",
    content: {
      story: "A blended family in two states completes a complex trust in 3 weeks instead of 3 months",
      outcome: "100% increase in client satisfaction and 35% more referrals",
      metrics: ["3 weeks", "100%", "35%"]
    }
  },
  {
    id: 8,
    title: "Ready to Transform Your Practice?",
    subtitle: "Modernize your practice. Deliver more value. Secure more referrals.",
    type: "cta",
    content: {
      ctaText: "Book a platform demo today",
      features: ["Secure document management", "Client collaboration tools", "SWAG™ integration"]
    }
  }
];

export default function EstateAttorneyMarketingDeck() {
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
                Estate Planning Excellence
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

      case 'features':
        return (
          <div className="min-h-[600px] p-16">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-5xl font-bold mb-12 text-center">{slide.title}</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {slide.content.features.map((feature: any, index: number) => (
                  <Card key={index} className="p-8 border-0 bg-gradient-to-br from-primary/5 to-secondary/5">
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                        {feature.icon}
                      </div>
                      <h3 className="text-2xl font-bold">{feature.title}</h3>
                      <p className="text-lg text-muted-foreground">{feature.description}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 'benefits':
        return (
          <div className="min-h-[600px] p-16 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-5xl font-bold mb-12 text-center">{slide.title}</h2>
              <div className="space-y-6">
                {slide.content.benefits.map((benefit: string, index: number) => (
                  <div key={index} className="flex items-center space-x-4 p-6 bg-white/80 backdrop-blur rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-500 flex-shrink-0" />
                    <p className="text-xl">{benefit}</p>
                  </div>
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
                      <div className="text-4xl font-bold text-primary">3 weeks</div>
                      <div className="text-muted-foreground">Completion time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary">100%</div>
                      <div className="text-muted-foreground">Satisfaction increase</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary">35%</div>
                      <div className="text-muted-foreground">More referrals</div>
                    </div>
                  </div>
                  <div className="text-xl font-semibold text-green-600">{slide.content.outcome}</div>
                </div>
              </Card>
            </div>
          </div>
        );

      case 'cta':
        return (
          <div className="min-h-[600px] bg-gradient-to-br from-primary via-primary/90 to-secondary text-white flex items-center justify-center">
            <div className="text-center space-y-8 max-w-4xl">
              <h2 className="text-6xl font-bold">{slide.title}</h2>
              <p className="text-2xl text-white/90">{slide.subtitle}</p>
              <div className="flex justify-center gap-8 my-12">
                {slide.content.features.map((feature: string, index: number) => (
                  <div key={index} className="text-center">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                    <div className="text-lg">{feature}</div>
                  </div>
                ))}
              </div>
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-xl px-12 py-6">
                <ArrowRight className="mr-3 h-6 w-6" />
                {slide.content.ctaText}
              </Button>
            </div>
          </div>
        );

      default:
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