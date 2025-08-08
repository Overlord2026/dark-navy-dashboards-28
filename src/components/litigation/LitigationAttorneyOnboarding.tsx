import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, CheckCircle, User, Scale, Briefcase, FolderPlus } from 'lucide-react';

export const LitigationAttorneyOnboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Profile & Bar Admission
    firmName: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    barAdmissions: [] as string[],
    barNumber: '',
    admissionYear: '',
    bio: '',
    
    // Step 2: Practice Area Selection
    litigationTypes: [] as string[],
    courtExperience: [] as string[],
    
    // Step 3: Case Management Preferences
    caseNamingConvention: '',
    defaultTaskAssignee: '',
    documentRetentionYears: '7',
    
    // Step 4: Import First Case
    hasActiveCases: false,
    caseName: '',
    caseNumber: '',
    opposingParty: '',
    trialDate: ''
  });

  const navigate = useNavigate();
  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const litigationTypeOptions = [
    'Civil Litigation',
    'Commercial Litigation',
    'Employment Law',
    'Personal Injury',
    'Business Disputes',
    'Contract Disputes',
    'Real Estate Litigation',
    'Insurance Defense',
    'Class Action',
    'Appellate Practice'
  ];

  const courtExperienceOptions = [
    'State Trial Courts',
    'Federal District Courts',
    'State Appellate Courts',
    'Federal Circuit Courts',
    'Supreme Court',
    'Arbitration/Mediation',
    'Administrative Hearings'
  ];

  const stateOptions = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming', 'Washington D.C.'
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      navigate('/litigation-attorney/dashboard');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCheckboxChange = (field: string, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked
        ? [...prev[field as keyof typeof prev] as string[], value]
        : (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <User className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Profile & Bar Admission</h2>
              <p className="text-muted-foreground">Tell us about your practice and credentials</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firmName">Firm/Practice Name</Label>
                <Input
                  id="firmName"
                  value={formData.firmName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firmName: e.target.value }))}
                  placeholder="Smith & Associates Law Firm"
                />
              </div>
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="John"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Smith"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="john@smithlaw.com"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="barNumber">Bar Number</Label>
                <Input
                  id="barNumber"
                  value={formData.barNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, barNumber: e.target.value }))}
                  placeholder="123456"
                />
              </div>
              <div>
                <Label htmlFor="admissionYear">Year of Admission</Label>
                <Input
                  id="admissionYear"
                  value={formData.admissionYear}
                  onChange={(e) => setFormData(prev => ({ ...prev, admissionYear: e.target.value }))}
                  placeholder="2010"
                />
              </div>
            </div>

            <div>
              <Label>Bar Admissions</Label>
              <div className="grid md:grid-cols-3 gap-2 mt-2 max-h-40 overflow-y-auto">
                {stateOptions.map(state => (
                  <div key={state} className="flex items-center space-x-2">
                    <Checkbox
                      id={state}
                      checked={formData.barAdmissions.includes(state)}
                      onCheckedChange={(checked) => handleCheckboxChange('barAdmissions', state, checked as boolean)}
                    />
                    <Label htmlFor={state} className="text-sm">{state}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Brief description of your litigation experience..."
                rows={4}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Scale className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Practice Area Selection</h2>
              <p className="text-muted-foreground">Select your litigation specialties</p>
            </div>

            <div>
              <Label>Litigation Types</Label>
              <div className="grid md:grid-cols-2 gap-2 mt-2">
                {litigationTypeOptions.map(type => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={type}
                      checked={formData.litigationTypes.includes(type)}
                      onCheckedChange={(checked) => handleCheckboxChange('litigationTypes', type, checked as boolean)}
                    />
                    <Label htmlFor={type} className="text-sm">{type}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Court Experience</Label>
              <div className="grid md:grid-cols-2 gap-2 mt-2">
                {courtExperienceOptions.map(court => (
                  <div key={court} className="flex items-center space-x-2">
                    <Checkbox
                      id={court}
                      checked={formData.courtExperience.includes(court)}
                      onCheckedChange={(checked) => handleCheckboxChange('courtExperience', court, checked as boolean)}
                    />
                    <Label htmlFor={court} className="text-sm">{court}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Briefcase className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Case Management Preferences</h2>
              <p className="text-muted-foreground">Configure how you want to manage cases</p>
            </div>

            <div>
              <Label htmlFor="caseNamingConvention">Case Naming Convention</Label>
              <Select value={formData.caseNamingConvention} onValueChange={(value) => setFormData(prev => ({ ...prev, caseNamingConvention: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select naming convention" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plaintiff-v-defendant">Plaintiff v. Defendant</SelectItem>
                  <SelectItem value="case-number">Case Number</SelectItem>
                  <SelectItem value="client-name">Client Name - Matter</SelectItem>
                  <SelectItem value="custom">Custom Format</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="defaultTaskAssignee">Default Task Assignee</Label>
              <Select value={formData.defaultTaskAssignee} onValueChange={(value) => setFormData(prev => ({ ...prev, defaultTaskAssignee: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select default assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="self">Assign to myself</SelectItem>
                  <SelectItem value="paralegal">Assign to paralegal</SelectItem>
                  <SelectItem value="associate">Assign to associate</SelectItem>
                  <SelectItem value="unassigned">Leave unassigned</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="documentRetentionYears">Document Retention (Years)</Label>
              <Select value={formData.documentRetentionYears} onValueChange={(value) => setFormData(prev => ({ ...prev, documentRetentionYears: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 Years</SelectItem>
                  <SelectItem value="7">7 Years</SelectItem>
                  <SelectItem value="10">10 Years</SelectItem>
                  <SelectItem value="permanent">Permanent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <FolderPlus className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Import First Case</h2>
              <p className="text-muted-foreground">Add your first case to get started</p>
            </div>

            <div className="flex items-center space-x-2 mb-4">
              <Checkbox
                id="hasActiveCases"
                checked={formData.hasActiveCases}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasActiveCases: checked as boolean }))}
              />
              <Label htmlFor="hasActiveCases">I have active cases to import</Label>
            </div>

            {formData.hasActiveCases && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="caseName">Case Name</Label>
                    <Input
                      id="caseName"
                      value={formData.caseName}
                      onChange={(e) => setFormData(prev => ({ ...prev, caseName: e.target.value }))}
                      placeholder="Smith v. Johnson"
                    />
                  </div>
                  <div>
                    <Label htmlFor="caseNumber">Case Number</Label>
                    <Input
                      id="caseNumber"
                      value={formData.caseNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, caseNumber: e.target.value }))}
                      placeholder="2024-CV-12345"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="opposingParty">Opposing Party</Label>
                    <Input
                      id="opposingParty"
                      value={formData.opposingParty}
                      onChange={(e) => setFormData(prev => ({ ...prev, opposingParty: e.target.value }))}
                      placeholder="Johnson Industries"
                    />
                  </div>
                  <div>
                    <Label htmlFor="trialDate">Trial Date (if known)</Label>
                    <Input
                      id="trialDate"
                      type="date"
                      value={formData.trialDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, trialDate: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            )}

            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <div>
                    <p className="font-medium">You're all set!</p>
                    <p className="text-sm text-muted-foreground">
                      Complete setup to access your litigation dashboard and start managing cases.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="container mx-auto max-w-2xl py-8">
        <Card>
          <CardHeader>
            <div className="space-y-4">
              <div className="text-center">
                <CardTitle className="text-2xl">Litigation Attorney Setup</CardTitle>
                <p className="text-muted-foreground">Step {currentStep} of {totalSteps}</p>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {renderStep()}

            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              
              <Button onClick={handleNext}>
                {currentStep === totalSteps ? 'Complete Setup' : 'Next'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};