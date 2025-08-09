import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Scale, 
  FileText, 
  Shield, 
  Calendar, 
  Bot, 
  DollarSign,
  Clock,
  Briefcase,
  Users,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Star,
  ChevronLeft,
  ChevronRight,
  Gavel,
  Building2,
  Phone,
  TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LandingNavigation } from '@/components/marketplace/LandingNavigation';
import { BrandedFooter } from '@/components/ui/BrandedFooter';

export const LitigationAttorneyPersonaPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const valueProps = [
    {
      icon: Users,
      title: 'Client Intake & Management',
      description: 'Secure online intake forms, automatic profile creation, document collection.'
    },
    {
      icon: Briefcase,
      title: 'Case Lifecycle Tracking',
      description: 'Track every matter from filing to verdict, with integrated deadlines and alerts.'
    },
    {
      icon: Bot,
      title: 'AI-Powered Insights',
      description: 'Summarize depositions, flag compliance risks, and auto-draft follow-up letters.'
    }
  ];

  const keyFeatures = [
    {
      icon: Shield,
      title: 'Secure Document Vault',
      description: 'End-to-end encrypted storage for all case documents and client files'
    },
    {
      icon: FileText,
      title: 'Litigation Workflow Templates',
      description: 'Pre-built templates for civil, criminal, and commercial litigation matters'
    },
    {
      icon: Calendar,
      title: 'Calendar & Deadline Sync',
      description: 'Automatic court rule integration with deadline tracking and alerts'
    },
    {
      icon: Bot,
      title: 'AI Deposition Summarizer',
      description: 'Linda voice-enabled integration for automatic deposition analysis'
    },
    {
      icon: Clock,
      title: 'Billing & Time Tracking',
      description: 'Automated time capture with integrated invoicing and payment processing'
    },
    {
      icon: CheckCircle,
      title: 'Compliance Tracking',
      description: 'State bar and federal rule compliance monitoring with audit trails'
    }
  ];

  const testimonials = [
    {
      quote: "This platform increased my billable hours by 25% through automated case tracking and document management. I can focus on winning cases instead of chasing paperwork.",
      author: "Sarah Chen, Partner",
      firm: "Chen & Associates"
    },
    {
      quote: "Client satisfaction scores improved dramatically after implementing the automated communication system. My clients always know where their case stands.",
      author: "Michael Rodriguez, Solo Practitioner",
      firm: "Rodriguez Law"
    },
    {
      quote: "Haven't missed a single deadline since switching to this system. The court rule integration and automatic alerts are game-changers for litigation practice.",
      author: "Jennifer Walsh, Managing Partner",
      firm: "Walsh, Burke & Partners"
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-background to-navy">
      <LandingNavigation />
      
      {/* Hero Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 to-navy/70"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8"
          >
            <Badge className="bg-emerald/20 text-emerald border-emerald/30 px-4 py-2">
              <Scale className="w-4 h-4 mr-2" />
              Litigation Attorneys
            </Badge>
            
            <div className="space-y-6">
              <h1 className="font-serif text-5xl lg:text-6xl font-bold text-white">
                Litigation Attorneys, Meet Your All-in-One Practice Growth Platform
              </h1>
              <p className="text-xl text-white/90 max-w-4xl mx-auto leading-relaxed">
                From client intake to case tracking, compliance, and revenue growth — all in one secure, AI-powered hub.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate('/signup?persona=litigation-attorney')}
                className="bg-gradient-to-r from-emerald to-emerald/90 hover:from-emerald/90 hover:to-emerald text-white px-8 py-4 text-lg"
              >
                Start Your Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate('/demo')}
                className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg"
              >
                See How It Works
                <ExternalLink className="w-5 h-5 ml-2" />
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
      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
              Everything Your Litigation Practice Needs
            </h2>
            <p className="text-xl text-muted-foreground">
              Professional-grade tools designed specifically for litigation attorneys
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {keyFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-emerald to-emerald/80 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
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
              Integrated Practice Tools
            </h2>
            <p className="text-xl text-muted-foreground">
              More than just case management — a complete practice growth ecosystem
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-emerald/5 to-emerald/10 border-emerald/20">
              <CardHeader>
                <TrendingUp className="w-8 h-8 text-emerald mb-2" />
                <CardTitle className="text-emerald">SWAG™ Retirement Roadmap</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Included client value-add for attorneys offering wealth planning guidance alongside litigation services.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gold/5 to-gold/10 border-gold/20">
              <CardHeader>
                <Shield className="w-8 h-8 text-gold mb-2" />
                <CardTitle className="text-gold">Compliance Platform</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Built-in compliance tracking for audits, discovery obligations, and retention policies.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-navy/5 to-navy/10 border-navy/20">
              <CardHeader>
                <Phone className="w-8 h-8 text-navy mb-2" />
                <CardTitle className="text-navy">Twilio Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  SMS and voice reminders for court dates, client meetings, and deadline notifications.
                </p>
              </CardContent>
            </Card>
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
              What Litigation Attorneys Say
            </h2>
          </motion.div>

          <div className="relative">
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex items-center justify-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-gold fill-gold" />
                  ))}
                </div>
                <blockquote className="text-lg text-center text-foreground mb-6 leading-relaxed">
                  "{testimonials[currentTestimonial].quote}"
                </blockquote>
                <div className="text-center">
                  <div className="font-semibold text-foreground">
                    {testimonials[currentTestimonial].author}
                  </div>
                  <div className="text-muted-foreground">
                    {testimonials[currentTestimonial].firm}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center gap-4 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={prevTestimonial}
                className="w-10 h-10 p-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={nextTestimonial}
                className="w-10 h-10 p-0"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <DollarSign className="w-16 h-16 text-emerald mx-auto mb-4" />
            <h3 className="font-serif text-2xl font-bold text-foreground mb-4">
              Plans starting at $39/month — scale up as your caseload grows.
            </h3>
            <Button 
              variant="outline"
              onClick={() => navigate('/pricing')}
              className="border-emerald text-emerald hover:bg-emerald/10"
            >
              View Plans & Features
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h2 className="font-serif text-4xl lg:text-5xl font-bold text-foreground">
                Transform Your Litigation Practice
              </h2>
              <p className="text-xl text-muted-foreground">
                Your clients expect results. Give yourself the tools to deliver.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate('/signup?persona=litigation-attorney')}
                className="bg-gradient-to-r from-emerald to-emerald/90 hover:from-emerald/90 hover:to-emerald text-white px-8 py-4 text-lg"
              >
                Start Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate('/demo')}
                className="border-gold text-gold hover:bg-gold/10 px-8 py-4 text-lg"
              >
                Book a Demo
                <ExternalLink className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <BrandedFooter />
    </div>
  );
};