import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  Plus, 
  Eye, 
  EyeOff, 
  Clock, 
  CheckCircle, 
  FileText,
  TrendingUp,
  Shield,
  Search,
  Filter,
  Calendar
} from 'lucide-react';

interface ComplianceIncident {
  id: string;
  title: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  discoveryDate: string;
  reportedBy?: string;
  assignedTo?: string;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  isAnonymous: boolean;
  resolutionDate?: string;
  estimatedCost?: number;
  actualCost?: number;
  regulatoryFilingRequired: boolean;
  correctiveActions: string[];
  preventionMeasures: string[];
  tags: string[];
}

export const ComplianceIncidentReporting: React.FC = () => {
  const [incidents] = useState<ComplianceIncident[]>([
    {
      id: '1',
      title: 'Client Data Privacy Breach',
      type: 'Data Security',
      severity: 'high',
      description: 'Unauthorized access to client personal information due to misconfigured database permissions.',
      discoveryDate: '2024-01-15',
      reportedBy: 'IT Security Team',
      assignedTo: 'Chief Compliance Officer',
      status: 'investigating',
      isAnonymous: false,
      estimatedCost: 15000,
      regulatoryFilingRequired: true,
      correctiveActions: ['Patch database security', 'Notify affected clients', 'Review access controls'],
      preventionMeasures: ['Enhanced security training', 'Regular access audits', 'Automated monitoring'],
      tags: ['cybersecurity', 'privacy', 'client-data']
    },
    {
      id: '2',
      title: 'Improper Fee Disclosure',
      type: 'Fee Compliance',
      severity: 'medium',
      description: 'Client charged incorrect advisory fees due to miscalculation in fee schedule.',
      discoveryDate: '2024-01-10',
      reportedBy: 'Anonymous',
      assignedTo: 'Operations Manager',
      status: 'resolved',
      isAnonymous: true,
      resolutionDate: '2024-01-18',
      actualCost: 2500,
      regulatoryFilingRequired: false,
      correctiveActions: ['Refund excess fees', 'Update fee calculation system', 'Client notification'],
      preventionMeasures: ['Automated fee validation', 'Monthly fee reconciliation', 'Staff training'],
      tags: ['fees', 'client-billing', 'operations']
    },
    {
      id: '3',
      title: 'Unsuitable Investment Recommendation',
      type: 'Suitability',
      severity: 'critical',
      description: 'High-risk investment recommended to conservative client without proper risk assessment.',
      discoveryDate: '2024-01-08',
      reportedBy: 'Branch Manager',
      assignedTo: 'Chief Investment Officer',
      status: 'open',
      isAnonymous: false,
      estimatedCost: 50000,
      regulatoryFilingRequired: true,
      correctiveActions: ['Review investment', 'Client consultation', 'Advisor retraining'],
      preventionMeasures: ['Enhanced suitability controls', 'Investment approval process', 'Client risk profiling'],
      tags: ['suitability', 'investment', 'risk-management']
    }
  ]);

  const [selectedIncident, setSelectedIncident] = useState<ComplianceIncident | null>(null);
  const [showAnonymousForm, setShowAnonymousForm] = useState(false);

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'high':
        return <Badge variant="destructive" className="bg-orange-500">High</Badge>;
      case 'medium':
        return <Badge variant="default" className="bg-yellow-500">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="destructive">Open</Badge>;
      case 'investigating':
        return <Badge variant="default" className="bg-primary">Investigating</Badge>;
      case 'resolved':
        return <Badge variant="default" className="bg-success">Resolved</Badge>;
      case 'closed':
        return <Badge variant="outline">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getOpenIncidents = () => incidents.filter(i => ['open', 'investigating'].includes(i.status));
  const getCriticalIncidents = () => incidents.filter(i => i.severity === 'critical');
  const getRecentIncidents = () => incidents.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-8 w-8 text-destructive" />
          <div>
            <h2 className="text-2xl font-display font-bold">Incident Reporting</h2>
            <p className="text-muted-foreground">Track and manage compliance violations and incidents</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={showAnonymousForm} onOpenChange={setShowAnonymousForm}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <EyeOff className="h-4 w-4 mr-2" />
                Anonymous Report
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <EyeOff className="h-5 w-5" />
                  Anonymous Incident Report
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Your identity will be kept completely confidential. This report will help maintain compliance and ethics standards.
                  </p>
                </div>
                <div>
                  <Label htmlFor="incident-type">Incident Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select incident type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="data-security">Data Security</SelectItem>
                      <SelectItem value="fee-compliance">Fee Compliance</SelectItem>
                      <SelectItem value="suitability">Suitability</SelectItem>
                      <SelectItem value="ethics">Ethics Violation</SelectItem>
                      <SelectItem value="discrimination">Discrimination</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="severity">Severity</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Describe the incident in detail..." 
                    rows={4}
                  />
                </div>
                <Button className="w-full btn-primary-gold">Submit Anonymous Report</Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="btn-primary-gold">
                <Plus className="h-4 w-4 mr-2" />
                Report Incident
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Report New Incident</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="incident-title">Incident Title</Label>
                  <Input id="incident-title" placeholder="Brief description..." />
                </div>
                <div>
                  <Label htmlFor="incident-type">Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="data-security">Data Security</SelectItem>
                      <SelectItem value="fee-compliance">Fee Compliance</SelectItem>
                      <SelectItem value="suitability">Suitability</SelectItem>
                      <SelectItem value="ethics">Ethics Violation</SelectItem>
                      <SelectItem value="regulatory">Regulatory</SelectItem>
                      <SelectItem value="operational">Operational</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="severity">Severity</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="discovery-date">Discovery Date</Label>
                  <Input id="discovery-date" type="date" />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="description">Detailed Description</Label>
                  <Textarea id="description" placeholder="Provide detailed information about the incident..." rows={4} />
                </div>
                <div>
                  <Label htmlFor="estimated-cost">Estimated Cost ($)</Label>
                  <Input id="estimated-cost" type="number" placeholder="0" />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="regulatory-filing" />
                  <Label htmlFor="regulatory-filing">Regulatory filing required</Label>
                </div>
                <div className="md:col-span-2 flex gap-2">
                  <Button className="flex-1 btn-primary-gold">Submit Report</Button>
                  <Button variant="outline" className="flex-1">Save as Draft</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="premium-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{incidents.length}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Open Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{getOpenIncidents().length}</div>
            <p className="text-xs text-muted-foreground mt-1">Require attention</p>
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{getCriticalIncidents().length}</div>
            <p className="text-xs text-muted-foreground mt-1">High priority</p>
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{incidents.filter(i => new Date(i.discoveryDate) > new Date(Date.now() - 30*24*60*60*1000)).length}</div>
            <p className="text-xs text-muted-foreground mt-1">New incidents</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="incidents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="incidents">All Incidents</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="incidents">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search incidents..." className="pl-10" />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            {incidents.map((incident) => (
              <Card 
                key={incident.id} 
                className="premium-card cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedIncident(incident)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {getSeverityBadge(incident.severity)}
                        {getStatusBadge(incident.status)}
                        {incident.isAnonymous && (
                          <Badge variant="outline" className="bg-muted">
                            <EyeOff className="h-3 w-3 mr-1" />
                            Anonymous
                          </Badge>
                        )}
                        {incident.regulatoryFilingRequired && (
                          <Badge variant="outline" className="bg-warning/10 text-warning">
                            Regulatory Filing
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg">{incident.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">Type: {incident.type}</p>
                    </div>
                    
                    <div className="text-right text-sm text-muted-foreground">
                      <div>Discovered: {new Date(incident.discoveryDate).toLocaleDateString()}</div>
                      {incident.resolutionDate && (
                        <div>Resolved: {new Date(incident.resolutionDate).toLocaleDateString()}</div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm mb-3">{incident.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Reported by:</span>
                      <div className="font-medium">{incident.isAnonymous ? 'Anonymous' : incident.reportedBy}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Assigned to:</span>
                      <div className="font-medium">{incident.assignedTo || 'Unassigned'}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Estimated Cost:</span>
                      <div className="font-medium">
                        {incident.estimatedCost ? `$${incident.estimatedCost.toLocaleString()}` : 'N/A'}
                      </div>
                    </div>
                  </div>
                  
                  {incident.tags.length > 0 && (
                    <div className="flex gap-1 mt-3">
                      {incident.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Incidents by Severity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['critical', 'high', 'medium', 'low'].map((severity) => {
                    const count = incidents.filter(i => i.severity === severity).length;
                    const percentage = incidents.length > 0 ? (count / incidents.length) * 100 : 0;
                    return (
                      <div key={severity} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`h-3 w-3 rounded-full ${
                            severity === 'critical' ? 'bg-red-500' :
                            severity === 'high' ? 'bg-orange-500' :
                            severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                          }`} />
                          <span className="capitalize">{severity}</span>
                        </div>
                        <span className="font-medium">{count} ({percentage.toFixed(0)}%)</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Incidents by Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from(new Set(incidents.map(i => i.type))).map((type) => {
                    const count = incidents.filter(i => i.type === type).length;
                    const percentage = incidents.length > 0 ? (count / incidents.length) * 100 : 0;
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <span>{type}</span>
                        <span className="font-medium">{count} ({percentage.toFixed(0)}%)</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <Card className="premium-card">
            <CardHeader>
              <CardTitle>Incident Reports & Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Monthly Incident Summary</h4>
                    <p className="text-sm text-muted-foreground">Overview of incidents by type and severity</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Regulatory Filing Report</h4>
                    <p className="text-sm text-muted-foreground">Incidents requiring regulatory disclosure</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Trend Analysis Report</h4>
                    <p className="text-sm text-muted-foreground">Identify patterns and improvement opportunities</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Incident Detail Modal */}
      {selectedIncident && (
        <Dialog open={!!selectedIncident} onOpenChange={() => setSelectedIncident(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                {selectedIncident.title}
                {getSeverityBadge(selectedIncident.severity)}
                {getStatusBadge(selectedIncident.status)}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                <div>
                  <div className="text-sm text-muted-foreground">Discovery Date</div>
                  <div className="font-medium">{new Date(selectedIncident.discoveryDate).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Reported By</div>
                  <div className="font-medium">{selectedIncident.isAnonymous ? 'Anonymous' : selectedIncident.reportedBy}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Assigned To</div>
                  <div className="font-medium">{selectedIncident.assignedTo || 'Unassigned'}</div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Description</h4>
                <p className="text-sm leading-relaxed">{selectedIncident.description}</p>
              </div>

              {selectedIncident.correctiveActions.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Corrective Actions</h4>
                  <div className="space-y-2">
                    {selectedIncident.correctiveActions.map((action, index) => (
                      <div key={index} className="flex items-start gap-3 text-sm">
                        <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                        <span>{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedIncident.preventionMeasures.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Prevention Measures</h4>
                  <div className="space-y-2">
                    {selectedIncident.preventionMeasures.map((measure, index) => (
                      <div key={index} className="flex items-start gap-3 text-sm">
                        <Shield className="h-4 w-4 text-primary mt-0.5" />
                        <span>{measure}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Financial Impact</h4>
                  <div className="text-sm space-y-1">
                    {selectedIncident.estimatedCost && (
                      <div>Estimated Cost: ${selectedIncident.estimatedCost.toLocaleString()}</div>
                    )}
                    {selectedIncident.actualCost && (
                      <div>Actual Cost: ${selectedIncident.actualCost.toLocaleString()}</div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Regulatory Requirements</h4>
                  <div className="text-sm">
                    {selectedIncident.regulatoryFilingRequired ? (
                      <div className="flex items-center gap-2 text-warning">
                        <AlertTriangle className="h-4 w-4" />
                        Regulatory filing required
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-success">
                        <CheckCircle className="h-4 w-4" />
                        No regulatory filing required
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="btn-primary-gold">Update Status</Button>
                <Button variant="outline">Add Note</Button>
                <Button variant="outline">Export Details</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};