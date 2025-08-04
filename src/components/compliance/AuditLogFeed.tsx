import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Calendar,
  User,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw
} from 'lucide-react';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  outcome: 'success' | 'failure' | 'warning';
  type: 'policy' | 'filing' | 'task' | 'training' | 'access' | 'system';
  details: string;
  ipAddress?: string;
  resourceId?: string;
}

export const AuditLogFeed: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedOutcome, setSelectedOutcome] = useState('all');

  const auditLogs: AuditLogEntry[] = [
    {
      id: '1',
      timestamp: '2024-01-15T14:30:00Z',
      action: 'Policy Updated',
      user: 'Sarah Chen',
      outcome: 'success',
      type: 'policy',
      details: 'Updated Privacy Policy to version 3.2',
      ipAddress: '192.168.1.100',
      resourceId: 'policy_001'
    },
    {
      id: '2',
      timestamp: '2024-01-15T13:45:00Z',
      action: 'SEC Filing Submitted',
      user: 'Michael Torres',
      outcome: 'success',
      type: 'filing',
      details: 'Form ADV Annual Amendment submitted to SEC',
      ipAddress: '192.168.1.101',
      resourceId: 'filing_adv_2024'
    },
    {
      id: '3',
      timestamp: '2024-01-15T12:20:00Z',
      action: 'Training Assignment Failed',
      user: 'System',
      outcome: 'failure',
      type: 'training',
      details: 'Failed to assign cybersecurity training to 3 users',
      resourceId: 'training_cyber_001'
    },
    {
      id: '4',
      timestamp: '2024-01-15T11:15:00Z',
      action: 'Document Access',
      user: 'Jennifer Walsh',
      outcome: 'success',
      type: 'access',
      details: 'Accessed AML Policy document',
      ipAddress: '192.168.1.102',
      resourceId: 'doc_aml_policy'
    },
    {
      id: '5',
      timestamp: '2024-01-15T10:30:00Z',
      action: 'Compliance Task Created',
      user: 'Sarah Chen',
      outcome: 'success',
      type: 'task',
      details: 'Created quarterly review task for Q1 2024',
      ipAddress: '192.168.1.100',
      resourceId: 'task_q1_review'
    },
    {
      id: '6',
      timestamp: '2024-01-15T09:45:00Z',
      action: 'Unauthorized Access Attempt',
      user: 'Unknown',
      outcome: 'failure',
      type: 'access',
      details: 'Failed login attempt from suspicious IP',
      ipAddress: '203.0.113.5'
    },
    {
      id: '7',
      timestamp: '2024-01-15T09:15:00Z',
      action: 'System Backup Completed',
      user: 'System',
      outcome: 'success',
      type: 'system',
      details: 'Daily backup completed successfully',
      resourceId: 'backup_20240115'
    },
    {
      id: '8',
      timestamp: '2024-01-15T08:30:00Z',
      action: 'Policy Review Overdue',
      user: 'System',
      outcome: 'warning',
      type: 'policy',
      details: 'Code of Ethics policy review is 5 days overdue',
      resourceId: 'policy_ethics'
    }
  ];

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'failure':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'warning':
        return <Clock className="h-4 w-4 text-warning" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getOutcomeBadge = (outcome: string) => {
    switch (outcome) {
      case 'success':
        return <Badge variant="default" className="bg-success text-success-foreground">Success</Badge>;
      case 'failure':
        return <Badge variant="destructive">Failure</Badge>;
      case 'warning':
        return <Badge variant="default" className="bg-warning text-warning-foreground">Warning</Badge>;
      default:
        return <Badge variant="outline">{outcome}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'policy':
        return <FileText className="h-4 w-4 text-primary" />;
      case 'filing':
        return <Shield className="h-4 w-4 text-secondary" />;
      case 'task':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'training':
        return <User className="h-4 w-4 text-warning" />;
      case 'access':
        return <Shield className="h-4 w-4 text-destructive" />;
      case 'system':
        return <RefreshCw className="h-4 w-4 text-muted-foreground" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || log.type === selectedType;
    const matchesOutcome = selectedOutcome === 'all' || log.outcome === selectedOutcome;
    return matchesSearch && matchesType && matchesOutcome;
  });

  const exportToCsv = () => {
    const csvContent = [
      ['Timestamp', 'Action', 'User', 'Outcome', 'Type', 'Details', 'IP Address', 'Resource ID'].join(','),
      ...filteredLogs.map(log => [
        log.timestamp,
        log.action,
        log.user,
        log.outcome,
        log.type,
        `"${log.details}"`,
        log.ipAddress || '',
        log.resourceId || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-2xl font-display font-bold">Audit Log & Alerts Feed</h2>
            <p className="text-muted-foreground">Real-time compliance activity tracking and audit trail</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportToCsv}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Card className="premium-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Activity Log</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-32">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="policy">Policy</SelectItem>
                  <SelectItem value="filing">Filing</SelectItem>
                  <SelectItem value="task">Task</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                  <SelectItem value="access">Access</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedOutcome} onValueChange={setSelectedOutcome}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Results</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="failure">Failure</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date/Time</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Outcome</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="text-sm">
                        <p>{new Date(log.timestamp).toLocaleDateString()}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getOutcomeIcon(log.outcome)}
                        <span className="font-medium">{log.action}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{log.user}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(log.type)}
                        <Badge variant="outline" className="capitalize">
                          {log.type}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getOutcomeBadge(log.outcome)}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="text-sm truncate">{log.details}</p>
                        {log.resourceId && (
                          <p className="text-xs text-muted-foreground">ID: {log.resourceId}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-mono text-muted-foreground">
                        {log.ipAddress || '-'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No audit logs match your search criteria</p>
              <p className="text-sm text-muted-foreground mt-2">
                Try adjusting your filters or search terms
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="premium-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-success" />
              <div>
                <p className="text-2xl font-bold text-success">
                  {auditLogs.filter(log => log.outcome === 'success').length}
                </p>
                <p className="text-xs text-muted-foreground">Successful Actions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-destructive" />
              <div>
                <p className="text-2xl font-bold text-destructive">
                  {auditLogs.filter(log => log.outcome === 'failure').length}
                </p>
                <p className="text-xs text-muted-foreground">Failed Actions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-warning" />
              <div>
                <p className="text-2xl font-bold text-warning">
                  {auditLogs.filter(log => log.outcome === 'warning').length}
                </p>
                <p className="text-xs text-muted-foreground">Warnings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold text-primary">24h</p>
                <p className="text-xs text-muted-foreground">Activity Period</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};