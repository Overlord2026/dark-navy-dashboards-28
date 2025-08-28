import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { initializeBinding, getBinding, updateChecklistItem, initiateESign } from '@/services/bind';
import { getQuote } from '@/services/ratingStub';
import { Shield, CheckCircle, FileText, CreditCard, Signature, Eye, Lock } from 'lucide-react';
import { toast } from 'sonner';

// Add a checklist type
type BindingChecklist = {
  identity_verified: boolean;
  payment_method_confirmed: boolean;
  disclosures_accepted: boolean;
  underwriting_approved: boolean;
  application_signed: boolean;
};

const toBool = (v: string | boolean | undefined): boolean =>
  typeof v === 'boolean' ? v : v === 'true';

export function BindPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [binding, setBinding] = useState(null);
  const [quote, setQuote] = useState(null);
  const [signerEmail, setSignerEmail] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (id) {
      loadBindingData();
    }
  }, [id]);

  const loadBindingData = async () => {
    setLoading(true);
    try {
      // First get the quote
      const quoteData = await getQuote(id);
      if (!quoteData) {
        toast.error('Quote not found');
        navigate('/insurance/intake');
        return;
      }
      setQuote(quoteData);

      // Try to get existing binding or create new one
      let bindingData = await getBinding(id); // Might need different ID strategy
      
      if (!bindingData) {
        // Initialize new binding
        bindingData = await initializeBinding(id);
      }
      
      setBinding(bindingData);
    } catch (error) {
      console.error('Failed to load binding:', error);
      toast.error('Failed to load binding data');
      navigate('/insurance/intake');
    } finally {
      setLoading(false);
    }
  };

  const handleChecklistUpdate = async (item: keyof BindingChecklist, checked: boolean) => {
    if (!binding) return;
    
    setProcessing(true);
    try {
      await updateChecklistItem(binding.id, item, checked);
      
      // Update local state
      setBinding(prev => ({
        ...prev,
        checklist: { ...prev.checklist, [item]: checked }
      }));

      if (checked) {
        toast.success(`${item.replace('_', ' ')} completed`);
      }
    } catch (error) {
      console.error('Failed to update checklist:', error);
      toast.error('Failed to update checklist');
    } finally {
      setProcessing(false);
    }
  };

  const handleESign = async () => {
    if (!binding || !signerEmail) return;
    
    setProcessing(true);
    try {
      const esignUrl = await initiateESign(binding.id, signerEmail);
      
      // In real implementation, would open esign flow
      window.open(esignUrl, '_blank');
      
      // Mark as signed (would be done via webhook in real implementation)
      setTimeout(() => {
        handleChecklistUpdate('application_signed', true);
      }, 2000);
      
      toast.success('E-signature initiated');
    } catch (error) {
      console.error('E-sign failed:', error);
      toast.error('Failed to initiate e-signature');
    } finally {
      setProcessing(false);
    }
  };

  const calculateProgress = () => {
    if (!binding) return 0;
    const completed = Object.values(binding.checklist).filter(Boolean).length;
    const total = Object.keys(binding.checklist).length;
    return (completed / total) * 100;
  };

  const getStatusColor = () => {
    if (!binding) return 'secondary';
    if (binding.status === 'bound') return 'default';
    if (binding.status === 'rejected') return 'destructive';
    return 'secondary';
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p>Loading binding information...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Policy Binding</h1>
          <Badge variant={getStatusColor()}>
            {binding?.status || 'pending'}
          </Badge>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Policy Number</div>
          <div className="font-mono font-semibold">{binding?.policy_number}</div>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Binding Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Completion Progress</span>
              <span>{Math.round(calculateProgress())}%</span>
            </div>
            <Progress value={calculateProgress()} className="w-full" />
            <div className="text-xs text-muted-foreground">
              Complete all requirements to finalize your policy
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Binding Checklist */}
        <Card>
          <CardHeader>
            <CardTitle>Binding Requirements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {binding && (
              <>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="identity_verified"
                    checked={toBool(binding.checklist.identity_verified)}
                    onCheckedChange={(checked) => handleChecklistUpdate('identity_verified', toBool(checked))}
                    disabled={processing}
                  />
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <Label htmlFor="identity_verified" className="cursor-pointer">
                      Identity Verification
                    </Label>
                  </div>
                  {binding.checklist.identity_verified && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="payment_method_confirmed"
                    checked={toBool(binding.checklist.payment_method_confirmed)}
                    onCheckedChange={(checked) => handleChecklistUpdate('payment_method_confirmed', toBool(checked))}
                    disabled={processing}
                  />
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <Label htmlFor="payment_method_confirmed" className="cursor-pointer">
                      Payment Method Confirmed
                    </Label>
                  </div>
                  {binding.checklist.payment_method_confirmed && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="disclosures_accepted"
                    checked={toBool(binding.checklist.disclosures_accepted)}
                    onCheckedChange={(checked) => handleChecklistUpdate('disclosures_accepted', toBool(checked))}
                    disabled={processing}
                  />
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <Label htmlFor="disclosures_accepted" className="cursor-pointer">
                      Disclosures Accepted
                    </Label>
                  </div>
                  {binding.checklist.disclosures_accepted && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="underwriting_approved"
                    checked={toBool(binding.checklist.underwriting_approved)}
                    onCheckedChange={(checked) => handleChecklistUpdate('underwriting_approved', toBool(checked))}
                    disabled={processing}
                  />
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <Label htmlFor="underwriting_approved" className="cursor-pointer">
                      Underwriting Approved
                    </Label>
                  </div>
                  {binding.checklist.underwriting_approved && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Checkbox
                      id="application_signed"
                      checked={toBool(binding.checklist.application_signed)}
                      disabled={true}
                    />
                    <div className="flex items-center gap-2">
                      <Signature className="h-4 w-4" />
                      <Label htmlFor="application_signed">Application Signed</Label>
                    </div>
                    {binding.checklist.application_signed && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  
                  {!binding.checklist.application_signed && (
                    <div className="space-y-3 ml-6">
                      <div>
                        <Label htmlFor="signer_email">Signer Email</Label>
                        <Input
                          id="signer_email"
                          value={signerEmail}
                          onChange={(e) => setSignerEmail(e.target.value)}
                          placeholder="signer@example.com"
                          type="email"
                        />
                      </div>
                      <Button 
                        onClick={handleESign}
                        disabled={!signerEmail || processing}
                        size="sm"
                      >
                        <Signature className="h-4 w-4 mr-2" />
                        {processing ? 'Initiating...' : 'Start E-Signature'}
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Policy Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Policy Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {quote && (
              <>
                <div>
                  <Label>Coverage Type</Label>
                  <p className="font-medium capitalize">{quote.submission_id}</p>
                </div>
                <div>
                  <Label>Annual Premium Range</Label>
                  <p className="font-medium">{quote.premium_band}</p>
                </div>
                <div>
                  <Label>Effective Date</Label>
                  <p className="font-medium">
                    {binding && new Date(binding.effective_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label>Policy Term</Label>
                  <p className="font-medium">12 months</p>
                </div>
              </>
            )}
            
            {binding?.status === 'bound' && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 text-green-700 font-medium mb-2">
                  <CheckCircle className="h-5 w-5" />
                  Policy Successfully Bound
                </div>
                <p className="text-sm text-green-600">
                  Your policy is now active. Documents will be delivered to your secure vault.
                </p>
                {binding.documents.policy_documents_url && (
                  <div className="mt-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={binding.documents.policy_documents_url}>
                        <Lock className="h-4 w-4 mr-2" />
                        View in Vault
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="text-xs text-muted-foreground text-center">
        Binding creates Bind-RDS receipt • Payment creates Payment-RDS • Documents stored in Vault • Optional anchor on completion
      </div>
    </div>
  );
}

export default BindPage;