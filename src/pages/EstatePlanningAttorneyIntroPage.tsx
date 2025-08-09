import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Scale, 
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
  BarChart3,
  Calculator
} from 'lucide-react';
import { LandingNavigation } from '@/components/marketplace/LandingNavigation';
import { BrandedFooter } from '@/components/ui/BrandedFooter';
import { motion } from 'framer-motion';

export const EstatePlanningAttorneyIntroPage: React.FC = () => {
  const benefits = [
    {
      icon: FileText,
      title: 'Estate Planning Suite',
      description: 'Wills, trusts, powers of attorney, and healthcare directives in one toolkit'
    },
    {
      icon: Calculator,
      title: 'Advanced Calculators',
      description: 'Estate tax, gift tax, charitable giving strategies'
    },
    {
      icon: Lock,
      title: 'Secure Document Vault',
      description: 'Privilege-protected storage and easy sharing with clients'
    },
    {
      icon: Users,
      title: 'Client Portal',
      description: 'Real-time updates, document review, and communication'
    },
    {
      icon: TrendingUp,
      title: 'Linda AI Assistant',
      description: 'Draft clauses, summarize client meetings, and prepare follow-up emails'
    },
    {
      icon: CheckCircle,
      title: 'Compliance Tracking',
      description: 'State bar requirements, CLE tracking, and audit-ready logs'
    },
    {
      icon: BarChart3,
      title: 'Integrated Retirement Roadmap',
      description: 'Provide financial context for estate strategies'
    }
  ];

  const howItWorksSteps = [
    {
      number: '1',
      title: 'Onboard Clients',
      description: 'Digital intake forms and profile creation'
    },
    {
      number: '2',
      title: 'Plan & Draft',
      description: 'Use AI-assisted templates for wills, trusts, and directives'
    },
    {
      number: '3',
      title: 'Collaborate',
      description: 'Securely share drafts and receive client feedback in real time'
    },
    {
      number: '4',
      title: 'Finalize',
      description: 'Generate complete document packages for signing'
    },
    {
      number: '5',
      title: 'Stay Compliant',
      description: 'Track deadlines, CLEs, and maintain audit logs'
    }
  ];

  const pricingTiers = [
    {
      name: 'Basic',
      monthly: '$69',
      annual: '$700',
      features: [
        'Client portal',
        'Document vault',
        'Linda AI add-on ($10/mo)'
      ],
      popular: false
    },
    {
      name: 'Pro',
      monthly: '$129',
      annual: '$1300',
      features: [
        'All Basic features',
        'Estate planning suite',
        'Advanced calculators',
        'CLE tracking',
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
        'Integrated Retirement Roadmap',
        'Private client concierge',
        'White-label option'
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
              <Scale className="w-4 h-4 mr-2" />
              Estate Planning Attorneys
            </Badge>
            
            <div className="space-y-6">
              <h1 className="font-serif text-5xl lg:text-6xl font-bold text-foreground">
                Streamline Estate Planning with AI-Powered Client Management
              </h1>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                From intake to final documents — manage your practice, stay compliant, and serve clients faster.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => window.location.href = 'https://my.bfocfo.com/onboarding/estate-attorney'}
                className="bg-gradient-to-r from-emerald to-emerald/90 hover:from-emerald/90 hover:to-emerald text-navy font-bold px-8 py-4 text-lg"
              >
                Get Started as an Estate Planning Attorney
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
              The <strong className="text-emerald">Estate Planning Practice Hub</strong> is built for attorneys who want to deliver exceptional client service while managing their practice efficiently. Automate intake, draft complex estate plans, and ensure compliance — all within one secure platform.
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
              Professional-grade tools designed specifically for estate planning attorneys
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
              Five simple steps to transform your estate planning practice
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
              Professional tools that scale with your estate planning practice
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
                      onClick={() => window.location.href = 'https://my.bfocfo.com/onboarding/estate-attorney'}
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
              Fully compliant with <strong>ABA Model Rules</strong>, <strong>state bar privacy requirements</strong>, <strong>GDPR</strong>, and <strong>CCPA</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTAs */}
      <section className="py-16">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <div className="space-y-6">
            <h2 className="font-serif text-3xl font-bold text-foreground">
              Ready to Transform Your Estate Planning Practice?
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => window.location.href = 'https://my.bfocfo.com/onboarding/estate-attorney'}
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