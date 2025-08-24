import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Download, 
  FileText, 
  Shield, 
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  Filter,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';

const RealtorProofPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  // Sample proof data scoped to clients
  const proofRecords = [
    {
      id: 'proof_001',
      type: 'Decision-RDS',
      action: 'disclosure_complete',
      client: 'Johnson Family',
      property: '123 Oak Street',
      details: 'Lead paint disclosure completed',
      timestamp: '2024-01-15T10:30:00Z',
      status: 'verified',
      receipt_hash: 'sha256:abc123...',
      compliance_score: 'high'
    },
    {
      id: 'proof_002',
      type: 'Decision-RDS',
      action: 'offer_pack_generate',
      client: 'Smith Estate',
      property: '456 Pine Avenue',
      details: 'Comprehensive offer package generated',
      timestamp: '2024-01-14T14:20:00Z',
      status: 'verified',
      receipt_hash: 'sha256:def456...',
      compliance_score: 'high'
    },
    {
      id: 'proof_003',
      type: 'Comms-RDS',
      action: 'neighborhood_report',
      client: 'Davis Trust',
      property: 'Multiple Properties',
      details: 'Market analysis report sent to prospects',
      timestamp: '2024-01-13T09:15:00Z',
      status: 'verified',
      receipt_hash: 'sha256:ghi789...',
      compliance_score: 'medium'
    },
    {
      id: 'proof_004',
      type: 'Decision-RDS',
      action: 'close_pack_generate',
      client: 'Johnson Family',
      property: '123 Oak Street',
      details: 'Closing package with compliance manifest',
      timestamp: '2024-01-12T16:45:00Z',
      status: 'verified',
      receipt_hash: 'sha256:jkl012...',
      compliance_score: 'high'
    },
    {
      id: 'proof_005',
      type: 'Engagement-RDS',
      action: 'open_house_followup',
      client: 'Prospects',
      property: '789 Maple Drive',
      details: 'Open house follow-up campaign engagement',
      timestamp: '2024-01-11T11:30:00Z',
      status: 'pending',
      receipt_hash: 'sha256:mno345...',
      compliance_score: 'medium'
    }
  ];

  const complianceMetrics = [
    { label: 'Total Proof Records', value: proofRecords.length, status: 'verified' },
    { label: 'Disclosure Compliance', value: '98%', status: 'high' },
    { label: 'Client Coverage', value: '100%', status: 'complete' },
    { label: 'Audit Ready', value: 'Yes', status: 'ready' }
  ];

  const handleExportCompliance = () => {
    const csvData = [
      ['ID', 'Type', 'Action', 'Client', 'Property', 'Timestamp', 'Status', 'Receipt Hash'],
      ...proofRecords.map(record => [
        record.id,
        record.type,
        record.action,
        record.client,
        record.property,
        record.timestamp,
        record.status,
        record.receipt_hash
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'realtor_compliance_export.csv';
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Compliance data exported');
  };

  const filteredRecords = proofRecords.filter(record => {
    const matchesSearch = record.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClient = selectedClient === 'all' || record.client === selectedClient;
    const matchesType = selectedType === 'all' || record.type === selectedType;
    
    return matchesSearch && matchesClient && matchesType;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getComplianceColor = (score: string) => {
    switch (score) {
      case 'high': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Realtor Proof & Compliance</h1>
          <p className="text-muted-foreground">
            Client-scoped audit trails and regulatory compliance tracking
          </p>
        </div>
        <Button onClick={handleExportCompliance} className="gap-2">
          <Download className="h-4 w-4" />
          Export Compliance
        </Button>
      </div>

      {/* Compliance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {complianceMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center gap-2 mt-1">
                {getStatusIcon(metric.status)}
                <span className="text-xs text-muted-foreground capitalize">
                  {metric.status}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="receipts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="receipts">Proof Receipts</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Summary</TabsTrigger>
          <TabsTrigger value="audits">Audit Trails</TabsTrigger>
        </TabsList>

        {/* Proof Receipts */}
        <TabsContent value="receipts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Client-Scoped Proof Records
              </CardTitle>
              <CardDescription>
                All realtor actions with compliance receipts and client tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by client, property, or action..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={selectedClient} onValueChange={setSelectedClient}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by Client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Clients</SelectItem>
                    <SelectItem value="Johnson Family">Johnson Family</SelectItem>
                    <SelectItem value="Smith Estate">Smith Estate</SelectItem>
                    <SelectItem value="Davis Trust">Davis Trust</SelectItem>
                    <SelectItem value="Prospects">Prospects</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Decision-RDS">Decision-RDS</SelectItem>
                    <SelectItem value="Comms-RDS">Comms-RDS</SelectItem>
                    <SelectItem value="Engagement-RDS">Engagement-RDS</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Proof Records Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Compliance</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <Badge variant="outline">{record.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{record.action.replace(/_/g, ' ')}</p>
                          <p className="text-sm text-muted-foreground">{record.details}</p>
                        </div>
                      </TableCell>
                      <TableCell>{record.client}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {record.property}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          {new Date(record.timestamp).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(record.timestamp).toLocaleTimeString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(record.status)}
                          <span className="capitalize">{record.status}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${getComplianceColor(record.compliance_score)}`} />
                          <span className="capitalize text-sm">{record.compliance_score}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Eye className="h-3 w-3" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Summary */}
        <TabsContent value="compliance">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Disclosure Compliance by Client</CardTitle>
                <CardDescription>
                  Property disclosure completion status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {['Johnson Family', 'Smith Estate', 'Davis Trust'].map((client) => (
                  <div key={client} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">{client}</p>
                      <p className="text-sm text-muted-foreground">
                        3/3 required disclosures complete
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <Badge variant="default">100%</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regulatory Compliance</CardTitle>
                <CardDescription>
                  Real estate regulatory requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Lead Paint Disclosures</span>
                    <Badge variant="default">Compliant</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Natural Hazards</span>
                    <Badge variant="default">Compliant</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Property Condition</span>
                    <Badge variant="default">Compliant</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>NAR Standards</span>
                    <Badge variant="default">Current</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>State Requirements</span>
                    <Badge variant="default">Met</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Client Communication Tracking</CardTitle>
                <CardDescription>
                  Campaign and engagement compliance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Neighborhood Reports</span>
                    <span className="text-sm text-muted-foreground">5 sent this month</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Open House Follow-ups</span>
                    <span className="text-sm text-muted-foreground">12 automated</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Compliance Opt-outs</span>
                    <span className="text-sm text-muted-foreground">0 violations</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Engagement Tracking</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Package Generation History</CardTitle>
                <CardDescription>
                  Offer and closing package compliance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Offer Packages</span>
                    <span className="text-sm text-muted-foreground">8 generated</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Closing Packages</span>
                    <span className="text-sm text-muted-foreground">3 completed</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Compliance Manifests</span>
                    <Badge variant="default">All Generated</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Proof Verification</span>
                    <Badge variant="default">100%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Audit Trails */}
        <TabsContent value="audits">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Client-Scoped Audit Trails
              </CardTitle>
              <CardDescription>
                Comprehensive audit trail for regulatory review
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Audit Trail Features:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• All client interactions tracked with timestamps</li>
                    <li>• Property disclosure completion receipts</li>
                    <li>• Offer and closing package generation history</li>
                    <li>• Communication campaign compliance records</li>
                    <li>• Decision-RDS receipts for all regulatory actions</li>
                    <li>• Client-scoped data isolation for privacy</li>
                    <li>• Exportable compliance reports for audits</li>
                  </ul>
                </div>
                
                <div className="flex gap-4">
                  <Button variant="outline" className="gap-2">
                    <FileText className="h-4 w-4" />
                    Generate Audit Report
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export Full Trail
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Custom Date Range
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RealtorProofPage;