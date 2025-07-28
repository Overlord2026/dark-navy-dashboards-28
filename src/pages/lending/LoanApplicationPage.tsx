import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Upload, CheckCircle, AlertCircle, DollarSign, Calendar, FileText } from 'lucide-react';
import { LendingFileUploadService } from '@/services/lending/lendingFileUpload';
import { supabase } from '@/integrations/supabase/client';

interface LoanApplication {
  loanType: string;
  requestedAmount: number;
  purpose: string;
  income: number;
  employment: string;
  creditScore?: number;
  downPayment?: number;
  propertyValue?: number;
}

interface EligibilityResult {
  eligible: boolean;
  confidence: number;
  estimatedRate?: number;
  monthlyPayment?: number;
  factors: string[];
  recommendations: string[];
}

const LOAN_TYPES = [
  'Personal Loan',
  'Home Mortgage',
  'Auto Loan',
  'Business Loan',
  'Home Equity',
  'Student Loan'
];

const REQUIRED_DOCUMENTS = {
  'Personal Loan': ['income_statement', 'bank_statement', 'id_document'],
  'Home Mortgage': ['income_statement', 'bank_statement', 'tax_return', 'employment_verification', 'asset_verification'],
  'Auto Loan': ['income_statement', 'id_document', 'employment_verification'],
  'Business Loan': ['business_license', 'financial_statement', 'tax_return', 'bank_statement'],
  'Home Equity': ['income_statement', 'asset_verification', 'tax_return'],
  'Student Loan': ['income_statement', 'employment_verification', 'id_document']
};

