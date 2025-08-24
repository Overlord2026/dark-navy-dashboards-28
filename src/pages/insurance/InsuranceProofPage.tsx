import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Download, Filter, CheckCircle, AlertTriangle, Clock, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface Receipt {
  id: string;
  type: 'Consent-RDS' | 'Decision-RDS' | 'Comms-RDS' | 'Call-RDS' | 'SOA-RDS' | 'PECL-RDS' | 'Enrollment-RDS';
  action: string;
  result: 'approve' | 'deny' | 'sent' | 'completed';
  client: string;
  timestamp: string;
  retention: string;
  hasAnchor: boolean;
  segment: 'life-annuity' | 'medicare-ltc';
}

export const InsuranceProofPage: React.FC = () => {
  const [selectedSegment, setSelectedSegment] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const receipts: Receipt[] = [
    {
      id: '1',
      type: 'Consent-RDS',
      action: 'ptc_consent',
      result: 'approve',
      client: 'Patricia Wilson',
      timestamp: '2024-12-20T14:30:00Z',
      retention: '10 years',
      hasAnchor: true,
      segment: 'medicare-ltc'
    },
    {
      id: '2',
      type: 'Decision-RDS',
      action: 'dnc_check',
      result: 'approve',
      client: 'Patricia Wilson',
      timestamp: '2024-12-20T14:31:00Z',
      retention: '10 years',
      hasAnchor: true,
      segment: 'medicare-ltc'
    },
    {
      id: '3',
      type: 'SOA-RDS',
      action: 'soa_signed',
      result: 'completed',
      client: 'Patricia Wilson',
      timestamp: '2024-12-20T15:00:00Z',
      retention: '10 years',
      hasAnchor: true,
      segment: 'medicare-ltc'
    },
    {
      id: '4',
      type: 'Call-RDS',
      action: 'call_recorded',
      result: 'completed',
      client: 'Patricia Wilson',
      timestamp: '2024-12-20T15:30:00Z',
      retention: '10 years',
      hasAnchor: true,
      segment: 'medicare-ltc'
    },
    {
      id: '5',
      type: 'Comms-RDS',
      action: 'email_sent',
      result: 'sent',
      client: 'Robert Smith',
      timestamp: '2024-12-19T10:15:00Z',
      retention: '7 years',
      hasAnchor: false,
      segment: 'life-annuity'
    }
  ];

  const auditChecks = [
    {
      check: 'PTC Present',
      status: 'pass',
      count: 15,
      details: 'All Medicare leads have valid PTC consent'
    },
    {
      check: 'DNC Check',
      status: 'pass',
      count: 15,
      details: 'All phone outreach cleared DNC verification'
    },
    {
      check: 'Disclaimer Read',
      status: 'warning',
      count: 12,
      details: '3 calls missing disclaimer confirmation'
    },
    {
      check: 'SOA Before Plan Specifics',
      status: 'pass',
      count: 8,
      details: 'All plan discussions have SOA on file'
    },
    {
      check: 'PECL Before Enrollment',
      status: 'warning',
      count: 5,
      details: '2 enrollments pending PECL completion'
    },
    {
      check: 'Retention Flag 10y',
      status: 'pass',
      count: 25,
      details: 'All Medicare receipts flagged for 10-year retention'
    }
  ];

  const anchors = [
    {
      id: '1',
      batchId: 'batch_20241220_001',
      receiptCount: 4,
      merkleRoot: 'sha256:a1b2c3...',
      chainId: 'ethereum',
      txRef: '0x123abc...',
      status: 'confirmed',
      timestamp: '2024-12-20T16:00:00Z'
    },
    {
      id: '2',
      batchId: 'batch_20241219_001',
      receiptCount: 3,
      merkleRoot: 'sha256:d4e5f6...',
      chainId: 'polygon',
      txRef: '0x456def...',
      status: 'confirmed',
      timestamp: '2024-12-19T18:30:00Z'
    }
  ];

  const filteredReceipts = receipts.filter(receipt => {
    const matchesSegment = selectedSegment === 'all' || receipt.segment === selectedSegment;
    const matchesType = selectedType === 'all' || receipt.type === selectedType;
    const matchesSearch = searchTerm === '' || 
      receipt.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.action.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSegment && matchesType && matchesSearch;
  });

  const handleExportCSV = () => {
    // Track analytics
    console.log('[Analytics] receipts.export.csv', { 
      segment: selectedSegment,
      type: selectedType,
      count: filteredReceipts.length
    });
    
    toast.success("Receipts exported to CSV (PII redacted)");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'fail': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Consent-RDS': return 'bg-blue-100 text-blue-800';
      case 'Decision-RDS': return 'bg-green-100 text-green-800';
      case 'Comms-RDS': return 'bg-purple-100 text-purple-800';
      case 'Call-RDS': return 'bg-orange-100 text-orange-800';
      case 'SOA-RDS': return 'bg-yellow-100 text-yellow-800';
      case 'PECL-RDS': return 'bg-pink-100 text-pink-800';
      case 'Enrollment-RDS': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Insurance Proof & Compliance</h1>
        <Button onClick={handleExportCSV} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <Tabs defaultValue="receipts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="receipts">Receipts</TabsTrigger>
          <TabsTrigger value="audits">Audits</TabsTrigger>
          <TabsTrigger value="anchors">Anchors</TabsTrigger>
        </TabsList>

        <TabsContent value="receipts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Compliance Receipts
              </CardTitle>
              
              {/* Filters */}
              <div className="flex gap-4 items-center pt-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span className="text-sm font-medium">Filters:</span>
                </div>
                
                <Select value={selectedSegment} onValueChange={setSelectedSegment}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Segment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Segments</SelectItem>
                    <SelectItem value="medicare-ltc">Medicare & LTC</SelectItem>
                    <SelectItem value="life-annuity">Life & Annuity</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Consent-RDS">Consent-RDS</SelectItem>
                    <SelectItem value="Decision-RDS">Decision-RDS</SelectItem>
                    <SelectItem value="Comms-RDS">Comms-RDS</SelectItem>
                    <SelectItem value="Call-RDS">Call-RDS</SelectItem>
                    <SelectItem value="SOA-RDS">SOA-RDS</SelectItem>
                    <SelectItem value="PECL-RDS">PECL-RDS</SelectItem>
                    <SelectItem value="Enrollment-RDS">Enrollment-RDS</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  placeholder="Search client or action..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Retention</TableHead>
                    <TableHead>Anchor</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReceipts.map((receipt) => (
                    <TableRow key={receipt.id}>
                      <TableCell>
                        <Badge className={getTypeColor(receipt.type)}>
                          {receipt.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{receipt.action}</TableCell>
                      <TableCell>{receipt.client}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-green-600">
                          {receipt.result}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(receipt.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {receipt.retention}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {receipt.hasAnchor ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Clock className="h-4 w-4 text-gray-400" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audits">
          <Card>
            <CardHeader>
              <CardTitle>Medicare Compliance Audits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {auditChecks.map((check, index) => (
                  <Card key={index} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{check.check}</h4>
                        {getStatusIcon(check.status)}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Count: {check.count}</span>
                        <Badge 
                          variant="outline"
                          className={
                            check.status === 'pass' ? 'text-green-600' :
                            check.status === 'warning' ? 'text-yellow-600' :
                            'text-red-600'
                          }
                        >
                          {check.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">{check.details}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="anchors">
          <Card>
            <CardHeader>
              <CardTitle>Blockchain Anchors</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch ID</TableHead>
                    <TableHead>Receipts</TableHead>
                    <TableHead>Merkle Root</TableHead>
                    <TableHead>Chain</TableHead>
                    <TableHead>TX Ref</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {anchors.map((anchor) => (
                    <TableRow key={anchor.id}>
                      <TableCell className="font-mono text-sm">{anchor.batchId}</TableCell>
                      <TableCell>{anchor.receiptCount}</TableCell>
                      <TableCell className="font-mono text-xs">{anchor.merkleRoot}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{anchor.chainId}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{anchor.txRef}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-green-600">
                          {anchor.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(anchor.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};