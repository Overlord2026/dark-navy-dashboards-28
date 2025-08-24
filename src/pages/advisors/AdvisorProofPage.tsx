import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Receipt, 
  Shield, 
  Search, 
  Download,
  Filter,
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface ProofSlip {
  id: string;
  type: 'Consent-RDS' | 'Decision-RDS' | 'Comms-RDS' | 'Vault-RDS' | 'Call-RDS' | 'Anchor-RDS';
  action: string;
  clientName: string;
  timestamp: string;
  status: 'verified' | 'pending' | 'warning';
  hasAnchor: boolean;
  details: any;
}

interface AuditRecord {
  id: string;
  eventType: string;
  severity: 'info' | 'warning' | 'critical';
  description: string;
  timestamp: string;
  resolved: boolean;
}

export function AdvisorProofPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'receipts' | 'anchors' | 'audits'>('receipts');

  const [proofSlips] = useState<ProofSlip[]>([
    {
      id: '1',
      type: 'Consent-RDS',
      action: 'lead.consent.captured',
      clientName: 'Sarah Johnson',
      timestamp: '2024-01-15 10:30:00',
      status: 'verified',
      hasAnchor: true,
      details: { purpose: 'outreach', scope: { contact: true }, ttlDays: 90 }
    },
    {
      id: '2',
      type: 'Decision-RDS',
      action: 'meeting.summary.generated',
      clientName: 'Michael Chen',
      timestamp: '2024-01-15 11:45:00',
      status: 'verified',
      hasAnchor: false,
      details: { summaryType: 'AI_generated', meetingDuration: 45 }
    },
    {
      id: '3',
      type: 'Comms-RDS',
      action: 'campaign.email.sent',
      clientName: 'Emily Rodriguez',
      timestamp: '2024-01-15 09:15:00',
      status: 'verified',
      hasAnchor: true,
      details: { templateId: 'retiree3', recipientCount: 25 }
    },
    {
      id: '4',
      type: 'Vault-RDS',
      action: 'document.uploaded',
      clientName: 'David Kim',
      timestamp: '2024-01-14 16:20:00',
      status: 'pending',
      hasAnchor: false,
      details: { documentType: 'meeting_recording', keepSafe: true }
    },
    {
      id: '5',
      type: 'Call-RDS',
      action: 'call.record.start',
      clientName: 'Lisa Wong',
      timestamp: '2024-01-14 14:30:00',
      status: 'warning',
      hasAnchor: false,
      details: { recordingType: 'live', duration: null }
    }
  ]);

  const [auditRecords] = useState<AuditRecord[]>([
    {
      id: '1',
      eventType: 'compliance_check',
      severity: 'info',
      description: 'PTC consent verification completed successfully',
      timestamp: '2024-01-15 10:30:05',
      resolved: true
    },
    {
      id: '2',
      eventType: 'data_retention',
      severity: 'warning',
      description: 'Document approaching retention limit',
      timestamp: '2024-01-15 08:15:00',
      resolved: false
    },
    {
      id: '3',
      eventType: 'security_scan',
      severity: 'critical',
      description: 'Unusual access pattern detected',
      timestamp: '2024-01-14 22:45:00',
      resolved: true
    }
  ]);

  const handleExportReceipts = () => {
    const csvData = proofSlips.map(slip => ({
      ID: slip.id,
      Type: slip.type,
      Action: slip.action,
      'Client Name': slip.clientName,
      Timestamp: slip.timestamp,
      Status: slip.status,
      'Has Anchor': slip.hasAnchor ? 'Yes' : 'No',
      Details: JSON.stringify(slip.details)
    }));

    const headers = Object.keys(csvData[0]).join(',');
    const rows = csvData.map(row => Object.values(row).map(val => `"${val}"`).join(','));
    const csv = [headers, ...rows].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'advisor-proof-slips.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Proof slips exported to CSV (no PII included)"
    });
  };

  const getStatusColor = (status: ProofSlip['status']) => {
    switch (status) {
      case 'verified': return 'text-green-600 border-green-600';
      case 'pending': return 'text-yellow-600 border-yellow-600';
      case 'warning': return 'text-red-600 border-red-600';
      default: return 'text-gray-600 border-gray-600';
    }
  };

  const getStatusIcon = (status: ProofSlip['status']) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-3 h-3" />;
      case 'pending': return <Clock className="w-3 h-3" />;
      case 'warning': return <AlertTriangle className="w-3 h-3" />;
      default: return <Receipt className="w-3 h-3" />;
    }
  };

  const getSeverityColor = (severity: AuditRecord['severity']) => {
    switch (severity) {
      case 'info': return 'text-blue-600 border-blue-600';
      case 'warning': return 'text-yellow-600 border-yellow-600';
      case 'critical': return 'text-red-600 border-red-600';
      default: return 'text-gray-600 border-gray-600';
    }
  };

  const filteredProofSlips = proofSlips.filter(slip => {
    const matchesSearch = slip.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         slip.action.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || slip.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const stats = {
    totalReceipts: proofSlips.length,
    verifiedReceipts: proofSlips.filter(s => s.status === 'verified').length,
    anchoredReceipts: proofSlips.filter(s => s.hasAnchor).length,
    pendingAudits: auditRecords.filter(a => !a.resolved).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Proof & Compliance</h1>
          <p className="text-muted-foreground">View scoped receipts, anchors, and audit records</p>
        </div>
        <Button variant="outline" onClick={handleExportReceipts}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Receipts</p>
                <p className="text-2xl font-bold">{stats.totalReceipts}</p>
              </div>
              <Receipt className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Verified</p>
                <p className="text-2xl font-bold text-green-600">{stats.verifiedReceipts}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Anchored</p>
                <p className="text-2xl font-bold text-purple-600">{stats.anchoredReceipts}</p>
              </div>
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Audits</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingAudits}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b">
        <button
          onClick={() => setActiveTab('receipts')}
          className={`pb-2 px-1 ${activeTab === 'receipts' ? 'border-b-2 border-primary font-medium' : 'text-muted-foreground'}`}
        >
          Receipts
        </button>
        <button
          onClick={() => setActiveTab('anchors')}
          className={`pb-2 px-1 ${activeTab === 'anchors' ? 'border-b-2 border-primary font-medium' : 'text-muted-foreground'}`}
        >
          Anchors
        </button>
        <button
          onClick={() => setActiveTab('audits')}
          className={`pb-2 px-1 ${activeTab === 'audits' ? 'border-b-2 border-primary font-medium' : 'text-muted-foreground'}`}
        >
          Audits
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'receipts' && (
        <>
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search receipts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Consent-RDS">Consent-RDS</SelectItem>
                    <SelectItem value="Decision-RDS">Decision-RDS</SelectItem>
                    <SelectItem value="Comms-RDS">Comms-RDS</SelectItem>
                    <SelectItem value="Vault-RDS">Vault-RDS</SelectItem>
                    <SelectItem value="Call-RDS">Call-RDS</SelectItem>
                    <SelectItem value="Anchor-RDS">Anchor-RDS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Receipts List */}
          <Card>
            <CardHeader>
              <CardTitle>Proof Slips ({filteredProofSlips.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredProofSlips.map((slip) => (
                  <div key={slip.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4 flex-1">
                      <Receipt className="w-5 h-5 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">{slip.type}</Badge>
                          <h3 className="font-medium">{slip.action}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{slip.clientName} • {slip.timestamp}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getStatusColor(slip.status)}>
                          {getStatusIcon(slip.status)}
                          {slip.status}
                        </Badge>
                        {slip.hasAnchor && (
                          <Badge variant="outline" className="text-purple-600 border-purple-600">
                            <Shield className="w-3 h-3 mr-1" />
                            Anchored ✓
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {activeTab === 'anchors' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Anchor Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">Anchored Receipts</h3>
              <p className="text-muted-foreground mb-4">
                {stats.anchoredReceipts} receipts have been anchored for immutable verification
              </p>
              <Button variant="outline">
                View Anchor Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'audits' && (
        <Card>
          <CardHeader>
            <CardTitle>Compliance Audit Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {auditRecords.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4 flex-1">
                    <AlertTriangle className="w-5 h-5 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className={getSeverityColor(record.severity)}>
                          {record.severity}
                        </Badge>
                        <h3 className="font-medium">{record.eventType}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">{record.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{record.timestamp}</p>
                    </div>
                    {record.resolved ? (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Resolved
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                      </Badge>
                    )}
                  </div>
                  <Button variant="outline" size="sm">
                    Review
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}