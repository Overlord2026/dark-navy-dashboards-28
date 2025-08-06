import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Coffee, ArrowRight, ChevronLeft, ChevronRight, Sparkles, Clock } from 'lucide-react';
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
  const [selectedOption, setSelectedOption] = React.useState<'book' | 'skip' | null>(null);

  const handleSelection = (option: 'book' | 'skip') => {
    setSelectedOption(option);
    onComplete({
      welcomeCall: {
        requested: option === 'book',
        skipped: option === 'skip'
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
        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
          <Coffee className="w-6 h-6 text-amber-600" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Book a Welcome Call (Optional)</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Get personalized guidance from our team. No sales pitch - just friendly help navigating the platform.
        </p>
      </div>

      {/* Options */}
      <div className="grid gap-4">
        {/* Book Call Option */}
        <Card 
          className={`cursor-pointer transition-all hover:border-primary/40 ${
            selectedOption === 'book' ? 'border-primary bg-primary/5' : ''
          }`}
          onClick={() => handleSelection('book')}
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-2">Yes, let's talk!</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Schedule a friendly 15-minute call to get oriented and answer any questions.
                </p>
                <div className="flex items-center gap-1 text-xs text-primary">
                  <Clock className="w-3 h-3" />
                  <span>15 minutes • No sales pressure</span>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        {/* Skip Option */}
        <Card 
          className={`cursor-pointer transition-all hover:border-accent/40 ${
            selectedOption === 'skip' ? 'border-accent bg-accent/5' : ''
          }`}
          onClick={() => handleSelection('skip')}
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-2">I'll explore on my own</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Jump straight to your dashboard and start exploring. You can book a call anytime.
                </p>
                <div className="text-xs text-accent">
                  Perfect for self-directed users
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* What You'll Get */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <CardContent className="p-4">
          <h4 className="font-medium text-foreground mb-3">What's included in the welcome call:</h4>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
              Platform walkthrough tailored to your goals
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
              Introduction to relevant experts in our marketplace
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
              Tips for getting the most value from the platform
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
              Q&A about your specific family office needs
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Reassurance */}
      <div className="text-center p-4 bg-muted/30 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Our promise:</strong> No high-pressure sales, no hidden fees. 
          Just genuine help navigating your family office journey.
        </p>
      </div>

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
          className="flex items-center gap-2"
        >
          {selectedOption === 'book' ? 'Book Call' : 'Continue'}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};