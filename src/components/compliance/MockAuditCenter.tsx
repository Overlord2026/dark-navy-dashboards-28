import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Shield, 
  Play, 
  Pause, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  Plus,
  Download,
  Upload,
  Search
} from 'lucide-react';

interface MockAudit {
  id: string;
  name: string;
  type: 'SEC' | 'STATE' | 'FINRA' | 'DOL' | 'INSURANCE' | 'CUSTOM';
  status: 'draft' | 'in_progress' | 'completed' | 'archived';
  progress: number;
  score?: number;
  findings: number;
  criticalFindings: number;
  lastUpdated: string;
}

export const MockAuditCenter: React.FC = () => {
  const [audits] = useState<MockAudit[]>([
    {
      id: '1',
      name: 'SEC RIA Compliance Audit Q1 2024',
      type: 'SEC',
      status: 'in_progress',
      progress: 67,
      findings: 3,
      criticalFindings: 0,
      lastUpdated: '2024-01-15'
    },
    {
      id: '2',
      name: 'State Registration Renewal Audit',
      type: 'STATE',
      status: 'completed',
      progress: 100,
      score: 92,
      findings: 1,
      criticalFindings: 0,
      lastUpdated: '2024-01-10'
    },
    {
      id: '3',
      name: 'FINRA Cybersecurity Assessment',
      type: 'FINRA',
      status: 'draft',
      progress: 0,
      findings: 0,
      criticalFindings: 0,
      lastUpdated: '2024-01-05'
    }
  ]);

  const [selectedAudit, setSelectedAudit] = useState<MockAudit | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-success text-success-foreground">Completed</Badge>;
      case 'in_progress':
        return <Badge variant="default" className="bg-primary">In Progress</Badge>;
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      case 'archived':
        return <Badge variant="secondary">Archived</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      'SEC': 'bg-blue-100 text-blue-800',
      'STATE': 'bg-green-100 text-green-800',
      'FINRA': 'bg-purple-100 text-purple-800',
      'DOL': 'bg-yellow-100 text-yellow-800',
      'INSURANCE': 'bg-orange-100 text-orange-800',
      'CUSTOM': 'bg-gray-100 text-gray-800'
    };
    
    return (
      <Badge variant="outline" className={colors[type as keyof typeof colors] || colors.CUSTOM}>
        {type}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-2xl font-display font-bold">Mock Audit Center</h2>
            <p className="text-muted-foreground">SEC/State audit simulations and readiness assessments</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import Template
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="btn-primary-gold">
                <Plus className="h-4 w-4 mr-2" />
                New Audit
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Mock Audit</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="audit-name">Audit Name</Label>
                  <Input id="audit-name" placeholder="Enter audit name..." />
                </div>
                <div>
                  <Label htmlFor="audit-type">Audit Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select audit type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SEC">SEC RIA Examination</SelectItem>
                      <SelectItem value="STATE">State Registration</SelectItem>
                      <SelectItem value="FINRA">FINRA Broker-Dealer</SelectItem>
                      <SelectItem value="DOL">DOL Fiduciary</SelectItem>
                      <SelectItem value="INSURANCE">Insurance License</SelectItem>
                      <SelectItem value="CUSTOM">Custom Audit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Audit description..." />
                </div>
                <Button className="w-full btn-primary-gold">Create Audit</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Audits</TabsTrigger>
          <TabsTrigger value="templates">Audit Templates</TabsTrigger>
          <TabsTrigger value="reports">Audit Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {audits.map((audit) => (
              <Card key={audit.id} className="premium-card cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => setSelectedAudit(audit)}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{audit.name}</CardTitle>
                      <div className="flex gap-2">
                        {getTypeBadge(audit.type)}
                        {getStatusBadge(audit.status)}
                      </div>
                    </div>
                    {audit.status === 'in_progress' && (
                      <Button variant="ghost" size="sm">
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{audit.progress}%</span>
                    </div>
                    <Progress value={audit.progress} className="h-2" />
                  </div>
                  
                  {audit.score && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Score:</span>
                      <span className="font-semibold text-success">{audit.score}%</span>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Findings:</span>
                      <span className="ml-2 font-medium">{audit.findings}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Critical:</span>
                      <span className={`ml-2 font-medium ${audit.criticalFindings > 0 ? 'text-destructive' : 'text-success'}`}>
                        {audit.criticalFindings}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Last updated: {new Date(audit.lastUpdated).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  SEC RIA Examination Template
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Standard SEC examination checklist for Registered Investment Advisors including ADV compliance, custody, and recordkeeping.
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">7 Checklist Items</Badge>
                  <Button variant="outline" size="sm">Use Template</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  State Registration Audit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  State-level RIA examination template covering notice filings, supervision, and suitability procedures.
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">4 Checklist Items</Badge>
                  <Button variant="outline" size="sm">Use Template</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <Card className="premium-card">
            <CardHeader>
              <CardTitle>Audit Reports & Export</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">SEC RIA Compliance Report Q1 2024</h4>
                    <p className="text-sm text-muted-foreground">Generated on Jan 15, 2024</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      PDF
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Excel
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">State Registration Audit Summary</h4>
                    <p className="text-sm text-muted-foreground">Generated on Jan 10, 2024</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      PDF
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Excel
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Audit Detail Modal */}
      {selectedAudit && (
        <Dialog open={!!selectedAudit} onOpenChange={() => setSelectedAudit(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                {selectedAudit.name}
                {getStatusBadge(selectedAudit.status)}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{selectedAudit.progress}%</div>
                  <div className="text-sm text-muted-foreground">Progress</div>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold">{selectedAudit.findings}</div>
                  <div className="text-sm text-muted-foreground">Total Findings</div>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className={`text-2xl font-bold ${selectedAudit.criticalFindings > 0 ? 'text-destructive' : 'text-success'}`}>
                    {selectedAudit.criticalFindings}
                  </div>
                  <div className="text-sm text-muted-foreground">Critical Issues</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Checklist Progress</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">ADV Form Compliance</span>
                      <CheckCircle className="h-4 w-4 text-success" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Investment Advisory Agreements</span>
                      <CheckCircle className="h-4 w-4 text-success" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Fee Calculation Practices</span>
                      <AlertTriangle className="h-4 w-4 text-warning" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Code of Ethics</span>
                      <div className="h-4 w-4 rounded-full border-2 border-muted" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Evidence & Documentation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">ADV Part 1 & 2</span>
                      <FileText className="h-4 w-4 text-success" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Client Agreements</span>
                      <FileText className="h-4 w-4 text-success" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Fee Schedules</span>
                      <AlertTriangle className="h-4 w-4 text-warning" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Custody Documentation</span>
                      <div className="h-4 w-4 rounded-full border-2 border-muted" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex gap-2">
                <Button className="btn-primary-gold">
                  <Play className="h-4 w-4 mr-2" />
                  Continue Audit
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Evidence
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};