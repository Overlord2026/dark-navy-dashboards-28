import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useImpactReporting } from "@/hooks/useImpactReporting";
import { ImpactReportCard } from "@/components/giving/ImpactReportCard";
import { MilestoneCard } from "@/components/giving/MilestoneCard";
import { NetworkImpactDashboard } from "@/components/giving/NetworkImpactDashboard";
import { ImpactPreferencesComponent } from "@/components/giving/ImpactPreferences";
import { FileText, TrendingUp, Trophy, Settings, Plus, Mail } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { hasRoleAccess } from "@/utils/roleHierarchy";

export default function ImpactReportsPage() {
  const { user } = useAuth();
  const {
    reports,
    milestones,
    preferences,
    networkSummary,
    loading,
    uncelebratedMilestones,
    currentYearReports,
    generateReport,
    updatePreferences,
    celebrateMilestone,
  } = useImpactReporting();

  const [generatingReport, setGeneratingReport] = useState<string | null>(null);

  const isAdmin = user && hasRoleAccess(user?.role, ['admin', 'tenant_admin']);

  const handleGenerateReport = async (type: 'quarterly' | 'annual') => {
    setGeneratingReport(type);
    try {
      await generateReport(type);
    } finally {
      setGeneratingReport(null);
    }
  };

  const handleDownloadReport = (reportId: string) => {
    // TODO: Implement report download functionality
    console.log('Download report:', reportId);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Impact Reports</h1>
          <p className="text-muted-foreground">Track your giving impact and community contributions</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your impact data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Impact Reports</h1>
        <p className="text-muted-foreground">Track your giving impact and community contributions</p>
      </div>
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reports.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Year</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentYearReports.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Milestones</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{milestones.length}</div>
              {uncelebratedMilestones.length > 0 && (
                <Badge variant="secondary" className="mt-1">
                  {uncelebratedMilestones.length} new!
                </Badge>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Notifications</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {preferences?.email_notifications ? 'Enabled' : 'Disabled'}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="reports" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="reports">My Reports</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="network">Community Impact</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Your Impact Reports</h2>
                <p className="text-muted-foreground">
                  View and download your quarterly and annual giving reports
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleGenerateReport('quarterly')}
                  disabled={generatingReport === 'quarterly'}
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {generatingReport === 'quarterly' ? 'Generating...' : 'Generate Quarterly'}
                </Button>
                <Button
                  onClick={() => handleGenerateReport('annual')}
                  disabled={generatingReport === 'annual'}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {generatingReport === 'annual' ? 'Generating...' : 'Generate Annual'}
                </Button>
              </div>
            </div>

            {reports.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>No Reports Yet</CardTitle>
                  <CardDescription>
                    Generate your first impact report to see your giving history and milestones.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => handleGenerateReport('annual')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Generate Your First Report
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {reports.map((report) => (
                  <ImpactReportCard
                    key={report.id}
                    report={report}
                    onDownload={handleDownloadReport}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="milestones" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Your Milestones</h2>
              <p className="text-muted-foreground">
                Celebrate your giving achievements and track your impact journey
              </p>
            </div>

            {milestones.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>No Milestones Yet</CardTitle>
                  <CardDescription>
                    Start your giving journey to unlock achievements and milestones.
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : (
              <div className="space-y-4">
                {uncelebratedMilestones.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-primary" />
                      New Achievements
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {uncelebratedMilestones.map((milestone) => (
                        <MilestoneCard
                          key={milestone.id}
                          milestone={milestone}
                          onCelebrate={celebrateMilestone}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold mb-4">All Milestones</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {milestones.map((milestone) => (
                      <MilestoneCard
                        key={milestone.id}
                        milestone={milestone}
                        onCelebrate={celebrateMilestone}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="network" className="space-y-6">
            <NetworkImpactDashboard
              networkData={networkSummary}
              isAdmin={isAdmin}
            />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            {preferences && (
              <ImpactPreferencesComponent
                preferences={preferences}
                onUpdate={updatePreferences}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}