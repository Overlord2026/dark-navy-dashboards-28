import React, { useState, useEffect } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  FileText, 
  Download, 
  Plus, 
  Calendar,
  Filter,
  TrendingUp,
  Archive,
  DollarSign,
  Target
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { formatDistanceToNow } from "date-fns";
import { GenerateReportModal } from "@/components/reports/GenerateReportModal";

interface Report {
  id: string;
  user_id: string;
  role: string;
  report_type: string;
  format: string;
  download_url: string;
  generated_at: string;
  metadata: any;
}

interface UserProfile {
  id: string;
  role: string;
  first_name?: string;
  last_name?: string;
}

const Reports = () => {
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // Role-based report types mapping
  const getAvailableReportTypes = (role: string) => {
    const roleReportMap: Record<string, Array<{key: string, label: string, description: string, icon: any, roles: string[]}>> = {
      client: [
        { key: 'net_worth', label: 'Net Worth', description: 'Complete financial overview', icon: DollarSign, roles: ['client'] },
        { key: 'income_roadmap', label: 'Income Roadmap', description: 'Income planning and projections', icon: TrendingUp, roles: ['client'] },
        { key: 'vault_activity', label: 'Vault Activity', description: 'Document access logs', icon: Archive, roles: ['client'] }
      ],
      advisor: [
        { key: 'client_summary', label: 'Client Summary', description: 'Overview of all client portfolios', icon: FileText, roles: ['advisor'] },
        { key: 'deliverables_due', label: 'Deliverables Due', description: 'Upcoming client deliverables', icon: Calendar, roles: ['advisor'] },
        { key: 'vault_analytics', label: 'Vault Analytics', description: 'Document usage analytics', icon: Archive, roles: ['advisor'] }
      ],
      accountant: [
        { key: 'tax_uploads', label: 'Tax Uploads', description: 'Tax document management', icon: FileText, roles: ['accountant'] },
        { key: 'report_export', label: 'Report Export', description: 'Comprehensive data export', icon: Download, roles: ['accountant'] }
      ],
      attorney: [
        { key: 'estate_docs', label: 'Estate Documents', description: 'Estate planning documentation', icon: FileText, roles: ['attorney'] },
        { key: 'legal_history', label: 'Legal History', description: 'Legal document history', icon: Archive, roles: ['attorney'] }
      ],
      admin: [
        { key: 'audit_log', label: 'Audit Log', description: 'System audit trail', icon: FileText, roles: ['admin'] },
        { key: 'subscription_summary', label: 'Subscription Summary', description: 'User subscription overview', icon: DollarSign, roles: ['admin'] },
        { key: 'system_snapshot', label: 'System Snapshot', description: 'Complete system overview', icon: Archive, roles: ['admin'] }
      ],
      tenant_admin: [
        { key: 'audit_log', label: 'Audit Log', description: 'System audit trail', icon: FileText, roles: ['tenant_admin'] },
        { key: 'subscription_summary', label: 'Subscription Summary', description: 'User subscription overview', icon: DollarSign, roles: ['tenant_admin'] },
        { key: 'system_snapshot', label: 'System Snapshot', description: 'Complete system overview', icon: Archive, roles: ['tenant_admin'] }
      ],
      system_administrator: [
        { key: 'audit_log', label: 'Audit Log', description: 'System audit trail', icon: FileText, roles: ['system_administrator'] },
        { key: 'subscription_summary', label: 'Subscription Summary', description: 'User subscription overview', icon: DollarSign, roles: ['system_administrator'] },
        { key: 'system_snapshot', label: 'System Snapshot', description: 'Complete system overview', icon: Archive, roles: ['system_administrator'] }
      ]
    };

    return roleReportMap[role] || [];
  };

  useEffect(() => {
    loadUserProfile();
    loadReports();
  }, []);

  const loadUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to access reports",
          variant: "destructive"
        });
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, role, first_name, last_name')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Profile fetch error:', error);
        toast({
          title: "Error",
          description: "Failed to load user profile",
          variant: "destructive"
        });
        return;
      }

      setUserProfile(profile);
    } catch (error) {
      console.error('User profile error:', error);
    }
  };

  const loadReports = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: reportsData, error } = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', user.id)
        .order('generated_at', { ascending: false });

      if (error) {
        console.error('Reports fetch error:', error);
        toast({
          title: "Error",
          description: "Failed to load reports",
          variant: "destructive"
        });
        return;
      }

      setReports(reportsData || []);
    } catch (error) {
      console.error('Load reports error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async (reportType: string, format: 'pdf' | 'csv') => {
    try {
      setGenerating(true);
      
      const { data, error } = await supabase.functions.invoke('generate_report', {
        body: {
          report_type: reportType,
          format: format,
          filters: {} // Can be extended for advanced filtering
        }
      });

      if (error) {
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Report generation failed');
      }

      toast({
        title: "Report Generated",
        description: "Your report has been generated successfully",
      });

      // Refresh reports list
      await loadReports();
      setShowGenerateModal(false);

    } catch (error) {
      console.error('Generate report error:', error);
      toast({
        title: "Generation Failed", 
        description: error instanceof Error ? error.message : "Failed to generate report",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async (report: Report) => {
    try {
      // Open the signed URL in a new tab for download
      window.open(report.download_url, '_blank');
      
      toast({
        title: "Download Started",
        description: "Your report download has started",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download report",
        variant: "destructive"
      });
    }
  };

  const getReportTypeLabel = (type: string) => {
    const reportType = getAvailableReportTypes(userProfile?.role || '')
      .find(rt => rt.key === type);
    return reportType?.label || type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getReportTypeIcon = (type: string) => {
    const reportType = getAvailableReportTypes(userProfile?.role || '')
      .find(rt => rt.key === type);
    const IconComponent = reportType?.icon || FileText;
    return <IconComponent className="h-4 w-4" />;
  };

  const filteredReports = activeTab === "all" 
    ? reports 
    : reports.filter(report => report.report_type === activeTab);

  if (loading) {
    return (
      <ThreeColumnLayout title="Reports">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading reports...</p>
          </div>
        </div>
      </ThreeColumnLayout>
    );
  }

  if (!userProfile) {
    return (
      <ThreeColumnLayout title="Reports">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle className="mb-2">Access Required</CardTitle>
            <CardDescription>
              Please log in to access the reports dashboard.
            </CardDescription>
          </CardContent>
        </Card>
      </ThreeColumnLayout>
    );
  }

  const availableReportTypes = getAvailableReportTypes(userProfile.role);

  return (
    <ThreeColumnLayout title="Reports">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">Reports</h1>
            <p className="text-muted-foreground mt-1">
              Generate and manage your financial reports
            </p>
          </div>
          <Button 
            onClick={() => setShowGenerateModal(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Generate New Report
          </Button>
        </div>

        {/* Role Badge */}
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            Role: {userProfile.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Badge>
          <Badge variant="outline">
            {availableReportTypes.length} Report Types Available
          </Badge>
        </div>

        {/* Report Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              All Reports
            </TabsTrigger>
            {availableReportTypes.slice(0, 4).map((reportType) => (
              <TabsTrigger 
                key={reportType.key} 
                value={reportType.key}
                className="flex items-center gap-2"
              >
                <reportType.icon className="h-4 w-4" />
                <span className="hidden lg:inline">{reportType.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab}>
            {/* Reports Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  {activeTab === "all" ? "All Reports" : getReportTypeLabel(activeTab)}
                </CardTitle>
                <CardDescription>
                  {filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''} found
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredReports.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <CardTitle className="mb-2">No Reports Yet</CardTitle>
                    <CardDescription className="mb-4">
                      Generate your first report to get started with financial insights.
                    </CardDescription>
                    <Button onClick={() => setShowGenerateModal(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead>Format</TableHead>
                          <TableHead>Generated</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredReports.map((report) => (
                          <TableRow key={report.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getReportTypeIcon(report.report_type)}
                                <span className="font-medium">
                                  {getReportTypeLabel(report.report_type)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {report.format.toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                  {formatDistanceToNow(new Date(report.generated_at), { addSuffix: true })}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="text-xs">
                                {report.role}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDownload(report)}
                                className="flex items-center gap-1"
                              >
                                <Download className="h-3 w-3" />
                                Download
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Generate Report Modal */}
        <GenerateReportModal
          open={showGenerateModal}
          onOpenChange={setShowGenerateModal}
          onGenerate={handleGenerateReport}
          availableReportTypes={availableReportTypes}
          generating={generating}
        />
      </div>
    </ThreeColumnLayout>
  );
};

export default Reports;