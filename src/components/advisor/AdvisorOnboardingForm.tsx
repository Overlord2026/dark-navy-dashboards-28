import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Building2, Crown } from 'lucide-react';

interface AdvisorOnboardingFormProps {
  onComplete: () => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  firm: string;
  clientCount: string;
  planType: 'basic' | 'premium';
}

export const AdvisorOnboardingForm: React.FC<AdvisorOnboardingFormProps> = ({ onComplete }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    firm: '',
    clientCount: '',
    planType: 'basic'
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
    onComplete();
  };

  const isFormValid = formData.name && formData.email && formData.firm && formData.clientCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <Card className="border-2 border-border">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl">Create Your Advisor Account</CardTitle>
            <CardDescription className="text-base">
              Tell us about your practice so we can customize your experience
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="John Smith"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="john@firm.com"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="firm">Firm Name *</Label>
                  <Input
                    id="firm"
                    value={formData.firm}
                    onChange={(e) => handleInputChange('firm', e.target.value)}
                    placeholder="Smith Wealth Management"
                    required
                  />
                </div>
              </div>

              {/* Practice Information */}
              <div className="space-y-2">
                <Label htmlFor="clientCount">Number of Clients *</Label>
                <Select onValueChange={(value) => handleInputChange('clientCount', value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client count range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-25">1-25 clients</SelectItem>
                    <SelectItem value="26-50">26-50 clients</SelectItem>
                    <SelectItem value="51-100">51-100 clients</SelectItem>
                    <SelectItem value="101-250">101-250 clients</SelectItem>
                    <SelectItem value="250+">250+ clients</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Plan Selection */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Choose Your Platform Level</Label>
                <RadioGroup
                  value={formData.planType}
                  onValueChange={(value) => handleInputChange('planType', value as 'basic' | 'premium')}
                  className="grid md:grid-cols-2 gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <Card className={`cursor-pointer border-2 transition-colors ${
                      formData.planType === 'basic' ? 'border-primary bg-primary/5' : 'border-border'
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="basic" id="basic" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Building2 className="h-4 w-4 text-primary" />
                              <Label htmlFor="basic" className="font-semibold cursor-pointer">
                                Basic Platform
                              </Label>
                              <Badge variant="secondary" className="text-xs">Free</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Essential tools and basic marketplace listing
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Card className={`cursor-pointer border-2 transition-colors ${
                      formData.planType === 'premium' ? 'border-primary bg-primary/5' : 'border-border'
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="premium" id="premium" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Crown className="h-4 w-4 text-primary" />
                              <Label htmlFor="premium" className="font-semibold cursor-pointer">
                                Premium Platform
                              </Label>
                              <Badge className="text-xs">Most Popular</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Advanced tools, automation, and white-label options
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </RadioGroup>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={!isFormValid}
                >
                  Create Account & Access Dashboard
                </Button>
                <p className="text-sm text-muted-foreground text-center mt-3">
                  You'll get immediate access to your personalized dashboard with a guided walkthrough
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};