import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Shield, Download, FileText, Calendar as CalendarIcon, AlertTriangle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface ComplianceExportPanelProps {
  organizationId: string;
}

export const ComplianceExportPanel: React.FC<ComplianceExportPanelProps> = ({
  organizationId
}) => {
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [exportType, setExportType] = useState('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [includeAuditLogs, setIncludeAuditLogs] = useState(true);
  const [includeAgreements, setIncludeAgreements] = useState(true);
  const [includeDocumentVault, setIncludeDocumentVault] = useState(true);

  // Mock compliance data
  const complianceStats = {
    totalDocuments: 1247,
    signedAgreements: 189,
    pendingSignatures: 12,
    auditLogEntries: 5643,
    lastExport: '2024-07-15'
  };

  const exportHistory = [
    { id: '1', type: 'FINRA', dateRange: '2024-01-01 to 2024-06-30', status: 'Completed', exportedDate: '2024-07-15', size: '2.4 MB' },
    { id: '2', type: 'SEC', dateRange: '2024-04-01 to 2024-06-30', status: 'Completed', exportedDate: '2024-07-10', size: '1.8 MB' },
    { id: '3', type: 'State Review', dateRange: '2024-06-01 to 2024-06-30', status: 'Processing', exportedDate: '2024-07-20', size: '-' },
    { id: '4', type: 'Internal Audit', dateRange: '2024-01-01 to 2024-12-31', status: 'Failed', exportedDate: '2024-07-05', size: '-' }
  ];

  const activityLog = [
    { id: '1', timestamp: '2024-08-05 14:30', user: 'John Doe', action: 'Document accessed', resource: 'Client Agreement #1247', severity: 'info' },
    { id: '2', timestamp: '2024-08-05 14:25', user: 'Jane Smith', action: 'Agreement signed', resource: 'NDA Template v2.1', severity: 'info' },
    { id: '3', timestamp: '2024-08-05 14:20', user: 'Mike Johnson', action: 'Vault folder created', resource: 'Q3 2024 Reports', severity: 'info' },
    { id: '4', timestamp: '2024-08-05 14:15', user: 'System', action: 'Failed login attempt', resource: 'admin@company.com', severity: 'warning' }
  ];

  const handleCreateExport = () => {
    if (!exportType || !startDate || !endDate) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    toast.success('Compliance export initiated');
    setIsExportDialogOpen(false);
  };

  const handleDownloadExport = (exportId: string) => {
    toast.success('Export download started');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'warning': return 'text-orange-600';
      case 'error': return 'text-red-600';
      case 'critical': return 'text-red-800';
      default: return 'text-blue-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complianceStats.totalDocuments.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Signed Agreements</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{complianceStats.signedAgreements}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Signatures</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{complianceStats.pendingSignatures}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Audit Log Entries</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complianceStats.auditLogEntries.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Last Export</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">{complianceStats.lastExport}</div>
          </CardContent>
        </Card>
      </div>

      {/* Export Actions */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Compliance Exports</CardTitle>
              <CardDescription>Generate secure exports for regulatory review</CardDescription>
            </div>
            <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Download className="w-4 h-4 mr-2" />
                  Create Export
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Compliance Export</DialogTitle>
                  <DialogDescription>
                    Generate a secure export for regulatory authorities
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="export-type">Export Type</Label>
                    <Select value={exportType} onValueChange={setExportType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select export type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="finra">FINRA Review</SelectItem>
                        <SelectItem value="sec">SEC Examination</SelectItem>
                        <SelectItem value="state">State Regulatory Review</SelectItem>
                        <SelectItem value="internal">Internal Audit</SelectItem>
                        <SelectItem value="custom">Custom Export</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, 'PPP') : 'Select date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, 'PPP') : 'Select date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Include in Export</Label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="audit-logs" 
                          checked={includeAuditLogs}
                          onCheckedChange={(checked) => setIncludeAuditLogs(checked === true)}
                        />
                        <Label htmlFor="audit-logs">Audit logs and activity records</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="agreements" 
                          checked={includeAgreements}
                          onCheckedChange={(checked) => setIncludeAgreements(checked === true)}
                        />
                        <Label htmlFor="agreements">Signed agreements and contracts</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="document-vault" 
                          checked={includeDocumentVault}
                          onCheckedChange={(checked) => setIncludeDocumentVault(checked === true)}
                        />
                        <Label htmlFor="document-vault">Document vault contents</Label>
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleCreateExport} className="w-full">
                    Create Secure Export
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Export Type</TableHead>
                <TableHead>Date Range</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Exported Date</TableHead>
                <TableHead>File Size</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exportHistory.map((export_item) => (
                <TableRow key={export_item.id}>
                  <TableCell className="font-medium">{export_item.type}</TableCell>
                  <TableCell>{export_item.dateRange}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        export_item.status === 'Completed' ? 'default' : 
                        export_item.status === 'Processing' ? 'secondary' : 
                        'destructive'
                      }
                    >
                      {export_item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{export_item.exportedDate}</TableCell>
                  <TableCell>{export_item.size}</TableCell>
                  <TableCell>
                    {export_item.status === 'Completed' && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDownloadExport(export_item.id)}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Activity Log */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity Log</CardTitle>
          <CardDescription>Latest compliance and security events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activityLog.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <Badge variant="outline" className={getSeverityColor(activity.severity)}>
                      {activity.severity}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {activity.resource} • by {activity.user}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">
                  {activity.timestamp}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};