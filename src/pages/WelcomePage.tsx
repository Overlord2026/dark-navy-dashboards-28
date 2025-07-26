import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/Logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Calculator, Trophy, TrendingUp, Shield, Calendar, ArrowRight, CheckCircle, Star, Award, Users } from 'lucide-react';
import { withTrademarks } from '@/utils/trademark';
import { useEventTracking } from '@/hooks/useEventTracking';

export default function WelcomePage() {
  const navigate = useNavigate();
  const { trackFeatureUsed, trackPageView } = useEventTracking();

  const handleScheduleReview = () => {
    trackFeatureUsed('schedule_consultation', { source: 'welcome_page' });
    window.open('https://calendly.com/tonygomes/talk-with-tony', '_blank');
  };

  const handleToolNavigation = (tool: string, path: string) => {
    trackFeatureUsed('public_tool_access', { tool, source: 'welcome_page' });
    navigate(path);
  };

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
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
            Retire once. Stay retired.
          </h1>
          
          <div className="space-y-6">
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              {withTrademarks("Family legacy. Institutional discipline. Personal touch.")}
            </p>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {withTrademarks("Experience Boutique Family Office expertise—without the $5M+ minimums typically required.")}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-3 rounded-full border border-primary/20">
                <Shield className="h-5 w-5 text-primary" />
                <span className="font-medium text-foreground">
                  {withTrademarks("Fiduciary duty—always acting in your best interest")}
                </span>
              </div>
              <div className="inline-flex items-center gap-2 bg-green-500/10 px-6 py-3 rounded-full border border-green-500/20">
                <Award className="h-5 w-5 text-green-600" />
                <span className="font-medium text-foreground">
                  CFP® professionals with 20+ years experience
                </span>
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
              <Card className="bg-background/60">
                <CardContent className="p-6 text-center">
                  <Star className="h-8 w-8 mx-auto text-yellow-500 mb-3" />
                  <p className="text-sm text-muted-foreground italic mb-3">
                    "Finally, fiduciary advice without the astronomical minimums. Their roadmap saved us six figures in unnecessary fees."
                  </p>
                  <p className="font-medium text-sm">— Sarah M., Executive</p>
                </CardContent>
              </Card>
              
              <Card className="bg-background/60">
                <CardContent className="p-6 text-center">
                  <Star className="h-8 w-8 mx-auto text-yellow-500 mb-3" />
                  <p className="text-sm text-muted-foreground italic mb-3">
                    "The Social Security optimization alone will add $180,000 to our retirement. Best investment we've made."
                  </p>
                  <p className="font-medium text-sm">— Robert & Linda K., Pre-Retirees</p>
                </CardContent>
              </Card>
              
              <Card className="bg-background/60">
                <CardContent className="p-6 text-center">
                  <Star className="h-8 w-8 mx-auto text-yellow-500 mb-3" />
                  <p className="text-sm text-muted-foreground italic mb-3">
                    "Transparent, comprehensive, and no ongoing fees. This is how retirement planning should be done."
                  </p>
                  <p className="font-medium text-sm">— Michael T., Business Owner</p>
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