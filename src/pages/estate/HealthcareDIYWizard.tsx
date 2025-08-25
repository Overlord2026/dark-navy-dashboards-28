import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Crown, FileText, Shield, CheckCircle2, Heart, Download } from 'lucide-react';
import { renderHealthcarePdf } from '@/lib/report/healthPdf';
import { useHealthcareRules } from '@/features/estate/states/estateRules';
import { recordReceipt } from '@/features/receipts/record';
import { toast } from 'sonner';
import analytics from '@/lib/analytics';

const HealthcareDIYWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    clientName: '',
    address: '',
    dob: '',
    phone: '',
    state: 'CA',
    agentName: '',
    agentAddress: '',
    agentPhone: '',
    agentRelationship: '',
    altAgentName: '',
    altAgentAddress: '',
    altAgentPhone: '',
    physicianName: '',
    physicianAddress: '',
    physicianPhone: '',
    treatmentPreferences: {
      lifeSupport: 'agent_decides',
      artificialNutrition: 'agent_decides',
      cpr: 'agent_decides',
      painRelief: true,
      organDonation: 'agent_decides'
    }
  });
  const [selectedForms, setSelectedForms] = useState<string[]>([]);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [documentsGenerated, setDocumentsGenerated] = useState(false);

  const healthRules = useHealthcareRules(formData.state) as any;
  const totalSteps = 6;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      if (currentStep === 1) {
        analytics.track('healthcare.diy.start', { state: formData.state });
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFormToggle = (formType: string) => {
    setSelectedForms(prev => 
      prev.includes(formType) 
        ? prev.filter(f => f !== formType)
        : [...prev, formType]
    );
  };

  const handlePayment = async () => {
    try {
      const amount = selectedForms.length * 149;
      analytics.track('healthcare.diy.pay', { 
        selectedForms, 
        state: formData.state,
        amount
      });
      
      // Simulate payment delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPaymentComplete(true);
      toast.success('Payment processed successfully');
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    }
  };

  const handleGenerateDocuments = async () => {
    try {
      const tokens = {
        client_full_name: formData.clientName,
        address: formData.address,
        dob: formData.dob,
        phone: formData.phone,
        state_code: formData.state,
        agent_name: formData.agentName,
        agent_address: formData.agentAddress,
        agent_phone: formData.agentPhone,
        agent_relationship: formData.agentRelationship,
        alt_agent_name: formData.altAgentName,
        alt_agent_address: formData.altAgentAddress,
        alt_agent_phone: formData.altAgentPhone,
        physician_name: formData.physicianName,
        physician_address: formData.physicianAddress,
        physician_phone: formData.physicianPhone,
        date: new Date().toLocaleDateString(),
        witness_count: String(healthRules.witnesses),
        notary_required: String(healthRules.notaryRequired),
        terminology: healthRules.surrogateTerminology || 'Health Care Agent',
        jurat_block: healthRules.notarizationText || '',
        witness_eligibility: healthRules.witnessEligibility || '',
        special_notes: healthRules.specialNotes || ''
      };

      // Generate each selected document
      for (const formType of selectedForms) {
        const pdfBytes = await renderHealthcarePdf(
          formType as 'AdvanceDirective' | 'LivingWill' | 'HealthcarePOA' | 'HIPAA' | 'Surrogate',
          tokens as any,
          healthRules as any
        );
        
        // Save to Vault (mock)
        await recordReceipt({
          type: 'Vault-RDS',
          action: 'HEALTHCARE_PDF_STORE',
          reasons: [formType],
          inputs_hash: `sha256:${formType}_${Date.now()}`,
          created_at: new Date().toISOString()
        } as any);
        
        console.log(`Generated ${formType} PDF:`, pdfBytes.length, 'bytes');
      }

      // Record main assembly receipt
      await recordReceipt({
        type: 'Decision-RDS',
        action: 'healthcare.packet.assemble',
        reasons: ['DIY_PREMIUM'],
        inputs_hash: `sha256:healthcare_diy_${Date.now()}`,
        created_at: new Date().toISOString()
      } as any);

      setDocumentsGenerated(true);
      analytics.track('healthcare.diy.assemble', { 
        forms: selectedForms,
        state: formData.state
      });
      toast.success('Healthcare documents generated successfully');
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
      
      analytics.track('healthcare.diy.attorney.review.request', { state: formData.state });
      toast.success('Attorney review request submitted');
    } catch (error) {
      toast.error('Failed to request attorney review');
    }
  };

  const handleShareWithProvider = async () => {
    try {
      // Create PRE grant and Consent-RDS
      await recordReceipt({
        type: 'Consent-RDS',
        scope: { 'health_packet': ['HIPAA', 'AdvanceDirective', 'HealthcarePOA'] },
        ttlDays: 30,
        result: 'approve',
        created_at: new Date().toISOString()
      } as any);

      await recordReceipt({
        type: 'Vault-RDS',
        action: 'PRE_GRANT_CREATE',
        reasons: ['MINIMUM_NECESSARY'],
        inputs_hash: `sha256:pre_healthcare_${Date.now()}`,
        created_at: new Date().toISOString()
      } as any);
      
      analytics.track('healthcare.diy.share', { channel: 'PRE' });
      toast.success('Healthcare packet shared with provider');
    } catch (error) {
      toast.error('Failed to share with provider');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Heart className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-2">Healthcare Profile</h2>
              <p className="text-muted-foreground">Basic information for your healthcare documents</p>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientName">Full Legal Name</Label>
                  <Input
                    id="clientName"
                    value={formData.clientName}
                    onChange={(e) => setFormData(prev => ({...prev, clientName: e.target.value}))}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData(prev => ({...prev, dob: e.target.value}))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({...prev, address: e.target.value}))}
                  placeholder="123 Main St, City, State 12345"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
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
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-2">Healthcare Agent</h2>
              <p className="text-muted-foreground">Choose who will make healthcare decisions for you</p>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">Primary {healthRules.surrogateTerminology || 'Health Care Agent'}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="agentName">Agent Name</Label>
                  <Input
                    id="agentName"
                    value={formData.agentName}
                    onChange={(e) => setFormData(prev => ({...prev, agentName: e.target.value}))}
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="agentRelationship">Relationship</Label>
                  <Input
                    id="agentRelationship"
                    value={formData.agentRelationship}
                    onChange={(e) => setFormData(prev => ({...prev, agentRelationship: e.target.value}))}
                    placeholder="Spouse"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="agentAddress">Agent Address</Label>
                <Textarea
                  id="agentAddress"
                  value={formData.agentAddress}
                  onChange={(e) => setFormData(prev => ({...prev, agentAddress: e.target.value}))}
                  placeholder="Agent's full address"
                />
              </div>
              
              <div>
                <Label htmlFor="agentPhone">Agent Phone</Label>
                <Input
                  id="agentPhone"
                  value={formData.agentPhone}
                  onChange={(e) => setFormData(prev => ({...prev, agentPhone: e.target.value}))}
                  placeholder="(555) 123-4567"
                />
              </div>
              
              <h3 className="font-medium">Alternate Agent (Optional)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="altAgentName">Alternate Name</Label>
                  <Input
                    id="altAgentName"
                    value={formData.altAgentName}
                    onChange={(e) => setFormData(prev => ({...prev, altAgentName: e.target.value}))}
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <Label htmlFor="altAgentPhone">Alternate Phone</Label>
                  <Input
                    id="altAgentPhone"
                    value={formData.altAgentPhone}
                    onChange={(e) => setFormData(prev => ({...prev, altAgentPhone: e.target.value}))}
                    placeholder="Optional"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-2">Document Selection</h2>
              <p className="text-muted-foreground">Choose healthcare documents for {formData.state}</p>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">{formData.state} Requirements</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Witnesses required: {healthRules.witnesses}</li>
                <li>• Notarization: {healthRules.notaryRequired ? 'Required' : 'Not required'}</li>
                <li>• Terminology: {healthRules.surrogateTerminology || 'Health Care Agent'}</li>
                {healthRules.remoteNotaryAllowed && <li>• Remote Online Notary: Available</li>}
                {healthRules.specialNotes && <li>• {healthRules.specialNotes}</li>}
              </ul>
            </div>
            
            <div className="space-y-4">
              {healthRules.healthcareForms.map(form => {
                const formInfo = {
                  AdvanceDirective: { name: 'Advance Directive', price: 149, description: 'Comprehensive healthcare decisions and agent appointment' },
                  LivingWill: { name: 'Living Will', price: 129, description: 'End-of-life treatment preferences' },
                  HealthcarePOA: { name: 'Healthcare Power of Attorney', price: 139, description: 'Agent authority for medical decisions' },
                  HIPAA: { name: 'HIPAA Authorization', price: 99, description: 'Medical records access authorization' },
                  Surrogate: { name: `${healthRules.surrogateTerminology} Designation`, price: 139, description: 'Healthcare decision-maker appointment' }
                };
                const info = formInfo[form as keyof typeof formInfo];
                
                return (
                  <div key={form} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={selectedForms.includes(form)}
                        onCheckedChange={() => handleFormToggle(form)}
                      />
                      <div>
                        <p className="font-medium">{info.name}</p>
                        <p className="text-sm text-muted-foreground">{info.description}</p>
                      </div>
                    </div>
                    <p className="font-medium">${info.price}</p>
                  </div>
                );
              })}
            </div>
            
            {healthRules.witnessEligibility && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-medium text-yellow-800 mb-2">Witness Requirements</h3>
                <p className="text-sm text-yellow-700">{healthRules.witnessEligibility}</p>
              </div>
            )}
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
                {selectedForms.map(form => {
                  const prices = { AdvanceDirective: 149, LivingWill: 129, HealthcarePOA: 139, HIPAA: 99, Surrogate: 139 };
                  const names = {
                    AdvanceDirective: 'Advance Directive',
                    LivingWill: 'Living Will',
                    HealthcarePOA: 'Healthcare Power of Attorney',
                    HIPAA: 'HIPAA Authorization',
                    Surrogate: `${healthRules.surrogateTerminology} Designation`
                  };
                  return (
                    <div key={form} className="flex justify-between">
                      <span>{names[form as keyof typeof names]}</span>
                      <span>${prices[form as keyof typeof prices]}</span>
                    </div>
                  );
                })}
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${selectedForms.reduce((sum, form) => {
                      const prices = { AdvanceDirective: 149, LivingWill: 129, HealthcarePOA: 139, HIPAA: 99, Surrogate: 139 };
                      return sum + prices[form as keyof typeof prices];
                    }, 0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Important Disclaimers</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• This service provides document preparation assistance, not legal advice</li>
                <li>• Documents are state-compliant but may require attorney review for complex situations</li>
                <li>• Follow state-specific execution requirements provided</li>
                <li>• Consider professional legal counsel for complex healthcare situations</li>
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
              <p className="text-muted-foreground">Your healthcare documents have been generated</p>
            </div>
            
            {documentsGenerated && (
              <Card>
                <CardHeader>
                  <CardTitle>Generated Documents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedForms.map(form => {
                    const names = {
                      AdvanceDirective: 'Advance Directive',
                      LivingWill: 'Living Will',
                      HealthcarePOA: 'Healthcare Power of Attorney',
                      HIPAA: 'HIPAA Authorization',
                      Surrogate: `${healthRules.surrogateTerminology} Designation`
                    };
                    return (
                      <div key={form} className="flex items-center justify-between p-3 border rounded-lg">
                        <span>{names[form as keyof typeof names]}</span>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </Button>
                      </div>
                    );
                  })}
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                    <span>Execution Checklist ({formData.state})</span>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
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
              <h2 className="text-2xl font-bold mb-2">Additional Services</h2>
              <p className="text-muted-foreground">Optional attorney review and provider sharing</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Attorney Review</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Connect with licensed healthcare attorneys in {formData.state} for:
                  </p>
                  
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Document review and validation</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-sm">State-specific compliance verification</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Complex situation guidance</span>
                    </li>
                  </ul>
                  
                  <Button onClick={handleRequestAttorneyReview} className="w-full">
                    Request Attorney Review
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Share with Provider</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Securely share healthcare documents with your providers:
                  </p>
                  
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Minimum-necessary sharing</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Time-limited access (30 days)</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Consent-tracked sharing</span>
                    </li>
                  </ul>
                  
                  <Button onClick={handleShareWithProvider} variant="outline" className="w-full">
                    Share with Provider
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Healthcare Packet (Premium)</h1>
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
                    (currentStep === 2 && !formData.agentName) ||
                    (currentStep === 3 && selectedForms.length === 0) ||
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

export default HealthcareDIYWizard;