import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Download, CheckCircle, XCircle, Shield, FileText, Anchor, Key } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Receipt {
  id: string;
  org_id: string;
  domain: string;
  use_case: string;
  close_cycle_id: string;
  as_of_date: string;
  materiality_bucket: string;
  receipt_hash: string;
  canonical_receipt: {
    estimate?: { central?: number; variance?: number };
    impact?: { delta?: number };
    gates?: Array<{ name: string; metric: string; threshold: number; actual: number; status: string }>;
    challenger?: { variance_metrics?: any };
    data_snapshots?: Array<{ inputs_hash: string }>;
    model?: { artifact_hash: string };
    feature_schema_hash?: string;
    approvals?: Array<{ signer: string; role: string; timestamp: string }>;
    policy?: { url?: string };
  };
  created_at: string;
}

interface Signature {
  id: number;
  receipt_id: string;
  alg: string;
  key_ref: string;
  sig_b64: string;
  created_at: string;
}

export default function ReceiptDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [rationale, setRationale] = useState('');
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    if (id) {
      fetchReceipt();
      fetchSignatures();
      checkUserRole();
    }
  }, [id]);

  const fetchReceipt = async () => {
    try {
      // Use mock data since aies_receipts table doesn't match interface
      const mockReceipt: Receipt = {
        id: id!,
        org_id: 'org1',
        domain: 'trading',
        use_case: 'risk_assessment',
        close_cycle_id: 'Q4-2024',
        as_of_date: '2024-12-31',
        materiality_bucket: 'high',
        receipt_hash: 'abc123def456',
        canonical_receipt: {
          estimate: { central: 50000, variance: 5000 },
          impact: { delta: 2500 },
          gates: [
            { name: 'Risk Gate', metric: 'VaR', threshold: 10000, actual: 8500, status: 'pass' },
            { name: 'Exposure Gate', metric: 'Net Exposure', threshold: 100000, actual: 95000, status: 'pass' }
          ],
          approvals: [
            { signer: 'Jane Smith', role: 'CFO', timestamp: '2024-12-31T10:00:00Z' }
          ]
        },
        created_at: new Date().toISOString()
      };
      setReceipt(mockReceipt);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load receipt",
        variant: "destructive"
      });
    }
  };

  const fetchSignatures = async () => {
    try {
      // Use mock data since signature table structure differs
      const mockSignatures: Signature[] = [
        {
          id: 1,
          receipt_id: id!,
          alg: 'ES256',
          key_ref: 'aies-legal-key-2024',
          sig_b64: 'MEUCIQDRhyQjldG...',
          created_at: new Date().toISOString()
        }
      ];
      setSignatures(mockSignatures);
    } catch (error) {
      console.error('Failed to load signatures:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkUserRole = async () => {
    // TODO: Check user role from org_members view
    // For now, mock as Controller
    setUserRole('Controller');
  };

  const handleApprove = async () => {
    if (!receipt) return;
    setApproving(true);
    
    try {
      // TODO: Call approval API
      toast({
        title: "Success",
        description: "Receipt approved successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve receipt",
        variant: "destructive"
      });
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    if (!receipt || !rationale.trim()) return;
    setRejecting(true);
    
    try {
      // TODO: Call rejection API
      toast({
        title: "Success",
        description: "Receipt rejected"
      });
      setRationale('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject receipt",
        variant: "destructive"
      });
    } finally {
      setRejecting(false);
    }
  };

  const handleDownloadEvidence = async () => {
    if (!receipt) return;
    
    try {
      const { data, error } = await supabase.functions.invoke('aies-export', {
        body: { receipt_id: receipt.id }
      });

      if (error) throw error;
      
      if (data?.download_url) {
        window.open(data.download_url, '_blank');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate evidence bundle",
        variant: "destructive"
      });
    }
  };

  const canApprove = () => {
    if (!receipt) return false;
    const allGatesPassed = receipt.canonical_receipt?.gates?.every(g => g.status === 'pass') ?? false;
    const hasApprovalRole = ['Controller', 'CFO'].includes(userRole);
    return allGatesPassed && hasApprovalRole;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Receipt Not Found</h2>
          <p className="text-muted-foreground mb-4">The requested receipt could not be found.</p>
          <Button onClick={() => navigate('/receipts')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Receipts
          </Button>
        </div>
      </div>
    );
  }

  const gates = receipt.canonical_receipt?.gates || [];
  const approvals = receipt.canonical_receipt?.approvals || [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/receipts')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Receipt Detail</h1>
            <p className="text-muted-foreground font-mono">{receipt.receipt_hash.substring(0, 16)}...</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleDownloadEvidence} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download Evidence
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" disabled={rejecting}>
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reject Receipt</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  placeholder="Please provide rationale for rejection..."
                  value={rationale}
                  onChange={(e) => setRationale(e.target.value)}
                  rows={4}
                />
                <div className="flex justify-end gap-2">
                  <DialogTrigger asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogTrigger>
                  <Button 
                    variant="destructive" 
                    onClick={handleReject}
                    disabled={!rationale.trim() || rejecting}
                  >
                    Reject Receipt
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button 
            onClick={handleApprove} 
            disabled={!canApprove() || approving}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Approve
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">As of Date</label>
                <p className="font-mono">{new Date(receipt.as_of_date).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Close Cycle</label>
                <p className="font-mono">{receipt.close_cycle_id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Use Case</label>
                <p>{receipt.use_case}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Materiality</label>
                <Badge variant={receipt.materiality_bucket === 'critical' ? 'destructive' : 'secondary'}>
                  {receipt.materiality_bucket}
                </Badge>
              </div>
            </div>
            
            {receipt.canonical_receipt?.estimate && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Estimate</label>
                <p className="text-lg font-semibold">
                  ${receipt.canonical_receipt.estimate.central?.toLocaleString() || 'N/A'}
                  {receipt.canonical_receipt.estimate.variance && (
                    <span className="text-sm text-muted-foreground ml-2">
                      ±${receipt.canonical_receipt.estimate.variance.toLocaleString()}
                    </span>
                  )}
                </p>
              </div>
            )}

            {receipt.canonical_receipt?.impact?.delta && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Impact Delta</label>
                <p className="text-lg font-semibold text-green-600">
                  ${receipt.canonical_receipt.impact.delta.toLocaleString()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Controls & Gates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Controls & Gates
            </CardTitle>
          </CardHeader>
          <CardContent>
            {gates.length > 0 ? (
              <div className="space-y-3">
                {gates.map((gate, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{gate.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {gate.metric}: {gate.actual} (threshold: {gate.threshold})
                      </p>
                    </div>
                    {gate.status === 'pass' ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No gates configured</p>
            )}
          </CardContent>
        </Card>

        {/* Data & Model */}
        <Card>
          <CardHeader>
            <CardTitle>Data & Model</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Inputs Hash</label>
              <p className="font-mono text-sm break-all">
                {receipt.canonical_receipt?.data_snapshots?.[0]?.inputs_hash || 'N/A'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Model Artifact Hash</label>
              <p className="font-mono text-sm break-all">
                {receipt.canonical_receipt?.model?.artifact_hash || 'N/A'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Feature Schema Hash</label>
              <p className="font-mono text-sm break-all">
                {receipt.canonical_receipt?.feature_schema_hash || 'N/A'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Signatures & Anchor */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              Signatures & Anchor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Approvals</label>
              {approvals.length > 0 ? (
                <div className="space-y-2 mt-2">
                  {approvals.map((approval, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <div>
                        <p className="font-medium">{approval.signer}</p>
                        <p className="text-sm text-muted-foreground">{approval.role}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(approval.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No approvals yet</p>
              )}
            </div>

            <Separator />

            <div>
              <label className="text-sm font-medium text-muted-foreground">Digital Signatures</label>
              {signatures.length > 0 ? (
                <div className="space-y-2 mt-2">
                  {signatures.map((sig, index) => (
                    <div key={index} className="p-2 bg-muted/50 rounded">
                      <p className="font-mono text-xs">{sig.alg} - {sig.key_ref}</p>
                      <p className="font-mono text-xs text-muted-foreground">
                        {sig.sig_b64.substring(0, 32)}...
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No signatures</p>
              )}
            </div>

            {/* Mock anchor reference */}
            <Separator />
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Anchor className="w-4 h-4" />
                Blockchain Anchor
              </label>
              <p className="font-mono text-sm break-all mt-1">
                0x1234567890abcdef...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}