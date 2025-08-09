import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  TrendingUp, 
  Shield, 
  BarChart3, 
  DollarSign, 
  Brain, 
  Lock, 
  Users, 
  Calendar, 
  FileText,
  Target,
  CheckCircle,
  Zap,
  ArrowRight,
  PlayCircle,
  Star,
  Settings,
  Award,
  BookOpen,
  AlertTriangle,
  Globe,
  Briefcase,
  PieChart,
  Calculator,
  FileCheck
} from 'lucide-react';
import { LandingNavigation } from '@/components/marketplace/LandingNavigation';
import { BrandedFooter } from '@/components/ui/BrandedFooter';

export const BusinessOwnersEntrepreneursPersonaPage: React.FC = () => {
  const navigate = useNavigate();

  const valueProps = [
    {
      icon: BarChart3,
      title: 'Integrated Business & Personal Finance',
      description: 'Track company KPIs and personal net worth side-by-side.'
    },
    {
      icon: Calculator,
      title: 'Tax & Entity Optimization',
      description: 'Structure for efficiency and growth with guided tools.'
    },
    {
      icon: Target,
      title: 'Succession & Exit Planning',
      description: 'Build strategies to protect value and ensure smooth transitions.'
    }
  ];

  const keyFeatures = [
    { icon: PieChart, text: 'Unified dashboard for business and personal wealth' },
    { icon: Brain, text: 'AI-driven tax planning & cash flow forecasts' },
    { icon: Lock, text: 'Secure document vault for contracts, financials, and estate docs' },
    { icon: TrendingUp, text: 'SWAG™ Retirement Roadmap integration for owners\' personal planning' },
    { icon: Users, text: 'Professional marketplace access (legal, accounting, advisory)' },
    { icon: Settings, text: 'Customizable KPIs for business performance' },
    { icon: Calendar, text: 'Automated reminders for compliance, filings, and renewals' }
  ];

  const integratedTools = [
    {
      title: 'Linda AI Assistant',
      description: 'For summarizing meetings, creating proposals, and generating business insights'
    },
    {
      title: 'Compliance Platform',
      description: 'For document retention and audit readiness'
    },
    {
      title: 'Exit Readiness Score',
      description: 'And buyer preparation tools'
    }
  ];

  const testimonials = [
    {
      quote: "Finally, a single tool to see both my business and personal financial health.",
      author: "CEO, Tech Startup"
    },
    {
      quote: "The tax planning tools saved us thousands in the first year.",
      author: "Owner, Manufacturing Company"
    },
    {
      quote: "I feel more prepared for my eventual exit strategy than ever before.",
      author: "Founder, Service Business"
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
              <Building2 className="w-4 h-4 mr-2" />
              Business Owners & Entrepreneurs
            </Badge>
            
            <div className="space-y-6">
              <h1 className="font-serif text-5xl lg:text-6xl font-bold text-foreground">
                Run Your Business — And Your Wealth — From One Smart Platform
              </h1>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                From business growth strategies to personal wealth planning, tax optimization, and legacy building — all in one secure hub.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate('/signup?persona=business-owners-entrepreneurs')}
                className="bg-gradient-to-r from-emerald to-emerald/90 hover:from-emerald/90 hover:to-emerald text-white font-bold px-8 py-4 text-lg"
              >
                Start Your Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate('#features')}
                className="border-gold text-gold hover:bg-gold/10 px-8 py-4 text-lg"
              >
                See How It Works
                <PlayCircle className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Value Proposition Blocks */}
      <section className="py-24 bg-card/30">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {valueProps.map((prop, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="h-full bg-card/50 backdrop-blur-sm border border-border hover:border-emerald/30 transition-all duration-300">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald to-emerald/80 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4">
                      <prop.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{prop.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed text-center">
                      {prop.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
              Complete Business & Wealth Management Platform
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              All the tools you need to grow your business and build personal wealth
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {keyFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-lg bg-card/30 border border-border"
              >
                <div className="w-10 h-10 bg-emerald/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-emerald" />
                </div>
                <span className="text-foreground">{feature.text}</span>
              </motion.div>
            ))}
          </div>

          {/* Feature Icons Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-emerald/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Building2 className="w-8 h-8 text-emerald" />
              </div>
              <p className="text-sm text-muted-foreground">Business Growth</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-emerald/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-8 h-8 text-emerald" />
              </div>
              <p className="text-sm text-muted-foreground">Wealth Planning</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-emerald/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Calculator className="w-8 h-8 text-emerald" />
              </div>
              <p className="text-sm text-muted-foreground">Tax Optimization</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-emerald/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Target className="w-8 h-8 text-emerald" />
              </div>
              <p className="text-sm text-muted-foreground">Exit Planning</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Integrated Tools Callout */}
      <section className="py-24 bg-card/30">
        <div className="container mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
              AI-Powered Business Solutions
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Advanced automation and intelligence tools designed specifically for business owners
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {integratedTools.map((tool, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="h-full bg-gradient-to-br from-card to-card/50 border border-emerald/20">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Zap className="w-8 h-8 text-emerald flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-lg font-bold text-foreground mb-2">{tool.title}</h3>
                        <p className="text-muted-foreground">{tool.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Slider */}
      <section className="py-24">
        <div className="container mx-auto max-w-5xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
              Trusted by Business Leaders
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="h-full p-6 bg-card border border-emerald/20">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-4">
                      <Star className="w-5 h-5 text-gold" />
                      <Star className="w-5 h-5 text-gold" />
                      <Star className="w-5 h-5 text-gold" />
                      <Star className="w-5 h-5 text-gold" />
                      <Star className="w-5 h-5 text-gold" />
                    </div>
                    <blockquote className="text-foreground mb-4 italic flex-1">
                      "{testimonial.quote}"
                    </blockquote>
                    <cite className="text-muted-foreground text-sm">— {testimonial.author}</cite>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="py-24 bg-card/30">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <DollarSign className="w-16 h-16 text-emerald mx-auto mb-6" />
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
              Plans starting at $49/month — with scalable features as your business grows
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Professional-grade platform that scales with your business success
            </p>
            
            <Button 
              size="lg"
              onClick={() => navigate('/pricing')}
              className="bg-gradient-to-r from-emerald to-emerald/90 hover:from-emerald/90 hover:to-emerald text-white font-bold px-8 py-4 text-lg"
            >
              View Plans & Features
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-8"
          >
            <h2 className="font-serif text-5xl font-bold text-foreground">
              Empower Your Business Journey
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From startup to succession, we've got you covered.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate('/signup?persona=business-owners-entrepreneurs')}
                className="bg-gradient-to-r from-emerald to-emerald/90 hover:from-emerald/90 hover:to-emerald text-white font-bold px-8 py-4 text-lg"
              >
                Start Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate('/demo/request')}
                className="border-gold text-gold hover:bg-gold/10 px-8 py-4 text-lg"
              >
                Book a Demo
                <Globe className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <BrandedFooter />
    </div>
  );
};