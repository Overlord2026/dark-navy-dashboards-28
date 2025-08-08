import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Shield, Building, MapPin, Phone, FileText, TrendingUp, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const steps = [
  { id: 1, title: 'Business Profile', icon: <Building className="h-5 w-5" /> },
  { id: 2, title: 'Compliance Setup', icon: <Shield className="h-5 w-5" /> },
  { id: 3, title: 'Product Focus', icon: <FileText className="h-5 w-5" /> },
  { id: 4, title: 'Retirement Planning', icon: <TrendingUp className="h-5 w-5" /> }
];

const states = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

const linesOfAuthority = [
  'Life Insurance',
  'Health Insurance',
  'Annuities',
  'Medicare Supplement',
  'Medicare Advantage',
  'Part D Prescription Drugs',
  'Long-Term Care',
  'Disability Insurance'
];

const productFocus = [
  {
    id: 'medicare',
    title: 'Medicare',
    description: 'Medicare Supplement, Advantage, and Part D plans',
    popular: true
  },
  {
    id: 'life',
    title: 'Life Insurance',
    description: 'Term, Whole, Universal, and Indexed Universal Life'
  },
  {
    id: 'annuities',
    title: 'Annuities',
    description: 'Fixed, Variable, and Indexed Annuities'
  },
  {
    id: 'ltc',
    title: 'Disability & Long-Term Care',
    description: 'Income protection and long-term care coverage'
  }
];

