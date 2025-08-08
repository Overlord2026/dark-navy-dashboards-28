import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gavel, Shield, FileText, Users, TrendingUp, Lock, Award, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function LitigationAttorneyLanding() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Case Vault",
      description: "Secure, encrypted storage for pleadings, exhibits, and transcripts with version control."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Evidence Tracker",
      description: "Complete chain-of-custody tracking with metadata and access logs for court compliance."
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Settlement Planning",
      description: "Integrate with SWAG Retirement Roadmap™ to model post-settlement financial outcomes."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Client Collaboration",
      description: "Secure portal for client communication, document sharing, and case status updates."
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Compliance Center",
      description: "Automated audit logs, deadline tracking, and court filing compliance management."
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "White-Label Ready",
      description: "Customize with your firm's branding, colors, and contact information."
    }
  ];

  const benefits = [
    {
      title: "Streamlined Case Management",
      description: "Organize all case materials, evidence, and communications in one secure platform.",
      stats: "75% faster case preparation"
    },
    {
      title: "Enhanced Client Experience",
      description: "Provide transparent case updates and secure document access to build trust.",
      stats: "95% client satisfaction rate"
    },
    {
      title: "Settlement Success Planning",
      description: "Help clients plan their financial future with integrated retirement planning tools.",
      stats: "Higher settlement acceptance"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <Badge variant="outline" className="w-fit">
                <Gavel className="h-4 w-4 mr-2" />
                Litigation Practice Management
              </Badge>
              <h1 className="text-5xl font-bold leading-tight">
                Your Digital Command Center for{' '}
                <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Litigation Success
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Manage cases, collaborate securely with clients, and give them the financial and planning tools they need after settlement.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-lg px-8"
                onClick={() => navigate('/litigation-attorney/onboarding')}
              >
                <Gavel className="mr-2 h-5 w-5" />
                Launch My Litigation Portal
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8"
                onClick={() => navigate('/litigation-attorney/client-info')}
              >
                Learn How We Protect Your Future
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Quick Setup</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Bank-Level Security</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Court Compliant</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <Card className="border-l-4 border-l-primary">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Attorney Portal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-2 bg-primary/20 rounded"></div>
                    <div className="h-2 bg-primary/40 rounded w-3/4"></div>
                    <div className="h-2 bg-primary rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-secondary">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Client Portal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-2 bg-secondary/40 rounded w-5/6"></div>
                    <div className="h-2 bg-secondary/60 rounded"></div>
                    <div className="h-2 bg-secondary rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Value Callouts */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-r from-muted/50 to-muted/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">Complete Litigation Management Platform</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to manage cases efficiently and help clients plan their financial future
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 bg-background/80 backdrop-blur">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">Transform Your Practice</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join leading litigation firms using our platform to improve efficiency and client outcomes
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 + index * 0.1 }}
            >
              <Card className="text-center h-full border-0 bg-gradient-to-br from-background to-muted/20">
                <CardHeader>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  <CardDescription className="text-base">{benefit.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-2">{benefit.stats}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center space-y-8"
        >
          <h2 className="text-3xl font-bold">Ready to Modernize Your Practice?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join hundreds of litigation attorneys who have transformed their practice with our digital platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-lg px-8"
              onClick={() => navigate('/litigation-attorney/onboarding')}
            >
              Start Your Free Trial
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8"
            >
              Schedule Demo
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}