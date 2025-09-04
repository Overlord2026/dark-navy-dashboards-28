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
              <Heart className="h-12 w-12 mx-auto mb-4 text-bfo-gold" />
              <h2 className="text-2xl font-bold mb-2 text-white">Healthcare Profile</h2>
              <p className="text-white/70">Basic information for your healthcare documents</p>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientName" className="text-white">Full Legal Name</Label>
                  <Input
                    id="clientName"
                    value={formData.clientName}
                    onChange={(e) => setFormData(prev => ({...prev, clientName: e.target.value}))}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="dob" className="text-white">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData(prev => ({...prev, dob: e.target.value}))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="address" className="text-white">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({...prev, address: e.target.value}))}
                  placeholder="123 Main St, City, State 12345"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone" className="text-white">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="state" className="text-white">State</Label>
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
              <Shield className="h-12 w-12 mx-auto mb-4 text-bfo-gold" />
              <h2 className="text-2xl font-bold mb-2 text-white">Healthcare Agent</h2>
              <p className="text-white/70">Choose who will make healthcare decisions for you</p>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium text-white">Primary {healthRules.surrogateTerminology || 'Health Care Agent'}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="agentName" className="text-white">Agent Name</Label>
                  <Input
                    id="agentName"
                    value={formData.agentName}
                    onChange={(e) => setFormData(prev => ({...prev, agentName: e.target.value}))}
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="agentRelationship" className="text-white">Relationship</Label>
                  <Input
                    id="agentRelationship"
                    value={formData.agentRelationship}
                    onChange={(e) => setFormData(prev => ({...prev, agentRelationship: e.target.value}))}
                    placeholder="Spouse"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="agentAddress" className="text-white">Agent Address</Label>
                <Textarea
                  id="agentAddress"
                  value={formData.agentAddress}
                  onChange={(e) => setFormData(prev => ({...prev, agentAddress: e.target.value}))}
                  placeholder="Agent's full address"
                />
              </div>
              
              <div>
                <Label htmlFor="agentPhone" className="text-white">Agent Phone</Label>
                <Input
                  id="agentPhone"
                  value={formData.agentPhone}
                  onChange={(e) => setFormData(prev => ({...prev, agentPhone: e.target.value}))}
                  placeholder="(555) 123-4567"
                />
              </div>
              
              <h3 className="font-medium text-white">Alternate Agent (Optional)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="altAgentName" className="text-white">Alternate Name</Label>
                  <Input
                    id="altAgentName"
                    value={formData.altAgentName}
                    onChange={(e) => setFormData(prev => ({...prev, altAgentName: e.target.value}))}
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <Label htmlFor="altAgentPhone" className="text-white">Alternate Phone</Label>
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
              <FileText className="h-12 w-12 mx-auto mb-4 text-bfo-gold" />
              <h2 className="text-2xl font-bold mb-2 text-white">Document Selection</h2>
              <p className="text-white/70">Choose healthcare documents for {formData.state}</p>
            </div>
            
            <div className="p-4 bg-bfo-gold/10 border border-bfo-gold/30 rounded-lg">
              <h3 className="font-medium text-bfo-gold mb-2">{formData.state} Requirements</h3>
              <ul className="text-sm text-white/70 space-y-1">
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
                  <div key={form} className="flex items-center justify-between p-4 border border-bfo-gold/30 rounded-lg bg-bfo-navy">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={selectedForms.includes(form)}
                        onCheckedChange={() => handleFormToggle(form)}
                      />
                      <div>
                        <p className="font-medium text-white">{info.name}</p>
                        <p className="text-sm text-white/70">{info.description}</p>
                      </div>
                    </div>
                    <p className="font-medium text-bfo-gold">${info.price}</p>
                  </div>
                );
              })}
            </div>
            
            {healthRules.witnessEligibility && (
              <div className="p-4 bg-bfo-gold/10 border border-bfo-gold/30 rounded-lg">
                <h3 className="font-medium text-bfo-gold mb-2">Witness Requirements</h3>
                <p className="text-sm text-white/70">{healthRules.witnessEligibility}</p>
              </div>
            )}
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
                    <div key={form} className="flex justify-between text-white">
                      <span>{names[form as keyof typeof names]}</span>
                      <span className="text-bfo-gold">${prices[form as keyof typeof prices]}</span>
                    </div>
                  );
                })}
                <div className="border-t border-bfo-gold/30 pt-4">
                  <div className="flex justify-between font-bold text-white">
                    <span>Total</span>
                    <span className="text-bfo-gold">${selectedForms.reduce((sum, form) => {
                      const prices = { AdvanceDirective: 149, LivingWill: 129, HealthcarePOA: 139, HIPAA: 99, Surrogate: 139 };
                      return sum + prices[form as keyof typeof prices];
                    }, 0)}</span>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    onClick={handlePayment} 
                    disabled={paymentComplete || selectedForms.length === 0}
                    className="w-full bg-bfo-gold text-black hover:bg-bfo-gold/90"
                  >
                    {paymentComplete ? 'Payment Complete' : 'Pay Now'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Download className="h-12 w-12 mx-auto mb-4 text-bfo-gold" />
              <h2 className="text-2xl font-bold mb-2 text-white">Document Generation</h2>
              <p className="text-white/70">Generate your healthcare documents</p>
            </div>
            
            {!documentsGenerated ? (
              <Card className="bg-[hsl(210_65%_13%)] border-4 border-bfo-gold shadow-lg shadow-bfo-gold/20">
                <CardContent className="p-6 text-center">
                  <p className="text-white mb-4">Ready to generate your healthcare documents?</p>
                  <Button 
                    onClick={handleGenerateDocuments}
                    className="bg-bfo-gold text-black hover:bg-bfo-gold/90"
                  >
                    Generate Documents
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <Card className="bg-[hsl(210_65%_13%)] border-4 border-bfo-gold shadow-lg shadow-bfo-gold/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <CheckCircle2 className="h-8 w-8 text-green-400" />
                      <div>
                        <h3 className="font-semibold text-white">Documents Generated Successfully</h3>
                        <p className="text-sm text-white/70">Your healthcare documents are ready for download</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {selectedForms.map(form => (
                        <div key={form} className="flex items-center justify-between p-2 bg-bfo-gold/10 rounded border border-bfo-gold/30">
                          <span className="text-white">{form}</span>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-bfo-gold text-bfo-gold hover:bg-bfo-gold hover:text-black"
                          >
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    onClick={handleRequestAttorneyReview}
                    variant="outline"
                    className="border-bfo-gold text-bfo-gold hover:bg-bfo-gold hover:text-black"
                  >
                    Request Attorney Review
                  </Button>
                  <Button 
                    onClick={handleShareWithProvider}
                    variant="outline"
                    className="border-bfo-gold text-bfo-gold hover:bg-bfo-gold hover:text-black"
                  >
                    Share with Healthcare Provider
                  </Button>
                </div>
              </div>
            )}
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Crown className="h-12 w-12 mx-auto mb-4 text-bfo-gold" />
              <h2 className="text-2xl font-bold mb-2 text-white">Completion</h2>
              <p className="text-white/70">Your healthcare planning is complete</p>
            </div>
            
            <Card className="bg-[hsl(210_65%_13%)] border-4 border-bfo-gold shadow-lg shadow-bfo-gold/20">
              <CardContent className="p-6 text-center">
                <div className="space-y-4">
                  <CheckCircle2 className="h-16 w-16 mx-auto text-green-400" />
                  <h3 className="text-xl font-semibold text-white">Healthcare Planning Complete!</h3>
                  <p className="text-white/70">
                    Your healthcare documents have been generated and stored securely. 
                    Remember to review them periodically and update as needed.
                  </p>
                  
                  <div className="pt-4 space-y-2">
                    <p className="text-sm text-white/70">Next Steps:</p>
                    <ul className="text-sm text-white/70 space-y-1">
                      <li>• Share copies with your healthcare providers</li>
                      <li>• Inform your healthcare agent of their responsibilities</li>
                      <li>• Keep original documents in a secure location</li>
                      <li>• Review and update annually or after major life events</li>
                    </ul>
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
    <div className="min-h-screen bg-bfo-navy">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-white">Healthcare DIY Wizard</h1>
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
      </div>
    </div>
  );
};

export default HealthcareDIYWizard;