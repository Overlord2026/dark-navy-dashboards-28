import React, { useState, useEffect } from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useComplianceAudit } from '@/hooks/useComplianceAudit';
import { Shield, Clock, AlertTriangle, CheckCircle, Search, Filter, FileText, Activity } from 'lucide-react';
import { toast } from 'sonner';

export default function ComplianceAuditPage() {
  const { auditEntries, investmentCompliance, loading, saving, fetchAuditEntries, updateInvestmentCompliance } = useComplianceAudit();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntityType, setSelectedEntityType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const entityTypes = [
    { value: 'all', label: 'All Entities' },
    { value: 'investment_offerings', label: 'Investment Offerings' },
    { value: 'insurance_policies', label: 'Insurance Policies' },
    { value: 'lending_partners', label: 'Lending Partners' },
    { value: 'professional_network', label: 'Professional Network' },
    { value: 'user_profiles', label: 'User Profiles' }
  ];

  const complianceStatuses = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const filteredAuditEntries = auditEntries.filter(entry => {
    const matchesSearch = searchTerm === '' || 
      entry.action_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.entity_type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEntityType = selectedEntityType === 'all' || entry.entity_type === selectedEntityType;
    
    return matchesSearch && matchesEntityType;
  });

  const filteredInvestmentCompliance = investmentCompliance.filter(comp => {
    const matchesStatus = selectedStatus === 'all' || comp.compliance_status === selectedStatus;
    return matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': case 'compliant': return 'bg-green-500';
      case 'pending': case 'under_review': return 'bg-yellow-500';
      case 'rejected': case 'non_compliant': return 'bg-red-500';
      case 'expired': return 'bg-gray-500';
      default: return 'bg-blue-500';
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

  const handleUpdateCompliance = async (offeringId: string, status: string) => {
    try {
      await updateInvestmentCompliance(offeringId, { compliance_status: status as any });
    } catch (error) {
      console.error('Error updating compliance:', error);
    }
  };

  if (loading) {
    return (
      <ThreeColumnLayout activeMainItem="admin" title="Compliance & Audit">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading compliance data...</p>
          </div>
        </div>
      </ThreeColumnLayout>
    );
  }

  return (
    <ThreeColumnLayout activeMainItem="admin" title="Compliance & Audit">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Compliance & Audit Trail</h1>
            <p className="text-muted-foreground">
              Monitor compliance status and audit all system activities
            </p>
          </div>
          <Button onClick={() => fetchAuditEntries({ limit: 100 })}>
            <Activity className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Audit Entries</p>
                  <p className="text-2xl font-bold">{auditEntries.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Compliant Investments</p>
                  <p className="text-2xl font-bold">
                    {investmentCompliance.filter(c => c.compliance_status === 'approved').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                  <p className="text-2xl font-bold">
                    {investmentCompliance.filter(c => ['pending', 'under_review'].includes(c.compliance_status)).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Critical Issues</p>
                  <p className="text-2xl font-bold">
                    {auditEntries.filter(e => (e.details as any)?.severity === 'critical').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="audit-trail" className="space-y-4">
          <TabsList>
            <TabsTrigger value="audit-trail">Audit Trail</TabsTrigger>
            <TabsTrigger value="investment-compliance">Investment Compliance</TabsTrigger>
          </TabsList>

          <TabsContent value="audit-trail" className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search audit entries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <Select value={selectedEntityType} onValueChange={setSelectedEntityType}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {entityTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Audit Entries */}
            <div className="space-y-4">
              {filteredAuditEntries.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Audit Entries</h3>
                    <p className="text-muted-foreground">
                      No audit entries match your current filters.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredAuditEntries.map(entry => (
                  <Card key={entry.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">
                              {entry.entity_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Badge>
                            <Badge variant="secondary">
                              {entry.action_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Badge>
                            {(entry.details as any)?.severity && (
                              <Badge 
                                variant="outline" 
                                className={getSeverityColor((entry.details as any).severity)}
                              >
                                {(entry.details as any).severity.toUpperCase()}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            Entity ID: {entry.entity_id}
                          </p>
                          {entry.details && Object.keys(entry.details).length > 0 && (
                            <div className="text-sm">
                              <strong>Details:</strong>
                              <pre className="mt-1 text-xs bg-muted p-2 rounded overflow-x-auto">
                                {JSON.stringify(entry.details, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <p>{new Date(entry.timestamp).toLocaleString()}</p>
                          {entry.ip_address && (
                            <p className="text-xs">IP: {entry.ip_address}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="investment-compliance" className="space-y-4">
            {/* Filters */}
            <div className="flex items-center space-x-4">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {complianceStatuses.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Investment Compliance */}
            <div className="space-y-4">
              {filteredInvestmentCompliance.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Investment Compliance Records</h3>
                    <p className="text-muted-foreground">
                      No investment compliance records match your current filters.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredInvestmentCompliance.map(comp => (
                  <Card key={comp.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">
                            Investment Offering: {comp.offering_id}
                          </CardTitle>
                          <p className="text-muted-foreground text-sm">
                            Last reviewed: {comp.last_reviewed_at ? new Date(comp.last_reviewed_at).toLocaleDateString() : 'Never'}
                          </p>
                        </div>
                        <Badge className={getStatusColor(comp.compliance_status)}>
                          {comp.compliance_status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium">Due Diligence</p>
                          <Badge variant="outline" className={getStatusColor(comp.due_diligence_status)}>
                            {comp.due_diligence_status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm font-medium">SEC Status</p>
                          <Badge variant="outline" className={getStatusColor(comp.sec_status)}>
                            {comp.sec_status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm font-medium">FINRA Status</p>
                          <Badge variant="outline" className={getStatusColor(comp.finra_status)}>
                            {comp.finra_status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium mb-1">Documents Verified</p>
                          <Badge variant={comp.documents_verified ? "default" : "destructive"}>
                            {comp.documents_verified ? 'Yes' : 'No'}
                          </Badge>
                        </div>
                        {comp.notes && (
                          <div>
                            <p className="text-sm font-medium mb-1">Notes</p>
                            <p className="text-sm text-muted-foreground">{comp.notes}</p>
                          </div>
                        )}
                      </div>

                      {comp.risk_assessment && Object.keys(comp.risk_assessment).length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium mb-2">Risk Assessment</p>
                          <div className="text-xs bg-muted p-2 rounded">
                            <pre>{JSON.stringify(comp.risk_assessment, null, 2)}</pre>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleUpdateCompliance(comp.offering_id, 'approved')}
                          disabled={saving || comp.compliance_status === 'approved'}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateCompliance(comp.offering_id, 'under_review')}
                          disabled={saving || comp.compliance_status === 'under_review'}
                        >
                          Mark Under Review
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleUpdateCompliance(comp.offering_id, 'rejected')}
                          disabled={saving || comp.compliance_status === 'rejected'}
                        >
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
}