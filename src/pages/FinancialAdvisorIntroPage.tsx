import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Users, 
  BarChart3, 
  Shield, 
  Target, 
  Briefcase,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Star
} from 'lucide-react';
import { LandingNavigation } from '@/components/marketplace/LandingNavigation';
import { BrandedFooter } from '@/components/ui/BrandedFooter';
import { motion } from 'framer-motion';

export const FinancialAdvisorIntroPage: React.FC = () => {
  const benefits = [
    {
      icon: Target,
      title: 'SWAG™ Lead Scoring',
      description: 'Instantly qualify prospects with AI-driven scoring based on financial potential and readiness'
    },
    {
      icon: Users,
      title: 'CRM & Pipeline Management',
      description: 'Full Kanban pipeline, contact records, automated follow-ups, and win/loss analytics'
    },
    {
      icon: BarChart3,
      title: 'Integrated SWAG™ Retirement Roadmap',
      description: 'Run scenario modeling, stress tests, and custom retirement projections in minutes'
    },
    {
      icon: Shield,
      title: 'Compliance Platform',
      description: 'FINRA/SEC-aligned client communications and document tracking'
    },
    {
      icon: TrendingUp,
      title: 'Marketing Automation',
      description: 'Lead magnets, email campaigns, and ROI tracking'
    },
    {
      icon: Briefcase,
      title: 'Client Portals',
      description: 'Branded, secure portals with document sharing and planning tools'
    }
  ];

  const howItWorksSteps = [
    {
      number: '1',
      title: 'Capture & Score Leads',
      description: 'Landing pages, UTM tracking, and SWAG™ scoring engine'
    },
    {
      number: '2',
      title: 'Convert Faster',
      description: 'Automated cadences, meeting scheduling, and proposal workflows'
    },
    {
      number: '3',
      title: 'Deliver Exceptional Value',
      description: 'Planning tools, SWAG™ Roadmap, and client-ready reports'
    },
    {
      number: '4',
      title: 'Stay Compliant',
      description: 'Built-in audit trail for communications and transactions'
    },
    {
      number: '5',
      title: 'Measure & Optimize',
      description: 'ROI dashboards and campaign analytics'
    }
  ];

  const pricingTiers = [
    {
      name: 'Basic',
      monthly: '$59',
      annual: '$600',
      features: [
        'CRM',
        'Branded portal',
        'Lead capture forms',
        'Linda AI Assistant add-on ($10/mo)'
      ],
      popular: false
    },
    {
      name: 'Pro',
      monthly: '$119',
      annual: '$1200',
      features: [
        'All Basic features',
        'SWAG™ Lead Scoring',
        'Marketing automation',
        'Portfolio analytics',
        'Linda AI included'
      ],
      popular: true
    },
    {
      name: 'Premium',
      monthly: '$199',
      annual: '$2000',
      features: [
        'All Pro features',
        'SWAG™ Retirement Roadmap',
        'VIP marketplace',
        'Full white-label branding',
        'Dedicated support'
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-background to-navy">
      <LandingNavigation />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8"
          >
            <Badge className="bg-emerald/20 text-emerald border-emerald/30 px-4 py-2">
              <TrendingUp className="w-4 h-4 mr-2" />
              Financial Advisors
            </Badge>
            
            <div className="space-y-6">
              <h1 className="font-serif text-5xl lg:text-6xl font-bold text-foreground">
                Grow Your Practice, Impress Your Clients, and Scale Without Limits
              </h1>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                All-in-one advisor technology — CRM, SWAG™ Retirement Roadmap, compliance tools, 
                and marketing automation — built for modern fiduciaries.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => window.location.href = 'https://my.bfocfo.com/onboarding/financial-advisor'}
                className="bg-gradient-to-r from-emerald to-emerald/90 hover:from-emerald/90 hover:to-emerald text-navy font-bold px-8 py-4 text-lg"
              >
                Get Started as an Advisor
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                onClick={() => window.location.href = 'https://my.bfocfo.com/demo'}
                className="border-gold text-gold hover:bg-gold/10 px-8 py-4 text-lg"
              >
                Book a Demo
                <ExternalLink className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Intro Paragraph */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center">
            <p className="text-lg text-muted-foreground leading-relaxed">
              The <strong className="text-emerald">Advisor Command Center</strong> gives you every tool you need to attract, engage, 
              and retain clients while staying compliant and maximizing efficiency. From automated lead capture to AI-driven 
              financial planning, you'll have <strong className="text-foreground">everything in one secure platform</strong> — 
              no patchwork of apps or overpriced tech stacks.
            </p>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
              Everything Your Practice Needs
            </h2>
            <p className="text-xl text-muted-foreground">
              Professional-grade tools designed specifically for financial advisors
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full bg-card/50 backdrop-blur-sm border border-border hover:border-emerald/30 transition-all duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald to-emerald/80 rounded-lg flex items-center justify-center mb-4">
                      <benefit.icon className="w-6 h-6 text-navy" />
                    </div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-card/30 scroll-mt-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Five simple steps to transform your practice
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-8">
            {howItWorksSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-emerald to-emerald/80 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-navy">{step.number}</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Table */}
      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Professional tools that scale with your practice
            </p>
            <Badge className="bg-gold/20 text-gold border-gold/30 px-3 py-1">
              Special Offer: Save 20% with annual billing
            </Badge>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`h-full relative ${
                  tier.popular 
                    ? 'border-emerald bg-card/70 shadow-lg shadow-emerald/20' 
                    : 'bg-card/50'
                }`}>
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-emerald text-navy px-3 py-1">
                        <Star className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">{tier.name}</CardTitle>
                    <div className="space-y-2">
                      <div className="text-3xl font-bold text-emerald">{tier.monthly}</div>
                      <div className="text-sm text-muted-foreground">
                        or {tier.annual} annually
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {tier.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-emerald mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className="w-full"
                      variant={tier.popular ? "default" : "outline"}
                      onClick={() => window.location.href = 'https://my.bfocfo.com/onboarding/financial-advisor'}
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Note */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-emerald mr-3" />
              <h3 className="font-semibold text-lg">Compliance & Security</h3>
            </div>
            <p className="text-muted-foreground">
              Aligned with <strong>SEC</strong>, <strong>FINRA</strong>, and <strong>state fiduciary</strong> requirements. 
              All data encrypted in transit and at rest. SOC 2-ready infrastructure.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTAs */}
      <section className="py-16">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <div className="space-y-6">
            <h2 className="font-serif text-3xl font-bold text-foreground">
              Ready to Transform Your Practice?
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => window.location.href = 'https://my.bfocfo.com/onboarding/financial-advisor'}
                className="bg-gradient-to-r from-emerald to-emerald/90 hover:from-emerald/90 hover:to-emerald text-navy font-bold px-8 py-4"
              >
                Start My Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                onClick={() => window.location.href = 'https://my.bfocfo.com/demo'}
                className="border-gold text-gold hover:bg-gold/10 px-8 py-4"
              >
                Book a Demo
                <ExternalLink className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <BrandedFooter />
    </div>
  );
};