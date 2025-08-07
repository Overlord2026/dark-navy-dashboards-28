import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Calendar, Users, MessageCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface WelcomeCallStepProps {
  data: any;
  onComplete: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
}

export const WelcomeCallStep: React.FC<WelcomeCallStepProps> = ({
  data,
  onComplete,
  onNext,
  onPrevious,
  currentStep,
  totalSteps
}) => {
  const [selectedOption, setSelectedOption] = useState<'book-call' | 'explore-alone' | null>(null);

  const handleSelection = (option: 'book-call' | 'explore-alone') => {
    setSelectedOption(option);
    
    if (option === 'book-call') {
      // TODO: Integrate with calendar booking system (Calendly, Cal.com, etc.)
      window.open('https://calendly.com/your-company/welcome-call', '_blank');
    }
    
    onComplete({
      welcomeCall: {
        choice: option,
        scheduledAt: option === 'book-call' ? new Date().toISOString() : null,
        timestamp: new Date().toISOString()
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Progress Indicator */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <span>Step {currentStep} of {totalSteps}</span>
        <div className="flex-1 bg-muted h-1 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <Calendar className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Ready to Take the Next Step?</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Book a brief welcome call with our team, or feel free to explore on your own first.
        </p>
      </div>

      {/* Options */}
      <div className="grid gap-4">
        {/* Book Welcome Call */}
        <Card 
          className={`cursor-pointer transition-all hover:border-primary/40 ${
            selectedOption === 'book-call' ? 'border-primary bg-primary/5' : ''
          }`}
          onClick={() => handleSelection('book-call')}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-7 h-7 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground text-lg">Book a Welcome Call</h3>
                <p className="text-muted-foreground mb-2">15-minute intro with a real person (not a sales call)</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Quick platform walkthrough</li>
                  <li>• Answer any questions you have</li>
                  <li>• Personalized recommendations</li>
                  <li>• No pressure to buy anything</li>
                </ul>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        {/* Explore Alone */}
        <Card 
          className={`cursor-pointer transition-all hover:border-accent/40 ${
            selectedOption === 'explore-alone' ? 'border-accent bg-accent/5' : ''
          }`}
          onClick={() => handleSelection('explore-alone')}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-7 h-7 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground text-lg">Explore on Your Own</h3>
                <p className="text-muted-foreground mb-2">Dive into your dashboard and take your time</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Full access to all features</li>
                  <li>• Built-in help guides and tooltips</li>
                  <li>• Schedule a call anytime later</li>
                  <li>• Linda (AI assistant) is always available</li>
                </ul>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Benefits */}
      <Card className="bg-gradient-to-r from-accent/5 to-primary/5 border-accent/20">
        <CardContent className="p-4">
          <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-primary" />
            Either way, you're in good hands
          </h4>
          <p className="text-sm text-muted-foreground">
            Our team is committed to your success. Whether you prefer guidance or independence, 
            we're here when you need us—with zero sales pressure.
          </p>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        <Button
          onClick={() => selectedOption && handleSelection(selectedOption)}
          disabled={!selectedOption}
          className="flex items-center gap-2 btn-primary-gold"
        >
          {selectedOption === 'book-call' ? 'Schedule Call' : selectedOption === 'explore-alone' ? 'Continue' : 'Continue'}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};