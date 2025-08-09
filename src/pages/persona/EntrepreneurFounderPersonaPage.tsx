import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Lightbulb, Target, TrendingUp, BarChart3, FileText, Calculator, Brain, Lock, CheckCircle, Star, Rocket, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const EntrepreneurFounderPersonaPage = () => {
  useEffect(() => {
    document.title = "Founder Wealth Platform | Family Office Marketplace";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Wealth tracking, exit planning, and legacy tools for entrepreneurs.');
    } else {
      const newMeta = document.createElement('meta');
      newMeta.name = 'description';
      newMeta.content = 'Wealth tracking, exit planning, and legacy tools for entrepreneurs.';
      document.head.appendChild(newMeta);
    }
  }, []);

  const handleSignup = () => {
    window.location.href = '/signup?persona=entrepreneur-founder';
  };

  const handleDemo = () => {
    // Navigate to demo or contact page
    console.log('Demo requested');
  };

  const valueProps = [
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Wealth & Liquidity Tracking",
      description: "Monitor cash flow from multiple ventures."
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Exit Strategy Readiness", 
      description: "Plan for optimal sale or IPO outcomes."
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Personal Financial Growth",
      description: "Align investments with your vision."
    }
  ];

  const features = [
    {
      icon: <BarChart3 className="w-5 h-5" />,
      text: "Multi-entity net worth tracking"
    },
    {
      icon: <Target className="w-5 h-5" />,
      text: "SWAG™ Retirement Roadmap"
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      text: "Private equity and venture investment tracking"
    },
    {
      icon: <Calculator className="w-5 h-5" />,
      text: "Advanced tax minimization tools"
    },
    {
      icon: <FileText className="w-5 h-5" />,
      text: "Family Legacy Box™ for estate and legal documents"
    },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      text: "Goal tracking and milestone alerts"
    }
  ];

  const testimonials = [
    "I can see my business value and personal wealth side by side.",
    "The exit strategy tools are a game-changer.",
    "It helps me focus on building, not spreadsheets."
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-gold/5 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23000%22%20fill-opacity=%220.03%22%3E%3Cpath%20d=%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  Entrepreneur Portal
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Build Your Vision,{' '}
                  <span className="bg-gradient-to-r from-primary via-gold to-emerald bg-clip-text text-transparent">
                    Secure
                  </span>{' '}
                  Your Future
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  From startup to exit, manage your personal wealth and protect your legacy.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleSignup}
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-gold hover:from-primary/90 hover:to-gold/90 text-white px-8"
                >
                  Start Your Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  onClick={handleDemo}
                  variant="outline" 
                  size="lg" 
                  className="px-8"
                >
                  <Play className="mr-2 w-5 h-5" />
                  See How It Works
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-white to-muted/50 p-8 rounded-2xl shadow-2xl border">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-gold rounded-full flex items-center justify-center">
                      <Rocket className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Venture Portfolio</h3>
                      <p className="text-sm text-muted-foreground">Multi-Entity Tracking</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                      <p className="text-sm text-muted-foreground">Total Value</p>
                      <p className="text-lg font-bold text-emerald-600">$5.2M</p>
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm text-muted-foreground">Liquid Assets</p>
                      <p className="text-lg font-bold text-blue-600">$1.1M</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Value Proposition Blocks */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Why Founders Trust Our Platform</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Purpose-built tools for entrepreneurs managing complex wealth scenarios
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {valueProps.map((prop, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-8 text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary to-gold rounded-full flex items-center justify-center mx-auto text-white">
                      {prop.icon}
                    </div>
                    <h3 className="text-xl font-semibold">{prop.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{prop.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Everything You Need to Scale Smart</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive wealth management tools designed for startup founders
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-gold rounded-lg flex items-center justify-center text-white flex-shrink-0">
                  {feature.icon}
                </div>
                <span className="font-medium">{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrated Tools Callout */}
      <section className="py-24 bg-gradient-to-r from-primary/5 to-gold/5">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">AI-Powered Founder Tools</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Smart technology to help you make better financial decisions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-primary/20">
              <CardContent className="p-8 text-center space-y-4">
                <Brain className="w-12 h-12 text-primary mx-auto" />
                <h3 className="text-xl font-semibold">Linda AI Assistant</h3>
                <p className="text-muted-foreground">Research and reminders for busy founders</p>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardContent className="p-8 text-center space-y-4">
                <Lock className="w-12 h-12 text-primary mx-auto" />
                <h3 className="text-xl font-semibold">Compliance-Ready Storage</h3>
                <p className="text-muted-foreground">Secure agreements and sensitive documents</p>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardContent className="p-8 text-center space-y-4">
                <TrendingUp className="w-12 h-12 text-primary mx-auto" />
                <h3 className="text-xl font-semibold">Scenario Modeling</h3>
                <p className="text-muted-foreground">Model exit proceeds and outcomes</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Slider */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">What Founders Are Saying</h2>
            <p className="text-xl text-muted-foreground">
              Real feedback from entrepreneurs who've built successful exits
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-8 space-y-4">
                    <div className="flex text-gold">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-current" />
                      ))}
                    </div>
                    <p className="text-lg italic">"{testimonial}"</p>
                    <div className="text-sm text-muted-foreground">
                      — Startup Founder
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-8"
          >
            <h2 className="text-4xl font-bold">Pricing That Scales With You</h2>
            <p className="text-2xl text-muted-foreground">
              Plans starting at <span className="font-bold text-primary">$19/month</span> — scale with your success.
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-gold hover:from-primary/90 hover:to-gold/90 text-white px-8"
            >
              View Plans & Features
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 bg-gradient-to-br from-primary via-primary/90 to-gold text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-8"
          >
            <h2 className="text-5xl font-bold">Control Your Personal and Business Future</h2>
            <p className="text-2xl opacity-90 max-w-3xl mx-auto">
              A single platform for founders to manage wealth.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleSignup}
                size="lg" 
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90 px-8"
              >
                Start Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                onClick={handleDemo}
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8"
              >
                Book a Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default EntrepreneurFounderPersonaPage;