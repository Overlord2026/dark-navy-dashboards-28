import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Plus, 
  Download, 
  Search, 
  Calendar,
  Building2,
  Link2,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface IPFiling {
  id: string;
  title: string;
  type: 'patent' | 'trademark' | 'copyright' | 'trade_secret';
  status: 'draft' | 'filed' | 'pending' | 'approved' | 'rejected';
  applicationNumber?: string;
  filingDate?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  family: string; // E, Y, V, R, H, K, etc.
  assignedTo: string;
  cost: number;
  timeline: IPTimeline[];
  crossReferences: string[];
  artifacts: IPArtifact[];
}

interface IPTimeline {
  id: string;
  date: string;
  action: string;
  status: 'pending' | 'completed' | 'overdue';
  notes?: string;
}

interface IPArtifact {
  id: string;
  name: string;
  type: 'specification' | 'claims' | 'drawings' | 'ids' | 'cross_ref' | 'figures';
  url?: string;
  status: 'draft' | 'final' | 'filed';
}

const IP_FAMILIES = ['E', 'Y', 'V', 'R', 'H', 'K', 'M', 'N', 'P', 'Q', 'S', 'T', 'U', 'W', 'X', 'Z'];
const IP_TYPES = ['patent', 'trademark', 'copyright', 'trade_secret'] as const;
const FILING_STATUSES = ['draft', 'filed', 'pending', 'approved', 'rejected'] as const;

// Mock data
const MOCK_FILINGS: IPFiling[] = [
  {
    id: '1',
    title: 'AI-Powered Portfolio Optimization System',
    type: 'patent',
    status: 'pending',
    applicationNumber: 'US17/123,456',
    filingDate: '2024-01-15',
    priority: 'high',
    family: 'E',
    assignedTo: 'John Smith',
    cost: 15000,
    timeline: [
      { id: '1', date: '2024-01-15', action: 'Initial Filing', status: 'completed' },
      { id: '2', date: '2024-04-15', action: 'Response Due', status: 'pending' }
    ],
    crossReferences: ['US16/987,654', 'US17/111,222'],
    artifacts: [
      { id: '1', name: 'Specification', type: 'specification', status: 'filed' },
      { id: '2', name: 'Claims', type: 'claims', status: 'filed' },
      { id: '3', name: 'Drawings', type: 'drawings', status: 'filed' }
    ]
  },
  {
    id: '2',
    title: 'BFO Platform Trademark',
    type: 'trademark',
    status: 'approved',
    applicationNumber: 'US90/123,789',
    filingDate: '2023-08-10',
    priority: 'medium',
    family: 'Y',
    assignedTo: 'Sarah Johnson',
    cost: 5000,
    timeline: [
      { id: '1', date: '2023-08-10', action: 'Filing', status: 'completed' },
      { id: '2', date: '2024-01-10', action: 'Approval', status: 'completed' }
    ],
    crossReferences: [],
    artifacts: [
      { id: '1', name: 'Logo Design', type: 'drawings', status: 'final' }
    ]
  }
];

