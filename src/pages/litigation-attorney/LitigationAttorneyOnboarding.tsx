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
import { Gavel, Building, MapPin, Scale, FileText, Users, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const steps = [
  { id: 1, title: 'Role Confirmation', icon: <Gavel className="h-5 w-5" /> },
  { id: 2, title: 'Profile Setup', icon: <Building className="h-5 w-5" /> },
  { id: 3, title: 'Practice Areas', icon: <Scale className="h-5 w-5" /> },
  { id: 4, title: 'Case Management', icon: <FileText className="h-5 w-5" /> },
  { id: 5, title: 'Client Collaboration', icon: <Users className="h-5 w-5" /> },
  { id: 6, title: 'Dashboard Tour', icon: <CheckCircle className="h-5 w-5" /> }
];

const practiceAreas = [
  'Civil Litigation',
  'Personal Injury',
  'Business Litigation',
  'Employment Law',
  'Medical Malpractice',
  'Product Liability',
  'Securities Litigation',
  'Intellectual Property',
  'Construction Litigation',
  'Insurance Defense',
  'Environmental Law',
  'Class Action',
  'White Collar Defense',
  'Contract Disputes'
];

const documentTypes = [
  'Pleadings & Motions',
  'Discovery Documents',
  'Expert Reports',
  'Depositions & Transcripts',
  'Exhibits & Evidence',
  'Court Orders',
  'Settlement Agreements',
  'Medical Records',
  'Financial Documents',
  'Correspondence'
];

export default function LitigationAttorneyOnboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    role: 'litigation_attorney',
    name: '',
    firmName: '',
    location: '',
    barNumber: '',
    jurisdictions: [],
    yearsExperience: '',
    practiceAreas: [],
    specialties: '',
    documentTypes: [],
    deadlinePreferences: 'email',
    clientMessaging: true,
    caseUpdates: 'weekly',
    uploadPermissions: 'restricted'
  });

  const progress = (currentStep / steps.length) * 100;

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      navigate('/litigation-attorney/dashboard');
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

  const handlePracticeAreaToggle = (area: string) => {
    const current = formData.practiceAreas;
    if (current.includes(area)) {
      updateFormData('practiceAreas', current.filter(p => p !== area));
    } else {
      updateFormData('practiceAreas', [...current, area]);
    }
  };

  const handleDocumentTypeToggle = (type: string) => {
    const current = formData.documentTypes;
    if (current.includes(type)) {
      updateFormData('documentTypes', current.filter(t => t !== type));
    } else {
      updateFormData('documentTypes', [...current, type]);
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
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Gavel className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Welcome, Litigation Attorney!</h2>
              <p className="text-muted-foreground">
                Let's set up your digital command center for litigation success
              </p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Confirm Your Role</CardTitle>
                <CardDescription>
                  This will customize your experience for litigation practice management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 p-4 border rounded-lg bg-primary/5">
                  <Checkbox
                    checked={formData.role === 'litigation_attorney'}
                    disabled
                  />
                  <div>
                    <div className="font-medium">I'm a Litigation Attorney</div>
                    <div className="text-sm text-muted-foreground">
                      I need case management, evidence tracking, and settlement planning tools
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
              <h2 className="text-2xl font-bold">Profile Setup</h2>
              <p className="text-muted-foreground">Tell us about your practice</p>
            </div>
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    placeholder="John Doe, Esq."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firmName">Firm Name</Label>
                  <Input
                    id="firmName"
                    value={formData.firmName}
                    onChange={(e) => updateFormData('firmName', e.target.value)}
                    placeholder="Doe & Associates, LLP"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Primary Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => updateFormData('location', e.target.value)}
                    placeholder="New York, NY"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="barNumber">Bar Number</Label>
                  <Input
                    id="barNumber"
                    value={formData.barNumber}
                    onChange={(e) => updateFormData('barNumber', e.target.value)}
                    placeholder="123456"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="yearsExperience">Years in Practice</Label>
                <Select value={formData.yearsExperience} onValueChange={(value) => updateFormData('yearsExperience', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-3">1-3 years</SelectItem>
                    <SelectItem value="4-7">4-7 years</SelectItem>
                    <SelectItem value="8-15">8-15 years</SelectItem>
                    <SelectItem value="16-25">16-25 years</SelectItem>
                    <SelectItem value="25+">25+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
              <h2 className="text-2xl font-bold">Practice Areas</h2>
              <p className="text-muted-foreground">Select your areas of expertise</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {practiceAreas.map((area) => (
                <div
                  key={area}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    formData.practiceAreas.includes(area)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handlePracticeAreaToggle(area)}
                >
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={formData.practiceAreas.includes(area)} disabled />
                    <span className="text-sm font-medium">{area}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialties">Additional Specialties (Optional)</Label>
              <Textarea
                id="specialties"
                value={formData.specialties}
                onChange={(e) => updateFormData('specialties', e.target.value)}
                placeholder="Describe any additional areas of expertise..."
                rows={3}
              />
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
              <h2 className="text-2xl font-bold">Case Management Setup</h2>
              <p className="text-muted-foreground">Configure your document and deadline preferences</p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Document Types</CardTitle>
                <CardDescription>Select the types of documents you typically manage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {documentTypes.map((type) => (
                    <div
                      key={type}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        formData.documentTypes.includes(type)
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => handleDocumentTypeToggle(type)}
                    >
                      <div className="flex items-center space-x-2">
                        <Checkbox checked={formData.documentTypes.includes(type)} disabled />
                        <span className="text-sm font-medium">{type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Deadline Notifications</CardTitle>
                <CardDescription>How would you like to receive deadline reminders?</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={formData.deadlinePreferences} onValueChange={(value) => updateFormData('deadlinePreferences', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email only</SelectItem>
                    <SelectItem value="sms">SMS only</SelectItem>
                    <SelectItem value="both">Email + SMS</SelectItem>
                    <SelectItem value="in-app">In-app notifications only</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
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
            <div className="text-center">
              <h2 className="text-2xl font-bold">Client Collaboration Settings</h2>
              <p className="text-muted-foreground">Configure how you'll work with clients</p>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Secure Messaging</CardTitle>
                  <CardDescription>Allow clients to send secure messages through the portal</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.clientMessaging}
                      onCheckedChange={(checked) => updateFormData('clientMessaging', checked)}
                    />
                    <Label>Enable secure client messaging</Label>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Case Update Frequency</CardTitle>
                  <CardDescription>How often should clients receive automated case updates?</CardDescription>
                </CardHeader>
                <CardContent>
                  <Select value={formData.caseUpdates} onValueChange={(value) => updateFormData('caseUpdates', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="milestone">Major milestones only</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Document Upload Permissions</CardTitle>
                  <CardDescription>Who can upload documents to case files?</CardDescription>
                </CardHeader>
                <CardContent>
                  <Select value={formData.uploadPermissions} onValueChange={(value) => updateFormData('uploadPermissions', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="attorney-only">Attorney only</SelectItem>
                      <SelectItem value="restricted">Attorney + designated staff</SelectItem>
                      <SelectItem value="client-allowed">Attorney, staff, and clients</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        );

      case 6:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold">Setup Complete!</h2>
              <p className="text-muted-foreground">
                Your litigation command center is ready. Let's take a quick tour of your dashboard.
              </p>
            </div>
            <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
              <CardHeader>
                <CardTitle>What's Next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Badge className="mt-1">1</Badge>
                  <div>
                    <div className="font-medium">Explore Your Dashboard</div>
                    <div className="text-sm text-muted-foreground">
                      Get familiar with case management, evidence tracking, and settlement planning tools
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Badge className="mt-1">2</Badge>
                  <div>
                    <div className="font-medium">Invite Your First Client</div>
                    <div className="text-sm text-muted-foreground">
                      Set up secure client portals and start collaborating on cases
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Badge className="mt-1">3</Badge>
                  <div>
                    <div className="font-medium">Access Training Resources</div>
                    <div className="text-sm text-muted-foreground">
                      Watch tutorials and download marketing materials to grow your practice
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
          <h1 className="text-3xl font-bold mb-2">Litigation Attorney Onboarding</h1>
          <p className="text-muted-foreground">Set up your digital command center in just a few steps</p>
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