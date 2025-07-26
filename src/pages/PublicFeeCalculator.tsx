import React from 'react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/Logo';
import { PublicValueCalculator } from '@/components/PublicValueCalculator';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star } from 'lucide-react';
import { useEventTracking } from '@/hooks/useEventTracking';

export default function PublicFeeCalculator() {
  const navigate = useNavigate();
  const { trackCalculatorUsed, trackFeatureUsed } = useEventTracking();

  React.useEffect(() => {
    trackCalculatorUsed('fee_impact_calculator', { source: 'public_page' });
  }, [trackCalculatorUsed]);

  const handleScheduleReview = () => {
    trackFeatureUsed('schedule_consultation', { source: 'fee_calculator' });
    window.open('https://calendly.com/tonygomes/talk-with-tony', '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo variant="tree" onClick={() => navigate('/')} />
          <Button variant="outline" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </header>

      {/* Calculator */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="flex items-center text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
              <span className="ml-2 text-foreground text-sm">4.8/5</span>
            </div>
            <span className="text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">CFP® Fiduciary</span>
          </div>
          
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Fee Impact Calculator
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-4">
            See exactly what you're paying in advisory fees and how much you could save with our transparent, fee-only approach. No commissions. No hidden costs.
          </p>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Advertising-free environment—your data is never sold. You control who can access your information.
          </p>
        </div>
        
        <PublicValueCalculator />
        
        {/* Additional CTAs */}
        <div className="text-center mt-12 space-y-6">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready for Your Customized Analysis?
            </h3>
            <p className="text-muted-foreground mb-6">
              Get a personalized retirement roadmap with detailed fee analysis and actionable recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-primary hover:bg-primary/90"
                onClick={handleScheduleReview}
              >
                Schedule My Complimentary Review
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/roadmap-info')}
              >
                Learn About Retirement Roadmap
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mt-8">
            <Button variant="ghost" onClick={() => navigate('/scorecard')}>
              Take Confidence Scorecard
            </Button>
            <Button variant="ghost" onClick={() => navigate('/gap-analyzer')}>
              Analyze Income Gap
            </Button>
            <Button variant="ghost" onClick={() => navigate('/')}>
              Explore All Tools
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}