export const LoanApplicationPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [application, setApplication] = useState<LoanApplication>({
    loanType: '',
    requestedAmount: 0,
    purpose: '',
    income: 0,
    employment: ''
  });
  const [eligibility, setEligibility] = useState<EligibilityResult | null>(null);
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loanId, setLoanId] = useState<string>('');

  useEffect(() => {
    // Generate temporary loan ID for document uploads
    setLoanId(`temp_${Date.now()}`);
  }, []);

  const handleInputChange = (field: keyof LoanApplication, value: any) => {
    setApplication(prev => ({ ...prev, [field]: value }));
  };

  const checkEligibility = async () => {
    try {
      // Stub eligibility check - replace with real API call
      const mockEligibility: EligibilityResult = {
        eligible: application.income > application.requestedAmount * 0.2,
        confidence: Math.random() * 0.4 + 0.6,
        estimatedRate: 4.5 + Math.random() * 3,
        monthlyPayment: (application.requestedAmount * 0.05) / 12,
        factors: [
          application.income > 50000 ? 'Strong income' : 'Income verification needed',
          'Credit check pending',
          'Debt-to-income ratio acceptable'
        ],
        recommendations: [
          'Consider a co-signer for better rates',
          'Provide additional income documentation',
          'Review loan amount vs. monthly budget'
        ]
      };

      setEligibility(mockEligibility);
      
      if (mockEligibility.eligible) {
        toast.success('Pre-qualified! Continue with your application.');
        setStep(2);
      } else {
        toast.error('Pre-qualification needs review. Please adjust your application.');
      }
    } catch (error) {
      toast.error('Eligibility check failed. Please try again.');
    }
  };

  const handleDocumentUpload = async (file: File, docType: string) => {
    try {
      const result = await LendingFileUploadService.uploadLoanDocument(file, {
        documentType: docType,
        loanId: loanId
      });

      if (result.success) {
        setUploadedDocs(prev => [...prev, docType]);
        toast.success(`${docType.replace('_', ' ')} uploaded successfully`);
      } else {
        toast.error(result.error || 'Upload failed');
      }
    } catch (error) {
      toast.error('Upload failed. Please try again.');
    }
  };

  const submitApplication = async () => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Create loan application record
      const { data: loanData, error } = await supabase
        .from('loan_requests')
        .insert({
          user_id: user.id,
          loan_type: application.loanType,
          requested_amount: application.requestedAmount,
          purpose: application.purpose,
          status: 'pending_review',
          application_data: {
            income: application.income,
            employment: application.employment,
            creditScore: application.creditScore,
            downPayment: application.downPayment,
            propertyValue: application.propertyValue
          } as any,
          eligibility_result: eligibility as any,
          compliance_status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      // Update document records with actual loan ID
      await supabase
        .from('loan_documents')
        .update({ loan_id: loanData.id })
        .eq('loan_id', loanId);

      toast.success('Loan application submitted successfully!');
      navigate(`/lending/status/${loanData.id}`);
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const requiredDocs = REQUIRED_DOCUMENTS[application.loanType as keyof typeof REQUIRED_DOCUMENTS] || [];
  const completedDocs = requiredDocs.filter(doc => uploadedDocs.includes(doc));
  const progress = (step - 1) * 33 + (step === 2 ? (completedDocs.length / requiredDocs.length) * 33 : 0);

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Loan Application</h1>
        <p className="text-muted-foreground mb-4">
          Complete your loan application in 3 simple steps
        </p>
        <Progress value={progress} className="w-full" />
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          <span className={step >= 1 ? 'text-primary font-medium' : ''}>1. Application Details</span>
          <span className={step >= 2 ? 'text-primary font-medium' : ''}>2. Document Upload</span>
          <span className={step >= 3 ? 'text-primary font-medium' : ''}>3. Review & Submit</span>
        </div>
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Loan Application Details
            </CardTitle>
            <CardDescription>
              Tell us about your loan needs and financial situation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="loanType">Loan Type</Label>
                <Select onValueChange={(value) => handleInputChange('loanType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select loan type" />
                  </SelectTrigger>
                  <SelectContent>
                    {LOAN_TYPES.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="requestedAmount">Requested Amount ($)</Label>
                <Input
                  id="requestedAmount"
                  type="number"
                  value={application.requestedAmount || ''}
                  onChange={(e) => handleInputChange('requestedAmount', parseFloat(e.target.value))}
                  placeholder="Enter loan amount"
                />
              </div>

              <div>
                <Label htmlFor="income">Annual Income ($)</Label>
                <Input
                  id="income"
                  type="number"
                  value={application.income || ''}
                  onChange={(e) => handleInputChange('income', parseFloat(e.target.value))}
                  placeholder="Enter annual income"
                />
              </div>

              <div>
                <Label htmlFor="employment">Employment Status</Label>
                <Select onValueChange={(value) => handleInputChange('employment', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full_time">Full Time</SelectItem>
                    <SelectItem value="part_time">Part Time</SelectItem>
                    <SelectItem value="self_employed">Self Employed</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                    <SelectItem value="unemployed">Unemployed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="purpose">Loan Purpose</Label>
              <Textarea
                id="purpose"
                value={application.purpose}
                onChange={(e) => handleInputChange('purpose', e.target.value)}
                placeholder="Describe how you plan to use this loan"
                rows={3}
              />
            </div>

            {eligibility && (
              <Card className={`border-2 ${eligibility.eligible ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {eligibility.eligible ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                    )}
                    Eligibility Check Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Status</p>
                      <Badge variant={eligibility.eligible ? 'default' : 'secondary'}>
                        {eligibility.eligible ? 'Pre-Qualified' : 'Needs Review'}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">
                        Confidence: {Math.round(eligibility.confidence * 100)}%
                      </p>
                    </div>
                    {eligibility.estimatedRate && (
                      <div>
                        <p className="text-sm font-medium mb-2">Estimated Rate</p>
                        <p className="text-lg font-bold">{eligibility.estimatedRate.toFixed(2)}% APR</p>
                        <p className="text-sm text-muted-foreground">
                          ~${eligibility.monthlyPayment?.toFixed(0)}/month
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Key Factors</p>
                    <ul className="text-sm space-y-1">
                      {eligibility.factors.map((factor, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-current rounded-full" />
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-4">
              <Button 
                onClick={checkEligibility}
                disabled={!application.loanType || !application.requestedAmount || !application.income}
                className="flex-1"
              >
                Check Eligibility
              </Button>
              {eligibility?.eligible && (
                <Button onClick={() => setStep(2)} className="flex-1">
                  Continue to Documents
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Required Documents
            </CardTitle>
            <CardDescription>
              Upload the required documents for your {application.loanType}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {requiredDocs.map(docType => (
                <div key={docType} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {uploadedDocs.includes(docType) ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Upload className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div>
                      <p className="font-medium">
                        {docType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        PDF, Word, or Image files up to 10MB
                      </p>
                    </div>
                  </div>
                  <div>
                    {uploadedDocs.includes(docType) ? (
                      <Badge variant="default">Uploaded</Badge>
                    ) : (
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleDocumentUpload(file, docType);
                        }}
                        className="w-32"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Upload Progress</h4>
              <Progress value={(completedDocs.length / requiredDocs.length) * 100} />
              <p className="text-sm text-muted-foreground mt-2">
                {completedDocs.length} of {requiredDocs.length} documents uploaded
              </p>
            </div>

            <div className="flex gap-4 mt-6">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button 
                onClick={() => setStep(3)}
                disabled={completedDocs.length < requiredDocs.length}
                className="flex-1"
              >
                Review Application
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Review & Submit
            </CardTitle>
            <CardDescription>
              Review your application details before submitting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Loan Details</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Type:</span> {application.loanType}</p>
                    <p><span className="font-medium">Amount:</span> ${application.requestedAmount.toLocaleString()}</p>
                    <p><span className="font-medium">Purpose:</span> {application.purpose}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Financial Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Income:</span> ${application.income.toLocaleString()}</p>
                    <p><span className="font-medium">Employment:</span> {application.employment.replace('_', ' ')}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Documents Submitted</h4>
                <div className="flex flex-wrap gap-2">
                  {uploadedDocs.map(doc => (
                    <Badge key={doc} variant="secondary">
                      {doc.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Next Steps</h4>
                <ul className="text-sm space-y-1">
                  <li>• Your application will be reviewed within 24-48 hours</li>
                  <li>• You'll receive real-time updates on your application status</li>
                  <li>• Our team may request additional documentation</li>
                  <li>• Approved applications will be matched with suitable lenders</li>
                </ul>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back to Documents
                </Button>
                <Button 
                  onClick={submitApplication}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};