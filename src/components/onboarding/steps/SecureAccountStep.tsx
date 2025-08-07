import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Check, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface SecureAccountStepProps {
  data: any;
  onComplete: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
}

export const SecureAccountStep: React.FC<SecureAccountStepProps> = ({
  data,
  onComplete,
  onNext,
  onPrevious,
  currentStep,
  totalSteps
}) => {
  const [formData, setFormData] = React.useState(() => {
    // Load from localStorage first
    const saved = localStorage.getItem('onboarding-data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const client = parsed?.clientInfo?.primaryClient;
        if (client) {
          return {
            firstName: client.firstName || '',
            lastName: client.lastName || '',
            email: client.email || '',
            phone: client.phone || ''
          };
        }
      } catch {}
    }
    return {
      firstName: data?.clientInfo?.primaryClient?.firstName || '',
      lastName: data?.clientInfo?.primaryClient?.lastName || '',
      email: data?.clientInfo?.primaryClient?.email || '',
      phone: data?.clientInfo?.primaryClient?.phone || ''
    };
  });

  // Auto-save to localStorage on form changes
  React.useEffect(() => {
    const currentData = JSON.parse(localStorage.getItem('onboarding-data') || '{}');
    localStorage.setItem('onboarding-data', JSON.stringify({
      ...currentData,
      clientInfo: {
        ...currentData.clientInfo,
        primaryClient: formData
      }
    }));
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      clientInfo: {
        primaryClient: formData
      }
    });
  };

  const isFormValid = formData.firstName && formData.lastName && formData.email && formData.phone;

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
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Create Your Secure Account</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Get instant access to our platform with just the essentials. We keep your data secure and private.
        </p>
      </div>

      {/* Benefits */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <CardContent className="p-4">
          <h3 className="font-semibold text-foreground mb-3">What's in it for you?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>Immediate dashboard access</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>Browse expert marketplace</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>Access educational resources</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>Complete privacy protection</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              placeholder="Enter your first name"
              required
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              placeholder="Enter your last name"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="Enter your email address"
            required
          />
        </div>

        <div>
          <Label htmlFor="phone">Mobile Number *</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="Enter your mobile number"
            required
          />
        </div>

        {/* Privacy Notice */}
        <div className="p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground">
          <div className="flex items-start gap-2">
            <Shield className="w-4 h-4 mt-0.5 text-primary" />
            <div>
              <p className="font-medium">Privacy First</p>
              <p>We never share your information. Upgrade to premium anytime for exclusive opportunities.</p>
            </div>
          </div>
        </div>
      </form>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          disabled={currentStep === 1}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={!isFormValid}
          className="flex items-center gap-2"
        >
          Continue
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};