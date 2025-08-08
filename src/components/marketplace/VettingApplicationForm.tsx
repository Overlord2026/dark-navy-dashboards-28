import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  FileText, 
  Shield, 
  CreditCard, 
  CheckCircle, 
  AlertCircle,
  Users,
  Briefcase,
  Calculator,
  Scale,
  Heart,
  Home,
  Crown,
  Target
} from 'lucide-react';

interface VettingApplicationFormProps {
  className?: string;
  onSubmit?: (data: any) => void;
}

interface ApplicationData {
  personaType: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    bio: string;
    headshot?: File;
  };
  professional: {
    yearsInPractice: string;
    specialties: string[];
    licenseNumber: string;
    businessName: string;
    businessAddress: string;
  };
  documents: {
    license?: File;
    insurance?: File;
    credentials?: File;
    additional?: File[];
  };
  compliance: {
    backgroundCheckConsent: boolean;
    complianceAgreement: boolean;
    dataPrivacyConsent: boolean;
  };
  payment: {
    vettingFee: number;
    paymentMethod?: string;
  };
}

const PERSONA_ICONS = {
  'client-family': Users,
  'financial-advisor': Briefcase,
  'cpa-accountant': Calculator,
  'attorney-legal': Scale,
  'insurance-medicare': Shield,
  'healthcare-longevity': Heart,
  'real-estate': Home,
  'elite-family-office': Crown,
  'coach-consultant': Target
};

const VETTING_FEES = {
  'financial-advisor': 299,
  'cpa-accountant': 199,
  'attorney-legal': 249,
  'insurance-medicare': 179,
  'healthcare-longevity': 199,
  'real-estate': 149,
  'elite-family-office': 499,
  'coach-consultant': 129
};

const REQUIRED_DOCUMENTS = {
  'financial-advisor': ['Professional License', 'E&O Insurance', 'Form ADV'],
  'cpa-accountant': ['CPA License', 'Professional Liability Insurance', 'PTIN Certificate'],
  'attorney-legal': ['Bar License', 'Malpractice Insurance', 'Professional Standing'],
  'insurance-medicare': ['Insurance License', 'Appointment Letters', 'E&O Coverage'],
  'healthcare-longevity': ['Medical License', 'Malpractice Insurance', 'Board Certifications'],
  'real-estate': ['Real Estate License', 'MLS Membership', 'E&O Insurance'],
  'elite-family-office': ['RIA Registration', 'Professional References', 'AUM Documentation'],
  'coach-consultant': ['Professional Certifications', 'Liability Insurance', 'Client References']
};

