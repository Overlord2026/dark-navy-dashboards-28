import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Settings, 
  Users, 
  CheckCircle, 
  XCircle, 
  Download, 
  Shield,
  FileText,
  AlertTriangle,
  Filter
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface Athlete {
  id: string;
  name: string;
  sport: string;
  year: string;
  trainingStatus: 'complete' | 'pending' | 'overdue';
  disclosureStatus: 'current' | 'outdated' | 'missing';
  approvalStatus: 'approved' | 'pending' | 'denied';
  lastActivity: string;
}

interface Offer {
  id: string;
  athleteName: string;
  brandName: string;
  amount: number;
  type: string;
  status: 'pending_approval' | 'approved' | 'denied';
  submittedAt: string;
  conflictCheck: 'pass' | 'warning' | 'fail';
}

const SchoolDashboard = () => {
  const [selectedState, setSelectedState] = useState('');
  const [disclosureTemplate, setDisclosureTemplate] = useState('');
  
  // Mock data
  const athletes: Athlete[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      sport: 'Basketball',
      year: 'Junior',
      trainingStatus: 'complete',
      disclosureStatus: 'current',
      approvalStatus: 'approved',
      lastActivity: '2 days ago'
    },
    {
      id: '2',
      name: 'Mike Chen',
      sport: 'Football',
      year: 'Senior',
      trainingStatus: 'pending',
      disclosureStatus: 'outdated',
      approvalStatus: 'pending',
      lastActivity: '5 days ago'
    },
    {
      id: '3',
      name: 'Emma Davis',
      sport: 'Soccer',
      year: 'Sophomore',
      trainingStatus: 'overdue',
      disclosureStatus: 'missing',
      approvalStatus: 'denied',
      lastActivity: '1 week ago'
    }
  ];

  const pendingOffers: Offer[] = [
    {
      id: '1',
      athleteName: 'Sarah Johnson',
      brandName: 'Nike',
      amount: 2500,
      type: 'Social Media Campaign',
      status: 'pending_approval',
      submittedAt: '2024-01-15',
      conflictCheck: 'pass'
    },
    {
      id: '2',
      athleteName: 'Mike Chen',
      brandName: 'Gatorade',
      amount: 1500,
      type: 'Event Appearance',
      status: 'pending_approval',
      submittedAt: '2024-01-14',
      conflictCheck: 'warning'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
      case 'current':
      case 'approved':
      case 'pass':
        return 'success';
      case 'pending':
      case 'pending_approval':
      case 'warning':
        return 'warning';
      case 'overdue':
      case 'missing':
      case 'denied':
      case 'fail':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const handleApproveOffer = (offerId: string) => {
    console.log('Approving offer:', offerId);
    // Implementation for approving offer
  };

  const handleDenyOffer = (offerId: string) => {
    console.log('Denying offer:', offerId);
    // Implementation for denying offer
  };

  const handleExportAuditPack = () => {
    console.log('Exporting audit pack...');
    // Implementation for audit pack export
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">School NIL Dashboard</h1>
          <p className="text-muted-foreground">Monitor compliance and approve opportunities</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportAuditPack}>
            <Download className="h-4 w-4 mr-2" />
            Export Audit Pack
          </Button>
          <Button>
            <Shield className="h-4 w-4 mr-2" />
            Run Compliance Check
          </Button>
        </div>
      </div>

      <Tabs defaultValue="policy" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="policy">Policy Manager</TabsTrigger>
          <TabsTrigger value="roster">Athlete Roster</TabsTrigger>
          <TabsTrigger value="approvals">Pending Approvals</TabsTrigger>
          <TabsTrigger value="audits">Anchors & Audits</TabsTrigger>
        </TabsList>

        <TabsContent value="policy" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  School Rules & Policies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">State/Jurisdiction</label>
                  <Select value={selectedState} onValueChange={setSelectedState}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ca">California</SelectItem>
                      <SelectItem value="fl">Florida</SelectItem>
                      <SelectItem value="tx">Texas</SelectItem>
                      <SelectItem value="ny">New York</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Approved Channels</label>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Instagram</Badge>
                    <Badge variant="secondary">TikTok</Badge>
                    <Badge variant="outline">Twitter</Badge>
                    <Badge variant="outline">YouTube</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Maximum Deal Value (without review)</label>
                  <Input type="number" placeholder="5000" />
                </div>

                <Button className="w-full">Update Policy Settings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Disclosure Templates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Standard Disclosure Template</label>
                  <Textarea 
                    value={disclosureTemplate}
                    onChange={(e) => setDisclosureTemplate(e.target.value)}
                    placeholder="#ad #sponsored - Paid partnership with [Brand]. All opinions are my own. Go [School]!"
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Required Hashtags</label>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">#ad</Badge>
                    <Badge variant="secondary">#sponsored</Badge>
                    <Badge variant="secondary">#paidpartnership</Badge>
                  </div>
                </div>

                <Button className="w-full">Save Template</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="roster" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Athlete Compliance Status
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Athletes</SelectItem>
                      <SelectItem value="compliant">Compliant</SelectItem>
                      <SelectItem value="issues">Has Issues</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {athletes.map((athlete) => (
                  <div key={athlete.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-foreground rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                          {athlete.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="font-semibold">{athlete.name}</h3>
                          <p className="text-sm text-muted-foreground">{athlete.sport} • {athlete.year}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Training</p>
                          <Badge variant={getStatusColor(athlete.trainingStatus)}>
                            {athlete.trainingStatus === 'complete' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {athlete.trainingStatus === 'overdue' && <AlertTriangle className="h-3 w-3 mr-1" />}
                            {athlete.trainingStatus}
                          </Badge>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Disclosure</p>
                          <Badge variant={getStatusColor(athlete.disclosureStatus)}>
                            {athlete.disclosureStatus === 'current' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {athlete.disclosureStatus}
                          </Badge>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Approval</p>
                          <Badge variant={getStatusColor(athlete.approvalStatus)}>
                            {athlete.approvalStatus === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {athlete.approvalStatus === 'denied' && <XCircle className="h-3 w-3 mr-1" />}
                            {athlete.approvalStatus}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {athlete.lastActivity}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approvals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Pending Offer Approvals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingOffers.map((offer) => (
                  <div key={offer.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{offer.athleteName}</h3>
                          <Badge variant="outline">{offer.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Brand: {offer.brandName} • Amount: ${offer.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Submitted: {offer.submittedAt}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs">Conflict Check:</span>
                          <Badge variant={getStatusColor(offer.conflictCheck)} className="text-xs">
                            {offer.conflictCheck}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDenyOffer(offer.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Deny
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleApproveOffer(offer.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audits" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Verification System
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Merkle Root Verification</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Cryptographic proof of all NIL transactions and approvals
                  </p>
                  <div className="font-mono text-xs bg-background p-2 rounded border">
                    0x7d4a9b2f8c3e1a5d6f9e2b4c7a8d3f1e5b9c2a6d8f4e1b7c9a5d3f8e2b4c6a
                  </div>
                </div>
                
                <Button className="w-full">
                  <Shield className="h-4 w-4 mr-2" />
                  Verify All Transactions
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Audit Reports
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span className="text-sm">Q1 2024 Compliance Report</span>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span className="text-sm">Monthly Activity Summary</span>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span className="text-sm">Athlete Training Records</span>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <Button variant="outline" className="w-full" onClick={handleExportAuditPack}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Complete Audit Pack
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SchoolDashboard;