import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, Plus, ArrowRight, ChevronLeft, ChevronRight, Zap, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

interface OptionalAccountLinkingStepProps {
  data: any;
  onComplete: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
}

export const OptionalAccountLinkingStep: React.FC<OptionalAccountLinkingStepProps> = ({
  data,
  onComplete,
  onNext,
  onPrevious,
  currentStep,
  totalSteps
}) => {
  const [selectedMethod, setSelectedMethod] = React.useState<'plaid' | 'manual' | 'skip' | null>(null);

  const handleSelection = (method: 'plaid' | 'manual' | 'skip') => {
    setSelectedMethod(method);
    onComplete({
      assetLinking: {
        method: method === 'skip' ? null : method,
        skipped: method === 'skip'
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
        <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
          <CreditCard className="w-6 h-6 text-accent" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Add Account (Optional)</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Connect your accounts for a complete financial picture, or add them later when you're ready.
        </p>
      </div>

      {/* Options */}
      <div className="grid gap-4">
        {/* Plaid Connection */}
        <Card 
          className={`cursor-pointer transition-all hover:border-primary/40 ${
            selectedMethod === 'plaid' ? 'border-primary bg-primary/5' : ''
          }`}
          onClick={() => handleSelection('plaid')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Connect via Plaid</h3>
                <p className="text-sm text-muted-foreground">Secure, instant connection to 11,000+ banks</p>
                <div className="flex items-center gap-1 mt-1">
                  <Shield className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-600">Bank-level security</span>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        {/* Manual Entry */}
        <Card 
          className={`cursor-pointer transition-all hover:border-primary/40 ${
            selectedMethod === 'manual' ? 'border-primary bg-primary/5' : ''
          }`}
          onClick={() => handleSelection('manual')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Plus className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Add Manually</h3>
                <p className="text-sm text-muted-foreground">Enter account details yourself</p>
                <span className="text-xs text-muted-foreground">Perfect for privacy-focused users</span>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        {/* Skip Option */}
        <Card 
          className={`cursor-pointer transition-all hover:border-accent/40 ${
            selectedMethod === 'skip' ? 'border-accent bg-accent/5' : ''
          }`}
          onClick={() => handleSelection('skip')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                <ArrowRight className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Skip for Now</h3>
                <p className="text-sm text-muted-foreground">Add accounts later from your dashboard</p>
                <span className="text-xs text-accent">You can always add accounts later</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Benefits */}
      <Card className="bg-gradient-to-r from-accent/5 to-primary/5 border-accent/20">
        <CardContent className="p-4">
          <h4 className="font-medium text-foreground mb-2">Why connect accounts?</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Get a complete financial overview</li>
            <li>• Receive personalized insights and recommendations</li>
            <li>• Track progress toward your goals automatically</li>
            <li>• No pressure - you're always in control</li>
          </ul>
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
          onClick={() => selectedMethod && handleSelection(selectedMethod)}
          disabled={!selectedMethod}
          className="flex items-center gap-2"
        >
          Continue
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};