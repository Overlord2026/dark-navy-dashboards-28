import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  TrendingUp, 
  FileText, 
  Calendar, 
  DollarSign,
  Award,
  Upload,
  Share,
  Bell,
  Settings,
  Target,
  BarChart3,
  Shield,
  Clock
} from 'lucide-react';
import { getProfessionalSegmentConfig, getDefaultSegmentForRole } from '@/utils/professionalSegments';
import { ProfessionalSegment } from '@/types/professional';
import { UserRole } from '@/utils/roleHierarchy';

interface SegmentDashboardProps {
  userRole: UserRole;
  segment?: ProfessionalSegment;
}

export function SegmentDashboard({ userRole, segment }: SegmentDashboardProps) {
  const [selectedSegment, setSelectedSegment] = useState<ProfessionalSegment | null>(
    segment || getDefaultSegmentForRole(userRole)
  );
  const [dashboardData, setDashboardData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const config = selectedSegment ? getProfessionalSegmentConfig(selectedSegment) : null;

  useEffect(() => {
    if (selectedSegment) {
      fetchDashboardData();
    }
  }, [selectedSegment]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Mock data for demonstration - in real implementation, fetch from Supabase
      const mockData = {
        clients: Math.floor(Math.random() * 50) + 10,
        revenue: Math.floor(Math.random() * 500000) + 100000,
        referrals: Math.floor(Math.random() * 20) + 5,
        satisfaction: Math.floor(Math.random() * 20) + 80,
        documents: Math.floor(Math.random() * 100) + 20,
        meetings: Math.floor(Math.random() * 30) + 10,
        compliance: Math.floor(Math.random() * 20) + 80,
        growth: Math.floor(Math.random() * 50) + 10
      };
      setDashboardData(mockData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!config) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No dashboard configuration found for this role.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderWidget = (widgetType: string) => {
    switch (widgetType) {
      case 'client_overview':
        return (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.clients || 0}</div>
              <p className="text-xs text-muted-foreground">
                +{dashboardData.growth || 0}% from last month
              </p>
            </CardContent>
          </Card>
        );

      case 'aum_tracking':
      case 'portfolio_analytics':
        return (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assets Under Management</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(dashboardData.revenue || 0).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Total AUM across all clients
              </p>
            </CardContent>
          </Card>
        );

      case 'referral_pipeline':
      case 'referral_network':
        return (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Referrals</CardTitle>
              <Share className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.referrals || 0}</div>
              <p className="text-xs text-muted-foreground">
                Active referral relationships
              </p>
            </CardContent>
          </Card>
        );

      case 'compliance_dashboard':
      case 'compliance_tracker':
        return (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.compliance || 0}%</div>
              <Progress value={dashboardData.compliance || 0} className="mt-2" />
            </CardContent>
          </Card>
        );

      case 'performance_metrics':
        return (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Client Satisfaction</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.satisfaction || 0}%</div>
              <p className="text-xs text-muted-foreground">
                Average client satisfaction score
              </p>
            </CardContent>
          </Card>
        );

      case 'document_vault':
      case 'document_portal':
        return (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Documents</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.documents || 0}</div>
              <p className="text-xs text-muted-foreground">
                Secure documents managed
              </p>
            </CardContent>
          </Card>
        );

      case 'meeting_scheduler':
        return (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Meetings This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.meetings || 0}</div>
              <p className="text-xs text-muted-foreground">
                Scheduled and completed
              </p>
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium capitalize">
                {widgetType.replace(/_/g, ' ')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">Widget coming soon</p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold capitalize">
            {selectedSegment?.replace(/_/g, ' ')} Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your practice and track performance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Upload Resources
          </Button>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="referrals">Referrals</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {config.widgets.slice(0, 4).map((widget, index) => (
              <div key={index}>
                {renderWidget(widget)}
              </div>
            ))}
          </div>

          {/* Secondary Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {config.widgets.slice(4, 7).map((widget, index) => (
              <div key={index}>
                {renderWidget(widget)}
              </div>
            ))}
          </div>

          {/* Onboarding Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Onboarding Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {config.onboarding_steps.map((step, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{step.replace(/_/g, ' ')}</span>
                    <Badge variant={index < 3 ? "default" : "secondary"}>
                      {index < 3 ? "Complete" : "Pending"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Client Portal Coming Soon</h3>
                <p className="text-muted-foreground">
                  Manage client relationships, track interactions, and monitor engagement.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="referrals" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Referral Network</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Financial Advisors</p>
                        <p className="text-sm text-muted-foreground">12 active connections</p>
                      </div>
                    </div>
                    <Badge>Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <FileText className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Estate Attorneys</p>
                        <p className="text-sm text-muted-foreground">8 active connections</p>
                      </div>
                    </div>
                    <Badge>Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Referral Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      ${(dashboardData.revenue * 0.1 || 0).toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground">Year to date</p>
                  </div>
                  <Button className="w-full">
                    <DollarSign className="w-4 h-4 mr-2" />
                    View Payout Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {config.compliance_requirements.map((requirement, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium capitalize">{requirement.replace(/_/g, ' ')}</p>
                        <p className="text-sm text-muted-foreground">Current and up to date</p>
                      </div>
                    </div>
                    <Badge variant="default">Compliant</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Education Library</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Industry Best Practices Guide
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Performance Benchmarks 2024
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Clock className="w-4 h-4 mr-2" />
                    Compliance Updates
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upload Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Share your expertise with the network
                  </p>
                  <Button className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Training Material
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Share className="w-4 h-4 mr-2" />
                    Share Best Practice
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}