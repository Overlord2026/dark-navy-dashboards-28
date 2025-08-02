import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Upload, 
  FileText, 
  Shield, 
  Award,
  ArrowRight,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import { getProfessionalSegmentConfig } from '@/utils/professionalSegments';
import { ProfessionalSegment, ProfessionalType } from '@/types/professional';
import { UserRole } from '@/utils/roleHierarchy';

interface ProfessionalOnboardingProps {
  userRole: UserRole;
  professionalType: ProfessionalType;
  onComplete: (data: any) => void;
}

export function ProfessionalOnboarding({ userRole, professionalType, onComplete }: ProfessionalOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const [uploadedDocuments, setUploadedDocuments] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Determine segment based on professional type
  const getSegmentFromType = (type: ProfessionalType): ProfessionalSegment => {
    const typeMap: Record<string, ProfessionalSegment> = {
      'Private Banker / Trust Officer': 'wealth_management',
      'Estate Planning Consultant': 'legal_advisory',
      'Business Succession Advisor': 'business_advisory',
      'Insurance & Advanced Planning Specialist': 'insurance_planning',
      'Property Manager / Real Estate Specialist': 'real_estate',
      'Philanthropy Consultant': 'philanthropy',
      'Healthcare Advocate': 'healthcare',
      'Luxury Concierge / Travel Specialist': 'luxury_services',
      'Divorce / Family Law Advisor': 'legal_advisory',
      'Platform Aggregator / MFO': 'family_office',
      'Retirement Plan Advisor': 'wealth_management',
      'Private Lender / Credit Specialist': 'investment_management',
      'Family Investment Club Lead': 'investment_management',
      'VC / Private Equity Professional': 'investment_management',
      'Tax Resolution Specialist': 'tax_compliance',
      'HR / Benefit Consultant': 'business_advisory',
      'IMO / Independent Marketing Organization': 'imo_fmo_distribution',
      'FMO / Field Marketing Organization': 'imo_fmo_distribution'
    };
    
    return typeMap[type] || 'wealth_management';
  };

  const segment = getSegmentFromType(professionalType);
  const config = getProfessionalSegmentConfig(segment);

  const steps = [
    {
      title: 'Profile Setup',
      description: 'Basic professional information',
      component: ProfileSetupStep
    },
    {
      title: 'Credentials & Licensing',
      description: 'Professional certifications and licenses',
      component: CredentialsStep
    },
    {
      title: 'Service Offering',
      description: 'Define your services and fee structure',
      component: ServiceOfferingStep
    },
    {
      title: 'Document Upload',
      description: 'Upload required compliance documents',
      component: DocumentUploadStep
    },
    {
      title: 'Referral Preferences',
      description: 'Configure referral network settings',
      component: ReferralPreferencesStep
    },
    {
      title: 'Review & Submit',
      description: 'Final review and submission',
      component: ReviewStep
    }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Submit to backend
      const completeData = {
        ...formData,
        professionalType,
        segment,
        uploadedDocuments,
        onboardingCompleted: true,
        submittedAt: new Date().toISOString()
      };
      
      await onComplete(completeData);
    } catch (error) {
      console.error('Error submitting onboarding:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Professional Onboarding</h1>
        <p className="text-muted-foreground">
          Complete your profile to join our professional network as a {professionalType}
        </p>
      </div>

      {/* Progress Bar */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Step {currentStep + 1} of {steps.length}</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="mb-4" />
          <div className="grid grid-cols-6 gap-2">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${
                  index < currentStep ? 'bg-green-500 text-white' :
                  index === currentStep ? 'bg-primary text-white' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {index < currentStep ? <CheckCircle className="w-4 h-4" /> : index + 1}
                </div>
                <p className="text-xs font-medium">{step.title}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Step */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{steps[currentStep].title}</CardTitle>
          <p className="text-muted-foreground">{steps[currentStep].description}</p>
        </CardHeader>
        <CardContent>
          <CurrentStepComponent
            formData={formData}
            updateFormData={updateFormData}
            config={config}
            uploadedDocuments={uploadedDocuments}
            setUploadedDocuments={setUploadedDocuments}
          />
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={loading}
        >
          {currentStep === steps.length - 1 ? 'Submit Application' : 'Next'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

// Step Components
function ProfileSetupStep({ formData, updateFormData }: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={formData.firstName || ''}
            onChange={(e) => updateFormData('firstName', e.target.value)}
            placeholder="Enter your first name"
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={formData.lastName || ''}
            onChange={(e) => updateFormData('lastName', e.target.value)}
            placeholder="Enter your last name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="email">Professional Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email || ''}
            onChange={(e) => updateFormData('email', e.target.value)}
            placeholder="your.email@firm.com"
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={formData.phone || ''}
            onChange={(e) => updateFormData('phone', e.target.value)}
            placeholder="(555) 123-4567"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="company">Firm/Company Name</Label>
        <Input
          id="company"
          value={formData.company || ''}
          onChange={(e) => updateFormData('company', e.target.value)}
          placeholder="Your firm or company name"
        />
      </div>

      <div>
        <Label htmlFor="bio">Professional Bio</Label>
        <Textarea
          id="bio"
          value={formData.bio || ''}
          onChange={(e) => updateFormData('bio', e.target.value)}
          placeholder="Brief description of your background and expertise..."
          rows={4}
        />
      </div>
    </div>
  );
}

function CredentialsStep({ formData, updateFormData, config }: any) {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="yearsExperience">Years of Experience</Label>
        <Select
          value={formData.yearsExperience || ''}
          onValueChange={(value) => updateFormData('yearsExperience', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select experience level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1-3">1-3 years</SelectItem>
            <SelectItem value="4-7">4-7 years</SelectItem>
            <SelectItem value="8-15">8-15 years</SelectItem>
            <SelectItem value="15+">15+ years</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Professional Licenses</Label>
        <div className="grid grid-cols-2 gap-4 mt-2">
          {['Series 7', 'Series 66', 'CPA', 'CFP', 'ChFC', 'CLU', 'CFA', 'JD'].map((license) => (
            <div key={license} className="flex items-center space-x-2">
              <Checkbox
                id={license}
                checked={formData.licenses?.includes(license) || false}
                onCheckedChange={(checked) => {
                  const current = formData.licenses || [];
                  const updated = checked
                    ? [...current, license]
                    : current.filter((l: string) => l !== license);
                  updateFormData('licenses', updated);
                }}
              />
              <Label htmlFor={license}>{license}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="specializations">Areas of Specialization</Label>
        <Textarea
          id="specializations"
          value={formData.specializations || ''}
          onChange={(e) => updateFormData('specializations', e.target.value)}
          placeholder="List your key areas of expertise (e.g., Estate Planning, Tax Strategy, etc.)"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="clientCapacity">Current Client Capacity</Label>
        <Input
          id="clientCapacity"
          type="number"
          value={formData.clientCapacity || ''}
          onChange={(e) => updateFormData('clientCapacity', e.target.value)}
          placeholder="Maximum number of clients you can serve"
        />
      </div>
    </div>
  );
}

function ServiceOfferingStep({ formData, updateFormData }: any) {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="minClientAssets">Minimum Client Assets (USD)</Label>
        <Select
          value={formData.minClientAssets || ''}
          onValueChange={(value) => updateFormData('minClientAssets', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select minimum assets" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="100000">$100,000</SelectItem>
            <SelectItem value="500000">$500,000</SelectItem>
            <SelectItem value="1000000">$1,000,000</SelectItem>
            <SelectItem value="5000000">$5,000,000</SelectItem>
            <SelectItem value="10000000">$10,000,000+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="feeStructure">Fee Structure</Label>
        <Select
          value={formData.feeStructure || ''}
          onValueChange={(value) => updateFormData('feeStructure', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select fee structure" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hourly">Hourly Rate</SelectItem>
            <SelectItem value="flat_fee">Flat Fee</SelectItem>
            <SelectItem value="aum_based">Assets Under Management</SelectItem>
            <SelectItem value="commission">Commission Based</SelectItem>
            <SelectItem value="retainer">Retainer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.feeStructure === 'hourly' && (
        <div>
          <Label htmlFor="hourlyRate">Hourly Rate (USD)</Label>
          <Input
            id="hourlyRate"
            type="number"
            value={formData.hourlyRate || ''}
            onChange={(e) => updateFormData('hourlyRate', e.target.value)}
            placeholder="350"
          />
        </div>
      )}

      <div>
        <Label htmlFor="servicesOffered">Services Offered</Label>
        <Textarea
          id="servicesOffered"
          value={formData.servicesOffered || ''}
          onChange={(e) => updateFormData('servicesOffered', e.target.value)}
          placeholder="Describe the specific services you provide to clients..."
          rows={4}
        />
      </div>

      <div>
        <Label>Meeting Preferences</Label>
        <div className="grid grid-cols-3 gap-4 mt-2">
          {['In-Person', 'Video Call', 'Phone'].map((method) => (
            <div key={method} className="flex items-center space-x-2">
              <Checkbox
                id={method}
                checked={formData.meetingMethods?.includes(method) || false}
                onCheckedChange={(checked) => {
                  const current = formData.meetingMethods || [];
                  const updated = checked
                    ? [...current, method]
                    : current.filter((m: string) => m !== method);
                  updateFormData('meetingMethods', updated);
                }}
              />
              <Label htmlFor={method}>{method}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DocumentUploadStep({ config, uploadedDocuments, setUploadedDocuments }: any) {
  const handleFileUpload = (documentType: string) => {
    // Simulate file upload
    setUploadedDocuments((prev: string[]) => [...prev, documentType]);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Required Documents</h4>
            <p className="text-blue-700 text-sm mt-1">
              Please upload the following documents to complete your verification process.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {config.required_documents.map((doc: string, index: number) => (
          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              {uploadedDocuments.includes(doc) ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <FileText className="w-5 h-5 text-muted-foreground" />
              )}
              <div>
                <p className="font-medium capitalize">{doc.replace(/_/g, ' ')}</p>
                <p className="text-sm text-muted-foreground">
                  {uploadedDocuments.includes(doc) ? 'Uploaded successfully' : 'Required for verification'}
                </p>
              </div>
            </div>
            {uploadedDocuments.includes(doc) ? (
              <Badge variant="default">Uploaded</Badge>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFileUpload(doc)}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ReferralPreferencesStep({ formData, updateFormData }: any) {
  return (
    <div className="space-y-6">
      <div>
        <Label>Referral Network Participation</Label>
        <div className="space-y-3 mt-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="acceptInbound"
              checked={formData.acceptInboundReferrals || false}
              onCheckedChange={(checked) => updateFormData('acceptInboundReferrals', checked)}
            />
            <Label htmlFor="acceptInbound">Accept inbound referrals from other professionals</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="makeOutbound"
              checked={formData.makeOutboundReferrals || false}
              onCheckedChange={(checked) => updateFormData('makeOutboundReferrals', checked)}
            />
            <Label htmlFor="makeOutbound">Refer clients to other professionals in the network</Label>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="referralFeeStructure">Referral Fee Structure</Label>
        <Select
          value={formData.referralFeeStructure || ''}
          onValueChange={(value) => updateFormData('referralFeeStructure', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select referral fee structure" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No referral fees</SelectItem>
            <SelectItem value="flat_fee">Flat fee per referral</SelectItem>
            <SelectItem value="percentage">Percentage of first year revenue</SelectItem>
            <SelectItem value="reciprocal">Reciprocal referral agreement</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="preferredPartners">Preferred Partner Types</Label>
        <Textarea
          id="preferredPartners"
          value={formData.preferredPartners || ''}
          onChange={(e) => updateFormData('preferredPartners', e.target.value)}
          placeholder="Describe the types of professionals you prefer to work with..."
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="communicationPrefs">Communication Preferences</Label>
        <div className="grid grid-cols-2 gap-4 mt-2">
          {['Email', 'Phone', 'Text/SMS', 'Platform Messages'].map((method) => (
            <div key={method} className="flex items-center space-x-2">
              <Checkbox
                id={method}
                checked={formData.communicationPrefs?.includes(method) || false}
                onCheckedChange={(checked) => {
                  const current = formData.communicationPrefs || [];
                  const updated = checked
                    ? [...current, method]
                    : current.filter((m: string) => m !== method);
                  updateFormData('communicationPrefs', updated);
                }}
              />
              <Label htmlFor={method}>{method}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReviewStep({ formData, config, uploadedDocuments }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-green-900">Ready to Submit</h4>
            <p className="text-green-700 text-sm mt-1">
              Please review your information before submitting your application.
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Name:</span> {formData.firstName} {formData.lastName}
            </div>
            <div>
              <span className="font-medium">Email:</span> {formData.email}
            </div>
            <div>
              <span className="font-medium">Company:</span> {formData.company}
            </div>
            <div>
              <span className="font-medium">Experience:</span> {formData.yearsExperience}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm">
            <span className="font-medium">Uploaded:</span> {uploadedDocuments.length} of {config.required_documents.length} required documents
          </div>
        </CardContent>
      </Card>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-900">Next Steps</h4>
            <p className="text-yellow-700 text-sm mt-1">
              After submission, your application will be reviewed within 3-5 business days. You'll receive an email notification once approved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}