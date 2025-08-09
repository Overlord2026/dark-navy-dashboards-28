import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Calculator, 
  Shield, 
  FileCheck, 
  Clock, 
  Users, 
  Bell, 
  Lock, 
  Folder,
  ArrowRight,
  PlayCircle,
  DollarSign,
  Star,
  CheckCircle,
  Zap,
  Globe,
  AlertCircle,
  BookOpen
} from 'lucide-react';
import { LandingNavigation } from '@/components/marketplace/LandingNavigation';
import { BrandedFooter } from '@/components/ui/BrandedFooter';

export const AccountantCPAPersonaPage: React.FC = () => {
  const navigate = useNavigate();

  const valueProps = [
    {
      icon: FileCheck,
      title: 'Centralized Workflow',
      description: 'Track returns, notices, and engagements.'
    },
    {
      icon: BookOpen,
      title: 'CE Tracking',
      description: 'Auto-record credits and certificates.'
    },
    {
      icon: Shield,
      title: 'Audit Readiness',
      description: 'Versioning and retention by IRS/state rules.'
    }
  ];

  const keyFeatures = [
    'Client request lists with auto-reminders',
    'CE portal with policy quizzes',
    'Review steps and SLA alerts',
    'Role-based access control',
    'Secure document vault'
  ];

  const integratedTools = [
    {
      title: 'Linda AI Assistant',
      description: 'For checklist creation and variance flagging'
    },
    {
      title: 'Retention Defaults',
      description: 'For IRS/state compliance'
    },
    {
      title: 'Expert Marketplace',
      description: 'Vetted tax/legal partners'
    }
  ];

  const testimonials = [
    {
      quote: "We halved our review time.",
      author: "Managing Partner, Regional CPA Firm"
    },
    {
      quote: "CE compliance is now automatic.",
      author: "Tax Director, Multi-State Practice"
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
              Accountants & CPAs
            </Badge>
            
            <div className="space-y-6">
              <h1 className="font-serif text-5xl lg:text-6xl font-bold text-foreground">
                Close Busy Season Without Chaos
              </h1>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                Workflow, CE tracking, and audit-ready records — all in one place.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate('/signup?persona=accountant-cpa')}
                className="bg-gradient-to-r from-gold to-gold/90 hover:from-gold/90 hover:to-gold text-navy font-bold px-8 py-4 text-lg"
              >
                Start Your Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate('#features')}
                className="border-emerald text-emerald hover:bg-emerald/10 px-8 py-4 text-lg"
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
                <Card className="h-full bg-card/50 backdrop-blur-sm border border-border hover:border-gold/30 transition-all duration-300">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-gold to-gold/80 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4">
                      <prop.icon className="w-8 h-8 text-navy" />
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
              Built for Tax Season & Beyond
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive practice management tools designed specifically for accounting firms
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {keyFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-4 rounded-lg bg-card/30 border border-border"
              >
                <CheckCircle className="w-5 h-5 text-emerald flex-shrink-0" />
                <span className="text-foreground">{feature}</span>
              </motion.div>
            ))}
          </div>

          {/* Feature Icons Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mt-16 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-emerald/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Bell className="w-8 h-8 text-emerald" />
              </div>
              <p className="text-sm text-muted-foreground">Auto Reminders</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-emerald/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-8 h-8 text-emerald" />
              </div>
              <p className="text-sm text-muted-foreground">CE Portal</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-emerald/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Clock className="w-8 h-8 text-emerald" />
              </div>
              <p className="text-sm text-muted-foreground">SLA Alerts</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-emerald/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Lock className="w-8 h-8 text-emerald" />
              </div>
              <p className="text-sm text-muted-foreground">Access Control</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-emerald/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Folder className="w-8 h-8 text-emerald" />
              </div>
              <p className="text-sm text-muted-foreground">Document Vault</p>
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
              AI-Powered Compliance Tools
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Advanced automation and expert networks to keep your practice running smoothly
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
                <Card className="h-full bg-gradient-to-br from-card to-card/50 border border-gold/20">
                  <CardContent className="p-6 text-center">
                    <Zap className="w-12 h-12 text-gold mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-foreground mb-2">{tool.title}</h3>
                    <p className="text-muted-foreground">{tool.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Slider */}
      <section className="py-24">
        <div className="container mx-auto max-w-4xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
              Trusted by CPA Firms
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="p-8 bg-card border border-gold/20">
                  <div className="flex items-start gap-4">
                    <Star className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                    <div>
                      <blockquote className="text-lg text-foreground mb-4 italic">
                        "{testimonial.quote}"
                      </blockquote>
                      <cite className="text-muted-foreground">— {testimonial.author}</cite>
                    </div>
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
            <DollarSign className="w-16 h-16 text-gold mx-auto mb-6" />
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
              Plans starting at $79/month — scale as your firm grows
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Flexible pricing that grows with your practice and client base
            </p>
            
            <Button 
              size="lg"
              onClick={() => navigate('/pricing')}
              className="bg-gradient-to-r from-emerald to-emerald/90 hover:from-emerald/90 hover:to-emerald text-background font-bold px-8 py-4 text-lg"
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
              Streamline Your Firm Operations
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join hundreds of CPA firms who've transformed their practice management and client service delivery
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate('/signup?persona=accountant-cpa')}
                className="bg-gradient-to-r from-gold to-gold/90 hover:from-gold/90 hover:to-gold text-navy font-bold px-8 py-4 text-lg"
              >
                Start Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate('/demo/request')}
                className="border-emerald text-emerald hover:bg-emerald/10 px-8 py-4 text-lg"
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