import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Play, Users, TrendingUp, Globe, Crown, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PitchSlide {
  id: number;
  title: string;
  content: React.ReactNode;
  backgroundClass?: string;
}

export function SharkTankPitchDeck() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: PitchSlide[] = [
    {
      id: 1,
      title: "Boutique Family Office Marketplace™",
      content: (
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <Crown className="h-16 w-16 text-gold mx-auto" />
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-gold to-accent bg-clip-text text-transparent">
              BFOCFO
            </h1>
            <p className="text-2xl md:text-3xl font-semibold text-primary">
              The 1% Platform, Now for Everyone
            </p>
            <Badge variant="secondary" className="bg-gold/10 text-gold border-gold/20 text-lg px-4 py-2">
              Confidential Investor Preview
            </Badge>
          </div>
        </div>
      ),
      backgroundClass: "bg-gradient-to-br from-primary/5 via-gold/5 to-accent/5"
    },
    {
      id: 2,
      title: "The Problem",
      content: (
        <div className="space-y-8">
          <h2 className="text-4xl font-bold text-center">The Pain Point</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="text-6xl text-center">😫</div>
              <h3 className="text-2xl font-semibold text-center">Families Struggle</h3>
              <p className="text-lg text-muted-foreground">
                Most families and professionals can't access the tech, expertise, and community that the ultra-wealthy enjoy.
              </p>
            </div>
            <div className="space-y-4">
              <div className="text-6xl text-center">💔</div>
              <h3 className="text-2xl font-semibold text-center">Fragmented Systems</h3>
              <p className="text-lg text-muted-foreground">
                Expensive, non-transparent. No single source of truth for wealth, health, and legacy.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "The Solution",
      content: (
        <div className="space-y-8">
          <h2 className="text-4xl font-bold text-center">Our Solution</h2>
          <div className="text-center space-y-6">
            <div className="text-6xl">🏛️</div>
            <p className="text-xl md:text-2xl">
              We built a marketplace for family office management—democratizing world-class services for families, advisors, pros, and institutions.
            </p>
            <div className="flex justify-center items-center gap-8 text-lg font-semibold">
              <span className="flex items-center gap-2">
                <Users className="h-6 w-6" /> One Dashboard
              </span>
              <span className="flex items-center gap-2">
                <Crown className="h-6 w-6" /> One Vault
              </span>
              <span className="flex items-center gap-2">
                <Globe className="h-6 w-6" /> One Network
              </span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Platform Preview",
      content: (
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-center">Live Platform Demo</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-sm">Marketplace Landing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-primary/10 to-gold/10 h-24 rounded flex items-center justify-center">
                  <Crown className="h-8 w-8 text-gold" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-accent/20">
              <CardHeader>
                <CardTitle className="text-sm">VIP Profiles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-accent/10 to-primary/10 h-24 rounded flex items-center justify-center">
                  <Users className="h-8 w-8 text-accent" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-gold/20">
              <CardHeader>
                <CardTitle className="text-sm">Hall of Champions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-gold/10 to-accent/10 h-24 rounded flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-gold" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "What Makes Us Different",
      content: (
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-center">Our Differentiators</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-semibold">Persona-Based Dashboards</h3>
              </div>
              <p className="text-muted-foreground">Advisor, client, attorney, CPA, athlete, health exec</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Crown className="h-8 w-8 text-gold" />
                <h3 className="text-xl font-semibold">AI Copilot & Compliance</h3>
              </div>
              <p className="text-muted-foreground">Built-in intelligence and regulatory engine</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-accent" />
                <h3 className="text-xl font-semibold">Legacy Vault™ + SWAG Score™</h3>
              </div>
              <p className="text-muted-foreground">Proprietary scoring and vault technology</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Globe className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-semibold">Viral VIP Onboarding</h3>
              </div>
              <p className="text-muted-foreground">Reserved profiles & equity for champions</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "Market & Revenue",
      content: (
        <div className="space-y-8">
          <h2 className="text-4xl font-bold text-center">Market Opportunity</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-primary">$4.5T</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Managed by US family offices</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-gold">800K+</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Advisors, CPAs, Attorneys</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-accent">16M</CardTitle>
              </CardHeader>
              <CardContent>
                <p>HNW Families</p>
              </CardContent>
            </Card>
          </div>
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-semibold">Revenue Streams</h3>
            <div className="flex justify-center gap-6 flex-wrap">
              <Badge variant="outline">Recurring SaaS</Badge>
              <Badge variant="outline">Marketplace Fees</Badge>
              <Badge variant="outline">Premium Upgrades</Badge>
              <Badge variant="outline">Referral Engine</Badge>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            disabled={currentSlide === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            {currentSlide + 1} of {slides.length}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="outline" size="sm">
            <Play className="h-4 w-4 mr-2" />
            Demo Video
          </Button>
        </div>
      </div>

      <Card className={`min-h-[600px] ${slides[currentSlide].backgroundClass || ''}`}>
        <CardContent className="p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full flex items-center justify-center"
            >
              {slides[currentSlide].content}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Slide Navigation Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-primary' : 'bg-muted'
            }`}
          />
        ))}
      </div>
    </div>
  );
}