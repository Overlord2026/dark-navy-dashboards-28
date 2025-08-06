import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Upload, 
  FileText, 
  User, 
  Calendar,
  Lock,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface AdvisorSensitiveDataFlowProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
  reason: 'account_opening' | 'formal_advice' | 'compliance_required';
  clientData?: any;
}

export const AdvisorSensitiveDataFlow: React.FC<AdvisorSensitiveDataFlowProps> = ({
  onComplete,
  onCancel,
  reason,
  clientData = {}
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    ssn: '',
    dateOfBirth: '',
    idDocument: null,
    addressVerification: null,
    employmentInfo: '',
    incomeInfo: '',
    netWorth: '',
    investmentExperience: '',
    riskTolerance: ''
  });

  const getReasonText = () => {
    switch (reason) {
      case 'account_opening':
        return 'To open an investment account, we need additional information for compliance purposes.';
      case 'formal_advice':
        return 'To provide formal financial advice, we must complete your profile with regulatory required information.';
      case 'compliance_required':
        return 'Additional information is required to meet regulatory compliance standards.';
      default:
        return 'Additional information is required to proceed.';
    }
  };

  const steps = [
    {
      id: 'explanation',
      title: 'Why We Need This Information',
      icon: Shield,
      component: ExplanationStep
    },
    {
      id: 'identity',
      title: 'Identity Verification',
      icon: User,
      component: IdentityStep
    },
    {
      id: 'financial',
      title: 'Financial Profile',
      icon: FileText,
      component: FinancialStep
    },
    {
      id: 'documents',
      title: 'Document Upload',
      icon: Upload,
      component: DocumentStep
    },
    {
      id: 'review',
      title: 'Review & Submit',
      icon: CheckCircle,
      component: ReviewStep
    }
  ];

  const currentStepData = steps[currentStep];
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/5">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Advisor-Verified Information</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {getReasonText()}
          </p>
        </div>

        {/* Progress */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Step {currentStep + 1} of {steps.length}</span>
              <Badge variant="secondary">{Math.round(progressPercentage)}% Complete</Badge>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex justify-between mt-4 text-xs text-muted-foreground">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div key={step.id} className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                      index <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <span className="text-center max-w-16">{step.title}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Current Step Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <currentStepData.component
              formData={formData}
              setFormData={setFormData}
              reason={reason}
              clientData={clientData}
            />
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex items-center gap-2"
            >
              Cancel
            </Button>
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
            )}
          </div>

          <Button
            onClick={handleNext}
            className="flex items-center gap-2"
          >
            {currentStep === steps.length - 1 ? 'Submit for Review' : 'Continue'}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Step Components
interface StepProps {
  formData?: any;
  setFormData?: any;
  reason?: string;
  clientData?: any;
}

const ExplanationStep = ({ reason }: StepProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center space-y-6"
  >
    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
      <Lock className="w-8 h-8 text-blue-600" />
    </div>
    
    <div>
      <h3 className="text-xl font-semibold mb-3">Regulatory Compliance Required</h3>
      <p className="text-muted-foreground mb-6">
        As a registered advisor, we're required to collect additional information to ensure 
        we can serve you properly and meet all regulatory requirements.
      </p>
    </div>

    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="p-4">
        <h4 className="font-medium text-blue-900 mb-2">What We Collect & Why:</h4>
        <ul className="text-sm text-blue-800 space-y-1 text-left">
          <li>• <strong>Identity verification:</strong> Required by law for all advisory relationships</li>
          <li>• <strong>Financial profile:</strong> Ensures suitable investment recommendations</li>
          <li>• <strong>Documents:</strong> Validates information and meets record-keeping requirements</li>
        </ul>
      </CardContent>
    </Card>

    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
      <Shield className="w-4 h-4 text-green-600" />
      <span>Your information is encrypted and securely stored</span>
    </div>
  </motion.div>
);

