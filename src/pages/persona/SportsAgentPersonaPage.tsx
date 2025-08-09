import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy, 
  Users, 
  Shield, 
  BarChart3, 
  Brain, 
  FileText, 
  Phone, 
  GraduationCap,
  Target,
  Lock,
  Zap,
  MessageSquare,
  ArrowRight,
  PlayCircle,
  DollarSign,
  Star,
  CheckCircle,
  Globe,
  Award,
  Handshake,
  TrendingUp,
  BookOpen,
  CreditCard,
  Eye,
  Settings
} from 'lucide-react';
import { LandingNavigation } from '@/components/marketplace/LandingNavigation';
import { BrandedFooter } from '@/components/ui/BrandedFooter';

export const SportsAgentPersonaPage: React.FC = () => {
  const navigate = useNavigate();

  const valueProps = [
    {
      icon: Users,
      title: 'Athlete-Centric Portals',
      description: 'Give each client a secure, customized platform to track finances, goals, and resources.'
    },
    {
      icon: BarChart3,
      title: 'Holistic Planning Tools',
      description: 'SWAG™ Retirement Roadmap, estate planning, tax optimization, and legacy management in one place.'
    },
    {
      icon: Shield,
      title: 'Agent Dashboard',
      description: 'Manage client portfolios, documents, and performance metrics from a single secure login.'
    }
  ];

  const keyFeatures = [
    { icon: Award, text: 'Branded client portal with agency logo' },
    { icon: TrendingUp, text: 'SWAG™ Retirement Roadmap with stress-testing and scenario modeling' },
    { icon: Shield, text: 'Compliance tracking for endorsements, NIL, and investment disclosures' },
    { icon: Brain, text: 'AI-driven meeting summaries and follow-up tasks' },
    { icon: Lock, text: 'Document vault for contracts, agreements, and personal documents' },
    { icon: Phone, text: 'Twilio-powered SMS & voice communication tools' },
    { icon: Handshake, text: 'Marketplace access for vetted accountants, attorneys, and insurance pros' },
    { icon: GraduationCap, text: 'Financial literacy and wellbeing education center for clients' }
  ];

  const integratedTools = [
    {
      title: 'Linda AI Assistant',
      description: 'For contract briefings, financial summaries, and next steps'
    },
    {
      title: 'Built-in Compliance Platform',
      description: 'For sports agency and financial regulations'
    },
    {
      title: 'Athlete Education Curriculum',
      description: 'NIL, contract management, investment basics'
    },
    {
      title: 'Marketing Automation',
      description: 'To engage and retain clients year-round'
    }
  ];

  const testimonials = [
    {
      quote: "Our athletes love having all their financial and personal planning tools in one secure app.",
      author: "Sports Agent, Elite Athlete Management"
    },
    {
      quote: "The SWAG Roadmap helps us guide clients far beyond their playing career.",
      author: "Principal Agent, Premier Sports Group"
    },
    {
      quote: "Compliance tracking gives us peace of mind.",
      author: "Managing Partner, Championship Sports Agency"
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
              <Trophy className="w-4 h-4 mr-2" />
              Sports Agents
            </Badge>
            
            <div className="space-y-6">
              <h1 className="font-serif text-5xl lg:text-6xl font-bold text-foreground">
                Empower Your Athletes with a Unified Wealth & Wellbeing Platform
              </h1>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                From financial planning and compliance to contract support and legacy building — all in one secure, agent-branded hub.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate('/signup?persona=sports-agent')}
                className="bg-gradient-to-r from-gold to-gold/90 hover:from-gold/90 hover:to-gold text-navy font-bold px-8 py-4 text-lg"
              >
                Get Started Today
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
                <Card className="h-full bg-card/50 backdrop-blur-sm border border-border hover:border-gold/30 transition-all duration-300 hover-scale">
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
              Elite Athlete Representation Platform
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive tools designed to elevate athlete representation and long-term success
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
                className="flex items-center gap-4 p-4 rounded-lg bg-card/30 border border-border hover-scale"
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
              <div className="w-16 h-16 bg-emerald/20 rounded-xl flex items-center justify-center mx-auto mb-3 hover-scale">
                <Trophy className="w-8 h-8 text-emerald" />
              </div>
              <p className="text-sm text-muted-foreground">Athlete Success</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-emerald/20 rounded-xl flex items-center justify-center mx-auto mb-3 hover-scale">
                <FileText className="w-8 h-8 text-emerald" />
              </div>
              <p className="text-sm text-muted-foreground">Contracts</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-emerald/20 rounded-xl flex items-center justify-center mx-auto mb-3 hover-scale">
                <CreditCard className="w-8 h-8 text-emerald" />
              </div>
              <p className="text-sm text-muted-foreground">Financial Planning</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-emerald/20 rounded-xl flex items-center justify-center mx-auto mb-3 hover-scale">
                <Target className="w-8 h-8 text-emerald" />
              </div>
              <p className="text-sm text-muted-foreground">Legacy Building</p>
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
              AI-Powered Sports Agency Solutions
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Advanced tools and automation designed specifically for sports agents and athlete management
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {integratedTools.map((tool, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="animate-fade-in"
              >
                <Card className="h-full bg-gradient-to-br from-card to-card/50 border border-gold/20 hover-scale">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Zap className="w-8 h-8 text-gold flex-shrink-0 mt-1" />
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
              Trusted by Elite Sports Agents
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
                className="animate-scale-in"
              >
                <Card className="h-full p-6 bg-card border border-gold/20 hover-scale">
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
            className="animate-fade-in"
          >
            <DollarSign className="w-16 h-16 text-gold mx-auto mb-6" />
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
              Plans starting at $149/month — scale with your agency
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Professional-grade athlete management platform that grows with your sports agency
            </p>
            
            <Button 
              size="lg"
              onClick={() => navigate('/pricing')}
              className="bg-gradient-to-r from-emerald to-emerald/90 hover:from-emerald/90 hover:to-emerald text-background font-bold px-8 py-4 text-lg hover-scale"
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
              Raise the Standard for Athlete Representation
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Give your clients a platform that supports them on and off the field.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate('/signup?persona=sports-agent')}
                className="bg-gradient-to-r from-gold to-gold/90 hover:from-gold/90 hover:to-gold text-navy font-bold px-8 py-4 text-lg hover-scale"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate('/demo/request')}
                className="border-emerald text-emerald hover:bg-emerald/10 px-8 py-4 text-lg hover-scale"
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