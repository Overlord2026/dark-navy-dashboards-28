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
import { Building, Target, TrendingUp, Users, Upload, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const steps = [
  { id: 1, title: 'Business Profile', icon: <Building className="h-5 w-5" /> },
  { id: 2, title: 'Sales Focus', icon: <Target className="h-5 w-5" /> },
  { id: 3, title: 'Planning Setup', icon: <TrendingUp className="h-5 w-5" /> },
  { id: 4, title: 'CRM & Leads', icon: <Users className="h-5 w-5" /> },
  { id: 5, title: 'Branding', icon: <Upload className="h-5 w-5" /> }
];

const states = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

const productLines = [
  {
    id: 'term_life',
    title: 'Term Life',
    description: 'Level and decreasing term policies',
    popular: true
  },
  {
    id: 'whole_life',
    title: 'Whole Life / Universal Life',
    description: 'Permanent life insurance with cash value'
  },
  {
    id: 'variable_annuities',
    title: 'Variable Annuities',
    description: 'Market-linked retirement income products'
  },
  {
    id: 'fixed_annuities',
    title: 'Fixed Indexed Annuities',
    description: 'Principal-protected growth with income riders'
  },
  {
    id: 'ltc_hybrid',
    title: 'Long-Term Care / Hybrid Policies',
    description: 'LTC coverage with life insurance benefits'
  }
];

const sampleScenarios = [
  'Market crash at retirement',
  'Death of primary income earner',
  'Early retirement at 60',
  'Long-term care event',
  'Inflation impact on fixed income',
  'Social Security reduction'
];

export default function InsuranceLifeAnnuityOnboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    agency: '',
    licenseStates: [],
    productLines: [],
    yearsExperience: '',
    phone: '',
    email: '',
    crmSystem: '',
    retirementRoadmapActive: true,
    sampleScenarios: [],
    leadImportMethod: 'csv',
    logoFile: null,
    customDisclosure: '',
    marketingOptIn: true
  });

  const progress = (currentStep / steps.length) * 100;

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      navigate('/insurance-life-annuity/dashboard');
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

  const handleProductToggle = (productId: string) => {
    const current = formData.productLines;
    if (current.includes(productId)) {
      updateFormData('productLines', current.filter(p => p !== productId));
    } else {
      updateFormData('productLines', [...current, productId]);
    }
  };

  const handleScenarioToggle = (scenario: string) => {
    const current = formData.sampleScenarios;
    if (current.includes(scenario)) {
      updateFormData('sampleScenarios', current.filter(s => s !== scenario));
    } else {
      updateFormData('sampleScenarios', [...current, scenario]);
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
                    placeholder="John Smith"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="agency">Agency/Company</Label>
                  <Input
                    id="agency"
                    value={formData.agency}
                    onChange={(e) => updateFormData('agency', e.target.value)}
                    placeholder="Life & Retirement Solutions"
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
                    placeholder="john@lifesolutions.com"
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
              <h2 className="text-2xl font-bold">Sales Focus</h2>
              <p className="text-muted-foreground">Select your primary product lines</p>
            </div>
            <div className="grid gap-4">
              {productLines.map((product) => (
                <Card
                  key={product.id}
                  className={`cursor-pointer transition-all relative ${
                    formData.productLines.includes(product.id)
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
                      <Checkbox checked={formData.productLines.includes(product.id)} disabled />
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

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold">Planning Setup</h2>
              <p className="text-muted-foreground">Configure the Retirement Roadmap™ module</p>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Retirement Roadmap™ Module</CardTitle>
                  <CardDescription>
                    Activate integrated retirement planning and scenario modeling
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.retirementRoadmapActive}
                      onCheckedChange={(checked) => updateFormData('retirementRoadmapActive', checked)}
                    />
                    <Label>Activate Retirement Roadmap module</Label>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Enables income gap analysis, stress testing, and product integration modeling
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Sample Scenarios for Quick Demos</CardTitle>
                  <CardDescription>Pre-load these scenarios for instant client presentations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {sampleScenarios.map((scenario) => (
                      <div
                        key={scenario}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          formData.sampleScenarios.includes(scenario)
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => handleScenarioToggle(scenario)}
                      >
                        <div className="flex items-center space-x-2">
                          <Checkbox checked={formData.sampleScenarios.includes(scenario)} disabled />
                          <span className="text-sm font-medium">{scenario}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
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
            <div className="text-center">
              <h2 className="text-2xl font-bold">CRM & Lead Import</h2>
              <p className="text-muted-foreground">Connect your existing system and import prospects</p>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>CRM Integration</CardTitle>
                  <CardDescription>Connect your existing CRM system (optional)</CardDescription>
                </CardHeader>
                <CardContent>
                  <Select value={formData.crmSystem} onValueChange={(value) => updateFormData('crmSystem', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your CRM system" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No CRM / Manual entry</SelectItem>
                      <SelectItem value="salesforce">Salesforce</SelectItem>
                      <SelectItem value="hubspot">HubSpot</SelectItem>
                      <SelectItem value="pipedrive">Pipedrive</SelectItem>
                      <SelectItem value="zoho">Zoho CRM</SelectItem>
                      <SelectItem value="other">Other (manual sync)</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Lead Import Method</CardTitle>
                  <CardDescription>How would you like to import your existing prospects?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3">
                    <div
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        formData.leadImportMethod === 'csv'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => updateFormData('leadImportMethod', 'csv')}
                    >
                      <div className="flex items-center space-x-3">
                        <Checkbox checked={formData.leadImportMethod === 'csv'} disabled />
                        <div>
                          <div className="font-medium">CSV Upload</div>
                          <div className="text-sm text-muted-foreground">
                            Upload a spreadsheet with prospect contact information
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        formData.leadImportMethod === 'manual'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => updateFormData('leadImportMethod', 'manual')}
                    >
                      <div className="flex items-center space-x-3">
                        <Checkbox checked={formData.leadImportMethod === 'manual'} disabled />
                        <div>
                          <div className="font-medium">Manual Entry</div>
                          <div className="text-sm text-muted-foreground">
                            Start fresh and add prospects one by one
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                <Upload className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold">Branding & Customization</h2>
              <p className="text-muted-foreground">
                Customize reports and proposals with your branding
              </p>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Logo Upload</CardTitle>
                  <CardDescription>
                    Upload your logo for white-labeled reports and proposals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                    <div className="font-medium mb-2">Upload Company Logo</div>
                    <div className="text-sm text-muted-foreground mb-4">
                      PNG, JPG up to 2MB. Recommended: 300x100px
                    </div>
                    <Button variant="outline">Choose File</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Custom Disclosure Text</CardTitle>
                  <CardDescription>Add your required disclaimers and compliance text</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.customDisclosure}
                    onChange={(e) => updateFormData('customDisclosure', e.target.value)}
                    placeholder="Securities offered through... Insurance products offered through..."
                    rows={4}
                  />
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Setup Complete!
                  </CardTitle>
                  <CardDescription>You're ready to start selling with integrated planning</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Badge className="mt-1">1</Badge>
                    <div>
                      <div className="font-medium">Create Your First Illustration</div>
                      <div className="text-sm text-muted-foreground">
                        Use built-in calculators for term, whole life, and annuities
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Badge className="mt-1">2</Badge>
                    <div>
                      <div className="font-medium">Run Retirement Roadmap Analysis</div>
                      <div className="text-sm text-muted-foreground">
                        Identify income gaps and cross-sell opportunities
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Badge className="mt-1">3</Badge>
                    <div>
                      <div className="font-medium">Generate Branded Proposals</div>
                      <div className="text-sm text-muted-foreground">
                        Combine illustrations with retirement planning scenarios
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
                      Send me marketing templates and sales tips
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
          <h1 className="text-3xl font-bold mb-2">Life Insurance & Annuity Sales Setup</h1>
          <p className="text-muted-foreground">Configure your planning and sales platform in 5 steps</p>
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