export default function InsuranceMedicareOnboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    agency: '',
    licenseStates: [],
    linesOfAuthority: [],
    yearsExperience: '',
    phone: '',
    email: '',
    callRecording: true,
    scriptTemplates: 'standard',
    productFocus: [],
    retirementRoadmapLink: true,
    demoScenarios: true,
    marketingOptIn: true
  });

  const progress = (currentStep / steps.length) * 100;

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      navigate('/insurance-medicare/dashboard');
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStateToggle = (state: string) => {
    const current = formData.licenseStates;
    if (current.includes(state)) {
      updateFormData('licenseStates', current.filter(s => s !== state));
    } else {
      updateFormData('licenseStates', [...current, state]);
    }
  };

  const handleAuthorityToggle = (authority: string) => {
    const current = formData.linesOfAuthority;
    if (current.includes(authority)) {
      updateFormData('linesOfAuthority', current.filter(a => a !== authority));
    } else {
      updateFormData('linesOfAuthority', [...current, authority]);
    }
  };

  const handleProductToggle = (productId: string) => {
    const current = formData.productFocus;
    if (current.includes(productId)) {
      updateFormData('productFocus', current.filter(p => p !== productId));
    } else {
      updateFormData('productFocus', [...current, productId]);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold">Business Profile</h2>
              <p className="text-muted-foreground">Tell us about your insurance practice</p>
            </div>
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="agency">Agency/Company</Label>
                  <Input
                    id="agency"
                    value={formData.agency}
                    onChange={(e) => updateFormData('agency', e.target.value)}
                    placeholder="Medicare Solutions Inc."
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    placeholder="john@medicareolutions.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Select value={formData.yearsExperience} onValueChange={(value) => updateFormData('yearsExperience', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-2">0-2 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="6-10">6-10 years</SelectItem>
                    <SelectItem value="11-20">11-20 years</SelectItem>
                    <SelectItem value="20+">20+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label>License States</Label>
                <div className="grid grid-cols-10 gap-2 max-h-32 overflow-y-auto">
                  {states.map((state) => (
                    <div
                      key={state}
                      className={`p-2 border rounded text-center cursor-pointer transition-all text-sm ${
                        formData.licenseStates.includes(state)
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => handleStateToggle(state)}
                    >
                      {state}
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <Label>Lines of Authority</Label>
                <div className="grid grid-cols-2 gap-3">
                  {linesOfAuthority.map((authority) => (
                    <div
                      key={authority}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        formData.linesOfAuthority.includes(authority)
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => handleAuthorityToggle(authority)}
                    >
                      <div className="flex items-center space-x-2">
                        <Checkbox checked={formData.linesOfAuthority.includes(authority)} disabled />
                        <span className="text-sm font-medium">{authority}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold">Compliance Setup</h2>
              <p className="text-muted-foreground">Configure CMS compliance features</p>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Medicare Call Recording
                  </CardTitle>
                  <CardDescription>
                    Automatically record Medicare-related calls for CMS compliance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.callRecording}
                      onCheckedChange={(checked) => updateFormData('callRecording', checked)}
                    />
                    <Label>Enable automatic call recording for Medicare sales</Label>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Recordings are securely stored and automatically tagged for compliance review
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Script Template Selection</CardTitle>
                  <CardDescription>Choose your preferred CMS-compliant script templates</CardDescription>
                </CardHeader>
                <CardContent>
                  <Select value={formData.scriptTemplates} onValueChange={(value) => updateFormData('scriptTemplates', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard CMS Templates</SelectItem>
                      <SelectItem value="detailed">Detailed Explanation Scripts</SelectItem>
                      <SelectItem value="simplified">Simplified Language Scripts</SelectItem>
                      <SelectItem value="custom">Custom Templates (requires approval)</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Shield className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <div className="font-medium text-sm">CMS Compliance Guaranteed</div>
                        <div className="text-xs text-muted-foreground">
                          All templates are reviewed and approved by compliance experts
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold">Product Focus</h2>
              <p className="text-muted-foreground">Select your primary product areas</p>
            </div>
            <div className="grid gap-4">
              {productFocus.map((product) => (
                <Card
                  key={product.id}
                  className={`cursor-pointer transition-all relative ${
                    formData.productFocus.includes(product.id)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handleProductToggle(product.id)}
                >
                  {product.popular && (
                    <Badge className="absolute -top-2 -right-2 bg-orange-500">
                      Popular
                    </Badge>
                  )}
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <Checkbox checked={formData.productFocus.includes(product.id)} disabled />
                      <div className="flex-1">
                        <h3 className="font-semibold">{product.title}</h3>
                        <p className="text-sm text-muted-foreground">{product.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                <TrendingUp className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold">Retirement Planning Setup</h2>
              <p className="text-muted-foreground">
                Configure the Retirement Roadmap™ for cross-selling opportunities
              </p>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Retirement Roadmap™ Integration</CardTitle>
                  <CardDescription>
                    Connect retirement planning tools to your client management system
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.retirementRoadmapLink}
                      onCheckedChange={(checked) => updateFormData('retirementRoadmapLink', checked)}
                    />
                    <Label>Link Retirement Roadmap module to CRM client list</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.demoScenarios}
                      onCheckedChange={(checked) => updateFormData('demoScenarios', checked)}
                    />
                    <Label>Pre-load demo scenarios for quick presentations</Label>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
                <CardHeader>
                  <CardTitle>Setup Complete!</CardTitle>
                  <CardDescription>You're ready to start using the platform</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Badge className="mt-1">1</Badge>
                    <div>
                      <div className="font-medium">Access Your Compliance Center</div>
                      <div className="text-sm text-muted-foreground">
                        Start recording calls and using approved scripts immediately
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Badge className="mt-1">2</Badge>
                    <div>
                      <div className="font-medium">Import Your Client List</div>
                      <div className="text-sm text-muted-foreground">
                        Upload existing clients to start cross-sell analysis
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Badge className="mt-1">3</Badge>
                    <div>
                      <div className="font-medium">Run Your First Retirement Roadmap</div>
                      <div className="text-sm text-muted-foreground">
                        Discover immediate upsell opportunities with existing clients
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.marketingOptIn}
                      onCheckedChange={(checked) => updateFormData('marketingOptIn', checked)}
                    />
                    <Label className="text-sm">
                      I'd like to receive marketing resources and industry updates
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold mb-2">Insurance & Medicare Agent Onboarding</h1>
          <p className="text-muted-foreground">Set up your compliance and growth center in 4 simple steps</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium">Step {currentStep} of {steps.length}</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Steps */}
        <div className="flex justify-center mb-8 overflow-x-auto">
          <div className="flex space-x-2">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  step.id === currentStep
                    ? 'bg-primary text-primary-foreground'
                    : step.id < currentStep
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step.icon}
                <span className="hidden sm:inline">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          <Button onClick={nextStep}>
            {currentStep === steps.length ? 'Enter Dashboard' : 'Next Step'}
          </Button>
        </div>
      </div>
    </div>
  );
}