import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TreePine,
  Heart,
  Shield,
  Crown,
  Calculator,
  TrendingUp,
  Users,
  FileText,
  CheckCircle2,
  ArrowRight,
  DollarSign,
  Clock,
  Award,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export function MarketplaceLandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-emerald/3 to-background animate-pulse" />
        
        {/* Golden Tree Brand Mark */}
        <div className="absolute left-10 top-1/2 transform -translate-y-1/2 hidden lg:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.3, scale: 1 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            className="relative"
          >
            <TreePine className="w-32 h-32 text-gold" />
            {/* Glowing roots (health) */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-emerald/30 rounded-full blur-md" />
            {/* Glowing trunk (wealth) */}
            <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-6 h-16 bg-gold/40 rounded-full blur-sm" />
            {/* Glowing branches (legacy) */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-20 h-6 bg-slate-300/30 rounded-full blur-md" />
          </motion.div>
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  Your Boutique Family Office™
                </h1>
                <h2 className="text-3xl md:text-4xl font-bold text-gradient bg-gradient-to-r from-emerald-600 to-gold bg-clip-text text-transparent">
                  Live Longer. Prosper Longer.
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                  One secure command center to manage your wealth, protect your health, and preserve your legacy — with a trusted team of experts at your side.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  onClick={() => navigate('/onboarding')}
                  className="bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 text-white px-8 py-4 text-lg"
                >
                  Get Started – Families
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/marketplace')}
                  className="border-2 border-gold hover:bg-gold/10 px-8 py-4 text-lg"
                >
                  Get Started – Professionals
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>

            {/* Right Content - Longevity Calculator Preview */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="bg-gradient-to-br from-emerald-50 to-gold-50 border-2 border-emerald-200 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader className="text-center">
                  <Badge className="mx-auto mb-2 bg-emerald-100 text-emerald-800">
                    <Clock className="w-4 h-4 mr-1" />
                    Longevity Calculator
                  </Badge>
                  <CardTitle className="text-2xl">How Long Could Your Money Last?</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="text-4xl font-bold text-emerald-600">100 Years</div>
                  <p className="text-muted-foreground">
                    If you lived to 100, would your wealth support your lifestyle?
                  </p>
                  <Button 
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => navigate('/longevity-scorecard')}
                  >
                    See How Long Your Money Could Last
                    <Calculator className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Three Core Value Pillars */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Three Pillars of Elite Family Office Life
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything the ultra-wealthy have, now accessible to every family
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-gold/30">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-gold to-yellow-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <DollarSign className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">
                    A Complete Wealth & Life Strategy for the Same Fee You Already Pay
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Whether percentage-based, flat, or a combination, your fee covers far more than just investments. Your Retirement Roadmap™, Social Security optimization, proactive tax planning, estate planning, insurance strategy, healthcare & long-term care guidance — all in one integrated plan.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-emerald-300">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">
                    Health & Longevity Optimization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Access world-leading preventative care, epigenetics testing, and cutting-edge therapies. Use our Longevity Blueprint™ to align your healthspan with your wealthspan.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-slate-300">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-500 to-slate-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">
                    Legacy & Family Collaboration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Store and share vital documents, values, and instructions securely. Coordinate all your professionals in one family command center.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Two-Path Onboarding */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Choose Your Path
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Whether you're building your family's wealth or serving elite families, we have the right solution for you.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-gradient-to-br from-emerald-50 to-gold-50 border-2 border-emerald-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl mb-4">Families & Individuals</CardTitle>
                  <p className="text-lg text-muted-foreground">
                    Discover your health and wealth blueprint. Build your personal family office.
                  </p>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span className="text-sm">Complete wealth management</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span className="text-sm">Longevity & health optimization</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span className="text-sm">Legacy preservation tools</span>
                    </div>
                  </div>
                  <Button 
                    size="lg"
                    onClick={() => navigate('/onboarding')}
                    className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white"
                  >
                    Get Started – Families
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-gradient-to-br from-gold-50 to-yellow-50 border-2 border-gold-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-gold to-yellow-400 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <Award className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl mb-4">Professionals</CardTitle>
                  <p className="text-lg text-muted-foreground">
                    Join the trusted network serving elite families. Grow your practice inside the marketplace.
                  </p>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-gold" />
                      <span className="text-sm">Elite client connections</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-gold" />
                      <span className="text-sm">Practice growth tools</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-gold" />
                      <span className="text-sm">Vetted network access</span>
                    </div>
                  </div>
                  <Button 
                    size="lg"
                    onClick={() => navigate('/marketplace')}
                    className="w-full bg-gradient-to-r from-gold to-yellow-400 hover:from-yellow-400 hover:to-gold text-white"
                  >
                    Get Started – Professionals
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Supporting Differentiators */}
      <section className="py-16 px-6 bg-muted/20">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-4 gap-8"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Flexible Fee Structures</h3>
              <p className="text-sm text-muted-foreground">Percentage, flat, or hybrid — tailored to the client</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Value Beyond Investments</h3>
              <p className="text-sm text-muted-foreground">Complete financial, health, and legacy solution</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-gold to-yellow-400 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Vetted Network</h3>
              <p className="text-sm text-muted-foreground">All professionals verified, licensed, fiduciary</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-slate-500 to-slate-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Longevity Calculator</h3>
              <p className="text-sm text-muted-foreground">See how long your savings could last — and extend it</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-emerald-900/10 to-gold/10">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold">
              Your life is your greatest investment.
            </h2>
            <p className="text-2xl text-muted-foreground">
              Let's make sure it lasts.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
              <Button 
                size="lg"
                onClick={() => navigate('/onboarding')}
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-4 text-lg"
              >
                Get Started – Families
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                size="lg"
                onClick={() => navigate('/marketplace')}
                className="bg-gradient-to-r from-gold to-yellow-400 hover:from-yellow-400 hover:to-gold text-white px-8 py-4 text-lg"
              >
                Get Started – Professionals
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}