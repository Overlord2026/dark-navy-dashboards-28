import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/Logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Calculator, Trophy, TrendingUp, Shield, Calendar, ArrowRight, CheckCircle } from 'lucide-react';
import { withTrademarks } from '@/utils/trademark';

export default function WelcomePage() {
  const navigate = useNavigate();

  const handleScheduleReview = () => {
    window.open('https://calendly.com/tonygomes/talk-with-tony', '_blank');
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
          
          <div className="space-y-4">
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              {withTrademarks("Experience a Boutique Family Office approach—without the ultra-wealthy minimums.")}
            </p>
            
            <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-3 rounded-full border border-primary/20">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground">
                {withTrademarks("Fiduciary promise. No commissions. No conflicts.")}
              </span>
            </div>
          </div>

          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Start with our free education center and proven tools—then get your{' '}
            <strong>Customized Retirement Roadmap</strong> for a simple, one-time fee.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-8">
            <Card className="border-primary/20 hover:shadow-lg transition-shadow cursor-pointer" 
                  onClick={() => navigate('/scorecard')}>
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
                  onClick={() => navigate('/calculator')}>
              <CardHeader className="text-center pb-2">
                <Calculator className="h-8 w-8 mx-auto text-primary mb-2" />
                <CardTitle className="text-lg">Fee Impact Calculator</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>
                  See exactly what you're paying and how much you could save
                </CardDescription>
                <Button variant="ghost" className="mt-4 w-full">
                  Try Calculator <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="border-primary/20 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate('/gap-analyzer')}>
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
                  onClick={() => navigate('/roadmap-info')}>
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
              onClick={() => navigate('/scorecard')}
            >
              {withTrademarks("Take Your Retirement Confidence Scorecard")}
            </Button>
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
              Get your <strong>Customized Retirement Roadmap</strong>—one-time fee, no ongoing obligation.
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
                  'Fee comparison calculator',
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
                <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/auth')}>
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-xl">Customized Retirement Roadmap</CardTitle>
                <CardDescription>Expert-guided, personalized strategy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  'Personalized retirement income strategy',
                  'Tax-efficient withdrawal sequence',
                  'Social Security optimization',
                  'Healthcare cost planning',
                  'Legacy and estate considerations',
                  '90-day action plan'
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