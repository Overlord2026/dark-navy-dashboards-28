import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  AlertTriangle, 
  FileText, 
  Archive, 
  Anchor, 
  CheckCircle, 
  XCircle,
  Calendar,
  Settings,
  Download,
  Filter,
  Eye,
  TrendingUp,
  Users,
  Clock,
  Search,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import analytics from '@/lib/analytics';
import { recordReceipt } from '@/features/receipts/record';

const SupervisorHomePage = () => {
  const [activePersonaFilter, setActivePersonaFilter] = useState('all');
  const [exceptions, setExceptions] = useState([
    {
      id: '1',
      persona: 'medicare',
      type: 'SOA_MISSING',
      severity: 'critical',
      entity: 'John Smith Lead',
      description: 'Scope of Appointment not collected within 72 hours',
      created: '2024-01-20T10:30:00Z',
      deadline: '2024-01-22T17:00:00Z'
    },
    {
      id: '2',
      persona: 'advisor',
      type: 'UNANCHORED_HIGH_RISK',
      severity: 'high',
      entity: 'Investment Recommendation - Williams Family',
      description: 'High-risk recommendation lacking blockchain anchor',
      created: '2024-01-19T14:15:00Z',
      deadline: '2024-01-21T17:00:00Z'
    },
    {
      id: '3',
      persona: 'cpa',
      type: 'MAPPING_MISSING',
      severity: 'medium',
      entity: 'Tax Return - ABC Corp',
      description: 'Client entity mapping incomplete for tax year 2023',
      created: '2024-01-18T09:45:00Z',
      deadline: '2024-01-25T17:00:00Z'
    }
  ]);

  const [stats, setStats] = useState({
    totalExceptions: 23,
    criticalExceptions: 5,
    evidencePacksGenerated: 12,
    anchorsVerified: 156,
    auditsPassed: 89,
    filingsDue: 7
  });

  useEffect(() => {
    analytics.track('supervisor.dashboard.viewed');
  }, []);

  const handleExceptionReview = (exceptionId: string, action: string) => {
    analytics.track('supervisor.exception.action', { exceptionId, action });
    
    const receipt = {
      id: `exception-${exceptionId}-${action}-${Date.now()}`,
      type: 'Decision-RDS' as const,
      timestamp: new Date().toISOString(),
      payload: {
        action: action,
        exceptionId: exceptionId,
        supervisorAction: true,
        complianceReview: true
      },
      inputs_hash: `exception-${exceptionId}-${action}`,
      policy_version: '2024.1'
    };
    
    recordReceipt(receipt);
    toast.success(`Exception ${action} recorded with compliance receipt`);
  };

  const generateEvidencePack = (persona: string) => {
    analytics.track('supervisor.evidence_pack.generated', { persona });
    
    const receipt = {
      id: `evidence-pack-${persona}-${Date.now()}`,
      type: 'Vault-RDS' as const,
      timestamp: new Date().toISOString(),
      payload: {
        action: 'evidence_pack_generated',
        persona: persona,
        contents: ['receipts.json', 'vault-index.json', 'manifest.json', 'evidence-summary.pdf'],
        anchor_verification: true,
        audit_trail: true
      },
      inputs_hash: `evidence-pack-${persona}`,
      policy_version: '2024.1'
    };
    
    recordReceipt(receipt);
    toast.success(`Evidence pack generated for ${persona} with Vault-RDS receipt`);
  };

  const runAuditScan = () => {
    analytics.track('supervisor.audit.scan_initiated');
    toast.success('Comprehensive audit scan initiated...');
  };

  const filteredExceptions = activePersonaFilter === 'all' 
    ? exceptions 
    : exceptions.filter(e => e.persona === activePersonaFilter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Shield className="text-sm font-bold text-primary-foreground" />
              </div>
              <div>
                <span className="text-xl font-semibold">Compliance Supervisor Console</span>
                <p className="text-sm text-muted-foreground">Firm-wide compliance oversight and evidence management</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">Live Monitoring</Badge>
              <Button size="sm" variant="outline" onClick={runAuditScan}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Scan
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="exceptions">Exceptions</TabsTrigger>
            <TabsTrigger value="evidence">Evidence</TabsTrigger>
            <TabsTrigger value="anchors">Anchors</TabsTrigger>
            <TabsTrigger value="audits">Audits</TabsTrigger>
            <TabsTrigger value="filings">Filings</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Exceptions</p>
                      <p className="text-2xl font-bold text-orange-600">{stats.totalExceptions}</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Critical</p>
                      <p className="text-2xl font-bold text-red-600">{stats.criticalExceptions}</p>
                    </div>
                    <XCircle className="w-8 h-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Evidence Packs</p>
                      <p className="text-2xl font-bold text-blue-600">{stats.evidencePacksGenerated}</p>
                    </div>
                    <Archive className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Anchors Verified</p>
                      <p className="text-2xl font-bold text-green-600">{stats.anchorsVerified}</p>
                    </div>
                    <Anchor className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Audits Passed</p>
                      <p className="text-2xl font-bold text-green-600">{stats.auditsPassed}%</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Filings Due</p>
                      <p className="text-2xl font-bold text-purple-600">{stats.filingsDue}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Exceptions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Critical Exceptions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {exceptions.slice(0, 3).map((exception) => (
                    <div key={exception.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Badge variant={
                          exception.severity === 'critical' ? 'destructive' : 
                          exception.severity === 'high' ? 'secondary' : 'outline'
                        }>
                          {exception.severity}
                        </Badge>
                        <div>
                          <h4 className="font-semibold">{exception.entity}</h4>
                          <p className="text-sm text-muted-foreground">{exception.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">
                          Due: {new Date(exception.deadline).toLocaleDateString()}
                        </span>
                        <Button size="sm" variant="outline" onClick={() => handleExceptionReview(exception.id, 'review')}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="exceptions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Exception Monitoring Engine</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant={activePersonaFilter === 'all' ? 'default' : 'outline'}
                    onClick={() => setActivePersonaFilter('all')}
                  >
                    All Personas
                  </Button>
                  <Button
                    size="sm"
                    variant={activePersonaFilter === 'medicare' ? 'default' : 'outline'}
                    onClick={() => setActivePersonaFilter('medicare')}
                  >
                    Medicare
                  </Button>
                  <Button
                    size="sm"
                    variant={activePersonaFilter === 'advisor' ? 'default' : 'outline'}
                    onClick={() => setActivePersonaFilter('advisor')}
                  >
                    Advisor
                  </Button>
                  <Button
                    size="sm"
                    variant={activePersonaFilter === 'cpa' ? 'default' : 'outline'}
                    onClick={() => setActivePersonaFilter('cpa')}
                  >
                    CPA
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredExceptions.map((exception) => (
                    <Card key={exception.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Badge variant={
                              exception.severity === 'critical' ? 'destructive' : 
                              exception.severity === 'high' ? 'secondary' : 'outline'
                            }>
                              {exception.severity}
                            </Badge>
                            <Badge variant="outline">{exception.persona}</Badge>
                            <div>
                              <h4 className="font-semibold">{exception.type.replace(/_/g, ' ')}</h4>
                              <p className="text-sm">{exception.entity}</p>
                              <p className="text-sm text-muted-foreground">{exception.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">
                                Created: {new Date(exception.created).toLocaleDateString()}
                              </p>
                              <p className="text-sm font-medium">
                                Due: {new Date(exception.deadline).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex flex-col space-y-1">
                              <Button size="sm" variant="outline" onClick={() => handleExceptionReview(exception.id, 'approve')}>
                                Approve
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleExceptionReview(exception.id, 'escalate')}>
                                Escalate
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="evidence" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Evidence Pack Generation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">Medicare Evidence Pack</h4>
                          <p className="text-sm text-muted-foreground">SOA, PECL, disclaimers, retention proofs</p>
                        </div>
                        <Button size="sm" onClick={() => generateEvidencePack('medicare')}>
                          <Download className="w-4 h-4 mr-2" />
                          Generate
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">Advisor Evidence Pack</h4>
                          <p className="text-sm text-muted-foreground">Anchored recommendations, risk disclosures</p>
                        </div>
                        <Button size="sm" onClick={() => generateEvidencePack('advisor')}>
                          <Download className="w-4 h-4 mr-2" />
                          Generate
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">CPA Evidence Pack</h4>
                          <p className="text-sm text-muted-foreground">Entity mappings, tax compliance receipts</p>
                        </div>
                        <Button size="sm" onClick={() => generateEvidencePack('cpa')}>
                          <Download className="w-4 h-4 mr-2" />
                          Generate
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Evidence Pack Contents</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <h5 className="font-medium">Core Files:</h5>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>receipts.json - All RDS receipts with hashes</li>
                        <li>vault-index.json - Document inventory</li>
                        <li>manifest.json - Package verification</li>
                        <li>evidence-summary.pdf - Executive summary</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium">Verification:</h5>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>SHA-256 checksums for all files</li>
                        <li>Blockchain anchor references</li>
                        <li>Timestamp proofs</li>
                        <li>Digital signatures</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="anchors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Anchor Verification Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">156</div>
                      <div className="text-sm text-muted-foreground">Verified Anchors</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">12</div>
                      <div className="text-sm text-muted-foreground">Pending Verification</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-red-600">3</div>
                      <div className="text-sm text-muted-foreground">Failed Verification</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Anchor Verification Progress</span>
                      <span>91.2%</span>
                    </div>
                    <Progress value={91.2} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audits" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Audit Results Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold text-green-600">Passed Audits</h4>
                      <div className="text-3xl font-bold">89%</div>
                      <p className="text-sm text-muted-foreground">156 of 175 checks passed</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold text-red-600">Failed Audits</h4>
                      <div className="text-3xl font-bold">11%</div>
                      <p className="text-sm text-muted-foreground">19 of 175 checks failed</p>
                    </div>
                  </div>
                  <Button className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Export Audit Results (CSV)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="filings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Filing Calendar & Attestations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-semibold">Upcoming Filings</h4>
                        <div className="space-y-2 mt-2">
                          <div className="flex justify-between">
                            <span>Form ADV Annual Update</span>
                            <span className="text-sm text-red-600">Due: Jan 25</span>
                          </div>
                          <div className="flex justify-between">
                            <span>CPA License Renewal</span>
                            <span className="text-sm text-orange-600">Due: Feb 15</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Insurance Compliance Report</span>
                            <span className="text-sm text-green-600">Due: Mar 1</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-semibold">E-Sign Attestations</h4>
                        <div className="space-y-2 mt-2">
                          <div className="flex justify-between">
                            <span>Code of Ethics - 2024</span>
                            <Badge variant="outline">Pending</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Privacy Policy Acknowledgment</span>
                            <Badge variant="default">Signed</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Compliance Training Certificate</span>
                            <Badge variant="default">Signed</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Retention Settings</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Medicare Records</span>
                        <span>10 years</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Investment Advice</span>
                        <span>7 years</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax Records</span>
                        <span>7 years</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Legal Holds</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Williams Family Litigation</span>
                        <Badge variant="destructive">Active</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>ABC Corp Audit</span>
                        <Badge variant="secondary">Pending</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Template Allowlists</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Email Templates</span>
                        <span>Approved: 23</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Document Templates</span>
                        <span>Approved: 45</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">System Settings</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Policy Version</span>
                        <span>2024.1</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Throttle Limits</span>
                        <span>1000/hour</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SupervisorHomePage;