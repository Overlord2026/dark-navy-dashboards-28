import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/Logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, Trophy, TrendingUp, Shield, Calendar, ArrowRight, CheckCircle, Star, Award, Users,
  FileText, Heart, Sparkles, TreePine
} from 'lucide-react';
import { withTrademarks } from '@/utils/trademark';
import { useEventTracking } from '@/hooks/useEventTracking';
import { InAppNotificationBanner } from '@/components/ui/InAppNotificationBanner';
import { analytics } from '@/lib/analytics';

const PersonaCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  featured?: boolean;
  delay?: number;
}> = ({ title, description, icon, route, featured = false, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <Link to={route} onClick={() => analytics.track('persona_card_clicked', { persona: title })}>
      <Card className={`h-full hover:shadow-lg transition-all duration-300 group ${featured ? 'ring-2 ring-primary' : ''}`}>
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
            {icon}
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
          {featured && <Badge variant="default" className="mx-auto">Popular</Badge>}
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center">{description}</p>
        </CardContent>
      </Card>
    </Link>
  </motion.div>
);

const AnimatedTree: React.FC = () => (
  <motion.div
    initial={{ scale: 0, rotate: -10 }}
    animate={{ scale: 1, rotate: 0 }}
    transition={{ duration: 1, ease: "easeOut" }}
    className="relative"
  >
    <div className="w-32 h-32 mx-auto mb-6 relative">
      <motion.div
        animate={{ 
          background: [
            'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            'linear-gradient(135deg, #FFA500 0%, #FFD700 100%)',
            'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
          ]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="w-full h-full rounded-full flex items-center justify-center shadow-lg"
      >
        <TreePine className="h-16 w-16 text-white" />
      </motion.div>
      
      {/* Floating sparkles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: `${20 + (i * 10)}%`,
            left: `${15 + (i * 12)}%`,
          }}
          animate={{
            y: [-10, 10, -10],
            opacity: [0.3, 1, 0.3],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 2 + (i * 0.3),
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Sparkles className="h-3 w-3 text-yellow-400" />
        </motion.div>
      ))}
    </div>
  </motion.div>
);

export default function WelcomePage() {
  const navigate = useNavigate();
  const { trackFeatureUsed, trackPageView } = useEventTracking();
  const [showAllPersonas, setShowAllPersonas] = useState(false);

  useEffect(() => {
    analytics.trackPageView('/welcome');
  }, []);

  const handleScheduleReview = () => {
    trackFeatureUsed('schedule_consultation', { source: 'welcome_page' });
    window.open('https://calendly.com/tonygomes/talk-with-tony', '_blank');
  };

  const handleToolNavigation = (tool: string, path: string) => {
    trackFeatureUsed('public_tool_access', { tool, source: 'welcome_page' });
    navigate(path);
  };

  const handleCalculatorClick = () => {
    analytics.track('hero_cta_clicked', { cta_type: 'calculator' });
  };

  const handleMeetTeamClick = () => {
    analytics.track('hero_cta_clicked', { cta_type: 'meet_team' });
    document.getElementById('persona-cards')?.scrollIntoView({ behavior: 'smooth' });
  };

  const primaryPersonas = [
    {
      title: 'Client Family',
      description: 'Comprehensive wealth management for families',
      icon: <Users className="h-6 w-6 text-primary" />,
      route: '/onboarding/client-family',
      featured: true
    },
    {
      title: 'Financial Advisor',
      description: 'Tools and resources for financial advisors',
      icon: <TrendingUp className="h-6 w-6 text-primary" />,
      route: '/onboarding/advisor'
    },
    {
      title: 'Accountant',
      description: 'Tax and accounting services integration',
      icon: <FileText className="h-6 w-6 text-primary" />,
      route: '/onboarding/accountant'
    },
    {
      title: 'Attorney',
      description: 'Legal planning and estate services',
      icon: <Shield className="h-6 w-6 text-primary" />,
      route: '/onboarding/attorney'
    },
    {
      title: 'Healthcare',
      description: 'Longevity and healthcare guidance',
      icon: <Heart className="h-6 w-6 text-primary" />,
      route: '/onboarding/healthcare'
    },
    {
      title: 'Insurance',
      description: 'Insurance and risk management',
      icon: <Shield className="h-6 w-6 text-primary" />,
      route: '/onboarding/insurance'
    }
  ];

  const additionalPersonas = [
    {
      title: 'Medicare Specialist',
      description: 'Medicare guidance and optimization',
      icon: <Heart className="h-6 w-6 text-primary" />,
      route: '/onboarding/medicare'
    },
    {
      title: 'Coach/Consultant',
      description: 'Business coaching and consulting',
      icon: <TrendingUp className="h-6 w-6 text-primary" />,
      route: '/onboarding/coach'
    },
    {
      title: 'Sports Agent',
      description: 'Athlete wealth management',
      icon: <TrendingUp className="h-6 w-6 text-primary" />,
      route: '/onboarding/sports-agent'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo variant="tree" />
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate('/auth')}
              size="sm"
            >
              Sign In
            </Button>
            <Button 
              onClick={() => navigate('/auth')}
              size="sm"
              className="bg-primary hover:bg-primary/90"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="container mx-auto px-4 text-center">
          <AnimatedTree />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="space-y-6"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              Your Family Office.{' '}
              <span className="bg-gradient-to-r from-primary to-yellow-500 bg-clip-text text-transparent">
                Your Way.
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Boutique Family Office™ — one secure platform for your money, your health, 
              and your team of vetted professionals.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                onClick={handleMeetTeamClick}
                className="text-lg px-8 py-6"
              >
                Meet Your Team
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Link to="/value-calculator">
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={handleCalculatorClick}
                  className="text-lg px-8 py-6"
                >
                  <Calculator className="mr-2 h-5 w-5" />
                  Try the SWAG™ Value Calculator
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Persona Cards Section */}
      <section id="persona-cards" className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Choose Your Path</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every family office needs the right team. Find your perfect match.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {primaryPersonas.map((persona, index) => (
              <PersonaCard
                key={persona.title}
                {...persona}
                delay={index * 0.1}
              />
            ))}
          </div>

          <AnimatePresence>
            {showAllPersonas && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
              >
                {additionalPersonas.map((persona, index) => (
                  <PersonaCard
                    key={persona.title}
                    {...persona}
                    delay={index * 0.1}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => {
                setShowAllPersonas(!showAllPersonas);
                analytics.track('show_more_personas_clicked', { expanded: !showAllPersonas });
              }}
            >
              {showAllPersonas ? 'Show Less' : 'See All Solutions'}
              <ArrowRight className={`ml-2 h-4 w-4 transition-transform ${showAllPersonas ? 'rotate-90' : ''}`} />
            </Button>
          </div>
        </div>
      </section>

      {/* Legacy Content (collapsed for brevity) */}
      <section className="bg-muted/30 py-12" style={{ display: 'none' }}>
        {/* Keep existing content but hidden for now */}
        <div className="max-w-4xl mx-auto space-y-8">
          
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
              <div className="flex items-center text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
                <span className="ml-2 text-foreground font-semibold">4.8/5 rating</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">CFP® Fiduciary</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-success/10 px-4 py-2 rounded-full border border-success/20">
                <Award className="h-4 w-4 text-success" />
                <span className="text-sm font-medium text-foreground">20+ Years Experience</span>
              </div>
            </div>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              {withTrademarks("Family legacy. Institutional discipline. Personal touch.")}
            </p>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {withTrademarks("Experience Boutique Family Office expertise—without the $5M+ minimums typically required.")}
            </p>
            
            <div className="flex flex-col gap-4 items-center justify-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-3 rounded-full border border-primary/20">
                <Shield className="h-5 w-5 text-primary" />
                <span className="font-medium text-foreground">
                  {withTrademarks("Fiduciary duty—always acting in your best interest")}
                </span>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground font-medium">
                  Advertising-free environment—your data is never sold. You are always in control of who can view or access your Family Office Hub and personal information.
                </p>
              </div>
            </div>
          </div>

          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Start with our complimentary tools and expertise—then get your{' '}
            <strong>Customized Retirement Roadmap</strong> for a transparent, one-time fee. No commissions. No hidden costs. No ongoing obligations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-8">
            <Card className="border-primary/20 hover:shadow-lg transition-shadow cursor-pointer" 
                  onClick={() => handleToolNavigation('retirement_confidence_scorecard', '/scorecard')}>
              <CardHeader className="text-center pb-2">
                <Trophy className="h-8 w-8 mx-auto text-primary mb-2" />
                <CardTitle className="text-lg">
                  {withTrademarks("Retirement Confidence Scorecard")}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>
                  Take our 10-question assessment and discover your retirement readiness
                </CardDescription>
                <Button variant="ghost" className="mt-4 w-full">
                  Start Assessment <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="border-primary/20 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleToolNavigation('fee_impact_calculator', '/calculator')}>
              <CardHeader className="text-center pb-2">
                <Calculator className="h-8 w-8 mx-auto text-primary mb-2" />
                <CardTitle className="text-lg">Fee Impact Calculator</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>
                  See exactly what you're paying and how much you could save with our fee-only approach
                </CardDescription>
                <Button variant="ghost" className="mt-4 w-full">
                  Try Calculator <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="border-primary/20 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleToolNavigation('income_gap_analyzer', '/gap-analyzer')}>
              <CardHeader className="text-center pb-2">
                <TrendingUp className="h-8 w-8 mx-auto text-primary mb-2" />
                <CardTitle className="text-lg">Income Gap Analyzer</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>
                  Discover if your retirement income will cover your lifestyle goals
                </CardDescription>
                <Button variant="ghost" className="mt-4 w-full">
                  Analyze Gap <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="border-primary/20 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleToolNavigation('retirement_roadmap_info', '/roadmap-info')}>
              <CardHeader className="text-center pb-2">
                <Calendar className="h-8 w-8 mx-auto text-primary mb-2" />
                <CardTitle className="text-lg">Retirement Roadmap</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>
                  Get your personalized roadmap with actionable next steps
                </CardDescription>
                <Button variant="ghost" className="mt-4 w-full">
                  Learn More <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6"
              onClick={handleScheduleReview}
            >
              Book My Complimentary Family Office Review
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-6"
              onClick={() => handleToolNavigation('retirement_confidence_scorecard', '/scorecard')}
            >
              {withTrademarks("Take Your Retirement Confidence Scorecard")}
            </Button>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
              Trusted by Discerning Families Nationwide
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="bg-background/60 border-l-4 border-l-primary">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-muted rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">SM</span>
                  </div>
                  <div className="flex justify-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground italic mb-3">
                    "We saved $128,000 in unnecessary fees with their transparent approach. Finally, fiduciary advice without astronomical minimums."
                  </p>
                  <p className="font-medium text-sm">— Sarah M., Executive</p>
                  <p className="text-xs text-muted-foreground">Family Office Client, 2024</p>
                </CardContent>
              </Card>
              
              <Card className="bg-background/60 border-l-4 border-l-success">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-muted rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-success">RK</span>
                  </div>
                  <div className="flex justify-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground italic mb-3">
                    "The Social Security optimization strategy added $180,000 to our retirement income. Best investment we've made."
                  </p>
                  <p className="font-medium text-sm">— Robert & Linda K., Pre-Retirees</p>
                  <p className="text-xs text-muted-foreground">Roadmap Client, 2024</p>
                </CardContent>
              </Card>
              
              <Card className="bg-background/60 border-l-4 border-l-accent">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-muted rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-accent">MT</span>
                  </div>
                  <div className="flex justify-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground italic mb-3">
                    "Cut our advisory fees by 60% while getting better service. This advertising-free approach is refreshing."
                  </p>
                  <p className="font-medium text-sm">— Michael T., Business Owner</p>
                  <p className="text-xs text-muted-foreground">Family Office Client, 2024</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="bg-card/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              DIY? Use our app free. Want expert guidance?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Get your <strong>Customized Retirement Roadmap</strong>—transparent, one-time fee with no ongoing obligations or hidden costs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Free DIY Tools</CardTitle>
                <CardDescription>Use our calculators and education center at no cost</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  'Fee-only impact calculator',
                  'Retirement confidence scorecard',
                  'Income gap analyzer',
                  'Educational resources',
                  'Basic planning templates'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-4" onClick={() => handleToolNavigation('free_tools_signup', '/auth')}>
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-xl">Customized Retirement Roadmap</CardTitle>
                <CardDescription>Fiduciary-guided, personalized strategy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  'Tax-efficient withdrawal strategy',
                  'Social Security optimization timing',
                  'Healthcare & long-term care planning',
                  'Estate & legacy considerations',
                  '90-day implementation plan',
                  'CFP® professional guidance'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
                <Button className="w-full mt-4" onClick={handleScheduleReview}>
                  Schedule Consultation
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Sticky Calculator CTA */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link to="/value-calculator">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 2, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              size="lg" 
              className="rounded-full shadow-lg hover:shadow-xl transition-shadow"
              onClick={handleCalculatorClick}
            >
              <Calculator className="mr-2 h-5 w-5" />
              Try SWAG™ Calculator
            </Button>
          </motion.div>
        </Link>
      </div>

      {/* Footer */}
      <footer className="border-t bg-card/30 py-8">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>© 2024 BFO. Actual pricing and services vary by client. Calculators for illustration only.</p>
          <p className="mt-2">
            For a custom proposal, please{' '}
            <button 
              onClick={handleScheduleReview}
              className="text-primary hover:underline"
            >
              schedule a review
            </button>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}