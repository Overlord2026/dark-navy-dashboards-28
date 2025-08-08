import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { CheckCircle, Download, ArrowRight, Star, Users, TrendingUp } from 'lucide-react';

export const CPAGrowthBlueprintLanding: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    firmSize: '',
    agreeToTerms: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeToTerms) {
      toast({
        title: "Agreement Required",
        description: "Please agree to the terms and conditions to continue.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Call edge function to process lead magnet submission
      const { data, error } = await supabase.functions.invoke('process-lead-magnet', {
        body: {
          leadMagnetSlug: 'cpa-growth-blueprint',
          formData: formData
        }
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: "Success!",
        description: "Your CPA Growth Blueprint is ready! Check your email for download link and account details.",
      });
    } catch (error) {
      console.error('Lead magnet submission error:', error);
      toast({
        title: "Error",
        description: "There was an issue processing your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="mb-8">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-4xl font-bold mb-4">Your Blueprint is Ready!</h1>
              <p className="text-xl text-muted-foreground mb-6">
                Plus, your complimentary BFO CPA account has been created so you can start exploring the tools right away.
              </p>
            </div>

            <Card className="p-8 border-2 border-primary/20">
              <CardContent className="space-y-6">
                <div className="text-left space-y-4">
                  <h3 className="text-lg font-semibold">What's Next:</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <strong>Check your email</strong> for the CPA Growth Blueprint download link
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <strong>Access your new CPA account</strong> to explore our tools
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <strong>Watch for our nurture emails</strong> with case studies and advanced tips
                      </div>
                    </div>
                  </div>
                </div>

                <Button size="lg" className="w-full">
                  <ArrowRight className="h-5 w-5 mr-2" />
                  Access My CPA Tools
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Value Proposition */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <span className="text-primary font-semibold">FREE CPA GROWTH BLUEPRINT</span>
              </div>
              
              <h1 className="text-5xl font-bold leading-tight mb-6">
                Get the Proven Framework to 
                <span className="text-primary"> Grow Your Tax & Accounting Practice</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8">
                Discover the exact strategies top CPAs use to increase revenue, reduce hours, and build scalable practices. 
                Plus get instant access to our CPA platform.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Inside the Blueprint:</h3>
              <div className="grid gap-3">
                {[
                  'Proven tax planning strategies that increase client value by $2,400+',
                  'Automation techniques that save 10+ hours per week',
                  'Client retention systems used by top-performing CPAs',
                  'Scalable processes for growing from solo to multi-partner firm',
                  'Premium service packaging that commands higher fees'
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 bg-primary/20 rounded-full border-2 border-background flex items-center justify-center">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">Trusted by 1,200+ CPAs nationwide</p>
                </div>
              </div>
              <blockquote className="text-foreground italic">
                "This blueprint helped me increase my practice revenue by 45% in just 12 months while working 25% fewer hours during tax season."
              </blockquote>
              <p className="text-sm text-muted-foreground mt-2">— Sarah M., CPA, Solo Practitioner</p>
            </div>
          </motion.div>

          {/* Right Side - Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:pl-8"
          >
            <Card className="border-2 border-primary/20 shadow-xl">
              <CardHeader className="text-center bg-primary/5">
                <CardTitle className="text-2xl">Get Your FREE Blueprint</CardTitle>
                <CardDescription className="text-base">
                  Plus instant access to your complimentary CPA account
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="firmSize">Firm Size *</Label>
                    <Select value={formData.firmSize} onValueChange={(value) => handleInputChange('firmSize', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your firm size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="solo">Solo Practitioner</SelectItem>
                        <SelectItem value="2-5">2-5 Partners</SelectItem>
                        <SelectItem value="6-15">6-15 Partners</SelectItem>
                        <SelectItem value="16-50">16-50 Partners</SelectItem>
                        <SelectItem value="50+">50+ Partners</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => handleInputChange('agreeToTerms', !!checked)}
                    />
                    <Label htmlFor="terms" className="text-sm leading-relaxed">
                      I agree to receive emails about CPA practice growth tips and BFO platform updates. 
                      I can unsubscribe at any time.
                    </Label>
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full" 
                    disabled={isSubmitting || !formData.name || !formData.email || !formData.firmSize || !formData.agreeToTerms}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Creating Your Account...
                      </>
                    ) : (
                      <>
                        <Download className="h-5 w-5 mr-2" />
                        Get My FREE Blueprint + CPA Account
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">
                      100% Free • No Credit Card Required • Instant Access
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};