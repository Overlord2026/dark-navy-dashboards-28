import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Scale, 
  User, 
  Building2, 
  FileText, 
  Settings, 
  Target, 
  CheckCircle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingData {
  role: string;
  name: string;
  firmName: string;
  location: string;
  barLicenses: string[];
  yearsExperience: string;
  services: string[];
  collaborationPrefs: string[];
  offerSetup: {
    flatFee: boolean;
    retainer: boolean;
    hourly: boolean;
  };
}

export default function EstateAttorneyOnboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
    role: 'estate_attorney',
    name: '',
    firmName: '',
    location: '',
    barLicenses: [],
    yearsExperience: '',
    services: [],
    collaborationPrefs: [],
    offerSetup: {
      flatFee: false,
      retainer: false,
      hourly: false
    }
  });

  const totalSteps = 6;
  const progress = (currentStep / totalSteps) * 100;

  const services = [
    'Wills',
    'Trusts',
    'Power of Attorney',
    'Healthcare Directives',
    'Business Succession Planning',
    'Digital Asset Planning',
    'Estate Tax Planning',
    'Probate Administration'
  ];

  const collaborationOptions = [
    'Secure messaging with clients',
    'Vault access level management',
    'Document review workflows',
    'Video conference integration',
    'Client portal co-editing',
    'Automated document reminders'
  ];

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleCollaborationToggle = (option: string) => {
    setFormData(prev => ({
      ...prev,
      collaborationPrefs: prev.collaborationPrefs.includes(option)
        ? prev.collaborationPrefs.filter(o => o !== option)
        : [...prev.collaborationPrefs, option]
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Scale className="h-16 w-16 mx-auto mb-4 text-blue-600" />
              <h2 className="text-2xl font-bold mb-2">Role Confirmation</h2>
              <p className="text-muted-foreground">
                Confirm your professional role to customize your experience
              </p>
            </div>
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold">Estate Planning Attorney</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  You'll get access to estate planning tools, client vaults, and legacy planning features.
                </p>
              </CardContent>
            </Card>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <User className="h-16 w-16 mx-auto mb-4 text-blue-600" />
              <h2 className="text-2xl font-bold mb-2">Profile Setup</h2>
              <p className="text-muted-foreground">
                Tell us about yourself and your practice
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <Label htmlFor="firmName">Firm Name</Label>
                <Input
                  id="firmName"
                  value={formData.firmName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firmName: e.target.value }))}
                  placeholder="Law firm or practice name"
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="City, State"
                />
              </div>
              <div>
                <Label htmlFor="experience">Years of Experience</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, yearsExperience: value }))}>
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
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <FileText className="h-16 w-16 mx-auto mb-4 text-blue-600" />
              <h2 className="text-2xl font-bold mb-2">Service Selection</h2>
              <p className="text-muted-foreground">
                Which estate planning services do you offer?
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {services.map((service) => (
                <div
                  key={service}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.services.includes(service)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleServiceToggle(service)}
                >
                  <div className="flex items-center space-x-3">
                    <Checkbox checked={formData.services.includes(service)} />
                    <span className="font-medium">{service}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Settings className="h-16 w-16 mx-auto mb-4 text-blue-600" />
              <h2 className="text-2xl font-bold mb-2">Collaboration Preferences</h2>
              <p className="text-muted-foreground">
                How would you like to work with clients in the platform?
              </p>
            </div>
            <div className="space-y-3">
              {collaborationOptions.map((option) => (
                <div
                  key={option}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.collaborationPrefs.includes(option)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleCollaborationToggle(option)}
                >
                  <div className="flex items-center space-x-3">
                    <Checkbox checked={formData.collaborationPrefs.includes(option)} />
                    <span>{option}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Target className="h-16 w-16 mx-auto mb-4 text-blue-600" />
              <h2 className="text-2xl font-bold mb-2">Dashboard Tour</h2>
              <p className="text-muted-foreground">
                Get familiar with your new practice management tools
              </p>
            </div>
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Your Practice Dashboard</h3>
                  <p className="text-muted-foreground">
                    Access client vaults, legacy planning tools, retirement roadmap integration, 
                    and compliance tracking all in one place.
                  </p>
                </div>
                <Button className="w-full mb-4">
                  Take Interactive Tour
                </Button>
                <Button variant="outline" className="w-full">
                  Skip Tour - Go to Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-600" />
              <h2 className="text-2xl font-bold mb-2">Welcome to Your Practice Portal!</h2>
              <p className="text-muted-foreground">
                You're all set up and ready to start serving clients
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardContent className="p-6">
                  <FileText className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                  <h3 className="font-semibold mb-2">Client Vaults</h3>
                  <p className="text-sm text-muted-foreground">
                    Secure document storage ready for your first client
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <Target className="h-8 w-8 mx-auto mb-3 text-purple-600" />
                  <h3 className="font-semibold mb-2">Legacy Planning</h3>
                  <p className="text-sm text-muted-foreground">
                    SWAG Retirement Roadmap™ integration activated
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <Scale className="h-8 w-8 mx-auto mb-3 text-green-600" />
                  <h3 className="font-semibold mb-2">Compliance Center</h3>
                  <p className="text-sm text-muted-foreground">
                    Document tracking and notary scheduling ready
                  </p>
                </CardContent>
              </Card>
            </div>
            <Button className="w-full" size="lg">
              Enter Your Dashboard
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge className="mb-4">Estate Planning Attorney Onboarding</Badge>
          <h1 className="text-3xl font-bold mb-2">Set Up Your Practice Portal</h1>
          <p className="text-muted-foreground">
            Let's get your estate planning practice ready for modern client service
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
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
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <Button
            onClick={nextStep}
            disabled={currentStep === totalSteps}
          >
            {currentStep === totalSteps ? 'Complete Setup' : 'Next'}
            {currentStep !== totalSteps && <ArrowRight className="h-4 w-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
}