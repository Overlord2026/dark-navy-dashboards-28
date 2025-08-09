import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Target, 
  BarChart3, 
  Users, 
  Zap, 
  Bot, 
  Shield,
  ArrowRight, 
  ExternalLink,
  CheckCircle,
  Star,
  Megaphone
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LandingNavigation } from '@/components/marketplace/LandingNavigation';
import { BrandedFooter } from '@/components/ui/BrandedFooter';

export const MarketingAgencyIntroPage: React.FC = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: TrendingUp,
      title: 'Ad Integration',
      description: 'Connect Google Ads, Facebook, LinkedIn, and more for centralized campaign tracking'
    },
    {
      icon: Target,
      title: 'Lead Capture Forms',
      description: 'Persona-specific landing pages with UTM tracking for attribution'
    },
    {
      icon: BarChart3,
      title: 'ROI Dashboard',
      description: 'Show clients exact cost-per-lead, cost-per-close, and lifetime value metrics'
    },
    {
      icon: Users,
      title: 'CRM Integration',
      description: 'Sync lead status updates directly to client CRMs'
    },
    {
      icon: Zap,
      title: 'Smart Cadences',
      description: 'Triggered SMS/email follow-ups based on lead behavior'
    },
    {
      icon: Bot,
      title: 'Linda AI Assistant',
      description: 'Create ad copy, email sequences, and meeting summaries automatically'
    },
    {
      icon: Shield,
      title: 'Compliance Tools',
      description: 'Built-in review workflow for regulated industries like finance and insurance'
    }
  ];

  const steps = [
    {
      number: '1',
      title: 'Launch Campaigns',
      description: 'Use built-in templates or connect your own ad accounts'
    },
    {
      number: '2',
      title: 'Capture Leads',
      description: 'Auto-populate client CRMs with enriched lead data'
    },
    {
      number: '3',
      title: 'Nurture Automatically',
      description: 'Personalized SMS and email sequences through Twilio integration'
    },
    {
      number: '4',
      title: 'Track ROI',
      description: 'Real-time dashboards show spend vs. revenue generated'
    },
    {
      number: '5',
      title: 'Report & Optimize',
      description: 'Export branded reports to prove performance and retain clients'
    }
  ];

  const pricingTiers = [
    {
      name: 'Basic',
      monthly: '$299',
      annual: '$3000',
      features: [
        '2 client portals',
        'Ad integration',
        'ROI dashboard',
        'Linda AI add-on ($10/mo)'
      ]
    },
    {
      name: 'Pro',
      monthly: '$599',
      annual: '$6000',
      features: [
        'All Basic features',
        '5 client portals',
        'Smart cadences',
        'AI ad copy',
        'Linda AI included'
      ],
      popular: true
    },
    {
      name: 'Premium', 
      monthly: '$999',
      annual: '$10,000',
      features: [
        'All Pro features',
        'Unlimited portals',
        'White-label platform',
        'API access'
      ]
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
              <Megaphone className="w-4 h-4 mr-2" />
              Marketing Agencies
            </Badge>
            
            <div className="space-y-6">
              <h1 className="font-serif text-5xl lg:text-6xl font-bold text-foreground">
                Scale Client Campaigns with a Fully Integrated Lead-to-Sales Platform
              </h1>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                Manage ads, track ROI, and prove value with end-to-end visibility — from click to closed deal.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => window.open('https://my.bfocfo.com/onboarding/marketing-agency', '_blank')}
                className="bg-gradient-to-r from-emerald to-emerald/90 hover:from-emerald/90 hover:to-emerald text-white px-8 py-4 text-lg"
              >
                Get Started as a Marketing Partner
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                onClick={() => window.open('https://my.bfocfo.com/demo', '_blank')}
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
          <p className="text-lg text-foreground leading-relaxed text-center">
            The <strong>Marketing Agency Growth Hub</strong> transforms how agencies run campaigns for financial advisors, 
            insurance agents, and other professionals. Connect ads, capture leads, automate follow-ups, and track results 
            in one platform — all branded for your agency.
          </p>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
              Key Benefits
            </h2>
          </motion.div>

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
      <section className="py-24 bg-card/30">
        <div className="container mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="flex gap-4"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-emerald to-emerald/80 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">{step.number}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Table */}
      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
              Pricing
            </h2>
            <p className="text-muted-foreground mb-8">
              Special Offer: Save 20% with annual billing.
            </p>
          </motion.div>

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
                    ? 'border-emerald bg-gradient-to-b from-emerald/5 to-card' 
                    : 'bg-card'
                } transition-all duration-300 hover:shadow-lg`}>
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-emerald text-white">
                        <Star className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">{tier.name}</CardTitle>
                    <div className="space-y-1">
                      <div className="text-3xl font-bold text-emerald">{tier.monthly}</div>
                      <div className="text-sm text-muted-foreground">monthly</div>
                      <div className="text-lg text-foreground">{tier.annual}</div>
                      <div className="text-sm text-muted-foreground">annual</div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {tier.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-emerald flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
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
          <p className="text-muted-foreground">
            Meets <strong>FTC advertising disclosure</strong> standards, <strong>GDPR</strong>, <strong>CCPA</strong>, 
            and industry-specific ad compliance for <strong>FINRA</strong> and <strong>state insurance</strong> regulations.
          </p>
        </div>
      </section>

      {/* Final CTAs */}
      <section className="py-16">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => window.open('https://my.bfocfo.com/onboarding/marketing-agency', '_blank')}
              className="bg-gradient-to-r from-emerald to-emerald/90 hover:from-emerald/90 hover:to-emerald text-white px-8 py-4 text-lg"
            >
              Start My Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button 
              size="lg"
              variant="outline"
              onClick={() => window.open('https://my.bfocfo.com/demo', '_blank')}
              className="border-gold text-gold hover:bg-gold/10 px-8 py-4 text-lg"
            >
              Book a Demo
              <ExternalLink className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      <BrandedFooter />
    </div>
  );
};