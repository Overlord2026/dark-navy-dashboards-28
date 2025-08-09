import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator, 
  FileText, 
  Shield, 
  Users, 
  TrendingUp, 
  Building,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Star,
  Lock,
  BarChart3
} from 'lucide-react';
import { LandingNavigation } from '@/components/marketplace/LandingNavigation';
import { BrandedFooter } from '@/components/ui/BrandedFooter';
import { motion } from 'framer-motion';

export const CPAAccountantIntroPage: React.FC = () => {
  const benefits = [
    {
      icon: Calculator,
      title: 'Tax Optimization Tools',
      description: 'Multi-year projections, Roth conversion timing, charitable giving optimization'
    },
    {
      icon: Building,
      title: 'Entity & Trust Planning',
      description: 'Integrated estate and entity tax calculators for strategic planning'
    },
    {
      icon: Lock,
      title: 'Secure Client Portals',
      description: 'Upload, share, and organize tax documents in encrypted vaults'
    },
    {
      icon: TrendingUp,
      title: 'Workflow Automation',
      description: 'Automate client reminders, tax document requests, and follow-ups'
    },
    {
      icon: Shield,
      title: 'Compliance Platform',
      description: 'SOC 2-ready with built-in audit trails and document tracking'
    },
    {
      icon: Users,
      title: 'Marketplace Access',
      description: 'Collaborate with vetted legal, financial, and insurance professionals'
    },
    {
      icon: BarChart3,
      title: 'SWAG™ Retirement Roadmap Integration',
      description: 'Offer clients advanced retirement scenario modeling'
    }
  ];

  const howItWorksSteps = [
    {
      number: '1',
      title: 'Onboard Clients Easily',
      description: 'Digital intake forms, document vault access, automated welcome emails'
    },
    {
      number: '2',
      title: 'Plan & Analyze',
      description: 'Run tax projections, evaluate conversion strategies, stress-test retirement plans'
    },
    {
      number: '3',
      title: 'Collaborate Seamlessly',
      description: 'Secure messaging, document sharing, and marketplace referrals'
    },
    {
      number: '4',
      title: 'Stay Audit-Ready',
      description: 'Compliance logs and encrypted data storage'
    },
    {
      number: '5',
      title: 'Measure & Improve',
      description: 'Client retention metrics and ROI dashboards'
    }
  ];

  const pricingTiers = [
    {
      name: 'Basic',
      monthly: '$49',
      annual: '$500',
      features: [
        'Secure client portal',
        'CE tracking',
        'Document vault',
        'Linda AI Assistant add-on ($10/mo)'
      ],
      popular: false
    },
    {
      name: 'Pro',
      monthly: '$99',
      annual: '$1000',
      features: [
        'All Basic features',
        'Tax analysis tools',
        'Workflow automation',
        'SWAG™ Retirement Roadmap',
        'Linda AI included'
      ],
      popular: true
    },
    {
      name: 'Premium',
      monthly: '$159',
      annual: '$1600',
      features: [
        'All Pro features',
        'Family office integration',
        'AI tax assistant',
        'Marketplace priority listing'
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
            <Badge className="bg-gold/20 text-gold border-gold/30 px-4 py-2">
              <Calculator className="w-4 h-4 mr-2" />
              CPAs & Accountants
            </Badge>
            
            <div className="space-y-6">
              <h1 className="font-serif text-5xl lg:text-6xl font-bold text-foreground">
                The Accounting Powerhouse for Modern Firms
              </h1>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                Tax optimization, client portals, compliance tools, and business growth analytics — 
                all in one platform.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => window.location.href = 'https://my.bfocfo.com/onboarding/cpa'}
                className="bg-gradient-to-r from-gold to-gold/90 hover:from-gold/90 hover:to-gold text-navy font-bold px-8 py-4 text-lg"
              >
                Get Started as a CPA
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                onClick={() => window.location.href = 'https://my.bfocfo.com/demo'}
                className="border-emerald text-emerald hover:bg-emerald/10 px-8 py-4 text-lg"
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
              The <strong className="text-gold">CPA / Accountant Command Center</strong> streamlines your workflows, 
              strengthens client relationships, and grows your practice. From <strong className="text-foreground">multi-year tax forecasting</strong> to 
              automated client onboarding and document sharing, you'll work smarter, stay compliant, and provide 
              exceptional service — all without juggling multiple subscriptions.
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
              Professional-grade tools designed specifically for CPAs and accounting firms
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
                <Card className="h-full bg-card/50 backdrop-blur-sm border border-border hover:border-gold/30 transition-all duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-br from-gold to-gold/80 rounded-lg flex items-center justify-center mb-4">
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
              Five simple steps to transform your accounting practice
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
                <div className="w-16 h-16 bg-gradient-to-br from-gold to-gold/80 rounded-full flex items-center justify-center mx-auto mb-4">
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
              Professional tools that scale with your accounting practice
            </p>
            <Badge className="bg-emerald/20 text-emerald border-emerald/30 px-3 py-1">
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
                    ? 'border-gold bg-card/70 shadow-lg shadow-gold/20' 
                    : 'bg-card/50'
                }`}>
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gold text-navy px-3 py-1">
                        <Star className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">{tier.name}</CardTitle>
                    <div className="space-y-2">
                      <div className="text-3xl font-bold text-gold">{tier.monthly}</div>
                      <div className="text-sm text-muted-foreground">
                        or {tier.annual} annually
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {tier.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-gold mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className="w-full"
                      variant={tier.popular ? "default" : "outline"}
                      onClick={() => window.location.href = 'https://my.bfocfo.com/onboarding/cpa'}
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
              <Shield className="w-8 h-8 text-gold mr-3" />
              <h3 className="font-semibold text-lg">Compliance & Security</h3>
            </div>
            <p className="text-muted-foreground">
              Aligned with <strong>AICPA</strong>, <strong>IRS</strong>, and <strong>state board</strong> requirements. 
              SOC 2-ready, GDPR, and CCPA compliant.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTAs */}
      <section className="py-16">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <div className="space-y-6">
            <h2 className="font-serif text-3xl font-bold text-foreground">
              Ready to Modernize Your Practice?
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => window.location.href = 'https://my.bfocfo.com/onboarding/cpa'}
                className="bg-gradient-to-r from-gold to-gold/90 hover:from-gold/90 hover:to-gold text-navy font-bold px-8 py-4"
              >
                Start My Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                onClick={() => window.location.href = 'https://my.bfocfo.com/demo'}
                className="border-emerald text-emerald hover:bg-emerald/10 px-8 py-4"
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