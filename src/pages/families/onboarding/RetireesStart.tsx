import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, ArrowLeft, Shield, Heart, TrendingDown, Calculator, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RetireesStart() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const steps = [
    {
      title: 'Welcome to Your Retirement Journey',
      subtitle: 'Protecting and enjoying your lifetime achievements',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <Shield className="h-16 w-16 text-brand-gold mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-2">Retiree Families</h3>
            <p className="text-muted-foreground">
              You've worked hard to build your wealth. Now let's make sure it lasts and serves your family's needs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-brand-gold/30">
              <CardContent className="p-4">
                <TrendingDown className="h-8 w-8 text-brand-gold mb-2" />
                <h4 className="font-semibold text-foreground">Income Optimization</h4>
                <p className="text-sm text-muted-foreground">Maximize your retirement income streams</p>
              </CardContent>
            </Card>
            <Card className="border-brand-gold/30">
              <CardContent className="p-4">
                <Heart className="h-8 w-8 text-brand-gold mb-2" />
                <h4 className="font-semibold text-foreground">Healthcare Planning</h4>
                <p className="text-sm text-muted-foreground">Protect against healthcare costs</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      title: 'Your Retirement Priorities',
      subtitle: 'Tell us what matters most in this stage',
      content: (
        <div className="space-y-6">
          <p className="text-center text-muted-foreground">
            Select your top retirement priorities (choose 2-3):
          </p>
          
          <div className="grid gap-3">
            {[
              { icon: TrendingDown, label: 'Optimize Withdrawals', desc: 'Tax-efficient retirement income' },
              { icon: Heart, label: 'Healthcare Security', desc: 'Medicare and long-term care planning' },
              { icon: FileText, label: 'Estate Planning', desc: 'Legacy and inheritance planning' },
              { icon: Calculator, label: 'Social Security Max', desc: 'Maximize Social Security benefits' },
              { icon: Shield, label: 'Risk Management', desc: 'Protect assets from market volatility' },
            ].map((priority, index) => (
              <Card key={index} className="border-border hover:border-brand-gold/50 cursor-pointer transition-colors">
                <CardContent className="p-4 flex items-center gap-4">
                  <priority.icon className="h-8 w-8 text-brand-gold" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{priority.label}</h4>
                    <p className="text-sm text-muted-foreground">{priority.desc}</p>
                  </div>
                  <div className="w-4 h-4 border-2 border-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )
    },
    {
      title: 'Your Retirement Command Center',
      subtitle: 'Everything you need for confident retirement',
      content: (
        <div className="space-y-6 text-center">
          <div className="bg-brand-gold/10 rounded-lg p-6">
            <h3 className="text-xl font-bold text-foreground mb-4">Your Retiree Family Dashboard</h3>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Advanced Tools:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Withdrawal strategy optimizer</li>
                  <li>• Social Security calculator</li>
                  <li>• Healthcare cost projections</li>
                  <li>• Estate planning documents</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Expert Guidance:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Retirement income specialists</li>
                  <li>• Tax optimization strategies</li>
                  <li>• Estate planning attorneys</li>
                  <li>• Healthcare advocates</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-4">
            <Badge className="bg-brand-gold text-brand-black px-4 py-2">
              Lifetime Support Included
            </Badge>
            <Badge variant="outline" className="border-brand-gold text-brand-gold px-4 py-2">
              White-Glove Service
            </Badge>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Navigate to dashboard or complete onboarding
      navigate('/families/retirees/dashboard');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/families');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="ghost" 
              onClick={handleBack}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            
            <Badge variant="outline" className="border-brand-gold text-brand-gold">
              Step {currentStep + 1} of {steps.length}
            </Badge>
          </div>
          
          <Progress 
            value={(currentStep + 1) / steps.length * 100} 
            className="h-2 mb-2" 
          />
          <p className="text-sm text-muted-foreground text-center">
            {Math.round((currentStep + 1) / steps.length * 100)}% Complete
          </p>
        </div>

        {/* Main Content */}
        <Card className="border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-foreground">
              {steps[currentStep].title}
            </CardTitle>
            <p className="text-muted-foreground">
              {steps[currentStep].subtitle}
            </p>
          </CardHeader>
          
          <CardContent className="p-8">
            {steps[currentStep].content}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Button 
            variant="outline" 
            onClick={handleBack}
            className="border-brand-gold text-brand-gold hover:bg-brand-gold/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {currentStep === 0 ? 'Back to Overview' : 'Previous'}
          </Button>
          
          <Button 
            onClick={handleNext}
            className="bg-brand-gold hover:bg-brand-gold/90 text-brand-black"
          >
            {currentStep === steps.length - 1 ? 'Complete Setup' : 'Continue'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}