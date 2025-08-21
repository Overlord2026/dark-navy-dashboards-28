import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart3, TrendingUp, Clock, FileCheck, Download, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HealthMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  target: number;
  status: 'excellent' | 'good' | 'needs_improvement' | 'critical';
}

interface ReceiptRecord {
  id: string;
  type: 'Health-RDS' | 'Consent-RDS' | 'Vault-RDS';
  action: string;
  result: 'allow' | 'deny';
  timestamp: string;
  anchorRef?: string;
  reasons: string[];
}

export function HealthQADashboard() {
  const { toast } = useToast();
  const [selectedMetric, setSelectedMetric] = useState<string>('');
  const [filteredReceipts, setFilteredReceipts] = useState<ReceiptRecord[]>([]);
  const [outcomeFilter, setOutcomeFilter] = useState<string>('all');

  // Mock health QA metrics
  const metrics: HealthMetric[] = [
    {
      id: 'first_pass_auth',
      name: 'First-Pass Authorization Rate',
      value: 87.3,
      unit: '%',
      trend: 'up',
      target: 90,
      status: 'good'
    },
    {
      id: 'appeal_time',
      name: 'Average Appeal Processing Time',
      value: 14.2,
      unit: 'days',
      trend: 'down',
      target: 10,
      status: 'needs_improvement'
    },
    {
      id: 'screening_ontime',
      name: 'Screening On-Time Rate',
      value: 92.1,
      unit: '%',
      trend: 'stable',
      target: 95,
      status: 'good'
    },
    {
      id: 'consent_freshness',
      name: 'Consent Freshness Score',
      value: 0.94,
      unit: 'score',
      trend: 'up',
      target: 0.9,
      status: 'excellent'
    }
  ];

  // Mock receipt records
  const allReceipts: ReceiptRecord[] = [
    {
      id: 'receipt_001',
      type: 'Health-RDS',
      action: 'prior_authorization',
      result: 'allow',
      timestamp: '2024-08-21T10:30:00Z',
      anchorRef: '0xabc123...',
      reasons: ['medical_necessity_met', 'in_network_provider']
    },
    {
      id: 'receipt_002',
      type: 'Health-RDS',
      action: 'screening_approval',
      result: 'deny',
      timestamp: '2024-08-21T09:15:00Z',
      anchorRef: '0xdef456...',
      reasons: ['out_of_network_provider', 'coverage_limitation']
    },
    {
      id: 'receipt_003',
      type: 'Consent-RDS',
      action: 'data_sharing',
      result: 'allow',
      timestamp: '2024-08-21T08:45:00Z',
      anchorRef: '0xghi789...',
      reasons: ['valid_consent', 'scope_appropriate']
    },
    {
      id: 'receipt_004',
      type: 'Vault-RDS',
      action: 'grant',
      result: 'allow',
      timestamp: '2024-08-21T07:20:00Z',
      anchorRef: '0xjkl012...',
      reasons: ['evidence_sealed', 'signers_verified']
    }
  ];

  const handleMetricClick = (metricId: string) => {
    setSelectedMetric(metricId);
    
    // Filter receipts based on metric type
    let filtered: ReceiptRecord[] = [];
    
    switch (metricId) {
      case 'first_pass_auth':
        filtered = allReceipts.filter(r => 
          r.type === 'Health-RDS' && r.action.includes('authorization')
        );
        break;
      case 'appeal_time':
        filtered = allReceipts.filter(r => 
          r.type === 'Health-RDS' && r.action.includes('appeal')
        );
        break;
      case 'screening_ontime':
        filtered = allReceipts.filter(r => 
          r.type === 'Health-RDS' && r.action.includes('screening')
        );
        break;
      case 'consent_freshness':
        filtered = allReceipts.filter(r => r.type === 'Consent-RDS');
        break;
      default:
        filtered = allReceipts;
    }

    // Apply outcome filter
    if (outcomeFilter !== 'all') {
      filtered = filtered.filter(r => r.result === outcomeFilter);
    }

    setFilteredReceipts(filtered);
  };

  const handleExportCSV = () => {
    const csvData = [
      ['Receipt ID', 'Type', 'Action', 'Result', 'Timestamp', 'Anchor Ref', 'Reasons'].join(','),
      ...filteredReceipts.map(receipt => [
        receipt.id,
        receipt.type,
        receipt.action,
        receipt.result,
        receipt.timestamp,
        receipt.anchorRef || '',
        receipt.reasons.join('; ')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `health_qa_receipts_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: `${filteredReceipts.length} receipts exported to CSV with anchor references.`,
    });
  };

  const getMetricStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'good': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'needs_improvement': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      case 'stable': return <span className="h-4 w-4 text-gray-600">→</span>;
      default: return null;
    }
  };

  const getResultColor = (result: string) => {
    return result === 'allow' 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  return (
    <Card className="w-full max-w-7xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Health QA & Performance Dashboard
        </CardTitle>
        <CardDescription>
          Monitor healthcare operations with receipt-based audit trails and performance metrics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <Card 
              key={metric.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleMetricClick(metric.id)}
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      {metric.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">
                        {metric.value}
                        <span className="text-sm font-normal">{metric.unit}</span>
                      </span>
                      {getTrendIcon(metric.trend)}
                    </div>
                    <Badge className={getMetricStatusColor(metric.status)}>
                      {metric.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Target</p>
                    <p className="text-sm font-medium">{metric.target}{metric.unit}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters and Export */}
        {selectedMetric && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="px-3 py-1">
                <Filter className="h-3 w-3 mr-1" />
                {metrics.find(m => m.id === selectedMetric)?.name}
              </Badge>
              
              <Select value={outcomeFilter} onValueChange={setOutcomeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Outcomes</SelectItem>
                  <SelectItem value="allow">Approved</SelectItem>
                  <SelectItem value="deny">Denied</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleExportCSV} disabled={filteredReceipts.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV ({filteredReceipts.length})
            </Button>
          </div>
        )}

        {/* Receipts Table */}
        {filteredReceipts.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Receipt Audit Trail</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Receipt ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Anchor Ref</TableHead>
                  <TableHead>Reasons</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReceipts.map((receipt) => (
                  <TableRow key={receipt.id}>
                    <TableCell className="font-mono text-xs">
                      {receipt.id}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{receipt.type}</Badge>
                    </TableCell>
                    <TableCell>{receipt.action}</TableCell>
                    <TableCell>
                      <Badge className={getResultColor(receipt.result)}>
                        {receipt.result}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">
                      {new Date(receipt.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {receipt.anchorRef ? (
                        <span className="text-blue-600">
                          {receipt.anchorRef.substring(0, 12)}...
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {receipt.reasons.slice(0, 2).map((reason, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {reason}
                          </Badge>
                        ))}
                        {receipt.reasons.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{receipt.reasons.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {selectedMetric && filteredReceipts.length === 0 && (
          <div className="text-center py-8">
            <FileCheck className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium">No receipts found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters or selecting a different metric
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}