export function IPTracker() {
  const { toast } = useToast();
  const [filings, setFilings] = useState<IPFiling[]>(MOCK_FILINGS);
  const [selectedFiling, setSelectedFiling] = useState<IPFiling | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredFilings = filings.filter(filing => {
    const matchesSearch = filing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         filing.applicationNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || filing.status === filterStatus;
    const matchesType = filterType === 'all' || filing.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const generateCrossReferences = (filing: IPFiling): string[] => {
    // Auto-suggest cross-references based on family
    const familyFilings = filings.filter(f => 
      f.family === filing.family && 
      f.id !== filing.id &&
      f.applicationNumber
    );
    
    return familyFilings.map(f => f.applicationNumber!);
  };

  const generateIDSStub = (filing: IPFiling) => {
    // Generate IDS stub document
    const idsContent = `
INFORMATION DISCLOSURE STATEMENT

Application Number: ${filing.applicationNumber || 'TBD'}
Title: ${filing.title}
Filing Date: ${filing.filingDate || 'TBD'}

CROSS-REFERENCES:
${filing.crossReferences.map(ref => `• ${ref}`).join('\n')}

RELATED APPLICATIONS:
${generateCrossReferences(filing).map(ref => `• ${ref} (Same Family: ${filing.family})`).join('\n')}

PRIOR ART REFERENCES:
[To be completed during examination]

REMARKS:
This Information Disclosure Statement is submitted in compliance with 37 CFR 1.97 and 1.98.
The information disclosed herein is being provided to assist the Patent Office in the examination of this application.

Respectfully submitted,

[Attorney Name]
Registration No. [Number]
Attorney for Applicant
    `.trim();

    // Create and download file
    const blob = new Blob([idsContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IDS-${filing.applicationNumber || filing.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "IDS Stub Generated",
      description: `Information Disclosure Statement stub downloaded for ${filing.title}`,
    });
  };

  const generateCrossRefParagraph = (filing: IPFiling): string => {
    const crossRefs = [...filing.crossReferences, ...generateCrossReferences(filing)];
    
    if (crossRefs.length === 0) {
      return "This application does not claim priority to or the benefit of any prior applications.";
    }

    return `This application claims priority to and the benefit of the following applications: ${
      crossRefs.map((ref, idx) => 
        `${idx > 0 ? (idx === crossRefs.length - 1 ? ', and ' : ', ') : ''}U.S. Application No. ${ref}`
      ).join('')
    }, the entire contents of which are incorporated herein by reference.`;
  };

  const handleAddFiling = (newFiling: Partial<IPFiling>) => {
    const filing: IPFiling = {
      id: Date.now().toString(),
      title: newFiling.title || '',
      type: newFiling.type || 'patent',
      status: 'draft',
      priority: newFiling.priority || 'medium',
      family: newFiling.family || 'E',
      assignedTo: newFiling.assignedTo || '',
      cost: newFiling.cost || 0,
      timeline: [],
      crossReferences: newFiling.crossReferences || [],
      artifacts: []
    };

    // Auto-suggest cross-references
    const suggestions = generateCrossReferences(filing);
    if (suggestions.length > 0) {
      filing.crossReferences = suggestions;
      toast({
        title: "Cross-References Suggested",
        description: `Found ${suggestions.length} related applications in family ${filing.family}`,
      });
    }

    setFilings(prev => [...prev, filing]);
    setShowAddDialog(false);
    
    toast({
      title: "Filing Added",
      description: `${filing.title} has been added to the IP tracker`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'rejected': return 'bg-red-500';
      case 'filed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">IP Filing Tracker</h2>
          <p className="text-muted-foreground">
            Manage patents, trademarks, and IP portfolio
          </p>
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Filing
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New IP Filing</DialogTitle>
            </DialogHeader>
            <AddFilingForm onSubmit={handleAddFiling} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 p-4 bg-muted rounded-lg">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search filings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {FILING_STATUSES.map(status => (
              <SelectItem key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {IP_TYPES.map(type => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filings Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>IP Filings ({filteredFilings.length})</CardTitle>
            <Badge variant="outline">
              Total Cost: ${filings.reduce((sum, f) => sum + f.cost, 0).toLocaleString()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Family</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFilings.map(filing => (
                <TableRow key={filing.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <div className="font-medium">{filing.title}</div>
                      {filing.applicationNumber && (
                        <div className="text-sm text-muted-foreground">
                          {filing.applicationNumber}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {filing.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(filing.status)}`} />
                      {filing.status}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {filing.family}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityColor(filing.priority)}>
                      {filing.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>${filing.cost.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedFiling(filing)}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => generateIDSStub(filing)}
                        className="gap-1"
                      >
                        <Download className="h-3 w-3" />
                        IDS
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Filing Details Dialog */}
      <Dialog open={!!selectedFiling} onOpenChange={() => setSelectedFiling(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedFiling?.title}</DialogTitle>
          </DialogHeader>
          
          {selectedFiling && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="crossrefs">Cross-Refs</TabsTrigger>
                <TabsTrigger value="artifacts">Artifacts</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Application Number</Label>
                    <p className="text-sm font-medium">
                      {selectedFiling.applicationNumber || 'Not assigned'}
                    </p>
                  </div>
                  <div>
                    <Label>Filing Date</Label>
                    <p className="text-sm font-medium">
                      {selectedFiling.filingDate || 'Not filed'}
                    </p>
                  </div>
                  <div>
                    <Label>Family</Label>
                    <Badge variant="secondary">{selectedFiling.family}</Badge>
                  </div>
                  <div>
                    <Label>Assigned To</Label>
                    <p className="text-sm font-medium">{selectedFiling.assignedTo}</p>
                  </div>
                </div>

                <div>
                  <Label>Cross-Reference Paragraph</Label>
                  <div className="p-3 bg-muted rounded-md text-sm">
                    {generateCrossRefParagraph(selectedFiling)}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="timeline" className="space-y-4">
                {selectedFiling.timeline.map(item => (
                  <div key={item.id} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(item.status)}`} />
                    <div className="flex-1">
                      <div className="font-medium">{item.action}</div>
                      <div className="text-sm text-muted-foreground">{item.date}</div>
                      {item.notes && <div className="text-sm">{item.notes}</div>}
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="crossrefs" className="space-y-4">
                <div>
                  <Label>Related Applications</Label>
                  <div className="space-y-2">
                    {selectedFiling.crossReferences.map((ref, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 border rounded">
                        <Link2 className="h-4 w-4" />
                        <span className="font-mono text-sm">{ref}</span>
                      </div>
                    ))}
                    {selectedFiling.crossReferences.length === 0 && (
                      <p className="text-sm text-muted-foreground">No cross-references</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Suggested Cross-References (Same Family)</Label>
                  <div className="space-y-2">
                    {generateCrossReferences(selectedFiling).map((ref, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 border rounded bg-muted/50">
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                        <span className="font-mono text-sm">{ref}</span>
                        <Badge variant="outline" className="ml-auto">Suggested</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="artifacts" className="space-y-4">
                <div className="space-y-2">
                  {selectedFiling.artifacts.map(artifact => (
                    <div key={artifact.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{artifact.name}</div>
                          <div className="text-sm text-muted-foreground">{artifact.type}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={artifact.status === 'final' ? 'default' : 'secondary'}>
                          {artifact.status}
                        </Badge>
                        {artifact.url && (
                          <Button size="sm" variant="outline">Download</Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AddFilingForm({ onSubmit }: { onSubmit: (filing: Partial<IPFiling>) => void }) {
  const [formData, setFormData] = useState<Partial<IPFiling>>({
    title: '',
    type: 'patent',
    priority: 'medium',
    family: 'E',
    assignedTo: '',
    cost: 0,
    crossReferences: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="type">Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {IP_TYPES.map(type => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="family">Family</Label>
          <Select
            value={formData.family}
            onValueChange={(value) => setFormData(prev => ({ ...prev, family: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {IP_FAMILIES.map(family => (
                <SelectItem key={family} value={family}>
                  Family {family}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select
            value={formData.priority}
            onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as any }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="assignedTo">Assigned To</Label>
          <Input
            id="assignedTo"
            value={formData.assignedTo}
            onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="cost">Estimated Cost ($)</Label>
          <Input
            id="cost"
            type="number"
            value={formData.cost}
            onChange={(e) => setFormData(prev => ({ ...prev, cost: parseInt(e.target.value) || 0 }))}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="crossRefs">Cross-References (one per line)</Label>
        <Textarea
          id="crossRefs"
          placeholder="US16/123,456&#10;US17/789,012"
          value={formData.crossReferences?.join('\n') || ''}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            crossReferences: e.target.value.split('\n').filter(Boolean) 
          }))}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline">Cancel</Button>
        <Button type="submit">Add Filing</Button>
      </div>
    </form>
  );
}