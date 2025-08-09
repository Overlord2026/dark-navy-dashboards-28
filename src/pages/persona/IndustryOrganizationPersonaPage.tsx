import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  Calendar, 
  GraduationCap, 
  Megaphone, 
  CreditCard, 
  Shield, 
  FileText,
  MessageSquare,
  Brain,
  Clock,
  Vote,
  ArrowRight,
  PlayCircle,
  DollarSign,
  Star,
  CheckCircle,
  Zap,
  Globe,
  UserCheck,
  Settings,
  BookOpen,
  Award,
  Handshake,
  BarChart3
} from 'lucide-react';
import { LandingNavigation } from '@/components/marketplace/LandingNavigation';
import { BrandedFooter } from '@/components/ui/BrandedFooter';

export const IndustryOrganizationPersonaPage: React.FC = () => {
  const navigate = useNavigate();

  const valueProps = [
    {
      icon: Users,
      title: 'Centralized Member Management',
      description: 'Keep track of member profiles, renewals, and engagement in one hub.'
    },
    {
      icon: Calendar,
      title: 'Event & Conference Management',
      description: 'Host, promote, and manage in-person or virtual events seamlessly.'
    },
    {
      icon: GraduationCap,
      title: 'Education & Advocacy Tools',
      description: 'Provide courses, certifications, and updates on industry initiatives.'
    }
  ];

  const keyFeatures = [
    { icon: UserCheck, text: 'Member database with tiered access and roles' },
    { icon: Calendar, text: 'Integrated event registration and ticketing system' },
    { icon: BookOpen, text: 'Learning Management System (LMS) for courses and CE credits' },
    { icon: MessageSquare, text: 'Twilio-powered SMS/email announcements and reminders' },
    { icon: CreditCard, text: 'Secure payment processing for dues, sponsorships, and event fees' },
    { icon: Handshake, text: 'Built-in marketplace for vetted service providers and partners' },
    { icon: Vote, text: 'Advocacy tools — petitions, policy updates, and surveys' },
    { icon: Shield, text: 'Compliance document storage for industry guidelines' }
  ];

  const integratedTools = [
    {
      title: 'Built-in Operations Management System',
      description: 'For association staff and committees'
    },
    {
      title: 'Pre-loaded LMS "Member Engagement Toolkit"',
      description: 'To help members leverage the platform'
    },
    {
      title: 'Linda AI Assistant',
      description: 'For automated newsletters, event promotions, and member surveys'
    },
    {
      title: 'Marketplace Access',
      description: 'To vetted vendors and speakers'
    }
  ];

  const testimonials = [
    {
      quote: "Our member engagement jumped 35% after moving to the platform.",
      author: "Executive Director, Professional Engineering Association"
    },
    {
      quote: "Managing conferences and webinars is now a one-person job.",
      author: "Events Manager, Healthcare Industry Council"
    },
    {
      quote: "We can finally track member activity and deliver real value.",
      author: "President, Legal Professional Organization"
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
              Industry Organizations
            </Badge>
            
            <div className="space-y-6">
              <h1 className="font-serif text-5xl lg:text-6xl font-bold text-foreground">
                Empower Your Members with Tools That Drive Impact
              </h1>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                From member management to event coordination, education, and advocacy — all in one secure platform.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate('/signup?persona=industry-organization')}
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
              Complete Association Management Platform
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to engage members, host events, and drive your industry forward
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
                <Users className="w-8 h-8 text-emerald" />
              </div>
              <p className="text-sm text-muted-foreground">Membership</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-emerald/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-8 h-8 text-emerald" />
              </div>
              <p className="text-sm text-muted-foreground">Events</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-emerald/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Award className="w-8 h-8 text-emerald" />
              </div>
              <p className="text-sm text-muted-foreground">Certifications</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-emerald/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Megaphone className="w-8 h-8 text-emerald" />
              </div>
              <p className="text-sm text-muted-foreground">Advocacy</p>
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
              Integrated Organization Management
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Beyond membership — complete staff operations, member education, AI assistance, and vendor networks
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
              Trusted by Industry Leaders
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
            <DollarSign className="w-16 h-16 text-gold mx-auto mb-6" />
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
              Plans starting at $199/month — scale as your organization grows
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Enterprise-grade association management tools that grow with your membership base
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
              Unite, Engage, and Grow Your Industry
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Equip your members and stakeholders with the tools they need to thrive.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate('/signup?persona=industry-organization')}
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