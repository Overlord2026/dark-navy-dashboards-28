import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Crown, 
  FileText, 
  Package,
  Archive,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Gavel
} from 'lucide-react';
import { recordReceipt } from '@/features/receipts/record';
import { renderEstatePdf } from '@/lib/report/estatePdf';
import { generateHash, maybeAnchor } from '@/features/anchors/hooks';

// Mock estate rules hook
function useEstateRules(state: string) {
  return {
    will: { witnesses: 2, notary: false, selfProving: true },
    rlt: { witnesses: 0, notary: true, trusteeSuccession: ['Successor Trustee'] },
    poa: { witnesses: 0, notary: true, durability: 'automatic' },
    pourOver: true,
    communityProperty: state === 'CA',
    probateThreshold: state === 'CA' ? 184500 : 50000,
    probateNotes: ['Estate planning requirements'],
    homesteadExemption: 600000,
    spousalElection: state !== 'CA',
    specialNotes: ['Consider state-specific requirements']
  };
}

export default function AttorneyEstateWorkbench() {
  const [clientData, setClientData] = useState({
    name: 'Sarah Johnson',
    age: 55,
    state: 'CA',
    assets: 2500000,
    spouse: 'Michael Johnson'
  });
  const [loading, setLoading] = useState(false);
  const [conflictResult, setConflictResult] = useState<'pass' | 'hit' | null>(null);

  const estateRules = useEstateRules(clientData.state);

  const handleConflictCheck = async () => {
    setLoading(true);
    try {
      // Mock conflict check - randomly pass/hit for demo
      const result = Math.random() > 0.8 ? 'hit' : 'pass';
      setConflictResult(result);
      
      // Record conflict check receipt
      await recordReceipt({
        type: 'Decision-RDS',
        action: 'attorney.conflict.check',
        reasons: [result, clientData.state],
        created_at: new Date().toISOString()
      } as any);
      
    } catch (error) {
      console.error('Conflict check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDocuments = async () => {
    setLoading(true);
    try {
      // Token substitution for document templates
      const tokens = {
        client_full_name: clientData.name,
        state_code: clientData.state,
        witnesses: String(estateRules.will.witnesses),
        notary_required: String(estateRules.will.notary),
        execution_date: new Date().toLocaleDateString()
      };

      // Generate documents with state rules
      const docs = ['Will', 'RLT', 'POA'];
      for (const docType of docs) {
        const pdfBytes = await renderEstatePdf(
          docType as 'Will' | 'RLT' | 'POA',
          tokens,
          estateRules
        );
        console.log(`Generated ${docType}:`, pdfBytes.length, 'bytes');
      }

      // Generate hash of estate documents and anchor
      const estateData = JSON.stringify({ clientData, estateRules, tokens, timestamp: new Date().toISOString() });
      const hash = await generateHash(estateData);
      
      // Record estate generation receipt
      await recordReceipt({
        type: 'Decision-RDS',
        action: 'attorney.estate.generated',
        reasons: ['document_suite', hash.slice(0, 16)],
        created_at: new Date().toISOString()
      } as any);
      
      // Optional anchoring
      await maybeAnchor('attorney.estate', hash);
      
    } catch (error) {
      console.error('Document generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGrantAuthority = async (type: 'POA' | 'Healthcare' | 'Successor') => {
    await recordReceipt({
      type: 'Decision-RDS',
      action: `attorney.authority.${type.toLowerCase()}`,
      reasons: ['authority_granted', clientData.state],
      created_at: new Date().toISOString()
    } as any);
  };

  // Calculate estate tax exposure
  const estateTaxThreshold = 13610000; // 2024 federal threshold
  const taxExposure = Math.max(0, clientData.assets - estateTaxThreshold);
  const recommendTrust = taxExposure > 0 || clientData.assets > 1000000;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Gavel className="w-8 h-8 text-primary" />
            Estate Planning Workbench
          </h1>
          <p className="text-muted-foreground">
            Comprehensive estate planning for high-net-worth clients
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={conflictResult === 'pass' ? 'default' : conflictResult === 'hit' ? 'destructive' : 'secondary'}>
            {conflictResult === 'pass' ? 'Cleared' : conflictResult === 'hit' ? 'Conflict' : 'Pending'}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Client Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Client Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={clientData.name}
                  onChange={(e) => setClientData({...clientData, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <select
                  id="state"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={clientData.state}
                  onChange={(e) => setClientData({...clientData, state: e.target.value})}
                >
                  <option value="CA">California</option>
                  <option value="NY">New York</option>
                  <option value="FL">Florida</option>
                  <option value="TX">Texas</option>
                </select>
              </div>
              <div>
                <Label htmlFor="assets">Total Assets</Label>
                <Input
                  id="assets"
                  type="number"
                  value={clientData.assets}
                  onChange={(e) => setClientData({...clientData, assets: Number(e.target.value)})}
                />
              </div>
            </div>
            
            <Button 
              onClick={handleConflictCheck}
              disabled={loading}
              className="w-full"
              variant={conflictResult === 'pass' ? 'default' : 'outline'}
            >
              {loading ? 'Checking...' : 'Run Conflict Check'}
            </Button>
          </CardContent>
        </Card>

        {/* Estate Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Estate Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Assets</span>
                <span className="font-medium">${clientData.assets.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Fed Tax Threshold</span>
                <span className="text-sm">${estateTaxThreshold.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Tax Exposure</span>
                <span className={`font-medium ${taxExposure > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  ${taxExposure.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Probate Threshold ({clientData.state})</span>
                <span className="text-sm">${estateRules.probateThreshold.toLocaleString()}</span>
              </div>
            </div>
            
            {recommendTrust && (
              <div className="p-3 border border-amber-200 bg-amber-50 rounded-lg">
                <div className="flex items-center gap-2 text-amber-800">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">Trust Recommended</span>
                </div>
                <p className="text-xs text-amber-700 mt-1">
                  Consider revocable living trust for probate avoidance and privacy
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* State Requirements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              {clientData.state} Requirements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Will Witnesses</span>
                <span>{estateRules.will.witnesses}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Trust Notary</span>
                <span>{estateRules.rlt.notary ? 'Required' : 'Optional'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">POA Witnesses</span>
                <span>{estateRules.poa.witnesses}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Community Property</span>
                <span>{estateRules.communityProperty ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Spousal Election</span>
                <span>{estateRules.spousalElection ? 'Available' : 'N/A'}</span>
              </div>
            </div>
            
            {estateRules.specialNotes.length > 0 && (
              <div className="pt-3 border-t text-xs text-muted-foreground">
                <div className="font-medium mb-1">Special Notes:</div>
                {estateRules.specialNotes.map((note, i) => (
                  <div key={i}>• {note}</div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="documents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="documents">Document Generation</TabsTrigger>
          <TabsTrigger value="authorities">Authority Grants</TabsTrigger>
          <TabsTrigger value="assets">Asset Protection</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Essential Documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Last Will & Testament</h3>
                      <p className="text-sm text-muted-foreground">
                        {estateRules.will.witnesses} witnesses, {estateRules.will.notary ? 'notarized' : 'signed'}
                      </p>
                    </div>
                    <Badge variant="outline">Required</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Revocable Living Trust</h3>
                      <p className="text-sm text-muted-foreground">
                        Avoid probate, maintain privacy
                      </p>
                    </div>
                    <Badge variant={recommendTrust ? 'default' : 'outline'}>
                      {recommendTrust ? 'Recommended' : 'Optional'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Power of Attorney</h3>
                      <p className="text-sm text-muted-foreground">
                        Financial authority - {estateRules.poa.notary ? 'Notarization required' : 'Witnesses required'}
                      </p>
                    </div>
                    <Button 
                      onClick={() => handleGrantAuthority('POA')}
                      size="sm" 
                      variant="outline"
                    >
                      Grant
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Revocable Living Trust</h3>
                      <p className="text-sm text-muted-foreground">
                        Avoid probate - {estateRules.rlt.notary ? 'Notarization required' : 'Signature only'}
                      </p>
                    </div>
                    <Badge variant="outline">Estate</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Pour-Over Will</h3>
                      <p className="text-sm text-muted-foreground">
                        Captures unfunded assets - {estateRules.will.witnesses} witnesses, {estateRules.will.notary ? 'notarized' : 'signed'}
                      </p>
                    </div>
                    <Badge variant="outline">Trust Companion</Badge>
                  </div>
                </div>
                
                <Button 
                  onClick={handleGenerateDocuments}
                  disabled={loading || conflictResult !== 'pass'}
                  className="w-full"
                  size="lg"
                >
                  {loading ? 'Generating...' : 'Generate Document Suite'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Execution Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Will Execution ({clientData.state})
                    </div>
                    <ul className="mt-2 space-y-1 text-muted-foreground text-xs">
                      <li>• {estateRules.will.witnesses} witnesses required</li>
                      <li>• {estateRules.will.notary ? 'Notarization required' : 'Notarization optional'}</li>
                      <li>• {estateRules.will.selfProving ? 'Self-proving affidavit available' : 'Standard execution'}</li>
                    </ul>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-600" />
                      Trust Funding
                    </div>
                    <ul className="mt-2 space-y-1 text-muted-foreground text-xs">
                      <li>• Real estate deed transfers</li>
                      <li>• Financial account retitling</li>
                      <li>• Business interest assignments</li>
                    </ul>
                  </div>
                </div>
                
                <div className="pt-3 border-t">
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="font-medium">Execution Timeline:</div>
                    <div>• Document review: 1-2 business days</div>
                    <div>• Client consultation: Scheduled</div>
                    <div>• Execution ceremony: Coordinated</div>
                    <div>• Trust funding: 30-60 days</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="authorities" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Authority Delegation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Healthcare Proxy</h3>
                      <p className="text-sm text-muted-foreground">
                        Medical decision authority for spouse
                      </p>
                    </div>
                    <Button 
                      onClick={() => handleGrantAuthority('Healthcare')}
                      size="sm"
                    >
                      Grant Authority
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Successor Trustee</h3>
                      <p className="text-sm text-muted-foreground">
                        Trust administration upon incapacity
                      </p>
                    </div>
                    <Button 
                      onClick={() => handleGrantAuthority('Successor')}
                      size="sm"
                      variant="outline"
                    >
                      Designate
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contingent Provisions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm space-y-2">
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium">Incapacity Planning</div>
                    <p className="text-muted-foreground text-xs mt-1">
                      Durable power of attorney ensures continuous financial management
                    </p>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium">Simultaneous Death</div>
                    <p className="text-muted-foreground text-xs mt-1">
                      Clear succession order prevents probate delays
                    </p>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium">Minor Beneficiaries</div>
                    <p className="text-muted-foreground text-xs mt-1">
                      Trust provisions protect inheritance until majority
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="assets" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Asset Protection Strategy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Homestead Exemption</h3>
                        <p className="text-sm text-muted-foreground">
                          ${estateRules.homesteadExemption.toLocaleString()} protected
                        </p>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Retirement Accounts</h3>
                        <p className="text-sm text-muted-foreground">
                          ERISA protection from creditors
                        </p>
                      </div>
                      <Badge variant="outline">Protected</Badge>
                    </div>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Life Insurance Trust</h3>
                        <p className="text-sm text-muted-foreground">
                          Remove from taxable estate
                        </p>
                      </div>
                      <Badge variant="secondary">Consider</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Archive className="w-5 h-5" />
                  Tax Strategies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm space-y-2">
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium">Annual Gifting</div>
                    <p className="text-muted-foreground text-xs mt-1">
                      $18,000 per recipient (2024) reduces taxable estate
                    </p>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium">Charitable Deduction</div>
                    <p className="text-muted-foreground text-xs mt-1">
                      Unlimited deduction for qualified charities
                    </p>
                  </div>
                  
                  {estateRules.communityProperty && (
                    <div className="p-3 border rounded-lg bg-blue-50">
                      <div className="font-medium text-blue-900">Community Property</div>
                      <p className="text-blue-700 text-xs mt-1">
                        Step-up in basis for entire community property
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}