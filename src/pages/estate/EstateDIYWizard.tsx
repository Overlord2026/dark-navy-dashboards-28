import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Crown, FileText, Shield, CheckCircle2, Users, Scale, Stamp } from 'lucide-react';
import { renderEstatePdf } from '@/lib/report/estatePdf';
import { useEstateRules } from '@/features/estate/states/estateRules';
import { recordReceipt } from '@/features/receipts/record';
import { getRonRule } from '@/features/notary/states/ronRules';
import ronConfig from '@/config/estate/ron_config.json';
import { toast } from 'sonner';
import analytics from '@/lib/analytics';

const EstateDIYWizard = () => {
  const [showIntro, setShowIntro] = useState(true);
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
      // Simulate document generation
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Emit ProofSlip for audit trail
      const proofSlipData = {
        event: 'estate.plan.created',
        timestamp: new Date().toISOString(),
        state: formData.state,
        documents: selectedDocs,
        clientName: formData.clientName,
        ron_available: ronAvailable,
        hash: `sha256:estate_${Date.now()}`
      };

      console.log('ProofSlip emitted:', proofSlipData);
      
      // Record receipt for audit
      await recordReceipt({
        type: 'Estate-RDS',
        action: 'estate.doc.assemble',
        reasons: ['DIY_PREMIUM'],
        inputs_hash: proofSlipData.hash,
        created_at: new Date().toISOString()
      } as any);

      setDocumentsGenerated(true);
      analytics.track('estate.diy.documents.generated', { 
        docs: selectedDocs,
        state: formData.state,
        proof_slip: proofSlipData.hash
      });
      toast.success('Estate documents generated successfully');
      toast.info(`ProofSlip: ${proofSlipData.hash.slice(-8)}`);
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

  const ronRule = getRonRule(formData.state);
  const ronAvailable = ronRule.allowed;
  const ronProvider = ronConfig.providers[ronConfig.defaultProvider as keyof typeof ronConfig.providers];

  const renderIntro = () => {
    return (
      <Card className="bg-gradient-to-br from-bfo-navy to-bfo-black border-bfo-gold/20">
        <CardHeader>
          <CardTitle className="text-3xl text-white flex items-center gap-3">
            <Crown className="h-8 w-8 text-bfo-gold" />
            Estate Planning DIY Suite
          </CardTitle>
          <p className="text-white/70 text-lg mt-2">
            Complete your estate plan in 3 simple steps with professional-grade documents
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Three Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white/5 rounded-lg border border-bfo-gold/20">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-bfo-gold" />
                <h3 className="font-semibold text-white">1. Connect</h3>
              </div>
              <p className="text-white/60 text-sm">
                Provide your information and family details
              </p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg border border-bfo-gold/20">
              <div className="flex items-center gap-2 mb-2">
                <Scale className="h-5 w-5 text-bfo-gold" />
                <h3 className="font-semibold text-white">2. Model Choices</h3>
              </div>
              <p className="text-white/60 text-sm">
                Select documents and customize your estate plan
              </p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg border border-bfo-gold/20">
              <div className="flex items-center gap-2 mb-2">
                <Stamp className="h-5 w-5 text-bfo-gold" />
                <h3 className="font-semibold text-white">3. Sign & Store</h3>
              </div>
              <p className="text-white/60 text-sm">
                Remote notarization (where available) or in-person signing
              </p>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 pt-4">
            <Button 
              size="lg"
              className="bg-bfo-gold text-bfo-black hover:bg-bfo-gold/90"
              onClick={() => setShowIntro(false)}
            >
              Start Your Estate Plan
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-bfo-gold text-bfo-gold hover:bg-bfo-gold/10"
              onClick={() => toast.info('Advisor invitation feature coming soon')}
            >
              <Users className="h-4 w-4 mr-2" />
              Invite Advisor
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-bfo-gold text-bfo-gold hover:bg-bfo-gold/10"
              onClick={() => toast.info('Attorney invitation feature coming soon')}
            >
              <Scale className="h-4 w-4 mr-2" />
              Invite Attorney
            </Button>
          </div>

          {/* Info banner */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-white/80 text-sm">
            <Shield className="h-4 w-4 inline mr-2 text-blue-400" />
            All documents are state-compliant and include audit-ready ProofSlips for verification
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Crown className="h-12 w-12 mx-auto mb-4 text-bfo-gold" />
              <h2 className="text-2xl font-bold mb-2 text-white">Household Information</h2>
              <p className="text-white/70">Tell us about your family</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="clientName" className="text-white">Your Full Legal Name</Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => setFormData(prev => ({...prev, clientName: e.target.value}))}
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <Label htmlFor="spouseName" className="text-white">Spouse/Partner Name (Optional)</Label>
                <Input
                  id="spouseName"
                  value={formData.spouseName}
                  onChange={(e) => setFormData(prev => ({...prev, spouseName: e.target.value}))}
                  placeholder="Jane Doe"
                />
              </div>
              
              <div>
                <Label htmlFor="state" className="text-white">State of Residence</Label>
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
              <Shield className="h-12 w-12 mx-auto mb-4 text-bfo-gold" />
              <h2 className="text-2xl font-bold mb-2 text-white">Trust Setup</h2>
              <p className="text-white/70">Configure your revocable living trust</p>
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
                <Label htmlFor="hasTrust" className="text-white">Create a Revocable Living Trust</Label>
              </div>
              
              {formData.hasTrust && (
                <>
                  <div>
                    <Label htmlFor="trustee" className="text-white">Successor Trustee</Label>
                    <Input
                      id="trustee"
                      value={formData.trustee}
                      onChange={(e) => setFormData(prev => ({...prev, trustee: e.target.value}))}
                      placeholder="Who will manage the trust after you?"
                    />
                  </div>
                  
                  {estateRules.rlt.spousalConsents && formData.spouseName && (
                    <div className="p-4 bg-bfo-gold/10 border border-bfo-gold/30 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="h-5 w-5 text-bfo-gold mt-0.5" />
                        <div>
                          <p className="font-medium text-bfo-gold">Spousal Consent Required</p>
                          <p className="text-sm text-white/70">
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
              <FileText className="h-12 w-12 mx-auto mb-4 text-bfo-gold" />
              <h2 className="text-2xl font-bold mb-2 text-white">Document Selection</h2>
              <p className="text-white/70">Choose your estate planning documents</p>
            </div>
            
            <div className="space-y-4">
              {[
                { id: 'will', name: 'Last Will & Testament', required: true, price: 199 },
                { id: 'rlt', name: 'Revocable Living Trust', required: false, price: 299 },
                { id: 'poa', name: 'Financial Power of Attorney', required: false, price: 149 },
                { id: 'pourover', name: 'Pour-Over Will', required: false, price: 99 }
              ].map(doc => (
                <div key={doc.id} className="flex items-center justify-between p-4 border border-bfo-gold/30 rounded-lg bg-bfo-navy">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={selectedDocs.includes(doc.id)}
                      onCheckedChange={() => handleDocumentToggle(doc.id)}
                      disabled={doc.required}
                    />
                    <div>
                      <p className="font-medium text-white">{doc.name}</p>
                      {doc.required && (
                        <p className="text-xs text-white/70">Required</p>
                      )}
                    </div>
                  </div>
                  <p className="font-medium text-bfo-gold">${doc.price}</p>
                </div>
              ))}
              
              <div className="p-4 bg-bfo-gold/10 border border-bfo-gold/30 rounded-lg">
                <h3 className="font-medium text-bfo-gold">State Requirements ({formData.state})</h3>
                <ul className="text-sm text-white/70 mt-2 space-y-1">
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
              <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-bfo-gold" />
              <h2 className="text-2xl font-bold mb-2 text-white">Review & Payment</h2>
              <p className="text-white/70">Confirm your selections and complete payment</p>
            </div>
            
            <Card className="bg-[hsl(210_65%_13%)] border-4 border-bfo-gold shadow-lg shadow-bfo-gold/20">
              <CardHeader>
                <CardTitle className="text-white">Order Summary</CardTitle>
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
                    <div key={docId} className="flex justify-between text-white">
                      <span>{docNames[docId as keyof typeof docNames]}</span>
                      <span className="text-bfo-gold">${prices[docId as keyof typeof prices]}</span>
                    </div>
                  );
                })}
                <div className="border-t border-bfo-gold/30 pt-4">
                  <div className="flex justify-between font-bold text-white">
                    <span>Total</span>
                    <span className="text-bfo-gold">${selectedDocs.reduce((sum, docId) => {
                      const prices = { will: 199, rlt: 299, poa: 149, pourover: 99 };
                      return sum + prices[docId as keyof typeof prices];
                    }, 0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="p-4 bg-bfo-gold/10 border border-bfo-gold/30 rounded-lg">
              <h3 className="font-medium text-bfo-gold mb-2">Important Disclaimers</h3>
              <ul className="text-sm text-white/70 space-y-1">
                <li>• This service provides document preparation support, not legal advice</li>
                <li>• Documents are state-compliant but may require attorney review</li>
                <li>• Execution requirements vary by state - follow provided guidance</li>
                <li>• Consider professional legal counsel for complex estates</li>
              </ul>
            </div>
            
            {!paymentComplete && (
              <Button onClick={handlePayment} className="w-full bg-bfo-gold text-black hover:bg-bfo-gold/90" size="lg">
                Complete Payment
              </Button>
            )}
            
            {paymentComplete && !documentsGenerated && (
              <Button onClick={handleGenerateDocuments} className="w-full bg-bfo-gold text-black hover:bg-bfo-gold/90" size="lg">
                Generate Documents
              </Button>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-green-400" />
              <h2 className="text-2xl font-bold mb-2 text-white">Documents Ready</h2>
              <p className="text-white/70">Your estate planning documents have been generated</p>
            </div>
            
            {documentsGenerated && (
              <Card className="bg-[hsl(210_65%_13%)] border-4 border-bfo-gold shadow-lg shadow-bfo-gold/20">
                <CardHeader>
                  <CardTitle className="text-white">Generated Documents</CardTitle>
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
                      <div key={docId} className="flex items-center justify-between p-3 border border-bfo-gold/30 rounded-lg">
                        <span className="text-white">{docNames[docId as keyof typeof docNames]}</span>
                        <Button variant="outline" size="sm" className="border-bfo-gold text-bfo-gold hover:bg-bfo-gold hover:text-black">
                          Download PDF
                        </Button>
                      </div>
                    );
                  })}
                  
                  <div className="flex items-center justify-between p-3 border border-bfo-gold/30 rounded-lg bg-green-400/10">
                    <span className="text-white">Execution Checklist ({formData.state})</span>
                    <Button variant="outline" size="sm" className="border-bfo-gold text-bfo-gold hover:bg-bfo-gold hover:text-black">
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
              <Crown className="h-12 w-12 mx-auto mb-4 text-bfo-gold" />
              <h2 className="text-2xl font-bold mb-2 text-white">Attorney Review</h2>
              <p className="text-white/70">Optional professional review of your estate plan</p>
            </div>
            
            <Card className="bg-[hsl(210_65%_13%)] border-4 border-bfo-gold shadow-lg shadow-bfo-gold/20">
              <CardHeader>
                <CardTitle className="text-white">Professional Review Available</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-white/70">
                  Connect with licensed estate planning attorneys in {formData.state} for:
                </p>
                
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span className="text-white">Document review and validation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span className="text-white">State-specific compliance verification</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span className="text-white">Execution guidance and coordination</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span className="text-white">Ongoing estate plan maintenance</span>
                  </li>
                </ul>
                
                <div className="pt-4">
                  <Button 
                    onClick={handleRequestAttorneyReview}
                    className="w-full bg-bfo-gold text-black hover:bg-bfo-gold/90"
                  >
                    Request Attorney Review ($297)
                  </Button>
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
    <div className="min-h-screen bg-bfo-navy">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {showIntro ? (
          renderIntro()
        ) : (
          <>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-white">Estate DIY Wizard</h1>
                <div className="text-sm text-white/70">
                  Step {currentStep} of {totalSteps}
                </div>
              </div>
              <Progress value={progress} className="w-full" />
            </div>

        <Card className="bg-[hsl(210_65%_13%)] border-4 border-bfo-gold shadow-lg shadow-bfo-gold/20">
          <CardContent className="p-8">
            {renderStep()}
          </CardContent>
        </Card>

        <div className="flex justify-between mt-6">
          <Button 
            variant="outline" 
            onClick={handleBack} 
            disabled={currentStep === 1}
            className="border-bfo-gold text-bfo-gold hover:bg-bfo-gold hover:text-black"
          >
            Back
          </Button>
          
          <Button 
            onClick={handleNext} 
            disabled={currentStep === totalSteps}
            className="bg-bfo-gold text-black hover:bg-bfo-gold/90"
          >
            {currentStep === totalSteps ? 'Complete' : 'Next'}
          </Button>
        </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EstateDIYWizard;