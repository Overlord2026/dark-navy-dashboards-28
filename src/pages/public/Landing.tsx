import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/ui/Logo';
import { withTrademarks } from '@/utils/trademark';
import { 
  Users, 
  TrendingUp, 
  Shield, 
  Vault, 
  PieChart, 
  DollarSign,
  Calculator,
  ArrowRight,
  Star,
  Heart,
  Activity,
  Briefcase,
  Building,
  MapPin
} from 'lucide-react';
import { motion } from 'framer-motion';
import { analyticsEvents } from '@/analytics/events';

const platformCards = [
  {
    id: 'client',
    title: 'Client & Family Portal',
    description: 'Comprehensive wealth management and family coordination',
    icon: Users,
    color: 'from-blue-500 to-cyan-500',
    route: '/demo?view=client',
    features: ['Family Legacy Vault', 'Goal Tracking', 'Health + Wealth Dashboard']
  },
  {
    id: 'retirement',
    title: 'Retirement Roadmap (SWAG GPS™)',
    description: 'Science-driven retirement income planning with stress testing',
    icon: TrendingUp,
    color: 'from-green-500 to-emerald-500',
    route: '/demo?view=retirement',
    features: ['Monte Carlo Analysis', 'Scenario Modeling', 'Tax Optimization']
  },
  {
    id: 'vault',
    title: 'Secure Family Vault',
    description: 'Bank-grade document storage and estate organization',
    icon: Vault,
    color: 'from-purple-500 to-violet-500',
    route: '/demo?view=vault',
    features: ['Document Management', 'Beneficiary Access', 'Annual Reviews']
  },
  {
    id: 'entities',
    title: 'Properties & Entities',
    description: 'Real estate and business entity management',
    icon: Building,
    color: 'from-amber-500 to-orange-500',
    route: '/demo?view=entities',
    features: ['Entity Tracking', 'Property Portfolio', 'Compliance Calendar']
  },
  {
    id: 'health',
    title: 'Proactive Healthcare',
    description: 'Longevity planning and healthcare optimization',
    icon: Heart,
    color: 'from-red-500 to-pink-500',
    route: '/demo?view=health',
    features: ['Health Savings', 'Longevity Planning', 'Care Coordination']
  },
  {
    id: 'marketplace',
    title: 'Marketplace (Advisors/CPA/Attorney/Insurance/Medicare)',
    description: 'Vetted professional network and coordination',
    icon: Star,
    color: 'from-indigo-500 to-purple-500',
    route: '/demo?view=marketplace',
    features: ['Professional Matching', 'Team Coordination', 'Integrated Services']
  }
];

export default function Landing() {
  React.useEffect(() => {
    analyticsEvents.trackPageView({
      page_name: 'public_landing',
      page_path: '/',
    });
  }, []);

  const handleCTAClick = (ctaType: string, destination: string) => {
    analyticsEvents.trackNavigationClick(`landing_${ctaType}`, destination, 'hero');
  };

  const handlePlatformCardClick = (cardId: string, route: string) => {
    analyticsEvents.trackFeatureUsage('platform_card_click', {
      card_id: cardId,
      destination: route,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Navigation */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo variant="tree" />
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/calculator" className="text-sm font-medium hover:text-primary transition-colors">
              Calculator
            </Link>
            <Link to="/demo" className="text-sm font-medium hover:text-primary transition-colors">
              Platform Demo
            </Link>
            <Link to="/auth/signup" className="text-sm font-medium hover:text-primary transition-colors">
              Sign Up
            </Link>
          </nav>
          <div className="flex items-center space-x-3">
            <Link to="/auth/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/calculator">
              <Button size="sm">
                Try Calculator
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <motion.div 
            className="text-center max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Healthspan + Wealthspan,
              </span>
              <br />
              <span className="text-foreground">Managed Together.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-4xl mx-auto">
              {withTrademarks("Boutique Family Office™")} — one secure platform for your money, your health, and your team of vetted professionals.
            </p>

            <div className="space-y-6 mb-12">
              <div className="flex flex-wrap justify-center gap-2 text-lg">
                <Badge variant="outline" className="px-4 py-2">
                  • {withTrademarks("SWAG GPS™ Retirement Roadmap")}: stress‑test income now, income later, growth, and legacy.
                </Badge>
              </div>
              <div className="flex flex-wrap justify-center gap-2 text-lg">
                <Badge variant="outline" className="px-4 py-2">
                  • Fiduciary marketplace: advisors, CPAs, attorneys, healthcare & insurance — verified and coordinated.
                </Badge>
              </div>
              <div className="flex flex-wrap justify-center gap-2 text-lg">
                <Badge variant="outline" className="px-4 py-2">
                  • Value‑driven pricing: pick flat fee, AUM, or a hybrid. More service, more clarity, less waste.
                </Badge>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/calculator" onClick={() => handleCTAClick('primary', '/calculator')}>
                <Button size="lg" className="text-lg px-8 py-4">
                  Run Your Savings & Longevity Check
                  <Calculator className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-4"
                onClick={() => {
                  handleCTAClick('secondary', '#platform-cards');
                  document.getElementById('platform-cards')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Explore the Platform
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Platform Cards Section */}
      <section id="platform-cards" className="py-24 bg-card/30">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Your Complete Family Office Platform
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Six integrated modules working together to optimize your wealth, health, and legacy across generations.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {platformCards.map((card, index) => {
              const IconComponent = card.icon;
              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link 
                    to={card.route}
                    onClick={() => handlePlatformCardClick(card.id, card.route)}
                    className="group block"
                  >
                    <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                      <CardHeader>
                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${card.color} flex items-center justify-center mb-4 shadow-lg`}>
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                          {card.title}
                        </CardTitle>
                        <p className="text-muted-foreground">
                          {card.description}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 mb-4">
                          {card.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                              {feature}
                            </div>
                          ))}
                        </div>
                        <Button variant="ghost" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          Try Demo
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link to="/demo?view=all">
              <Button variant="outline" size="lg">
                See all solutions
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust & Credibility Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {withTrademarks("Why Families Trust the Boutique Family Office™")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Professional-grade tools and fiduciary guidance, designed for families who want more than investment management.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center shadow-lg">
              <CardContent className="p-8">
                <Shield className="h-16 w-16 text-emerald-500 mx-auto mb-6" />
                <h3 className="text-xl font-bold mb-4">100% Fiduciary</h3>
                <p className="text-muted-foreground">
                  No proprietary products, no commissions, no asset custody. Your interests always come first.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-lg">
              <CardContent className="p-8">
                <DollarSign className="h-16 w-16 text-gold mx-auto mb-6" />
                <h3 className="text-xl font-bold mb-4">Transparent Fees</h3>
                <p className="text-muted-foreground">
                  Choose flat fee, AUM, or hybrid pricing. Always disclosed, never hidden, tailored to your needs.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-lg">
              <CardContent className="p-8">
                <Star className="h-16 w-16 text-primary mx-auto mb-6" />
                <h3 className="text-xl font-bold mb-4">Comprehensive Service</h3>
                <p className="text-muted-foreground">
                  Health + wealth coordination across every aspect of your family's financial life.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-500/10">
        <div className="container mx-auto px-4 text-center">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to See What You're Really Paying?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start with our free calculator to discover your potential savings, then explore how a true family office approach can transform your financial future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/calculator" onClick={() => handleCTAClick('final_primary', '/calculator')}>
                <Button size="lg" className="text-lg px-8 py-4">
                  Calculate My Fee Savings
                  <Calculator className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/demo" onClick={() => handleCTAClick('final_secondary', '/demo')}>
                <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                  Explore Platform Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}