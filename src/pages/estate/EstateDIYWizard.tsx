import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Crown, FileText, Shield, CheckCircle2 } from 'lucide-react';
import { renderEstatePdf } from '@/lib/report/estatePdf';
import { useEstateRules } from '@/features/estate/states/estateRules';
import { recordReceipt } from '@/features/receipts/record';
import { toast } from 'sonner';
import analytics from '@/lib/analytics';

const EstateDIYWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    clientName: '',
    spouseName: '',
    state: 'CA',
    hasTrust: false,
    children: [] as any[],
    executor: '',
    trustee: '',
    witnesses: [] as any[],
    guardians: [] as any[]
  });
  const [selectedDocs, setSelectedDocs] = useState<string[]>(['will']);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [documentsGenerated, setDocumentsGenerated] = useState(false);

  const estateRules = useEstateRules(formData.state) as any;
  const totalSteps = 6;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDocumentToggle = (docType: string) => {
    setSelectedDocs(prev => 
      prev.includes(docType) 
        ? prev.filter(d => d !== docType)
        : [...prev, docType]
    );
  };

  const handlePayment = async () => {
    try {
      // Mock payment processing
      analytics.track('estate.diy.payment.attempt', { 
        selectedDocs, 
        state: formData.state,
        amount: selectedDocs.length * 199
      });
      
      // Simulate payment delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPaymentComplete(true);
      analytics.track('estate.diy.payment.success', { selectedDocs });
      toast.success('Payment processed successfully');
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    }
  };

  const handleGenerateDocuments = async () => {
    try {
      const tokens = {
        client_full_name: formData.clientName,
        spouse_name: formData.spouseName,
        state_code: formData.state,
        executor_name: formData.executor,
        trustee_name: formData.trustee,
        trust_name: `${formData.clientName} Revocable Living Trust`,
        grantor_name: formData.clientName,
        principal_name: formData.clientName,
        agent_name: formData.spouseName || formData.executor,
        execution_date: new Date().toLocaleDateString(),
        witnesses: String(estateRules.will.witnesses),
        notary_required: String(estateRules.will.notary),
        community_property: String(estateRules.communityProperty || false)
      };

      // Generate each selected document
      for (const docType of selectedDocs) {
        const pdfBytes = await renderEstatePdf(
          docType as 'Will' | 'RLT' | 'POA',
          tokens,
          estateRules
        );
        
        // Mock saving to Vault
        console.log(`Generated ${docType} PDF:`, pdfBytes.length, 'bytes');
      }

      // Record receipt for document assembly
      await recordReceipt({
        type: 'Decision-RDS',
        action: 'estate.doc.assemble',
        reasons: ['DIY_PREMIUM'],
        inputs_hash: `sha256:diy_${Date.now()}`,
        created_at: new Date().toISOString()
      } as any);

      setDocumentsGenerated(true);
      analytics.track('estate.diy.documents.generated', { 
        docs: selectedDocs,
        state: formData.state
      });
      toast.success('Estate documents generated successfully');
    } catch (error) {
      toast.error('Failed to generate documents');
    }
  };

  const handleRequestAttorneyReview = async () => {
    try {
      await recordReceipt({
        type: 'Comms-RDS',
        template_id: 'attorney.review.request',
        result: 'sent',
        created_at: new Date().toISOString()
      } as any);
      
      analytics.track('estate.diy.attorney.review.request', { state: formData.state });
      toast.success('Attorney review request submitted');
    } catch (error) {
      toast.error('Failed to request attorney review');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Crown className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-2">Household Information</h2>
              <p className="text-muted-foreground">Tell us about your family</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="clientName">Your Full Legal Name</Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => setFormData(prev => ({...prev, clientName: e.target.value}))}
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <Label htmlFor="spouseName">Spouse/Partner Name (Optional)</Label>
                <Input
                  id="spouseName"
                  value={formData.spouseName}
                  onChange={(e) => setFormData(prev => ({...prev, spouseName: e.target.value}))}
                  placeholder="Jane Doe"
                />
              </div>
              
              <div>
                <Label htmlFor="state">State of Residence</Label>
                <Select 
                  value={formData.state} 
                  onValueChange={(value) => setFormData(prev => ({...prev, state: value}))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CA">California</SelectItem>
                    <SelectItem value="TX">Texas</SelectItem>
                    <SelectItem value="FL">Florida</SelectItem>
                    <SelectItem value="NY">New York</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-2">Trust Setup</h2>
              <p className="text-muted-foreground">Configure your revocable living trust</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasTrust"
                  checked={formData.hasTrust}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({...prev, hasTrust: !!checked}))
                  }
                />
                <Label htmlFor="hasTrust">Create a Revocable Living Trust</Label>
              </div>
              
              {formData.hasTrust && (
                <>
                  <div>
                    <Label htmlFor="trustee">Successor Trustee</Label>
                    <Input
                      id="trustee"
                      value={formData.trustee}
                      onChange={(e) => setFormData(prev => ({...prev, trustee: e.target.value}))}
                      placeholder="Who will manage the trust after you?"
                    />
                  </div>
                  
                  {estateRules.rlt.spousalConsents && formData.spouseName && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-yellow-800">Spousal Consent Required</p>
                          <p className="text-sm text-yellow-700">
                            {formData.state} requires spousal consent for trust creation.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-2">Document Selection</h2>
              <p className="text-muted-foreground">Choose your estate planning documents</p>
            </div>
            
            <div className="space-y-4">
              {[
                { id: 'will', name: 'Last Will & Testament', required: true, price: 199 },
                { id: 'rlt', name: 'Revocable Living Trust', required: false, price: 299 },
                { id: 'poa', name: 'Financial Power of Attorney', required: false, price: 149 },
                { id: 'pourover', name: 'Pour-Over Will', required: false, price: 99 }
              ].map(doc => (
                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={selectedDocs.includes(doc.id)}
                      onCheckedChange={() => handleDocumentToggle(doc.id)}
                      disabled={doc.required}
                    />
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      {doc.required && (
                        <p className="text-xs text-muted-foreground">Required</p>
                      )}
                    </div>
                  </div>
                  <p className="font-medium">${doc.price}</p>
                </div>
              ))}
              
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-medium">State Requirements ({formData.state})</h3>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                  <li>• Will: {estateRules.will.witnesses} witnesses, {estateRules.will.notary ? 'notarization required' : 'no notarization'}</li>
                  <li>• Trust: {estateRules.rlt.notary ? 'notarization required' : 'no notarization'}</li>
                  <li>• POA: {estateRules.poa.notary ? 'notarization required' : 'witnesses required'}</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-2">Review & Payment</h2>
              <p className="text-muted-foreground">Confirm your selections and complete payment</p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedDocs.map(docId => {
                  const docNames = {
                    will: 'Last Will & Testament',
                    rlt: 'Revocable Living Trust',
                    poa: 'Financial Power of Attorney',
                    pourover: 'Pour-Over Will'
                  };
                  const prices = { will: 199, rlt: 299, poa: 149, pourover: 99 };
                  return (
                    <div key={docId} className="flex justify-between">
                      <span>{docNames[docId as keyof typeof docNames]}</span>
                      <span>${prices[docId as keyof typeof prices]}</span>
                    </div>
                  );
                })}
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${selectedDocs.reduce((sum, docId) => {
                      const prices = { will: 199, rlt: 299, poa: 149, pourover: 99 };
                      return sum + prices[docId as keyof typeof prices];
                    }, 0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Important Disclaimers</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• This service provides document preparation support, not legal advice</li>
                <li>• Documents are state-compliant but may require attorney review</li>
                <li>• Execution requirements vary by state - follow provided guidance</li>
                <li>• Consider professional legal counsel for complex estates</li>
              </ul>
            </div>
            
            {!paymentComplete && (
              <Button onClick={handlePayment} className="w-full" size="lg">
                Complete Payment
              </Button>
            )}
            
            {paymentComplete && !documentsGenerated && (
              <Button onClick={handleGenerateDocuments} className="w-full" size="lg">
                Generate Documents
              </Button>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <h2 className="text-2xl font-bold mb-2">Documents Ready</h2>
              <p className="text-muted-foreground">Your estate planning documents have been generated</p>
            </div>
            
            {documentsGenerated && (
              <Card>
                <CardHeader>
                  <CardTitle>Generated Documents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedDocs.map(docId => {
                    const docNames = {
                      will: 'Last Will & Testament',
                      rlt: 'Revocable Living Trust',
                      poa: 'Financial Power of Attorney',
                      pourover: 'Pour-Over Will'
                    };
                    return (
                      <div key={docId} className="flex items-center justify-between p-3 border rounded-lg">
                        <span>{docNames[docId as keyof typeof docNames]}</span>
                        <Button variant="outline" size="sm">
                          Download PDF
                        </Button>
                      </div>
                    );
                  })}
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                    <span>Execution Checklist ({formData.state})</span>
                    <Button variant="outline" size="sm">
                      Download PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Crown className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-2">Attorney Review</h2>
              <p className="text-muted-foreground">Optional professional review of your estate plan</p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Professional Review Available</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Connect with licensed estate planning attorneys in {formData.state} for:
                </p>
                
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>Document review and validation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>State-specific compliance verification</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>Execution guidance and coordination</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>Ongoing estate plan maintenance</span>
                  </li>
                </ul>
                
                <Button onClick={handleRequestAttorneyReview} className="w-full">
                  Request Attorney Review
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">DIY Premium Estate Planning</h1>
            <span className="text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        <Card>
          <CardContent className="p-8">
            {renderStep()}
            
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button 
                variant="outline" 
                onClick={handleBack} 
                disabled={currentStep === 1}
              >
                Back
              </Button>
              
              {currentStep < totalSteps && (
                <Button 
                  onClick={handleNext}
                  disabled={
                    (currentStep === 1 && !formData.clientName) ||
                    (currentStep === 4 && !paymentComplete) ||
                    (currentStep === 5 && !documentsGenerated)
                  }
                >
                  {currentStep === 4 && paymentComplete && !documentsGenerated ? 'Generate Documents' :
                   currentStep === totalSteps ? 'Complete' : 'Next'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EstateDIYWizard;