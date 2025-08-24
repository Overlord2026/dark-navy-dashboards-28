import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserCheck, 
  Route, 
  FileText, 
  Calendar, 
  Shield,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import ToolGate from '@/components/ToolGate';
import { ToolDisclaimer } from '@/components/tools/ToolDisclaimer';
import { LoadDemoButton } from '@/components/tools/LoadDemoButton';
import { toast } from 'sonner';
import { analytics } from '@/lib/analytics';

// Demo seeders
import seedLeads from '@/tools/seeds/leads';
import seedOnboarding from '@/tools/seeds/onboarding';
import seedRoadmap from '@/tools/seeds/roadmap';
import seedProposalReport from '@/tools/seeds/proposal-report';
import seedEngagementTracker from '@/tools/seeds/engagement-tracker';
import seedSupervisorDashboard from '@/tools/seeds/supervisor-dashboard';

const quickActions = [
  {
    id: 'add-lead',
    title: 'Add Lead',
    description: 'Capture new prospect information',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    toolKey: 'leads',
    seeder: seedLeads
  },
  {
    id: 'onboard-client',
    title: 'Onboard Client',
    description: 'Complete client onboarding process',
    icon: UserCheck,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    toolKey: 'onboarding',
    seeder: seedOnboarding
  },
  {
    id: 'run-roadmap',
    title: 'Run Roadmap',
    description: 'Create comprehensive financial plan',
    icon: Route,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    toolKey: 'roadmap',
    seeder: seedRoadmap
  },
  {
    id: 'create-proposal',
    title: 'Create Proposal & Report',
    description: 'Generate client proposals and reports',
    icon: FileText,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    toolKey: 'proposal-report',
    seeder: seedProposalReport
  },
  {
    id: 'engagement-tracker',
    title: 'Open Engagement Tracker',
    description: 'Manage client tasks and milestones',
    icon: Calendar,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    toolKey: 'engagement-tracker',
    seeder: seedEngagementTracker
  },
  {
    id: 'supervisor-dashboard',
    title: 'Supervisor Dashboard',
    description: 'Review and approve advisor activities',
    icon: Shield,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    toolKey: 'supervisor-dashboard',
    seeder: seedSupervisorDashboard
  }
];

const metrics = [
  {
    title: 'Active Leads',
    value: '12',
    change: '+3 this week',
    icon: Users,
    color: 'text-blue-600'
  },
  {
    title: 'Clients Onboarded',
    value: '8',
    change: '+2 this month',
    icon: UserCheck,
    color: 'text-green-600'
  },
  {
    title: 'Plans Created',
    value: '15',
    change: '+5 this quarter',
    icon: Route,
    color: 'text-purple-600'
  },
  {
    title: 'AUM Growth',
    value: '12.3%',
    change: 'vs last quarter',
    icon: TrendingUp,
    color: 'text-orange-600'
  }
];

const recentActivity = [
  {
    id: 1,
    type: 'lead',
    message: 'New lead added: Sarah & Michael Chen',
    time: '2 hours ago',
    status: 'success',
    icon: CheckCircle2
  },
  {
    id: 2,
    type: 'proposal',
    message: 'Proposal generated for Thompson family',
    time: '4 hours ago',
    status: 'success',
    icon: CheckCircle2
  },
  {
    id: 3,
    type: 'task',
    message: 'Portfolio review due for Martinez account',
    time: '1 day ago',
    status: 'pending',
    icon: Clock
  },
  {
    id: 4,
    type: 'review',
    message: 'Supervisor review required for Chen proposal',
    time: '2 days ago',
    status: 'warning',
    icon: AlertTriangle
  }
];

export default function AdvisorHomePage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleLoadDemo = async (action: any) => {
    setLoading(action.id);
    try {
      await action.seeder();
      toast.success(`${action.title} demo data loaded (Proof added)`);
      analytics.track('advisor.tool.demo.loaded', { toolKey: action.toolKey });
    } catch (error) {
      toast.error(`Failed to load ${action.title} demo data`);
    } finally {
      setLoading(null);
    }
  };

  const handleLoadAllDemos = async () => {
    setLoading('all');
    try {
      for (const action of quickActions) {
        await action.seeder();
      }
      toast.success('All advisor demo data loaded successfully!');
      analytics.track('advisor.demo.load_all');
    } catch (error) {
      toast.error('Failed to load some demo data');
    } finally {
      setLoading(null);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Advisor Dashboard</h1>
            <p className="text-muted-foreground">Manage your practice and client relationships</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              Practice Management
            </Badge>
            <Button 
              onClick={handleLoadAllDemos}
              disabled={loading === 'all'}
              variant="outline"
              className="focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              {loading === 'all' ? 'Loading...' : 'Load All Demos'}
            </Button>
          </div>
        </div>

        {/* Disclaimers */}
        <div className="grid md:grid-cols-2 gap-4">
          <ToolDisclaimer type="general" />
          <Card className="bg-amber-50 border-amber-200 text-amber-800">
            <CardContent className="p-3">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Demo Data Notice</p>
                  <p className="text-xs">No client PII. For planning purposes; not a solicitation.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{metric.title}</p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <p className="text-xs text-muted-foreground">{metric.change}</p>
                  </div>
                  <metric.icon className={`h-8 w-8 ${metric.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <p className="text-sm text-muted-foreground">
              Start your advisor workflow - each action generates Proof Slips for compliance tracking
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickActions.map((action) => (
                <Card key={action.id} className="hover:shadow-md transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex flex-col space-y-3">
                      <div className={`w-12 h-12 ${action.bgColor} rounded-lg flex items-center justify-center`}>
                        <action.icon className={`w-6 h-6 ${action.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold">{action.title}</h3>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <ToolGate toolKey={action.toolKey}>
                          {({ onClick }) => (
                            <Button 
                              onClick={onClick}
                              size="sm" 
                              className="focus-visible:ring-2 focus-visible:ring-cyan-400"
                            >
                              Open Tool
                            </Button>
                          )}
                        </ToolGate>
                        <LoadDemoButton
                          toolKey={action.toolKey}
                          onLoadDemo={() => handleLoadDemo(action)}
                          loading={loading === action.id}
                          className="text-xs"
                          hasData={false}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <item.icon className={`w-5 h-5 ${
                      item.status === 'success' ? 'text-green-600' : 
                      item.status === 'warning' ? 'text-amber-600' : 
                      'text-blue-600'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.message}</p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Compliance & Receipts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Proof Slips Generated</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    All advisor actions generate compliance-ready Proof Slips for audit trails
                  </p>
                  <Button variant="outline" size="sm" className="focus-visible:ring-2 focus-visible:ring-cyan-400">
                    View Receipts
                  </Button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Export Options</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    CSV summaries and Evidence ZIP packages available for all tools
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="focus-visible:ring-2 focus-visible:ring-cyan-400">
                      Export CSV
                    </Button>
                    <Button variant="outline" size="sm" className="focus-visible:ring-2 focus-visible:ring-cyan-400">
                      Export ZIP
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}