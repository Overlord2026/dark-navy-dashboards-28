import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, Shield, Star, Check, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PartnerApplicationProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ApplicationData {
  // Step 1: Company Info
  companyName: string;
  website: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  companyType: string;
  
  // Step 2: Documents
  documents: {
    formADV: File | null;
    ppm: File | null;
    compliancePolicies: File | null;
    marketingMaterials: File | null;
  };
  
  // Step 3: Placement Tier
  selectedTier: 'standard' | 'premium' | 'elite' | '';
  
  // Step 4: Compliance
  complianceAttestations: {
    accurateInfo: boolean;
    regulatoryCompliance: boolean;
    conflictDisclosure: boolean;
    feeDisclosure: boolean;
    termsAccepted: boolean;
  };
}

const placementTiers = [
  {
    id: 'standard',
    name: 'Standard',
    price: '$2,500/year',
    features: [
      'Basic listing in marketplace',
      'Company profile page',
      'Contact request management',
      'Basic analytics'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$7,500/year', 
    features: [
      'Enhanced listing with priority placement',
      'Rich media support (videos, documents)',
      'Advanced analytics and reporting',
      'Lead management dashboard',
      'Quarterly performance reviews'
    ],
    popular: true
  },
  {
    id: 'elite',
    name: 'Elite',
    price: '$15,000/year',
    features: [
      'Top-tier placement and featuring',
      'Dedicated relationship manager',
      'Custom webinar hosting',
      'White-label co-marketing opportunities',
      'Priority access to family office events',
      'Advanced compliance support'
    ]
  }
];

export const PartnerApplication: React.FC<PartnerApplicationProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const [applicationData, setApplicationData] = useState<ApplicationData>({
    companyName: '',
    website: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    companyType: '',
    documents: {
      formADV: null,
      ppm: null,
      compliancePolicies: null,
      marketingMaterials: null
    },
    selectedTier: '',
    complianceAttestations: {
      accurateInfo: false,
      regulatoryCompliance: false,
      conflictDisclosure: false,
      feeDisclosure: false,
      termsAccepted: false
    }
  });

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const handleFileUpload = (documentType: keyof ApplicationData['documents'], file: File) => {
    setApplicationData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [documentType]: file
      }
    }));
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        return !!(applicationData.companyName && applicationData.contactName && applicationData.contactEmail);
      case 2:
        return !!(applicationData.documents.formADV && applicationData.documents.ppm);
      case 3:
        return !!applicationData.selectedTier;
      case 4:
        return Object.values(applicationData.complianceAttestations).every(Boolean);
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Application Submitted Successfully",
        description: "Our team will review your application and contact you within 2 business days.",
      });
      
      setCurrentStep(5); // Show confirmation step
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again or contact support for assistance.",
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
            <div>
              <h3 className="text-lg font-semibold mb-4">Company Information</h3>
              <p className="text-muted-foreground mb-6">
                Please provide your firm's basic information and primary contact details.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Legal Name *</Label>
                <Input
                  id="companyName"
                  value={applicationData.companyName}
                  onChange={(e) => setApplicationData(prev => ({...prev, companyName: e.target.value}))}
                  placeholder="e.g., Meridian Capital Partners LLC"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={applicationData.website}
                  onChange={(e) => setApplicationData(prev => ({...prev, website: e.target.value}))}
                  placeholder="https://example.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactName">Primary Contact Name *</Label>
                <Input
                  id="contactName"
                  value={applicationData.contactName}
                  onChange={(e) => setApplicationData(prev => ({...prev, contactName: e.target.value}))}
                  placeholder="John Smith"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={applicationData.contactEmail}
                  onChange={(e) => setApplicationData(prev => ({...prev, contactEmail: e.target.value}))}
                  placeholder="john@example.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  value={applicationData.contactPhone}
                  onChange={(e) => setApplicationData(prev => ({...prev, contactPhone: e.target.value}))}
                  placeholder="(555) 123-4567"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="companyType">Entity Type</Label>
                <Select value={applicationData.companyType} onValueChange={(value) => 
                  setApplicationData(prev => ({...prev, companyType: value}))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select entity type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="investment-advisor">Registered Investment Advisor</SelectItem>
                    <SelectItem value="private-fund">Private Fund Manager</SelectItem>
                    <SelectItem value="broker-dealer">Broker-Dealer</SelectItem>
                    <SelectItem value="family-office">Family Office</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Document Upload</h3>
              <p className="text-muted-foreground mb-6">
                Upload required regulatory and marketing documents for compliance review.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { key: 'formADV', label: 'Form ADV', required: true, description: 'SEC Form ADV or equivalent regulatory filing' },
                { key: 'ppm', label: 'PPM/Offering Memorandum', required: true, description: 'Private Placement Memorandum or similar offering document' },
                { key: 'compliancePolicies', label: 'Compliance Policies', required: false, description: 'Internal compliance and risk management policies' },
                { key: 'marketingMaterials', label: 'Marketing Materials', required: false, description: 'Sample pitch decks, fact sheets, or marketing content' }
              ].map((doc) => (
                <Card key={doc.key} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{doc.label}</h4>
                      {doc.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{doc.description}</p>
                    
                    {applicationData.documents[doc.key as keyof ApplicationData['documents']] ? (
                      <div className="flex items-center gap-2 p-2 bg-success/10 rounded-md">
                        <Check className="w-4 h-4 text-success" />
                        <span className="text-sm text-success">
                          {applicationData.documents[doc.key as keyof ApplicationData['documents']]?.name}
                        </span>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-muted rounded-lg p-4 text-center">
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">Drag and drop or click to upload</p>
                        <input
                          type="file"
                          className="hidden"
                          id={`upload-${doc.key}`}
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleFileUpload(doc.key as keyof ApplicationData['documents'], file);
                            }
                          }}
                        />
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => document.getElementById(`upload-${doc.key}`)?.click()}
                        >
                          Choose File
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Choose Placement Tier</h3>
              <p className="text-muted-foreground mb-6">
                Select your preferred marketplace placement level. You can upgrade or downgrade at any time.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {placementTiers.map((tier) => (
                <Card 
                  key={tier.id}
                  className={`relative cursor-pointer transition-all duration-300 ${
                    applicationData.selectedTier === tier.id 
                      ? 'ring-2 ring-gold-premium shadow-lg' 
                      : 'hover:shadow-md'
                  } ${tier.popular ? 'border-gold-premium' : ''}`}
                  onClick={() => setApplicationData(prev => ({...prev, selectedTier: tier.id as any}))}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gold-premium text-primary">Most Popular</Badge>
                    </div>
                  )}
                  
                  <CardContent className="p-6 text-center">
                    <h4 className="text-xl font-bold mb-2">{tier.name}</h4>
                    <div className="text-2xl font-bold text-gold-dark mb-4">{tier.price}</div>
                    
                    <ul className="space-y-2 text-sm text-left">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {applicationData.selectedTier === tier.id && (
                      <div className="mt-4 flex items-center justify-center gap-2 text-gold-dark">
                        <Check className="w-5 h-5" />
                        <span className="font-semibold">Selected</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Compliance Attestation</h3>
              <p className="text-muted-foreground mb-6">
                Please review and confirm the following attestations required for marketplace participation.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  key: 'accurateInfo',
                  label: 'Information Accuracy',
                  description: 'All information provided in this application is true, complete, and accurate to the best of my knowledge.'
                },
                {
                  key: 'regulatoryCompliance',
                  label: 'Regulatory Compliance',
                  description: 'Our firm is in good standing with all applicable regulatory authorities and has no material regulatory violations.'
                },
                {
                  key: 'conflictDisclosure',
                  label: 'Conflict of Interest Disclosure',
                  description: 'We understand and agree to disclose all material conflicts of interest to prospective investors.'
                },
                {
                  key: 'feeDisclosure',
                  label: 'Fee Transparency',
                  description: 'We commit to providing clear and complete fee disclosure to all prospective investors.'
                },
                {
                  key: 'termsAccepted',
                  label: 'Terms and Conditions',
                  description: 'I have read and agree to the Family Office Marketplace Partner Terms and Conditions.'
                }
              ].map((attestation) => (
                <Card key={attestation.key} className="p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id={attestation.key}
                      checked={applicationData.complianceAttestations[attestation.key as keyof ApplicationData['complianceAttestations']]}
                      onCheckedChange={(checked) => 
                        setApplicationData(prev => ({
                          ...prev,
                          complianceAttestations: {
                            ...prev.complianceAttestations,
                            [attestation.key]: checked
                          }
                        }))
                      }
                    />
                    <div className="space-y-1">
                      <label htmlFor={attestation.key} className="font-medium cursor-pointer">
                        {attestation.label}
                      </label>
                      <p className="text-sm text-muted-foreground">
                        {attestation.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-warning">Important Notice</h4>
                  <p className="text-sm text-warning/90 mt-1">
                    False attestations may result in marketplace suspension, regulatory referral, and legal action. 
                    All applications undergo thorough compliance review.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="text-center space-y-6 py-8">
            <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-success" />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-4">Application Submitted Successfully!</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Thank you for your interest in joining the Family Office Marketplace. Our compliance team 
                will review your application and contact you within 2 business days.
              </p>
            </div>

            <div className="bg-secondary/50 rounded-lg p-6 max-w-md mx-auto">
              <h4 className="font-semibold mb-2">What happens next?</h4>
              <ul className="text-sm text-muted-foreground space-y-1 text-left">
                <li>• Compliance review (1-2 business days)</li>
                <li>• Reference and background checks</li>
                <li>• Partnership agreement execution</li>
                <li>• Marketplace onboarding and training</li>
              </ul>
            </div>

            <Button 
              onClick={onClose}
              className="bg-gold-premium text-primary hover:bg-gold-dark"
            >
              Close
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Apply to Become a Partner</DialogTitle>
        </DialogHeader>

        {currentStep < 5 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Step {currentStep} of {totalSteps - 1}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <div className="min-h-[400px]">
          {renderStep()}
        </div>

        {currentStep < 5 && (
          <div className="flex justify-between pt-6 border-t">
            <Button 
              variant="outline" 
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              Back
            </Button>
            
            <Button 
              onClick={handleNext}
              disabled={!validateCurrentStep() || isSubmitting}
              className="bg-gold-premium text-primary hover:bg-gold-dark"
            >
              {isSubmitting ? 'Submitting...' : currentStep === 4 ? 'Submit Application' : 'Next'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};