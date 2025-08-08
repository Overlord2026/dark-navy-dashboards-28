import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Upload, CheckCircle, User, Settings, Calendar, UserPlus } from 'lucide-react';

export const ComplianceConsultantOnboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Profile & Certifications
    firmName: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    certifications: [] as string[],
    bio: '',
    
    // Step 2: Jurisdiction Specialties
    jurisdictions: [] as string[],
    practiceAreas: [] as string[],
    
    // Step 3: Calendar Integration
    calendarProvider: '',
    notificationPreferences: [] as string[],
    
    // Step 4: First Client
    hasClients: false,
    clientName: '',
    clientEmail: ''
  });

  const navigate = useNavigate();
  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const certificationOptions = [
    'CFP (Certified Financial Planner)',
    'CPA (Certified Public Accountant)',
    'ChFC (Chartered Financial Consultant)',
    'CLU (Chartered Life Underwriter)',
    'CIMA (Certified Investment Management Analyst)',
    'Series 7',
    'Series 66',
    'Other'
  ];

  const jurisdictionOptions = [
    'SEC (Federal)',
    'FINRA',
    'State Insurance Departments',
    'DOL (Department of Labor)',
    'CFTC (Commodity Futures)',
    'Multiple State Jurisdictions'
  ];

  const practiceAreaOptions = [
    'Investment Advisory Compliance',
    'Insurance Compliance',
    'Retirement Plan Compliance',
    'Broker-Dealer Compliance',
    'RIA Compliance',
    'Multi-State Licensing'
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      navigate('/compliance-consultant/dashboard');
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
              <h2 className="text-2xl font-bold">Profile & Certifications</h2>
              <p className="text-muted-foreground">Tell us about your firm and credentials</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firmName">Firm/Company Name</Label>
                <Input
                  id="firmName"
                  value={formData.firmName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firmName: e.target.value }))}
                  placeholder="Compliance Solutions LLC"
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
                  placeholder="john@compliancesolutions.com"
                />
              </div>
            </div>

            <div>
              <Label>Certifications & Licenses</Label>
              <div className="grid md:grid-cols-2 gap-2 mt-2">
                {certificationOptions.map(cert => (
                  <div key={cert} className="flex items-center space-x-2">
                    <Checkbox
                      id={cert}
                      checked={formData.certifications.includes(cert)}
                      onCheckedChange={(checked) => handleCheckboxChange('certifications', cert, checked as boolean)}
                    />
                    <Label htmlFor={cert} className="text-sm">{cert}</Label>
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
                placeholder="Brief description of your compliance expertise..."
                rows={4}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Settings className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Jurisdiction Specialties</h2>
              <p className="text-muted-foreground">Select your areas of compliance expertise</p>
            </div>

            <div>
              <Label>Regulatory Jurisdictions</Label>
              <div className="grid md:grid-cols-2 gap-2 mt-2">
                {jurisdictionOptions.map(jurisdiction => (
                  <div key={jurisdiction} className="flex items-center space-x-2">
                    <Checkbox
                      id={jurisdiction}
                      checked={formData.jurisdictions.includes(jurisdiction)}
                      onCheckedChange={(checked) => handleCheckboxChange('jurisdictions', jurisdiction, checked as boolean)}
                    />
                    <Label htmlFor={jurisdiction} className="text-sm">{jurisdiction}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Practice Areas</Label>
              <div className="grid md:grid-cols-2 gap-2 mt-2">
                {practiceAreaOptions.map(area => (
                  <div key={area} className="flex items-center space-x-2">
                    <Checkbox
                      id={area}
                      checked={formData.practiceAreas.includes(area)}
                      onCheckedChange={(checked) => handleCheckboxChange('practiceAreas', area, checked as boolean)}
                    />
                    <Label htmlFor={area} className="text-sm">{area}</Label>
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
              <Calendar className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Calendar Integration</h2>
              <p className="text-muted-foreground">Connect your calendar and set preferences</p>
            </div>

            <div>
              <Label>Calendar Provider</Label>
              <div className="grid md:grid-cols-3 gap-4 mt-2">
                {['Google Calendar', 'Outlook', 'Apple Calendar'].map(provider => (
                  <Card 
                    key={provider}
                    className={`cursor-pointer border-2 transition-colors ${
                      formData.calendarProvider === provider 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, calendarProvider: provider }))}
                  >
                    <CardContent className="p-4 text-center">
                      <Calendar className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <p className="text-sm font-medium">{provider}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <Label>Notification Preferences</Label>
              <div className="space-y-2 mt-2">
                {['Email reminders', 'SMS alerts', 'In-app notifications', 'Desktop notifications'].map(pref => (
                  <div key={pref} className="flex items-center space-x-2">
                    <Checkbox
                      id={pref}
                      checked={formData.notificationPreferences.includes(pref)}
                      onCheckedChange={(checked) => handleCheckboxChange('notificationPreferences', pref, checked as boolean)}
                    />
                    <Label htmlFor={pref} className="text-sm">{pref}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <UserPlus className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Invite First Client</h2>
              <p className="text-muted-foreground">Get started by adding your first client</p>
            </div>

            <div className="flex items-center space-x-2 mb-4">
              <Checkbox
                id="hasClients"
                checked={formData.hasClients}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasClients: checked as boolean }))}
              />
              <Label htmlFor="hasClients">I have existing clients to add</Label>
            </div>

            {formData.hasClients && (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input
                    id="clientName"
                    value={formData.clientName}
                    onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                    placeholder="ABC Financial Services"
                  />
                </div>
                <div>
                  <Label htmlFor="clientEmail">Client Email</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                    placeholder="contact@abcfinancial.com"
                  />
                </div>
              </div>
            )}

            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <div>
                    <p className="font-medium">You're almost ready!</p>
                    <p className="text-sm text-muted-foreground">
                      Complete setup to access your compliance dashboard and start managing clients.
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
                <CardTitle className="text-2xl">Compliance Consultant Setup</CardTitle>
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