import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  CheckCircle, 
  Crown, 
  Star, 
  ArrowRight, 
  Shield,
  Zap,
  Gift,
  Users,
  Phone
} from 'lucide-react';
import { motion } from 'framer-motion';

export const ClientFamilyCTAStep: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'premium'>('free');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    agreeToTerms: false,
    agreeToMarketing: false
  });

  const freeFeatures = [
    'Net Worth Dashboard with Plaid sync',
    'Basic Secure Family Vault (5GB)',
    'Properties Management (Basic)',
    'Bill Pay with reminders',
    'Goals & Budget tracking',
    'Education Hub access',
    'Marketplace directory'
  ];

  const premiumFeatures = [
    'Everything in Free, plus:',
    'Advanced Vault with legacy messages',
    'Retirement Roadmap Analyzer',
    'Automated Bill Pay',
    'Advanced Properties & Entity Management',
    'Advanced Tax Planning Suite',
    'Concierge AI Copilot',
    'Proactive Health Premium',
    'Priority support & concierge service'
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (plan: 'free' | 'premium') => {
    // Handle form submission
    console.log('Form submitted:', { plan, ...formData });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl mx-auto mb-6 flex items-center justify-center"
        >
          <CheckCircle className="w-10 h-10 text-white" />
        </motion.div>
        
        <h1 className="text-3xl lg:text-4xl font-bold mb-4">
          Choose Your Family Office Plan
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
          Start your wealth management journey today. You can always upgrade later 
          as your family's needs grow and evolve.
        </p>
      </div>

      {/* Plan Comparison */}
      <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Free Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className={`h-full transition-all duration-300 ${
            selectedPlan === 'free' 
              ? 'border-green-500 ring-2 ring-green-200' 
              : 'border-green-200 hover:border-green-400'
          }`}>
            <CardHeader className="text-center">
              <Badge className="w-fit mx-auto mb-4 bg-green-100 text-green-700 border-green-200">
                <CheckCircle className="w-4 h-4 mr-2" />
                Free Forever
              </Badge>
              <CardTitle className="text-2xl">Start Free</CardTitle>
              <div className="text-4xl font-bold text-green-600">$0</div>
              <p className="text-sm text-muted-foreground">Perfect for getting organized</p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {freeFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-3 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Button 
                className={`w-full transition-all duration-300 ${
                  selectedPlan === 'free'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-green-100 hover:bg-green-200 text-green-700'
                }`}
                onClick={() => setSelectedPlan('free')}
              >
                {selectedPlan === 'free' ? 'Selected' : 'Choose Free Plan'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              
              <p className="text-xs text-center text-muted-foreground">
                No credit card required • Upgrade anytime
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Premium Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card className={`h-full relative transition-all duration-300 ${
            selectedPlan === 'premium'
              ? 'border-primary ring-2 ring-primary/20'
              : 'border-primary/30 hover:border-primary/50'
          }`}>
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-primary text-white">
                <Star className="w-3 h-3 mr-1" />
                Most Popular
              </Badge>
            </div>
            
            <CardHeader className="text-center">
              <Badge className="w-fit mx-auto mb-4 bg-gradient-to-r from-primary to-primary/80 text-white">
                <Crown className="w-4 h-4 mr-2" />
                Premium
              </Badge>
              <CardTitle className="text-2xl">Unlock Premium</CardTitle>
              <div className="space-y-1">
                <div className="text-4xl font-bold">$197</div>
                <p className="text-sm text-muted-foreground">per month</p>
              </div>
              <div className="flex items-center justify-center text-sm">
                <Gift className="w-4 h-4 mr-2 text-primary" />
                <span className="text-primary font-medium">30-day free trial</span>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {premiumFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-3 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Button 
                className={`w-full transition-all duration-300 ${
                  selectedPlan === 'premium'
                    ? 'bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white'
                    : 'bg-primary/10 hover:bg-primary/20 text-primary'
                }`}
                onClick={() => setSelectedPlan('premium')}
              >
                {selectedPlan === 'premium' ? 'Selected' : 'Choose Premium'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              
              <p className="text-xs text-center text-muted-foreground">
                Cancel anytime • No setup fees
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Signup Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="border-2 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center">
              {selectedPlan === 'free' ? (
                <>
                  <Shield className="w-6 h-6 mr-2 text-green-600" />
                  Create Your Free Account
                </>
              ) : (
                <>
                  <Crown className="w-6 h-6 mr-2 text-primary" />
                  Start Your Premium Trial
                </>
              )}
            </CardTitle>
            <p className="text-muted-foreground">
              {selectedPlan === 'free' 
                ? 'Get started immediately with full access to basic features'
                : 'Try Premium for 30 days free, then $197/month'
              }
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Enter your first name"
                />
              </div>
              
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Enter your last name"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email address"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="For SMS updates and support"
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked as boolean)}
                />
                <label htmlFor="terms" className="text-sm text-muted-foreground">
                  I agree to the Terms of Service and Privacy Policy
                </label>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="marketing"
                  checked={formData.agreeToMarketing}
                  onCheckedChange={(checked) => handleInputChange('agreeToMarketing', checked as boolean)}
                />
                <label htmlFor="marketing" className="text-sm text-muted-foreground">
                  Send me financial tips and platform updates (optional)
                </label>
              </div>
            </div>
            
            <Button 
              size="lg"
              className={`w-full ${
                selectedPlan === 'free'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary'
              }`}
              onClick={() => handleSubmit(selectedPlan)}
              disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.agreeToTerms}
            >
              {selectedPlan === 'free' ? (
                <>
                  <Users className="w-5 h-5 mr-2" />
                  Create Free Account
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  Start Premium Trial
                </>
              )}
            </Button>
            
            <p className="text-xs text-center text-muted-foreground">
              {selectedPlan === 'free' 
                ? 'You can upgrade to Premium anytime from your dashboard'
                : 'Your trial starts immediately. Cancel anytime before day 30 to avoid charges.'
              }
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Trust Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="text-center space-y-4"
      >
        <div className="flex justify-center items-center space-x-6 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Shield className="w-4 h-4 mr-2" />
            Bank-level security
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            50,000+ families served
          </div>
          <div className="flex items-center">
            <Phone className="w-4 h-4 mr-2" />
            24/7 support available
          </div>
        </div>
      </motion.div>
    </div>
  );
};