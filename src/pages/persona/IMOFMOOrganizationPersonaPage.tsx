import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  BarChart3, 
  Shield, 
  Phone, 
  UserPlus, 
  FileCheck, 
  DollarSign,
  Calendar,
  Lock,
  Zap,
  Brain,
  CheckCircle,
  ArrowRight,
  PlayCircle,
  Star,
  TrendingUp,
  Settings,
  Award,
  BookOpen,
  AlertTriangle,
  Globe,
  Target,
  MessageSquare,
  ClipboardList,
  Briefcase
} from 'lucide-react';
import { LandingNavigation } from '@/components/marketplace/LandingNavigation';
import { BrandedFooter } from '@/components/ui/BrandedFooter';

export const IMOFMOOrganizationPersonaPage: React.FC = () => {
  const navigate = useNavigate();

  const valueProps = [
    {
      icon: Users,
      title: 'Centralized Agent Management',
      description: 'Track licensing, contracts, and carrier appointments across your organization.'
    },
    {
      icon: BarChart3,
      title: 'Sales Performance Dashboard',
      description: 'Monitor production, leaderboards, and commission payouts in real time.'
    },
    {
      icon: Shield,
      title: 'Compliance Oversight',
      description: 'Maintain readiness for CMS, DOI, and carrier audits with centralized document control.'
    }
  ];

  const keyFeatures = [
    { icon: Building2, text: 'Multi-agent and office hierarchy management' },
    { icon: Phone, text: 'Twilio-powered messaging for bulk announcements and reminders' },
    { icon: UserPlus, text: 'Agent onboarding workflows with role-based training paths' },
    { icon: FileCheck, text: 'Contracting and licensing tracking with expiration alerts' },
    { icon: DollarSign, text: 'Commission and override tracking with payouts' },
    { icon: CheckCircle, text: 'Built-in compliance audit readiness for CMS and carriers' },
    { icon: MessageSquare, text: 'Marketing campaign templates for agents' },
    { icon: Briefcase, text: 'Marketplace access for recruiting, legal, accounting, and tech partners' }
  ];

  const integratedTools = [
    {
      title: 'Linda AI Assistant',
      description: 'For call summaries, training reinforcement, and agent coaching'
    },
    {
      title: 'Built-in Compliance Platform',
      description: 'With document retention and audit logs'
    },
    {
      title: 'SWAG™ Retirement Roadmap Integration',
      description: 'For agents to cross-sell retirement planning'
    },
    {
      title: 'Bulk Marketing Automation',
      description: 'With per-agent tracking'
    }
  ];

  const testimonials = [
    {
      quote: "Our agent onboarding time dropped from weeks to days.",
      author: "Managing Director, Premier Insurance Marketing"
    },
    {
      quote: "Compliance oversight is now a simple, centralized process.",
      author: "Chief Compliance Officer, Elite FMO"
    },
    {
      quote: "Production tracking in real time has boosted performance across the board.",
      author: "VP of Sales, National Insurance Group"
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
              <Building2 className="w-4 h-4 mr-2" />
              IMO & FMO Organizations
            </Badge>
            
            <div className="space-y-6">
              <h1 className="font-serif text-5xl lg:text-6xl font-bold text-foreground">
                Empower Your Agents with an All-in-One Sales & Compliance Platform
              </h1>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                From recruiting and onboarding to compliance oversight and sales performance tracking — all in one centralized hub.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate('/demo/request')}
                className="bg-gradient-to-r from-gold to-gold/90 hover:from-gold/90 hover:to-gold text-navy font-bold px-8 py-4 text-lg"
              >
                Schedule a Demo
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
              Enterprise Insurance Organization Platform
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive management tools designed for IMOs, FMOs, and large insurance organizations
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
                <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-gold" />
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
              <div className="w-16 h-16 bg-gold/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Users className="w-8 h-8 text-gold" />
              </div>
              <p className="text-sm text-muted-foreground">Agent Management</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gold/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-8 h-8 text-gold" />
              </div>
              <p className="text-sm text-muted-foreground">Performance</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gold/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-8 h-8 text-gold" />
              </div>
              <p className="text-sm text-muted-foreground">Commissions</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gold/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-8 h-8 text-gold" />
              </div>
              <p className="text-sm text-muted-foreground">Compliance</p>
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
              AI-Powered Organizational Solutions
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Advanced automation and intelligence tools designed specifically for insurance organizations
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
              >
                <Card className="h-full bg-gradient-to-br from-card to-card/50 border border-gold/20">
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
              Trusted by Leading Insurance Organizations
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
                <Card className="h-full p-6 bg-card border border-gold/20">
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
            <Building2 className="w-16 h-16 text-gold mx-auto mb-6" />
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
              Custom enterprise plans based on agent count — scalable for IMOs and FMOs of all sizes
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Enterprise-grade platform that scales with your organization's growth
            </p>
            
            <Button 
              size="lg"
              onClick={() => navigate('/pricing')}
              className="bg-gradient-to-r from-gold to-gold/90 hover:from-gold/90 hover:to-gold text-navy font-bold px-8 py-4 text-lg"
            >
              Request Pricing
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
              Lead Your Organization with Confidence
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Equip your agents with the tools to sell more, stay compliant, and grow faster.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate('/demo/request')}
                className="bg-gradient-to-r from-gold to-gold/90 hover:from-gold/90 hover:to-gold text-navy font-bold px-8 py-4 text-lg"
              >
                Schedule a Demo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate('/contact')}
                className="border-emerald text-emerald hover:bg-emerald/10 px-8 py-4 text-lg"
              >
                Contact Sales
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