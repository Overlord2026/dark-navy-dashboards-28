import React from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, AlertCircle, FileText, Users, Signature, Upload } from 'lucide-react';
import { runChecks, validateContract, PolicyCheckResult } from '@/features/nil/policy/checks';
import { recordReceipt } from '@/features/receipts/record';
import { DecisionRDS } from '@/features/receipts/types';
import { anchorBatch } from '@/features/anchor/simple-providers';
import { toast } from 'sonner';

export default function ContractPage() {
  const { id } = useParams<{ id: string }>();
  const [contractTerms, setContractTerms] = React.useState('# NIL Partnership Agreement\n\nThis agreement outlines the terms for the NIL partnership...');
  const [checkResults, setCheckResults] = React.useState<PolicyCheckResult | null>(null);
  const [coSigners, setCoSigners] = React.useState<string[]>([]);
  const [eSignStatus, setESignStatus] = React.useState<'pending' | 'sent' | 'signed'>('pending');
  const [newCoSigner, setNewCoSigner] = React.useState('');

  const handleRunChecks = () => {
    try {
      const results = runChecks(id || 'contract-1', 'offer-1');
      const contractValidation = validateContract(id || 'contract-1');
      
      // Combine results
      const combinedResults: PolicyCheckResult = {
        ok: results.ok && contractValidation.ok,
        reasons: [...results.reasons, ...contractValidation.reasons],
        details: { ...results.details, contractValid: contractValidation.ok }
      };
      
      setCheckResults(combinedResults);
      
      toast.success('Policy checks completed', {
        description: combinedResults.ok ? 'All checks passed' : 'Some issues found'
      });
    } catch (error) {
      toast.error('Failed to run policy checks');
    }
  };

  const handleAddCoSigner = () => {
    if (newCoSigner && !coSigners.includes(newCoSigner)) {
      setCoSigners(prev => [...prev, newCoSigner]);
      setNewCoSigner('');
      toast.success('Co-signer added');
    }
  };

  const handleRequestCoSign = () => {
    if (coSigners.length === 0) {
      toast.error('No co-signers added');
      return;
    }
    
    toast.success('Co-sign requests sent', {
      description: `Sent to ${coSigners.length} co-signers`
    });
  };

  const handleSendForESign = () => {
    setESignStatus('sent');
    toast.success('Contract sent for e-signature');
    
    // Simulate e-sign completion after 3 seconds
    setTimeout(() => {
      setESignStatus('signed');
      toast.success('Contract signed!');
    }, 3000);
  };

  const handlePublish = async () => {
    if (!checkResults?.ok) {
      toast.error('Cannot publish: Policy checks failed');
      return;
    }

    if (eSignStatus !== 'signed') {
      toast.error('Cannot publish: Contract not signed');
      return;
    }

    try {
      // Create hash of contract content
      const contractHash = window.btoa(unescape(encodeURIComponent(contractTerms))).slice(0, 24);
      const anchorRef = await anchorBatch(contractHash);

      const rds: DecisionRDS = {
        id: `publish_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'Decision-RDS',
        action: 'publish',
        policy_version: 'E-2025.08',
        inputs_hash: contractHash,
        reasons: checkResults.reasons,
        result: 'approve',
        asset_id: id || 'contract-1',
        anchor_ref: anchorRef,
        ts: new Date().toISOString()
      };

      const receipt = recordReceipt(rds);
      
      toast.success('Contract published!', {
        description: `Receipt: ${receipt.id}`,
        action: {
          label: 'View Receipt',
          onClick: () => console.log('Receipt:', receipt)
        }
      });
    } catch (error) {
      toast.error('Failed to publish contract');
    }
  };

  const canPublish = checkResults?.ok && eSignStatus === 'signed';

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Contract Editor</h1>
        <p className="text-muted-foreground">
          Contract ID: {id || 'contract-1'}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Contract Terms
              </CardTitle>
              <CardDescription>Edit the contract content in markdown</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={contractTerms}
                onChange={(e) => setContractTerms(e.target.value)}
                rows={15}
                className="font-mono text-sm"
                placeholder="Enter contract terms in markdown..."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Co-signers
              </CardTitle>
              <CardDescription>Add required co-signers for this contract</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={newCoSigner}
                  onChange={(e) => setNewCoSigner(e.target.value)}
                  placeholder="Enter email address"
                  className="flex-1 px-3 py-2 border rounded-md"
                />
                <Button onClick={handleAddCoSigner} disabled={!newCoSigner}>
                  Add
                </Button>
              </div>
              
              <div className="space-y-2">
                {coSigners.map((signer, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <span className="text-sm">{signer}</span>
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                ))}
                {coSigners.length === 0 && (
                  <p className="text-sm text-muted-foreground">No co-signers added</p>
                )}
              </div>

              <Button 
                onClick={handleRequestCoSign}
                disabled={coSigners.length === 0}
                className="w-full"
              >
                Request Co-signatures
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Policy Checks</CardTitle>
              <CardDescription>Validate contract compliance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleRunChecks} className="w-full">
                Run Checks
              </Button>

              {checkResults && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {checkResults.ok ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className="font-medium">
                      {checkResults.ok ? 'All checks passed' : 'Issues found'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    {checkResults.reasons.map((reason, index) => (
                      <Badge 
                        key={index} 
                        variant={reason.includes('MISSING') || reason.includes('INCOMPLETE') || reason.includes('CONFLICT') ? 'destructive' : 'default'}
                        className="text-xs"
                      >
                        {reason}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Signature className="h-5 w-5" />
                E-Signature
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant={eSignStatus === 'signed' ? 'default' : 'secondary'}>
                  {eSignStatus}
                </Badge>
              </div>

              <Button 
                onClick={handleSendForESign}
                disabled={eSignStatus !== 'pending'}
                className="w-full"
              >
                Send for E-Sign
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Publish Contract
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handlePublish}
                disabled={!canPublish}
                className="w-full"
                variant={canPublish ? 'default' : 'secondary'}
              >
                {canPublish ? 'Publish Contract' : 'Complete checks & signing first'}
              </Button>
              
              {canPublish && (
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  This will create an anchored Decision-RDS receipt
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}