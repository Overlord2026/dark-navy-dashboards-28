import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Download, 
  Search, 
  AlertTriangle, 
  CheckCircle,
  Eye,
  FileText,
  Anchor,
  RefreshCw,
  Zap,
  Database
} from 'lucide-react';
import { NILProofSystem, type ProofSlip } from '@/lib/nil/proofSlips';
import { Separator } from '@/components/ui/separator';

interface AuditResult {
  id: string;
  category: string;
  status: 'pass' | 'warning' | 'fail';
  message: string;
  details?: any;
  timestamp: string;
}

const NILAdminAnchors = () => {
  const [proofSlips, setProofSlips] = useState<ProofSlip[]>([]);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [auditResults, setAuditResults] = useState<AuditResult[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [exportProgress, setExportProgress] = useState<string | null>(null);

  useEffect(() => {
    loadProofSlips();
  }, []);

  const loadProofSlips = async () => {
    try {
      const slips = await NILProofSystem.getProofSlips();
      setProofSlips(slips);
    } catch (error) {
      console.error('Failed to load proof slips:', error);
    }
  };

  const handleVerifyAll = async () => {
    setIsVerifying(true);
    try {
      const result = await NILProofSystem.verifyMerkleTree();
      setVerificationResult(result);
      
      // Simulate anchoring process
      setTimeout(() => {
        setVerificationResult(prev => ({
          ...prev,
          anchorTxId: '0x' + Math.random().toString(16).substr(2, 40),
          blockHeight: Math.floor(Math.random() * 1000000) + 800000
        }));
      }, 2000);
    } catch (error) {
      console.error('Verification failed:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRunAudit = async () => {
    setIsAuditing(true);
    setAuditResults([]);
    
    try {
      // Simulate comprehensive audit
      const auditChecks = [
        { category: 'Data Integrity', check: 'proof_slip_consistency' },
        { category: 'FTC Compliance', check: 'disclosure_requirements' },
        { category: 'School Policy', check: 'policy_adherence' },
        { category: 'Training Records', check: 'education_completion' },
        { category: 'Financial Tracking', check: 'payment_validation' },
        { category: 'Dispute Resolution', check: 'delta_tracking' }
      ];

      for (let i = 0; i < auditChecks.length; i++) {
        const check = auditChecks[i];
        
        // Simulate audit delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const result = await runAuditCheck(check);
        setAuditResults(prev => [...prev, result]);
      }
    } catch (error) {
      console.error('Audit failed:', error);
    } finally {
      setIsAuditing(false);
    }
  };

  const runAuditCheck = async (check: any): Promise<AuditResult> => {
    // Simulate audit logic
    const passRate = Math.random();
    let status: 'pass' | 'warning' | 'fail';
    let message: string;

    if (passRate > 0.8) {
      status = 'pass';
      message = `${check.category} audit passed all checks`;
    } else if (passRate > 0.6) {
      status = 'warning';
      message = `${check.category} audit found minor issues`;
    } else {
      status = 'fail';
      message = `${check.category} audit found critical issues`;
    }

    return {
      id: crypto.randomUUID(),
      category: check.category,
      status,
      message,
      details: {
        checkType: check.check,
        score: Math.round(passRate * 100),
        itemsChecked: Math.floor(Math.random() * 100) + 10,
        issues: status === 'fail' ? Math.floor(Math.random() * 5) + 1 : 0
      },
      timestamp: new Date().toISOString()
    };
  };

  const handleExportEvidence = async () => {
    setExportProgress('Preparing export...');
    
    try {
      const { manifest, files } = await NILProofSystem.exportEvidence();
      
      setExportProgress('Generating ZIP archive...');
      
      // Simulate ZIP creation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create and download the evidence package
      const blob = new Blob([JSON.stringify(files, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nil-evidence-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setExportProgress('Export complete!');
      setTimeout(() => setExportProgress(null), 2000);
    } catch (error) {
      console.error('Export failed:', error);
      setExportProgress('Export failed');
      setTimeout(() => setExportProgress(null), 3000);
    }
  };

  const filteredProofSlips = proofSlips.filter(slip => 
    slip.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    slip.entityId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    slip.reasons.some(reason => reason.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pass':
        return <Badge variant="success">Pass</Badge>;
      case 'warning':
        return <Badge variant="warning">Warning</Badge>;
      case 'fail':
        return <Badge variant="destructive">Fail</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const proofSlipStats = {
    total: proofSlips.length,
    anchored: proofSlips.filter(p => p.anchored).length,
    pending: proofSlips.filter(p => !p.anchored).length,
    byType: proofSlips.reduce((acc, slip) => {
      acc[slip.type] = (acc[slip.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">NIL Admin: Anchors & Audits</h1>
          <p className="text-muted-foreground">Verification system and compliance auditing</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportEvidence} disabled={!!exportProgress}>
            <Download className="h-4 w-4 mr-2" />
            {exportProgress || 'Export Evidence'}
          </Button>
          <Button onClick={handleRunAudit} disabled={isAuditing}>
            <Zap className="h-4 w-4 mr-2" />
            {isAuditing ? 'Running Audit...' : 'Run Audit'}
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Proof Slips</p>
                <p className="text-2xl font-bold">{proofSlipStats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Anchored</p>
                <p className="text-2xl font-bold">{proofSlipStats.anchored}</p>
              </div>
              <Anchor className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{proofSlipStats.pending}</p>
              </div>
              <RefreshCw className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Verification</p>
                <p className="text-2xl font-bold">
                  {verificationResult ? (verificationResult.verified ? '✓' : '✗') : '—'}
                </p>
              </div>
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="verification" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="proofslips">Proof Slips</TabsTrigger>
          <TabsTrigger value="audits">Audit Results</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="verification" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Merkle Tree Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Button onClick={handleVerifyAll} disabled={isVerifying}>
                  <Shield className="h-4 w-4 mr-2" />
                  {isVerifying ? 'Verifying...' : 'Verify All'}
                </Button>
                
                {verificationResult && (
                  <Badge variant={verificationResult.verified ? 'success' : 'destructive'}>
                    {verificationResult.verified ? 'Verified' : 'Issues Found'}
                  </Badge>
                )}
              </div>

              {verificationResult && (
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Verification Results</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Status:</span>
                        <span className={`ml-2 font-medium ${verificationResult.verified ? 'text-success' : 'text-destructive'}`}>
                          {verificationResult.verified ? 'VERIFIED' : 'FAILED'}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Records Checked:</span>
                        <span className="ml-2 font-medium">{proofSlips.length}</span>
                      </div>
                      {verificationResult.anchorTxId && (
                        <>
                          <div>
                            <span className="text-muted-foreground">Anchor TX:</span>
                            <span className="ml-2 font-mono text-xs">{verificationResult.anchorTxId}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Block Height:</span>
                            <span className="ml-2 font-medium">{verificationResult.blockHeight}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {verificationResult.differences && verificationResult.differences.length > 0 && (
                    <div className="p-4 border-l-4 border-warning bg-warning/10 rounded">
                      <h4 className="font-medium text-warning-foreground mb-2">Issues Detected</h4>
                      <ul className="space-y-1 text-sm">
                        {verificationResult.differences.map((diff: string, index: number) => (
                          <li key={index} className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-warning" />
                            {diff}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="proofslips" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Proof Slips Registry
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  <Input
                    placeholder="Search proof slips..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredProofSlips.map((slip) => (
                  <div key={slip.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{slip.type}</Badge>
                          <Badge variant={slip.anchored ? 'success' : 'warning'}>
                            {slip.anchored ? 'Anchored' : 'Pending'}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium">Entity: {slip.entityId}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(slip.timestamp).toLocaleString()}
                        </p>
                      </div>
                      
                      <div className="text-right space-y-1">
                        <div className="text-xs text-muted-foreground">
                          Reasons: {slip.reasons.length}
                        </div>
                        <div className="font-mono text-xs">
                          {slip.merkleLeaf.substring(0, 12)}...
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredProofSlips.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No proof slips found matching your search.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audits" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Compliance Audit Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              {auditResults.length === 0 && !isAuditing && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No audit results available</p>
                  <Button onClick={handleRunAudit}>
                    <Zap className="h-4 w-4 mr-2" />
                    Run Compliance Audit
                  </Button>
                </div>
              )}

              {isAuditing && (
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                  <p className="text-muted-foreground">Running comprehensive audit...</p>
                </div>
              )}

              {auditResults.length > 0 && (
                <div className="space-y-4">
                  {auditResults.map((result) => (
                    <div key={result.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{result.category}</h4>
                            {getStatusBadge(result.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">{result.message}</p>
                          {result.details && (
                            <div className="text-xs text-muted-foreground mt-2">
                              Score: {result.details.score}% • 
                              Items: {result.details.itemsChecked} • 
                              Issues: {result.details.issues}
                            </div>
                          )}
                        </div>
                        
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">
                            {new Date(result.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Proof Slip Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(proofSlipStats.byType).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-sm">{type}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary rounded-full h-2 transition-all"
                            style={{ width: `${(count / proofSlipStats.total) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Anchoring Status</span>
                    <Badge variant={proofSlipStats.anchored > 0 ? 'success' : 'warning'}>
                      {Math.round((proofSlipStats.anchored / proofSlipStats.total) * 100)}%
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Data Integrity</span>
                    <Badge variant={verificationResult?.verified ? 'success' : 'secondary'}>
                      {verificationResult?.verified ? 'Verified' : 'Pending'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Audit Status</span>
                    <Badge variant={auditResults.length > 0 ? 'success' : 'secondary'}>
                      {auditResults.length > 0 ? 'Complete' : 'Not Run'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NILAdminAnchors;