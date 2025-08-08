import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Target, 
  User, 
  Palette, 
  BookOpen, 
  Users, 
  CreditCard,
  Play,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Upload,
  Star,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const CoachOnboardingFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    practiceDetails: {
      firmName: '',
      specialty: '',
      targetAudience: ''
    },
    brandSetup: {
      logo: null as File | null,
      primaryColor: '#4f46e5',
      bio: ''
    },
    programSetup: {
      programName: '',
      duration: '',
      deliverables: '',
      fee: ''
    },
    marketplaceProfile: {
      categories: [] as string[],
      intakePreferences: '',
      availability: ''
    },
    subscription: {
      tier: 'basic' as 'basic' | 'premium'
    }
  });

  const navigate = useNavigate();

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome & Benefits',
      icon: <Target className="w-5 h-5" />,
      description: 'Overview of platform capabilities'
    },
    {
      id: 'practice-details',
      title: 'Practice Details',
      icon: <User className="w-5 h-5" />,
      description: 'Firm name, specialty, target audience'
    },
    {
      id: 'brand-setup',
      title: 'Brand Setup',
      icon: <Palette className="w-5 h-5" />,
      description: 'Logo, colors, and bio'
    },
    {
      id: 'program-setup',
      title: 'Program Setup',
      icon: <BookOpen className="w-5 h-5" />,
      description: 'Add example program (optional)'
    },
    {
      id: 'marketplace-profile',
      title: 'Marketplace Profile',
      icon: <Users className="w-5 h-5" />,
      description: 'Categories and preferences'
    },
    {
      id: 'payment-subscription',
      title: 'Payment & Subscription',
      icon: <CreditCard className="w-5 h-5" />,
      description: 'Choose Basic or Premium'
    },
    {
      id: 'dashboard-tour',
      title: 'Dashboard Tour',
      icon: <Play className="w-5 h-5" />,
      description: 'Quick walkthrough'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding - redirect to dashboard
      navigate('/coach');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (section: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section as keyof typeof prev], ...data }
    }));
  };

  const renderStep = () => {
    const step = steps[currentStep];

    switch (step.id) {
      case 'welcome':
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full mx-auto flex items-center justify-center mb-6">
              <Target className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-3xl font-bold">Welcome to Your Digital Practice Hub</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              You're about to join an elite community of coaches and consultants who are scaling their practices with advanced tools designed for high-performance professionals.
            </p>

            <div className="grid md:grid-cols-3 gap-6 my-8">
              <Card className="border-primary/20">
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Elite Client Base</h3>
                  <p className="text-sm text-muted-foreground">Connect with high-net-worth individuals and families</p>
                </CardContent>
              </Card>
              
              <Card className="border-primary/20">
                <CardContent className="p-6 text-center">
                  <Zap className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">AI-Powered Tools</h3>
                  <p className="text-sm text-muted-foreground">Automate program delivery and client tracking</p>
                </CardContent>
              </Card>
              
              <Card className="border-primary/20">
                <CardContent className="p-6 text-center">
                  <Star className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Premium Platform</h3>
                  <p className="text-sm text-muted-foreground">Same tools used by family offices and wealth managers</p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-muted/50 rounded-lg p-6">
              <h4 className="font-semibold mb-3">What You'll Set Up Today:</h4>
              <ul className="text-left space-y-2 max-w-md mx-auto">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span className="text-sm">Professional practice profile</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span className="text-sm">Brand identity and messaging</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span className="text-sm">Service programs and pricing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span className="text-sm">Marketplace presence</span>
                </li>
              </ul>
            </div>
          </div>
        );

      case 'practice-details':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Tell Us About Your Practice</h2>
              <p className="text-muted-foreground">Help us customize your experience</p>
            </div>

            <div className="grid gap-6 max-w-2xl mx-auto">
              <div className="space-y-2">
                <Label htmlFor="firmName">Firm/Brand Name *</Label>
                <Input
                  id="firmName"
                  placeholder="e.g., Elite Leadership Coaching"
                  value={formData.practiceDetails.firmName}
                  onChange={(e) => updateFormData('practiceDetails', { firmName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialty">Niche Specialty *</Label>
                <Input
                  id="specialty"
                  placeholder="e.g., Executive Leadership, Wealth Mindset, Business Strategy"
                  value={formData.practiceDetails.specialty}
                  onChange={(e) => updateFormData('practiceDetails', { specialty: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAudience">Target Audience *</Label>
                <Textarea
                  id="targetAudience"
                  placeholder="Describe your ideal clients (e.g., C-suite executives, high-net-worth entrepreneurs, family business owners)"
                  value={formData.practiceDetails.targetAudience}
                  onChange={(e) => updateFormData('practiceDetails', { targetAudience: e.target.value })}
                />
              </div>
            </div>
          </div>
        );

      case 'brand-setup':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Brand Your Practice</h2>
              <p className="text-muted-foreground">Create a professional presence that reflects your expertise</p>
            </div>

            <div className="grid gap-6 max-w-2xl mx-auto">
              <div className="space-y-2">
                <Label>Logo Upload (Optional)</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Brand Color</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    id="primaryColor"
                    value={formData.brandSetup.primaryColor}
                    onChange={(e) => updateFormData('brandSetup', { primaryColor: e.target.value })}
                    className="w-12 h-12 rounded-lg border border-border cursor-pointer"
                  />
                  <Input
                    value={formData.brandSetup.primaryColor}
                    onChange={(e) => updateFormData('brandSetup', { primaryColor: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Share your background, credentials, and what makes you unique as a coach/consultant..."
                  rows={4}
                  value={formData.brandSetup.bio}
                  onChange={(e) => updateFormData('brandSetup', { bio: e.target.value })}
                />
              </div>
            </div>
          </div>
        );

      case 'program-setup':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Add Your First Program</h2>
              <p className="text-muted-foreground">Optional: Create a template for your coaching/consulting programs</p>
            </div>

            <div className="grid gap-6 max-w-2xl mx-auto">
              <div className="space-y-2">
                <Label htmlFor="programName">Program Name</Label>
                <Input
                  id="programName"
                  placeholder="e.g., Executive Leadership Intensive"
                  value={formData.programSetup.programName}
                  onChange={(e) => updateFormData('programSetup', { programName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Program Duration</Label>
                <Input
                  id="duration"
                  placeholder="e.g., 12 weeks, 6 months"
                  value={formData.programSetup.duration}
                  onChange={(e) => updateFormData('programSetup', { duration: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliverables">Key Deliverables</Label>
                <Textarea
                  id="deliverables"
                  placeholder="What clients will receive (e.g., weekly 1:1 sessions, assessments, action plans)"
                  value={formData.programSetup.deliverables}
                  onChange={(e) => updateFormData('programSetup', { deliverables: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fee">Program Fee</Label>
                <Input
                  id="fee"
                  placeholder="e.g., $15,000"
                  value={formData.programSetup.fee}
                  onChange={(e) => updateFormData('programSetup', { fee: e.target.value })}
                />
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  💡 You can always add more programs later from your dashboard
                </p>
              </div>
            </div>
          </div>
        );

      case 'marketplace-profile':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Marketplace Profile</h2>
              <p className="text-muted-foreground">Set up how you'll appear to potential clients</p>
            </div>

            <div className="grid gap-6 max-w-2xl mx-auto">
              <div className="space-y-2">
                <Label>Service Categories</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Executive Coaching',
                    'Business Strategy',
                    'Leadership Development',
                    'Wealth Mindset',
                    'Performance Coaching',
                    'Life Coaching'
                  ].map((category) => (
                    <Button
                      key={category}
                      variant={formData.marketplaceProfile.categories.includes(category) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        const categories = formData.marketplaceProfile.categories.includes(category)
                          ? formData.marketplaceProfile.categories.filter(c => c !== category)
                          : [...formData.marketplaceProfile.categories, category];
                        updateFormData('marketplaceProfile', { categories });
                      }}
                      className="justify-start"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="intakePreferences">Client Intake Preferences</Label>
                <Textarea
                  id="intakePreferences"
                  placeholder="What type of clients are you looking for? Any specific requirements?"
                  value={formData.marketplaceProfile.intakePreferences}
                  onChange={(e) => updateFormData('marketplaceProfile', { intakePreferences: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="availability">Booking Availability</Label>
                <Input
                  id="availability"
                  placeholder="e.g., Weekdays 9 AM - 5 PM EST"
                  value={formData.marketplaceProfile.availability}
                  onChange={(e) => updateFormData('marketplaceProfile', { availability: e.target.value })}
                />
              </div>
            </div>
          </div>
        );

      case 'payment-subscription':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Choose Your Plan</h2>
              <p className="text-muted-foreground">Select the tier that fits your practice</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card className={`cursor-pointer transition-all ${formData.subscription.tier === 'basic' ? 'ring-2 ring-primary' : ''}`}>
                <CardContent className="p-6" onClick={() => updateFormData('subscription', { tier: 'basic' })}>
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold mb-2">Basic</h3>
                    <div className="text-3xl font-bold">$99<span className="text-lg text-muted-foreground">/mo</span></div>
                  </div>
                  
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      CRM for up to 25 clients
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      1 active program template
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      Marketplace listing
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      Basic scheduling (no payments)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      File sharing (1GB storage)
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className={`cursor-pointer transition-all ${formData.subscription.tier === 'premium' ? 'ring-2 ring-primary' : ''} relative`}>
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary to-accent text-white">
                  Most Popular
                </Badge>
                <CardContent className="p-6" onClick={() => updateFormData('subscription', { tier: 'premium' })}>
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold mb-2">Premium</h3>
                    <div className="text-3xl font-bold">$299<span className="text-lg text-muted-foreground">/mo</span></div>
                  </div>
                  
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      Unlimited CRM contacts
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      Unlimited program templates
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      Integrated scheduling + payments
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      Performance analytics dashboard
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      Priority marketplace placement
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      Marketing automation engine
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      Expanded storage (10GB+)
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                14-day free trial • No setup fees • Cancel anytime
              </p>
            </div>
          </div>
        );

      case 'dashboard-tour':
        return (
          <div className="text-center space-y-6">
            <CheckCircle2 className="w-20 h-20 text-primary mx-auto" />
            
            <h2 className="text-3xl font-bold">Welcome to Your Dashboard!</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your practice is now set up and ready to go. Let's take a quick tour of what you can do.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 my-8">
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Client CRM</h3>
                  <p className="text-xs text-muted-foreground">Manage contacts and track progress</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Program Builder</h3>
                  <p className="text-xs text-muted-foreground">Create coaching curricula</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <Target className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Marketplace Leads</h3>
                  <p className="text-xs text-muted-foreground">View and accept prospects</p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-muted/50 rounded-lg p-6">
              <h4 className="font-semibold mb-3">Next Steps:</h4>
              <ul className="text-left space-y-2 max-w-md mx-auto">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span className="text-sm">Complete your profile verification</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span className="text-sm">Upload client testimonials</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span className="text-sm">Set up your first coaching program</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span className="text-sm">Start receiving marketplace leads</span>
                </li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8">
      <div className="container mx-auto max-w-4xl px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Coach Setup</h1>
          <p className="text-muted-foreground">Step {currentStep + 1} of {steps.length}</p>
          <Progress value={progress} className="mt-4 h-2" />
        </div>

        {/* Steps Navigation */}
        <div className="flex justify-center mb-8 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  index === currentStep
                    ? 'bg-primary text-primary-foreground'
                    : index < currentStep
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step.icon}
                <span className="hidden sm:inline">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
          >
            {currentStep === steps.length - 1 ? 'Complete Setup' : 'Next'}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};