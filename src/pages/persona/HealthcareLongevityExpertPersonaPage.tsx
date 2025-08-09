import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  FileText, 
  Shield, 
  Calendar, 
  Bot, 
  DollarSign,
  Activity,
  Users,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Star,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  Video,
  Phone,
  TrendingUp,
  BarChart3,
  Clock,
  Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LandingNavigation } from '@/components/marketplace/LandingNavigation';
import { BrandedFooter } from '@/components/ui/BrandedFooter';

export const HealthcareLongevityExpertPersonaPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const valueProps = [
    {
      icon: Users,
      title: 'Client Intake & Health Profiles',
      description: 'Securely capture patient/longevity client history, lifestyle data, and goals.'
    },
    {
      icon: Activity,
      title: 'Care Plan Coordination',
      description: 'Centralize care team communications and track interventions.'
    },
    {
      icon: Bot,
      title: 'AI-Powered Insights',
      description: 'Identify risk factors, model lifestyle impact, and personalize recommendations.'
    }
  ];

  const keyFeatures = [
    {
      icon: Shield,
      title: 'HIPAA-Compliant Document Vault',
      description: 'Secure, encrypted storage for all patient health records and care documentation'
    },
    {
      icon: BarChart3,
      title: 'Wellness Tracking Dashboard',
      description: 'Monitor diet, exercise, biometrics, and lifestyle factors in real-time'
    },
    {
      icon: Target,
      title: 'AI-Driven Risk Assessment',
      description: 'Advanced algorithms to identify health risks and optimization opportunities'
    },
    {
      icon: Calendar,
      title: 'Integrated Appointment Scheduling',
      description: 'Automated scheduling with SMS and email reminders for all appointments'
    },
    {
      icon: Video,
      title: 'Video Consults & Group Sessions',
      description: 'Built-in telehealth platform for individual and group wellness sessions'
    },
    {
      icon: CheckCircle,
      title: 'Healthcare Compliance Tools',
      description: 'Automated compliance monitoring for healthcare regulations and audit trails'
    }
  ];

  const testimonials = [
    {
      quote: "Client adherence to care plans improved by 40% since implementing this platform. The wellness tracking and AI insights keep my clients engaged and motivated.",
      author: "Dr. Maria Santos, MD",
      practice: "Vitality Longevity Clinic"
    },
    {
      quote: "Communication across our care team has never been smoother. We can coordinate treatments and track progress in real-time, leading to better outcomes.",
      author: "Dr. James Chen, DO",
      practice: "Optimal Health Partners"
    },
    {
      quote: "My clients trust the platform's security and love the personalized insights. It's transformed how we approach long-term wellness planning.",
      author: "Dr. Sarah Williams, NP",
      practice: "Lifespan Wellness Center"
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
        <div className="absolute inset-0 bg-gradient-to-r from-emerald/90 to-emerald/70"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8"
          >
            <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
              <Heart className="w-4 h-4 mr-2" />
              Healthcare Longevity Experts
            </Badge>
            
            <div className="space-y-6">
              <h1 className="font-serif text-5xl lg:text-6xl font-bold text-white">
                Elevate Longevity Care with a Unified, AI-Driven Platform
              </h1>
              <p className="text-xl text-white/90 max-w-4xl mx-auto leading-relaxed">
                From client health planning to wellness tracking, coordination, and education — all in one secure hub.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate('/signup?persona=healthcare-longevity-expert')}
                className="bg-white text-emerald hover:bg-white/90 px-8 py-4 text-lg font-semibold"
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
                className="animate-fade-in"
              >
                <Card className="h-full bg-card/50 backdrop-blur-sm border border-border hover:border-emerald/30 transition-all duration-300 hover-scale">
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
              Comprehensive Longevity Care Tools
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to deliver exceptional longevity and wellness care
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
                className="flex gap-4 animate-fade-in"
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
              Integrated Healthcare Ecosystem
            </h2>
            <p className="text-xl text-muted-foreground">
              Seamlessly connected tools for comprehensive longevity care management
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="animate-scale-in"
            >
              <Card className="bg-gradient-to-br from-emerald/5 to-emerald/10 border-emerald/20 hover-scale">
                <CardHeader>
                  <Shield className="w-8 h-8 text-emerald mb-2" />
                  <CardTitle className="text-emerald">HIPAA Compliance Platform</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Built-in compliance monitoring for HIPAA regulations and comprehensive healthcare audits.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="animate-scale-in"
            >
              <Card className="bg-gradient-to-br from-navy/5 to-navy/10 border-navy/20 hover-scale">
                <CardHeader>
                  <Phone className="w-8 h-8 text-navy mb-2" />
                  <CardTitle className="text-navy">Twilio Communication</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    SMS and voice reminders for appointments, medication, and wellness check-ins.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="animate-scale-in"
            >
              <Card className="bg-gradient-to-br from-gold/5 to-gold/10 border-gold/20 hover-scale">
                <CardHeader>
                  <TrendingUp className="w-8 h-8 text-gold mb-2" />
                  <CardTitle className="text-gold">SWAG™ Retirement Roadmap</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Optional financial longevity planning tool for clients focusing on wealth and health integration.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
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
              What Healthcare Longevity Experts Say
            </h2>
          </motion.div>

          <div className="relative">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-center justify-center mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-emerald fill-emerald" />
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
                      {testimonials[currentTestimonial].practice}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <div className="flex justify-center gap-4 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={prevTestimonial}
                className="w-10 h-10 p-0 hover-scale"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={nextTestimonial}
                className="w-10 h-10 p-0 hover-scale"
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
            className="animate-fade-in"
          >
            <DollarSign className="w-16 h-16 text-emerald mx-auto mb-4" />
            <h3 className="font-serif text-2xl font-bold text-foreground mb-4">
              Plans starting at $25/month — scale as your practice grows.
            </h3>
            <Button 
              variant="outline"
              onClick={() => navigate('/pricing')}
              className="border-emerald text-emerald hover:bg-emerald/10 hover-scale"
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
            className="space-y-8 animate-fade-in"
          >
            <div className="space-y-4">
              <h2 className="font-serif text-4xl lg:text-5xl font-bold text-foreground">
                Transform Your Longevity Practice
              </h2>
              <p className="text-xl text-muted-foreground">
                Empower your clients with personalized, long-term wellness strategies.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate('/signup?persona=healthcare-longevity-expert')}
                className="bg-gradient-to-r from-emerald to-emerald/90 hover:from-emerald/90 hover:to-emerald text-white px-8 py-4 text-lg hover-scale"
              >
                Start Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate('/demo')}
                className="border-gold text-gold hover:bg-gold/10 px-8 py-4 text-lg hover-scale"
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