const IdentityStep = ({ formData, setFormData }: StepProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-6"
  >
    <div className="text-center mb-6">
      <h3 className="text-xl font-semibold mb-2">Identity Verification</h3>
      <p className="text-muted-foreground">
        This information is required for regulatory compliance and identity verification.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Label htmlFor="ssn">Social Security Number *</Label>
        <Input
          id="ssn"
          type="password"
          value={formData.ssn}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, ssn: e.target.value }))}
          placeholder="XXX-XX-XXXX"
          maxLength={11}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Required for tax reporting and compliance
        </p>
      </div>

      <div>
        <Label htmlFor="dob">Date of Birth *</Label>
        <Input
          id="dob"
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, dateOfBirth: e.target.value }))}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Must match government-issued ID
        </p>
      </div>
    </div>

    <Card className="bg-amber-50 border-amber-200">
      <CardContent className="p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
        <div>
          <p className="text-sm text-amber-800">
            <strong>Privacy Notice:</strong> This information is used solely for regulatory compliance 
            and is protected with bank-level encryption. We never share personal data with third parties 
            for marketing purposes.
          </p>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const FinancialStep = ({ formData, setFormData }: StepProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-6"
  >
    <div className="text-center mb-6">
      <h3 className="text-xl font-semibold mb-2">Financial Profile</h3>
      <p className="text-muted-foreground">
        Help us understand your financial situation to provide suitable recommendations.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Label htmlFor="employment">Employment Status</Label>
        <Input
          id="employment"
          value={formData.employmentInfo}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, employmentInfo: e.target.value }))}
          placeholder="e.g., Employed, Retired, Self-employed"
        />
      </div>

      <div>
        <Label htmlFor="income">Annual Income Range</Label>
        <select
          className="w-full p-2 border rounded-md"
          value={formData.incomeInfo}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, incomeInfo: e.target.value }))}
        >
          <option value="">Select income range</option>
          <option value="<50k">Less than $50,000</option>
          <option value="50k-100k">$50,000 - $100,000</option>
          <option value="100k-250k">$100,000 - $250,000</option>
          <option value="250k-500k">$250,000 - $500,000</option>
          <option value="500k+">Over $500,000</option>
        </select>
      </div>

      <div>
        <Label htmlFor="networth">Net Worth Range</Label>
        <select
          className="w-full p-2 border rounded-md"
          value={formData.netWorth}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, netWorth: e.target.value }))}
        >
          <option value="">Select net worth range</option>
          <option value="<100k">Less than $100,000</option>
          <option value="100k-500k">$100,000 - $500,000</option>
          <option value="500k-1m">$500,000 - $1 Million</option>
          <option value="1m-5m">$1 Million - $5 Million</option>
          <option value="5m+">Over $5 Million</option>
        </select>
      </div>

      <div>
        <Label htmlFor="experience">Investment Experience</Label>
        <select
          className="w-full p-2 border rounded-md"
          value={formData.investmentExperience}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, investmentExperience: e.target.value }))}
        >
          <option value="">Select experience level</option>
          <option value="beginner">Beginner (0-2 years)</option>
          <option value="intermediate">Intermediate (3-10 years)</option>
          <option value="experienced">Experienced (10+ years)</option>
          <option value="professional">Professional investor</option>
        </select>
      </div>
    </div>
  </motion.div>
);

const DocumentStep = ({ formData, setFormData }: StepProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-6"
  >
    <div className="text-center mb-6">
      <h3 className="text-xl font-semibold mb-2">Document Upload</h3>
      <p className="text-muted-foreground">
        Upload required documents for identity and address verification.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="border-dashed border-2 border-muted-foreground/25 hover:border-primary/50 transition-colors">
        <CardContent className="p-6 text-center">
          <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <h4 className="font-medium mb-2">Government-issued ID</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Driver's license, passport, or state ID
          </p>
          <Button variant="outline" size="sm">
            Upload Document
          </Button>
        </CardContent>
      </Card>

      <Card className="border-dashed border-2 border-muted-foreground/25 hover:border-primary/50 transition-colors">
        <CardContent className="p-6 text-center">
          <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <h4 className="font-medium mb-2">Address Verification</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Utility bill, bank statement, or lease
          </p>
          <Button variant="outline" size="sm">
            Upload Document
          </Button>
        </CardContent>
      </Card>
    </div>

    <Card className="bg-green-50 border-green-200">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-green-900 mb-1">Secure Document Handling</h4>
            <p className="text-sm text-green-800">
              All documents are encrypted during upload and storage. We use them only for 
              verification purposes and regulatory compliance.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const ReviewStep = ({ formData }: StepProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-6"
  >
    <div className="text-center mb-6">
      <h3 className="text-xl font-semibold mb-2">Review & Submit</h3>
      <p className="text-muted-foreground">
        Please review your information before submitting for advisor verification.
      </p>
    </div>

    <Card>
      <CardContent className="p-6">
        <h4 className="font-medium mb-4">Information Summary</h4>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Identity Information:</span>
            <span>✓ Provided</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Financial Profile:</span>
            <span>✓ Complete</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Documents:</span>
            <span>✓ Uploaded</span>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="p-4">
        <h4 className="font-medium text-blue-900 mb-2">What Happens Next?</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Your advisor will review the information within 24 hours</li>
          <li>• You'll receive email confirmation once approved</li>
          <li>• Premium features will be unlocked in your account</li>
          <li>• Your advisor will schedule a follow-up call to discuss next steps</li>
        </ul>
      </CardContent>
    </Card>
  </motion.div>
);