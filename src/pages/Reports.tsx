import React, { useState, useMemo, useCallback } from "react";
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
  TrendingUp
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { GenerateReportModal } from "@/components/reports/GenerateReportModal";
import { ReportsErrorBoundary } from "@/components/reports/ReportsErrorBoundary";
import { ReportsPerformanceMonitor } from "@/components/debug/ReportsPerformanceMonitor";
import { useReports } from "@/hooks/useReports";
import { MobileResponsiveTable } from "@/components/ui/responsive-chart";
import { 
  ReportsHeaderSkeleton,
  ReportsBadgesSkeleton,
  ReportsTabsSkeleton,
  EmptyReportsStateSkeleton
} from "@/components/ui/skeletons/ReportsSkeletons";

const Reports = () => {
  const {
    reports,
    userProfile,
    loading,
    generating,
    availableReportTypes,
    apiCallsCount,
    generateReport,
    downloadReport,
    getReportTypeLabel,
    getFilteredReports,
    loadingStates
  } = useReports();

  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // Memoized handlers
  const handleGenerateReport = useCallback(async (reportType: string, format: 'pdf' | 'csv') => {
    await generateReport(reportType, format);
    setShowGenerateModal(false);
  }, [generateReport]);

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
  }, []);

  // Memoized filtered reports
  const filteredReports = useMemo(() => getFilteredReports(activeTab), [getFilteredReports, activeTab]);

  // Memoized report type icon
  const getReportTypeIcon = useCallback((type: string) => {
    const reportType = availableReportTypes.find(rt => rt.key === type);
    const IconComponent = reportType?.icon || FileText;
    return <IconComponent className="h-4 w-4" />;
  }, [availableReportTypes]);

  if (loading) {
    return (
      <ThreeColumnLayout title="Reports">
        <ReportsErrorBoundary>
          <div className="p-6 space-y-6">
            <ReportsHeaderSkeleton />
            <ReportsBadgesSkeleton />
            <ReportsTabsSkeleton />
          </div>
        </ReportsErrorBoundary>
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

  return (
    <ThreeColumnLayout title="Reports">
      <ReportsErrorBoundary>
        <div className="p-6 space-y-6">
          {/* Performance Monitor - Dev Only */}
          {process.env.NODE_ENV === 'development' && (
            <ReportsPerformanceMonitor
              reportCount={reports.length}
              loadingStates={loadingStates}
              apiCallsCount={apiCallsCount}
            />
          )}

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
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
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
                    <EmptyReportsStateSkeleton />
                  ) : (
                    <MobileResponsiveTable>
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
                                  onClick={() => downloadReport(report)}
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
                    </MobileResponsiveTable>
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
      </ReportsErrorBoundary>
    </ThreeColumnLayout>
  );
};

export default Reports;