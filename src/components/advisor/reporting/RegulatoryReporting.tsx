import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  FileText, 
  Download, 
  Calendar as CalendarIcon,
  TrendingUp,
  Users,
  DollarSign,
  Shield,
  AlertTriangle,
  Clock,
  CheckCircle,
  Send,
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RegulatoryReport {
  id: string;
  type: 'form_adv' | 'form_crs' | 'form_u4' | 'state_filing' | 'sec_filing' | 'finra_report';
  title: string;
  description: string;
  frequency: 'annual' | 'quarterly' | 'monthly' | 'as_needed';
  next_due: Date;
  last_filed?: Date;
  status: 'current' | 'due_soon' | 'overdue' | 'filing_required';
  regulatory_body: string;
  estimated_hours: number;
  auto_generate: boolean;
  template_available: boolean;
}

interface FilingHistory {
  id: string;
  report_type: string;
  filed_date: Date;
  filing_period: string;
  status: 'filed' | 'accepted' | 'rejected' | 'pending';
  filing_number?: string;
  notes: string;
}

interface ComplianceMetric {
  metric: string;
  current_value: number;
  previous_value: number;
  trend: 'up' | 'down' | 'stable';
  status: 'compliant' | 'warning' | 'non_compliant';
}

export const RegulatoryReporting: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reports, setReports] = useState<RegulatoryReport[]>([]);
  const [filingHistory, setFilingHistory] = useState<FilingHistory[]>([]);
  const [metrics, setMetrics] = useState<ComplianceMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<Date>(new Date());
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadRegulatoryData();
    }
  }, [user]);

  const loadRegulatoryData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      // Mock regulatory reports data
      const mockReports: RegulatoryReport[] = [
        {
          id: '1',
          type: 'form_adv',
          title: 'Form ADV Annual Update',
          description: 'Annual amendment to Form ADV required within 90 days of fiscal year end',
          frequency: 'annual',
          next_due: new Date('2024-03-31'),
          last_filed: new Date('2023-03-15'),
          status: 'due_soon',
          regulatory_body: 'SEC',
          estimated_hours: 8,
          auto_generate: true,
          template_available: true
        },
        {
          id: '2',
          type: 'form_crs',
          title: 'Form CRS Update',
          description: 'Client relationship summary must be updated when material changes occur',
          frequency: 'as_needed',
          next_due: new Date('2024-06-30'),
          last_filed: new Date('2023-12-01'),
          status: 'current',
          regulatory_body: 'SEC',
          estimated_hours: 4,
          auto_generate: false,
          template_available: true
        },
        {
          id: '3',
          type: 'state_filing',
          title: 'State Registration Renewal',
          description: 'Annual renewal of investment adviser registration with state securities commission',
          frequency: 'annual',
          next_due: new Date('2024-02-28'),
          status: 'overdue',
          regulatory_body: 'State Securities Commission',
          estimated_hours: 6,
          auto_generate: false,
          template_available: false
        }
      ];

      const mockHistory: FilingHistory[] = [
        {
          id: '1',
          report_type: 'Form ADV',
          filed_date: new Date('2023-03-15'),
          filing_period: '2023',
          status: 'accepted',
          filing_number: 'ADV-2023-12345',
          notes: 'Filed on time, no deficiencies noted'
        },
        {
          id: '2',
          report_type: 'Form CRS',
          filed_date: new Date('2023-12-01'),
          filing_period: 'Q4 2023',
          status: 'accepted',
          filing_number: 'CRS-2023-67890',
          notes: 'Updated fee schedule disclosure'
        }
      ];

      const mockMetrics: ComplianceMetric[] = [
        {
          metric: 'Assets Under Management',
          current_value: 125000000,
          previous_value: 118000000,
          trend: 'up',
          status: 'compliant'
        },
        {
          metric: 'Number of Clients',
          current_value: 287,
          previous_value: 275,
          trend: 'up',
          status: 'compliant'
        },
        {
          metric: 'Average Client Account Value',
          current_value: 435000,
          previous_value: 429000,
          trend: 'up',
          status: 'compliant'
        },
        {
          metric: 'Regulatory Capital Ratio',
          current_value: 15.2,
          previous_value: 14.8,
          trend: 'up',
          status: 'compliant'
        }
      ];

      setReports(mockReports);
      setFilingHistory(mockHistory);
      setMetrics(mockMetrics);

    } catch (error) {
      console.error('Error loading regulatory data:', error);
      toast({
        title: "Error",
        description: "Failed to load regulatory data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateReport = async (reportId: string) => {
    try {
      setGeneratingReport(reportId);
      
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const report = reports.find(r => r.id === reportId);
      if (report) {
        toast({
          title: "Report Generated",
          description: `${report.title} has been generated successfully`,
        });
      }

    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive"
      });
    } finally {
      setGeneratingReport(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'current':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'due_soon':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'filing_required':
        return <Send className="h-4 w-4 text-blue-600" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current':
        return 'bg-green-100 text-green-800';
      case 'due_soon':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'filing_required':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-600" />;
      case 'down':
        return <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />;
      default:
        return <div className="h-3 w-3 bg-gray-400 rounded-full" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Regulatory Reporting</h1>
          <p className="text-muted-foreground">Manage SEC, FINRA, and state regulatory filings</p>
        </div>
        <Button onClick={loadRegulatoryData}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-muted-foreground">Overdue</span>
            </div>
            <div className="text-2xl font-bold">
              {reports.filter(r => r.status === 'overdue').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-muted-foreground">Due Soon</span>
            </div>
            <div className="text-2xl font-bold">
              {reports.filter(r => r.status === 'due_soon').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-muted-foreground">Current</span>
            </div>
            <div className="text-2xl font-bold">
              {reports.filter(r => r.status === 'current').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-muted-foreground">Total Reports</span>
            </div>
            <div className="text-2xl font-bold">{reports.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="reports" className="w-full">
        <TabsList>
          <TabsTrigger value="reports">Required Reports</TabsTrigger>
          <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
          <TabsTrigger value="history">Filing History</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4">
          <div className="space-y-4">
            {reports.map((report) => (
              <Card key={report.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(report.status)}
                        <h3 className="font-semibold">{report.title}</h3>
                        <Badge className={getStatusColor(report.status)}>
                          {report.status.replace(/_/g, ' ')}
                        </Badge>
                        {report.auto_generate && (
                          <Badge variant="outline">Auto-Generate</Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground">{report.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>Due: {format(report.next_due, 'MMM dd, yyyy')}</span>
                        <span>•</span>
                        <span>{report.regulatory_body}</span>
                        <span>•</span>
                        <span>{report.frequency}</span>
                        <span>•</span>
                        <span>~{report.estimated_hours}h</span>
                      </div>
                      {report.last_filed && (
                        <div className="text-sm text-muted-foreground">
                          Last filed: {format(report.last_filed, 'MMM dd, yyyy')}
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => generateReport(report.id)}
                        disabled={generatingReport === report.id}
                      >
                        {generatingReport === report.id ? (
                          <RefreshCw className="h-3 w-3 animate-spin" />
                        ) : (
                          <Download className="h-3 w-3" />
                        )}
                      </Button>
                      <Button size="sm">
                        <Send className="h-3 w-3 mr-1" />
                        File
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Key Regulatory Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {metrics.map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{metric.metric}</span>
                      <div className="flex items-center space-x-1">
                        {getTrendIcon(metric.trend)}
                        <Badge className={
                          metric.status === 'compliant' ? 'bg-green-100 text-green-800' :
                          metric.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }>
                          {metric.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-2xl font-bold">
                      {metric.metric.includes('$') || metric.metric.includes('Value') ? 
                        `$${metric.current_value.toLocaleString()}` : 
                        metric.metric.includes('Ratio') ?
                        `${metric.current_value}%` :
                        metric.current_value.toLocaleString()
                      }
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Previous: {
                        metric.metric.includes('$') || metric.metric.includes('Value') ? 
                        `$${metric.previous_value.toLocaleString()}` : 
                        metric.metric.includes('Ratio') ?
                        `${metric.previous_value}%` :
                        metric.previous_value.toLocaleString()
                      }
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Filing History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filingHistory.map((filing) => (
                  <div key={filing.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="font-medium">{filing.report_type}</div>
                      <div className="text-sm text-muted-foreground">
                        Filed: {format(filing.filed_date, 'MMM dd, yyyy')} • Period: {filing.filing_period}
                      </div>
                      {filing.filing_number && (
                        <div className="text-xs text-muted-foreground">
                          Filing #: {filing.filing_number}
                        </div>
                      )}
                      {filing.notes && (
                        <div className="text-xs text-muted-foreground">{filing.notes}</div>
                      )}
                    </div>
                    <Badge className={
                      filing.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      filing.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      filing.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }>
                      {filing.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Regulatory Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Interactive regulatory calendar coming soon. 
                <br />
                View all upcoming filing deadlines and compliance requirements.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};