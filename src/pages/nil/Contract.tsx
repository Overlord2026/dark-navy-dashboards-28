import React from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, FileText, Users, Signature, Send } from 'lucide-react';
import { runChecks, validateContract, PolicyCheckResult } from '@/features/nil/policy/checks';
import { recordReceipt } from '@/features/receipts/record';
import { anchorBatch } from '@/features/anchor/simple-providers';
import { DecisionRDS } from '@/features/receipts/types';
import { toast } from 'sonner';

export default function ContractPage() {
  const { id } = useParams<{ id: string }>();
  const contractId = id || 'default-contract';
  
  const [contractTerms, setContractTerms] = React.useState(`# NIL Agreement

**Parties:** [Athlete Name] and [Brand Name]

## Terms and Conditions

1. **Grant of Rights**: Athlete grants Brand the right to use their name, image, and likeness for promotional purposes.

2. **Compensation**: Brand agrees to pay Athlete $[Amount] for the rights granted herein.

3. **Duration**: This agreement shall be effective from [Start Date] to [End Date].

4. **Usage Rights**: Brand may use Athlete's NIL in the following channels:
   - Social Media (Instagram, TikTok, YouTube)
   - Digital Advertising
   - Website Content

5. **Exclusivity**: [Exclusivity terms to be defined]

6. **Compliance**: Both parties agree to comply with all applicable NCAA, state, and federal regulations regarding NIL activities.`);

  const [policyCheck, setPolicyCheck] = React.useState<PolicyCheckResult | null>(null);
  const [contractValidation, setContractValidation] = React.useState<PolicyCheckResult | null>(null);
  const [coSigners, setCoSigners] = React.useState<string[]>(['Parent/Guardian', 'University Compliance Officer']);
  const [signatureStatus, setSignatureStatus] = React.useState<Record<string, boolean>>({});
  const [isPublished, setIsPublished] = React.useState(false);

  const handleRunChecks = () => {
    try {
      const checks = runChecks(contractId);
      setPolicyCheck(checks);
      
      const validation = validateContract(contractId);
      setContractValidation(validation);

      toast.success('Policy checks completed', {
        description: checks.ok ? 'All checks passed' : `${checks.reasons.length} issues found`
      });
    } catch (error) {
      toast.error('Failed to run policy checks');
    }
  };

  const handleRequestCoSign = (signer: string) => {
    setSignatureStatus(prev => ({ ...prev, [signer]: true }));
    toast.success(`Co-signature requested from ${signer}`, {
      description: 'They will receive an email with signing instructions'
    });
  };

  const handleSendForESign = () => {
    // Simulate e-signature process
    toast.success('Contract sent for e-signature', {
      description: 'All parties will receive signing instructions'
    });
  };

  const handlePublish = async () => {
    if (!policyCheck?.ok || !contractValidation?.ok) {
      toast.error('Cannot publish: Policy checks must pass first');
      return;
    }

    const requiredCoSigns = coSigners.filter(signer => !signatureStatus[signer]);
    if (requiredCoSigns.length > 0) {
      toast.error('Cannot publish: Missing required co-signatures', {
        description: `Still need: ${requiredCoSigns.join(', ')}`
      });
      return;
    }

    try {
      // Create hash of contract content
      const contractHash = window.btoa(unescape(encodeURIComponent(contractTerms))).slice(0, 24);
      
      // Anchor the contract
      const anchorRef = await anchorBatch(contractHash);

      // Create Decision-RDS for publish action
      const publishRDS: DecisionRDS = {
        id: `publish_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'Decision-RDS',
        action: 'publish',
        policy_version: 'E-2025.08',
        inputs_hash: contractHash,
        reasons: [...(policyCheck?.reasons || []), ...(contractValidation?.reasons || [])],
        result: 'approve',
        asset_id: contractId,
        anchor_ref: anchorRef,
        ts: new Date().toISOString()
      };

      const receipt = recordReceipt(publishRDS);
      setIsPublished(true);

      toast.success('Contract published successfully!', {
        description: `Receipt: ${receipt.id}`,
        action: {
          label: 'View Receipt',
          onClick: () => console.log('Publish receipt:', receipt)
        }
      });

      console.info('nil.contract.published', {
        contractId,
        receiptId: receipt.id,
        anchorRef,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      toast.error('Failed to publish contract');
    }
  };

  const allChecksPass = policyCheck?.ok && contractValidation?.ok;
  const allCoSigned = coSigners.every(signer => signatureStatus[signer]);
  const canPublish = allChecksPass && allCoSigned && !isPublished;

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">NIL Contract Editor</h1>
        <p className="text-muted-foreground">Contract ID: {contractId}</p>
      </div>

      <Tabs defaultValue="terms" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="terms">Terms</TabsTrigger>
          <TabsTrigger value="disclosures">Disclosures</TabsTrigger>
          <TabsTrigger value="cosigners">Co-signers</TabsTrigger>
          <TabsTrigger value="esign">E-Sign</TabsTrigger>
        </TabsList>

        <TabsContent value="terms">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Contract Terms
              </CardTitle>
              <CardDescription>Edit the terms and conditions of your NIL agreement</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={contractTerms}
                onChange={(e) => setContractTerms(e.target.value)}
                placeholder="Enter contract terms in markdown format..."
                className="min-h-[400px] font-mono"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disclosures">
          <Card>
            <CardHeader>
              <CardTitle>Bound Disclosures</CardTitle>
              <CardDescription>Disclosure packs automatically bound to this contract</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border rounded flex items-center justify-between">
                  <div>
                    <p className="font-medium">US Instagram Standard</p>
                    <p className="text-sm text-muted-foreground">#ad #sponsored #partnership with @{'{brand}'}</p>
                  </div>
                  <Badge>Bound</Badge>
                </div>
                <div className="p-3 border rounded flex items-center justify-between">
                  <div>
                    <p className="font-medium">US TikTok Standard</p>
                    <p className="text-sm text-muted-foreground">#sponsored #partnership with {'{brand}'}</p>
                  </div>
                  <Badge>Bound</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cosigners">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Co-signers
              </CardTitle>
              <CardDescription>Required signatures for contract approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {coSigners.map((signer) => (
                  <div key={signer} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      {signatureStatus[signer] ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-muted-foreground" />
                      )}
                      <span className="font-medium">{signer}</span>
                    </div>
                    {!signatureStatus[signer] && (
                      <Button
                        size="sm"
                        onClick={() => handleRequestCoSign(signer)}
                      >
                        Request Signature
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="esign">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Signature className="h-5 w-5" />
                Electronic Signature
              </CardTitle>
              <CardDescription>Send contract for electronic signatures</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Signing Order:</p>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Athlete</li>
                    <li>Parent/Guardian (if applicable)</li>
                    <li>University Compliance Officer</li>
                    <li>Brand Representative</li>
                  </ol>
                </div>
                <Button onClick={handleSendForESign} className="w-full">
                  <Send className="mr-2 h-4 w-4" />
                  Send for E-Signature
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Panel */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Contract Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={handleRunChecks} variant="outline">
                Run Policy Checks
              </Button>
              <Button 
                onClick={handlePublish} 
                disabled={!canPublish}
                className="bg-primary"
              >
                {isPublished ? 'Published' : 'Publish Contract'}
              </Button>
            </div>

            {/* Policy Check Results */}
            {policyCheck && (
              <div className="p-4 border rounded">
                <div className="flex items-center gap-2 mb-2">
                  {policyCheck.ok ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="font-medium">Policy Check Results</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {policyCheck.reasons.map((reason, idx) => (
                    <Badge key={idx} variant={policyCheck.ok ? 'default' : 'destructive'}>
                      {reason}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Contract Validation Results */}
            {contractValidation && (
              <div className="p-4 border rounded">
                <div className="flex items-center gap-2 mb-2">
                  {contractValidation.ok ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="font-medium">Contract Validation</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {contractValidation.reasons.map((reason, idx) => (
                    <Badge key={idx} variant={contractValidation.ok ? 'default' : 'destructive'}>
                      {reason}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {isPublished && (
              <div className="p-4 bg-green-50 border border-green-200 rounded">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Contract Published Successfully</span>
                </div>
                <p className="text-sm text-green-600 mt-1">
                  Contract is now live and anchored on the blockchain
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}