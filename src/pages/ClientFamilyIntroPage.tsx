import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  TrendingUp, 
  FileText, 
  Users, 
  ArrowRight, 
  CheckCircle, 
  Building, 
  Heart,
  Calculator,
  Vault,
  Crown,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LandingNavigation } from '@/components/marketplace/LandingNavigation';
import { BrandedFooter } from '@/components/ui/BrandedFooter';

export const ClientFamilyIntroPage: React.FC = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: TrendingUp,
      title: 'All Accounts, One View',
      description: 'Net worth tracking with real-time sync across bank, investment, and property accounts'
    },
    {
      icon: Calculator,
      title: 'SWAG™ Retirement Roadmap',
      description: 'Project your retirement readiness with scenario modeling, stress tests, and income gap analysis'
    },
    {
      icon: FileText,
      title: 'Estate Planning Suite',
      description: 'Wills, trusts, powers of attorney, and healthcare directives management'
    },
    {
      icon: Vault,
      title: 'Family Legacy Box™',
      description: 'Securely store and share vital documents with loved ones'
    },
    {
      icon: Building,
      title: 'Property & Asset Management',
      description: 'Track real estate, business interests, collectibles, and digital assets'
    },
    {
      icon: Shield,
      title: 'Advanced Tax Planning',
      description: 'Roth conversion analyzer, state residency planning, charitable giving optimization'
    }
  ];

  const howItWorksSteps = [
    {
      step: '1',
      title: 'Connect Your Accounts',
      description: 'Plaid integration for instant financial data sync'
    },
    {
      step: '2',
      title: 'Define Your Goals',
      description: 'Input lifestyle, retirement, and legacy targets'
    },
    {
      step: '3',
      title: 'Run Your SWAG™ Roadmap',
      description: 'Get a confidence score and customized action plan'
    },
    {
      step: '4',
      title: 'Organize Your Estate',
      description: 'Populate your Family Legacy Box™ with critical documents'
    },
    {
      step: '5',
      title: 'Stay On Track',
      description: 'Automated reminders, alerts, and progress tracking'
    }
  ];

  const pricingTiers = [
    {
      name: 'Basic',
      monthly: '$19',
      annual: '$200',
      features: [
        'Family dashboard',
        'Net worth tracking',
        'Basic property management',
        'Linda AI Assistant add-on ($10/mo)'
      ],
      popular: false
    },
    {
      name: 'Premium',
      monthly: '$49',
      annual: '$500',
      features: [
        'All Basic features',
        'Family Legacy Box™',
        'SWAG™ Retirement Roadmap',
        'Estate planning suite',
        'Advanced tax tools',
        'Linda AI included'
      ],
      popular: true
    },
    {
      name: 'Elite',
      monthly: '$99',
      annual: '$1000',
      features: [
        'All Premium features',
        'Dedicated advisor',
        'Concierge family office services',
        'Unlimited storage',
        'VIP support'
      ],
      popular: false
    }
  ];

  const scrollToHowItWorks = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
              <Users className="w-4 h-4 mr-2" />
              Clients & Families
            </Badge>
            
            <div className="space-y-6">
              <h1 className="font-serif text-5xl lg:text-6xl font-bold text-foreground">
                Your Complete Family Office, in One Secure Dashboard
              </h1>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                Track your wealth, plan for the future, and protect your legacy — all in one place, 
                backed by fiduciary care and industry-leading security.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate('/onboarding/client-family')}
                className="bg-gradient-to-r from-emerald to-emerald/90 hover:from-emerald/90 hover:to-emerald text-white px-8 py-4 text-lg"
              >
                Get Started Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                onClick={scrollToHowItWorks}
                className="border-gold text-gold hover:bg-gold/10 px-8 py-4 text-lg"
              >
                See How It Works
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Intro Paragraph */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto max-w-4xl px-4">
          <p className="text-lg text-foreground leading-relaxed text-center">
            Welcome to your <strong>personalized family wealth hub</strong>. We've built the tools you need to 
            simplify your finances, protect your loved ones, and make confident decisions — without juggling 
            multiple logins or paying for separate subscriptions. Everything from your <strong>SWAG™ Retirement Roadmap</strong> to 
            <strong> Estate Planning Suite</strong>, <strong>Family Legacy Box™</strong>, and secure document storage is included.
          </p>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Everything Your Family Needs
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive wealth management tools designed for modern families
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
                      <benefit.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
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
      <section id="how-it-works" className="py-24 bg-card/30 scroll-mt-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes and see results immediately
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
                <div className="w-16 h-16 bg-gradient-to-br from-gold to-gold/80 rounded-full flex items-center justify-center mx-auto mb-4 text-navy font-bold text-xl">
                  {step.step}
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
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Choose Your Plan
            </h2>
            <p className="text-lg text-muted-foreground mb-4">
              All plans include our core family office platform
            </p>
            <Badge className="bg-emerald/20 text-emerald border-emerald/30">
              Special Offer: Save 15% with annual billing
            </Badge>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className={`h-full relative ${tier.popular ? 'border-gold border-2 scale-105' : 'border-border'}`}>
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gold text-navy px-4 py-1">
                        <Star className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
                    <div className="space-y-2">
                      <div className="text-3xl font-bold text-foreground">{tier.monthly}<span className="text-sm text-muted-foreground">/month</span></div>
                      <div className="text-lg text-muted-foreground">or {tier.annual}/year</div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {tier.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-emerald mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className={`w-full mt-6 ${tier.popular 
                        ? 'bg-gradient-to-r from-gold to-gold/90 text-navy hover:from-gold/90 hover:to-gold' 
                        : 'bg-gradient-to-r from-emerald to-emerald/90 text-white hover:from-emerald/90 hover:to-emerald'
                      }`}
                      onClick={() => navigate('/onboarding/client-family')}
                    >
                      Start {tier.name} Plan
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
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-emerald" />
            <h3 className="font-semibold text-foreground">Compliance & Security</h3>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            We maintain strict compliance with financial data privacy and fiduciary regulations, 
            including SOC 2, GDPR, CCPA, HIPAA where applicable.
          </p>
        </div>
      </section>

      {/* Final CTAs */}
      <section className="py-20">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <div className="space-y-6">
            <h2 className="font-serif text-3xl font-bold text-foreground">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of families who trust us with their wealth management
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate('/onboarding/client-family')}
                className="bg-gradient-to-r from-emerald to-emerald/90 hover:from-emerald/90 hover:to-emerald text-white px-8 py-4 text-lg"
              >
                Start My Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate('/demo')}
                className="border-gold text-gold hover:bg-gold/10 px-8 py-4 text-lg"
              >
                Book a Demo
                <Heart className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <BrandedFooter />
    </div>
  );
};