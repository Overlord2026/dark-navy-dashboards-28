import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, Calendar, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FormData {
  name: string;
  email: string;
  phone: string;
  interest: string;
  budgetLabel: string;
  source?: string;
}

const interestLabels: Record<string, string> = {
  retirement: 'Retirement Planning',
  tax: 'Tax Optimization',
  estate: 'Estate Planning',
  investment: 'Investment Management',
  other: 'Other Financial Services',
};

export function LeadConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state?.formData as FormData;

  useEffect(() => {
    // Trigger confetti celebration
    const timer = setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00D2FF', '#FFC700', '#172042'],
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!formData) {
    navigate('/leads/new');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#172042] via-[#202D5A] to-[#172042] p-4">
      <div className="max-w-md mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8 pt-8">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-[#34C759] to-[#00D2FF] rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-[#FFC700] animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Thank You, {formData.name.split(' ')[0]}!
          </h1>
          <p className="text-white/70 text-lg">
            Your information has been received
          </p>
        </div>

        {/* Confirmation Card */}
        <Card className="bg-card border-border shadow-2xl mb-6">
          <div className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-6 text-center">
              Submission Summary
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-border/30">
                <span className="text-muted-foreground">Name</span>
                <span className="font-medium text-foreground">{formData.name}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-border/30">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium text-foreground">{formData.email}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-border/30">
                <span className="text-muted-foreground">Phone</span>
                <span className="font-medium text-foreground">{formData.phone}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-border/30">
                <span className="text-muted-foreground">Interest</span>
                <span className="font-medium text-foreground">
                  {interestLabels[formData.interest] || formData.interest}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-3">
                <span className="text-muted-foreground">Budget Range</span>
                <span className="font-medium text-[#FFC700]">{formData.budgetLabel}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Next Steps */}
        <Card className="bg-card border-border shadow-2xl mb-6">
          <div className="p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">What Happens Next?</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-[#00D2FF] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-[#172042] font-bold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Advisor Matching</h4>
                  <p className="text-sm text-muted-foreground">
                    We'll match you with qualified advisors in your area within 24 hours.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-[#FFC700] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-[#172042] font-bold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Initial Contact</h4>
                  <p className="text-sm text-muted-foreground">
                    An advisor will reach out to schedule a complimentary consultation.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-[#34C759] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Free Consultation</h4>
                  <p className="text-sm text-muted-foreground">
                    Discuss your goals and explore how we can help achieve them.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button
            onClick={() => navigate('/advisors')}
            className="w-full h-12 bg-gradient-to-r from-[#00D2FF] to-[#FFC700] hover:from-[#00D2FF]/90 hover:to-[#FFC700]/90 text-[#172042] font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Calendar className="mr-2 h-5 w-5" />
            Schedule Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <Button
            variant="outline"
            onClick={() => navigate('/support')}
            className="w-full h-12 border-[#00D2FF] text-[#00D2FF] hover:bg-[#00D2FF]/10 font-medium"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Contact Support
          </Button>
          
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="w-full h-12 text-white hover:bg-white/10 font-medium"
          >
            Return to Home
          </Button>
        </div>

        {/* Footer Message */}
        <div className="text-center mt-8 pb-8">
          <p className="text-sm text-white/70">
            Reference ID: {Math.random().toString(36).substring(2, 8).toUpperCase()}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Keep this for your records. We've also sent a confirmation email.
          </p>
        </div>
      </div>
    </div>
  );
}