export const VettingApplicationForm: React.FC<VettingApplicationFormProps> = ({
  className = "",
  onSubmit
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [applicationData, setApplicationData] = useState<ApplicationData>({
    personaType: '',
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      bio: '',
    },
    professional: {
      yearsInPractice: '',
      specialties: [],
      licenseNumber: '',
      businessName: '',
      businessAddress: ''
    },
    documents: {},
    compliance: {
      backgroundCheckConsent: false,
      complianceAgreement: false,
      dataPrivacyConsent: false
    },
    payment: {
      vettingFee: 0
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const updateData = (section: keyof ApplicationData, data: any) => {
    setApplicationData(prev => ({
      ...prev,
      [section]: { ...(prev[section] as any), ...data }
    }));
  };

  const handlePersonaSelect = (personaType: string) => {
    updateData('personaType', personaType);
    updateData('payment', { vettingFee: VETTING_FEES[personaType as keyof typeof VETTING_FEES] || 199 });
  };

  const handleFileUpload = (field: string, file: File) => {
    updateData('documents', { [field]: file });
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return !!applicationData.personaType;
      case 2:
        const { firstName, lastName, email, bio } = applicationData.personalInfo;
        return firstName && lastName && email && bio;
      case 3:
        const { yearsInPractice, licenseNumber, businessName } = applicationData.professional;
        return yearsInPractice && licenseNumber && businessName;
      case 4:
        const { backgroundCheckConsent, complianceAgreement, dataPrivacyConsent } = applicationData.compliance;
        return backgroundCheckConsent && complianceAgreement && dataPrivacyConsent;
      case 5:
        return true; // Payment step validation handled separately
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    } else {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive"
      });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Application Submitted Successfully",
        description: "Your vetting application has been submitted for review. You'll receive an email confirmation shortly.",
      });

      if (onSubmit) {
        onSubmit(applicationData);
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h2 className="font-serif text-2xl font-bold">Select Your Professional Persona</h2>
              <p className="text-muted-foreground">
                Choose the persona type that best describes your professional practice
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(PERSONA_ICONS).map(([id, Icon]) => {
                const isSelected = applicationData.personaType === id;
                const fee = VETTING_FEES[id as keyof typeof VETTING_FEES] || 199;
                
                return (
                  <Card 
                    key={id}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      isSelected ? 'ring-2 ring-gold border-gold/50 bg-gold/5' : 'hover:border-gold/20'
                    }`}
                    onClick={() => handlePersonaSelect(id)}
                  >
                    <CardContent className="p-6 text-center space-y-4">
                      <div className={`w-12 h-12 mx-auto rounded-lg flex items-center justify-center ${
                        isSelected ? 'bg-gold text-navy' : 'bg-card'
                      }`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">
                          {id.split('-').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </h3>
                        <Badge variant="secondary" className="mb-2">
                          ${fee} Vetting Fee
                        </Badge>
                        <div className="text-xs text-muted-foreground">
                          Required docs: {REQUIRED_DOCUMENTS[id as keyof typeof REQUIRED_DOCUMENTS]?.length || 0}
                        </div>
                      </div>
                      {isSelected && (
                        <CheckCircle className="w-5 h-5 text-gold mx-auto" />
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="font-serif text-2xl font-bold">Personal Information</h2>
              <p className="text-muted-foreground">
                Tell us about yourself and your professional background
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={applicationData.personalInfo.firstName}
                  onChange={(e) => updateData('personalInfo', { firstName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={applicationData.personalInfo.lastName}
                  onChange={(e) => updateData('personalInfo', { lastName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Professional Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={applicationData.personalInfo.email}
                  onChange={(e) => updateData('personalInfo', { email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={applicationData.personalInfo.phone}
                  onChange={(e) => updateData('personalInfo', { phone: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Professional Bio *</Label>
              <Textarea
                id="bio"
                value={applicationData.personalInfo.bio}
                onChange={(e) => updateData('personalInfo', { bio: e.target.value })}
                placeholder="Describe your professional background, experience, and specialties..."
                className="min-h-32"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Professional Headshot</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Upload a professional headshot (JPG, PNG, max 5MB)
                </p>
                <Button variant="outline" size="sm">
                  Choose File
                </Button>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="font-serif text-2xl font-bold">Professional Details</h2>
              <p className="text-muted-foreground">
                Provide your professional credentials and business information
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="yearsInPractice">Years in Practice *</Label>
                <Select
                  value={applicationData.professional.yearsInPractice}
                  onValueChange={(value) => updateData('professional', { yearsInPractice: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-2">0-2 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="6-10">6-10 years</SelectItem>
                    <SelectItem value="11-15">11-15 years</SelectItem>
                    <SelectItem value="16-20">16-20 years</SelectItem>
                    <SelectItem value="20+">20+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="licenseNumber">License Number *</Label>
                <Input
                  id="licenseNumber"
                  value={applicationData.professional.licenseNumber}
                  onChange={(e) => updateData('professional', { licenseNumber: e.target.value })}
                  placeholder="Enter your professional license number"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessName">Business/Firm Name *</Label>
                <Input
                  id="businessName"
                  value={applicationData.professional.businessName}
                  onChange={(e) => updateData('professional', { businessName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessAddress">Business Address</Label>
                <Input
                  id="businessAddress"
                  value={applicationData.professional.businessAddress}
                  onChange={(e) => updateData('professional', { businessAddress: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Specialties & Areas of Focus</Label>
              <Textarea
                value={applicationData.professional.specialties.join(', ')}
                onChange={(e) => updateData('professional', { 
                  specialties: e.target.value.split(',').map(s => s.trim()).filter(s => s) 
                })}
                placeholder="Enter your specialties separated by commas..."
                className="min-h-20"
              />
            </div>

            {applicationData.personaType && (
              <Card className="bg-card/50">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Required Documents for {applicationData.personaType.split('-').map(w => 
                      w.charAt(0).toUpperCase() + w.slice(1)
                    ).join(' ')}
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {REQUIRED_DOCUMENTS[applicationData.personaType as keyof typeof REQUIRED_DOCUMENTS]?.map((doc, index) => (
                      <li key={index}>{doc}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="font-serif text-2xl font-bold">Compliance & Documentation</h2>
              <p className="text-muted-foreground">
                Upload required documents and provide compliance consent
              </p>
            </div>

            <div className="space-y-6">
              {/* Document Upload Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Required Documents
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {REQUIRED_DOCUMENTS[applicationData.personaType as keyof typeof REQUIRED_DOCUMENTS]?.map((docType, index) => (
                    <div key={index} className="space-y-2">
                      <Label>{docType}</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                        <FileText className="w-6 h-6 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Upload {docType}
                        </p>
                        <Button variant="outline" size="sm">
                          Choose File
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Compliance Consent */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Compliance Consent
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="backgroundCheck"
                      checked={applicationData.compliance.backgroundCheckConsent}
                      onCheckedChange={(checked) => 
                        updateData('compliance', { backgroundCheckConsent: checked })
                      }
                    />
                    <div className="space-y-1">
                      <Label htmlFor="backgroundCheck" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Background Check Consent *
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        I consent to a comprehensive background check including regulatory databases, professional standing, and compliance history.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="complianceAgreement"
                      checked={applicationData.compliance.complianceAgreement}
                      onCheckedChange={(checked) => 
                        updateData('compliance', { complianceAgreement: checked })
                      }
                    />
                    <div className="space-y-1">
                      <Label htmlFor="complianceAgreement" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        BFO Compliance Agreement *
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        I agree to maintain active professional licenses, insurance, and comply with all BFO marketplace standards.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="dataPrivacy"
                      checked={applicationData.compliance.dataPrivacyConsent}
                      onCheckedChange={(checked) => 
                        updateData('compliance', { dataPrivacyConsent: checked })
                      }
                    />
                    <div className="space-y-1">
                      <Label htmlFor="dataPrivacy" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Data Privacy Consent *
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        I acknowledge the BFO Privacy Policy and consent to the processing of my personal and professional data for vetting purposes.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="font-serif text-2xl font-bold">Payment & Final Review</h2>
              <p className="text-muted-foreground">
                Review your application and complete the vetting fee payment
              </p>
            </div>

            {/* Application Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Application Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Persona Type</Label>
                    <p className="font-medium">
                      {applicationData.personaType.split('-').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Applicant Name</Label>
                    <p className="font-medium">
                      {applicationData.personalInfo.firstName} {applicationData.personalInfo.lastName}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Email</Label>
                    <p className="font-medium">{applicationData.personalInfo.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Business</Label>
                    <p className="font-medium">{applicationData.professional.businessName}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Vetting Fee Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-card/50 rounded-lg">
                  <div>
                    <p className="font-medium">Professional Vetting & Verification</p>
                    <p className="text-sm text-muted-foreground">
                      One-time fee for comprehensive background check and marketplace verification
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gold">${applicationData.payment.vettingFee}</p>
                    <p className="text-sm text-muted-foreground">USD</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Your payment will be processed securely through Stripe. After payment confirmation, 
                    your application will enter the verification queue with an expected processing time of 3-5 business days.
                  </p>
                  
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-warning mt-0.5" />
                    <p className="text-xs text-muted-foreground">
                      Vetting fees are non-refundable. However, if your application is denied due to 
                      missing documentation that you can provide, we'll allow one free resubmission.
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
    <div className={`max-w-4xl mx-auto space-y-6 ${className}`}>
      {/* Progress Header */}
      <Card className="bg-gradient-to-r from-gold/10 to-emerald/10">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="font-serif text-2xl font-bold">BFO Professional Vetting Application</h1>
              <Badge variant="secondary">Step {currentStep} of {totalSteps}</Badge>
            </div>
            
            <Progress value={progress} className="w-full" />
            
            <div className="flex justify-between text-sm text-muted-foreground">
              <span className={currentStep >= 1 ? 'text-foreground font-medium' : ''}>Persona Selection</span>
              <span className={currentStep >= 2 ? 'text-foreground font-medium' : ''}>Personal Info</span>
              <span className={currentStep >= 3 ? 'text-foreground font-medium' : ''}>Professional Details</span>
              <span className={currentStep >= 4 ? 'text-foreground font-medium' : ''}>Compliance</span>
              <span className={currentStep >= 5 ? 'text-foreground font-medium' : ''}>Payment</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardContent className="p-8">
          {renderStep()}
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

        <div className="flex gap-3">
          {currentStep < totalSteps ? (
            <Button
              onClick={nextStep}
              disabled={!validateCurrentStep()}
              className="bg-gradient-to-r from-gold to-gold/90"
            >
              Next Step
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!validateCurrentStep() || isSubmitting}
              className="bg-gradient-to-r from-emerald to-emerald/90"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application & Pay'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};