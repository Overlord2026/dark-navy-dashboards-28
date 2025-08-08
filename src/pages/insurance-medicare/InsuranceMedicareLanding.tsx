import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Phone, TrendingUp, Users, CheckCircle, FileText, BarChart3, Calendar, Clock, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function InsuranceMedicareLanding() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Medicare Compliance Center",
      description: "CMS-compliant call recording, script templates, and regulatory updates in real-time."
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Smart Cross-Sell Engine",
      description: "Auto-flag clients with coverage gaps using integrated retirement planning analysis."
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Retirement Roadmap™ Integration",
      description: "Show clients how Medicare + supplemental coverage fits their long-term financial plan."
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Policy Portfolio Management",
      description: "Track Medicare, Life, Annuities, and LTC policies with automated renewal alerts."
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Stress-Testing Scenarios",
      description: "Model market crashes, LTC events, and early retirement impacts on client plans."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Marketing Resource Library",
      description: "Pre-built Medicare review campaigns and retirement planning email templates."
    }
  ];

  const benefits = [
    {
      title: "Meet CMS Requirements",
      description: "Stay compliant with automated call recording and approved script templates",
      icon: <Shield className="h-8 w-8 text-green-500" />
    },
    {
      title: "Increase Cross-Sells",
      description: "Retirement roadmap reveals natural upsell opportunities for annuities and life insurance",
      icon: <TrendingUp className="h-8 w-8 text-blue-500" />
    },
    {
      title: "Client Retention",
      description: "Comprehensive planning builds deeper relationships and reduces churn",
      icon: <Users className="h-8 w-8 text-purple-500" />
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
                <Shield className="h-4 w-4 mr-2" />
                Medicare & Insurance Hub
              </Badge>
              <h1 className="text-5xl font-bold leading-tight">
                Your Complete{' '}
                <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Medicare Compliance
                </span>{' '}
                & Insurance Growth Hub
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Meet CMS requirements, serve clients better, and grow your book with built-in retirement planning — all in one place.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-lg px-8"
                onClick={() => navigate('/insurance-medicare/onboarding')}
              >
                <Shield className="mr-2 h-5 w-5" />
                Start My Free Compliance & Growth Trial
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8"
                onClick={() => navigate('/insurance-medicare/retirement-demo')}
              >
                <BarChart3 className="mr-2 h-5 w-5" />
                See How Retirement Planning Drives Sales
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">CMS Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium">5-Minute Setup</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="text-sm font-medium">Agent Approved</span>
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
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Compliance Center
                  </CardTitle>
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
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Retirement Roadmap™
                  </CardTitle>
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
            <div className="mt-4 p-4 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Client SWAG Score™</div>
                <div className="text-2xl font-bold text-green-600">87</div>
                <div className="text-xs">Retirement Ready</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-r from-muted/50 to-muted/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">Everything You Need to Succeed</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Compliance tools, growth engines, and retirement planning in one integrated platform
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
          <h2 className="text-3xl font-bold mb-4">Proven Results for Agents</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join successful agents who've transformed their practice with our integrated approach
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
                  <div className="flex justify-center mb-4">
                    {benefit.icon}
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  <CardDescription className="text-base">{benefit.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center space-y-8"
        >
          <h2 className="text-3xl font-bold">Trusted by Medicare Professionals</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">500+</div>
              <div className="text-muted-foreground">Licensed Agents</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">98%</div>
              <div className="text-muted-foreground">CMS Compliance Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">40%</div>
              <div className="text-muted-foreground">Avg. Cross-Sell Increase</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="text-center space-y-8"
        >
          <h2 className="text-3xl font-bold">Ready to Transform Your Practice?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join the platform that makes Medicare compliance easy and retirement planning profitable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-lg px-8"
              onClick={() => navigate('/insurance-medicare/onboarding')}
            >
              Start Your Free Trial
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Schedule Demo
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}